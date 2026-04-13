import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// GET - untuk admin (melihat semua orders)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role?.toLowerCase() !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { items: { include: { product: true } }, user: true }
    });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - untuk checkout user (dengan update stok)
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await request.json();
    const { customerName, customerEmail, customerPhone, customerAddress, shippingMethod, shippingCost, paymentMethod, items } = body;
    
    if (!customerName || !customerEmail || !customerPhone || !customerAddress) {
      return NextResponse.json({ error: "Data pelanggan tidak lengkap" }, { status: 400 });
    }
    if (!paymentMethod) {
      return NextResponse.json({ error: "Metode pembayaran belum dipilih" }, { status: 400 });
    }
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Keranjang belanja kosong" }, { status: 400 });
    }

    const userId = parseInt(session.user.id);
    const orderNumber = "INV-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
    
    let calculatedSubtotal = 0;
    for (let i = 0; i < items.length; i++) {
      calculatedSubtotal += (parseInt(items[i].price) || 0) * (parseInt(items[i].quantity) || 0);
    }
    
    const shipping = parseInt(shippingCost) || 0;
    const calculatedTotal = calculatedSubtotal + shipping;

    // ✅ KURANGI STOK PRODUK SEBELUM BUAT ORDER
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: parseInt(item.productId) }
      });
      
      if (!product) {
        return NextResponse.json({ error: `Produk dengan ID ${item.productId} tidak ditemukan` }, { status: 400 });
      }
      
      if (product.stock < parseInt(item.quantity)) {
        return NextResponse.json({ error: `Stok ${product.name} tidak mencukupi. Sisa: ${product.stock}` }, { status: 400 });
      }
      
      await prisma.product.update({
        where: { id: parseInt(item.productId) },
        data: { stock: { decrement: parseInt(item.quantity) } }
      });
    }

    // Buat order
    const order = await prisma.order.create({
      data: {
        orderNumber: orderNumber,
        userId: userId,
        customerName: customerName,
        customerEmail: customerEmail,
        customerPhone: customerPhone,
        customerAddress: customerAddress,
        shippingMethod: shippingMethod || "Delivery Reguler",
        shippingCost: shipping,
        paymentMethod: paymentMethod,
        paymentStatus: "WAITING_PAYMENT",
        deliveryStatus: "PENDING",
        subtotal: calculatedSubtotal,
        total: calculatedTotal,
        items: {
          create: items.map(item => ({
            productId: parseInt(item.productId),
            quantity: parseInt(item.quantity),
            price: parseInt(item.price)
          }))
        }
      },
      include: { items: true }
    });

    // Hapus cart setelah checkout
    await prisma.cart.deleteMany({
      where: { userId: userId }
    });

    return NextResponse.json({ 
      success: true, 
      order: order, 
      orderNumber: order.orderNumber 
    }, { status: 201 });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}