import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Greece-specific data...');

  // 1. Create/Update Greek Cities (Prefectures/Regional Units)
  const attica = await prisma.city.upsert({
    where: { name: 'Αττική' },
    update: { countryCode: 'GR' },
    create: {
      name: 'Αττική',
      nameEn: 'Attica',
      countryCode: 'GR',
      areas: {
        create: [
          { name: 'Μαρούσι', nameEn: 'Marousi' },
          { name: 'Χαλάνδρι', nameEn: 'Chalandri' },
          { name: 'Γλυφάδα', nameEn: 'Glyfada' },
          { name: 'Πειραιάς', nameEn: 'Piraeus' },
          { name: 'Νέα Σμύρνη', nameEn: 'Nea Smyrni' },
          { name: 'Περιστέρι', nameEn: 'Peristeri' },
        ],
      },
    },
  });
  console.log('Seeded Attica & areas');

  const thessaloniki = await prisma.city.upsert({
    where: { name: 'Θεσσαλονίκη' },
    update: { countryCode: 'GR' },
    create: {
      name: 'Θεσσαλονίκη',
      nameEn: 'Thessaloniki',
      countryCode: 'GR',
      areas: {
        create: [
          { name: 'Εύοσμος', nameEn: 'Evosmos' },
          { name: 'Καλαμαριά', nameEn: 'Kalamaria' },
          { name: 'Τούμπα', nameEn: 'Toumpa' },
        ],
      },
    },
  });
  console.log('Seeded Thessaloniki & areas');

  const achaia = await prisma.city.upsert({
    where: { name: 'Αχαΐα' },
    update: { countryCode: 'GR' },
    create: {
      name: 'Αχαΐα',
      nameEn: 'Achaia',
      countryCode: 'GR',
      areas: {
        create: [
          { name: 'Πάτρα', nameEn: 'Patra' },
        ],
      },
    },
  });
  console.log('Seeded Achaia/Patra');

  const heraklion = await prisma.city.upsert({
    where: { name: 'Ηράκλειο' },
    update: { countryCode: 'GR' },
    create: {
      name: 'Ηράκλειο',
      nameEn: 'Heraklion',
      countryCode: 'GR',
    },
  });
  console.log('Seeded Heraklion');

  const larissa = await prisma.city.upsert({
    where: { name: 'Λάρισα' },
    update: { countryCode: 'GR' },
    create: {
      name: 'Λάρισα',
      nameEn: 'Larissa',
      countryCode: 'GR',
    },
  });
  console.log('Seeded Larissa');

  // 2. Create Greek Exams/Services
  const servicesData = [
    { name: 'Πανελλαδικές', category: 'ΕΞΕΤΑΣΕΙΣ' },
    { name: 'Πρότυπα Σχολεία', category: 'ΕΞΕΤΑΣΕΙΣ' },
    { name: 'ΕΠΑΛ', category: 'ΕΞΕΤΑΣΕΙΣ' },
  ];

  for (const item of servicesData) {
    const s = await prisma.service.upsert({
      where: { name: item.name },
      update: { category: item.category },
      create: {
        name: item.name,
        category: item.category,
      },
    });
    console.log(`Seeded Service: ${s.name}`);
  }

  console.log('Greece seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
