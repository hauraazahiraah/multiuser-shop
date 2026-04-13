import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  
  // IZINKAN AKSES KE HALAMAN LOGIN
  if (path === '/auth/login') {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });

  // Kalau akses dashboard tapi belum login
  if (path.startsWith('/dashboard') && !token) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(loginUrl);
  }

  // ADMIN ONLY - PAKAI LOWERCASE (match dengan database)
  if (path.startsWith('/dashboard/admin')) {
    // Cek role lowercase 'admin'
    if (token?.role?.toLowerCase() !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard/user', request.url));
    }
  }

  // USER ONLY - PAKAI LOWERCASE
  if (path.startsWith('/dashboard/user')) {
    // Cek role lowercase 'user'
    if (token?.role?.toLowerCase() !== 'user') {
      return NextResponse.redirect(new URL('/dashboard/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};