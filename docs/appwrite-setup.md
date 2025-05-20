# Appwrite Setup Guide

This document guides you through setting up Appwrite for the ShopKart.bio project.

## 1. Create an Appwrite Project

1. Sign up or log in to [Appwrite](https://appwrite.io/)
2. Create a new project named "ShopKart"

## 2. Set Up Database

1. Go to the **Databases** section in your Appwrite console
2. Create a new database named "shopkart-db"

### Collections Setup

#### Users Collection

1. Create a collection named "users" with the following attributes:
   - `name` (string, required)
   - `email` (string, required)
   - `imageUrl` (string, required)
   - `username` (string, optional)
   - `bio` (string, optional)

2. Set up the following indexes:
   - Index on `email` (unique)
   - Index on `username` (unique)

#### Brands Collection

1. Create a collection named "brands" with the following attributes:
   - `name` (string, required)
   - `slug` (string, required)
   - `description` (string, optional)
   - `logoUrl` (string, optional)
   - `bannerUrl` (string, optional)
   - `owner` (string, required) - Reference to User ID
   - `createdAt` (string, required)
   - `updatedAt` (string, required)

2. Set up the following indexes:
   - Index on `slug` (unique)
   - Index on `owner`

#### Products Collection

1. Create a collection named "products" with the following attributes:
   - `name` (string, required)
   - `slug` (string, required)
   - `description` (string, optional)
   - `price` (number, required)
   - `discountPrice` (number, optional)
   - `imageUrls` (array of strings, required)
   - `category` (string, required)
   - `brand` (string, required) - Reference to Brand ID
   - `stock` (number, required)
   - `isActive` (boolean, required)
   - `createdAt` (string, required)
   - `updatedAt` (string, required)

2. Set up the following indexes:
   - Index on `slug`
   - Index on `brand`
   - Index on `category`

## 3. Set Up Storage

1. Go to the **Storage** section
2. Create a new bucket named "shopkart-storage"
3. Set permissions to allow file uploads and reads

## 4. Set Up Authentication

1. Go to the **Auth** section
2. Configure email/password authentication
3. Set up email verification (optional)

## 5. API Keys and Environment Variables

1. Go to the **Settings** section
2. Note your Project ID and API Endpoint
3. Create an API key with necessary permissions
4. Update your `.env.local` file with:

```
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your-database-id
NEXT_PUBLIC_APPWRITE_STORAGE_ID=your-storage-id
NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID=your-user-collection-id
NEXT_PUBLIC_APPWRITE_BRAND_COLLECTION_ID=your-brand-collection-id
NEXT_PUBLIC_APPWRITE_PRODUCT_COLLECTION_ID=your-product-collection-id
```

## 6. Final Steps

1. Update the Appwrite client configuration in your code with correct IDs
2. Set appropriate permissions for collections (typically, users can only read/write their own data)
3. Test authentication and database operations

---

For more information, consult the [Appwrite Documentation](https://appwrite.io/docs).