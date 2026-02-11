import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password, role } = body;

    // Validasi
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Cek email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user - PASTIKAN ROLE TERKIRIM!
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "USER", // "ADMIN" atau "USER"
      },
    });

    // Hapus password dari response
    const { password: _, ...userWithoutPassword } = user;

    console.log("✅ Register success:", { email: user.email, role: user.role });
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error("❌ Register error:", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}