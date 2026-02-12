import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });

  // 🔴 DEBUG: LIHAT TOKEN
  console.log("========== MIDDLEWARE ==========");
  console.log("PATH:", path);
  console.log("TOKEN:", token);
  console.log("=================================");

  if (path.startsWith('/dashboard')) {
    if (!token) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized. Please login." }),
        { status: 401, headers: { 'content-type': 'application/json' } }
      );
    }

    if (path.startsWith('/dashboard/admin')) {
      if (token.role !== 'ADMIN') {
        console.log("❌ FORBIDDEN - Role:", token?.role);
        return new NextResponse(
          JSON.stringify({ error: "Forbidden. Admin only." }),
          { status: 403, headers: { 'content-type': 'application/json' } }
        );
      }
      console.log("✅ ADMIN ACCESS");
      return NextResponse.next();
    }

    if (path.startsWith('/dashboard/user')) {
      console.log("✅ USER ACCESS");
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};