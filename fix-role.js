const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = "admin@mail.com";
  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: "admin" } // huruf kecil
    });
    console.log(`✅ Role updated: ${user.email} -> ${user.role}`);
  } catch (error) {
    console.error(error);
  }
}
main();