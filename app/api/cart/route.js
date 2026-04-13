import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// GET - ambil cart user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);

    const cart = await prisma.cart.findMany({
      where: { userId },
      include: { product: true }
    });

    return NextResponse.json(cart);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - tambah ke cart
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, quantity = 1 } = await request.json();
    const userId = parseInt(session.user.id);

    // Cek apakah produk sudah ada di cart
    const existing = await prisma.cart.findFirst({
      where: {
        userId: userId,
        productId: parseInt(productId)
      }
    });

    if (existing) {
      // Update quantity
      const updated = await prisma.cart.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity }
      });
      return NextResponse.json(updated);
    } else {
      // Buat baru
      const newCart = await prisma.cart.create({
        data: {
          userId: userId,
          productId: parseInt(productId),
          quantity: quantity
        }
      });
      return NextResponse.json(newCart, { status: 201 });
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - hapus item dari cart
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const cartId = searchParams.get('id');

    if (!cartId) {
      return NextResponse.json({ error: "Cart ID required" }, { status: 400 });
    }

    await prisma.cart.delete({
      where: { id: parseInt(cartId) }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - update quantity
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { cartId, quantity } = await request.json();

    const updated = await prisma.cart.update({
      where: { id: parseInt(cartId) },
      data: { quantity: parseInt(quantity) }
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}