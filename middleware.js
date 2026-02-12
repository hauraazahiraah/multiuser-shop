import { NextResponse } from 'next/server';

export function middleware(request) {
  const userId = request.cookies.get('userId')?.value;
  const role = request.cookies.get('role')?.value;
  const { pathname } = request.nextUrl;

  console.log('🔍 Middleware:', { pathname, userId, role });

  // ============= HALAMAN PUBLIC =============
  if (pathname === '/auth/login' || pathname === '/auth/register') {
    return NextResponse.next();
  }

  // ============= DASHBOARD ROUTES =============
  if (pathname.startsWith('/dashboard')) {
    // Belum login → redirect ke login
    if (!userId) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Admin routes - hanya ADMIN
    if (pathname.startsWith('/dashboard/admin') && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard/user', request.url));
    }

    // User routes - USER atau ADMIN bisa
    if (pathname.startsWith('/dashboard/user') && !userId) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    return NextResponse.next();
  }

  // ============= API ROUTES =============
  if (pathname.startsWith('/api')) {
    // API public - tanpa autentikasi
    if (pathname === '/api/register' || 
        pathname === '/api/login' || 
        pathname === '/api/logout') {
      return NextResponse.next();
    }

    // API PRODUCT
    if (pathname.startsWith('/api/product')) {
      const method = request.method;
      
      // GET - semua user yang login bisa
      if (method === 'GET') {
        if (!userId) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.next();
      }
      
      // POST, PUT, DELETE - hanya ADMIN
      if (['POST', 'PUT', 'DELETE'].includes(method)) {
        if (!userId || role !== 'ADMIN') {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
        return NextResponse.next();
      }
    }

    // API UPLOAD - hanya ADMIN
    if (pathname.startsWith('/api/upload')) {
      if (!userId || role !== 'ADMIN') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      return NextResponse.next();
    }

    // ============= API CART ============= ✅ TAMBAHAN
    if (pathname.startsWith('/api/cart')) {
      if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.next();
    }

    // ============= API TRANSACTION ============= ✅ TAMBAHAN
    if (pathname.startsWith('/api/transaction')) {
      if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.next();
    }

    // API lain - harus login
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/:path*', 
    '/auth/:path*',
  ],
};