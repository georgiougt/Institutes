"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const instituteId = '6b290308-cf5c-4623-91ae-73cbc7aeb8ca';
    console.log(`Activating Featured Placement for: Elesson (${instituteId})`);
    const now = new Date();
    const endsAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
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
//# sourceMappingURL=manual-feature.js.map