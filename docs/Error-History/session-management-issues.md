# 2025-05-20 - Session Management Issues

## Error Description
When users try to sign in or register, they encounter the following error:
```
Creation of a session is prohibited when a session is active.
```

This error occurs because Appwrite has a security feature that prevents the creation of a new session when one is already active. This is to prevent session hijacking and other security issues.

## Environment
- Feature: Authentication flow (User login and registration)
- Components: `/lib/auth.ts`, `/context/AuthContext.tsx`, and `/app/login/page.tsx`

## Root Cause
The error is triggered when:

1. A user is already logged in (has an active session)
2. The application attempts to create a new session without first destroying the existing one

This can happen in the following scenarios:

- A user is logged in as User A and tries to log in as User B without logging out first
- A user registers for a new account while already logged in
- A user tries to recover their password while already logged in

## Solution
To fix this issue, we implemented the following changes:

1. **Check for Existing Sessions**: Before creating a new session, we now check if a session already exists:
   ```javascript
   export async function checkSessionExists() {
     try {
       const session = await account.getSession('current');
       return { exists: true, session };
     } catch (error) {
       return { exists: false, session: null };
     }
   }
   ```

2. **Handle Existing Sessions During Registration**:
   ```javascript
   try {
     // Try to get the current session
     await account.get();
     // If we reach here, a session already exists, no need to create a new one
     console.log("Session already exists, skipping session creation");
   } catch (sessionError) {
     // No session exists, so create one
     console.log("No session found, creating a new session");
     await account.createEmailSession(user.email, user.password);
   }
   ```

3. **Handle Existing Sessions During Sign-In**:
   ```javascript
   // Check if already authenticated with the same email
   if (isAuthenticated && user.email === email) {
     console.log("User already authenticated with the same email");
     router.push("/dashboard");
     return;
   }
   ```

4. **Manage Session Switching**:
   ```javascript
   // If the session exists but is for a different user, delete it and create a new one
   const currentAccount = await account.get();
   if (currentAccount.email !== user.email) {
     console.log("Session exists but for a different user. Switching users...");
     await account.deleteSession('current');
     session = await account.createEmailSession(user.email, user.password);
   }
   ```

5. **Provide Clear Error Messages**:
   ```javascript
   if (error?.message?.includes("session is active") || error?.message?.includes("prohibited when a session")) {
     setError("You're already logged in with a different account. Please sign out first.");
   }
   ```

## Prevention
To prevent similar issues in the future:

1. **Session State Management**: Always check for existing sessions before trying to create new ones
2. **Graceful Session Switching**: Implement proper session switching logic to handle users changing accounts
3. **User Feedback**: Provide clear error messages that help users understand what's happening
4. **Testing Edge Cases**: Test authentication flows in various scenarios, including users with existing sessions

## Related
- [Appwrite Session Management Documentation](https://appwrite.io/docs/products/auth/sessions)
- [Previous Auth Issues](./auth-signin-issues.md)