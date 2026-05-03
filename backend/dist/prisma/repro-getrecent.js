"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function testGetRecent(lat, lng) {
    console.log(`Testing getRecent with lat=${lat}, lng=${lng}`);
    let ids = [];
    try {
        if (lat && lng) {
            console.log('Running raw SQL query...');
            const nearby = await prisma.$queryRaw `
        SELECT 
          i.id,
          6371 * acos(
            cos(radians(${lat})) * cos(radians(b.latitude)) * 
            cos(radians(b.longitude) - radians(${lng})) + 
            sin(radians(${lat})) * sin(radians(b.latitude))
          ) as distance
        FROM "Institute" i
        INNER JOIN "Branch" b ON b."instituteId" = i.id
        WHERE i.status = 'APPROVED'
        AND b.latitude IS NOT NULL AND b.longitude IS NOT NULL
        ORDER BY distance ASC
        LIMIT 3;
      `;
            ids = nearby.map(n => n.id);
            console.log(`Found ${ids.length} nearby IDs.`);
        }
        console.log('Running findMany query...');
        const startTime = Date.now();
        const institutes = await prisma.institute.findMany({
            where: ids.length > 0
                ? { id: { in: ids } }
                : { status: 'APPROVED' },
            include: {
                images: { orderBy: { createdAt: 'desc' }, take: 1 },
                owner: { select: { firstName: true } },
                branches: { include: { city: true }, take: 1 },
                reviews: {
                    where: { status: 'APPROVED' },
                    select: { rating: true },
                },
            },
            orderBy: ids.length > 0 ? undefined : { createdAt: 'desc' },
            take: 3,
        });
        const endTime = Date.now();
        console.log(`Query finished in ${endTime - startTime}ms. Returned ${institutes.length} records.`);
    }
    catch (error) {
        console.error('Query Error:', error);
    }
}
async function run() {
    console.log('--- TEST 1: NO LOCATION ---');
    await testGetRecent();
    console.log('\n--- TEST 2: WITH LOCATION ---');
    await testGetRecent(38.2466, 21.7346);
}
run().finally(() => prisma.$disconnect());
//# sourceMappingURL=repro-getrecent.js.map