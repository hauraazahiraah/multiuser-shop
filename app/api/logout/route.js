import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json({ success: true });
  
  // HAPUS COOKIE
  response.cookies.set({
    name: "userId",
    value: "",
    maxAge: 0,
    path: "/",
  });
  
  response.cookies.set({
    name: "role",
    value: "",
    maxAge: 0,
    path: "/",
  });

  console.log("✅ Logout success");
  return response;
}