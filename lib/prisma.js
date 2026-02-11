import { PrismaClient } from "@prisma/client";

const globalForPrisma = global;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"],
  });

if (!globalForPrisma.prisma) globalForPrisma.prisma = prisma;

export default prisma;
