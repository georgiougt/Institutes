"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const verified = await prisma.institute.findMany({
        where: { isVerified: true },
        select: { id: true, name: true, isVerified: true, verifiedAt: true }
    });
    if (verified.length === 0) {
        console.log('No institutes are currently verified.');
    }
    else {
        console.log('Verified Institutes found:', JSON.stringify(verified, null, 2));
    }
}
main().finally(() => prisma.$disconnect());
//# sourceMappingURL=check-verified.js.map