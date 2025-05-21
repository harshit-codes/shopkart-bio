# 2025-05-20 - Rate Limiting Implementation

## Overview
This document describes the implementation of rate limiting mechanisms for authentication-related operations in ShopKart.bio.

## Issue Description
Users encountered the following error when attempting to sign in or register:
```
Rate limit for the current endpoint has been exceeded. Please try again after some time.
```

This happens because Appwrite implements rate limiting to protect against abuse, brute force attacks, and excessive resource usage.

## Implementation

### 1. Rate Limiting Utility

We implemented a robust rate limiting utility in `/lib/rate-limit.ts` with the following features:

#### Tracking Rate Limits
```typescript
// Rate limit tracking
interface RateLimitTracker {
  [endpoint: string]: {
    attempts: number;
    lastAttempt: number;
    backoffUntil: number;
  };
}

const rateLimits: RateLimitTracker = {};
const globalRateLimitUntil = 0;
```

#### Exponential Backoff
When rate limits are hit, we implement exponential backoff to gradually increase waiting time:
```typescript
const backoffTime = Math.min(
  120000, // Max 2 minutes
  Math.pow(2, rateLimit.attempts) * 1000 // Exponential backoff
);
```

#### Retry Mechanism
The utility includes automatic retry functionality with configurable maximum retries:
```typescript
if (rateLimit.attempts <= maxRetries) {
  console.log(`Rate limit hit for ${endpointName}. Retrying in ${backoffTime / 1000} seconds...`);
  await new Promise(resolve => setTimeout(resolve, backoffTime));
  return withRateLimitRetry(endpointName, fn, maxRetries);
}
```

### 2. Authentication Function Integration

All authentication-related functions were wrapped with the rate limiting utility:

```typescript
export async function signInAccount(user: {
  email: string;
  password: string;
}) {
  return withRateLimitRetry('signInAccount', async () => {
    // Function implementation
  });
}
```

### 3. User Interface Enhancements

#### Rate Limit Status Tracking
The AuthContext was enhanced to track and expose rate limit status:

```typescript
const [rateLimitStatus, setRateLimitStatus] = useState({
  isLimited: false,
  waitTime: 0
});

// Check rate limit status periodically
useEffect(() => {
  const checkRateLimit = () => {
    const isLimited = isRateLimited();
    const waitTime = getRateLimitWaitTime();
    
    setRateLimitStatus({
      isLimited,
      waitTime
    });
  };
  
  // Check immediately
  checkRateLimit();
  
  // Then check every 5 seconds
  const interval = setInterval(checkRateLimit, 5000);
  
  return () => clearInterval(interval);
}, []);
```

#### UI Feedback
The login and registration pages provide clear feedback to users when rate limits are hit:

- Visual countdown timers showing when they can retry
- Clear error messages explaining the rate limiting
- Disabled form inputs during rate limit periods
- Warning banners with remaining wait time

### 4. Error Handling

Enhanced error handling for various rate limit scenarios:
```typescript
if (error?.message?.includes("rate limit") || error?.message?.includes("Rate limit")) {
  setError(`Too many login attempts. Please try again in ${countdown || 30} seconds.`);
}
```

## Benefits

1. **Improved User Experience**: Clear feedback on rate limits instead of cryptic error messages
2. **Reduced API Strain**: Automatic backoff prevents hammering the API during rate limit periods
3. **Security**: Helps mitigate brute force attacks while maintaining usability
4. **Reliability**: Gracefully handles temporary service limitations

## Potential Improvements

1. **Server-side rate limiting**: Implementing server-side rate limiting with Redis for distributed apps
2. **User-specific limits**: Different rate limits for different user roles or operations
3. **IP-based limiting**: Additional rate limiting based on IP addresses for enhanced security
4. **Analytics**: Tracking rate limit hits to identify potential abuse patterns

## Related Documentation

- [Appwrite Rate Limiting](https://appwrite.io/docs/advanced/rate-limits)
- [Managing API Rate Limits](https://appwrite.io/docs/advanced/platform/rate-limits)