import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ TAMBAHAN PATCH (UPDATE STATUS)
export async function PATCH(req, context) {
  try {
    const { id } = await context.params;
    const orderId = Number(id);

    if (isNaN(orderId)) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    const body = await req.json();

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: body.status,
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Patch error:", error);
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }
}

// ✅ DELETE LU TETAP UTUH
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const orderId = Number(id);

    if (isNaN(orderId)) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    await prisma.orderItem.deleteMany({
      where: { orderId: orderId },
    });

    await prisma.order.delete({
      where: { id: orderId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
  }
}
