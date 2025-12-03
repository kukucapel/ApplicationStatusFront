import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const { pathname } = req.nextUrl;

  const url = req.nextUrl.clone();

  if (
    !token &&
    (pathname.startsWith('/dashboard') || pathname.startsWith('/admin'))
  ) {
    url.pathname = '/auth';
    return NextResponse.redirect(url);
  }

  if (token && pathname.startsWith('/auth')) {
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*', '/admin/:path*'],
};
