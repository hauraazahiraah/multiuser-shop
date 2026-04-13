import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (session?.user?.role?.toLowerCase() !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ambil semua order yang totalAmount-nya 0
    const orders = await prisma.order.findMany({
      where: { totalAmount: 0 },
      include: { items: true }
    });

    let fixedCount = 0;

    for (const order of orders) {
      // Hitung ulang total dari items
      let calculatedTotal = 0;
      for (const item of order.items) {
        calculatedTotal += item.price * item.quantity;
      }

      // Update total amount
      if (calculatedTotal > 0) {
        await prisma.order.update({
          where: { id: order.id },
          data: { totalAmount: calculatedTotal }
        });
        fixedCount++;
        console.log(`✅ Fixed order ${order.orderNumber}: ${calculatedTotal}`);
      }
    }

    return NextResponse.json({ 
      success: true, 
      fixedCount,
      message: `${fixedCount} orders fixed`
    });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}