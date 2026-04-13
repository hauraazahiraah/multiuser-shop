const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function fixOrderItems() {
  try {
    // Ambil semua order yang totalnya 0
    const orders = await prisma.order.findMany({
      where: { total: 0 },
      include: { items: true }
    });

    console.log(`📋 Ditemukan ${orders.length} order dengan total 0\n`);

    for (const order of orders) {
      console.log(`📦 Order: ${order.orderNumber}`);
      console.log(`   Items saat ini: ${order.items.length}`);
      
      if (order.items.length === 0) {
        console.log(`   ⚠️ Order ini TIDAK MEMILIKI ITEMS!`);
        console.log(`   Perlu dibuat ulang dari awal (checkout ulang)`);
      } else {
        // Hitung ulang total dari items yang ada
        let totalItems = 0;
        for (const item of order.items) {
          totalItems += item.price * item.quantity;
        }
        const totalBaru = totalItems + (order.shippingCost || 0);
        
        console.log(`   Total items: ${totalItems}`);
        console.log(`   Total baru: ${totalBaru}`);
        
        await prisma.order.update({
          where: { id: order.id },
          data: { 
            total: totalBaru,
            subtotal: totalItems
          }
        });
        console.log(`   ✅ Diperbaiki!\n`);
      }
    }

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fixOrderItems();