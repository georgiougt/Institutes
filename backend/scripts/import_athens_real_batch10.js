const { Client } = require('pg');
const { createClient } = require('@supabase/supabase-js');
const https = require('https');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing Supabase URL or Service Role Key in environment!");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const rawText = `ΧΟΤΕΑ ΜΙΡΕΛΑ-ΙΡΙΝΑ	ΧΡΙΣΤΙΑΝΟΥΠΟΛΕΩΣ 50	ΑΘΗΝΑ	11142	2102925573
ΧΟΥΜΑ ΕΛΕΝΗ	ΚΟΚΚΑΡΙ	ΣΑΜΟΣ	83100	2273092227
ΧΟΥΣΕΛΑ ΙΩΑΝΝΑ	ΚΟΛΟΚΟΤΡΩΝΗ 2-4	Π. ΦΑΛΗΡΟ	17563	2109813193
ΧΡΑΝΙΩΤΗ ΘΕΟΦΑΝΗ	ΔΙΣΤΟΜΟΥ 11	ΗΛΙΟΥΠΟΛΗ	16344	2109731333
ΧΡΗΣΤΑΚΟΥ ΜΑΡΙΑ	28ΗΣ ΟΚΤΩΒΡΙΟΥ 117	ΝΙΚΑΙΑ	18451	2105613309
ΧΡΗΣΤΑΛΑ ΔΕΣΠΟΙΝΑ	ΔΟΥ. ΠΛΑΚΕΝΤΙΑΣ 29	ΧΑΛΑΝΔΡΙ	15234	2106858406
ΧΡΗΣΤΟΥ -ΣΑΠΤΕΛΙΑΝΟΥ ΕΙΡΗΝΗ	ΦΙΛΑΔΕΛΦΕΙΑΣ 38	ΝΙΚΑΙΑ	18453	2104921342
ΧΡΙΣΤΑΚΟΠΟΥΛΟΥ-ΛΑΛΙΑ ΣΥΡΑΓΩ(ΣΟΡΑΓΙΑ)ΣΤΕΛΛΑ	ΝΑΠΟΛΕΟΝΤΟΣ ΖΕΡΒΑ 45	ΑΧΑΡΝΑΙ	13671	2102446857
ΧΡΙΣΤΟΔΟΥΛΑΚΟΥ ΔΗΜΗΤΡΑ	ΚΟΥΤΑΪΣΗ 34	ΝΙΚΑΙΑ	18452	2104910408
ΧΡΙΣΤΟΔΟΥΛΟΥ ΕΜΜΑΝΟΥΕΛΛΑ	ΙΩΝΙΑΣ 37	ΝΕΑ ΣΜΥΡΝΗ	17121	2109318177
ΧΡΙΣΤΟΠΟΥΛΟΥ ΑΜΑΛΙΑ	ΚΝΩΣΣΟΥ 26	ΠΕΤΡΟΥΠΟΛΗ	13231	2105024939
ΧΡΙΣΤΟΦΙΔΟΥ ΕΙΡΗΝΗ	ΣΤΡΑΤΗΓΗ 21	ΠΕΙΡΑΙΑΣ	18543	2114021356
ΧΡΟΝΟΠΟΥΛΟΥ ΑΝΝΑ	ΚΩΣΤΗ ΠΑΛΑΜΑ 76	ΚΑΜΑΤΕΡΟ	13451	2102313589
ΧΡΥΣΑΝΘΑΚΟΠΟΥΛΟΥ ΗΡΑΚΛΕΙΑ	ΠΑΡΟΔΟΣ ΠΡΕΣΠΑΣ 10	ΠΕΡΙΣΤΕΡΙ	12136	2105777997
ΧΡΥΣΗ - ΒΟΛΑΚΑΚΗ ΓΕΩΡΓΙΑ	ΜΑΡΑΘΟΚΑΜΠΟΣ	ΣΑΜΟΣ	83102	2273031715
ΧΡΥΣΙΚΑΚΗ ΕΛΕΝΗ	ΧΙΟΥ 47Α	ΑΓ. ΠΑΡΑΣΚΕΥΗ	15343	2106008899
ΧΡΥΣΙΚΟΠΟΥΛΟΥ ΒΑΣΙΛΕΙΟΥ	ΠΕΡΓΑΜΟΥ 3	ΑΙΓΑΛΕΩ	12242	2105903413
ΧΡΥΣΟΣ ΑΘΑΝΑΣΙΟΣ	ΣΚΟΥΡΤΑΝΙΩΤΗ 11	ΑΘΗΝΑ - ΝΕΟΣ ΚΟΣΜΟΣ	11744	2109015252
ΧΡΥΣΟΥΛΑΚΗ ΧΑΡΙΚΛΕΙΑ	ΜΕΓΑΛΟΥ ΑΛΕΞΑΝΔΡΟΥ 84	ΠΕΡΑΜΑ	18863	2104413861
ΧΡΥΣΟΥΛΑΚΗΣ ΧΑΡΙΔΗΜΟΣ	ΑΓ. ΓΕΩΡΓΙΟΥ 15	ΝΕΑ ΦΙΛΑΔΕΛΦΕΙΑ	14342	2102777725
ΨΙΛΙΩΤΗΣ ΔΗΜΗΤΡΙΟΣ	ΟΥΡΑΝΙΑΣ ΗΛΙΟΠΟΥΛΟΥ 7 & ΠΛΟΥΤΑΡΧΟΥ 23	ΑΓ. ΔΗΜΗΤΡΙΟΣ	17342	2109926020
ΨΥΧΑ ΑΓΓΕΛΙΚΗ	ΖΑΛΛΟΓΓΟΥ 4	ΚΟΡΥΔΑΛΛΟΣ	18120	2104960178`;

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
    connectionString: process.env.DATABASE_URL?.replace('pgbouncer=true', 'pgbouncer=false'),
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();

    // Fetch baseline data
    const cityRes = await client.query('SELECT id, name FROM "City"');
    const cities = cityRes.rows;
    
    const areaRes = await client.query('SELECT id, name, "cityId" FROM "Area"');
    const areas = areaRes.rows;

    const serviceRes = await client.query('SELECT id, name FROM "Service"');
    const services = serviceRes.rows;

    const atticaCity = cities.find(c => c.name === 'Αττική');
    if (!atticaCity) {
      console.error("Attica (Αττική) city not found in the database.");
      process.exit(1);
    }
    const targetCityId = atticaCity.id;

    const lines = rawText.trim().split('\n');
    const batch = [];
    const skippedAreas = ['ΣΑΜΟΣ', 'ΧΙΟΣ', 'ΛΗΜΝΟΣ- ΜΥΡΙΝΑ', 'ΣΑΜΟΣ – ΚΑΡΛΟΒΑΣΙ', 'Ν. ΚΑΡΛΟΒΑΣΙ', 'ΛΗΜΝΟΣ', 'ΑΙΓΙΝΑ', 'ΓΑΛΑΤΑΣ', 'ΑΣΤΡΟΣ'];

    for (const line of lines) {
      const parts = line.split('\t');
      if (parts.length < 3) continue;

      const ownerName = parts[0].trim();
      const address = parts[1].trim();
      const areaName = parts[2].trim();
      const postalCode = parts[3] ? parts[3].trim() : '';
      const phone = parts[4] ? parts[4].trim() : '';

      // Skip entries outside Attica region
      if (skippedAreas.some(sa => areaName.toUpperCase().includes(sa))) {
        console.log(`Skipping outside Athens: ${ownerName} (${areaName})`);
        continue;
      }

      batch.push({ ownerName, address, areaName, postalCode, phone });
    }

    console.log(`Parsed ${batch.length} valid language centers in the Athens area for BATCH 10. Executing import...`);

    const newCredentials = [];

    for (let index = 0; index < batch.length; index++) {
      const inst = batch[index];
      const instituteName = `Κέντρο Ξένων Γλωσσών ${inst.ownerName}`;
      const emailName = generateSlug(inst.ownerName);
      const email = `${emailName}@tofrontistirio.gr`;
      const password = Math.random().toString(36).slice(-10) + 'S26!';

      console.log(`[${index + 1}/${batch.length}] Importing BATCH 10: ${instituteName}...`);

      let uid;
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          const { data: existingUser } = await supabase.auth.admin.listUsers();
          uid = existingUser.users.find(u => u.email === email)?.id;
        } else {
          console.error(`  Auth Error for ${instituteName}:`, authError.message);
          continue;
        }
      } else {
        uid = authUser.user.id;
      }

      if (!uid) continue;

      // Upsert User in database as OWNER
      await client.query(`
        INSERT INTO "User" (id, email, role, "onboardingStep", "createdAt", "updatedAt")
        VALUES ($1, $2, 'OWNER', 3, NOW(), NOW())
        ON CONFLICT (email) DO UPDATE SET id = EXCLUDED.id, role = 'OWNER'
      `, [uid, email]);

      // Resolve areaId dynamically
      let areaId = null;
      const cleanAreaName = inst.areaName.replace('ΑΘΗΝΑ - ', '').replace('ΑΘΗΝΑ-', '').trim();
      let area = areas.find(a => a.name === cleanAreaName && a.cityId === targetCityId);
      
      if (!area) {
        const areaSlug = generateSlug(cleanAreaName);
        try {
          const areaInsert = await client.query(`
            INSERT INTO "Area" (id, "cityId", name, "nameEn", slug)
            VALUES (gen_random_uuid(), $1, $2, $3, $4)
            RETURNING id
          `, [targetCityId, cleanAreaName, greekToLatin(cleanAreaName), areaSlug]);
          areaId = areaInsert.rows[0].id;
          areas.push({ id: areaId, name: cleanAreaName, cityId: targetCityId });
        } catch (err) {
          const existingArea = await client.query('SELECT id FROM "Area" WHERE name = $1 AND "cityId" = $2', [cleanAreaName, targetCityId]);
          areaId = existingArea.rows[0]?.id || null;
        }
      } else {
        areaId = area.id;
      }

      const slug = generateSlug(instituteName);
      const fullAddressForGeocoding = `${inst.address}, ${cleanAreaName}, Greece`;
      let coords = await geocode(fullAddressForGeocoding);
      if (!coords) {
        coords = await geocode(`${inst.address}, Attica, Greece`);
      }

      try {
        // Safe monetization guard: explicitly sets isVerified to false
        const instInsert = await client.query(`
          INSERT INTO "Institute" (id, "ownerId", name, slug, status, "isVerified", "createdAt", "updatedAt")
          VALUES (gen_random_uuid(), $1, $2, $3, 'APPROVED', false, NOW(), NOW())
          RETURNING id
        `, [uid, instituteName, slug]);
        
        const instituteId = instInsert.rows[0].id;
        
        await client.query(`
          INSERT INTO "Branch" (id, "instituteId", name, address, "cityId", "areaId", phone, latitude, longitude, "isMain", status, "createdAt", "updatedAt")
          VALUES (gen_random_uuid(), $1, 'Κεντρικό', $2, $3, $4, $5, $6, $7, true, 'APPROVED', NOW(), NOW())
        `, [instituteId, `${inst.address} (T.K. ${inst.postalCode})`, targetCityId, areaId, inst.phone || '', coords?.lat || null, coords?.lng || null]);

        // Map languages services: English, German, French
        const targetLanguages = ['Αγγλικά', 'Γερμανικά', 'Γαλλικά'];
        for (const langName of targetLanguages) {
          const serviceId = services.find(s => s.name === langName)?.id;
          if (serviceId) {
            await client.query(`
              INSERT INTO "InstituteService" (id, "instituteId", "serviceId")
              VALUES (gen_random_uuid(), $1, $2)
              ON CONFLICT DO NOTHING
            `, [instituteId, serviceId]);
          }
        }

        newCredentials.push({ name: instituteName, email: email, password: password, area: cleanAreaName });
        console.log(`  SUCCESS: Created profile for ${instituteName} in ${cleanAreaName}`);
        
        // Anti rate-limiting wait throttle
        await new Promise(resolve => setTimeout(resolve, 1100));
      } catch (err) {
        console.error(`  DB Error for ${instituteName}:`, err.message);
      }
    }

    console.log(`\n--- BATCH 10 ATHENS LANGUAGE CENTERS SUCCESSFULLY IMPORTED (${newCredentials.length} centers) ---`);

    // Merge credentials with existing file
    const credsJsonPath = path.join(__dirname, 'imported_athens_credentials.json');
    const credsCsvPath = path.join(__dirname, 'imported_athens_credentials.csv');

    let allCredentials = [];
    if (fs.existsSync(credsJsonPath)) {
      try {
        allCredentials = JSON.parse(fs.readFileSync(credsJsonPath, 'utf8'));
      } catch (e) {
        console.error("Could not parse existing credentials JSON file", e);
      }
    }

    allCredentials.push(...newCredentials);

    // Save back to JSON
    fs.writeFileSync(credsJsonPath, JSON.stringify(allCredentials, null, 2), 'utf8');
    console.log(`Updated credentials JSON file at: ${credsJsonPath} (Total: ${allCredentials.length} schools)`);

    // Save back to CSV with UTF-8 BOM
    const csvHeaders = 'Name,Email,Password,Area\n';
    const csvRows = allCredentials.map(r => `"${r.name.replace(/"/g, '""')}","${r.email}","${r.password}","${r.area.replace(/"/g, '""')}"`).join('\n');
    fs.writeFileSync(credsCsvPath, '\ufeff' + csvHeaders + csvRows, 'utf8');
    console.log(`Updated credentials CSV file at: ${credsCsvPath} (Total: ${allCredentials.length} schools)`);

  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
