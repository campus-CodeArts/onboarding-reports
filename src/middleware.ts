import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const ROLE_PROTECT_ENABLED = process.env.ROLE_PROTECT === "enabled" ? true: false;
const HOME_PATH = '/';
const PUBLIC_PATHS = process.env.PUBLIC_PATHS.split(',') || [HOME_PATH];
const STUDENT_PATHS = ['/users', '/user', '/ranking', '/ranking/teams', '/api/ranking', '/api/ranking/:path*'];
const USER_PATHS = ['/api/generate-reports'];
const ADMIN_PATHS = ['/admin','/api/sync'];

export async function middleware(req: NextRequest) {
    console.log(`middleware (${ROLE_PROTECT_ENABLED}):`, req.nextUrl.pathname);
    const isHome = HOME_PATH === req.nextUrl.pathname;
    if (ROLE_PROTECT_ENABLED && !isHome){
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        // console.log("Token:", token);
    
        // Determinar el rol del usuario
        const userRole = token?.role ?? process.env.DEFAULT_ROLE;
        
        if (userRole === 'admin' || ADMIN_PATHS.includes(req.nextUrl.pathname)) {
            console.log('middleware: admin')
            return NextResponse.next();
        }
    
        if (userRole === 'anonymous' || PUBLIC_PATHS.includes(req.nextUrl.pathname)) {
            console.log('middleware: anonymous -> /')
            return NextResponse.redirect(new URL('/', req.url));
        }
    
        if (userRole === 'user' && ![...USER_PATHS, ...STUDENT_PATHS, ...PUBLIC_PATHS].includes(req.nextUrl.pathname)) {
            console.log('middleware: user -> /')
            return NextResponse.redirect(new URL('/', req.url));
        }
    
        if (userRole === 'student' && ![...STUDENT_PATHS, ...PUBLIC_PATHS].includes(req.nextUrl.pathname)) {
            console.log('middleware: student -> /')
            return NextResponse.redirect(new URL('/', req.url));
        }
        console.log(`middleware (${userRole}): authorized`)
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/users', '/user/:path*', '/user/', 
        '/ranking', '/ranking/teams', 
        '/api/ranking', '/api/ranking/:path*', 
        '/api/generate-reports', '/admin/:path*'
    ],
};
