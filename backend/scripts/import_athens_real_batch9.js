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

const rawText = `ΣΑΠΑΝΑ ΦΡΑΝΣΙΣ	ΜΑΚΕΔΟΝΙΑΣ 6	ΝΕΟ ΗΡΑΚΛΕΙΟ	14121	2102847383
ΣΑΡΡΗ ΝΙΚΟΛΕΤΤΑ	ΔΑΥΛΕΙΑΣ 5	ΒΥΡΩΝΑΣ	16231	2121029413
ΣΑΡΤΖΙΔΟΥ ΙΟΡΔΑΝΑ	ΣΕΡΙΦΟΥ 55Α	ΠΕΙΡΑΙΑΣ - ΚΑΜΙΝΙΑ	18541	2104822951
ΣΒΙΓΚΟΥ ΑΙΚΑΤΕΡΙΝΗ	ΝΙΚΟΛΑΟΥ ΠΛΑΣΤΗΡΑ 43	ΝΕΑ ΠΕΡΑΜΟΣ	19006	2296032733
ΣΕΓΚΟΥ ΕΙΡΗΝΗ	ΕΛΕΥΘΕΡΙΟΥ ΒΕΝΙΖΕΛΟΥ 19	ΑΘΗΝΑ - ΓΑΛΑΤΣΙ	11147	2103002929
ΣΕΛΙΜΗ ΟΥΡΑΝΙΑ	ΑΓ. ΛΑΥΡΑΣ 46	ΖΩΓΡΑΦΟΣ	15773	2107718600
ΣΗΜΑΙΟΦΟΡΙΔΗ ΞΕΝΙΑ	ΓΚΟΡΙΤΣΑ Ρ.Ο.8056	ΑΣΠΡΟΠΥΡΓΟΣ	19300	2105598724
ΣΙΑΛΕΥΡΗΣ ΚΩΝΣΤΑΝΤΙΝΟΣ	ΑΓ.ΠΑΝΤΩΝ 32	ΚΑΛΛΙΘΕΑ	17671	2109584001
ΣΙΑΦΑΡΗΣ ΝΙΚΟΛΑΟΣ	ΛΕΩΦ. ΙΩΝΙΑΣ 105	ΑΛΙΜΟΣ	17456	2121047700
ΣΙΓΑΛΑ ΑΝΤΩΝΙΑ	ΠΑΡΝΗΘΟΣ 61	ΠΕΡΙΣΤΕΡΙ	12136	2105760650
ΣΙΓΑΛΑ ΔΑΜΑΣΚΗΝΗ	ΖΕΦΥΡΟΥ 16	ΑΙΓΑΛΕΩ	12243	2105315888
ΣΙΓΑΛΟΥ ΕΥΑΓΓΕΛΙΑ	ΚΑΡΑΟΛΗ ΚΑΙ ΔΗΜΗΤΡΙΟΥ 31	ΠΑΙΑΝΙΑ	19002	2155653759
ΣΙΝΗ ΠΑΝΑΓΙΩΤΑ	ΔΙΓΕΝΗ ΑΚΡΙΤΑ 36-38	ΝΕΑ ΣΜΥΡΝΗ	17124	2109344548
ΣΙΝΟΥ ΜΑΡΙΑ	ΚΑΥΚΑΣΟΥ 59	ΑΘΗΝΑ - ΚΥΨΕΛΗ	11363	2108214664
ΣΙΦΗ - ΜΗΤΡΟΠΟΥΛΟΥ ΑΙΜΙΛΙΑ	ΕΛ. ΒΕΝΙΖΕΛΟΥ 57	ΠΕΤΡΟΥΠΟΛΗ	13231	2105024791
ΣΚΑΛΚΟΣ ΜΙΧΑΗΛ	ΜΥΚΗΝΩΝ 36	ΚΑΛΛΙΘΕΑ	17673	2109565727
ΣΚΑΛΚΟΣ ΓΕΩΡΓΙΟΣ	ΜΥΚΗΝΩΝ 36	ΚΑΛΛΙΘΕΑ	17673	2109565727
ΣΚΑΛΩΝΗ ΚΑΛΛΙΟΠΗ	ΑΓ. ΙΩΑΝΝΗ ΡΕΝΤΗ 35	ΑΓ. ΙΩΑΝ. ΡΕΝΤΗΣ	18233	2104816515
ΣΚΑΝΔΑΛΟΥ ΦΩΤΕΙΝΗ	ΜΑΡΚΟΥ ΜΠΟΤΣΑΡΗ 14	ΓΑΛΑΤΣΙ	11146	2102931465
ΣΚΑΝΔΑΜΗ - ΝΤΑΝΑΣΗ ΕΛΕΝΗ	ΠΡΟΜΗΘΕΩΣ 52	ΑΘΗΝΑ	11254	2102015941
ΣΚΑΠΕΝΤΖΗ ΧΑΪΔΩ	ΗΡΑΚΛΕΙΤΟΥ 41 & ΣΚΡΑ	ΓΛΥΦΑΔΑ	16674	2109644765
ΣΚΑΡΛΙΓΚΟΥ ΙΩΑΝΝΑ	ΚΡΙΤΟΒΟΥΛΙΔΟΥ 45	ΑΘΗΝΑ - ΚΑΤΩ ΠΑΤΗΣΙΑ	10445	2108311380
ΣΚΑΡΛΟΠΟΥΛΟΣ ΓΕΩΡΓΙΟΣ	ΓΑΡΓΗΤΤΟΥ 119Β	ΓΕΡΑΚΑΣ	15344	2106618422
ΣΚΛΑΒΟΥΝΟΣ ΜΙΧΑΛΗΣ	Μ. ΑΣΙΑΣ 122	ΓΛΥΦΑΔΑ	16562	2109617269
ΣΚΟΚΕΑ - ΚΑΛΔΗ ΣΤΕΛΛΑ	ΧΡΥΣ. ΣΜΥΡΝΗΣ 96	ΠΕΤΡΟΥΠΟΛΗ	13231	2105024588
ΣΚΟΥΛΑΡΙΚΑ - ΜΑΝΑΡΑ ΑΡΧΟΝΤΟΥΛΑ	ΗΡΩΩΝ ΠΟΛΥΤΕΧΝΕΙΟΥ 76	ΧΑΙΔΑΡΙ - ΔΑΣΟΣ	12462	2105324421
ΣΚΟΥΡΑΣ ΔΗΜΗΤΡΙΟΣ	ΔΑΝΙΛΗ 5	ΑΘΗΝΑ - ΝΕΟΣ ΚΟΣΜΟΣ	11744	2109015515
ΣΚΟΥΤΕΛΑ ΕΡΑΣΜΙΑ	Μ. ΙΒΑΝ 3	ΑΘΗΝΑ - ΣΕΠΟΛΙΑ	10443	2105152544
ΣΚΟΥΦΟΥΛΑ ΖΑΧΑΡΟΥΛΑ	ΜΥΣΤΡΑ 23	ΠΕΤΡΟΥΠΟΛΗ	13231	2105062232
ΣΚΡΕΤΗΣ ΑΡΓΥΡΙΟΣ	ΜΑΔΥΤΟΥ 44	ΠΕΡΙΣΤΕΡΙ	12132	2105743323
ΣΜΕΡΟΥ ΚΩΝΣΤΑΝΤΙΝΑ	ΚΑΠΕΤΑΝΑΚΗ 24	ΑΓ. ΔΗΜΗΤΡΙΟΣ	17342	2109837669
ΣΜΕΡΟΥ ΚΑΤΙΝΑ	Γ. ΓΕΝΝΗΜΑΤΑ 49	ΝΕΑ ΠΑΛΑΤΙΑ	19015	2295031333
ΣΜΥΡΙΛΙΟΥ ΜΑΡΙΑ	ΚΩΣΤΗ ΠΑΛΑΜΑ 13	ΣΠΑΤΑ	19004	2106025731
ΣΟΛΟΜΩΝΙΔΟΥ ΤΡΙΑΝΤΑΦΥΛΛΙΑ	ΙΩΑΝΝΟΥ ΦΩΚΑ 120	ΓΑΛΑΤΣΙ	11146	2102932081
ΣΟΜΠΑ ΜΑΛΑΜΑΤΕΝΙΑ	ΓΑΛΑΤΑΣ	ΠΟΡΟΣ ΤΡΟΙΖΗΝΙΑΣ	18020	2298043105
ΣΟΥΓΛΑ ΣΤΑΥΡΟΥΛΑ	ΚΑΡΥΑΤΙΔΟΣ 139	ΠΕΡΙΣΤΕΡΙ	12135	2105738615
ΣΟΥΛΕΛΕ ΑΝΤΩΝΙΑ	ΟΛΥΜΠΟΥ 25	ΧΑΛΑΝΔΡΙ	15234	2106801719
ΣΟΥΤΣΟΥ ΜΑΡΙΑ	ΣΤΡ. ΚΑΡΑΙΣΚΑΚΗ 104	ΧΑΙΔΑΡΙ	12461	2105988261
ΣΟΥΤΣΟΥ ΚΩΝΣΤΑΝΤΙΝΑ	ΣΤΡ. ΚΑΡΑΙΣΚΑΚΗ 104	ΧΑΙΔΑΡΙ	12461	2105988261
ΣΠΑΘΑΡΗΣ ΣΠΥΡΙΔΩΝ	ΠΡΙΑΜΟΥ 75	ΙΛΙΟΝ	13122	2117257148
ΣΠΑΝΟΓΙΑΝΝΗΣ ΠΑΝΑΓΙΩΤΗΣ	ΚΑΥΚΑΣΟΥ 3	ΚΟΡΥΔΑΛΛΟΣ	18121	2105616402
ΣΠΑΝΟΓΙΑΝΝΗΣ ΚΥΡΙΑΚΟΣ	ΚΑΥΚΑΣΟΥ 3	ΚΟΡΥΔΑΛΛΟΣ	18121	2105616402
ΣΠΑΝΟΥ ΒΑΡΒΑΡΑ	ΠΡΟΒΑΛΙΝΘΟΥ 17	ΜΑΡΑΘΩΝΑΣ	19007	2294066991
ΣΠΑΝΟΥΔΑΚΗ ΜΑΡΙΑ	ΑΝΑΠΑΥΣΕΩΣ 29	ΜΑΡΟΥΣΙ	15126	2108022013
ΣΠΑΡΗ ΑΝΑΣΤΑΣΙΑ	ΑΓ. ΔΗΜΗΤΡΙΟΣ	ΛΗΜΝΟΣ	81400	2254061161
ΣΠΗΛΙΟΠΟΥΛΟΣ ΠΑΝΑΓΙΩΤΗΣ	ΑΜΥΚΛΩΝ 35	ΧΑΛΑΝΔΡΙ	15231	2106743436
ΣΠΥΡΙΔΑΚΗ ΘΕΟΔΩΡΑ	ΦΑΝΕΡΩΜΕΝΗΣ 7	ΑΙΓΙΝΑ	18010	2297027297
ΣΤΑΓΑΚΗ ΣΜΑΡΑΓΔΗ	ΑΘΗΝΑΣ 51	ΚΟΡΥΔΑΛΛΟΣ	18120	2104977087
ΣΤΑΘΗ ΕΛΙΣΣΑΒΕΤ	ΓΡ. ΛΑΜΠΡΑΚΗ 22	ΠΕΙΡΑΙΑΣ	18532	2104101633
ΣΤΑΘΗ ΕΛΕΝΗ	ΝΙΚ. ΚΩΝΣΤΑ 15	ΚΟΡΩΠΙ	19441	2106627179
ΣΤΑΘΟΠΟΥΛΟΣ ΠΕΤΡΟΣ	ΟΛΥΝΘΟΥ 52	ΠΕΙΡΑΙΑΣ	18545	2102384132
ΣΤΑΜΑΔΙΑΝΟΣ ΒΑΣΙΛΗΣ	ΚΕΡΚΥΡΑΣ 57	ΚΟΡΥΔΑΛΛΟΣ	18121	2105450209
ΣΤΑΜΑΤΑΚΗ ΔΙΟΝΥΣΙΑ	ΑΓΙΟΥ ΝΙΚΟΛΑΟΥ ΜΥΡΩΝΟΣ 4	ΑΡΤΕΜΙΣ	19016	2294089525
ΣΤΑΜΑΤΑΚΗ ΜΑΡΙΑ	ΑΓΙΟΥ ΝΙΚΟΛΑΟΥ ΜΥΡΩΝΟΣ 4	ΑΡΤΕΜΙΣ	19016	2294089525
ΣΤΑΜΑΤΕΛΟΥ ΜΑΡΙΑΝΝΑ	ΛΗΜΝΟΥ 10	ΔΑΦΝΗ	17237	2109752519
ΣΤΑΜΑΤΙΟΥ ΕΛΕΝΗ	ΓΙΑΝΝΙΤΣΩΝ 5	ΚΑΛΛΙΘΕΑ	17673	2109588139
ΣΤΑΜΑΤΙΟΥ ΠΑΠΑΔΟΠΟΥΛΟΥ ΑΝΤΖΕΛΑ	ΕΒΡΟΥ 7	ΝΙΚΑΙΑ	18453	2104972797
ΣΤΑΜΑΤΟΠΟΥΛΟΥ ΕΥΑΓΓΕΛΙΑ	ΦΙΛ. ΤΟΥΤΣΗ ΚΑΙ ΖΩΟΔΟΧΟΥ ΠΗΓΗΣ 14	ΣΑΛΑΜΙΝΑ	18900	2104653118
ΣΤΑΜΟΥ ΙΩΑΝΝΑ-ΑΝΤΙΓΟΝΗ	ΓΡΗΓΟΡΙΟΥ ΑΥΞΕΝΤΙΟΥ 31-33	ΑΘΗΝΑ - ΚΥΨΕΛΗ	11363	2108625027
ΣΤΑΜΟΥΛΗ ΑΝΑΣΤΑΣΙΑ	ΤΗΝΟΥ & ΣΑΛΑΜΙΝΟΣ	ΕΡΥΘΡΕΣ ΑΤΤΙΚΗΣ	19008	2263063100
ΣΤΑΥΡΑΚΑΚΗΣ ΝΙΚΟΛΑΟΣ	ΕΛΛΗΣ 5 ΚΑΙ ΑΒΕΡΩΦ	ΔΑΦΝΗ	17234	2109733760
ΣΤΑΥΡΙΑΝΙΔΟΥ ΕΛΙΣΑΒΕΤ	ΑΓΧΙΑΛΟΥ 23	ΝΕΑ ΣΜΥΡΝΗ	17124	2109319070
ΣΤΑΥΡΟΠΟΥΛΟΥ ΤΖΟΑΝΝΑ	ΑΓ. ΣΑΡΑΝΤΑ 46 & ΚΑΣΤΡΙΟΥ	ΚΑΜΑΤΕΡΟ	13451	2105025990
ΣΤΑΥΡΟΥ ΓΕΩΡΓΙΑ	ΚΕΝΤΡΙΚΗΣ ΠΛΑΤΕΙΑΣ 6	ΑΧΑΡΝΑΙ	13674	2102447020
ΣΤΕΡΓΙΔΟΥ ΑΘΗΝΑ	ΑΝ. ΔΗΜΗΤΡΙΟΥ 109-111	ΝΕΑ ΙΩΝΙΑ	14235	2102724706
ΣΤΕΡΓΙΟΥ ΑΛΕΞΑΝΔΡΑ	ΔΕΡΒΕΝΑΚΙΩΝ 12	ZEΦΥΡΙ	13461	2155306330
ΣΤΕΦΑΝΕΑ ΜΑΙΡΗ - ΠΑΤΡΙΤΣΙΑ	ΛΥΚΟΥΡΓΟΥ 56	ΝΕΑ ΙΩΝΙΑ	14231	2102774011
ΣΤΕΦΑΝΙΔΟΥ ΑΙΚΑΤΕΡΙΝΗ	ΑΝΔΡΟΝΙΚΙΟΥ 7	ΥΜΗΤΤΟΣ	17237	2107628990
ΣΤΕΦΟΥ ΒΑΣΙΛΙΚΗ - ΑΙΚΑΤΕΡΙΝΗ	ΧΡΥΣΟΣΤΟΜΟΥ ΣΜΥΡΝΗΣ 44	ΜΟΣΧΑΤΟ	18344	2109419533
ΣΤΟΥΡΑΙΤΗ ΑΝΑΣΤΑΣΙΑ	ΑΝΤΙΓΟΝΗΣ 40	ΝΕΟ ΗΡΑΚΛΕΙΟ	14122	2102816538
ΣΤΡΑΤΟΠΟΥΛΟΥ ΜΑΡΙΑ	ΧΡΥΣΟΣΤΟΜΟΥ ΣΜΥΡΝΗΣ 20	ΑΓΙΟΣ ΣΤΕΦΑΝΟΣ	14565	2167006548
ΣΤΟΥΜΠΑ - ΞΑΝΘΕΑ ΕΙΡΗΝΗ	ΓΡΑΜΜΟΥ 21	ΑΓ. ΔΗΜΗΤΡΙΟΣ	17341	2109763971
ΣΥΓΙΖΗ ΝΑΤΑΛΙΑ	ΒΑΣ. ΓΕΩΡΓΙΟΥ Β΄36	ΓΛΥΦΑΔΑ	16674	2108948574
ΣΥΚΙΩΤΟΥ ΕΛΕΝΗ	ΜΙΛΤΙΑΔΟΥ 30	ΠΑΛΛΗΝΗ	15351	2106666245
ΣΥΚΩΚΗ ΖΩΗ	ΖΑΚΥΝΘΟΥ 32	ΑΘΗΝΑ - ΚΥΨΕΛΗ	11362	2108812465
ΣΥΜΕΩΝΙΔΗΣ ΝΙΚΟΛΑΟΣ	ΔΙΟΠΟΛΕΩΣ 1	ΓΑΛΑΤΣΙ	11142	2102528747
ΣΥΜΕΩΝΙΔΟΥ ΜΑΡΙΑ	ΜΕΘΑΝΩΝ 3	ΠΕΙΡΑΙΑΣ - ΚΑΜΙΝΙΑ	18541	2104210093
ΣΥΝΟΔΙΝΟΥ ΑΝΔΡΙΑΝΑ	ΠΑΡΝΗΘΟΣ 85	ΠΕΡΙΣΤΕΡΙ	12136	2105720785
ΣΥΡΟΠΟΥΛΟΥ ΔΑΦΝΗ	ΑΓΩΝΙΣΤΩΝ ΣΤΡΑΤΟΠΕΔΟΥ 42	ΧΑΙΔΑΡΙ	12461	2105810177
ΣΩΤΗΡΟΠΟΥΛΟΣ ΓΕΩΡΓΙΟΣ	ΚΥΠΑΡΙΣΣΙΑΣ 9 ΚΑΙ ΓΟΥΝΑΡΗ	ΙΛΙΟΝ	13123	2102631151
ΣΩΦΡΟΝΗ ΜΑΡΙΝΑ	38ο χλμ Λ.ΠΟΡΤΟ ΡΑΦΤΗ	ΠΟΡΤΟ ΡΑΦΤΗ	19003	2299300911
ΤΑΒΟΥΛΑΡΗ ΧΡΥΣΟΥΛΑ - ΔΗΜΗΤΡΑ	ΑΚΡΙΤΩΝ 12	Π. ΦΑΛΗΡΟ	17564	2109420113
ΤΑΚΟΠΟΥΛΟΥ ΠΑΝΑΓΟΥΛΑ	ΠΑΡΝΗΘΟΣ 11Α	ΙΛΙΟΝ	13123	2105014400
ΤΑΛΑΒΕΡΙΔΗΣ ΜΕΛΕΤΙΟΣ	ΕΠΤΑΛΟΦΟΥ 70	ΠΕΡΙΣΤΕΡΙ	12137	2105722773
ΤΑΛΙΑΚΟΥ ΔΕΣΠΟΙΝΑ	ΣΠΑΡΤΗΣ 20	ΚΑΛΛΙΘΕΑ	17673	2109514450
ΤΑΡΑΛΑ ΕΛΕΝΗ	ΚΥΠΡΙΩΝ ΑΓΩΝΙΣΤΩΝ 2 & ΦΙΛΙΚΗΣ ΕΤΑΙΡΕΙΑΣ 1	ΜΑΡΟΥΣΙ	15126	2108047973
ΤΑΤΣΗ ΚΩΝΣΤΑΝΤΙΝΑ	Β. ΗΠΕΙΡΟΥ 68	ΠΕΤΡΟΥΠΟΛΗ	13231	2105059660
ΤΑΦΑ ΣΕΒΑΣΤΗ	ΑΛΕΞΑΝΔΡΕΙΑΣ 22	ΝΕΑ ΦΙΛΑΔΕΛΦΕΙΑ	14342	2102512200
ΤΑΦΑΣ ΗΛΙΑΣ	ΑΛΕΞΑΝΔΡΕΙΑΣ 22	ΝΕΑ ΦΙΛΑΔΕΛΦΕΙΑ	14342	2102512200
ΤΖΕΒΕΛΕΚΟΣ ΛΑΜΠΡΟΣ	ΘΕΟΚΡΙΤΟΥ 30	ΠΕΡΙΣΤΕΡΙ	12134	2105760861
ΤΖΕΒΕΛΕΚΟΥ ΔΗΜΗΤΡΑ	ΓΑΒΡΙΗΛΙΔΟΥ 34	ΑΘΗΝΑ - ΠΑΤΗΣΙΑ	11141	2102283003
ΤΖΕΠΑΠΑΔΑΚΗΣ ΕΥΑΓΓΕΛΟΣ	ΒΟΛΑΝΑΚΗ 17 & ΚΟΡΓΙΑΛΕΚΙΟΥ 6	ΑΘΗΝΑ	11526	2106984530
ΤΖΩΡΤΖΗ ΠΑΡΑΣΚΕΥΗ	ΙΔΡ. ΔΗΜΟΥ ΔΡΑΠΕΤΣΩΝΑΣ 10	ΔΡΑΠΕΤΣΩΝΑ	18648	2104614602
ΤΟΜΑΖΑΝΗ ΑΡΓΥΡΩ	ΑΠΟΛΛΩΝΙΑΣ 38	ΠΕΙΡΑΙΑΣ - ΚΑΜΙΝΙΑ	18541	4826229
ΤΟΜΑΖΑΝΗΣ ΣΤΥΛΙΑΝΟΣ	ΑΠΟΛΛΩΝΙΑΣ 38	ΠΕΙΡΑΙΑΣ - ΚΑΜΙΝΙΑ	18541	4826229
ΤΟΜΑΝ ΠΑΡΑΣΚΕΥΗ	ΣΩΚΡΑΤΟΥΣ 50	ΚΟΡΥΔΑΛΛΟΣ	18120	4966878
ΤΟΠΟΥΖΙΔΟΥ ΝΤΕΣΣΥ	ΒΑΣ. ΠΑΥΛΟY 59	ΒΟΥΛΑ	16673	2108991422
ΤΟΥΛΑ ΚΕΡΑΣΙΑ	ΓΡΗΓ. ΑΥΞΕΝΤΙΟΥ & ΜΕΣΟΛΟΓΓΙΟΥ	ΓΛΥΚΑ ΝΕΡΑ	15354	2106611691
ΤΟΥΜΠΑΚΑΡΗ ΜΑΡΙΑ	ΒΑΣ ΓΕΩΡΓΙΟΥ 16	ΜΑΡΑΘΩΝΑΣ	19007	2294067451
ΤΟΥΜΠΑΝΙΑΡΗ ΓΕΩΡΓΙΑ	Γ. ΜΑΥΡΟΥΚΑΚΗ 21	ΜΕΓΑΡΑ	19100	2296022601`;

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

    console.log(`Parsed ${batch.length} valid language centers in the Athens area for BATCH 9. Executing import...`);

    const newCredentials = [];

    for (let index = 0; index < batch.length; index++) {
      const inst = batch[index];
      const instituteName = `Κέντρο Ξένων Γλωσσών ${inst.ownerName}`;
      const emailName = generateSlug(inst.ownerName);
      const email = `${emailName}@tofrontistirio.gr`;
      const password = Math.random().toString(36).slice(-10) + 'S26!';

      console.log(`[${index + 1}/${batch.length}] Importing BATCH 9: ${instituteName}...`);

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

    console.log(`\n--- BATCH 9 ATHENS LANGUAGE CENTERS SUCCESSFULLY IMPORTED (${newCredentials.length} centers) ---`);

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
