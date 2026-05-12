const { Client } = require('pg');
const { createClient } = require('@supabase/supabase-js');
const https = require('https');
require('dotenv').config();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlod3pvb3pxZWNpdW1udWluaG9lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzY2OTkxMCwiZXhwIjoyMDg5MjQ1OTEwfQ.9rdNxkgjNf3HA2W3v1fYtsQkLNPpEzKi1IFqFn6dTYc';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function greekToLatin(str) {
  const map = {
    'α': 'a', 'β': 'b', 'γ': 'g', 'δ': 'd', 'ε': 'e', 'ζ': 'z', 'η': 'i', 'θ': 'th', 'ι': 'i', 'κ': 'k', 'λ': 'l', 'μ': 'm', 'ν': 'n', 'ξ': 'x', 'ο': 'o', 'π': 'p', 'ρ': 'r', 'σ': 's', 'τ': 't', 'υ': 'y', 'φ': 'f', 'χ': 'ch', 'ψ': 'ps', 'ω': 'o',
    'ά': 'a', 'έ': 'e', 'ή': 'i', 'ί': 'i', 'ό': 'o', 'ύ': 'y', 'ώ': 'o', 'ϊ': 'i', 'ϋ': 'y', 'ΐ': 'i', 'ΰ': 'y', 'ς': 's'
  };
  return str.toLowerCase().split('').map(char => map[char] || char).join('');
}

function generateSlug(name) {
  return greekToLatin(name)
    .replace(/[^a-z0-9]/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50) + '-' + Math.random().toString(36).slice(-4);
}

function geocode(address) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'nominatim.openstreetmap.org',
      path: `/search?q=${encodeURIComponent(address)}&format=json&limit=1`,
      headers: { 'User-Agent': 'ToFrontistirioBot/1.0' }
    };

    https.get(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json && json.length > 0) {
            resolve({ lat: parseFloat(json[0].lat), lng: parseFloat(json[0].lon) });
          } else {
            resolve(null);
          }
        } catch (err) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

