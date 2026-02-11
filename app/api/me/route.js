import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = cookies();

  const token = cookieStore.get("token")?.value;
  const role = cookieStore.get("role")?.value;

  if (!token) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (role !== "admin") {
    return new NextResponse("Forbidden", { status: 403 });
  }

  return NextResponse.json({ ok: true, role });
}
