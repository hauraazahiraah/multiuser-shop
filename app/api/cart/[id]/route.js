import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// ===================== DELETE =====================
export async function DELETE(request, { params }) {
  try {
    // ✅ WAJIB: await params DULU! (Next.js 15)
    const { id } = await params;
    
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cartId = parseInt(id);
    const userId = parseInt(session.user.id);

    // CEK APAKAH CART ITEM MILIK USER INI
    const cartItem = await prisma.cart.findFirst({
      where: {
        id: cartId,
        userId,
      },
    });

    if (!cartItem) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
    }

    await prisma.cart.delete({
      where: { id: cartId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cart DELETE error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ===================== PUT (UPDATE QUANTITY) =====================
export async function PUT(request, { params }) {
  try {
    // ✅ WAJIB: await params DULU! (Next.js 15)
    const { id } = await params;
    
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cartId = parseInt(id);
    const userId = parseInt(session.user.id);
    const { quantity } = await request.json();

    if (!quantity || quantity < 1) {
      return NextResponse.json({ error: "Quantity must be at least 1" }, { status: 400 });
    }

    // CEK APAKAH CART ITEM MILIK USER INI
    const cartItem = await prisma.cart.findFirst({
      where: {
        id: cartId,
        userId,
      },
    });

    if (!cartItem) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
    }

    // UPDATE QUANTITY
    const updated = await prisma.cart.update({
      where: { id: cartId },
      data: { quantity },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Cart PUT error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}