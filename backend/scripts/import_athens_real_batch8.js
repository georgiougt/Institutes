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

const rawText = `ΠΑΠΑΜΑΚΑΡΙΟΥ ΛΕΥΚΟΘΕΑ	ΕΠΙΔΑΥΡΟΥ 18	ΑΘΗΝΑ - ΚΟΛΩΝΟΣ	10444	2105154361
ΠΑΠΑΝΑΓΙΩΤΟΥ ΔΗΜΗΤΡΑ	ΠΑΠΑΔΙΑΜΑΝΤΗ 216Β	ΑΓ. ΒΑΡΒΑΡΑ	12351	2105620244
ΠΑΠΑΝΑΣΤΑΣΙΟΥ ΑΝΘΟΥΛΑ	ΚΥΠΡΟΥ & ΠΟΝΤΟΥ 5	ΗΛΙΟΥΠΟΛΗ	16346	2109737223
ΠΑΠΑΝΙΚΟΛΑΟΥ ΓΑΡΥΦΑΛΛΙΑ	ΦΑΛΑΓΓΙΤΩΝ 9	ΠΕΡΙΣΤΕΡΙ	12133	2105765195
ΠΑΠΑΝΙΚΟΛΑΟΥ ΝΙΚΟΛΕΤΑ	Π.ΗΡΩΩΝ ΠΟΛΥΤΕΧΝΕΙΟΥ 43-Ν. ΠΕΝΤΕΛΗ	ΝΕΑ ΠΕΝΤΕΛΗ	15239	2108032776
ΠΑΠΑΟΙΚΟΝΟΜΟΥ ΤΙΝΑ	Π. ΜΕΛΑ 46	ΜΕΤΑΜΟΡΦΩΣΗ	14451	2102817799
ΠΑΠΑΣΤΕΡΓΙΟΥ ΝΙΚΟΛΑΟΣ	ΚΑΝΙΓΓΟΣ 8	ΑΘΗΝΑ - ΚΕΝΤΡΟ	10677	2103819395
ΠΑΠΑΣΤΕΡΓΙΟΥ ΦΩΤΕΙΝΗ	ΚΑΤΩ ΦΟΥΣΑ	ΑΣΠΡΟΠΥΡΓΟΣ	19300	2105570020
ΠΑΠΑΦΡΑΓΚΟΥ ΖΩΗ	ΛΕΩΦ. ΣΑΛΑΜΙΝΟΣ 86	ΣΑΛΑΜΙΝΑ	18901	2104650627
ΠΑΠΑΧΡΙΣΤΟΔΟΥΛΟΥ ΕΛΕΥΘΕΡΙΑ	ΘΗΣΕΩΣ 10	ΝΕΟ ΗΡΑΚΛΕΙΟ	14122	2102833332
ΠΑΠΟΥΛΗΣ ΙΩΑΝΝΗΣ	ΠΕΤΡΟΥΠΟΛΕΩΣ 51	ΙΛΙΟΝ	13123	2102623089
ΠΑΠΟΥΛΙΑ ΚΑΤΕΡΙΝΑ	ΑΝΔΡΟΜΑΧΗΣ 79	ΚΑΛΛΙΘΕΑ	17671	2109594670
ΠΑΠΠΑ ΕΡΜΙΟΝΗ	ΚΥΔΩΝΙΩΝ 26	ΑΘΗΝΑ - ΣΕΠΟΛΙΑ	10443	2111157901
ΠΑΠΠΑ ΧΡΥΣΑΥΓΗ	ΚΑΡΑΙΣΚΑΚΗ & ΟΛΥΜΠΙΟΥ	ΑΝΩ ΛΙΟΣΙΑ	13341	2102471287
ΠΑΠΠΑ ΑΛΕΞΑΝΔΡΑ	ΑΝΔΑΝΕΙΑΣ 28	ΑΧΑΡΝΑΙ	13675	2102444320
ΠΑΠΠΑ ΑΓΓΕΛΙΚΗ	ΑΓΙΑ ΠΑΡΑΣΚΕΥΗΣ 107	ΧΑΛΑΝΔΡΙ	15234	2106082147
ΠΑΠΠΑ ΧΑΡΙΚΛΕΙΑ	ΠΑΛ. ΠΑΤ.ΓΕΡΜΑΝΟΥ 1	ΒΡΙΛΗΣΣΙΑ	15235	2108046442
ΠΑΠΠΑ ΑΝΑΣΤΑΣΙΑ	Λ.ΜΑΡΑΘΩΝΟΣ 126	ΜΑΡΑΘΩΝΑΣ	19007	2294066860
ΠΑΡΑΒΑΛΟΣ ΧΑΡΑΛΑΜΠΟΣ	ΑΘΗΝΑΣ 25	ΛΑΥΡΙΟ	19500	2292027453
ΠΑΡΑΣΚΕΥΑ ΘΕΟΔΩΡΑ	ΑΓ.ΒΑΡΒΑΡΑΣ ΚΑΙ ΔΗΜΟΣΘΕΝΟΥΣ	ΑΝΑΒΥΣΣΟΣ	19013	2291079307
ΠΑΡΑΣΚΕΥΑΣ ΒΑΣΙΛΕΙΟΣ	ΚΡΗΤΗΣ 68	ΝΕΑ ΙΩΝΙΑ	14231	2102770803
ΠΑΣΙΑΛΗ ΑΙΚΑΤΕΡΙΝΗ	ΠΥΡΡΟΥ 17	ΑΘΗΝΑ - ΠΑΓΚΡΑΤΙ	11633	2107516592
ΠΑΣΤΡΑΣ ΝΙΚΟΛΑΟΣ	ΟΔ. ΑΝΔΡΟΥΤΣΟΥ 3	ΜΑΡΟΥΣΙ	15124	2106123474
ΠΑΤΕΛΗ-ΓΙΑΝΝΟΥΛΑ ΑΝΝΑ	ΦΛΟΙΑΣ 42Α	ΜΑΡΟΥΣΙ	15125	2106141719
ΠΑΤΙΛΗ ΦΩΤΕΙΝΗ	ΤΑΥΓΕΤΟΥ 35	ΑΧΑΡΝΑΙ	13675	2102465745
ΠΑΤΡΙΚΙΟΥ ΑΙΚΑΤΕΡΙΝΗ	ΟΔΥΣΣΕΩΣ & ΚΟΜΝΗΝΩΝ 24	ΝΙΚΑΙΑ	18454	2104970970
ΠΑΤΡΙΚΙΟΥ ΚΩΝΣΤΑΝΤΙΝΑ	ΟΔΥΣΣΕΩΣ & ΚΟΜΝΗΝΩΝ 24	ΝΙΚΑΙΑ	18454	2104970970
ΠΑΥΛΑΚΟΥ ΤΖΕΝΗ	Ν. ΛΑΣΙΘΙΟΥ 13 & ΔΙΓ. ΑΚΡΙΤΑ	ΑΙΓΑΛΕΩ	12243	2105312200
ΠΑΥΛΑΚΟΥ - ΠΑΝΑΓΙΩΤΟΠΟΥΛΟΥ ΤΖΕΝΗ	ΚΩΝΣΤΑΝΤΙΝΟΥΠΟΛΕΩΣ 59	ΒΥΡΩΝΑΣ	16232	2107644853
ΠΑΥΛΗ ΕΛΕΝΗ	ΠΑΛΑΜΗΔΙΟΥ 63	ΑΘΗΝΑ - ΚΟΛΩΝΟΣ	10441	2105127167
ΠΑΥΛΙΝΕΡΗ ΣΤΕΛΛΑ	ΛΕΩΦ.ΦΑΝΕΡΩΜΕΝΗΣ	ΑΙΓΙΝΑ	18010	2297026506
ΠΑΥΛΟΥ ΑΝΑΣΤΑΣΙΑ	ΣΤΡΑΤ. ΑΛΕΞ. ΠΑΠΑΓΟΥ 18	ΝΕΑ ΦΙΛΑΔΕΛΦΕΙΑ	14342	2102587330
ΠΕΓΚΑ ΣΟΦΙΑ	ΟΛΥΜΠΙΑΣ 39	ΓΑΛΑΤΣΙ	11147	2155107866
ΠΕΛΕΚΑΝΟΥ ΜΑΡΙΑ	ΑΓ. ΓΕΩΡΓΙΟΥ 15	ΝΕΑ ΦΙΛΑΔΕΛΦΕΙΑ	14342	2102777725
ΠΕΝΤΑ ΕΥΘΥΜΙΑ	ΛΕΟΝΤΑΡΙΔΟΥ 6	ΛΑΥΡΙΟ	19500	2292060115
ΠΕΞΟΥ ΑΓΓΕΛΙΚΗ	ΑΪΔΙΝΙΟΥ 17	ΝΕΑ ΣΜΥΡΝΗ	17121	2109322979
ΠΕΡΑΚΗ ΣΤΥΛΙΑΝΗ	ΑΙΓΑΙΟΥ 60	ΝΕΑ ΣΜΥΡΝΗ	17123	2109310383
ΠΕΡΝΙΕΝΤΑΚΗ ΑΝΝΑ - ΜΑΡΙΑ	ΚΩΝ/ΝΟΥ ΠΑΛΑΙΟΛΟΓΟΥ 53	ΧΑΛΑΝΔΡΙ	15232	2106819705
ΠΕΤΑΛΑ ΑΝΝΑ	ΑΦΕΝΤΟΥΛΗ 6	ΠΕΙΡΑΙΑΣ	18536	2104524343
ΠΕΤΡΑΚΗ - ΚΟΥΜΑΤΟΥ ΕΛΕΝΗ	ΦΩΚΑΙΑΣ 9	ΝΕΑ ΣΜΥΡΝΗ	17121	2109346530
ΠΕΤΡΑΚΟΠΟΥΛΟΥ ΣΠΥΡΙΔΟΥΛΑ	ΓΡΑΒΙΑΣ 62	ΠΕΤΡΟΥΠΟΛΗ	13231	2105059577
ΠΕΤΡΙΔΟΥ ΧΡΙΣΤΙΝΑ - ΧΡΥΣΗ	ΤΡΟΙΖΗΝΙΑΣ 6	Ν. ΚΗΦΙΣΙΑ	14564	2108070055
ΠΕΤΡΙΩΤΗ ΑΓΓΕΛΙΚΗ	ΡΟΔΩΝ 28Α	ΝΕΑ ΙΩΝΙΑ	14235	2130044243
ΠΕΤΡΟΠΟΥΛΟΥ ΕΛΕΝΗ	ΠΙΝΔΟΥ 71	ΑΝΩ ΛΙΟΣΙΑ	13341	2102486652
ΠΗΛΙΟΥΡΑ-ΠΑΠΑΔΟΠΟΥΛΟΥ ΑΙΚΑΤΕΡΙΝΗ	ΑΓΙΟΥ ΔΗΜΗΤΡΙΟΥ 177	ΚΟΡΩΠΙ	19400	2291091306
ΠΗΛΙΧΟΥ ΒΑΣΙΛΙΚΗ	ΘΡΑΚΗΣ 62	ΚΑΜΑΤΕΡΟ	13451	2386304
ΠΙΣΙΜΙΣΗ ΜΑΤΟΥΛΑ	Λ. ΒΟΥΛΙΑΓΜΕΝΗΣ 128	ΑΘΗΝΑ - ΝΕΟΣ ΚΟΣΜΟΣ	11744	2109010545
ΠΛΑΒΟΥΚΟΥ ΕΥΑΓΓΕΛΙΑ	ΚΑΡΑΙΣΚΑΚΗ & ΟΛΥΜΠΙΟΥ	ΑΝΩ ΛΙΟΣΙΑ	13341	2102471287
ΠΛΑΤΑΝΙΑ ΙΩΑΝΝΑ	ΙΓΝΑΤΙΟΥ 54	ΠΕΤΡΟΥΠΟΛΗ	13231	2105066209
ΠΛΑΤΡΙΤΟΥ - ΠΕΤΡΟΠΟΥΛΑΚΟΥ ΑΘΗΝΑ	Ν. ΖΕΡΒΟΥ 67	ΚΑΛΛΙΘΕΑ	17675	2109577529
ΠΛΙΑΚΟΣ ΑΠΟΣΤΟΛΟΣ	Κ. ΑΓΩΝΙΣΤΩΝ 55	ΑΡΓΥΡΟΥΠΟΛΗ	16451	2109917654
ΠΛΙΑΚΟΥ ΙΩΑΝΝΑ	Κ. ΑΓΩΝΙΣΤΩΝ 55	ΑΡΓΥΡΟΥΠΟΛΗ	16451	2109917654
ΠΟΓΚΑ ΠΕΤΡΟΥΛΑ	ΘΗΣΕΩΣ 33	ΚΟΡΩΠΙ	19400	2106021187
ΠΟΛΙΤΗ ΑΠΟΛΛΩΝΙΑ	ΜΠΟΥΜΠΟΥΛΙΝΑΣ 115	ΧΑΙΔΑΡΙ	12462	2105320957
ΠΟΛΙΤΟΠΟΥΛΟΣ ΕΥΑΓΓΕΛΟΣ	ΦΟΡΜΙΩΝΟΣ 240	ΒΥΡΩΝΑΣ	16232	2130298493
ΠΟΛΥΓΕΝΗΣ ΠΑΝΑΓΙΩΤΗΣ	ΔΕΛΦΩΝ 83	ΑΙΓΑΛΕΩ	12243	2105316949
ΠΟΝΤΙΚΟΠΟΥΛΟΣ ΑΛΕΞΑΝΔΡΟΣ	ΠΡΟΠΥΛΑΙΩΝ 31	ΠΕΡΙΣΤΕΡΙ	12135	2105717807
ΠΟΥΛΙΟΥ ΑΛΕΞΑΝΔΡΑ	ΤΖΩΝ ΚΕΝΝΕΝΤΥ 179	ΠΕΡΙΣΤΕΡΙ	12136	2105733141
ΠΡΙΟΒΟΛΟΥ ΜΑΡΙΑ	ΦΩΣΚΟΛΟΥ 4	ΑΘΗΝΑ - ΠΑΤΗΣΙΑ	11141	2102111077
ΠΡΩΤΟΠΑΠΑ ΑΙΚΑΤΕΡΙΝΑ	ΣΕΒΑΣΤΕΙΑΣ 46	ΝΕΑ ΙΩΝΙΑ	14231	2102715900
ΠΤΩΧΙΑΔΗ-ΓΙΑΝΝΟΥΛΑΤΟΥ ΙΛΙΑΝΑ	Γ.ΠΑΠΑΝΔΡΕΟΥ 77	ΑΓ. ΑΝΑΡΓΥΡΟΙ	13562	2102612612
ΠΩΠΟΤΑ ΕΥΤΥΧΙΑ	ΠΑΥΛΟΥ ΦΥΣΣΑ 72	ΚΕΡΑΤΣΙΝΙ	18757	2104321860
ΡΑΓΚΟΥΣΗ ΕΛΕΥΘΕΡΙΑ	ΟΔΥΣΣΕΩΣ 61	ΧΑΙΔΑΡΙ	12461	2105321801
ΡΑΛΛΙΑ ΜΑΡΙΑ	ΜΑΚΑΡΙΟΥ 70	ΙΛΙΟΝ	13123	2105013084
ΡΑΜΑΛΗ ΕΙΡΗΝΗ	ΦΙΛΟΛΑΟΥ 180	ΑΘΗΝΑ - ΠΑΓΚΡΑΤΙ	11632	2107564800
ΡΑΜΑΝΤΑΝΗ ΑΓΓΕΛΙΚΗ	ΚΡΕΒΒΑΤΑ 105	ΠΕΙΡΑΙΑΣ - ΚΑΛΛΙΠΟΛΗ	18539	2104513288
ΡΑΝΤΗ ΧΡΙΣΤΙΑΝΑ	ΑΓΩΝΙΣΤΩΝ 39	ΠΕΥΚΗ	15121	2108053416
ΡΑΝΤΟΥ ΘΕΟΔΩΡΑ	ΑΝΔΡΙΤΣΑΙΝΗΣ 66	ΓΑΛΑΤΣΙ	11146	2102922951
ΡΑΣΣΙΑ ΜΑΡΙΑΡΕΝΑ	ΠΟΛΥΤΕΧΝΕΙΟΥ 25	ΝΕΟ ΗΡΑΚΛΕΙΟ	14122	2102842142
ΡΕΚΛΕΙΤΟΥ ΦΛΩΡΑ	ΜΕΣΟΛΟΓΓΙΟΥ 123	ΠΕΙΡΑΙΑΣ	18546	2104614808
ΡΕΠΠΑ ΠΑΓΩΝΑ	ΑΡΙΣΤΕΙΔΟΥ 65 & ΑΓ.ΝΕΚΤΑΡΙΟΥ 1	ΓΕΡΑΚΑΣ	15344	6048116
ΡΕΤΟΥΝΙΩΤΗ ΠΑΡΑΣΚΕΥΗ	ΝΑΥΠΛΙΟΥ 41 & ΑΛΑΜΑΝΑΣ	ΑΘΗΝΑ - ΚΟΛΩΝΟΣ	10441	2105154736
ΡΙΓΛΗ ΜΑΡΙΑ - ΑΡΓΥΡΩ	ΜΑΡΑΘΟΚΑΜΠΟΣ	ΣΑΜΟΣ	83102	2273031236
ΡΙΖΟΓΛΟΥ ΑΠΟΣΤΟΛΙΑ	ΠΕΥΚΩΝ 101	ΗΡΑΚΛΕΙΟ ΑΤΤΙΚΗΣ	14123	2106127254
ΡΟΔΗ ΣΟΦΙΑ	Λ. ΚΑΤΣΩΝΗ 18	ΑΣΠΡΟΠΥΡΓΟΣ	19300	2105572725
ΡΟΜΠΟΣ ΚΩΝΣΤΑΝΤΙΝΟΣ	ΜΑΥΡΟΓΕΝΟΥΣ 139 & ΑΝΑΤΟΛ. ΡΩΜΥΛΙΑΣ 27	ΠΕΤΡΟΥΠΟΛΗ	13231	2105060638
ΡΟΜΠΟΤΗ - ΚΑΤΣΙΓΙΑΝΝΗ ΝΑΝΣΥ	ΒΥΖΑΝΤΙΟΥ 22	ΑΝΩ ΛΙΟΣΙΑ	13341	2102471636
ΡΟΜΠΟΤΗΣ ΝΙΚΟΛΑΟΣ	ΒΑΡΝΑΛΗ 4	ΖΕΦΥΡΙ	13461	2102312520
ΡΟΥΛΙΑ ΜΑΛΑΜΑΤΕΝΙΑ	ΙΩΑΝΝΟΥ ΜΕΡΛΑ 17-19	ΑΓ. ΑΝΑΡΓΥΡΟΙ	13561	2102637860
ΡΟΥΜΕΛΙΩΤΗΣ ΓΕΩΡΓΙΟΣ	ΔΙΣΤΟΜΟΥ 6	ΝΙΚΑΙΑ	18454	2104933311
ΡΟΥΜΕΛΙΩΤΟΥ ΧΡΥΣΟΥΛΑ	ΔΙΣΤΟΜΟΥ 6	ΝΙΚΑΙΑ	18454	2104933311
ΡΟΥΜΟΥΝΔΟΥΜΗ ΠΑΡΑΣΚΕΥΗ	23ΗΣ ΜΑΡΤΙΟΥ 4	ΑΧΑΡΝΑΙ	13673	2102403787
ΡΟΥΜΠΑΝΗ ΚΩΣΤΑΝΘΗ	ΝΑΥΠΑΚΤΙΑΣ 6 & ΡΗΓΑ ΦΕΡΡΑΙΟΥ	ΛΑΓΟΝΗΣΙ	19010	2291027194
ΡΟΥΜΠΗ ΑΣΗΜΙΝΑ	ΗΡΑΚΛΕΙΤΟΥ 66 & ΚΛΥΤΑΙΜΝΗΣΤΡΑΣ	ΧΑΛΑΝΔΡΙ	15238	2106080170
ΡΟΥΜΠΟΥ - ΑΝΑΣΤΑΣΙΟΥ ΕΛΕΝΗ	ΠΕΝΤΕΛΗΣ 51	ΜΑΡΟΥΣΙ	15126	2108055035
ΡΟΥΝΤΑ ΝΙΝΟΥ ΒΙΡΓΙΝΙΑ ΚΟΙΝ. ΣΥΝΕΤΑΙΡΙΣΤΙΚΗ ΕΠΙΧΕΙΡΗΣΗ	ΣΟΥΛΙΟΥ 1	ΓΑΛΑΤΣΙ	11146	2102916348
ΡΟΥΣΣΗ ΕΥΑΓΓΕΛΙΑ	ΟΙΤΗΣ 8	ΜΕΤΑΜΟΡΦΩΣΗ	14451	2102810910
ΡΟΥΣΣΟΥ – ΛΑΓΟΓΙΑΝΝΗ SCHOOL	ΑΓΑΜΕΜΝΩΝΟΣ 4	ΗΛΙΟΥΠΟΛΗ	16343	2109934039
ΡΩΜΗΟΣ ΕΥΑΓΓΕΛΟΣ	ΜΑΚΡΥΓΙΑΝΝΗ 1	ΔΑΦΝΗ	17236	2109703055
ΣΑΒΒΑ ΡΕΣΒΑΝΗ ΕΥΓΕΝΙΑ	ΤΣΑΚΑΛΩΦ 20	ΚΕΡΑΤΣΙΝΙ	18757	
ΣΑΒΒΙΔΗΣ ΙΩΑΝΝΗΣ	ΚΑΛΑΒΡΥΤΩΝ 25	ΧΑΙΔΑΡΙ - ΔΑΣΟΣ	12462	2105324653
ΣΑΒΕΡΗ ΙΩΑΝΝΑ	ΓΟΥΝΑΡΗ 2	ΑΓ. ΠΑΡΑΣΚΕΥΗ	15343	2106006818
ΣΑΚΑΛΗ ΕΛΕΝΗ	ΟΛΥΜΠΟΥ 64	ΒΡΙΛΗΣΣΙΑ	15235	2108031479
ΣΑΚΚΑ ΕΥΓΕΝΙΑ	ΘΗΒΩΝ 142	ΠΕΡΙΣΤΕΡΙ	12134	2105727637
ΣΑΛΙΑΓΚΑΚΗ ΑΘΗΝΑ	Γ. ΜΕΝΙΔΙΑΤΗ 140	ΜΕΓΑΡΑ	19100	2296023635
ΣΑΛΤΗ ΑΝΝΑ	ΑΡΓΥΡΟΚΑΣΤΡΟΥ 8	ΚΑΜΑΤΕΡΟ	13451	2114045895
ΣΑΜΑΡΤΖΗΣ ΙΩΑΝΝΗΣ	ΑΓΚΥΛΗΣ 29 & ΤΙΜΟΞΕΝΟΥ 1	ΑΘΗΝΑ - ΝΕΟΣ ΚΟΣΜΟΣ	11743	2109237787
ΣΑΜΙΩΤΗ - ΤΣΑΚΩΝΑ ΑΝΘΙΠΠΗ	ΑΙΣΩΠΟΥ 33	ΝΙΚΑΙΑ	18451	2104256676
ΣΑΜΠΑ ΑΘΑΝΑΣΙΑ	ΤΕΠΕΛΕΝΙΟΥ 66	ΠΕΤΡΟΥΠΟΛΗ	13231	2105014000
ΣΑΜΠΑΖΙΩΤΗ ΣΤΑΥΡΟΥΛΑ	ΠΙΝΔΟΥ 6	ΜΕΤΑΜΟΡΦΩΣΗ	14452	2102848392`;

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

    console.log(`Parsed ${batch.length} valid language centers in the Athens area for BATCH 8. Executing import...`);

    const newCredentials = [];

    for (let index = 0; index < batch.length; index++) {
      const inst = batch[index];
      const instituteName = `Κέντρο Ξένων Γλωσσών ${inst.ownerName}`;
      const emailName = generateSlug(inst.ownerName);
      const email = `${emailName}@tofrontistirio.gr`;
      const password = Math.random().toString(36).slice(-10) + 'S26!';

      console.log(`[${index + 1}/${batch.length}] Importing BATCH 8: ${instituteName}...`);

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
      const cleanAreaName = areaName = inst.areaName.replace('ΑΘΗΝΑ - ', '').replace('ΑΘΗΝΑ-', '').trim();
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

    console.log(`\n--- BATCH 8 ATHENS LANGUAGE CENTERS SUCCESSFULLY IMPORTED (${newCredentials.length} centers) ---`);

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
