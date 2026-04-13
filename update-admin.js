const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 🔥 GANTI EMAIL INI dengan email yang Anda pakai untuk login ke aplikasi
  const email = "admin@example.com";  // <--------- UBAH INI

  try {
    // Cek apakah user dengan email tersebut ada
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log(`❌ User dengan email "${email}" tidak ditemukan.`);
      console.log("\n📋 Daftar semua user yang terdaftar:");
      const allUsers = await prisma.user.findMany({
        select: { id: true, email: true, role: true }
      });
      console.table(allUsers);
      return;
    }

    // Update role menjadi admin
    const updated = await prisma.user.update({
      where: { email },
      data: { role: "admin" }
    });
    console.log(`✅ BERHASIL! User ${updated.email} sekarang memiliki role: ${updated.role}`);
  } catch (error) {
    console.error("❌ Terjadi error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();