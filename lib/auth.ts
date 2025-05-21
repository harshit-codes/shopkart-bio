import { ID, Query } from 'appwrite';
import { account, appwriteConfig, avatars, databases } from './appwrite';
import { IUser } from '@/types';
import { withRateLimitRetry } from './rate-limit';

// Base URL for the application
const APP_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// Utility to check if a session exists
export async function checkSessionExists() {
  try {
    const session = await account.getSession('current');
    return { exists: true, session };
  } catch (error) {
    return { exists: false, session: null };
  }
}

// SignUp
export async function createUserAccount(user: {
  name: string;
  email: string;
  password: string;
}) {
  return withRateLimitRetry('createUserAccount', async () => {
    try {
      console.log("Creating account for:", user.email);
      
      // Create a new account in Appwrite
      const newAccount = await account.create(
        ID.unique(),
        user.email,
        user.password,
        user.name
      );

      console.log("Account created successfully:", newAccount.$id);

      if (!newAccount) throw new Error("Failed to create account");

      let sessionCreated = false;
      
      try {
        // Try to get the current session
        await account.get();
        console.log("Session already exists, skipping session creation");
        sessionCreated = true; // Existing session is fine too
      } catch (sessionError) {
        try {
          // No session exists, so create one
          console.log("No session found, creating a new session");
          await account.createEmailSession(user.email, user.password);
          sessionCreated = true;
          console.log("Session created successfully");
        } catch (createSessionError) {
          console.error("Failed to create session:", createSessionError);
          // Continue even if session creation fails
        }
      }

      // Get user avatar
      const avatarUrl = avatars.getInitials(user.name);
      console.log("Generated avatar URL");

      // Add a small delay before creating the user document
      await new Promise(resolve => setTimeout(resolve, 1000));

      try {
        // Create user document in database
        console.log("Creating user document in database...");
        const newUser = await saveUserToDB({
          $id: newAccount.$id,
          name: newAccount.name,
          email: newAccount.email,
          imageUrl: avatarUrl,
          username: user.email.split('@')[0],
        });
        
        console.log("User document created successfully:", newUser.$id);
        
        // Add another small delay before returning
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return newUser;
      } catch (dbError) {
        console.error("Error creating user document:", dbError);
        
        // Retry once more with a different approach if first attempt failed
        try {
          console.log("Retrying user document creation with different approach...");
          // Wait a bit longer
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          const userDoc = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            newAccount.$id, // Use account ID directly
            {
              $id: newAccount.$id,
              name: newAccount.name,
              email: newAccount.email,
              imageUrl: avatarUrl,
              username: user.email.split('@')[0],
            },
            // Add permissions for the document - more permissive
            [`read("any")`, `write("any")`, `read("user:${newAccount.$id}")`, `update("user:${newAccount.$id}")`, `delete("user:${newAccount.$id}")`]
          );
          
          console.log("User document created on second attempt:", userDoc.$id);
          return userDoc;
        } catch (retryError) {
          console.error("Retry also failed:", retryError);
        }
        
        // If we failed to create the user document but the account was created,
        // we should still consider this a success and return the account details
        if (newAccount) {
          return {
            $id: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            imageUrl: avatarUrl,
            username: user.email.split('@')[0],
          };
        }
        
        throw dbError;
      }
    } catch (error) {
      console.error("Error in createUserAccount:", error);
      throw error;
    }
  });
}

// Save user to database
export async function saveUserToDB(user: IUser) {
  try {
    console.log("Saving user to database:", user.$id);
    
    // First try with standard permissions
    try {
      const newUser = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        user.$id, // Using the user's Appwrite account ID
        user,
        // Add permissions for the document
        [`read("any")`, `write("user:${user.$id}")`, `read("user:${user.$id}")`, `update("user:${user.$id}")`, `delete("user:${user.$id}")`]
      );
      
      console.log("User saved successfully (first attempt)");
      return newUser;
    } catch (firstAttemptError) {
      console.error("First attempt to save user failed:", firstAttemptError);
      
      // If the first attempt fails, try with more permissive permissions
      try {
        console.log("Trying with more permissive permissions...");
        const newUser = await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.userCollectionId,
          user.$id,
          user,
          // More permissive permissions
          [`read("any")`, `write("any")`]
        );
        
        console.log("User saved successfully (second attempt)");
        return newUser;
      } catch (secondAttemptError) {
        console.error("Second attempt to save user failed:", secondAttemptError);
        
        // If both attempts fail, try one more time without explicit permissions
        console.log("Trying with default permissions...");
        const newUser = await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.userCollectionId,
          user.$id,
          user
        );
        
        console.log("User saved successfully (final attempt)");
        return newUser;
      }
    }
  } catch (error) {
    console.error("All attempts to save user failed:", error);
    throw error;
  }
}

