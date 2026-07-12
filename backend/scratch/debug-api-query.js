const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const slugs = 'nicosia,agglika';
  let cityId = undefined;
  let serviceId = undefined;
  let country = 'CY';

  const slugList = slugs.split(',');
  const cityMatches = await prisma.city.findMany({
    where: { slug: { in: slugList } }
  });
  const serviceMatches = await prisma.service.findMany({
    where: { slug: { in: slugList } }
  });
  
  if (cityMatches.length > 0) cityId = cityMatches[0].id;
  if (serviceMatches.length > 0) serviceId = serviceMatches[0].id;

  console.log('Resolved cityId:', cityId, cityMatches.map(c => c.name));
  console.log('Resolved serviceId:', serviceId, serviceMatches.map(s => s.name));

  const allMatches = await prisma.institute.findMany({
    where: {
      status: 'APPROVED',
      branches: cityId || country ? {
        some: {
          cityId: cityId || undefined,
          city: country ? { countryCode: country.toUpperCase() } : undefined
        }
      } : undefined,
      services: serviceId ? { some: { serviceId } } : undefined,
    },
    select: {
      id: true,
      name: true,
      branches: {
        select: {
          city: {
            select: { name: true }
          }
        }
      }
    }
  });

  console.log(`Found ${allMatches.length} matches:`);
  const specific = allMatches.find(m => m.name.includes('ΚΑΤΣΙΑΡΤΟΥ'));
  console.log('Is specific matched?', !!specific);
  if (specific) {
    console.log('Specific:', JSON.stringify(specific, null, 2));
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
