const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Updating cities to Cyprus...');

  // Update existing cities to Cypriot ones to maintain relations
  const athens = await prisma.city.findFirst({ where: { name: 'Αθήνα' } });
  if (athens) {
    await prisma.city.update({
      where: { id: athens.id },
      data: { name: 'Λευκωσία' }
    });
    console.log('Updated Αθήνα to Λευκωσία');
  }

  const thessaloniki = await prisma.city.findFirst({ where: { name: 'Θεσσαλονίκη' } });
  if (thessaloniki) {
    await prisma.city.update({
      where: { id: thessaloniki.id },
      data: { name: 'Λεμεσός' }
    });
    console.log('Updated Θεσσαλονίκη to Λεμεσός');
  }

  // Add the rest
  const otherCities = ['Λάρνακα', 'Πάφος', 'Αμμόχωστος'];
  for (const name of otherCities) {
    const exists = await prisma.city.findFirst({ where: { name } });
    if (!exists) {
      await prisma.city.create({ data: { name } });
      console.log(`Created ${name}`);
    }
  }

  console.log('City update completed!');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
