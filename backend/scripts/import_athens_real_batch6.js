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

const rawText = `ΜΑΓΟΥΛΑΣ ΔΗΜΗΤΡΙΟΣ	ΣΠΑΡΤΑΚΟΥ 4	ΚΕΡΑΤΣΙΝΙ	18757	2104317724
ΜΑΖΑΡΑΚΗΣ ΚΩΝΣΤΑΝΤΙΝΟΣ	ΤΡΑΛΛΕΩΝ 27	ΝΕΑ ΦΙΛΑΔΕΛΦΕΙΑ	14342	2102510385
ΜΑΘΑ ΜΑΥΡΙΚΟΥ ΝΕΤΑ	ΜΑΚΡΥΓΙΑΝΝΗ 129	ΜΟΣΧΑΤΟ	18345	2104832964
ΜΑΚΑΡΟΥΝΗ AΘΑΝΑΣΙΑ	ΒΕΡΟΙΑΣ 40	ΜΕΤΑΜΟΡΦΩΣΗ	14451	2102843237
ΜΑΚΡΗ ΛΑΜΠΡΙΝΗ(ΝΙΝΑ)	ΠΙΕΡΙΑΣ 5	ΑΝΩ ΛΙΟΣΙΑ	13341	2102470968
ΜΑΚΡΗ ΧΑΡΙΚΛΕΙΑ(ΡΙΤΑ)	ΠΙΕΡΙΑΣ 5	ΑΝΩ ΛΙΟΣΙΑ	13341	2102470968
ΜΑΚΡΗ ΜΑΡΙΑ	ΙΩΑΝΝΙΝΩΝ 37	ΧΑΛΑΝΔΡΙ	15234	2106801323
ΜΑΚΡΗ ΕΛΕΝΗ	ΓΟΡΓΥΡΑΣ	ΣΑΜΟΣ - ΚΑΡΛΟΒΑΣΙ	83200	2273035350
ΜΑΚΡΗΣ ΑΘΑΝΑΣΙΟΣ	ΕΘΝ. ΑΝΤΙSΤΑΣΕΩΣ 86	ΚΑΙΣΑΡΙΑΝΗ	16121	2107222612
ΜΑΚΤΖΩΡΤΖ ΦΩΤΕΙΝΗ	ΝΟΤΙΟΥ ΕΥΒΟΪΚΟΥ 35	ΡΑΦΗΝΑ	19009	2294025600
ΜΑΛΚΟΓΙΑΝΝΗ ΜΑΡΙΛΕΝΗ	ΔΕΛΗΓΙΩΡΓΗ 69	ΑΛΙΜΟΣ	17456	2109941305
ΜΑΛΚΟΓΙΑΝΝΗ - ΜΟΥΤΣΟΥ ΕΛΕΝΗ	ΔΕΛΗΓΙΩΡΓΗ 69	ΑΛΙΜΟΣ	17456	2109941305
ΜΑΛΛΗ ΕΥΓΕΝΙΑ	ΛΕΩΦ. ΑΜΦΙΘΕΑΣ 136	Π. ΦΑΛΗΡΟ	17562	2109819859
ΜΑΛΟΥΔΗ ΜΑΡΙΑ	ΓΟΥΝΑΡΗ 51	ΚΑΜΑΤΕΡΟ	13451	2102312138
ΜΑΜΑΚΟΥ ΣΤΕΦΑΝΙΑ	ΡΙΜΙΝΙ 2	ΝΕΑ ΙΩΝΙΑ	14231	2102710900
ΜΑΝΕΤΑΚΗ ΣΤΥΛΙΑΝΑ	Κ.Δ. ΝΑΣΣΟΥ 5Β	ΒΑΡΗ	16672	2108970120
ΜΑΝΕΤΑΚΗ ΑΝΝΑ	Κ.Δ. ΝΑΣΣΟΥ 5Β	ΒΑΡΗ	16672	2108970120
ΜΑΝΙΑ ΑΝΝΑ	ΑΡΙΣΤΟΤΕΛΟΥΣ 6Α	Π. ΦΑΛΗΡΟ	17563	2109881871
ΜΑΝΟΥ ΠΑΝΑΓΙΩΤΑ	ΤΡΑΠΕΖΟΥΝΤΟΣ 135	ΚΟΡΥΔΑΛΛΟΣ	18121	2105441965
ΜΑΝΟΥΣΑΚΗ ΜΑΡΙΑ-ΕΥΑΓΓΕΛΙΑ	Ε. ΑΝΤΙΣΤΑΣΕΩΣ & ΜΕΣΟΛΟΓΓΙΟΥ 15	ΚΑΙΣΑΡΙΑΝΗ	16122	2107258174
ΜΑΝΤΑΓΑ ΑΓΓΕΛΙΚΗ	ΕΘΝΙΚΗΣ ΑΝΤΙΣΤΑΣΕΩΣ 67	ΠΕΤΡΟΥΠΟΛΗ	13231	2105025606
ΜΑΝΤΑΓΑ ΚΩΣΤΟΥΛΑ	ΕΘΝΙΚΗΣ ΑΝΤΙΣΤΑΣΕΩΣ 67	ΠΕΤΡΟΥΠΟΛΗ	13231	2105025606
ΜΑΝΤΖΙΟΥ ΚΩΝΣΤΑΝΤΙΝΑ	ΘΕΜΙΔΟΣ 33	ΜΑΡΟΥΣΙ	15124	2106124869
ΜΑΝΩΛΗ ΣΩΤΗΡΙΑ	ΕΛ. ΒΕΝΙΖΕΛΟΥ 127	ΠΕΤΡΟΥΠΟΛΗ	13231	2105024366
ΜΑΡΑΒΕΛΑΚΗ ΕΥΑΓΓΕΛΙΑ	ΠΑΡΘΕΝΙΟΥ 94	ΠΕΡΙΣΤΕΡΙ	12136	2105761166
ΜΑΡΑΝΤΩΝΗ ΜΑΡΙΝΑ	ΑΤΣΙΚΗ	ΛΗΜΝΟΣ	81401	2254031675
ΜΑΡΓΑΡΗ ΖΩΗ	ΔΕΡΒΕΝΑΚΙΩΝ 125	ΑΓ. ΠΑΡΑΣΚΕΥΗ	15343	2106019869
ΜΑΡΓΑΡΙΤΗ ΑΡΓΥΡΩ	Λ.ΓΑΛΑΤΣΙΟΥ 25	ΑΘΗΝΑ - ΠΑΤΗΣΙΑ	11141	2102230239
ΜΑΡΓΑΡΩΝΗ ΓΡΑΜΜΑΤΙΚΗ	ΓΟΡΓΥΡΑΣ	ΣΑΜΟΣ - ΚΑΡΛΟΒΑΣΙ	83200	2273033134
ΜΑΡΗΣ ΜΑΡΚΟΣ	ΑΙΑΚΟΥ 57	ΙΛΙΟΝ	13122	2102610112
ΜΑΡΙΝΗ ΜΑΓΔΑΛΗΝΗ	ΜΑΡΤΥΡΟΣ ΛΕΟΝΤΙΟΥ 9	ΑΙΓΙΝΑ	18010	2297027991
ΜΑΡΙΝΟΣ ΣΑΒΒΑΣ	ΔΗΜΗΤΡΑΚΟΠΟΥΛΟΥ 111	ΚΑΛΛΙΘΕΑ	17676	2109588218
ΜΑΡΙΝΟΥ ΕΥΑΓΓΕΛΙΑ	ΑΦΡΟΔΙΤΗΣ 46 & ΚΡΗΝΗΣ	ΝΕΑ ΙΩΝΙΑ	14235	2114076653
ΜΑΡΙΟΛΗ ΕΛΕΝΗ	ΠΛ. ΗΡΩΩΝ ΠΟΛΥΤΕΧΝΕΙΟΥ 8	ΛΑΥΡΙΟ	19500	2292023013
ΜΑΡΙΟΛΗΣ ΓΕΩΡΓΙΟΣ	ΜΕΣΟΓΕΙΩΝ 261 & ΞΑΝΘΟΥ	ΝΕΟ ΨΥΧΙΚΟ	15451	2106743458
ΜΑΡΚΑΝΤΩΝΗ ΦΩΤΕΙΝΗ	Π. ΤΣΑΛΔΑΡΗ 26 & ΙΠΟΚΡΑΤΟΥΣ 2	ΜΕΛΙΣΣΙΑ	15127	2106131793
ΜΑΡΚΟΠΟΥΛΟΥ ΜΑΡΙΑ	ΚΥΔΑΝΤΙΔΩΝ 22	ΑΘΗΝΑ - ΠΕΤΡΑΛΩΝΑ	11851	2103464688
ΜΑΡΚΟΠΟΥΛΟΥ ΠΑΝΑΓΙΩΤΑ	ΤΜΩΛΟΥ 29	ΒΥΡΩΝΑΣ	16233	2107654738
ΜΑΡΚΟΥ ΜΑΓΔΑΛΗΝΗ	ΔΑΜΑΡΕΩΣ 150	ΑΘΗΝΑ - ΑΓ. ΑΡΤΕΜΙΟΣ	11632	2107513200
ΜΑΡΚΟΥ ΒΑΣΙΛΙΚΗ	ΝΙΚΗΣ 21	ΧΑΛΑΝΔΡΙ	15232	2106811535
ΜΑΡΟΥ ΧΡΙΣΤΙΝΑ	ΚΟΝΙΤΣΗΣ 5	ΖΩΓΡΑΦΟΣ	15773	2107793888
ΜΑΡΤΣΟΥΚΑΚΗ ΜΑΡΙΑ	ΔΟΓΑΝΗΣ 183	ΠΕΙΡΑΙΑΣ	18546	2104632613
ΜΑΣΣΑΡΑΣ ΔΗΜΗΤΡΙΟΣ	ΚΟΡΥΤΣΑΣ 32	ΓΛΥΚΑ ΝΕΡΑ	15354	2106659472
ΜΑΣΤΡΟΓΙΑΝΝΟΠΟΥΛΟΥ ΕΙΡΗΝΗ	ΧΑΡ. ΤΡΙΚΟΥΠΗ 16	ΜΕΤΑΜΟΡΦΩΣΗ	14452	2102824130
ΜΑΣΤΡΟΠΑΥΛΟΣ ΔΗΜΗΤΡΙΟΣ	Β.ΦΡΕΙΔΕΡΙΚΗΣ 2	ΑΝΑΒΥΣΣΟΣ	19013	2291036060
ΜΑΤΑΚΟΣ ΔΗΜΗΤΡΙΟΣ	ΚΑΣΤΟΡΙΑΣ 4	ΑΝΩ ΛΙΟΣΙΑ	13341	2102472772
ΜΑΤΑΚΟΣ ΓΙΑΝΝΗΣ	ΚΑΣΤΟΡΙΑΣ 4	ΑΝΩ ΛΙΟΣΙΑ	13341	2102472772
ΜΑΤΙΑΤΟΣ ΝΙΚΟΛΑΟΣ	Βαλτετσίου 71	ΠΕΤΡΟΥΠΟΛΗ	13231	2130463846
ΜΕΓΑΛΟΟΙΚΟΝΟΜΟΥ - ΝΑΚΟΥ ΕΛΕΝΗ	ΦΑΙΔΡΙΑΔΩΝ 38	ΑΘΗΝΑ - ΚΥΨΕΛΗ	11364	2108673000
ΜΕΓΑΡΙΤΗ ΜΑΡΙΑ	ΑΝΔΡΕΟΥ ΔΗΜΗΤΡΙΟΥ 27	ΑΓ. ΔΗΜΗΤΡΙΟΣ	17341	2109750377
ΜΕΓΑΡΙΤΗ ΕΥΦΡΟΣΥΝΗ	ΠΡΙΑΜΟΥ 82	ΑΓ. ΔΗΜΗΤΡΙΟΣ	17343	2109708319
ΜΕΓΓΟΥΛΗΣ ΚΩΝ/ΝΟΣ	ΓΡΗΓΟΡΙΟΥ Ε' 20Α	ΚΕΡΑΤΕΑ	19001	2299067029
ΜΕΘΕΝΙΤΗ ΑΝΑΣΤΑΣΙΑ	ΣΟΥΝΙΟΥ 26	ΜΑΡΚΟΠΟΥΛΟ - ΠΟΡΤΟ ΡΑΦΤΗ	19003	2299040657
ΜΕΛΕΤΑΚΗ ΒΑΣΙΛΙΚΗ	ΑΧΙΛΛΕΩΣ 13-15	Π. ΦΑΛΗΡΟ	17562	2109852969
ΜΕΛΕΤΗ ΚΩΝΣΤΑΝΤΙΝΑ-ΕΛΕΝΗ	ΒΑΚΧΟΥ 21	ΒΑΡΗ	16672	2108973215
ΜΕΛΕΤΗ ΠΑΝΑΓΙΩΤΑ	ΜΥΡΙΒΗΛΗ 11 & ΥΨΗΛΑΝΤΟΥ 78	ΑΛΙΜΟΣ	17455	2109849049
ΜΕΛΙΣΣΟΥΡΓΟΥ ΣΟΦΙΑ	ΚΑΡΑΪΣΚΑΚΗ 80	ΓΛΥΚΑ ΝΕΡΑ	15354	2106657821
ΜΕΛΛΑ ΚΥΡΙΑΚΗ	ΝΙΚΟΛΑΟΥ ΠΛΑΣΤΗΡΑ 31	ΑΝΑΒΥΣΣΟΣ	19013	
ΜΕΛΛΟΥ ΤΡΙΣΕΥΓΕΝΗ	ΚΟΥΤΣΟΝΙΚΑ 5	ΑΘΗΝΑ - ΝΕΟΣ ΚΟΣΜΟΣ	11744	2109029307
ΜΕΝΕΓΗ ΓΕΩΡΓΙΑ	ΚΟΡΥΤΣΑΣ 62	ΑΙΓΑΛΕΩ	12243	2105983794
ΜΕΡΚΟΥΡΗ ΦΩΤΕΙΝΗ	ΘΕΟΤΟΚΟΠΟΥΛΟΥ 47	ΑΘΗΝΑ - ΚΑΤΩ ΠΑΤΗΣΙΑ	11144	2102018518
ΜΕΤΑΞΑ ΑΓΓΕΛΙΚΗ	ΑΔΡΙΑΝΟΥΠΟΛΕΩΣ 104	ΒΥΡΩΝΑΣ	16231	2107642814
ΜΕΤΑΞΟΓΙΕΝΝΗΣ ΒΑΪΟΣ	ΕΠΙΔΑΥΡΟΥ 1	ΚΕΡΑΤΣΙΝΙ	18755	2104325212
ΜΗΝΑΔΑΚΗ ΚΑΛΛΙΟΠΗ	ΛΑΧΑΝΑ 17	ΠΕΡΙΣΤΕΡΙ	12131	2114070930
ΜΗΤΡΟΓΙΑΝΝΗ ΑΓΓΕΛΙΚΗ	ΑΓ. ΑΙΚΑΤΕΡΙΝΗΣ 9	ΑΘΗΝΑ - ΠΕΤΡΑΛΩΝΑ	11853	2103453583
ΜΙΑΟΥΛΗ ΙΣΙΔΩΡΑ	PALAMIDIOU 58	ΠΕΙΡΑΙΑΣ	18545	2104206576
ΜΙΚΕΛΗ ΑΛΕΞΑΝΔΡΑ	ΟΔΥΣΣΕΩΣ 61	ΧΑΙΔΑΡΙ	12461	2105321801
ΜΙΧΑ ΜΑΡΙΑ	ΕΛ. ΒΕΝΙΖΕΛΟΥ 37	ΓΑΛΑΤΣΙ	11147	2103131181
ΜΙΧΑΗΛΙΔΟΥ ΑΝΝΑ	ΣΦΑΚΤΗΡΙΑΣ 6	ΑΘΗΝΑ - ΜΕΤΑΞΟΥΡΓΕΙΟ	10435	2105239926
ΜΙΧΑΗΛΙΔΟΥ ΓΕΩΡΓΙΑ	ΚΥΜΗΣ & ΒΟΣΠΟΡΟΥ 139	ΝΕΑ ΙΩΝΙΑ	14235	2102797444
ΜΙΧΑΛΗΣ ΓΕΩΡΓΙΟΣ	ΠΟΝΤΟΥ 22	ΕΛΛΗΝΙΚΟ	16777	2109618154
ΜΙΧΑΛΟΠΟΥΛΟΥ ΔΗΜΗΤΡΑ	ΣΑΜΟΥ 27	ΜΑΡΟΥΣΙ	15125	2106846109
ΜΙΧΕΛΟΥΔΑΚΗ ΒΑΣΙΛΙΚΗ	ΑΓΚΥΛΗΣ 57	ΑΘΗΝΑ - ΝΕΟΣ ΚΟΣΜΟΣ	11743	2109214075
ΜΟΡΟΖΙΝΗΣ ΑΝΑΣΤΑΣΟΣ	Λ.ΔΗΜΟΚΡΑΤΙΑΣ 18	ΜΕΛΙΣΣΙΑ	15127	2108043507
ΜΟΣΧΟΥΔΗ ΚΑΛΛΙΡΟΗ	ΜΟΣΧΙΔΗ 11	ΛΗΜΝΟΣ- ΜΥΡΙΝΑ	81400	2254025418
ΜΟΥΛΑ ΠΑΡΑΣΚΕΥΗ	Δ. ΔΙΑΜΑΝΤΙΔΗ 7	ΚΟΡΥΔΑΛΛΟΣ	18120	2104966506
ΜΟΥΡΙΚΗΣ ΗΛΙΑΣ	ΕΘΝΙΚΗΣ ΑΝΤΙΣΤΑΣΕΩΣ 12	ΧΟΛΑΡΓΟΣ	15562	2121006486
ΜΟΥΣΟΥΡΗ ΚΑΛΛΙΟΠΗ	ΕΥΡΥΝΟΜΗΣ 73	ΖΩΓΡΑΦΟΣ	15771	2107777619
ΜΟΥΤΖΟΥΡΗ ΑΝΑΣΤΑΣΙΑ	ΘΕΜΙΔΟΣ 43-45	ΜΑΡΟΥΣΙ	15124	2108027936
ΜΠΑΚΑ ΚΩΝΣΤΑΝΤΙΝΑ	ΑΓ. ΚΗΡΥΚΟΥ 19	ΠΕΡΙΣΤΕΡΙ	12135	2105749223
ΜΠΑΚΟΠΟΥΛΟΥ ΣΤΑΥΡΟΥΛΑ	ΚΑΜΠΑΝΗ 8 & ΑΓ. ΜΕΛΕΤΙΟΥ	ΑΘΗΝΑ - ΚΑΤΩ ΠΑΤΗΣΙΑ	11252	2108629386
ΜΠΑΛΑΝΤΙΝΑΚΗ ΠΑΝΑΓΙΩΤΑ	ΠΕΡΓΑΜΟΥ 3	ΑΘΗΝΑ - ΑΓ.ΝΙΚΟΛΑΟΣ	10446	2108216535
ΜΠΑΛΑΣΗ ΑΙΚΑΤΕΡΙΝΗ	ΠΙΝΔΑΡΟΥ 3	ΝΕΑ ΠΑΛΑΤΙΑ	19015	2295039776
ΜΠΑΛΑΦΟΥΤΗ ΜΑΡΙΑ	ΦΙΛΙΑΤΡΩΝ 9-11	ΠΕΡΙΣΤΕΡΙ	12136	2105743774
ΜΠΑΜΠΑΛΗΣ ΓΙΩΡΓΟΣ	Γ.ΓΕΝΝΗΜΑΤΑ 110	ΓΛΥΦΑΔΑ	16561	2109608787
ΜΠΑΜΠΑΛΙΚΗ- Ο' ΧΑΛΛΟΡΑΝ ΒΑΣΙΛΙΚΗ ΟΥΡΑΝΙΑ	ΠΑΠΑΓΟΥ 145	ΖΩΓΡΑΦΟΣ	15772	2107770009
ΜΠΑΜΠΟΥΛΗ ΚΛΟΤΙΛΝΤΑ	ΔΡΑΓΑΤΣΑΝΙΟΥ 10	ΝΙΚΑΙΑ	18454	2104957282
ΜΠΑΡΑΜΠΟΥΤΗ ΑΚΡΙΒΗ	ΑΡΚΑΔΙΑΣ 28	ΓΕΡΑΚΑΣ	15344	2106610515
ΜΠΑΡΚΑΓΙΑΝΝΗ ΕΛΕΝΑ - ΑΡΤΕΜΙΣ	ΙΕΡΑ ΟΔΟΣ 259Β & ΑΓ. ΛΑΥΡΑΣ 2	ΑΙΓΑΛΕΩ	12244	2105982023
ΜΠΑΣΤΟΥΝΗ - ΑΓΙΑΝΟΓΛΟΥ ΚΑΛΛΙΟΠΗ	ΨΥΧΑΡΗ 13	Ν.ΨΥΧΙΚΟ	15451	2106774140
ΜΠΑΤΖΙΟΥ ΜΑΡΙΑ	ΑΔΡΙΑΝΟΥΠΟΛΕΩΣ 31	ΚΑΙΣΑΡΙΑΝΗ	16121	2107655505
ΜΠΑΦΑ ΑΛΕΞΑΝΔΡΑ	ΒΟΛΟΥ 7	ΧΑΛΑΝΔΡΙ	15234	2106013686
ΜΠΑΧΑΡΑΚΗ ΜΑΡΙΑ	ΛΥΚΟΥΡΓΟΥ 3	ΝΕΑ ΙΩΝΙΑ	14231	2102758635
ΜΠΕΖΑΝΤΑΚΟΣ ΑΘΑΝΑΣΙΟΣ	ΚΥΠΡΙΩΝ ΑΓΩΝΙΣΤΩΝ 15	ΠΕΙΡΑΙΑΣ - ΚΑΜΙΝΙΑ	18541	2104208913
ΜΠΕΙΚΟΣ ΑΝΑΣΤΑΣΙΟΣ	ΠΑΛΛΗΚΑΡΙΔΟΥ 53	ΑΙΓΑΛΕΩ	12223	2130404412
ΜΠΕΚΙΑΡΗ ΔΗΜΗΤΡΑ	ΑΓ. ΓΕΩΡΓΙΟΥ 15	ΝΕΑ ΦΙΛΑΔΕΛΦΕΙΑ	14342	2102777725
ΜΠΕΝΑΚΗ ΑΘΗΝΑ	ΝΑΥΑΡΙΝΟΥ 42	ΝΙΚΑΙΑ	18451	2104909650
ΜΠΕΡΔΕΚΑΣ ΚΛΕΑΡΧΟΣ	ΛΑΖΑΡΑΔΩΝ 15	ΑΘΗΝΑ - ΚΥΨΕΛΗ	11363	2108217545
ΜΠΕΡΔΕΝΗ ΕΥΓΕΝΙΑ	ΠΑΠΑΣΤΡΑΤΟΥ 36 & ΚΑΣΤΡΙΩΤΟΥ 2-4	ΑΘΗΝΑ	11476	2106434677
ΜΠΕΡΕΚΕΤΗΣ ΜΙΧΑΗΛ	ΣΠ.ΠΑΤΣΗ 119	ΑΘΗΝΑ - ΒΟΤΑΝΙΚΟΣ`;

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
    const skippedAreas = ['ΣΑΜΟΣ', 'ΧΙΟΣ', 'ΛΗΜΝΟΣ- ΜΥΡΙΝΑ', 'ΣΑΜΟΣ – ΚΑΡΛΟΒΑΣΙ', 'Ν. ΚΑΡΛΟΒΑΣΙ', 'ΛΗΜΝΟΣ', 'ΓΑΛΑΤΑΣ', 'ΑΣΤΡΟΣ', 'ΑΙΓΙΝΑ'];

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

    console.log(`Parsed ${batch.length} valid language centers in the Athens area for BATCH 6. Executing import...`);

    const newCredentials = [];

    for (let index = 0; index < batch.length; index++) {
      const inst = batch[index];
      const instituteName = `Κέντρο Ξένων Γλωσσών ${inst.ownerName}`;
      const emailName = generateSlug(inst.ownerName);
      const email = `${emailName}@tofrontistirio.gr`;
      const password = Math.random().toString(36).slice(-10) + 'S26!';

      console.log(`[${index + 1}/${batch.length}] Importing BATCH 6: ${instituteName}...`);

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

    console.log(`\n--- BATCH 6 ATHENS LANGUAGE CENTERS SUCCESSFULLY IMPORTED (${newCredentials.length} centers) ---`);

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
