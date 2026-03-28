const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const insts = await prisma.institute.findMany({
      where: { name: { contains: 'Elesson', mode: 'insensitive' } },
      include: { 
        branches: {
          include: { city: true }
        }
      }
    });
    console.log(JSON.stringify(insts, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
