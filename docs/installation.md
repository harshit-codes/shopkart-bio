# ShopKart.bio Installation Guide

This guide will help you set up the ShopKart.bio project locally.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git
- An Appwrite account

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/harshit-codes/shopkart-bio.git
cd shopkart-bio
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Up Appwrite

Follow the instructions in [docs/appwrite-setup.md](./appwrite-setup.md) to set up your Appwrite project.

### 4. Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

```
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your-database-id
NEXT_PUBLIC_APPWRITE_STORAGE_ID=your-storage-id
NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID=your-user-collection-id
NEXT_PUBLIC_APPWRITE_BRAND_COLLECTION_ID=your-brand-collection-id
NEXT_PUBLIC_APPWRITE_PRODUCT_COLLECTION_ID=your-product-collection-id
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Replace the placeholder values with your actual Appwrite credentials.

### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

The application should now be running at [http://localhost:3000](http://localhost:3000).

## Project Structure

- `app/`: Next.js app router pages
- `components/`: Reusable UI components
- `context/`: React context providers
- `lib/`: Utility functions and API services
- `types/`: TypeScript type definitions
- `public/`: Static assets

## Features

- User authentication (register, login, logout)
- Brand creation and management
- Product management
- Public brand pages

## Common Issues

### Authentication Problems

If you experience authentication issues:

1. Check that your Appwrite credentials are correct in `.env.local`
2. Ensure you've enabled email/password authentication in Appwrite
3. Check the browser console for error messages

### Image Upload Issues

If image uploads fail:

1. Verify your storage bucket permissions in Appwrite
2. Ensure the storage ID in `.env.local` is correct
3. Check file size limits

## Deployment

To deploy the application:

1. Configure your environment variables in your hosting provider
2. Build the application:

```bash
npm run build
# or
yarn build
```

3. Deploy the built application to your hosting provider of choice (e.g., Vercel, Netlify)

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Appwrite Documentation](https://appwrite.io/docs)
- [Shadcn UI](https://ui.shadcn.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)