const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const updates = [
  {
    id: '18b3a4ae-224b-4da9-b5f2-96cb6f3010cd',
    oldName: 'E.T. ΄΄ENGLISH AVENUE΄΄',
    newName: 'E.T. "ENGLISH AVENUE"'
  },
  {
    id: '48553bc3-86b2-43fc-83cf-3809c7b2cdcd',
    oldName: 'Κέντρο Ξένων Γλωσσών ΞΑΝΘΑΚΟΥ AΙΚΑΤΕΡΙΝΗ',
    newName: 'Κέντρο Ξένων Γλωσσών ΞΑΝΘΑΚΟΥ ΑΙΚΑΤΕΡΙΝΗ'
  },
  {
    id: 'c3fc80a7-4d33-4619-ad79-4a5d216c618f',
    oldName: 'Κέντρο Ξένων Γλωσσών ZEΥΓΙΤΟΥ ΚΩΝΣΤΑΝΤΙΝΑ',
    newName: 'Κέντρο Ξένων Γλωσσών ΖΕΥΓΙΤΟΥ ΚΩΝΣΤΑΝΤΙΝΑ'
  },
  {
    id: '8373ab34-2094-45d9-9bb4-355dfd34bde2',
    oldName: 'YΙANGOU EDUCATIONAL HALL LTD',
    newName: 'YIANGOU EDUCATIONAL HALL LTD'
  },
  {
    id: 'c3ffd212-ab24-4afd-8a27-0c6c565f32e4',
    oldName: 'Κέντρο Ξένων Γλωσσών ΜΑΚΑΡΟΥΝΗ AΘΑΝΑΣΙΑ',
    newName: 'Κέντρο Ξένων Γλωσσών ΜΑΚΑΡΟΥΝΗ ΑΘΑΝΑΣΙΑ'
  },
  {
    id: 'f1a83152-40f8-4bbc-b873-dd4db249a983',
    oldName: 'Κέντρο Ξένων Γλωσσών ΘΩΜΟΠΟΥΛΟΥ AΝΤΙΓΟΝΗ',
    newName: 'Κέντρο Ξένων Γλωσσών ΘΩΜΟΠΟΥΛΟΥ ΑΝΤΙΓΟΝΗ'
  },
  {
    id: 'f0ec9899-7698-4d1c-9efa-dc96d242415c',
    oldName: 'Κέντρο Ξένων Γλωσσών KOKKINOΣ ΔΗΜΗΤΡΙΟΣ',
    newName: 'Κέντρο Ξένων Γλωσσών ΚΟΚΚΙΝΟΣ ΔΗΜΗΤΡΙΟΣ'
  },
  {
    id: 'e79cd374-39b7-48d5-89e3-aa4584a8bda6',
    oldName: 'Κέντρο Ξένων Γλωσσών ΚΡΗΤΙΚΟΥ ΟΛYΜΠΙΑ',
    newName: 'Κέντρο Ξένων Γλωσσών ΚΡΗΤΙΚΟΥ ΟΛΥΜΠΙΑ'
  },
  {
    id: '48fbae29-4f57-4ff9-93a4-ee40b9c995b9',
    oldName: 'Κέντρο Ξένων Γλωσσών KΩΣΤΑΡΟΓΛΟΥ ΕΥΔΟΚΙΑ',
    newName: 'Κέντρο Ξένων Γλωσσών ΚΩΣΤΑΡΟΓΛΟΥ ΕΥΔΟΚΙΑ'
  }
];

async function main() {
  console.log('--- 1. CLEANING UP MIXED-SCRIPT NAMES ---');
  for (const item of updates) {
    const inst = await prisma.institute.findUnique({ where: { id: item.id } });
    if (inst) {
      console.log(`Updating name of "${inst.name}" (ID: ${item.id}) to "${item.newName}"...`);
      await prisma.institute.update({
        where: { id: item.id },
        data: { name: item.newName }
      });
      console.log(`Success.`);
    } else {
      console.log(`Institute with ID ${item.id} not found.`);
    }
  }

  console.log('\n--- 2. UPDATING YIANGOU WEBSITE URL AND APPROVING REVISIONS ---');
  const yiangouId = '8373ab34-2094-45d9-9bb4-355dfd34bde2';
  
  // Set website directly to https://www.yiangoueducation.com
  console.log(`Setting website of YIANGOU EDUCATIONAL HALL LTD to 'https://www.yiangoueducation.com'...`);
  await prisma.institute.update({
    where: { id: yiangouId },
    data: { website: 'https://www.yiangoueducation.com' }
  });
  console.log('Success.');

  // Find all pending revisions for this institute and mark them as APPROVED
  console.log(`Marking all pending revisions for YIANGOU as APPROVED...`);
  const result = await prisma.instituteRevision.updateMany({
    where: {
      instituteId: yiangouId,
      status: 'PENDING'
    },
    data: {
      status: 'APPROVED',
      appliedAt: new Date(),
      appliedBy: 'system-clean'
    }
  });
  console.log(`Marked ${result.count} revisions as APPROVED.`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
