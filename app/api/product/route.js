import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ================= GET ALL PRODUCTS =================
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        id: "desc",
      },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// ================= CREATE PRODUCT =================
export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.name || !body.price || !body.stock) {
      return NextResponse.json(
        { error: "Name, price, and stock are required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name: body.name,
        price: Number(body.price),
        imageUrl: body.imageUrl || null,
        category: body.category, // LANGSUNG dari form
        stock: Number(body.stock), // LANGSUNG dari form
      },
    });

    console.log("✅ Product created:", product.name);
    return NextResponse.json(product);
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json(
      { error: "Failed to create product: " + error.message },
      { status: 500 }
    );
  }
}

// ================= UPDATE PRODUCT =================
export async function PUT(request) {
  try {
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name: body.name,
        price: Number(body.price),
        category: body.category,
        stock: Number(body.stock),
        ...(body.imageUrl && { imageUrl: body.imageUrl }),
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update product: " + error.message },
      { status: 500 }
    );
  }
}

// ================= DELETE PRODUCT =================
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete product: " + error.message },
      { status: 500 }
    );
  }
}