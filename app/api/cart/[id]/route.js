import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(request, { params }) {
  try {
    // ✅ WAJIB: await params DULU!
    const { id } = await params;
    
    const userId = request.cookies.get('userId')?.value;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cartId = parseInt(id);
    if (isNaN(cartId)) {
      return NextResponse.json({ error: "Invalid cart ID" }, { status: 400 });
    }

    const { quantity } = await request.json();
    if (!quantity || quantity < 1) {
      return NextResponse.json({ error: "Quantity must be at least 1" }, { status: 400 });
    }

    // CEK APAKAH CART ITEM MILIK USER INI
    const cartItem = await prisma.cart.findFirst({
      where: {
        id: cartId,
        userId: parseInt(userId),
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

export async function DELETE(request, { params }) {
  try {
    // ✅ WAJIB: await params DULU!
    const { id } = await params;
    
    const userId = request.cookies.get('userId')?.value;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cartId = parseInt(id);
    if (isNaN(cartId)) {
      return NextResponse.json({ error: "Invalid cart ID" }, { status: 400 });
    }

    // CEK APAKAH CART ITEM MILIK USER INI
    const cartItem = await prisma.cart.findFirst({
      where: {
        id: cartId,
        userId: parseInt(userId),
      },
    });

    if (!cartItem) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
    }

    // DELETE CART ITEM
    await prisma.cart.delete({
      where: { id: cartId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cart DELETE error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}