const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkSchema() {
  try {
    // Ambil 1 order untuk lihat field-nya
    const order = await prisma.order.findFirst({
      include: { items: true }
    });
    
    if (order) {
      console.log("📋 FIELD YANG TERSEDIA DI ORDER:");
      console.log(Object.keys(order));
      console.log("\n📦 Contoh data order:");
      console.log("orderNumber:", order.orderNumber);
      console.log("total:", order.total);
      console.log("subtotal:", order.subtotal);
      console.log("status:", order.status);
      console.log("paymentStatus:", order.paymentStatus);
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSchema();