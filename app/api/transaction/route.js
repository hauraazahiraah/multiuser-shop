export async function GET(req){

  const userId = req.cookies.get("userId").value;

  const data = await prisma.transaction.findMany({
    where:{ userId:Number(userId) }
  });

  return NextResponse.json(data);
}
