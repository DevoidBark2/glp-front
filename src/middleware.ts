import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {

    const currentUser = request.cookies.get('userToken')?.value


    if (request.nextUrl.pathname === '/') {
        return Response.redirect(new URL('/platform', request.url));
    }

    if (!currentUser && isPrivateRoute(request.nextUrl.pathname)) {
        return Response.redirect(new URL('/platform', request.url))
    }

    if (request.nextUrl.pathname === '/') {
        return Response.redirect(new URL('/platform', request.url));
    }
}

function isPrivateRoute(pathname: string) {
    const privateRoutes = ['/control-panel'];
    return privateRoutes.some(route => pathname.includes(route));
}