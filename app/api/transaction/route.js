import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const userId = request.cookies.get('userId')?.value;
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userIdInt = parseInt(userId);

    const cartItems = await prisma.cart.findMany({
      where: { userId: userIdInt },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    let total = 0;
    for (const item of cartItems) {
      total += item.product.price * item.quantity;
      
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: item.product.stock - item.quantity },
      });
    }

    const transaction = await prisma.transaction.create({
      data: {
        userId: userIdInt,
        total,
      },
    });

    await prisma.cart.deleteMany({
      where: { userId: userIdInt },
    });

    return NextResponse.json({ 
      success: true, 
      message: "Checkout successful!", 
      transaction,
      total 
    });
  } catch (error) {
    console.error("Transaction POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}