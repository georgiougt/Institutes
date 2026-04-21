const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Attempting to connect to database...');
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('Database connection successful:', result);
    
    const count = await prisma.institute.count();
    console.log('Number of institutes in DB:', count);
    
  } catch (e) {
    console.error('Database connection failed!');
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
