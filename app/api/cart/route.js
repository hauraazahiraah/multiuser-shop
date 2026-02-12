import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const cartItems = await prisma.cart.findMany({
      where: { userId },
      include: { product: true },
    });

    return NextResponse.json(cartItems);
  } catch (error) {
    console.error("Cart GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const { productId, quantity = 1 } = await request.json();

    const existing = await prisma.cart.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
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
          userId,
          productId,
          quantity,
        },
      });
      return NextResponse.json(created);
    }
  } catch (error) {
    console.error("Cart POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}