"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const counts = await prisma.institute.groupBy({
        by: ['status'],
        _count: true,
    });
    console.log('Status Counts:', JSON.stringify(counts, null, 2));
    const elesson = await prisma.institute.findFirst({
        where: { name: 'Elesson' }
    });
    console.log('Elesson Status:', elesson?.status);
}
main().catch(console.error).finally(() => prisma.$disconnect());
//# sourceMappingURL=check-db.js.map