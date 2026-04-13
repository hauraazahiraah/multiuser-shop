const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function fixOrders() {
  try {
    console.log("🔧 Memperbaiki order...\n");
    const orders = await prisma.order.findMany({ include: { items: true } });
    
    for (const order of orders) {
      let totalItems = 0;
      for (const item of order.items) {
        totalItems += item.price * item.quantity;
      }
      const totalBaru = totalItems + (order.shippingCost || 0);
      
      if (order.total !== totalBaru) {
        console.log(`${order.orderNumber}: ${order.total} -> ${totalBaru}`);
        await prisma.order.update({
          where: { id: order.id },
          data: { total: totalBaru, subtotal: totalItems }
        });
      }
    }
    console.log("\n✅ Selesai!");
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}
fixOrders();