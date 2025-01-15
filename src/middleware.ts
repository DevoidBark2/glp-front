import { NextRequest, NextResponse } from 'next/server'
import {UserRole} from "@/shared/api/user/model";

export function middleware(request: NextRequest) {
    const { url, cookies } = request;

    const session = cookies.get('session')?.value
    const userRole = cookies.get('userRole')?.value

    const isAuthPage = url.includes('/auth')

    if (request.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/platform', url));
    }

    if(isAuthPage) {
        if(session) {
            return NextResponse.redirect(new URL('/platform/profile',url))
        }

        return NextResponse.next()
    }

    if(!session && isPrivateRoute(request.nextUrl.pathname)) {
        return NextResponse.redirect(new URL('/platform/auth/login',url))
    }

    if (request.nextUrl.pathname.startsWith('/control-panel')) {
        if (userRole !== UserRole.SUPER_ADMIN) {
            return NextResponse.redirect(new URL('/platform/profile', url));
        }
    }
}

function isPrivateRoute(pathname: string) {
    const privateRoutes = ['/control-panel','/platform/profile','platform/settings'];
    return privateRoutes.some(route => pathname.includes(route));
}

export const config = {
    matcher: ['/control-panel/:path*', '/platform/auth/:path*', '/platform/:path*', '/']
}