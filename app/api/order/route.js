import { NextResponse } from "next/server"; 
import { getServerSession } from "next-auth"; 
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 
import prisma from "@/lib/prisma"; 
 
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
      const price = parseInt(items[i].price) || 0; 
      const quantity = parseInt(items[i].quantity) || 0; 
      calculatedSubtotal = calculatedSubtotal + (price * quantity); 
    } 
    const shipping = parseInt(shippingCost) || 0; 
    const calculatedTotal = calculatedSubtotal + shipping; 
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
          create: items.map(function(item) { return { 
            productId: parseInt(item.productId), 
            quantity: parseInt(item.quantity), 
            price: parseInt(item.price) 
          }; }), 
        } 
      }, 
      include: { items: true } 
    }); 
    await prisma.cart.deleteMany({ where: { userId: userId } }); 
    return NextResponse.json({ success: true, order: order, orderNumber: order.orderNumber }, { status: 201 }); 
  } catch (error) { 
    console.error("Error creating order:", error); 
    return NextResponse.json({ error: error.message }, { status: 500 }); 
  } 
} 
