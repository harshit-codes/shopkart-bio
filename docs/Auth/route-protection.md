# Route Protection and Authentication Flow Documentation

## Overview

This document outlines the route protection and authentication flow implemented in ShopKart.bio.

## Authentication Flow

1. **User Registration**
   - User fills out the registration form
   - Account is created in Appwrite
   - Session is created automatically
   - User document is created in the database
   - User is redirected to their profile page at `/{username}`

2. **User Login**
   - User logs in with email/password
   - Session is created in Appwrite
   - User document is verified/created if necessary
   - User is redirected to their profile page at `/{username}`
   - If a callback URL is provided, they are redirected to that URL instead

3. **Session Management**
   - Authentication status is maintained in the AuthContext
   - Username is stored in a cookie for middleware route protection
   - Sessions can be terminated via sign out

## Route Protection

Routes in ShopKart.bio are protected through two mechanisms:

1. **Next.js Middleware**
   - Runs on every request before the page is rendered
   - Checks for authentication cookies and redirects as needed
   - Protects routes based on authentication status
   - Redirects authenticated users from public routes to their profile

2. **Client-side Protection**
   - Each protected route checks authentication status
   - Renders appropriate UI based on authentication
   - Handles loading states and unauthorized access

## Route Structure

### Public Routes
Public routes are accessible to all users:
- `/` - Landing page (redirects authenticated users to profile)
- `/login` - Login page
- `/register` - Registration page
- `/forgot-password` - Password recovery request
- `/reset-password` - Password reset with token
- `/about` - About page
- `/terms` - Terms and conditions
- `/privacy` - Privacy policy

### Protected Routes
Protected routes require authentication:
- `/{username}` - User profile/dashboard
- `/{username}/brands` - User's brands
- `/{username}/brands/create` - Create new brand
- `/{username}/products` - User's products
- `/{username}/orders` - User's orders
- `/{username}/profile` - Profile settings
- `/{username}/settings` - Account settings

### Backward Compatibility
- `/dashboard` - Redirects to `/{username}`
- `/dashboard/*` - Redirects to `/{username}/*`

## Implementation Details

### Middleware
```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get authentication status from the cookie
  const authSession = request.cookies.get('auth-session')?.value;
  const isAuthenticated = !!authSession;
  
  // Get user info from cookies if available
  const usernameCookie = request.cookies.get('user-username')?.value;
  const username = usernameCookie || '';
  
  // Check if this is a route that should be protected
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  // If the user is authenticated and trying to access an auth route, 
  // redirect them to their profile page
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL(`/${username}`, request.url));
  }
  
  // If the user is authenticated and on the landing page,
  // redirect them to their profile page
  if (isAuthenticated && pathname === '/') {
    return NextResponse.redirect(new URL(`/${username}`, request.url));
  }
  
  // If the user is not authenticated and trying to access a protected route,
  // redirect them to the login page
  if (!isAuthenticated && !isPublicRoute) {
    // Store the attempted URL to redirect back after login
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }
}
```

### Username Cookie
```typescript
// AuthContext.tsx
// Set username cookie for middleware route protection
if (currentUser.username) {
  Cookies.set('user-username', currentUser.username, { 
    expires: 7, // 7 days
    path: '/',
    sameSite: 'strict'
  });
}
```

### Route Components
Each route has its own security checks:
- Layout components check authentication status and redirect if needed
- Page components verify ownership for user-specific content
- Public routes redirect authenticated users to their profiles

## Best Practices Implemented

1. **Defense in Depth**
   - Multiple layers of protection (middleware, layout components, page components)
   - Fallback mechanisms for error cases

2. **Clean URL Structure**
   - User-specific routes use username parameter
   - RESTful route design for resources

3. **Improved User Experience**
   - Smart redirects based on authentication status
   - Callback URL support for continuing after login
   - Proper loading states during authentication checks

4. **Separation of Concerns**
   - Authentication logic in AuthContext
   - Route protection in middleware
   - UI rendering in page components

## Testing the Implementation

Test cases for authentication and route protection:
1. Anonymous user visits landing page -> Should see landing page
2. Anonymous user visits protected route -> Should redirect to login
3. Authenticated user visits landing page -> Should redirect to profile
4. Authenticated user visits protected route -> Should see protected content
5. User signs out -> Should redirect to landing page
6. User tries to access another user's profile -> Should see public view only