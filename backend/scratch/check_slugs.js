const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const cities = await prisma.city.findMany({
    select: { id: true, name: true, slug: true }
  });
  const services = await prisma.service.findMany({
    select: { id: true, name: true, slug: true }
  });

  console.log('--- City Slugs ---');
  cities.forEach(c => {
    console.log(`${c.name}: ${c.slug} (${c.id})`);
  });

  console.log('\n--- Service Slugs ---');
  services.forEach(s => {
    console.log(`${s.name}: ${s.slug} (${s.id})`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());

