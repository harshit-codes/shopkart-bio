# API Specification

This document outlines the API specifications for ShopKart.bio, which uses Appwrite as its backend service.

## Overview

ShopKart.bio integrates with Appwrite's SDK to handle authentication, database operations, and file storage. This document covers the core API endpoints and operations used in the application.

## Authentication API

### User Registration

- **Service**: Account
- **Method**: `create`
- **Description**: Creates a new user account
- **Parameters**:
  - `userId`: Unique identifier (optional)
  - `email`: User's email address
  - `password`: User's password
  - `name`: User's display name
- **Flow**:
  1. Create a new Appwrite account
  2. Create an email session for the new user
  3. Generate an avatar URL using Appwrite's avatar service
  4. Save the user's data to the users collection with proper permissions

### User Login

- **Service**: Account
- **Method**: `createEmailSession`
- **Description**: Creates a new session for a user
- **Parameters**:
  - `email`: User's email address
  - `password`: User's password

### User Logout

- **Service**: Account
- **Method**: `deleteSession`
- **Description**: Deletes the current session
- **Parameters**:
  - `sessionId`: The current session ID or 'current'

### Get Current User

- **Service**: Account
- **Method**: `get`
- **Description**: Retrieves the current user's account information
- **Parameters**: None

### Forgot Password

- **Service**: Account
- **Method**: `createRecovery`
- **Description**: Sends a password recovery email with reset link
- **Parameters**:
  - `email`: User's email address
  - `url`: URL to redirect the user to complete the password reset (reset-password page)
- **Flow**:
  1. User enters their email address on the forgot-password page
  2. System sends an email with a reset link
  3. Link contains userId and secret token as URL parameters

### Reset Password

- **Service**: Account
- **Method**: `updateRecovery`
- **Description**: Completes the password recovery process
- **Parameters**:
  - `userId`: User ID received from the recovery email
  - `secret`: Secret token received from the recovery email
  - `password`: New password
  - `confirmPassword`: Confirmation of the new password
- **Flow**:
  1. User clicks the link in the recovery email
  2. User is directed to the reset-password page with userId and secret as URL parameters
  3. User enters a new password
  4. System updates the password if the secret token is valid

## Database Permissions

### Users Collection

The users collection has the following permissions:
- Collection-level permissions:
  - `create("users")`: Any authenticated user can create documents
  - `read("any")`: Anyone can read documents
  - `update("users")`: Any authenticated user can update documents

- Document-level permissions (enabled):
  - `read("any")`: Anyone can read the document
  - `write("user:{userId}")`: Only the owner can write to their document
  - `read("user:{userId}")`: The owner can read their document
  - `update("user:{userId}")`: Only the owner can update their document
  - `delete("user:{userId}")`: Only the owner can delete their document
