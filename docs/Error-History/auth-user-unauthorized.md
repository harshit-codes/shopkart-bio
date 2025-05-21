# 2025-05-20 - User Authorization Error During Signup

## Error Description
During the user registration process, when a new user tries to sign up, the application encounters the following error:
```
The current user is not authorized to perform the requested action.
```

This happens when trying to create a new document in the users collection after successful account creation in Appwrite.

## Environment
- Feature: Authentication flow (User registration)
- Component: `/lib/auth.ts` and `/app/register/page.tsx`

## Root Cause
The error was caused by insufficient permissions in the users collection. When a new user account is created, we try to add their data to the users collection. However, the collection did not have proper permissions set for document creation, and the user was not authenticated (no session) when the code tried to create a document in the collection.

## Solution
The solution involved multiple changes:

1. Updated the users collection to have appropriate collection-level permissions:
   ```javascript
   ["create(\"users\")", "read(\"any\")", "update(\"users\")"]
   ```

2. Enabled document security for the users collection to support document-level permissions.

3. Modified the `saveUserToDB` function to include document-level permissions when creating a user document:
   ```javascript
   [`read("any")`, `write("user:${user.$id}")`, `read("user:${user.$id}")`, `update("user:${user.$id}")`, `delete("user:${user.$id}")`]
   ```

4. Updated the registration flow in `createUserAccount` to create a session immediately after account creation, before attempting to create a user document:
   ```javascript
   // Create session immediately after account creation
   await account.createEmailSession(user.email, user.password);
   ```

5. Modified the registration page to use `checkAuthUser()` instead of explicitly calling `signIn()` again.

## Prevention
To prevent similar issues in the future:

1. Always set proper collection-level permissions when creating new collections.
2. Ensure authenticated sessions are established before performing operations that require authorization.
3. Add document-level permissions when creating documents that require specific user access.
4. Follow Appwrite's permission model where nothing is allowed by default, and permissions must be explicitly granted.

## Related
- [Appwrite Permissions Documentation](https://appwrite.io/docs/advanced/platform/permissions)
- [Database Permissions](https://appwrite.io/docs/products/databases/permissions)
