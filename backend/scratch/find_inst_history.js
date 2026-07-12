const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const instituteId = 'b4d79bfa-c27b-43dd-9019-c82e8d4c188f';
  
  const statusHistory = await prisma.instituteStatusHistory.findMany({
    where: { instituteId },
    orderBy: { createdAt: 'desc' }
  });
  console.log('Status History:', JSON.stringify(statusHistory, null, 2));

  const revisions = await prisma.instituteRevision.findMany({
    where: { instituteId },
    orderBy: { createdAt: 'desc' }
  });
  console.log('Revisions:', JSON.stringify(revisions, null, 2));

  const auditLogs = await prisma.auditLog.findMany({
    where: { entityId: instituteId },
    orderBy: { createdAt: 'desc' }
  });
  console.log('Audit Logs:', JSON.stringify(auditLogs, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
