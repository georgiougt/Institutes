const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const el = await prisma.institute.findFirst({
    where: { name: 'Elesson' }
  });
  console.log(`Elesson ID: ${el.id}`);
  console.log(`Elesson Slug: ${el.slug}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
