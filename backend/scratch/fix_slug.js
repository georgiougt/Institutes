const { PrismaClient } = require('@prisma/client');
const { generateSlug } = require('../dist/src/common/slugify.js');
const prisma = new PrismaClient();

async function main() {
  const slug = generateSlug('Savvas Christou Private Institute');
  console.log('Generated slug:', slug);
  await prisma.institute.update({
    where: { id: 'bb7da446-6cfc-452d-a6f6-bf91a267ee26' },
    data: { slug }
  });
  console.log('Fixed slug for bb7da446-6cfc-452d-a6f6-bf91a267ee26');
}

main().catch(console.error).finally(() => prisma.$disconnect());
