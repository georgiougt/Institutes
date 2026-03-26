require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding the database...');

  // 1. Create Users
  const passwordHash = await bcrypt.hash('password123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@edutrack.com' },
    update: {},
    create: {
      email: 'admin@edutrack.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      passwordHash,
    },
  });

  const owner1 = await prisma.user.upsert({
    where: { email: 'giorgos@test.com' },
    update: {},
    create: {
      email: 'giorgos@test.com',
      firstName: 'Γιώργος',
      lastName: 'Παπαδόπουλος',
      role: 'OWNER',
      passwordHash,
    },
  });

  const owner2 = await prisma.user.upsert({
    where: { email: 'maria@test.com' },
    update: {},
    create: {
      email: 'maria@test.com',
      firstName: 'Μαρία',
      lastName: 'Κωνσταντίνου',
      role: 'OWNER',
      passwordHash,
    },
  });

  // 2. Create Cities & Areas
  const athens = await prisma.city.upsert({
    where: { name: 'Αθήνα' },
    update: {},
    create: {
      name: 'Αθήνα',
      areas: {
        create: [
          { name: 'Χαλάνδρι' },
          { name: 'Μαρούσι' }
        ]
      }
    }
  });

  const thessaloniki = await prisma.city.upsert({
    where: { name: 'Θεσσαλονίκη' },
    update: {},
    create: { name: 'Θεσσαλονίκη' }
  });

  // 3. Create Services
  const mathService = await prisma.service.upsert({
    where: { name: 'Μαθηματικά' },
    update: {},
    create: { name: 'Μαθηματικά', category: 'Μέση Εκπαίδευση' }
  });

  const englishService = await prisma.service.upsert({
    where: { name: 'Αγγλικά' },
    update: {},
    create: { name: 'Αγγλικά', category: 'Ξένες Γλώσσες' }
  });

  // 4. Create 10 more Demo Private Institutes
  const demoNames = [
    'Εκπαιδευτικό Κέντρο "Πρόοδος"', 'Ξένες Γλώσσες "Expert"', 'Πρότυπο Φροντιστήριο Θετικών Σπουδών',
    'Κέντρο Μελέτης "Ορόσημο"', 'Ακαδημία Μουσικής & Τεχνών', 'Σύγχρονο Σχολείο Πληροφορικής',
    'Φροντιστήριο "Άριστα"', 'Κέντρο Γλωσσών "Linguist"', 'Εκπαιδευτήρια "Νέα Γενιά"', 'Φιλολογικό Φροντιστήριο'
  ];

  const demoDescriptions = [
    'Ολοκληρωμένη υποστήριξη για μαθητές Γυμνασίου και Λυκείου.', 'Πρωτοποριακές μέθοδοι εκμάθησης για όλες τις ηλικίες.',
    'Εστίαση στις Φυσικομαθηματικές επιστήμες με έμφαση στην κατανόηση.', 'Βοήθεια στην καθημερινή μελέτη και προετοιμασία μαθημάτων.',
    'Ανακαλύψτε το ταλέντο σας με την καθοδήγηση των ειδικών.', 'Πιστοποιήσεις πληροφορικής και μαθήματα ρομποτικής.',
    'Εγγυημένη επιτυχία στις εξετάσεις με εξατομικευμένη προσέγγιση.', 'Εξειδίκευση στην Αγγλική, Γαλλική και Γερμανική γλώσσα.',
    'Περιβάλλον που προάγει τη μάθηση και την προσωπική ανάπτυξη.', 'Εμβάθυνση στα Αρχαία και Νέα Ελληνικά για σωστή έκφραση.'
  ];

  const demoAddresses = [
    'Πατησίων 45', 'Τσιμισκή 12', 'Λεωφόρος Βασιλίσσης Σοφίας 80', 'Σταδίου 15', 'Μητροπόλεως 10',
    'Αγίου Δημητρίου 100', 'Ελευθερίου Βενιζέλου 20', 'Πανεπιστημίου 30', 'Ερμού 60', 'Λεωφόρος Αλεξάνδρας 5'
  ];

  for (let i = 0; i < demoNames.length; i++) {
    const name = demoNames[i];
    const existing = await prisma.institute.findFirst({ where: { name } });
    if (existing) {
        console.log(`Skipping ${name}, already exists.`);
        continue;
    }

    try {
        await prisma.institute.create({
          data: {
            name,
            description: demoDescriptions[i],
            status: 'APPROVED',
            ownerId: i % 2 === 0 ? owner1.id : owner2.id,
            images: {
              create: {
                url: `https://images.unsplash.com/photo-${[
                  '1503676260728-1c00da096a0b', '1524995997946-a1c2e315a42f', '1509062522246-3755977927d7',
                  '1517694712202-14dd9538aa97', '1497633762265-9d179a990aa6', '1585432959449-347525f21626',
                  '1546410531-bc666a1a4574', '1516321318423-f06f85e504b3', '1523240795612-9a054b0db644', '1532012197267-da84d127e765'
                ][i]}?q=80&w=600&auto=format&fit=crop`,
                caption: name
              }
            },
            branches: {
              create: {
                name: 'Κεντρικό ' + (i + 1),
                phone: `210${Math.floor(1000000 + Math.random() * 9000000)}`,
                address: demoAddresses[i],
                cityId: i % 3 === 0 ? thessaloniki.id : athens.id,
                latitude: 37.980 + (Math.random() - 0.5) * 0.1,
                longitude: 23.733 + (Math.random() - 0.5) * 0.1,
                isMain: true
              }
            }
          }
        });
        console.log(`Created ${name}`);
    } catch (err) {
        console.error(`Error creating ${name}:`, err.message);
    }
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('GLOBAL ERROR:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
