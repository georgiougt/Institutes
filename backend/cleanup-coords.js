const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Clear coordinates for all branches that have the hardcoded default
    const result = await prisma.branch.updateMany({
      where: {
        latitude: 35.1264,
        longitude: 33.3677
      },
      data: {
        latitude: null,
        longitude: null
      }
    });
    console.log(`Cleaned up ${result.count} branches with hardcoded coordinates.`);
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
