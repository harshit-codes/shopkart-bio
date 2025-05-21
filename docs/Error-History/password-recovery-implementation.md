# 2025-05-20 - Password Recovery Implementation

## Overview
This document describes the implementation of the password recovery/reset flow in ShopKart.bio.

## Implementation Details

### Core Components
1. **Forgot Password Page** (`/app/forgot-password/page.tsx`)
   - Simple form that collects user's email address
   - Sends a recovery email using Appwrite's createRecovery method
   - Shows a success message when email is sent

2. **Reset Password Page** (`/app/reset-password/page.tsx`)
   - Accessed via the reset link in the recovery email
   - Extracts userId and secret token from URL parameters
   - Provides a form for the user to enter a new password
   - Updates the password using Appwrite's updateRecovery method

3. **Auth Library Functions** (`/lib/auth.ts`)
   - `requestPasswordReset`: Creates a password recovery request
   - `resetPassword`: Completes the password recovery process

### User Flow
1. User accesses the login page and clicks "Forgot password?"
2. User enters their email on the forgot-password page
3. System sends a recovery email with a reset link
4. User clicks the link in the email
5. User is redirected to the reset-password page with userId and secret as URL parameters
6. User enters a new password and submits the form
7. System verifies the userId and secret, then updates the password
8. User is redirected to the login page

### Appwrite Integration
- Uses Appwrite's Account API for password recovery
- `createRecovery`: Sends an email with a recovery link
- `updateRecovery`: Updates the user's password with a valid secret token

### Security Considerations
- Secret tokens are valid for a limited time (typically 1 hour)
- Passwords must be at least 8 characters long
- Password and confirm password must match
- URL parameters (userId and secret) are validated before processing

## Implementation Tips
1. Make sure the SMTP settings are properly configured in Appwrite
2. Test the flow with real email addresses to ensure delivery
3. Keep the design consistent with the rest of the authentication flow
4. Provide clear feedback to users at each step of the process

## Related
- [Appwrite Password Recovery Documentation](https://appwrite.io/docs/products/auth/email-password)