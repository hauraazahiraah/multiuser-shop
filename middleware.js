import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
  const path = request.nextUrl.pathname;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });

  // Kalau akses dashboard tapi belum login
  if (path.startsWith('/dashboard') && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // ADMIN ONLY
  if (path.startsWith('/dashboard/admin')) {
    if (token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard/user', request.url));
    }
  }

  // USER ONLY
  if (path.startsWith('/dashboard/user')) {
    if (token?.role !== 'USER') {
      return NextResponse.redirect(new URL('/dashboard/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};