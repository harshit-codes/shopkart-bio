// Rate limit tracking
interface RateLimitTracker {
  [endpoint: string]: {
    attempts: number;
    lastAttempt: number;
    backoffUntil: number;
  };
}

const rateLimits: RateLimitTracker = {};

// Global rate limit flag for the current endpoint
let globalRateLimitUntil = 0;

// Utility to handle rate limits with exponential backoff
export async function withRateLimitRetry<T>(
  endpointName: string,
  fn: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  // Check if there's a global rate limit
  const now = Date.now();
  if (now < globalRateLimitUntil) {
    const waitTime = Math.ceil((globalRateLimitUntil - now) / 1000);
    throw new Error(`Rate limit for all operations reached. Please try again in ${waitTime} seconds.`);
  }

  // Check if we're in backoff period for this specific endpoint
  const rateLimit = rateLimits[endpointName] || { attempts: 0, lastAttempt: 0, backoffUntil: 0 };

  if (now < rateLimit.backoffUntil) {
    const waitTime = Math.ceil((rateLimit.backoffUntil - now) / 1000);
    throw new Error(`Rate limit reached for ${endpointName}. Please try again in ${waitTime} seconds.`);
  }

  try {
    // Update rate limit tracking
    rateLimits[endpointName] = {
      ...rateLimit,
      attempts: rateLimit.attempts + 1,
      lastAttempt: now
    };

    // Attempt the operation
    const result = await fn();

    // Success - reset attempts
    rateLimits[endpointName] = {
      ...rateLimits[endpointName],
      attempts: 0
    };

    return result;
  } catch (error: any) {
    // Check if it's a rate limit error
    const isRateLimitError = 
      error?.message?.includes('rate limit') || 
      error?.message?.includes('Rate limit') ||
      error?.message?.includes('for the current endpoint has been exceeded') ||
      error?.code === 429 || 
      error?.message?.includes('Too many requests');
    
    if (isRateLimitError) {
      // Exponential backoff
      const backoffTime = Math.min(
        120000, // Max 2 minutes
        Math.pow(2, rateLimit.attempts) * 1000 // Exponential backoff
      );
      
      rateLimits[endpointName] = {
        ...rateLimit,
        backoffUntil: now + backoffTime
      };

      // Also set a global rate limit for severe cases
      if (error?.message?.includes('for the current endpoint has been exceeded')) {
        console.log('Setting global rate limit...');
        globalRateLimitUntil = now + 60000; // 1 minute global cooldown
      }

      // If we have retries left, wait and try again
      if (rateLimit.attempts <= maxRetries) {
        console.log(`Rate limit hit for ${endpointName}. Retrying in ${backoffTime / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, backoffTime));
        return withRateLimitRetry(endpointName, fn, maxRetries);
      }

      console.log(`Rate limit hit for ${endpointName}. Out of retries.`);
      throw new Error(`Operation temporarily unavailable due to rate limiting. Please try again later.`);
    }
    
    // Not a rate limit error
    throw error;
  }
}

// Function to check if we're currently rate limited
export function isRateLimited(endpointName?: string): boolean {
  const now = Date.now();
  
  // Check global rate limit
  if (now < globalRateLimitUntil) {
    return true;
  }
  
  // Check specific endpoint rate limit if provided
  if (endpointName && rateLimits[endpointName]) {
    return now < rateLimits[endpointName].backoffUntil;
  }
  
  return false;
}

// Function to get the wait time in seconds if rate limited
export function getRateLimitWaitTime(endpointName?: string): number {
  const now = Date.now();
  let waitTime = 0;
  
  // Check global rate limit
  if (now < globalRateLimitUntil) {
    waitTime = Math.ceil((globalRateLimitUntil - now) / 1000);
  }
  
  // Check specific endpoint rate limit if provided
  if (endpointName && rateLimits[endpointName] && now < rateLimits[endpointName].backoffUntil) {
    const endpointWaitTime = Math.ceil((rateLimits[endpointName].backoffUntil - now) / 1000);
    waitTime = Math.max(waitTime, endpointWaitTime);
  }
  
  return waitTime;
}