const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const associations = await prisma.instituteService.groupBy({
    by: ['serviceId'],
    _count: true
  });
  
  const services = await prisma.service.findMany();
  const serviceMap = {};
  services.forEach(s => { serviceMap[s.id] = s.name; });

  console.log('--- Service Associations ---');
  for (const assoc of associations) {
    const name = serviceMap[assoc.serviceId] || 'Unknown';
    console.log(`${name} (${assoc.serviceId}): ${assoc._count} institutes`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
