const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const inst = await prisma.institute.findUnique({
    where: { id: '8373ab34-2094-45d9-9bb4-355dfd34bde2' }
  });
  if (inst) {
    console.log('Name:', inst.name);
    const codes = [...inst.name].map(c => `U+${c.charCodeAt(0).toString(16).padStart(4, '0')} (${c})`).join(', ');
    console.log('Char codes:', codes);
  } else {
    console.log('Institute not found');
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
