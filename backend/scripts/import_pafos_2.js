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
      { name: 'Ελληνικά για αλλόγλωσσους', category: 'ΓΛΩΣΣΕΣ' },
      { name: 'Στατιστική', category: 'ΕΚΠΑΙΔΕΥΤΙΚΑ ΠΡΟΓΡΑΜΜΑΤΑ' }
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

    const pafosCity = cities.find(c => c.name === 'Πάφος');
    const targetCityId = pafosCity.id;

    const batch = [
      { name: 'ΜΑΘΗΜΑΤΙΚΩΝ ΞΕΝΙΟΣ ΓΕΩΡΓΙΑΔΗΣ', email: 'xeniosgeorgiades@tofrontistirio.com', phone: '99232454', address: 'Αντρέα Αλεξίου 1, Έμπα', city: 'Πάφος', subjects: ['Μαθηματικά'] },
      { name: 'ΜΑΡΙΑ ΠΙΕΡΗ', email: 'mariapieri@tofrontistirio.com', phone: '26000003', address: 'Ελευθερίας 16, Κονιά', city: 'Πάφος', subjects: ['Φιλολογικά', 'Μαθηματικά', 'Αγγλικά'] },
      { name: 'ΜΑΡΙΑ ΧΡΙΣΤΟΥ', email: 'pimchristou@gmail.com', phone: '96383952', address: 'Μπουμπουλίνας 16, Πάφος', city: 'Πάφος', subjects: ['Αγγλικά'] },
      { name: 'ΜΙΤΛΕΤΤΟΝ ΛΤΔ', email: 'middland@cytanet.com.cy', phone: '26933884', address: 'Αλεξανδρουπόλεως 52, Πάφος', city: 'Πάφος', subjects: ['Φιλολογικά'] },
      { name: 'Μ. ΚΑΤΣΙΑΡΤΟΥ ΠΑΠΑΣΤΥΛΙΑΝΟΥ', email: 'papadikos@yahoo.gr', phone: '99211818', address: 'Χριστοδούλου Αργυρού 2, Πάφος', city: 'Πάφος', subjects: ['Ελληνικά', 'Φυσική'] },
      { name: 'ΞΕΝΟΦΩΝ ΧΡΙΣΤΟΥ "ΤΟ ΑΤΟΜΟ"', email: 'xenofonchristou@tofrontistirio.com', phone: '99415786', address: 'Νεοφύτου Νικολαΐδη 39, Πάφος', city: 'Πάφος', subjects: ['Φυσική', 'Χημεία'] },
      { name: 'ΠΡΟΣΚΗΝΙΟ', email: 'info@proskinio.com', phone: '99217848', address: 'Μπιζανίου 4Β, Πάφος', city: 'Πάφος', subjects: ['Θέατρο'] },
      { name: 'ΡΑΦΑΕΛΛΑ ΑΝΔΡΕΟΥ', email: 'an.rafaella.ch@gmail.com', phone: '99941347', address: 'Κυριάκου Κολοκάση 2, Πάφος', city: 'Πάφος', subjects: ['Φυσική'] },
      { name: 'ΡΩΣΣΙΚΟ ΙΝΣΤΙΤΟΥΤΟ ΠΑΦΟΥ - N.M.E.S.', email: 'russianinstitute@tofrontistirio.com', phone: '26000004', address: 'Μακεδονίας 4, Πάφος', city: 'Πάφος', subjects: ['Μουσική', 'Ελληνικά για αλλόγλωσσους', 'Αγγλικά', 'Ρωσικά', 'Μαθηματικά'] },
      { name: 'ΡΩΣΙΚΩΝ ERUDIT', email: 'erudit@tofrontistirio.com', phone: '26000005', address: 'Νεαπόλεως 19, Πάφος', city: 'Πάφος', subjects: ['Ελληνικά για αλλόγλωσσους', 'Ρωσικά', 'Μαθηματικά'] },
      { name: 'ΣΑΒΒΑ ΠΡΑΣΤΙΤΗ ΛΤΔ (ΠΑΡΑΡΤΗΜΑ)', email: 'savvas@prastitis.com', phone: '26939300', address: 'Βλαδίμηρου Καυκαρίδη 2, Πάφος', city: 'Πάφος', subjects: ['Ρομποτική', 'Πληροφορική', 'Αγγλικά'] },
      { name: 'Σ.ΓΕΩΡΓΙΑΔΗ', email: 'info@sgeorgiades.com', phone: '70005070', address: 'Ανθ. Γεωργίου Μ. Σάββα 7, Γεροσκήπου', city: 'Πάφος', subjects: ['Βιολογία', 'Μαθηματικά', 'Χημεία', 'Φιλολογικά', 'Φυσική'] },
      { name: 'ΣΤΟΧΟΣ', email: 'npgeorgiou@hotmail.com', phone: '99453718', address: 'Νεοφύτου Γεωργίου 18, Πάφος', city: 'Πάφος', subjects: ['Μαθηματικά', 'Χημεία', 'Βιολογία', 'Φυσική', 'Φιλολογικά'] },
      { name: 'ΣΥΝ-ΛΟΓΙΚΗ ΣΚΕΨΗ', email: 'aretoulaxri@windowslive.com', phone: '26000006', address: 'Ανδρέα Βλάμη 30, Πάφος', city: 'Πάφος', subjects: ['Μαθηματικά', 'Φιλολογικά'] },
      { name: 'ΤΟ ΠΟΛΥΤΡΟΠΟΝ (ΚΕΝΤΡΙΚΟ)', email: 'topolytropon@gmail.com', phone: '26270171', address: 'Λεωφόρος Αρχ. Μακαρίου Γ\' 99, Χλώρακα', city: 'Πάφος', subjects: ['Χημεία', 'Αγγλικά', 'Μαθηματικά', 'Φιλολογικά', 'Πληροφορική', 'Βιολογία'] },
      { name: 'ΤΟ ΠΟΛΥΤΡΟΠΟΝ (ΠΑΡΑΡΤΗΜΑ)', email: 'topolytropon@gmail.com', phone: '26270171', address: 'Μακρυγιάννη 20, Έμπα', city: 'Πάφος', subjects: ['Φυσική', 'Χημεία', 'Αγγλικά', 'Μαθηματικά', 'Φιλολογικά', 'Πληροφορική', 'Βιολογία'] },
      { name: 'ΦΙΛΟΛΟΓΙΚΩΝ ΜΑΘΗΜΑΤΩΝ ΒΑΛΕΝΤΙΝΑ ΑΓΑΘΑΓΓΕΛΟΥ', email: 'valentina.agathangelou@tofrontistirio.com', phone: '99386126', address: 'Αγίου Θεοδοσίου 14, Αναβαργός', city: 'Πάφος', subjects: ['Φιλολογικά'] },
      { name: 'ΦΙΛΟΛΟΓΙΚΩΝ ΜΑΘΗΜΑΤΩΝ ΜΑΡΙΑ ΠΑΠΑΛΟΥΚΑ-ΜΠΙΤΣΙΟΥΝΗ', email: 'papalouka47@gmail.com', phone: '99561869', address: 'Ανδρέα Κάλβου 8, Πάφος', city: 'Πάφος', subjects: ['Φιλολογικά'] },
      { name: 'ΦΙΛΟΛΟΓΙΚΩΝ ΧΑΡΙΛΑΟΥ ΔΕΣΠΟΙΝΑ', email: 'despoina_xarilaou@hotmail.com', phone: '26000007', address: 'Γρηγόρη Αυξεντίου 3, Λέμπα', city: 'Πάφος', subjects: ['Φιλολογικά'] },
      { name: 'ΦΥΣΙΚΗΣ ΦΙΟΡΟΥΛΑ ΚΩΝΣΤΑΝΤΙΝΟΥ', email: 'fioroulla1990@hotmail.com', phone: '99270345', address: 'Γρίβα Διγενή 51, Γεροσκήπου', city: 'Πάφος', subjects: ['Φυσική'] },
      { name: 'ΧΕΙΛΕΤΗΣ & ΕΞΑΔΑΚΤΥΛΟΥ', email: 'dhiletis@hotmail.com', phone: '26220626', address: 'Σωκράτους Ευαγγέλου 2, Πάφος', city: 'Πάφος', subjects: ['Φιλολογικά', 'Λογιστική', 'Οικονομικά', 'Φυσική', 'Μαθηματικά', 'Χημεία', 'Βιολογία'] },
      { name: 'ΧΡ.ΣΑΒΒΙΔΗΣ -ΚΕΝΤΡΙΚΟ-', email: 'savvidis@cytanet.com.cy', phone: '26220533', address: 'Λεωφόρος Ελλάδος 86, Πάφος', city: 'Πάφος', subjects: ['Αγγλικά', 'Μαθηματικά', 'Λογιστική', 'Οικονομικά', 'Στατιστική'] },
      { name: 'CHRYSO CHRISTOFOROU "THE BRITONS"', email: 'chryso.britons@gmail.com', phone: '99755015', address: 'Ρηγαίνης 23, Γεροσκήπου', city: 'Πάφος', subjects: ['Μελετητήριο', 'Φιλολογικά', 'Αγγλικά'] },
      { name: 'EDGE', email: 'sofoklis85@gmail.com', phone: '99565214', address: 'Δημήτρη Κωνσταντίνου 11, Πάφος', city: 'Πάφος', subjects: ['Αγγλικά'] },
      { name: 'KCI KING\'S', email: 'kcikings@tofrontistirio.com', phone: '26933884', address: 'Αλεξανδρουπόλεως 52, Πάφος', city: 'Πάφος', subjects: ['Λογιστική'] }
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

    console.log('\n--- PAFOS BATCH 2 RESULTS ---');
    console.table(results);
    
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
