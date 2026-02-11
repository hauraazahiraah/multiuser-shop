import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req){

  const userId = req.cookies.get("userId").value;

  const cart = await prisma.cart.findMany({
    where:{ userId:Number(userId) },
    include:{
      product:true
    }
  });

  return NextResponse.json(cart);
}
