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

    const larnacaCityId = '45ce0ee9-3a73-4ddd-b301-ac9f8a1295ab';

    const batch = [
      { name: 'PLAYHOUSE', email: 'barbarademosthenous@yahoo.com', phone: '99955980', address: 'Ηνωμένων Εθνών 54', city: 'Λάρνακα', subjects: ['Μελετητήριο'] },
      { name: 'SCHOOLWAVE', email: 'maria-markoulli@outlook.com', phone: '24523396', address: 'Μακρυγιάννη 6, Αθηένου', city: 'Λάρνακα', subjects: ['Μελετητήριο'] },
      { name: 'T.A.S PRIVATE INSTITUTE', email: 'thalia_ny@hotmail.com', phone: '99598961', address: 'Ιερωνύμου Βαρλαάμ 6A', city: 'Λάρνακα', subjects: ['Φιλολογικά', 'Αγγλικά'] },
      { name: 'THE ENGLISH ARCADE (E.N)', email: 'theenglisharcade@outlook.com', phone: '99289664', address: 'Αιγιαλούσης 1A, Λιβάδια', city: 'Λάρνακα', subjects: ['Αγγλικά'] },
      { name: 'THE ENGLISH CENTRE DINA PANAYI', email: 'dinapanayi@hotmail.com', phone: '99665521', address: 'Ρούμελης 17, Δροσιά', city: 'Λάρνακα', subjects: ['Αγγλικά'] },
      { name: 'THE WORLD OF EINSTEINS PRIVATE INSTITUTE', email: 'info@einsteins-world.com.cy', phone: '24001027', address: 'Μεγάλου Αλεξάνδρου 1, Ορόκλινη', city: 'Λάρνακα', subjects: ['Μελετητήριο', 'Πληροφορική', 'Μαθηματικά', 'Φιλολογικά', 'Αγγλικά'] },
      { name: 'T.I.M.E. PRIVATE INSTITUTE LTD', email: 'info@time-institute.eu', phone: '24400767', address: 'Λεωφόρος Ελευθερίας 71, Αραδίππου', city: 'Λάρνακα', subjects: ['Πληροφορική', 'Τέχνη', 'Ρομποτική', 'Λογιστική', 'Οικονομικά', 'Φιλολογικά', 'Μαθηματικά', 'Μελετητήριο', 'Βιολογία', 'Φυσική', 'Χημεία', 'Αγγλικά', 'Γαλλικά'] },
      { name: 'TOP SKILLS', email: 'jackloizou@hotmail.com', phone: '99640998', address: 'Ριζοκαρπάσου 12, Αραδίππου', city: 'Λάρνακα', subjects: ['Αγγλικά'] },
      { name: 'TORCH LIMITED', email: 'michalisth@hotmail.com', phone: '99531646', address: 'Λύσης 7, Καλό Χωριό', city: 'Λάρνακα', subjects: ['Αγγλικά'] },
      { name: 'Y.P.ARISTIDOU INSTITUTE', email: 'yparistidou@tofrontistirio.com', phone: '24000000', address: 'Γεωργίου Αβέρωφ 34, Λάρνακα', city: 'Λάρνακα', subjects: ['Αγγλικά', 'Γαλλικά'] }
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

    console.log('\n--- LARNACA BATCH 5 RESULTS ---');
    console.table(results);
    
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
