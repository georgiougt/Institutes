const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const csvPath = 'backend/full_institutes_directory.csv';
  if (fs.existsSync(csvPath)) {
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    let iotaCount = 0;
    for (let i = 0; i < csvContent.length; i++) {
      if (csvContent.charCodeAt(i) === 0x0399) {
        iotaCount++;
      }
    }
    console.log(`Greek capital iotas (U+0399) in CSV: ${iotaCount}`);
  }

  const institutes = await prisma.institute.findMany({
    select: { id: true, name: true }
  });

  console.log('\nChecking all database institutes for U+0399 (Greek Capital Iota):');
  let dbCount = 0;
  for (const inst of institutes) {
    let hasIota = false;
    for (let i = 0; i < inst.name.length; i++) {
      if (inst.name.charCodeAt(i) === 0x0399) {
        hasIota = true;
      }
    }
    if (hasIota) {
      dbCount++;
      console.log(`- ID: ${inst.id}, Name: ${inst.name}`);
      // Print char codes to be absolutely sure
      const codes = [...inst.name].map(c => `U+${c.charCodeAt(0).toString(16).padStart(4, '0')}`).join(' ');
      console.log(`  Char codes: ${codes}`);
    }
  }
  console.log(`Total database institutes with Greek Capital Iota in name: ${dbCount}`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
