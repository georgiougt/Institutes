const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const missing = await prisma.institute.findFirst({
    where: { slug: null },
    include: {
      owner: {
        select: { id: true, email: true, firstName: true, lastName: true }
      }
    }
  });
  console.log('Institute without slug:', JSON.stringify(missing, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
