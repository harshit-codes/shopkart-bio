# Authentication System Documentation

This document provides an overview of the authentication system implemented in ShopKart.bio.

## Features

The authentication system includes the following features:

1. **User Registration**: New users can create an account with email, password, and profile details
2. **User Login**: Registered users can sign in with their credentials
3. **User Logout**: Users can sign out of their current session
4. **Password Recovery**: Users can reset their password if forgotten
5. **Session Management**: Keeping track of authenticated user sessions

## Architecture

The authentication system is built on top of Appwrite's Account API and consists of several components:

### Core Components

1. **AuthContext** (`/context/AuthContext.tsx`): 
   - Provides authentication state and methods to all components
   - Manages user sessions and authentication status
   - Exposes methods for sign-in, sign-out, and password recovery

2. **Auth Library** (`/lib/auth.ts`):
   - Implements core authentication functionality
   - Interfaces with Appwrite's Account API
   - Handles user document creation and management

3. **UI Components**:
   - Login Page (`/app/login/page.tsx`)
   - Registration Page (`/app/register/page.tsx`)
   - Forgot Password Page (`/app/forgot-password/page.tsx`)
   - Reset Password Page (`/app/reset-password/page.tsx`)

## Authentication Flows

### Registration Flow

1. User fills out registration form (name, email, password)
2. Form data is validated (password strength, matching passwords)
3. `createUserAccount()` creates a new Appwrite account
4. A session is created automatically
5. User profile is saved to the database with appropriate permissions
6. User is redirected to the dashboard

### Login Flow

1. User enters email and password
2. `signIn()` creates an email session using Appwrite
3. `checkAuthUser()` verifies the session and fetches user data
4. User is redirected to the dashboard upon successful authentication

### Password Recovery Flow

1. **Request Phase**:
   - User clicks "Forgot password?" link on login page
   - User enters their email address
   - `forgotPassword()` calls Appwrite's `createRecovery()`
   - A password reset email is sent to the user

2. **Reset Phase**:
   - User clicks the link in the email
   - User is directed to the reset-password page with userId and secret parameters
   - User enters a new password
   - `completePasswordReset()` calls Appwrite's `updateRecovery()`
   - If successful, user is redirected to the login page

## Security Measures

1. **Password Requirements**:
   - Minimum 8 characters
   - Mix of uppercase and lowercase letters
   - At least one number or special character

2. **Rate Limiting**:
   - Password reset requests are limited to 3 per hour per email

3. **Session Management**:
   - Sessions are managed by Appwrite
   - Automatic session validation on page load
   - Sessions can be explicitly terminated by the user

4. **Document Security**:
   - User documents have appropriate permissions set
   - Only the owner can update their own profile

## Error Handling

The authentication system provides clear error messages for various scenarios:

- Invalid credentials
- Password mismatch
- Password strength requirements
- Expired reset links
- Rate limiting
- Email service unavailability

## Future Improvements

Potential enhancements to the authentication system include:

1. Email verification for new accounts
2. Social login (Google, Facebook, etc.)
3. Two-factor authentication
4. Enhanced session management (multiple sessions, devices)
5. Account lockout after multiple failed attempts
