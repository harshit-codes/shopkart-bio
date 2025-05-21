import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This array contains all public routes that don't require authentication
const publicRoutes = [
  '/',              // Landing page
  '/login',         // Login page
  '/register',      // Register page 
  '/forgot-password',  // Forgot password page
  '/reset-password', // Reset password page
  '/about',          // About page
  '/terms',         // Terms and conditions
  '/privacy',       // Privacy policy
];

// This array contains authentication routes
const authRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
];

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
  
  // Check if this is an authentication route
  const isAuthRoute = authRoutes.some(route => 
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
  
  // Continue with the request for all other cases
  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public assets)
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
};