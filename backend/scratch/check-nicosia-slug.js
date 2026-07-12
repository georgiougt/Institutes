const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const nicosia = await prisma.city.findFirst({
    where: { name: 'Λευκωσία' }
  });
  console.log('Nicosia city object:', JSON.stringify(nicosia, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