// Sign In
export async function signInAccount(user: {
  email: string;
  password: string;
}) {
  return withRateLimitRetry('signInAccount', async () => {
    try {
      let session;
      
      try {
        // First, check if there's an existing session
        session = await account.getSession('current');
        console.log("Existing session found:", session.$id);
        
        // Check if the session belongs to the same user
        const currentAccount = await account.get();
        if (currentAccount.email !== user.email) {
          console.log("Session exists for a different user. Signing out first...");
          await account.deleteSession('current');
          // Create new session for the current user
          session = await account.createEmailSession(user.email, user.password);
          console.log("Created new session after logout:", session.$id);
        } else {
          console.log("Session exists for the same user, continuing...");
        }
      } catch (sessionError) {
        // No session exists, create a new one
        console.log("No active session, creating a new one");
        session = await account.createEmailSession(user.email, user.password);
        console.log("Created new session:", session.$id);
      }

      return session;
    } catch (error) {
      console.error("Error in signInAccount:", error);
      throw error;
    }
  });
}

// Get current user
export async function getCurrentUser() {
  return withRateLimitRetry('getCurrentUser', async () => {
    try {
      console.log("Getting current user...");
      let currentAccount;
      
      try {
        currentAccount = await account.get();
      } catch (accountError) {
        console.error("Failed to get account:", accountError);
        return null;
      }

      if (!currentAccount) {
        console.log("No current account found");
        return null;
      }

      console.log("Current Account:", currentAccount); // Debug log
      
      // First try to find user by $id
      console.log("Searching for user by ID:", currentAccount.$id);
      let currentUser = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal('$id', currentAccount.$id)]
      );
      
      // If no user found by ID, try by email
      if (!currentUser || currentUser.documents.length === 0) {
        console.log("User not found by ID, trying by email:", currentAccount.email);
        currentUser = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.userCollectionId,
          [Query.equal('email', currentAccount.email)]
        );
      }

      console.log("Current User Query Result:", currentUser); // Debug log

      if (!currentUser || currentUser.documents.length === 0) {
        console.log("User document not found in database");
        
        // If we can't find the user document but we have the account,
        // create the user document automatically
        try {
          console.log("Creating missing user document...");
          const avatarUrl = avatars.getInitials(currentAccount.name);
          
          const newUser = await saveUserToDB({
            $id: currentAccount.$id,
            name: currentAccount.name,
            email: currentAccount.email,
            imageUrl: avatarUrl,
            username: currentAccount.email.split('@')[0],
          });
          
          console.log("Created missing user document:", newUser);
          return newUser;
        } catch (saveError) {
          console.error("Failed to create missing user document:", saveError);
          
          // Second attempt with more relaxed permissions
          try {
            console.log("Attempting to create user with alternative permissions...");
            
            const userDoc = await databases.createDocument(
              appwriteConfig.databaseId,
              appwriteConfig.userCollectionId,
              currentAccount.$id,
              {
                $id: currentAccount.$id,
                name: currentAccount.name,
                email: currentAccount.email,
                imageUrl: avatars.getInitials(currentAccount.name),
                username: currentAccount.email.split('@')[0],
              },
              [`read("any")`, `write("any")`] // More permissive
            );
            
            console.log("Created missing user document on second attempt:", userDoc);
            return userDoc;
          } catch (retryError) {
            console.error("Second attempt also failed:", retryError);
            
            // If we still can't create the document, return a temporary user object
            // so the UI can at least show something
            return {
              $id: currentAccount.$id,
              name: currentAccount.name,
              email: currentAccount.email,
              imageUrl: avatars.getInitials(currentAccount.name),
              username: currentAccount.email.split('@')[0],
            };
          }
        }
      }

      return currentUser.documents[0];
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  });
}

// Sign Out
export async function signOutAccount() {
  return withRateLimitRetry('signOutAccount', async () => {
    try {
      const session = await account.deleteSession('current');
      return session;
    } catch (error) {
      console.error(error);
      throw error;
    }
  });
}

// Storage for rate limiting (in a real app, this would be in Redis or a database)
const resetAttempts: Record<string, { count: number; timestamp: number }> = {};

// Forgot Password - Request Password Reset
export async function requestPasswordReset(email: string) {
  return withRateLimitRetry('requestPasswordReset', async () => {
    try {
      // Basic rate limiting to prevent abuse
      const now = Date.now();
      const attemptKey = email.toLowerCase();
      
      // Check if there are previous attempts
      if (resetAttempts[attemptKey]) {
        const { count, timestamp } = resetAttempts[attemptKey];
        
        // Allow 3 attempts per hour
        if (count >= 3 && now - timestamp < 3600000) {
          throw new Error("Too many password reset attempts. Please try again later.");
        }
        
        // Reset counter if more than an hour has passed
        if (now - timestamp >= 3600000) {
          resetAttempts[attemptKey] = { count: 1, timestamp: now };
        } else {
          // Increment counter
          resetAttempts[attemptKey].count += 1;
        }
      } else {
        // First attempt
        resetAttempts[attemptKey] = { count: 1, timestamp: now };
      }

      // Create a password recovery request
      const result = await account.createRecovery(
        email,
        `${APP_URL}/reset-password`
      );
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  });
}

// Reset Password - Complete Password Reset
export async function resetPassword(
  userId: string,
  secret: string,
  password: string,
  confirmPassword: string
) {
  return withRateLimitRetry('resetPassword', async () => {
    try {
      const result = await account.updateRecovery(
        userId,
        secret,
        password,
        confirmPassword
      );
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  });
}