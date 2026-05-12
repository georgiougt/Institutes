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
      { name: 'Επαγγελματικός Προσανατολισμός', category: 'ΣΥΜΒΟΥΛΕΥΤΙΚΗ' },
      { name: 'Τεχνολογία', category: 'ΤΕΧΝΟΛΟΓΙΑ' },
      { name: 'Λογοθεραπεία', category: 'ΘΕΡΑΠΕΙΕΣ' }
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
      { name: 'ΑΓΓΛΙΚΩΝ ΑΝΑΣΤΑΣΙΑ ΤΡΙΦΥΛΛΗ', email: 'a_soulie@hotmail.com', phone: '99662994', address: 'Ανεξαρτησίας 30, Κόρνος', city: 'Λάρνακα', subjects: ['Αγγλικά'] },
      { name: 'ΑΓΓΛΙΚΩΝ ANDRIA ANDREOU', email: 'an3andreou@gmail.com', phone: '99126181', address: 'Πάροδος 25ης Μαρτίου 2, Αθηένου', city: 'Λάρνακα', subjects: ['Αγγλικά'] },
      { name: 'ΑΓΓΛΙΚΩΝ ΕΜΠΕΔΩΣΗ Ε.Μ', email: 'empedosi_english@hotmail.com', phone: '99244907', address: 'Κινύρα 14A, Αραδίππου', city: 'Λάρνακα', subjects: ['Αγγλικά'] },
      { name: 'ΑΓΓΛΙΚΩΝ ΜΑΡΙΑ ΜΑΥΡΟΒΕΛΗ-ΖΙΠΙΤΗ', email: 'mmavroveli@gmail.com', phone: '99594833', address: '1ης Απριλίου 39, Αραδίππου', city: 'Λάρνακα', subjects: ['Αγγλικά', 'Φιλολογικά', 'Μαθηματικά', 'Λογιστική', 'Οικονομικά'] },
      { name: 'ΑΓΓΛΙΚΩΝ ΞΕΝΙΑ ΣΩΚΡΑΤΟΥΣ', email: 'xeniasocratous80@gmail.com', phone: '99173125', address: 'Λεωφόρος Αθηνών 47, Αραδίππου', city: 'Λάρνακα', subjects: ['Αγγλικά'] },
      { name: 'Α.Μ.Χ. ΙΔΙΩΤΙΚΟ ΦΡΟΝΤΙΣΤΗΡΙΟ ΑΝΝΑ ΜΑΟΥ ΧΑΡΑΛΑΜΠΟΥΣ ΛΤΔ', email: 'info@annamaou.com', phone: '99800878', address: 'Ομήρου 91, Αραδίππου', city: 'Λάρνακα', subjects: ['Επαγγελματικός Προσανατολισμός', 'Χημεία', 'Φυσική', 'Βιολογία', 'Λογιστική', 'Οικονομικά', 'Μελετητήριο', 'Φιλολογικά', 'Μαθηματικά'] },
      { name: 'ΒΑΡΒΑΡΑΣ Σ. ΠΕΛΕΚΑΝΟΥ', email: 'varvarapelekanou@gmail.com', phone: '99653441', address: 'Ευξείνου Πόντου 41A, Λάρνακα', city: 'Λάρνακα', subjects: ['Αγγλικά'] },
      { name: 'ΓΑΛΙΛΑΙΟΣ', email: 'fr_galileos@cytanet.com.cy', phone: '24664418', address: 'Σταυροδρομίου 74, Λάρνακα', city: 'Λάρνακα', subjects: ['Φιλολογικά', 'Μαθηματικά', 'Αγγλικά', 'Φυσική', 'Λογιστική', 'Οικονομικά'] },
      { name: 'ΓΙΑΝΝΑ ΧΡΙΣΤΟΦΗ', email: 'giannachristofi@tofrontistirio.com', phone: '99529655', address: 'Αρσινόης 41, Χρυσοπολίτισσα', city: 'Λάρνακα', subjects: ['Οικονομικά', 'Τεχνολογία', 'Μαθηματικά', 'Φιλολογικά'] },
      { name: 'ΓΡΑΜΜΑΤΑ ΣΠΟΥΔΑΣΜΑΤΑ', email: 'elpidaki_c@hotmail.com', phone: '96348544', address: 'Λεωφόρος 1ης Απριλίου 36, Δροσιά', city: 'Λάρνακα', subjects: ['Μελετητήριο', 'Λογοθεραπεία'] },
      { name: 'ΕΙΡΗΝΗ ΧΑΡΑΛΑΜΠΟΥΣ ΛΤΔ', email: 'sotiris.liakopoulos@gmail.com', phone: '99433914', address: 'Αρχιεπισκόπου Μακαρίου Γ\' 121, Αραδίππου', city: 'Λάρνακα', subjects: ['Φιλολογικά', 'Μαθηματικά'] },
      { name: 'ΕΛΕΝΗΣ ΤΣΟΛΙΑ ΚΕΝΤΡΟ ΔΙΔΑΣΚΑΛΙΑΣ ΡΩΣΙΚΗΣ ΓΛΩΣΣΑΣ', email: 'eleni.tsolia@gmail.com', phone: '99371138', address: 'Αγίου Χρυσοστόμου 37, Αραδίππου', city: 'Λάρνακα', subjects: ['Ρωσικά'] }
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

    console.log('\n--- LARNACA BATCH 1 RESULTS ---');
    console.table(results);
    
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
