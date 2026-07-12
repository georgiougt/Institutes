const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const inst = await prisma.institute.findFirst({
    where: { name: { contains: 'ΚΑΤΣΙΑΡΤΟΥ', mode: 'insensitive' } },
    include: {
      branches: { include: { city: true } }
    }
  });

  if (inst) {
    console.log('Institute:', inst.name);
    console.log('Branches:', JSON.stringify(inst.branches, null, 2));
  } else {
    console.log('Institute not found');
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
