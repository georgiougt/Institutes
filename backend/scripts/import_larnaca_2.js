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
      { name: 'Εργοθεραπεία', category: 'ΘΕΡΑΠΕΙΕΣ' },
      { name: 'Εκπαιδευτική Ψυχολογία', category: 'ΣΥΜΒΟΥΛΕΥΤΙΚΗ' },
      { name: 'Ειδική Εκπαίδευση', category: 'ΣΥΜΒΟΥΛΕΥΤΙΚΗ' }
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
      { name: 'ΕΠΙΚΕΝΤΡΟ', email: 'fepikentro@cytanet.com.cy', phone: '99465744', address: 'Κωνσταντινουπόλεως 2, Ορόκλινη', city: 'Λάρνακα', subjects: ['Μελετητήριο', 'Βιολογία', 'Αγγλικά', 'Φιλολογικά', 'Μαθηματικά', 'Φυσική'] },
      { name: 'ΕΡΓΑΣΤΗΡΙ ΖΩΓΡΑΦΙΚΗΣ ΑΝΤΡΗ ΧΑΡΗ', email: 'ergastirizografikis@tofrontistirio.com', phone: '99538701', address: 'Κλείτου Μανδρίδη 4, Λάρνακα', city: 'Λάρνακα', subjects: ['Τέχνη'] },
      { name: 'ΘΕΑ ΚΟΣΜΑ ΛΤΔ', email: 'theakosma@hotmail.com', phone: '99664905', address: 'Ραφαήλ Σάντη 23, Λάρνακα', city: 'Λάρνακα', subjects: ['Μαθηματικά', 'Μελετητήριο', 'Φυσική', 'Φιλολογικά'] },
      { name: 'ΘΕΟΧΑΡΙΔΗ', email: 'theocharide.institute@gmail.com', phone: '24654006', address: 'Εκάλης 16, Λάρνακα', city: 'Λάρνακα', subjects: ['Βιολογία', 'Μελετητήριο', 'Μαθηματικά', 'Φιλολογικά', 'Φυσική'] },
      { name: 'Ι.Γ ΠΥΛΗ ΓΝΩΣΗΣ ΛΙΜΙΤΕΔ', email: 'pylignosis@gmail.com', phone: '99797610', address: 'Λεωφόρος Αγίων Αναργύρων 17, Λάρνακα', city: 'Λάρνακα', subjects: ['Φυσική', 'Μελετητήριο', 'Φιλολογικά', 'Μαθηματικά'] },
      { name: 'Ι.Ε.Κ. ΠΛΗΡΟΦΟΡΙΚΗΣ ΜΑΡΙΑ ΛΙΠΕΡΗ', email: 'm.liperi@cytanet.com.cy', phone: '99894040', address: 'Αγίου Φανουρίου 1, Λάρνακα', city: 'Λάρνακα', subjects: ['Χημεία', 'Βιολογία', 'Αγγλικά', 'Μαθηματικά', 'Φιλολογικά', 'Λογιστική', 'Οικονομικά'] },
      { name: 'ΙΟΥΛΙΑ ΚΑΛΛΗ', email: 'frontistiria.iouliakalli@gmail.com', phone: '99319359', address: 'Ρήγα Φεραίου 25, Λάρνακα', city: 'Λάρνακα', subjects: ['Φυσική', 'Μελετητήριο', 'Φιλολογικά'] },
      { name: 'ΚΑΜΑΡΕΣ', email: 'kamares@tofrontistirio.com', phone: '99488490', address: 'Αμφιλοχίας 4, Αραδίππου', city: 'Λάρνακα', subjects: ['Αγγλικά'] },
      { name: 'ΚΩΣΤΑ ΣΑΒΒΑ ΛΤΔ -ΚΕΝΤΡΙΚΟ-', email: 'info.csinstitute24@gmail.com', phone: '99848355', address: '1ης Απριλίου 30A, Άγιος Νικόλαος', city: 'Λάρνακα', subjects: ['Ιταλικά', 'Μελετητήριο', 'Οικονομικά', 'Αγγλικά', 'Φιλολογικά', 'Μαθηματικά', 'Βιολογία', 'Χημεία', 'Φυσική'] },
      { name: 'ΚΩΣΤΑ ΣΑΒΒΑ ΛΤΔ -ΠΑΡΑΡΤΗΜΑ-', email: 'info.csinstitute24-branch@gmail.com', phone: '99848355', address: '1ης Απριλίου 31A, Άγιος Νικόλαος', city: 'Λάρνακα', subjects: ['Ιταλικά', 'Μελετητήριο', 'Οικονομικά', 'Αγγλικά', 'Φιλολογικά', 'Μαθηματικά', 'Βιολογία', 'Χημεία', 'Φυσική'] },
      { name: 'ΛΟΓΙΣΤΙΚΗΣ ΑΝΤΩΝΗ ΚΙΚΑ', email: 'kikas.antonis@cytanet.com.cy', phone: '99358679', address: 'Γρηγόρη Αυξεντίου 35, Λάρνακα', city: 'Λάρνακα', subjects: ['Φιλολογικά', 'Λογιστική', 'Οικονομικά'] },
      { name: 'ΛΟΓΙΣΤΙΚΗΣ Σ.Λ. ΛΟΓΙΣΤΙΚΗ ΓΙΑ ΟΛΟΥΣ', email: 'sl.loizou@cytanet.com.cy', phone: '99901069', address: 'Κοντίας 5, Κόρνος', city: 'Λάρνακα', subjects: ['Λογιστική'] },
      { name: 'ΜΑΘΑΙΝΟΥΜΕ ΣΤΟ Π ΚΑΙ Φ ΣΤΕΛΛΑ ΣΑΡΡΗ ΛΙΜΙΤΕΔ', email: 'sto.pi.kai.phi@gmail.com', phone: '24251618', address: 'Θάλειας 36, Λάρνακα', city: 'Λάρνακα', subjects: ['Μαθηματικά'] },
      { name: 'ΜΑΘΗΜΑΤΙΚΩΝ ΓΙΩΡΓΟΣ ΠΑΠΑΡΙΔΗΣ', email: 'paparides_7@hotmail.com', phone: '99801250', address: 'Λεοντίου Μαχαιρά 34, Λάρνακα', city: 'Λάρνακα', subjects: ['Μαθηματικά'] },
      { name: 'ΜΑΘΗΜΑΤΙΚΩΝ MATHPLANET', email: 'mathplanet24@gmail.com', phone: '99874076', address: 'Πανίδος 24, Λάρνακα', city: 'Λάρνακα', subjects: ['Μαθηματικά'] },
      { name: 'ΜΑΘΗΜΑΤΙΚΩΝ SQUARE MINDS', email: 'nicknikolaou@gmail.com', phone: '99122200', address: 'Ρήγα Φεραίου 27A, Λάρνακα', city: 'Λάρνακα', subjects: ['Μαθηματικά'] },
      { name: 'ΜΑΘΗΜΑΤΙΚΩΝ ΧΡΙΣΤΟΣ ΧΡΙΣΤΟΥ', email: 'xristosxristou_94@hotmail.com', phone: '96712101', address: 'Αγίου Ιωάννη 36, Λάρνακα', city: 'Λάρνακα', subjects: ['Μαθηματικά'] },
      { name: 'ΜΑΘΗΣΗ ΚΑΙ ΠΑΙΔΙ', email: 'mathisikaipaidi@tofrontistirio.com', phone: '70009404', address: 'Μίκη Θεοδωράκη 13, Λάρνακα', city: 'Λάρνακα', subjects: ['Εργοθεραπεία', 'Λογοθεραπεία', 'Εκπαιδευτική Ψυχολογία', 'Μαθηματικά', 'Φιλολογικά', 'Μελετητήριο', 'Ειδική Εκπαίδευση'] },
      { name: 'ΜΑΡΙΑ Γ. ΚΑΝΤΗΛΑΦΤΗ', email: 'mariakant1989@gmail.com', phone: '96744837', address: 'Κωνσταντίνου Κανάρη 6, Αθηένου', city: 'Λάρνακα', subjects: ['Μαθηματικά', 'Φιλολογικά'] },
      { name: 'ΜΑΡΙΑ ΠΑΠΑΝΙΚΟΛΑΟΥ ΛΤΔ', email: 'mpapanicolaou@gmail.com', phone: '99483865', address: 'Ομήρου 12, Λάρνακα', city: 'Λάρνακα', subjects: ['Αγγλικά'] }
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

    console.log('\n--- LARNACA BATCH 2 RESULTS ---');
    console.table(results);
    
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
