"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Resetting all premium statuses...');
    const updated = await prisma.institute.updateMany({
        data: {
            isVerified: false,
            isFeatured: false,
            verifiedUntil: null,
            verifiedAt: null,
        }
    });
    const deleted = await prisma.featuredListing.deleteMany({});
    console.log(`Successfully reset ${updated.count} institutes.`);
    console.log(`Deleted ${deleted.count} featured listings.`);
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=reset-premium.js.map