async function run() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    
    // Ensure new services exist
    const newServices = [
      { name: 'Δακτυλογραφία', category: 'ΕΚΠΑΙΔΕΥΤΙΚΑ ΠΡΟΓΡΑΜΜΑΤΑ' },
      { name: 'Ηλεκτρονικά', category: 'ΤΕΧΝΟΛΟΓΙΑ' },
      { name: 'STEAM', category: 'ΕΚΠΑΙΔΕΥΤΙΚΑ ΠΡΟΓΡΑΜΜΑΤΑ' }
    ];
    
    for (const s of newServices) {
      await client.query(`
        INSERT INTO "Service" (id, name, category, "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), $1, $2, NOW(), NOW())
        ON CONFLICT (name) DO NOTHING
      `, [s.name, s.category]);
    }

    const cityRes = await client.query('SELECT id, name FROM "City"');
    const cities = cityRes.rows;
    const serviceRes = await client.query('SELECT id, name FROM "Service"');
    const services = serviceRes.rows;

    const larnacaCityId = '45ce0ee9-3a73-4ddd-b301-ac9f8a1295ab';

    const batch = [
      { name: 'CONNIE\'S ENGLISH TURN (C.N) LTD', email: 'connies.english.turn@gmail.com', phone: '97613615', address: 'Γωνία Πειραιώς και Λαρίσης, Άγιος Νικόλαος', city: 'Λάρνακα', subjects: ['Αγγλικά'] },
      { name: 'CROSSROAD LTD', email: 'mkontopyrgou@hotmail.com', phone: '99453334', address: 'Αντρέα Θεμιστοκλέους 11, Λάρνακα', city: 'Λάρνακα', subjects: ['Φυσική', 'Αγγλικά'] },
      { name: 'CYBERNET ATHIENOU', email: 'cybernet.athienou@cytanet.com.cy', phone: '24811320', address: 'Αγίας Μαρίνας 4, Αθηένου', city: 'Λάρνακα', subjects: ['Φυσική', 'Χημεία', 'Μελετητήριο', 'Λογιστική', 'Οικονομικά', 'Δακτυλογραφία', 'Φιλολογικά', 'Πληροφορική'] },
      { name: 'E.A.M. HOUSE OF ENGLISH', email: 'evangelia910@gmail.com', phone: '99878818', address: 'Μιχαλάκη Παρίδη 6, Αραδίππου', city: 'Λάρνακα', subjects: ['Αγγλικά'] },
      { name: 'EASY WAY LEARNING CENTER', email: 'mouzouricharalambia@gmail.com', phone: '99146023', address: '28ης Οκτωβρίου 13, Ξυλοφάγου', city: 'Λάρνακα', subjects: ['Φυσική', 'Αγγλικά', 'Μαθηματικά', 'Πληροφορική'] },
      { name: 'EDUCYBER', email: 'info@educyber.com.cy', phone: '70004000', address: 'Γωνία Χρυσοπολίτισσης και Μάρκου Δράκου, Λάρνακα', city: 'Λάρνακα', subjects: ['Χημεία', 'Βιολογία', 'Φυσική', 'Φιλολογικά', 'Μαθηματικά', 'Αγγλικά', 'Μελετητήριο', 'Ηλεκτρονικά', 'Πληροφορική'] },
      { name: 'ENGLISH PRIVATE INSTITUTE MARIA L. THE ROAD TO SUCCESS', email: 'maria.charma@gmail.com', phone: '99684704', address: 'Σωκράτους 11, Λάρνακα', city: 'Λάρνακα', subjects: ['Αγγλικά'] },
      { name: 'E.P. INSTITUTE', email: 'e.p.institute.ep@gmail.com', phone: '99571522', address: 'Γρίβα Διγενή 5, Ξυλοτύμπου', city: 'Λάρνακα', subjects: ['Αγγλικά'] },
      { name: 'E.P. ROBOTICS LAB', email: 'info@roboticslabcy.com', phone: '99920910', address: 'Λεωφόρος Παπανικολή 7, Άγιοι Ανάργυροι', city: 'Λάρνακα', subjects: ['Ρομποτική'] },
      { name: 'G.E. ENGLISH CENTRE PRIVATE INSTITUTE LTD', email: 'info@ge-centre.com', phone: '24636280', address: 'Μυκόνου 4, Λάρνακα', city: 'Λάρνακα', subjects: ['Γαλλικά', 'Λογιστική', 'Γερμανικά', 'Αγγλικά'] },
      { name: 'G.R.M. PRIVATE INSTITUTE LIMITED', email: 'info@grmprivateinstitute.com', phone: '99477639', address: 'Δαναών 1, Αραδίππου', city: 'Λάρνακα', subjects: ['Μαθηματικά', 'Φιλολογικά', 'Βιολογία', 'Αγγλικά'] },
      { name: 'HYPERLEARNING', email: 'minasefthimiou@yahoo.com', phone: '99459395', address: 'Λεωφόρος Μακαρίου Γ\' 19, Αραδίππου', city: 'Λάρνακα', subjects: ['Πληροφορική'] },
      { name: 'Ι.Ε.Κ. STEAMINDS', email: 'info.steaminds@gmail.com', phone: '99000000', address: 'Ιερού Λόχου 1, Αραδίππου', city: 'Λάρνακα', subjects: ['Ρομποτική'] },
      { name: 'INFOZEST', email: 'yiannart@hotmail.com', phone: '99387911', address: 'Γρίβα Διγενή 26, Αθηένου', city: 'Λάρνακα', subjects: ['Αγγλικά'] },
      { name: 'INSIGHT EDUHUB', email: 'constantina_mendoni@hotmail.com', phone: '96595897', address: 'Ιερού Λόχου 1, Αραδίππου', city: 'Λάρνακα', subjects: ['Φιλολογικά', 'Αγγλικά'] },
      { name: 'LEARNING HOUSE ENGLISH CENTRE – FEDRA THEODOROU', email: 'learninghouse@cytanet.com.cy', phone: '99887228', address: 'Αρχιεπισκόπου Μακαρίου Γ\', 12, Μενεού', city: 'Λάρνακα', subjects: ['Αγγλικά'] },
      { name: 'MAGIC ENGLISH', email: 'demetris.thanasiou@yahoo.co.uk', phone: '99000001', address: 'Αγίου Φανουρίου 20, Χοιροκοιτία', city: 'Λάρνακα', subjects: ['Αγγλικά'] },
      { name: 'M. EXPECTATIONS', email: 'i-0-anna@hotmail.com', phone: '96433967', address: 'Άντη Περνάρη 14Α, Λάρνακα', city: 'Λάρνακα', subjects: ['Μαθηματικά'] },
      { name: 'M.T. ROYAL ENGLISH LTD', email: 'mariatoumazou@windowslive.com', phone: '24667171', address: 'Λεοντίου Μαχαιρά 29A, Λάρνακα', city: 'Λάρνακα', subjects: ['Αγγλικά'] },
      { name: 'NETSTYLE', email: 'artemispapaleou@gmail.com', phone: '99032613', address: 'Άγιος Γεώργιος Κοντός 73, Λάρνακα', city: 'Λάρνακα', subjects: ['Πληροφορική'] },
      { name: 'PAVLAS TUTORIAL INSTITUTE LIMITED', email: 'pavlas.education@cytanet.com.cy', phone: '99665416', address: '1ης Απριλίου 52, Λάρνακα', city: 'Λάρνακα', subjects: ['Χημεία', 'Οικονομικά', 'Βιολογία', 'Φυσική', 'Μαθηματικά', 'Φιλολογικά', 'Μελετητήριο', 'Αγγλικά'] },
      { name: 'P.E.C. LSS EMPOWERED MINDS', email: 'empoweredminds102@gmail.com', phone: '99050587', address: 'Σόλωνος 18, Λιβάδια', city: 'Λάρνακα', subjects: ['Αγγλικά'] },
      { name: 'P.E.C. STRIDE', email: 'info@stride.cy', phone: '99343636', address: 'Λεωφόρος 28ης Οκτωβρίου 6, Αραδίππου', city: 'Λάρνακα', subjects: ['Μελετητήριο', 'STEAM', 'Ρομποτική'] },
      { name: 'P.E. HADJIANTONIOU INSTITUTE', email: 'kokkinou30@hotmail.com', phone: '24365219', address: '1ης Απριλίου 96A, Δροσιά', city: 'Λάρνακα', subjects: ['Μαθηματικά', 'Οικονομικά'] }
    ];

    const results = [];
    for (const inst of batch) {
      console.log(`Processing: ${inst.name}...`);
      const password = Math.random().toString(36).slice(-10) + 'S22!';
      
      let uid;
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: inst.email,
        password: password,
        email_confirm: true
      });
      
      if (authError) {
        if (authError.message.includes('already registered')) {
            const { data: existingUser } = await supabase.auth.admin.listUsers();
            uid = existingUser.users.find(u => u.email === inst.email)?.id;
        } else {
            console.error(`  Auth Error for ${inst.name}:`, authError.message);
            continue;
        }
      } else {
        uid = authUser.user.id;
      }

      if (!uid) continue;

      await client.query(`
        INSERT INTO "User" (id, email, role, "onboardingStep", "createdAt", "updatedAt")
        VALUES ($1, $2, 'OWNER', 3, NOW(), NOW())
        ON CONFLICT (email) DO UPDATE SET id = EXCLUDED.id, role = 'OWNER'
      `, [uid, inst.email]);

      const slug = generateSlug(inst.name);
      const fullAddress = `${inst.address}, ${inst.city}, Cyprus`;
      let coords = await geocode(fullAddress);
      if (!coords) {
          coords = await geocode(`${inst.address.split(',')[0]}, ${inst.city}, Cyprus`);
      }

      try {
        const instInsert = await client.query(`
          INSERT INTO "Institute" (id, "ownerId", name, slug, status, "isVerified", "createdAt", "updatedAt")
          VALUES (gen_random_uuid(), $1, $2, $3, 'APPROVED', false, NOW(), NOW())
          RETURNING id
        `, [uid, inst.name, slug]);
        
        const instituteId = instInsert.rows[0].id;
        
        await client.query(`
          INSERT INTO "Branch" (id, "instituteId", name, address, "cityId", phone, latitude, longitude, "isMain", status, "createdAt", "updatedAt")
          VALUES (gen_random_uuid(), $1, 'Main', $2, $3, $4, $5, $6, true, 'APPROVED', NOW(), NOW())
        `, [instituteId, inst.address, larnacaCityId, inst.phone || '', coords?.lat || null, coords?.lng || null]);

        for (const subjectName of inst.subjects) {
          const serviceId = services.find(s => s.name === subjectName)?.id;
          if (serviceId) {
            await client.query(`
              INSERT INTO "InstituteService" (id, "instituteId", "serviceId")
              VALUES (gen_random_uuid(), $1, $2)
              ON CONFLICT DO NOTHING
            `, [instituteId, serviceId]);
          }
        }

        results.push({ Name: inst.name, Email: inst.email, Password: password });
        console.log(`  SUCCESS: Created profile for ${inst.name}`);
        await new Promise(resolve => setTimeout(resolve, 1100));
      } catch (err) {
        console.error(`  DB Error for ${inst.name}:`, err.message);
      }
    }

    console.log('\n--- LARNACA BATCH 4 RESULTS ---');
    console.table(results);
    
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
