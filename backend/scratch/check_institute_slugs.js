const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const total = await prisma.institute.count();
  const withSlug = await prisma.institute.count({
    where: { slug: { not: null } }
  });
  console.log(`Total institutes: ${total}`);
  console.log(`Institutes with slugs: ${withSlug}`);
  console.log(`Institutes without slugs: ${total - withSlug}`);

  const sample = await prisma.institute.findMany({
    take: 10,
    select: { name: true, slug: true }
  });
  console.log('\n--- Sample ---');
  sample.forEach(inst => {
    console.log(`${inst.name}: ${inst.slug}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
