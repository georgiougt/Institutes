const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Searching with English I (contains 'YIANGOU')...");
  const instsEng = await prisma.institute.findMany({
    where: { name: { contains: 'YIANGOU', mode: 'insensitive' } },
    include: { branches: true }
  });
  console.log('Found with English I:', JSON.stringify(instsEng, null, 2));

  console.log("\nSearching with Greek Iota (contains 'YΙANGOU')...");
  // Note: the second letter here is U+0399 (Greek Capital Iota)
  const instsGr = await prisma.institute.findMany({
    where: { name: { contains: 'YΙANGOU', mode: 'insensitive' } },
    include: { branches: true }
  });
  console.log('Found with Greek Iota:', JSON.stringify(instsGr, null, 2));

  console.log("\nSearching user/owner with email info@yiangoueducation.com...");
  const user = await prisma.user.findUnique({
    where: { email: 'info@yiangoueducation.com' }
  });
  console.log('User:', JSON.stringify(user, null, 2));

  console.log("\nSearching all revisions for any institute related to YIANGOU...");
  const revisions = await prisma.instituteRevision.findMany({
    orderBy: { createdAt: 'desc' }
  });
  console.log('Total Revisions in DB:', revisions.length);
  const yiangouRevs = revisions.filter(r => 
    JSON.stringify(r.proposedData).toUpperCase().includes('YIANGOU') ||
    JSON.stringify(r.proposedData).toUpperCase().includes('YΙANGOU')
  );
  console.log('Yiangou Revisions:', JSON.stringify(yiangouRevs, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
