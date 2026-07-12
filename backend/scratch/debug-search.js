const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const cities = await prisma.city.findMany();
  console.log('--- CITIES ---');
  console.table(cities.map(c => ({ id: c.id, name: c.name, nameEn: c.nameEn })));

  const services = await prisma.service.findMany();
  console.log('\n--- SERVICES ---');
  console.table(services.map(s => ({ id: s.id, name: s.name })));

  const nicosia = cities.find(c => c.nameEn === 'Nicosia' || c.name === 'Λευκωσία');
  const pafos = cities.find(c => c.nameEn === 'Paphos' || c.name === 'Πάφος');
  const english = services.find(s => s.name === 'Αγγλικά' || s.name === 'English');

  console.log(`\nNicosia ID: ${nicosia?.id}`);
  console.log(`Paphos ID: ${pafos?.id}`);
  console.log(`English ID: ${english?.id}`);

  // Let's import the InstitutesService search logic
  // Since we want to check what the service returns, let's call it!
  // To avoid compiling/nest DI, we can write a function that mimics InstitutesService.search or just query the DB.
  
  // Let's search with Nicosia and English (no lat/lng first)
  console.log('\nQuerying Prisma with cityId = Nicosia and serviceId = English...');
  const matchesFallback = await prisma.institute.findMany({
    where: {
      status: 'APPROVED',
      branches: {
        some: {
          cityId: nicosia.id
        }
      },
      services: {
        some: {
          serviceId: english.id
        }
      }
    },
    select: { id: true, name: true, branches: { select: { city: { select: { name: true } } } } }
  });
  console.log(`Found ${matchesFallback.length} matches (fallback):`);
  console.log(JSON.stringify(matchesFallback, null, 2));

  // Let's check if the institute "Μ. ΚΑΤΣΙΑΡΤΟΥ ΠΑΠΑΣΤΥΛΙΑΝΟΥ" matches anything in the DB
  const specific = await prisma.institute.findFirst({
    where: { name: { contains: 'ΚΑΤΣΙΑΡΤΟΥ' } },
    include: {
      branches: { include: { city: true } },
      services: { include: { service: true } }
    }
  });
  console.log('\nSpecific Institute details:');
  console.log(JSON.stringify(specific, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
