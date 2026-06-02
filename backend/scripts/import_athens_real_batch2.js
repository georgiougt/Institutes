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

const rawText = `ΒΕΡΟΥΔΑΚΗΣ ΓΕΩΡΓΙΟΣ	ΚΕΔΡΗΝΟΥ 27	ΑΜΠΕΛΟΚΗΠΟΙ	11522	2106455265
ΒΕΡΟΥΤΗ ΔΗΜΗΤΡΑ	ΤΕΡΜΑ Λ. ΦΥΛΗΣ	ΑΝΩ ΛΙΟΣΙΑ	13351	2102411047
ΒΙΔΑΛΗ - ΓΕΩΡΓΟΥΛΗ ΘΑΛΕΙΑ	ΑΧΙΛΛΕΩΣ 35	Π. ΦΑΛΗΡΟ	17562	2109810822
ΒΛΑΣΣΟΠΟΥΛΟΥ ΑΝΑΣΤΑΣΙΑ	ΓΡΗΓΟΡΙΟΥ Ε' 43 & ΜΕΓ.ΑΛΕΞΑΝΔΡΟΥ	ΑΡΓΥΡΟΥΠΟΛΗ	16452	2117152425
ΒΛΑΧΟΠΟΥΛΟΥ ΜΑΡΙΑ	ΝΙΚΗΣ 14	ΑΧΑΡΝΑΙ	13675	2102406293
ΒΛΑΧΟΣ ΓΕΩΡΓΙΟΣ	ΠΑΡΟΥ 1 KAI ΖΑΛΟΓΓΟΥ ΔΙΛΟΦΟ	ΒΑΡΗ	16672	2108950909
ΒΛΑΧΟΥ ΤΖΕΝΗ	ΜΑΚ ΜΙΛΛΑΝ 13	ΑΘΗΝΑ-ΑΝΩ ΠΑΤΗΣΙΑ	11144	2102280270
ΒΟΓΙΑΤΖΗ ΜΑΡΙΑ	ΠΕΥΚΩΝ 25	ΠΕΡΙΣΤΕΡΙ	12137	2105019800
ΒΟΓΚΑ ΒΑΡΒΑΡΑ	ΡΑΙΔΕΣΤΟΥ 10A	ΑΘΗΝΑ - ΚΟΛΩΝΟΣ	10444	2105139900
ΒΟΛΙΚΑΚΗ ΕΙΡΗΝΗ	ΚΑΣΤΟΡΙΑΣ 4	ΑΝΩ ΛΙΟΣΙΑ	13341	2102472772
ΒΟΛΙΚΗΣ-ΚΑΤΣΑΡΟΣ ΜΙΧΑΗΛ	ΜΑΓΝΗΣΙΑΣ 18	ΚΕΡΑΤΣΙΝΙ	18757	2104312994
ΒΟΝΤΑ ΑΓΓΕΛΙΚΗ - ΕΛΠΙΔΑ	ΣΚΟΥΦΑ 56	ΑΙΓΑΛΕΩ	12243	2105907020
ΒΟΡΡΙΑ ΣΤΑΜΑΤΙΑ "ΑΝΑΒΑΘΜΙΣΗ"	ΒΕΡΙΤΗ 27	ΧΙΟΣ	82100	2271044190
ΒΟΥΓΙΟΥΚΛΗΣ ΑΛΕΞΑΝΔΡΟΣ	ΠΑΡΘΕΝΩΝΟΣ 70	Π. ΦΑΛΗΡΟ	17562	2106141631
ΒΟΥΤΣΙΝΑ-ΚΥΡΙΑΚΟΠΟΥΛΟΥ ΠΟΘΗΤΗ	ΔΗΜ. ΛΙΑΚΟΥ 17 & ΠΟΣΕΙΔΩΝΟΣ	ΑΣΠΡΟΠΥΡΓΟΣ	19300	2111844107
ΒΟΥΤΣΙΝΟΥ ΦΡΑΓΚΙΣΚΑ	ΟΙΤΗΣ 8	ΜΕΤΑΜΟΡΦΩΣΗ	14451	2102810910
ΒΥΘΟΥΛΚΑ ΣΠΥΡΙΔΟΥΛΑ	ΧΑΡΙΛΑΟΥ ΤΡΙΚΟΥΠΗ 13	ΙΛΙΟΝ	13123	2114080010
ΓΑΒΑΚΗ ΣΤΑΥΡΟΥΛΑ	Λ. ΚΑΡΑΜΑΝΛΗ 76	ΑΧΑΡΝΑΙ	13678	2102467297
ΓΑΒΡΙΕΛΑΤΟΥ ΜΑΡΙΑ	ΣΠΕΤΣΩΝ 74	ΑΘΗΝΑ - ΚΥΨΕΛΗ	11362	2108214282
ΓΑΒΡΙΗΛ ΕΥΡΙΔΙΚΗ	ΣΤΑΜΑΤΙΟΥ ΥΦΑΝΤΗ 5	ΚΟΡΩΠΙ	19400	2106624279
ΓΑΛΑΖΙΟΥ ΑΘΗΝΑ	ΑΙΓΑΛΕΩ 14	ΝΕΑ ΣΜΥΡΝΗ	17124	2109340354
ΓΑΛΑΘΡΗ ΘΕΟΦΑΝΙΑ	ΚΟΝΤΑΚΑΙΚΑ	ΣΑΜΟΣ – ΚΑΡΛΟΒΑΣΙ	83200	2273079360
ΓΑΛΑΝΑΚΗ ΜΑΡΙΑ	ΘΕΡΜΟΠΥΛΩΝ 4	ΓΑΛΑΤΣΙ	11147	2102224310
ΓΑΛΑΝΗΣ ΒΑΣΙΛΗΣ	ΓΑΛΑΞΙΔΙΟΥ 42	ΜΟΣΧΑΤΟ	18345	2109413274
ΓΑΛΑΤΗ ΜΑΡΙΑ	ΜΕΓ. ΑΛΕΞΑΝΔΡΟΥ 2-4	ΣΑΛΑΜΙΝΑ	18900	2104657635
ΓΑΛΙΑΝΟΥ-ΤΖΙΦΑ ΔΕΣΠΟΙΝΑ	Κ. ΠΑΛΑΜΑ 188	ΠΕΤΡΟΥΠΟΛΗ	13231	2105018698
ΓΑΡΓΑΡΕΤΑ ΟΛΥΜΠΙΑ	ΑΡΙΣΤΟΦΑΝΟΥΣ 1	ΑΓ. ΑΝΑΡΓΥΡΟΙ	13561	2102620671
ΓΑΡΜΠΗ ΑΝΑΣΤΑΣΙΑ	ΑΙΓΛΗΣ & ΝΑΟΥΣΗΣ 37	ΠΕΡΙΣΤΕΡΙ	12137	2105752515
ΓΕΓΑΚΗ - ΜΑΥΡΑΚΗ ΜΑΡΙΑ	ΠΑΡΑΣΚΕΥΟΠΟΥΛΟΥ 32	ΠΕΡΙΣΤΕΡΙ	12132	2105775124
ΓΕΡΑΚΗ ΟΛΓΑ	ΑΪΔΙΝΙΟΥ 17	ΝΕΑ ΣΜΥΡΝΗ	17121	2109322979
ΓΕΡΑΚΗΣ ΠΑΝΑΓΙΩΤΗΣ	ΔΟΥΡΙΔΟΣ 4-6	ΑΘΗΝΑ-ΠΑΓΚΡΑΤΙ	11364	2155107540
ΓΕΡΑΣΙΜΟΥ ΣΤΑΜΑΤΙΝΑ	ΜΟΥΔΑΝΙΩΝ 20	ΝΙΚΑΙΑ	18451	2104902420
ΓΕΡΜΑΝΗ ΘΕΟΔΩΡΑ	ΠΙΝΔΟΥ 56	ΙΛΙΟΝ	13123	2105020252
ΓΕΡΜΑΝΗ - ΧΑΛΑ ΕΛΕΝΗ	ΠΙΝΔΟΥ 56	ΙΛΙΟΝ	13123	2105020252
ΓΕΩΡΓΙΟΥ ΑΙΚΑΤΕΡΙΝΗ	ΚΟΡΑΗ 41	ΠΕΡΙΣΤΕΡΙ	12137	2105764165
ΓΕΩΡΓΙΟΥ ΕΥΓΕΝΙΑ	ΠΑΥΛΟΥ ΦΥΣΣΑ 60 (ΠΡΩΗΝ ΠΑΝΑΓΗ ΤΣΑΛΔΑΡΗ)	ΚΕΡΑΤΣΙΝΙ	18757	2104319888
ΓΕΩΡΓΟΠΟΥΛΟΥ ΠΑΡΑΣΚΕΥΗ	ΓΕΩΡΓΙΟΥ ΨΥΧΟΓΙΟΥ 35	ΑΓ. ΔΗΜΗΤΡΙΟΣ	17341	2109754973
ΓΕΩΡΓΟΠΟΥΛΟΥ ΑΝΝΑ-ΑΓΓΕΛΙΚΗ	ΚΝΩΣΣΟΥ 5	ΤΑΥΡΟΣ	17778	2103464947
ΓΕΩΡΓΟΥΔΗΣ ΓΡΗΓΟΡΙΟΣ	ΔΕΜΕΡΤΖΗ 80	ΚΕΡΑΤΣΙΝΙ	18757	2104318266
ΓΕΩΡΓΟΥΛΕΑ ΚΑΙΤΗ	Γ. ΠΑΠΑΝΔΡΕΟΥ 57	ΜΕΤΑΜΟΡΦΩΣΗ	14452	2102818780
ΓΙΑΛΑΜΑ ΚΑΛΛΙΡΟΗ	ΕΛ.ΒΕΝΙΖΕΛΟΥ & ΗΠΕΙΡΟΥ 1	ΑΓ. ΒΑΡΒΑΡΑ	12351	2105447922
ΓΙΑΝΝΑΔΑΚΗ ΚΑΛΛΙΟΠΗ	ΠΙΝΔΟΥ ΚΑΙ ΔΑΒΑΚΗ 29	ΑΓ. ΑΝΑΡΓΥΡΟΙ	13561	2108543372
ΓΙΑΝΝΑΚΑΚΗ ΠΑΝΑΓΙΩΤΑ	ΑΛΚΑΜΕΝΟΥΣ 19 & ΜΟΥΣΩΝ	ΝΙΚΑΙΑ	18452	2104977711
ΓΙΑΝΝΑΚΗ ΑΝΝΑ	ΚΥΠΑΡΙΣΣΙΑΣ 48	ΑΙΓΑΛΕΩ	12244	2105903237
ΓΙΑΝΝΑΚΗ ΝΑΝΤΙΑ ΣΟΦΙΑ	Ε.ΔΡΙΤΣΑ 4	ΜΑΡΚΟΠΟΥΛΟ - ΠΟΡΤΟ ΡΑΦΤΗ	19003	2299023545
ΓΙΑΝΝΑΚΗ ΑΜΑΝΤΑ ΑΝΝΑ	Ε.ΔΡΙΤΣΑ 4	ΜΑΡΚΟΠΟΥΛΟ - ΠΟΡΤΟ ΡΑΦΤΗ	19003	2299023545
ΓΙΑΝΝΑΚΟΠΟΥΛΟΣ ΠΑΝΑΓΙΩΤΗΣ	ΠΑΤΗΣΙΩΝ 89	ΑΘΗΝΑ	10434	2108827350
ΓΙΑΝΝΑΚΟΠΟΥΛΟΥ ΜΑΡΘΑ	ΡΟΥΜΕΛΗΣ 27 & ΜΥΚΗΝΩΝ 15	ΧΑΛΑΝΔΡΙ	15233	2106800708
ΓΙΑΝΝΑΚΟΠΟΥΛΟΥ ΠΑΝΑΓΙΩΤΑ	ΑΜΦΙΤΡΙΤΗΣ 4	ΑΡΤΕΜΙΣ ΓΑΛΗΝΗ	19016	2294088331
ΓΙΑΝΝΑΚΟΥ ΑΘΗΝΑ	ΑΔΡΙΑΝΟΥ 1	ΚΟΡΩΠΙ	19400	2106622481
ΓΙΑΝΝΑΡΑΚΗ ΜΑΡΙΑ - ΘΕΟΔΩΡΑ	ΒΟΥΛΓΑΡΟΚΤΟΝΟΥ 93	ΝΙΚΑΙΑ	18452	2104942108
ΓΙΑΝΝΙΚΑΚΗ ΕΥΓΕΝΙΑ	ΗΡΩΩΝ ΠΟΛΥΤΕΧΝΕΙΟΥ 8 1ος όροφος	ΑΓ. ΠΑΡΑΣΚΕΥΗ	15343	2106000161
ΓΙΑΝΝΙΟΥ ΛΙΛΙΑΝ	ΜΑΚΕΔΟΝΙΑΣ 72 & ΛΑΚΩΝΙΑΣ	ΠΕΙΡΑΙΑΣ	18545	2104203619
ΓΙΑΝΝΟΠΟΥΛΟΣ ΕΥΑΓΓΕΛΟΣ	ΓΡ. ΛΑΜΠΡΑΚΗ 2	ΑΝΩ ΛΙΟΣΙΑ	13341	2102484463
ΓΙΑΝΝΟΠΟΥΛΟΣ ΝΙΚΟΛΑΟΣ	ΔΙΓΕΝΗ 5	ΗΛΙΟΥΠΟΛΗ	16344	2109760808
ΓΙΑΝΝΟΥ ΕΛΕΝΗ	ΒΑΣΙΛΕΙΟΥ ΜΟΙΡΑ 9	ΜΑΝΔΡΑ	19600	2105555282
ΓΙΑΝΝΟΥΛΑΚΗ ΑΓΓΕΛΙΚΗ	ΣΜΥΡΝΗΣ 34	ΚΕΡΑΤΣΙΝΙ	18756	2104621195
ΓΙΑΝΟΒΑ ΕΛΙΣΑΒΕΤ	ΚΟΛΟΚΟΤΡΩΝΗ 15	ΑΘΗΝΑ	10562	2103819310
ΓΙΑΧΑΛΗ ΜΑΡΙΑ	ΚΑΛΛΙΔΡΟΜΙΟΥ & ΑΤΑΛΑΝΤΗΣ	ΑΝΩ ΛΙΟΣΙΑ	13341	2102473423
ΓΙΟΒΑΝΗ ΑΔΑΜΑΝΤΙΑ	ΣΠΑΡΤΗΣ 46	ΠΕΤΡΟΥΠΟΛΗ	13231	2105014160
ΓΙΩΤΑΚΗ ΑΘΗΝΑ	ΚΑΛΛΙΘΕΑΣ 33	ΑΓ.ΔΗΜΗΤΡΙΟΣ	17343	2114041857
ΓΚΑΖΑ ΒΑΣΙΛΙΚΗ	ΠΑΝΟΡΜΟΥ 75 & ΑΧΑΙΑΣ 45	ΑΘΗΝΑ	11523	2106911735
ΓΚΑΝΤΩΝΑ ΑΓΝΗ-ΠΟΛΥΤΙΜΗ	ΜΠΙΣΜΠΙΡΟΥΛΑ 6	ΡΑΦΗΝΑ	19009	2294076555
ΓΚΑΡΙΛΑ ΓΕΩΡΓΙΑ -ΔΑΦΝΗ	34ου ΣΥΝΤΑΓΜΑΤΟΣ 50	ΖΩΓΡΑΦΟΣ	15773	2107754025
ΓΚΑΡΙΛΑ ΕΙΡΗΝΗ	34ου ΣΥΝΤΑΓΜΑΤΟΣ 50	ΖΩΓΡΑΦΟΣ	15773	2107754025
ΓΚΕΚΑ ΑΝΤΙΓΟΝΗ	ΑΙΓΙΝΗΣ 1	ΜΕΛΙΣΣΙΑ	15127	2108049733
ΓΚΙΝΗ ΦΩΤΕΙΝΗ	25ΗΣ ΜΑΡΤΙΟΥ 51	ΒΡΙΛΗΣΣΙΑ	15235	2106391950
ΓΚΙΟΚΑΣ ΙΩΑΝΝΗΣ	ΔΙΓΕΝΗ ΑΚΡΙΤΑ 101Α	ΠΕΤΡΟΥΠΟΛΗ	13231	2105019608
ΓΚΙΟΚΑΣ ΜΙΧΑΗΛ	ΚΟΛΟΚΟΤΡΩΝΗ 14	ΣΑΛΑΜΙΝΑ	18900	2104671353
ΓΚΙΟΚΑΣ ΜΑΡΙΟΣ	ΓΥΦΤΕΑ 23	ΕΛΕΥΣΙΝΑ	19200	2105546315
ΓΚΙΩΝΗ ΚΩΝΣΤΑΝΤΙΝΑ	ΡΟΔΟΥ 172	ΑΘΗΝΑ - ΣΕΠΟΛΙΑ	10443	2105151374
ΓΚΙΩΝΗ ΜΑΡΙΑ	ΠΕΥΚΩΝ 101	ΗΡΑΚΛΕΙΟ ΑΤΤΙΚΗΣ	14123	2106127254
ΓΚΟΝΗ ΜΑΡΙΑ	Μ.ΑΛΕΞΑΝΔΡΟΥ 76	ΚΟΡΥΔΑΛΛΟΣ	18120	2104957801
ΓΚΟΡΟΥ ΒΑΣΙΛΙΚΗ	ΜΙΛΗΤΟΥ 7	ΥΜΗΤΤΟΣ	17237	2107610242
ΓΚΟΤΣΗ ΑΘΑΝΑΣΙΑ	ΤΡΙΩΝ ΙΕΡΑΡΧΩΝ 8 & ΣΑΧΤΟΥΡΗ	ΚΟΡΥΔΑΛΛΟΣ	18122	2104960300
ΓΚΟΤΣΟΥΛΙΑ ΒΑΣΙΛΙΚΗ	ΑΙΤΩΛΙΑΣ 12	ΚΑΜΑΤΕΡΟ	13451	2102382616
ΓΚΟΥΣΤΗ ΑΝΔΡΟΜΑΧΗ	ΗΠΕΙΡΟΥ 37	ΑΓΙΟΣ ΔΗΜΗΤΡΙΟΣ	17343	2109328052
ΓΛΥΜΑΚΟΠΟΥΛΟΥ ΕΙΡΗΝΗ	ΚΩΝΣΤΑΝΤΙΝΟΥΠΟΛΕΩΣ 83	ΑΡΓΥΡΟΥΠΟΛΗ	16452	2109652017
ΓΟΥΔΕΛΗ ΜΑΧΗ	ΟΙΚΟΔΟΜΙΚΟ ΤΕΤΡΑΓΩΝΟ 549	ΜΕΓΑΡΑ	19100	2296083702
ΓΟΥΡΔΟΜΙΧΑΛΗ ΚΥΡΙΑΚΗ	ΣΠΑΡΤΗΣ 118	ΚΑΛΛΙΘΕΑ	17675	2109589671
ΓΟΥΡΔΟΜΙΧΑΛΗ ΓΕΩΡΓΙΑ	ΣΠΑΡΤΗΣ 118	ΚΑΛΛΙΘΕΑ	17675	2109589671
ΓΟΥΡΔΟΥΠΑΡΗ ΜΑΡΙΑ	ΕΡΕΣΣΟΥ 22	ΑΓΙΟΣ ΔΗΜΗΤΡΙΟΣ	17341	2109354911
ΓΟΥΡΝΑΚΗ ΠΑΝΑΓΟΥΛΑ	ΕΥΛΑΜΠΙΑΣ 60	ΙΛΙΟΝ	13123	2102616126
ΓΡΑΜΜΑΤΙΚΟΣ ΦΑΙΔΩΝΑΣ	ΛΟΚΡΙΔΟΣ 13	ΑΘΗΝΑ - ΓΚΥΖΗ	11474	2106469100
ΓΡΑΝΤΖΙΔΟΥ ΜΑΡΙΑ	ΡΟΔΟΠΟΛΕΩΣ 91	ΕΛΛΗΝΙΚΟ	16777	2109652640
ΓΡΑΨΑΣ ΓΕΩΡΓΙΟΣ	ΣΑΛΑΜΙΝΟΣ 52	ΑΙΓΑΛΕΩ	12244	2105698865
ΓΡΙΒΑ ΔΙΟΝΥΣΙΑ	ΣΟΛΩΝΟΣ 9	ΝΕΑ ΠΕΡΑΜΟΣ	19006	2296032781
ΓΩΓΟΥ ΚΩΝΣΤΑΝΤΙΝΑ	ΑΜΦΙΤΡΙΤΗΣ 8	ΖΩΓΡΑΦΟΣ	15773	2111158632
ΔΑΓΡΕ ΒΑΣΙΛΙΚΗ	ΜΙΝΩΑΣ 22	ΜΕΓΑΡΑ	19100	2296081166
ΔΑΝΑ-ΒΑΡΟΥΤΕΛΗ ΒΑΣΙΛΙΚΗ	ΑΓ. ΧΡΙΣΤΟΦΟΡΟΥ 8	ΠΙΚΕΡΜΙ	19009	2106036328
ΔΑΠΟΝΤΗ ΜΑΡΙΝΑ	ΟΜΗΡΟΥ 36	ΝΙΚΑΙΑ	18452	2104940914
ΔΑΣΚΑΛΑΚΗ ΕΙΡΗΝΗ	ΝΕΩΣΟΙΚΩΝ 63	ΠΕΙΡΑΙΑΣ - ΠΗΓΑΔΑ	18537	2104536876 & 873
ΔΑΣΚΑΛΟΠΟΥΛΟΣ ΚΩΝΣΤΑΝΤΙΝΟΣ	ΠΛΑΤΑΙΩΝ 1 & ΝΑΥΑΡΙΝΟΥ	ΠΕΡΙΣΣΟΣ	14232	2102528178
ΔΑΣΚΑΛΟΠΟΥΛΟΥ ΠΑΝΑΓΙΑ	ΒΑΛΤΕΤΣΙΟΥ 39	ΑΘΗΝΑ - ΕΞΑΡΧΕΙΑ	10681	2103805175`;

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
    const skippedAreas = ['ΣΑΜΟΣ', 'ΧΙΟΣ', 'ΛΗΜΝΟΣ- ΜΥΡΙΝΑ', 'ΣΑΜΟΣ – ΚΑΡΛΟΒΑΣΙ', 'Ν. ΚΑΡΛΟΒΑΣΙ'];

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

    console.log(`Parsed ${batch.length} valid language centers in the Athens area for BATCH 2. Executing import...`);

    const newCredentials = [];

    for (let index = 0; index < batch.length; index++) {
      const inst = batch[index];
      const instituteName = `Κέντρο Ξένων Γλωσσών ${inst.ownerName}`;
      const emailName = generateSlug(inst.ownerName);
      const email = `${emailName}@tofrontistirio.gr`;
      const password = Math.random().toString(36).slice(-10) + 'S26!';

      console.log(`[${index + 1}/${batch.length}] Importing BATCH 2: ${instituteName}...`);

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

    console.log(`\n--- BATCH 2 ATHENS LANGUAGE CENTERS SUCCESSFULLY IMPORTED (${newCredentials.length} centers) ---`);

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
