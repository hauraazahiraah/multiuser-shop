const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function fixOrders() {
  try {
    console.log("🔧 Memperbaiki order yang totalnya tidak sesuai...\n");

    // Ambil semua order dengan items
    const orders = await prisma.order.findMany({
      include: { items: true }
    });

    console.log(`📋 Total order: ${orders.length}\n`);
    let fixedCount = 0;

    for (const order of orders) {
      // Hitung total dari items
      let calculatedSubtotal = 0;
      for (const item of order.items) {
        calculatedSubtotal += item.price * item.quantity;
      }

      // Tambah ongkir
      const shippingCost = order.shippingCost || 0;
      const calculatedTotal = calculatedSubtotal + shippingCost;

      // Cek apakah subtotal atau total perlu diperbaiki
      if (order.subtotal !== calculatedSubtotal || order.total !== calculatedTotal) {
        console.log(`📦 Order: ${order.orderNumber}`);
        console.log(`   - Subtotal lama: Rp ${order.subtotal}`);
        console.log(`   - Subtotal baru: Rp ${calculatedSubtotal}`);
        console.log(`   - Total lama: Rp ${order.total}`);
        console.log(`   - Total baru: Rp ${calculatedTotal}`);
        console.log(`   - Ongkir: Rp ${shippingCost}`);
        
        await prisma.order.update({
          where: { id: order.id },
          data: { 
            subtotal: calculatedSubtotal,
            total: calculatedTotal
          }
        });
        
        fixedCount++;
        console.log(`   ✅ Diperbaiki!\n`);
      } else {
        console.log(`✅ Order ${order.orderNumber}: sudah benar (Rp ${order.total})\n`);
      }
    }

    console.log(`🎉 Selesai! ${fixedCount} order diperbaiki.`);

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fixOrders();