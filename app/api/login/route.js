import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Cari user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Cek password
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Hapus password dari response
    const { password: _, ...userWithoutPassword } = user;

    // Buat response dengan cookie
    const response = NextResponse.json(userWithoutPassword);
    
    // SET COOKIE - PASTIKAN FORMAT INI!
    response.cookies.set({
      name: "userId",
      value: user.id.toString(),
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24, // 1 hari
      sameSite: "lax",
    });
    
    response.cookies.set({
      name: "role",
      value: user.role,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24,
      sameSite: "lax",
    });

    console.log("✅ Login success:", { email: user.email, role: user.role });
    return response;
  } catch (error) {
    console.error("❌ Login error:", error);
    return NextResponse.json(
      { error: "Failed to login" },
      { status: 500 }
    );
  }
}