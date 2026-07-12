const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const inst = await prisma.institute.findUnique({
    where: { id: 'bb7da446-6cfc-452d-a6f6-bf91a267ee26' },
    include: { branches: true, members: true, owner: true, statusHistory: true, claims: true }
  });
  console.log(JSON.stringify(inst, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
