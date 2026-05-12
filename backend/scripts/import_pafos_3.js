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
    
    const cityRes = await client.query('SELECT id, name FROM "City"');
    const cities = cityRes.rows;
    const serviceRes = await client.query('SELECT id, name FROM "Service"');
    const services = serviceRes.rows;

    const pafosCity = cities.find(c => c.name === 'Πάφος');
    const targetCityId = pafosCity.id;

    const batch = [
      { name: 'KOSTAS ZORPIDES PRIVATE INSTITUTE OF PHYSICS LTD', email: 'kostaszorpides@tofrontistirio.com', phone: '26270171', address: 'Λεωφόρος Αρχιεπισκόπου Μακαρίου Γ\' 99, Χλώρακα', city: 'Πάφος', subjects: ['Φυσική'] },
      { name: 'MARINA CHRYSOSTOMOU LANGUAGE LEARNING CENTRE', email: 'mchryso22@gmail.com', phone: '26000008', address: 'Αγίας Βαρβάρας 2, Λέμπα', city: 'Πάφος', subjects: ['Αγγλικά'] },
      { name: 'PCH PRASTITI LTD', email: 'pchprastiti@tofrontistirio.com', phone: '99772828', address: 'Αλεξανδρουπόλεως 52, Πάφος', city: 'Πάφος', subjects: ['Αγγλικά', 'Μαθηματικά'] },
      { name: 'PRIMUS LANGUAGE LEARNING CENTER', email: 'primus@tofrontistirio.com', phone: '26221086', address: 'Αντρέα Βλάμη 52, Αναβαργός', city: 'Πάφος', subjects: ['Αγγλικά'] },
      { name: 'PRIVATE INSTITUTE OF FOREIGN LANGUAGES INTERLINGUA LTD (ΚΕΝΤΡΙΚΟ)', email: 'interlingua@cytanet.com.cy', phone: '26941781', address: 'Σωτηρίου Παπαλαζάρου 9, Πάφος', city: 'Πάφος', subjects: ['Αγγλικά', 'Γαλλικά', 'Γερμανικά'] },
      { name: 'PRIVATE INSTITUTE OF FOREIGN LANGUAGES INTERLINGUA LTD (ΠΑΡΑΡΤΗΜΑ)', email: 'interlingua_branch@tofrontistirio.com', phone: '99675651', address: 'Γρίβα Διγενή 51Β, Γεροσκήπου', city: 'Πάφος', subjects: ['Αγγλικά', 'Γαλλικά', 'Γερμανικά'] },
      { name: 'SO SIMPLE', email: 'savvis99@gmail.com', phone: '99585636', address: 'Ελευθερίου Βενιζέλου 62, Πάφος', city: 'Πάφος', subjects: ['Γερμανικά', 'Μαθηματικά', 'Βιολογία', 'Φιλολογικά', 'Φυσική'] },
      { name: 'SUCCESS CODE R.K.PRIVATE INSTITUTE OF ENGLISH', email: 'successcoderk@gmail.com', phone: '99105410', address: 'Καρδίτσας 11, Πάφος', city: 'Πάφος', subjects: ['Αγγλικά'] },
      { name: 'TECHNOPEDIA', email: 'mkyriakou@gmail.com', phone: '26955777', address: 'Αλεξάνδρου Παπάγου 79, Πάφος', city: 'Πάφος', subjects: ['Πληροφορική'] },
      { name: 'THE INTERNATIONAL SCHOOL OF PAPHOS PRIVATE INSTITUTE', email: 'info@isop-ed.org', phone: '26821700', address: 'Αριστοτέλους Σάββα 100, Αναβαργός', city: 'Πάφος', subjects: ['Ρωσικά', 'Ισπανικά', 'Γερμανικά', 'Ελληνικά', 'Γαλλικά', 'Μελετητήριο', 'Μαθηματικά', 'Φυσική', 'Βιολογία', 'Χημεία', 'Πληροφορική', 'Αγγλικά', 'Οικονομικά'] },
      { name: 'TLC', email: 'primaryreception@tlccyprus.com', phone: '26910226', address: 'Αγίου Γεωργίου 193, Πέγεια', city: 'Πάφος', subjects: ['Μαθηματικά', 'Αγγλικά'] },
      { name: 'VELISSARIOU LTD', email: 'info@velissariou.com.cy', phone: '26913746', address: 'Λεωφόρος Αρχ. Μακαρίου 7, Γεροσκήπου', city: 'Πάφος', subjects: ['Επαγγελματικός Προσανατολισμός', 'UCMAS', 'Μαθηματικά', 'Μελετητήριο', 'Αγγλικά', 'Φιλολογικά', 'Πληροφορική'] }
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
        `, [instituteId, inst.address, targetCityId, inst.phone || '', coords?.lat || null, coords?.lng || null]);

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

    console.log('\n--- PAFOS BATCH 3 RESULTS ---');
    console.table(results);
    
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
