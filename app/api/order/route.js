import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

function generateOrderNumber() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `INV-${year}${month}${day}-${random}`;
}

export async function POST(request) {
  try {
    console.log("🔥 ORDER API KEPAKE");

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = parseInt(session.user.id);
    const body = await request.json();

    const {
      name, email, phone, address,
      shippingMethod, shippingCost,
      paymentMethod,
      subtotal, total,
      items
    } = body;

    if (!name || !phone || !address || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    const orderNumber = generateOrderNumber();

    const result = await prisma.$transaction(async (tx) => {

      // 🔥 1. CEK + LOCK STOCK (INI KUNCI UTAMA)
      const products = await Promise.all(
        items.map(item =>
          tx.product.findUnique({
            where: { id: item.productId }
          })
        )
      );

      for (let i = 0; i < items.length; i++) {
        const product = products[i];
        const item = items[i];

        if (!product) {
          throw new Error("Produk tidak ditemukan");
        }

        if (product.stock < item.quantity) {
          throw new Error(`Produk ${product.name} stok habis`);
        }
      }

      // 🔥 2. KURANGI STOCK DULU (BIAR GA KEAMBIL USER LAIN)
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }

      // 🔥 3. BUAT ORDER
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId,
          customerName: name,
          customerEmail: email || null,
          customerPhone: phone,
          customerAddress: address,
          shippingMethod,
          shippingCost,
          paymentMethod,
          paymentStatus:
            paymentMethod === "COD"
              ? "PENDING"
              : "WAITING_PAYMENT",
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

      // 🔥 4. HAPUS CART
      await tx.cart.deleteMany({
        where: { userId },
      });

      return order;
    });

    return NextResponse.json({
      success: true,
      orderNumber: result.orderNumber,
      orderId: result.id,
    });

  } catch (error) {
    console.error("Order POST error:", error);

    return NextResponse.json(
      { error: error.message || "Terjadi kesalahan" },
      { status: 400 } // 🔥 ganti jadi 400 biar kebaca di frontend
    );
  }
}
