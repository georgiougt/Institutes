"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const name = 'Μελετητήριο';
    const slug = 'meletitirio';
    const existing = await prisma.service.findUnique({
        where: { name }
    });
    if (existing) {
        console.log(`Service ${name} already exists.`);
        return;
    }
    const service = await prisma.service.create({
        data: {
            name,
            slug,
            category: 'Academic',
            description: 'Homework help and test preparation',
            iconUrl: '/subjects/study.png',
            displayOrder: 10,
        }
    });
    console.log(`Created service: ${service.name}`);
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=add-meletitirio.js.map