const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const cities = await prisma.city.findMany({
    select: { id: true, name: true, nameEn: true, slug: true }
  });
  console.log('--- Cities ---');
  cities.forEach(c => {
    console.log(`${c.name} (nameEn: ${c.nameEn}, slug: ${c.slug})`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
