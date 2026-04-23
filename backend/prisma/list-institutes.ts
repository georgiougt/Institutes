import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const institutes = await prisma.institute.findMany({
    select: { id: true, name: true, ownerId: true }
  });
  console.log(JSON.stringify(institutes, null, 2));
}

main().finally(() => prisma.$disconnect());
