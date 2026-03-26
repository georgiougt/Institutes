const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const services = [
    { name: 'Παγκύπριες', category: 'Εξετάσεις' },
    { name: 'Μαθηματικά', category: 'Μέση Εκπαίδευση' },
    { name: 'Νέα Ελληνικά', category: 'Μέση Εκπαίδευση' },
    { name: 'Φυσική', category: 'Μέση Εκπαίδευση' },
    { name: 'Χημεία', category: 'Μέση Εκπαίδευση' },
    { name: 'Βιολογία', category: 'Μέση Εκπαίδευση' },
    { name: 'Ιστορία', category: 'Μέση Εκπαίδευση' },
    { name: 'Αγγλικά', category: 'Ξένες Γλώσσες' },
    { name: 'Γαλλικά', category: 'Ξένες Γλώσσες' },
    { name: 'Γερμανικά', category: 'Ξένες Γλώσσες' },
    { name: 'Πληροφορική', category: 'Τεχνολογία' },
    { name: 'Λογιστική', category: 'Επιχειρήσεις' },
  ];

  console.log('Adding subjects...');

  for (const service of services) {
    await prisma.service.upsert({
      where: { name: service.name },
      update: { category: service.category },
      create: { name: service.name, category: service.category },
    });
    console.log(`Added/Updated subject: ${service.name}`);
  }

  console.log('Finished updating subjects.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
