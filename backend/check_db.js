const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const institutes = await prisma.institute.findMany({
    select: { id: true, name: true, ownerId: true }
  });
  console.log('Institutes and Owners:');
  console.table(institutes);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
