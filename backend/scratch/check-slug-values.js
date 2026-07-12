const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const cities = await prisma.city.findMany({
    select: { id: true, name: true, slug: true }
  });
  console.log('--- CITIES ---');
  console.table(cities);

  const services = await prisma.service.findMany({
    select: { id: true, name: true, slug: true }
  });
  console.log('\n--- SERVICES ---');
  console.table(services);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
