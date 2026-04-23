import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const instituteId = '6b290308-cf5c-4623-91ae-73cbc7aeb8ca'; // Elesson
  
  console.log(`Activating Featured Placement for: Elesson (${instituteId})`);
  
  const now = new Date();
  const endsAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 1 month

  // Transaction to update institute and create listing record
  await prisma.$transaction([
    prisma.institute.update({
      where: { id: instituteId },
      data: { isFeatured: true }
    }),
    prisma.featuredListing.create({
      data: {
        instituteId: instituteId,
        startsAt: now,
        endsAt: endsAt,
        isActive: true,
        placementType: 'SEARCH_TOP',
        createdBy: 'MANUAL_ACTIVATION'
      }
    })
  ]);

  console.log(`SUCCESS: Institute is now FEATURED until ${endsAt.toLocaleDateString()}.`);
}

main().finally(() => prisma.$disconnect());
