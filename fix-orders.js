const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function fixOrders() {
  try {
    console.log("🔧 Memperbaiki order dengan total 0...\n");

    // Ambil semua order dengan items
    const orders = await prisma.order.findMany({
      include: { items: true }
    });

    console.log(`📋 Total order: ${orders.length}\n`);

    for (const order of orders) {
      let calculatedTotal = 0;
      
      for (const item of order.items) {
        calculatedTotal += item.price * item.quantity;
      }

      // PAKAI FIELD YANG BENAR: 'total' atau 'subtotal'
      const currentTotal = order.total || order.subtotal || 0;
      
      if (currentTotal !== calculatedTotal) {
        console.log(`📦 Order ${order.orderNumber}:`);
        console.log(`   - Total lama: ${currentTotal}`);
        console.log(`   - Total baru: ${calculatedTotal}`);
        
        // Update menggunakan field 'total' (ganti sesuai schema Anda)
        await prisma.order.update({
          where: { id: order.id },
          data: { 
            total: calculatedTotal,  // ← PAKAI 'total' 
            subtotal: calculatedTotal // ← atau 'subtotal'
          }
        });
        
        console.log(`   ✅ Diperbaiki!\n`);
      } else {
        console.log(`✅ Order ${order.orderNumber}: total sudah benar (${currentTotal})\n`);
      }
    }

    console.log("🎉 Selesai memperbaiki semua order!");

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fixOrders();