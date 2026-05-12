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
      { name: 'Αρχαία Ελληνικά', category: 'ΦΙΛΟΛΟΓΙΚΑ' },
      { name: 'Ιστορία', category: 'ΦΙΛΟΛΟΓΙΚΑ' },
      { name: 'Λατινικά', category: 'ΦΙΛΟΛΟΓΙΚΑ' },
      { name: 'Μουσική', category: 'ΤΕΧΝΕΣ' }
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

    const pafosCityId = '2a8e8e8e-8e8e-8e8e-8e8e-8e8e8e8e8e8e'; // I need to verify Paphos city ID

    const pafosCity = cities.find(c => c.name === 'Πάφος');
    if (!pafosCity) {
        throw new Error('Paphos city not found in DB');
    }
    const targetCityId = pafosCity.id;

    const batch = [
      { name: 'ΑΓΓΛΙΚΩΝ ΑΝΤΡΗ ΚΟΚΟΥ ΜΑΝΩΛΗ', email: 'andriko@cytanet.com.cy', phone: '99306184', address: 'Πλούτωνος και Σωκράτους 15, Γεροσκήπου', city: 'Πάφος', subjects: ['Αγγλικά'] },
      { name: 'ΑΓΓΛΙΚΩΝ ΖΕΛΙΑ ΖΟΠΠΟΥ – ΠΑΛΙΟΥ', email: 'zeliazoppou@cytanet.com.cy', phone: '26961498', address: 'Γεωργίου Γρίβα Διγενή 6Β, Γεροσκήπου', city: 'Πάφος', subjects: ['Αγγλικά'] },
      { name: 'ΑΓΓΛΙΚΩΝ "ΛΑΜΠΡΙΑΝΟΥ"', email: 'lamprianou@tofrontistirio.com', phone: '26000000', address: 'Αγίου Αμβροσίου 11, Πάφος', city: 'Πάφος', subjects: ['Αγγλικά'] },
      { name: 'ΑΓΓΛΙΚΩΝ ΜΑΡΙΝΑΣ ΟΙΚΟΝΟΜΙΔΟΥ', email: 'marina.c.economidou@gmail.com', phone: '99542874', address: 'Σόλωνα Μιχαηλίδη 24, Πάφος', city: 'Πάφος', subjects: ['Αγγλικά'] },
      { name: 'ΑΓΓΛΙΚΩΝ ΣΤΕΦΑΝΙΑ ΚΥΡΙΑΚΟΥ ΒΑΜΒΑΤΣΟΥΛΗ', email: 'demvav@hotmail.com', phone: '96793743', address: 'Σύρου 16, Πάφος', city: 'Πάφος', subjects: ['Αγγλικά'] },
      { name: 'ΑΓΓΛΙΚΩΝ ΣΥΝΘΙΑ ΠΕΤΡΙΔΟΥ', email: 'info@cpenglish.com', phone: '99318660', address: 'Ψαρών 8, Πάφος', city: 'Πάφος', subjects: ['Αγγλικά'] },
      { name: 'ΑΡΙΑΝΑ ΛΕΩΝΙΔΟΥ', email: 'ariana90@live.co.uk', phone: '99121043', address: 'Ανεξαρτησίας 11, Γεροσκήπου', city: 'Πάφος', subjects: ['Μελετητήριο', 'Ειδική Εκπαίδευση'] },
      { name: 'ΑΤΕΛΙΕΡ', email: 'michaelidescostandinos@gmail.com', phone: '97648468', address: 'Λεωφόρος Ελευθερίας 87, Χλώρακα', city: 'Πάφος', subjects: ['Τέχνη'] },
      { name: 'ΓΙΩΡΓΟΣ ΚΟΥΡΟΥΖΟΣ', email: 'kourouzosg@cytanet.com.cy', phone: '99568356', address: 'Αμπελοκήπων 4, Πάφος', city: 'Πάφος', subjects: ['Οικονομικά', 'Λογιστική'] },
      { name: 'ΓΙΩΡΓΟΥ ΣΟΦΟΚΛΕΟΥΣ ΛΤΔ', email: 'contactgspi@gmail.com', phone: '99699091', address: 'Ανδροκλέους 6, Πάφος', city: 'Πάφος', subjects: ['Αγγλικά', 'Γερμανικά'] },
      { name: 'Γ. ΛΑΟΥΡΗΣ', email: 'laouris@cytanet.com.cy', phone: '99776965', address: 'Μαντάλια 2, Έμπα', city: 'Πάφος', subjects: ['Ρομποτική', 'Αγγλικά', 'Μαθηματικά', 'Φυσική', 'Λογιστική', 'Οικονομικά', 'Χημεία', 'Βιολογία', 'Φιλολογικά', 'Πληροφορική'] },
      { name: 'Γ. ΧΑΡΑΛΑΜΠΟΥΣ ΛΙΜΙΤΕΔ', email: 'eftychiacharalambous12@gmail.com', phone: '26932063', address: 'Λεωφόρος Κορυτσάς 3, Πάφος', city: 'Πάφος', subjects: ['Αγγλικά', 'Γαλλικά', 'Χημεία', 'Ξένες Γλώσσες', 'Φυσική', 'Μαθηματικά'] },
      { name: 'ΔΙΑΜΟΡΦΩΣΗ', email: 'g_georgiou@hotmail.com', phone: '99544139', address: 'Λάμπρου Σιέπη 4, Γεροσκήπου', city: 'Πάφος', subjects: ['Βιολογία', 'Φυσική', 'Ελληνικά', 'Αρχαία Ελληνικά', 'Ιστορία', 'Λατινικά'] },
      { name: 'ΕΥΑΓΓΕΛΟΣ ΕΓΓΛΕΖΑΚΗΣ', email: 'venglezakis@cytanet.com.cy', phone: '26911759', address: 'Δενούσης 2, Πάφος', city: 'Πάφος', subjects: ['Μαθηματικά'] },
      { name: 'Η ΠΑΙΔΕΙΑ', email: 'info@epaidia.com', phone: '97756000', address: 'Δοσιθέου 3, Πάφος', city: 'Πάφος', subjects: ['Φυσική', 'Φιλολογικά', 'UCMAS', 'Αγγλικά', 'Βιολογία', 'Μαθηματικά', 'Πληροφορική'] },
      { name: 'Ι.Ε.Κ. ΜΑΡΙΑΣ ΣΙΑΗΛΗ', email: 'mshiaelis@hotmail.com', phone: '99321764', address: 'Αλεξανδρουπόλεως 52, Πάφος', city: 'Πάφος', subjects: ['Οικονομικά', 'Λογιστική'] },
      { name: 'Ι.Ε.Κ. ΦΙΛΟΛΟΓΙΚΟ ΕΡΓΑΣΤΗΡΙ ΘΕΚΛΑ ΚΟΚΚΙΝΟΥ', email: 'theklak85@gmail.com', phone: '99773370', address: 'Καρδίτσας 11, Πάφος', city: 'Πάφος', subjects: ['Φιλολογικά'] },
      { name: '"ΚΑΠΟΝΑΣ"', email: 'kaponas@tofrontistirio.com', phone: '99898899', address: 'Αμπελοκήπων 4, Πάφος', city: 'Πάφος', subjects: ['Μαθηματικά'] },
      { name: 'Κ. ΠΕΤΡΟΥ', email: 'kiriacipetrou@gmail.com', phone: '99921871', address: 'Λήδρας 16, Πάφος', city: 'Πάφος', subjects: ['Μουσική', 'Ειδική Εκπαίδευση', 'Φυσική', 'Μελετητήριο'] },
      { name: 'ΛΙΖΑ ΚΩΝΣΤΑΝΤΙΝΙΔΟΥ ΓΕΩΡΓΙΟΥ', email: 'lacconstantinidou@hotmail.com', phone: '99380098', address: 'Σάββα Μαυρομμάτη 3, Πόλη Χρυσοχούς', city: 'Πάφος', subjects: ['Φιλολογικά'] },
      { name: 'ΛΟΥΙΖΑΣ ΘΕΜΙΣΤΟΚΛΕΟΥΣ', email: 'louizathem@hotmail.co.uk', phone: '96578280', address: 'Γεωργίου Γρίβα Διγενή 51, Γεροσκήπου', city: 'Πάφος', subjects: ['Μαθηματικά'] },
      { name: 'ΜΑΘΗΜΑΤΙΚΩΝ ΒΑΛΕΝΤΙΝΑ ΧΡΙΣΤΟΔΟΥΛΟΥ', email: 'valentina_christodoulou@hotmail.com', phone: '26000001', address: 'Λάμπρου Σιέπη 4, Γεροσκήπου', city: 'Πάφος', subjects: ['Μαθηματικά'] },
      { name: 'ΜΑΘΗΜΑΤΙΚΩΝ ΖΑΜΠΥΡΙΝΗΣ', email: 'zampyrinis@tofrontistirio.com', phone: '26000002', address: 'Μάρκου Μπότσαρη 4, Πάφος', city: 'Πάφος', subjects: ['Μαθηματικά'] },
      { name: 'ΜΑΘΗΜΑΤΙΚΩΝ MATHIMANIA', email: 'makgeo@cytanet.com.cy', phone: '99681351', address: 'Ψαρών 57, Πάφος', city: 'Πάφος', subjects: ['Μαθηματικά'] }
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

    console.log('\n--- PAFOS BATCH 1 RESULTS ---');
    console.table(results);
    
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
