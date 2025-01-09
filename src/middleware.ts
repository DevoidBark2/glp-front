import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
    const {url, cookies} = request

    const session = cookies.get('session')?.value

    const isAuthPage = url.includes('/auth')

    if(isAuthPage) {
        if(session) {
            return NextResponse.redirect(new URL('/platform/profile',url))
        }

        return NextResponse.next()
    }

    if(!session && isPrivateRoute(request.nextUrl.pathname)) {
        return NextResponse.redirect(new URL('/platform/auth/login',url))
    }

    // const currentUser = request.cookies.get('userToken')?.value


    // if (request.nextUrl.pathname === '/') {
    //     return Response.redirect(new URL('/platform', request.url));
    // }

    // if (!currentUser && isPrivateRoute(request.nextUrl.pathname)) {
    //     return Response.redirect(new URL('/platform', request.url))
    // }

    // if (request.nextUrl.pathname === '/') {
    //     return Response.redirect(new URL('/platform', request.url));
    // }
}

function isPrivateRoute(pathname: string) {
    const privateRoutes = ['/control-panel','/platform/profile'];
    return privateRoutes.some(route => pathname.includes(route));
}

export const config = {
    matcher: ['/control-panel/:path*', '/platform/auth/:path*', '/platform/:path*']
}