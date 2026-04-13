const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkRoles() {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true }
    });
    
    console.log("📋 USERS IN DATABASE:");
    console.table(users);
    
    // Cek apakah ada user dengan role ADMIN
    const adminExists = users.some(u => u.role?.toLowerCase() === 'admin');
    console.log(`\n✅ Admin exists: ${adminExists}`);
    
    if (!adminExists) {
      console.log("\n⚠️ TIDAK ADA USER DENGAN ROLE ADMIN!");
      console.log("Jalankan script berikut untuk bikin admin:");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkRoles();