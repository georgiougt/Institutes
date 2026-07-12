const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const services = await prisma.service.findMany({
    orderBy: { name: 'asc' }
  });
  console.log('--- Services in DB ---');
  services.forEach(s => {
    console.log(`${s.name}: ${s.id}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
