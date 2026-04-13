const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = "admin@mail.com"; // user admin yang sudah ada
  try {
    const updated = await prisma.user.update({
      where: { email },
      data: { role: "admin" } // huruf kecil
    });
    console.log(`✅ Role untuk ${updated.email} diubah menjadi: ${updated.role}`);
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();