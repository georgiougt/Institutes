const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const logs = await prisma.auditLog.findMany({
    where: { entityId: 'bb7da446-6cfc-452d-a6f6-bf91a267ee26' },
    orderBy: { createdAt: 'asc' }
  });
  console.log(JSON.stringify(logs, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
