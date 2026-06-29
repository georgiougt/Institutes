"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const slugify_1 = require("../src/common/slugify");
const prisma = new client_1.PrismaClient();
async function main() {
    const instId = 'f269191b-41bf-491e-9d9e-fb1c411086ca';
    try {
        const inst = await prisma.institute.findUnique({
            where: { id: instId }
        });
        if (inst) {
            console.log('Original Slug:', inst.slug);
            const newSlug = (0, slugify_1.generateSlug)(inst.name);
            console.log('Attempting to update to slug:', newSlug);
            const updated = await prisma.institute.update({
                where: { id: instId },
                data: {
                    slug: newSlug
                }
            });
            console.log('Update result slug:', updated.slug);
        }
        else {
            console.log('Not found');
        }
    }
    catch (err) {
        console.error('Update failed:', err);
    }
    finally {
        await prisma.$disconnect();
    }
}
main();
//# sourceMappingURL=check-null-slugs.js.map