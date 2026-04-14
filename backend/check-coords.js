const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCoords() {
  const branches = await prisma.branch.findMany({
    where: { city: { name: 'Λεμεσός' } },
    select: { id: true, name: true, latitude: true, longitude: true }
  });
  
  console.log('Limassol Branches:');
  branches.forEach(b => {
    console.log(`${b.name}: Lat ${b.latitude}, Lng ${b.longitude}`);
  });
  process.exit();
}

checkCoords();
