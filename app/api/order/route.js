import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function generateOrderNumber() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `INV-${year}${month}${day}-${random}`; // ✅ DASH, BUKAN SLASH!
}

export async function POST(request) {
  try {
    const userId = request.cookies.get("userId")?.value;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      email,
      phone,
      address,
      shippingMethod,
      shippingCost,
      paymentMethod,
      subtotal,
      total,
      items,
    } = body;

    if (!name || !phone || !address || !items || items.length === 0) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const orderNumber = generateOrderNumber(); // ✅ CONTOH: INV-20260212-435

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: parseInt(userId),
        customerName: name,
        customerEmail: email || null,
        customerPhone: phone,
        customerAddress: address,
        shippingMethod,
        shippingCost,
        paymentMethod,
        paymentStatus: paymentMethod === "COD" ? "PENDING" : "WAITING_PAYMENT",
        subtotal,
        total,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.subtotal,
          })),
        },
      },
    });

    // Hapus cart setelah order berhasil
    await prisma.cart.deleteMany({
      where: { userId: parseInt(userId) },
    });

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber, // ✅ DASH!
      orderId: order.id,
    });
  } catch (error) {
    console.error("Order POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}