import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes accessible to all authenticated users
const AUTHENTICATED_ROUTES = ['/dashboard'] as const

// Public routes (no authentication required)
const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password', '/test-auth'] as const

/**
 * Check if a path is protected
 */
function isProtectedRoute(pathname: string): boolean {
  return AUTHENTICATED_ROUTES.some(route => pathname.startsWith(route))
}

/**
 * Check if a path is public
 */
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => pathname.startsWith(route))
}

/**
 * Middleware simplified for frontend-only app
 * Authentication is handled client-side via localStorage
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public routes without any checks
  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  // Handle root path - redirect to login
  if (pathname === '/') {
    // In a frontend-only app, we let the page handle authentication
    // The page will check localStorage and redirect if needed
    return NextResponse.next()
  }

  // Check protected routes
  if (isProtectedRoute(pathname)) {
    // Let the page handle authentication check via localStorage
    // The page will redirect to login if not authenticated
    return NextResponse.next()
  }

  // For other routes, allow access
  return NextResponse.next()
}

/**
 * Configure which paths middleware runs on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths.
     * Next.js automatically excludes:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/:path*',
  ],
}
