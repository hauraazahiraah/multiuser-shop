const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // =========================
  // HASH PASSWORD
  // =========================
  const hashedPassword = await bcrypt.hash("123456", 10);

  // =========================
  // CREATE ADMIN
  // =========================
  const admin = await prisma.user.upsert({
    where: { email: "admin@mail.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@mail.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  // =========================
  // CREATE USER
  // =========================
  const user = await prisma.user.upsert({
    where: { email: "user@mail.com" },
    update: {},
    create: {
      name: "User",
      email: "user@mail.com",
      password: hashedPassword,
      role: "USER",
    },
  });

  // =========================
  // CREATE PRODUCTS
  // =========================
  await prisma.product.createMany({
    data: [
      {
        name: "Nasi Goreng",
        price: 15000,
        stock: 20,
        category: "Makanan",
      },
      {
        name: "Mie Ayam",
        price: 12000,
        stock: 15,
        category: "Makanan",
      },
      {
        name: "Es Teh",
        price: 5000,
        stock: 50,
        category: "Minuman",
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Seeding selesai!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
