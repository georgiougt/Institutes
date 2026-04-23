import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const counts = await prisma.institute.groupBy({
    by: ['status'],
    _count: true,
  });
  console.log('Status Counts:', JSON.stringify(counts, null, 2));

  const elesson = await prisma.institute.findFirst({
    where: { name: 'Elesson' }
  });
  console.log('Elesson Status:', elesson?.status);
}

main().catch(console.error).finally(() => prisma.$disconnect());
