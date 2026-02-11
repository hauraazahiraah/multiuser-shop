import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// ================= GET =================
export async function GET(req, context) {
  const params = await context.params;
  const id = params.id;

  const product = await prisma.product.findUnique({
    where: { id: Number(id) }
  });

  if (!product) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}

// ================= PUT =================
export async function PUT(req, context) {
  const params = await context.params;
  const id = params.id;
  const body = await req.json();

  const product = await prisma.product.update({
    where: { id: Number(id) },
    data: {
      name: body.name,
      price: Number(body.price),
      imageUrl: body.imageUrl,
      category: body.category,
      stock: Number(body.stock)
    }
  });

  return NextResponse.json(product);
}

// ================= DELETE =================
export async function DELETE(req, context) {
  const params = await context.params;
  const id = params.id;

  if (!id) {
    return NextResponse.json({ message: "ID missing" }, { status: 400 });
  }

  await prisma.product.delete({
    where: { id: Number(id) }
  });

  return NextResponse.json({ success: true });
}
