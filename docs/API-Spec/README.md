# API Specification

This directory contains documentation for the APIs used in ShopKart.bio.

## Contents

- [Authentication API](./auth-api.md): User registration, login, logout, and account management
- [Database API](./database-api.md): Document operations for users, brands, and products
- [Storage API](./storage-api.md): File upload, retrieval, and management

## Overview

ShopKart.bio uses Appwrite as its backend service. This API specification documents the core endpoints and operations used throughout the application.

## Implementation

The API is implemented using the Appwrite SDK for Web. The client is initialized in `/lib/appwrite-config.ts` using environment variables.

## Key Concepts

- **Authentication**: User accounts and sessions
- **Database**: Document collections and CRUD operations
- **Storage**: File management for product images and user avatars

## Common Patterns

- Requests follow a promise-based pattern
- Error handling is implemented via try-catch blocks
- TypeScript interfaces ensure type safety for API responses

## Environment Configuration

See the [Environment Variables](./storage-api.md#environment-variables) section for the required configuration.

## References

- [Appwrite Documentation](https://appwrite.io/docs)
- [Appwrite SDK for Web](https://appwrite.io/docs/sdks/web)
