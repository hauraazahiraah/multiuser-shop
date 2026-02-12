import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    const userId = request.cookies.get('userId')?.value;
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cartItems = await prisma.cart.findMany({
      where: { 
        userId: parseInt(userId) 
      },
      include: {
        product: true,
      },
    });

    return NextResponse.json(cartItems);
  } catch (error) {
    console.error("Cart GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const userId = request.cookies.get('userId')?.value;
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, quantity = 1 } = await request.json();

    const existing = await prisma.cart.findUnique({
      where: {
        userId_productId: {
          userId: parseInt(userId),
          productId: productId,
        },
      },
    });

    if (existing) {
      const updated = await prisma.cart.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
      return NextResponse.json(updated);
    } else {
      const created = await prisma.cart.create({
        data: {
          userId: parseInt(userId),
          productId: productId,
          quantity: quantity,
        },
      });
      return NextResponse.json(created);
    }
  } catch (error) {
    console.error("Cart POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}