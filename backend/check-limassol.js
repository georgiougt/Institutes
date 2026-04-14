const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
  const institutes = await prisma.institute.findMany({
    where: { 
      status: 'APPROVED',
      branches: { some: { city: { name: 'Λεμεσός' } } }
    },
    include: {
      branches: { include: { city: true } },
      reviews: true
    }
  });
  
  console.log(`Found ${institutes.length} approved institutes in Limassol.`);
  institutes.forEach(inst => {
    console.log(`Name: ${inst.name}, Reviews: ${inst.reviews.length}, Branches: ${inst.branches.length}`);
  });
  process.exit();
}

checkData();
