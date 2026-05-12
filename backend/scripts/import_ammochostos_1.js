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

    const ammochostosCity = cities.find(c => c.name === 'Αμμόχωστος');
    const targetCityId = ammochostosCity.id;

    const batch = [
      { name: 'ΑΓΓΛΙΚΩΝ ΕΥΑΓΓΕΛΙΑΣ ΠΑΡΠΟΤΤΑ ΠΑΤΣΑΛΟΥ', email: 'evangelia.patsalou@gmail.com', phone: '99563170', address: 'Ακροπόλεως 48, Παραλίμνι', city: 'Αμμόχωστος', subjects: ['Αγγλικά'] },
      { name: 'ΑΓΓΛΙΚΩΝ SAINT MODHESTOS', email: 'saintmodhestos@tofrontistirio.com', phone: '99468964', address: 'Δημοκρατίας 12, Δερύνεια', city: 'Αμμόχωστος', subjects: ['Μαθηματικά', 'Φιλολογικά', 'Αγγλικά'] },
      { name: 'ΑΠΟΔΟΣΗ', email: 'lauradamou@hotmail.com', phone: '96457238', address: 'Παραλιμνίου 15, Σωτήρα', city: 'Αμμόχωστος', subjects: ['Φιλολογικά', 'Πληροφορική', 'Μαθηματικά'] },
      { name: 'ΒΙΟΛΟΓΙΑΣ ΕΛΕΝΗ ΧΑΤΖΗΣΠΥΡΟΥ', email: 'ehadji07@gmail.com', phone: '97854785', address: 'Λεωφόρος 1ης Απριλίου 20, Παραλίμνι', city: 'Αμμόχωστος', subjects: ['Βιολογία'] },
      { name: 'ΒΙΟΛΟΓΙΑΣ ΚΩΣΤΑΣ ΚΑΡΑΝΙΚΟΛΑΣ', email: 'kostaskaranicolas@gmail.com', phone: '99983992', address: 'Κερύνειας 5, Δερύνεια', city: 'Αμμόχωστος', subjects: ['Βιολογία'] },
      { name: 'ΔΕΣΠΟΙΝΑΣ ΖΙΚΚΟΥ', email: 'despinazikkou@gmail.com', phone: '96352712', address: 'Λεωφόρος Γρίβα 6, Λιοπέτρι', city: 'Αμμόχωστος', subjects: ['Φιλολογικά'] },
      { name: 'Ι.Ε.Κ. ΚΕΦΑΛΑΙΟΝ', email: 'kefalaion@tofrontistirio.com', phone: '23000000', address: 'Ακροπόλεως 48, Παραλίμνι', city: 'Αμμόχωστος', subjects: ['Μαθηματικά', 'Μελετητήριο'] },
      { name: 'Κ.Α.Σ', email: 'kas.institute@cytanet.com.cy', phone: '23731379', address: 'Κολοκοτρώνη 18, Παραλίμνι', city: 'Αμμόχωστος', subjects: ['Αγγλικά'] },
      { name: 'ΚΕΝΤΡΟ ΜΕΛΕΤΗΣ "ΧΩΡΟΧΡΟΝΟΣ"', email: 'xoroxronos@tofrontistirio.com', phone: '23000001', address: 'Αγίας Θέκλης 12, Σωτήρα', city: 'Αμμόχωστος', subjects: ['Φυσική'] },
      { name: 'ΜΑΓΔΑ ΜΟΥΛΑΖΙΜΗ', email: 'moulazimi-magda@hotmail.com', phone: '23000002', address: 'Σωτήρος 10, Σωτήρα', city: 'Αμμόχωστος', subjects: ['Μαθηματικά'] },
      { name: 'ΜΑΘΗΜΑΤΙΚΩΝ ΣΩΤΗΡΟΥΛΛΑ ΓΕΩΡΓΙΟΥ', email: 'soteroula_geo@hotmail.com', phone: '99080362', address: 'Αρχ. Μακαρίου Γ\' 38, Σωτήρα', city: 'Αμμόχωστος', subjects: ['Μαθηματικά'] },
      { name: 'ΜΑΘΗΜΑΤΙΚΩΝ ΧΡΙΣΤΙΑΝΑ ΤΤΑΚΚΟΥΣΙΗ', email: 'xrist1ana@hotmail.com', phone: '99915804', address: 'Κερύνειας 5, Δερύνεια', city: 'Αμμόχωστος', subjects: ['Μαθηματικά'] },
      { name: 'ΜΑΘΗΜΑΤΙΚΩΝ ΨΥΧΟΥΛΑ ΟΙΚΟΝΟΜΟΥ', email: 'demetra_economou@yahoo.gr', phone: '23822529', address: 'Κωστάκη Αρτυματά 34, Παραλίμνι', city: 'Αμμόχωστος', subjects: ['Μαθηματικά', 'Οικονομικά'] },
      { name: 'ΜΑΡΙΛΕΝΑ ΧΑΤΖΗΑΝΤΩΝΗ', email: 'marilena24.05@hotmail.com', phone: '23000003', address: '1ης Απριλίου 20, Παραλίμνι', city: 'Αμμόχωστος', subjects: ['Μελετητήριο', 'UCMAS'] },
      { name: 'ΜΕΛΕΤΗΤΗΡΙΟ ΜΑΡΙΑ ΑΓΑΘΑΓΓΕΛΟΥ', email: 'maria.agathaggelou@hotmail.com', phone: '23000004', address: 'Κυριάκου Μάτση 11, Σωτήρα', city: 'Αμμόχωστος', subjects: ['Μελετητήριο'] },
      { name: 'ΠΟΛΥΔΙΑΣΤΑΤΟ', email: 'polydiastato@tofrontistirio.com', phone: '99929337', address: 'Φώτη Πίττα 54Α, Φρέναρος', city: 'Αμμόχωστος', subjects: ['Μαθηματικά'] },
      { name: 'ΦΑΣΜΑ', email: 'xristala77@hotmail.com', phone: '97765607', address: 'Βασίλη Μιχαηλίδη 6, Φρέναρος', city: 'Αμμόχωστος', subjects: ['Μελετητήριο', 'Φιλολογικά', 'Φυσική', 'Μαθηματικά', 'Πληροφορική', 'Χημεία'] },
      { name: 'ΦΙΛΟΛΟΓΙΑΣ ΓΙΑΝΝΗ ΙΩΑΝΝΟΥ ΠΑΠΟΥΛΗ', email: 'papoulis@tofrontistirio.com', phone: '99752623', address: 'Κερύνειας 5, Δερύνεια', city: 'Αμμόχωστος', subjects: ['Φιλολογικά'] },
      { name: 'ΦΙΛΟΛΟΓΙΚΩΝ ΣΤΕΛΛΑ ΠΑΠΑΔΟΠΟΥΛΟΥ', email: 'stella.papadopoulou@tofrontistirio.com', phone: '96280859', address: 'Γρηγόρη Αυξεντίου 6, Παραλίμνι', city: 'Αμμόχωστος', subjects: ['Φιλολογικά'] },
      { name: 'ΦΥΣΙΚΗΣ ΑΝΤΡΗ ΠΑΝΑΓΗ', email: 'andraki29@hotmail.com', phone: '99431737', address: 'Σωτήρος 10, Σωτήρα', city: 'Αμμόχωστος', subjects: ['Φιλολογικά', 'Αγγλικά', 'Βιολογία', 'Φυσική'] },
      { name: 'FLORA\'S SMARTSTART PRIVATE INSTITUTE', email: 'smartstart@cytanet.com.cy', phone: '99541874', address: 'Ευαγόρα 17, Λιοπέτρι', city: 'Αμμόχωστος', subjects: ['Οικονομικά', 'Φιλολογικά', 'Αγγλικά'] },
      { name: 'JOHNYK LIMITED', email: 'paralimni@eurognosi.info', phone: '70000950', address: 'Λεωφόρος Πρωταρά 150, Παραλίμνι', city: 'Αμμόχωστος', subjects: ['Αγγλικά'] },
      { name: 'LANGUAGE CONNECTIONS', email: 'language.connections@tofrontistirio.com', phone: '99875604', address: 'Λεωφόρος 1ης Απριλίου 20, Παραλίμνι', city: 'Αμμόχωστος', subjects: ['Αγγλικά'] },
      { name: 'K.I.C. WISDOM BY KOULLA IOANNOU CHRISTODOULOU', email: 'wisdomeei@hotmail.com', phone: '99416350', address: 'Αγίου Δημητρίου 108, Παραλίμνι', city: 'Αμμόχωστος', subjects: ['Μαθηματικά', 'Χημεία', 'Αγγλικά'] },
      { name: 'Ι.Ε.Κ. MADEKNOWLEDGE LAB LTD', email: 'madeknowledgelab@gmail.com', phone: '99182238', address: 'Λεωφόρος 1ης Απριλίου 20, Παραλίμνι', city: 'Αμμόχωστος', subjects: ['Μελετητήριο', 'UCMAS'] },
      { name: 'SAINT MARINA', email: 'saintmarina@tofrontistirio.com', phone: '23822648', address: 'Κερύνειας 5, Δερύνεια', city: 'Αμμόχωστος', subjects: ['Αγγλικά'] },
      { name: 'STRONG MIND BY MARIA MARKOU', email: 'markoumaria@hotmail.com', phone: '99923145', address: 'Κέννεντυ 21Α, Σωτήρα', city: 'Αμμόχωστος', subjects: ['Μαθηματικά'] }
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

    console.log('\n--- AMMOCHOSTOS BATCH 1 RESULTS ---');
    console.table(results);
    
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
