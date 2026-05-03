"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const instituteId = '6b290308-cf5c-4623-91ae-73cbc7aeb8ca';
    console.log(`Activating Verified Badge for: Elesson (${instituteId})`);
    await prisma.institute.update({
        where: { id: instituteId },
        data: {
            isVerified: true,
            verifiedAt: new Date(),
            verifiedUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
    });
    console.log('SUCCESS: Institute is now VERIFIED.');
}
main().finally(() => prisma.$disconnect());
//# sourceMappingURL=manual-activate.js.map