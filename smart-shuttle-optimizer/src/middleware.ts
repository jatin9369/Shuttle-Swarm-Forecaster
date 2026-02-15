import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Define the protected routes and their required roles
const protectedRoutes = {
    '/admin': ['admin'],
    '/driver': ['driver'],
    '/rider': ['rider', 'student'], // 'student' might be used interchangeably
};

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value; // Prefer cookies for middleware
    // FALLBACK: Check Authorization header if cookie is missing (less common for page navigations but good for API)
    const authHeader = request.headers.get('authorization');
    const actualToken = token || (authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null);

    const { pathname } = request.nextUrl;

    // Function to redirect to role selection
    const redirectToLogin = () => {
        return NextResponse.redirect(new URL('/', request.url));
    };

    const redirectToUnauthorized = () => {
        // You might want a dedicated unauthorized page, or just send them back to selection
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Check if the current route is protected
    const requiredroles = Object.entries(protectedRoutes).find(([route]) =>
        pathname.startsWith(route)
    )?.[1];

    if (requiredroles) {
        if (!actualToken) {
            return redirectToLogin();
        }

        try {
            // Verify the JWT token
            const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your_jwt_secret_key_change_this');
            const { payload } = await jwtVerify(actualToken, secret);

            const userRole = (payload.user as any)?.role;

            if (!userRole || !requiredroles.includes(userRole)) {
                console.log(`Access denied: Role ${userRole} required ${requiredroles}`);
                return redirectToUnauthorized();
            }

            // Token is valid and role matches due to the setup
            console.log('Middleware: Access granted to', pathname);
            return NextResponse.next();

        } catch (error) {
            console.error('Token verification failed:', error);
            return redirectToLogin();
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - auth (auth routes)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|auth).*)',
    ],
};
