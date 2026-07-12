const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const revisions = await prisma.instituteRevision.findMany({
    orderBy: { createdAt: 'desc' }
  });
  console.log(`Total revisions in DB: ${revisions.length}`);
  console.log(JSON.stringify(revisions, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
