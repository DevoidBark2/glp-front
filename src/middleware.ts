import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {

    const currentUser = request.cookies.get('userToken')?.value

    if (!currentUser && isPrivateRoute(request.nextUrl.pathname)){
        return Response.redirect(new URL('/login', request.url))
    }

    // if (currentUser && request.nextUrl.pathname.includes('login')) {
    //     return Response.redirect(request.url);
    // }

    if (currentUser && request.nextUrl.pathname === '/') {
        return Response.redirect(new URL('/platform', request.url));
    }

    if (!currentUser && request.nextUrl.pathname === '/') {
        return Response.redirect(new URL('/login', request.url));
    }
}

function isPrivateRoute(pathname: string) {
    const privateRoutes = ['/platform'];
    return privateRoutes.some(route => pathname.includes(route));
}