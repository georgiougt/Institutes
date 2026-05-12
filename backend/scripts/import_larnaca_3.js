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
      { name: 'UCMAS', category: 'ΕΚΠΑΙΔΕΥΤΙΚΑ ΠΡΟΓΡΑΜΜΑΤΑ' },
      { name: 'Manners4Minors', category: 'ΕΚΠΑΙΔΕΥΤΙΚΑ ΠΡΟΓΡΑΜΜΑΤΑ' },
      { name: 'Θεατρολογία', category: 'ΤΕΧΝΕΣ' },
      { name: 'Ξένες Γλώσσες', category: 'ΓΛΩΣΣΕΣ' },
      { name: 'A Level', category: 'ΕΚΠΑΙΔΕΥΤΙΚΑ ΠΡΟΓΡΑΜΜΑΤΑ' }
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
      { name: 'ΜΕΛΕΤΗΤΗΡΙΟ ΜΕΛΕΤΩ ΜΕ ΧΑΡΑ', email: 'chara-ioannou@hotmail.com', phone: '96790281', address: 'Αγίου Λαζάρου 16, Αραδίππου', city: 'Λάρνακα', subjects: ['Μελετητήριο'] },
      { name: 'ΝΙΚΟΛΕΤΤΗ', email: 'info@nicolettis.education', phone: '99845630', address: 'Γρηγόρη Αυξεντίου 10, Λιβάδια', city: 'Λάρνακα', subjects: ['Λογοθεραπεία', 'Λογιστική', 'Οικονομικά', 'Μαθηματικά', 'Φυσική', 'Χημεία', 'Φιλολογικά', 'Πληροφορική', 'Βιολογία', 'Μελετητήριο', 'Αγγλικά'] },
      { name: 'ΠΑΝΗ ΑΡΤΕΜΙΟΥ', email: 'paniartemiou@tofrontistirio.com', phone: '99121043', address: 'Κλεάνθη Κούμενη 6, Αθηένου', city: 'Λάρνακα', subjects: ['Μελετητήριο', 'Λογιστική', 'Οικονομικά', 'Φυσική', 'Φιλολογικά'] },
      { name: 'ΠΛΗΡΟΦΟΡΙΚΗΣ INFO-TROPOS', email: 'info.infotropos@gmail.com', phone: '99877821', address: 'Αγίου Ιωακείμ 7, Αραδίππου', city: 'Λάρνακα', subjects: ['Μαθηματικά', 'Πληροφορική'] },
      { name: 'ΠΛΗΡΟΦΟΡΙΚΗΣ ΜΥΡΑΝΤΑ ΗΛΙΑ', email: 'mirantailia@tofrontistirio.com', phone: '24530248', address: 'Ιερού Λόχου 1, Αραδίππου', city: 'Λάρνακα', subjects: ['Ρομποτική', 'Πληροφορική'] },
      { name: 'ΠΛΗΡΟΦΟΡΙΚΗΣ ΤΕΧΝΟΜΑΘΗΣΗ', email: 'savvas324@hotmail.com', phone: '24361136', address: 'Πενταδακτύλου 57, Λάρνακα', city: 'Λάρνακα', subjects: ['Πληροφορική'] },
      { name: 'ΣΤΕΛΙΟΣ ΓΑΒΡΙΛΟΥ ΛΤΔ', email: 'gavrilous@hotmail.com', phone: '99312135', address: 'Λεωφόρος Δρομολαξιάς και Βόλου 2, Κίτι', city: 'Λάρνακα', subjects: ['Αγγλικά', 'Λογιστική', 'Οικονομικά', 'Μαθηματικά', 'Φυσική', 'Χημεία', 'Βιολογία', 'Φιλολογικά'] },
      { name: 'ΣΥΝΕΙΡΜΟΣ', email: 'mariaconstantinou111@gmail.com', phone: '96664325', address: '1ης Απριλίου 19A, Λάρνακα', city: 'Λάρνακα', subjects: ['Φιλολογικά'] },
      { name: 'ΣΩΖΟΥ', email: 'sozoumvro@hotmail.com', phone: '24532087', address: 'Αρχιμήδου 18, Αραδίππου', city: 'Λάρνακα', subjects: ['Αγγλικά', 'Μαθηματικά', 'Ελληνικά', 'Λογιστική'] },
      { name: 'ΤΟ ΒΑΣΙΛΕΙΟ ΤΗΣ ΓΝΩΣΗΣ', email: 'hajjiafxentivasilis@gmail.com', phone: '96439204', address: '1ης Απριλίου 39, Αραδίππου', city: 'Λάρνακα', subjects: ['Ειδική Εκπαίδευση', 'Μελετητήριο'] },
      { name: 'ΦΑΝΟΣ ΙΑΚΩΒΟΥ', email: 'phanos@phanosiacovou.com', phone: '24667755', address: 'Μητροπολίτη Κυπριανού Οικονομίδη 4A, Λάρνακα', city: 'Λάρνακα', subjects: ['Βιολογία', 'Φυσική', 'Φιλολογικά', 'Ελληνικά', 'Μαθηματικά', 'Αγγλικά', 'Πληροφορική', 'Λογιστική', 'Οικονομικά'] },
      { name: 'ΦΡΑΓΚΕΣΚΟΥ', email: 'frangeskos@gmail.com', phone: '99668760', address: 'Μάνου Χατζηδάκη 3, Λάρνακα', city: 'Λάρνακα', subjects: ['Φυσική'] },
      { name: 'ΦΩΤΕΙΝΗ ΣΙΑΜΑΡΗ', email: 's-phot@hotmail.com', phone: '99953763', address: 'Ανδρέα Κάρυου 1, Ξυλοτύμπου', city: 'Λάρνακα', subjects: ['Φιλολογικά', 'Μαθηματικά'] },
      { name: 'ΧΑΡΙΚΛΕΙΑ ΚΟΥΝΤΟΥΡΗ', email: 'charikleia.kountouri@tofrontistirio.com', phone: '24000000', address: 'Ιερού Λόχου 1, Αραδίππου', city: 'Λάρνακα', subjects: ['Φυσική'] },
      { name: 'Χ.Ε. "ΕΥΡΥΓΝΩΣΙΑ" ΛΤΔ', email: 'evrygnosia@gmail.com', phone: '24103647', address: 'Θεοκρίτου 40, Αθηένου', city: 'Λάρνακα', subjects: ['Φιλολογικά', 'Λογιστική', 'Οικονομικά', 'Βιολογία', 'Αγγλικά'] },
      { name: 'ΧΡΥΣΤΑΛΛΑ ΣΚΟΥΡΟΥ-ΨΩΜΑ', email: 'chrystalla.skourou@tofrontistirio.com', phone: '24000001', address: 'Μακαρίου Γ\' 25, Αθηένου', city: 'Λάρνακα', subjects: ['Μαθηματικά'] },
      { name: 'AMERICAN ACADEMY INSTITUTE LARNAKA', email: 'theinstitute@academy.ac.cy', phone: '99928763', address: 'Λεωφόρος Γρηγόρη Αυξεντίου 32, Λάρνακα', city: 'Λάρνακα', subjects: ['UCMAS', 'Manners4Minors', 'Πληροφορική', 'Οικονομικά', 'A Level', 'IGCSE', 'Λογιστική', 'Τέχνη', 'Θεατρολογία', 'Ρωσικά', 'Φυσική', 'Γερμανικά', 'Ελληνικά', 'Βιολογία', 'Χημεία', 'Μαθηματικά', 'Ξένες Γλώσσες'] },
      { name: 'C.A.H LIMITED', email: 'valanto_sf@hotmail.com', phone: '99877664', address: 'Αγίου Κενδέα 2, Λάρνακα', city: 'Λάρνακα', subjects: ['Λογιστική', 'Οικονομικά'] }
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

    console.log('\n--- LARNACA BATCH 3 RESULTS ---');
    console.table(results);
    
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
