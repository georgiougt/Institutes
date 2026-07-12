const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const institutes = await prisma.institute.findMany({
    where: { slug: null }
  });
  console.log('Institutes with null slug:', institutes.length);
  for (const inst of institutes) {
    console.log(inst.id, inst.name, inst.status, inst.createdAt);
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
