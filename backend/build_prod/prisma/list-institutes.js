"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const institutes = await prisma.institute.findMany({
        select: { id: true, name: true, ownerId: true }
    });
    console.log(JSON.stringify(institutes, null, 2));
}
main().finally(() => prisma.$disconnect());
//# sourceMappingURL=list-institutes.js.map