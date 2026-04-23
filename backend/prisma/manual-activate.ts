import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const instituteId = '6b290308-cf5c-4623-91ae-73cbc7aeb8ca'; // Corrected ID for Elesson
  
  console.log(`Activating Verified Badge for: Elesson (${instituteId})`);
  
  await prisma.institute.update({
    where: { id: instituteId },
    data: {
      isVerified: true,
      verifiedAt: new Date(),
      verifiedUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 1 month
    }
  });

  console.log('SUCCESS: Institute is now VERIFIED.');
}

main().finally(() => prisma.$disconnect());
