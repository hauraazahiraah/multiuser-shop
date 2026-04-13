const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const user = await prisma.user.update({
      where: { email: "admin@mail.com" },
      data: { role: "admin" }
    });
    console.log(`✅ Role berhasil diubah: ${user.email} -> ${user.role}`);
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}
main();