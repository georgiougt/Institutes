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

const rawText = `ΚΟΝΤΑΞΗΣ ΓΕΡΑΣΙΜΟΣ	ΛΑΜΠΑΚΗ 60	ΚΑΤΩ ΠΑΤΗΣΙΑ	11143	2102019846
ΚΟΝΤΖΙΑ ΖΩΗ	ΓΑΓΓΡΑΣ 10	ΡΙΖΟΥΠΟΛΗ	11142	2102587362
ΚΟΝΤΟΓΕΩΡΓΗ ΜΥΡΣΙΝΗ	ΛΑΥΡΙΟΥ 8	ΙΛΙΟΝ	13123	2105054182
ΚΟΝΤΟΠΙΘΑΡΗ ΑΙΚΑΤΕΡΙΝΗ	ΚΟΥΜΟΥΝΔΟΥΡΟΥ 63	ΑΓ. ΙΩΑΝ. ΡΕΝΤΗΣ	18233	2104908984
ΚΟΝΤΟΠΟΥΛΟΣ ΗΛΙΑΣ	ΑΡΧΙΜΗΔΟΥΣ 30	ΑΓ. ΒΑΡΒΑΡΑ	12351	2105691110
ΚΟΝΤΟΠΟΥΛΟΥ ΣΟΦΙΑ	ΕΛ. ΒΕΝΙΖΕΛΟΥ 28	ΔΑΦΝΗ	17235	2109756137
ΚΟΠΑΝΟΥ ΔΕΣΠΟΙΝΑ	ΚΥΡΙΛΛΟΥ ΤΡΕΧΑΚΗ 16	ΧΙΟΣ	82131	2271100560
ΚΟΡΜΠΟΥ ΕΛΕΥΘΕΡΙΑ	ΚΥΠΡΟΥ 87	ΑΡΓΥΡΟΥΠΟΛΗ	16451	2109911267
ΚΟΡΡΕΣ ΝΙΚΟΛΑΟΣ	ΜΑΡΑΘΩΝΟΣ 10	ΑΧΑΡΝΑΙ	13674	2102468845
ΚΟΡΡΕΣ ΔΗΜΗΤΡΙΟΣ	ΣΜΥΡΝΗΣ 4	ΝΕΑ ΦΙΛΑΔΕΛΦΕΙΑ	14341	2102511657
ΚΟΣΜΑΤΟΠΟΥΛΟΥ ΒΑΣΙΛΙΚΗ	ΣΤΡ.ΛΕΚΚΑ 34	ΜΑΡΟΥΣΙ	15122	2108055884
ΚΟΣΜΙΔΟΥ ΚΥΡΙΑΚΗ	ΑΝΑΓΝΩΣΤΑΡΑ 25	ΑΓΙΟΣ ΔΗΜΗΤΡΙΟΣ	17341	2109849661
ΚΟΣΜΙΔΟΥ - ΔΕΡΖΙΩΤΗ ΑΛΕΞΑΝΔΡΑ	ΣΙΝΑΣΟΥ 11	ΚΕΡΑΤΣΙΝΙ	18755	2104634508
ΚΟΥΓΙΟΥΜΤΖΟΓΛΟΥ ΔΗΜΗΤΡΑ	Μ. ΜΕΡΚΟΥΡΗ 31	ΝΕΟ ΗΡΑΚΛΕΙΟ	14122	2102757673
ΚΟΥΚΑ ΜΑΡΙΝΑ	ΑΧΑΡΝΩΝ 27	ΠΕΙΡΑΙΑΣ - ΚΑΜΙΝΙΑ	18540	2104827654
ΚΟΥΚΙΔΗΣ ΣΠΥΡΟΣ	ΑΚΑΔΗΜΙΑΣ 52	ΑΘΗΝΑ	10679	2103603029
ΚΟΥΚΙΟΥ ΒΑΣΙΛΙΚΗ	Θ.ΣΟΦΟΥΛΗ 52	ΝΕΑ ΦΙΛΑΔΕΛΦΕΙΑ	14342	2102528476
ΚΟΥΛΙΚΗ ΜΑΓΔΑΛΗΝΗ	ΠΥΛΗΣ 73	ΠΕΙΡΑΙΑΣ	18533	2104117576
ΚΟΥΛΙΟΥΡΑ ΙΟΥΛΙΑ	ΑΘ. ΔΙΑΚΟΥ 20	ΜΕΓΑΡΑ	19100	2296022334
ΚΟΥΛΟΥΜΟΥΝΔΡΑ ΕΙΡΗΝΗ	ΣΤΥΛΙΑΝΟΥ ΧΑΛΚΙΑ	ΧΙΟΣ – ΚΑΡΔΑΜΥΛΑ	82300	2272023660
ΚΟΥΜΟΥΤΣΟΥ ΓΕΩΡΓΙΑ	ΜΑΚΕΔΟΝΙΑΣ 46	ΤΑΥΡΟΣ	17778	2103423477
ΚΟΥΝΤΟΥΡΙΩΤΟΥ - ΓΟΥΣΗ ΑΙΚΑΤΕΡΙΝΗ	ΠΛΑΠΟΥΤΑ 17 & ΤΖΑΒΕΛΛΑ	ΠΕΡΙΣΤΕΡΙ	12131	2105735400
ΚΟΥΡΑΚΛΗ ΠΑΝΑΓΙΩΤΑ	ΑΝΔΡΟΜΑΧΗΣ 13	ΠΕΡΙΣΤΕΡΙ	12135	2105761653
ΚΟΥΡΑΚΟΥ ΑΓΛΑΙΑ	Κ. ΒΑΡΝΑΛΗ 31	ΚΟΡΥΔΑΛΛΟΣ	18122	2104940062
ΚΟΥΡΑΧΑΝΗ ΕΛΕΥΘΕΡΙΑ	ΧΙΟΥ 78	ΑΓ. ΠΑΡΑΣΚΕΥΗ	15343	6017073
ΚΟΥΡΜΟΥΖΗ ΒΑΣΙΛΙΚΗ	ΚΥΠΡΟΥ 4	ΠΑΛΛΗΝΗ	15351	2106667999
ΚΟΥΡΝΙΑΤΗ ΦΙΛΙΩ	ΚΩΝΣΤΑΝΤΙΝΟΥΠΟΛΕΩΣ 9	ΠΕΤΡΟΥΠΟΛΗ	13231	2105068308
ΚΟΥΡΟΥΚΛΗΣ ΜΙΛΤΙΑΔΗΣ	ΧΑΛΚΟΚΟΝΔΥΛΗ 9	ΑΘΗΝΑ - ΚΕΝΤΡΟ	10677	2103844888
ΚΟΥΡΤΗ ΓΕΩΡΓΙΑ	ΕΛΛΗΣΠΟΝΤΟΥ 80	ΑΘΗΝΑ - ΣΕΠΟΛΙΑ	10443	2105122922
ΚΟΥΡΤΗ ΠΑΡΑΣΚΕΥΗ	ΕΛΛΗΣΠΟΝΤΟΥ 80	ΑΘΗΝΑ - ΣΕΠΟΛΙΑ	10443	2105122922
ΚΟΥΣΗ ΕΙΡΗΝΗ	ΠΑΤΡ.ΓΡΗΓΟΡΙΟΥ Ε' 15	ΙΛΙΟΝ	13122	2102616690
ΚΟΥΤΕΛΙΑ ΑΛΕΞΑΝΔΡΑ	ΓΡΑΜΜΟΥ 36	ΑΡΓΥΡΟΥΠΟΛΗ	16451	2109945671
ΚΟΥΤΡΑΚΗ ΕΥΣΤΡΑΤΙΑ	ΜΕΣΟΓΕΙΩΝ 354	ΧΟΛΑΡΓΟΣ	15341	2111131353
ΚΟΥΤΣΟΓΕΩΡΓΟΠΟΥΛΟΣ ΣΠΥΡΟΣ	RIGA FERRAIOU 22	ΑΓ. ΔΗΜΗΤΡΙΟΣ	17343	2109764581
ΚΟΥΤΣΟΜΗΤΡΟΣ ΚΩΝΣΤΑΝΤΙΝΟΣ	ΘΕΣΣΑΛΙΑΣ 82	ΠΕΤΡΟΥΠΟΛΗ	13131	2105011967
ΚΟΥΤΣΟΥΒΑ ΔΗΜΗΤΡΑ	ΑΧΑΡΝΩΝ 13 & ΚΑΜΠΟΛΗ	ΑΝΩ ΛΙΟΣΙΑ	13341	2102487520
ΚΟΥΦΑΛΙΤΑΚΗ ΠΑΡΑΣΚΕΥΗ	ΑΓ.ΑΝΤΩΝΙΟΥ 128	ΧΑΛΑΝΔΡΙ	15238	2108031837
ΚΡΑΝΙΩΤΗ ΒΑΣΙΛΙΚΗ	ΑΙΓΙΑΛΕΙΑΣ 73	ΒΥΡΩΝΑΣ	16233	2107600742
ΚΡΗΤΙΚΟΥ ΧΑΡΙΚΛΕΙΑ	ΠΙΝΔΟΥ 34 & ΣΚΙΑΘΟΥ	ΑΘΗΝΑ - ΚΥΨΕΛΗ	11255	2102231719
ΚΡΗΤΙΚΟΥ ΟΛYΜΠΙΑ	ΣΙΣΜΑΝΟΓΛΕΙΟΥ 17 & ΣΠΑΡΤΗΣ 1	ΒΡΙΛΗΣΣΙΑ	15235	2106138523
ΚΡΗΤΙΚΟΥ ΧΡΥΣΟΥΛΑ	ΨΗΛΟΡΕΙΤΗ 8 & ΔΡΕΛΙΑ	ΚΕΡΑΤΣΙΝΙ	18757	2104008655
ΚΡΙΘΑΡΟΥΛΑ ΑΘΑΝΑΣΙΑ	ΜΕΛΙΤΑΣ 33Α	ΧΑΙΔΑΡΙ	12461	2105822339
ΚΡΙΚΟΥ ΠΗΝΕΛΟΠΗ	ΧΑΛΚΟΚΟΝΔΥΛΗ 5	ΑΘΗΝΑ - ΚΕΝΤΡΟ	10677	2103301110
ΚΥΒΕΛΟΥ ΕΥΑΓΓΕΛΙΑ	ΑΜΕΡΙΚΑΝΙΔΩΝ ΚΥΡΙΩΝ 88	ΝΙΚΑΙΑ	18450	2104901822
ΚΥΠΡΙΩΤΟΥ - ΠΑΤΣΑΚΗ ΒΑΡΒΑΡΑ	ΚΑΛΟΚΑΙΡΙΝΟΥ 72	ΠΕΙΡΑΙΑΣ	18546	2104634592
ΚΥΡΙΑΖΗ ΣΤΑΜΑΤΟΥΛΑ	ΚΟΥΜΟΥΝΔΟΥΡΟΥ 2 & ΠΡΑΞΙΤΕΛΟΥΣ 20	ΠΕΡΙΣΤΕΡΙ	12136	2105731280
ΚΥΡΙΑΚΙΔΗΣ ΚΥΡΙΑΚΟΣ	ΑΜΦΙΑΡΑΟΥ 176	ΑΘΗΝΑ - ΣΕΠΟΛΙΑ	10443	2105122111
ΚΥΡΙΚΑΚΗ ΕΥΣΕΒΙΑ	ΠΛΑΣΤΗΡΑ 5	ΧΑΙΔΑΡΙ	12461	2105323249
ΚΥΡΙΤΣΗ ΖΗΝΟΒΙΑ (ΤΖΙΝΑ)	ΔΩΔΕΚΑΝΗΣΟΥ 28	ΝΕΑ ΙΩΝΙΑ	14235	2102791073
ΚΥΡΙΤΣΗΣ ΘΕΟΔΩΡΟΣ	ΠΗΝ. ΔΕΛΤΑ 16	ΑΘΗΝΑ	11525	2106747653
ΚΩΝΣΤΑ ΑΝΑΣΤΑΣΙΑ	ΤΗΝΟΥ & ΣΑΛΑΜΙΝΟΣ	ΕΡΥΘΡΕΣ ΑΤΤΙΚΗΣ	19008	2263063100
ΚΩΝΣΤΑΝΤΗ ΒΑΣΙΛΙΚΗ	ΝΕΟΚΤΙΣΤΑ Τα.Θ. 1782	ΑΣΠΡΟΠΥΡΓΟΣ	19300	2105577649
ΚΩΝΣΤΑΝΤΙΝΙΔΟΥ ΑΙΚΑΤΕΡΙΝΗ - ΕΛΕΝΗ	ΛΥΚΟΥΡΓΟΥ ΛΟΓΟΘΕΤΗ 1	ΣΑΜΟΣ	83100	2273024300
ΚΩΝΣΤΑΝΤΙΝΙΔΟΥ-ΠΑΠΑΗΛΙΟΥ ΑΝΔΡΙΑΝΗ	ΕΛ.ΒΕΝΙΖΕΛΟΥ 35	ΠΕΙΡΑΙΑΣ	18532	2104173892
ΚΩΝΣΤΑΝΤΟΠΟΥΛΟΥ ΘΑΛΕΙΑ	ΤΕΜΠΩΝ 4	ΑΘΗΝΑ - ΚΟΛΩΝΟΣ	10444	2105152996
ΚΩΝΣΤΑΝΤΟΥ ΤΖΕΣΣΙΚΑ	ΕΛΕΥΘΕΡΙΟΥ ΒΕΝΙΖΕΛΟΥ 104	ΚΑΛΛΙΘΕΑ	17676	2109590786
ΚΩΝΣΤΑΝΤΩΝΗ ΤΖΕΗΝ-ΕΛΙΖΑΜΠΕΘ	ZEΡΒΟΝΙΚΟΛΑ 8	ΜΑΝΔΡΑ	19600	2105551275
ΚΩΣΤΑΚΟΥ ΑΙΚΑΤΕΡΙΝΗ	25ης ΜΑΡΤΙΟΥ 22 & ΕΥΤΥΧΙΑΣ	ΑΡΤΕΜΙΣ	19016	2294082671
KΩΣΤΑΡΟΓΛΟΥ ΕΥΔΟΚΙΑ	ΓΕΩΡΓΙΟΥ ΠΑΠΑΝΔΡΕΟΥ 39Α	ΖΩΓΡΑΦΟΣ	15773	2130336311
ΚΩΣΤΗ ΔΕΣΠΟΙΝΑ	ΣΟΥΛΙΟΥ 171	ΠΕΤΡΟΥΠΟΛΗ	13231	2105060780
ΚΩΣΤΟΠΟΥΛΟΥ ΕΛΕΝΗ	ΘΑΣΟΥ 24	ΑΓ. ΑΝΑΡΓΥΡΟΙ	13562	2102384571
ΚΩΣΤΟΥΡΑΚΗ ΕΙΡΗΝΗ	Δ. ΚΑΡΑΚΟΥΛΟΥΞΗ 124	ΝΙΚΑΙΑ	18450	2104915025
ΚΩΤΣΑΡΗΣ ΞΕΝΟΦΩΝ	ΑΓ.ΛΑΥΡΑΣ Κ ΑΓ.ΚΩΝ/ΝΟΥ 3	ΑΙΓΑΛΕΩ	12244	2105906025
ΚΩΤΣΙΚΟΡΗΣ ΠΑΝΤΕΛΗΣ	ΑΡΙΣΤΟΜΕΝΟΥΣ 44 & ΠΕΡΣΕΩΣ	ΠΕΡΙΣΤΕΡΙ	12135	2105770198
ΛΑΓΙΟΠΟΥΛΟΥ ΑΝΑΣΤΑΣΙΑ	Λ.ΒΑΡΗΣ - ΚΟΡΩΠΙΟΥ 91 & ΦΟΛΕΓΑΝΔΡΟΥ	ΒΑΡΗ	16672	2108957650
ΡΟΥΣΣΟΥ – ΛΑΓΟΓΙΑΝΝΗ SCHOOL	ΠΛ. ΑΝΕΞΑΡΤΗΣΙΑΣ 9	ΗΛΙΟΥΠΟΛΗ	16344	2109710465
ΛΑΔΙΚΟΥ ΘΕΟΔΩΡΑ	ΔΕΛΦΩΝ 87	ΠΕΡΙΣΤΕΡΙ	12131	2105777317
ΛΑΖΑΡΑΚΗ ΧΡΥΣΟΥΛΑ	ΚΡΕΒΒΑΤΑ 105	ΠΕΙΡΑΙΑΣ - ΚΑΛΛΙΠΟΛΗ	18539	2104513288
ΛΑΖΑΡΙΔΗΣ ΜΙΧΑΗΛ	Α. ΠΑΠΑΝΔΡΕΟΥ 142	ΓΛΥΦΑΔΑ	16561	2109640020
ΛΑΖΑΡΙΔΟΥ ΕΛΕΝΗ	Α. ΠΑΠΑΝΔΡΕΟΥ 142	ΓΛΥΦΑΔΑ	16561	2109640020
ΛΑΖΑΡΟΥ ΓΕΩΡΓΙΑ	ΧΙΟΥ 20	ΔΑΦΝΗ	17237	2109712457
ΛΑΚΙΟΣ ΝΙΚΟΛΑΟΣ	ΑΓ.ΝΙΚΟΛΑΟΥ 19 & ΚΡΩΠΙΑΣ	ΚΑΜΑΤΕΡΟ	13451	2102312990
ΛΑΜΠΡΙΔΟΥ - ΤΖΑΛΟΚΩΣΤΑ ΜΑΡΙΑ	ΠΑΛΑΙΑ ΕΘΝ ΑΘΗΝΩΝ-ΧΑΛΚΙΔΟΣ	ΑΥΛΩΝΑΣ	19011	2295041636
ΛΑΜΠΡΟΠΟΥΛΟΣ ΛΑΜΠΡΟΣ	ΣΤΑΥΡΟΥ ΜΠΕΚΑ 20	ΣΠΑΤΑ	19004	2106633237
ΛΑΜΠΡΟΠΟΥΛΟΥ ΕΥΘΥΜΙΑ	ΠΑΠΑΝΑΣΤΑΣΙΟΥ 62	ΑΘΗΝΑ - ΚΑΤΩ ΠΑΤΗΣΙΑ	10445	2108318251
ΛΑΜΠΡΟΠΟΥΛΟΥ ΜΑΡΙΑ	ΠΑΠΑΝΑΣΤΑΣΙΟΥ 62	ΑΘΗΝΑ - ΚΑΤΩ ΠΑΤΗΣΙΑ	10445	2108318251
ΛΑΜΠΡΟΥ ΜΑΡΙ	Γ.ΑΝΑΓΝΩΣΤΟΥ 51	ΚΟΡΩΠΙ	19400	2106624353
ΛΕΒΕΝΤΗ ΜΑΡΙΑ	ΠΛ. ΓΙΑΝΝΕΤΑΚΗ 5	ΝΕΟ ΗΡΑΚΛΕΙΟ	14121	2102810355
ΛΕΚΚΑ - ΔΟΥΖΙΝΑ ΒΑΣΙΛΙΚΗ	ΟΜΗΡΟΥ 80	ΜΟΣΧΑΤΟ	18344	2109416803
ΛΕΟΝΤΑΡΙΤΗ-ΚΟΥΤΣΟΥΜΑΡΗ ΑΝΝΑ	ΚΑΛΛΙΘΕΑΣ 3	ΚΑΛΥΒΙΑ	19010	2291070660
ΛΕΟΝΤΙΑΔΟΥ ΚΥΡΙΑΚΗ	ΟΛΥΜΠΙΑΣ 39	ΓΑΛΑΤΣΙ	11147	2155107866
ΛΕΟΝΤΙΑΔΟΥ ΣΟΦΙΑ	ΜΑΚΕΔΟΝΙΑΣ 47	ΝΙΚΑΙΑ	18453	2104976649
ΛΕΡΗΣ ΧΡΙSTOΦΟΡΟΣ ΠΑΝΑΓΙΩΤΗΣ	ΓΑΛΑΤΑΣ ΠΟΡΟΥ ΤΡΟΙΖΙΝΙΑΣ	ΓΑΛΑΤΑΣ	18020	2298043342
ΛΕΧΟΥΡΙΤΗ ΓΕΩΡΓΙΑ	ΑΡΚΑΔΙΟΥ KAI ΙΠΠΟΚΡΑΤΟΥΣ 13	ΕΛΕΥΣΙΝΑ	19200	2105546758
ΛΗΤΣ ΑΛΕΞΑΝΔΡΟΣ	ΖΑΛΟΚΩΣΤΑ 8	ΧΑΛΑΝΔΡΙ	15233	2106814453
ΛΙΑΓΟΥΡΗ - ΛΕΒΟΓΙΑΝΝΗ ΖΑΜΠΕΤΑ	ΑΥΓΗΣ 57 & ΜΠΙΖΑΝΙΟΥ 2	ΝΕΟ ΗΡΑΚΛΕΙΟ	14121	2102820772
ΛΙΑΤΗΡΗ ΑΝΑΣΤΑΣΙΑ	ΝΑΥΑΡΙΝΟΥ 61	ΠΕΤΡΟΥΠΟΛΗ	13231	2105015081
ΛΙΖΑΡΔΟΥ ΜΑΡΙΑ - ΟΛΓΑ	ΔΗΜΟΦΩΝΤΟΣ 110 & ΙΩΝΩΝ 26-28	ΑΘΗΝΑ - ΠΕΤΡΑΛΩΝΑ	11851	2103427741
ΛΙΟΣΗ ΑΙΜΙΛΙΑ-ΜΑΡΙΝΑ	ΜΑΚΡΥΓΙΑΝΝΗ Ο.Τ.32Α 51	ΑΣΠΡΟΠΥΡΓΟΣ	19300	2105577017
ΛΟΜΠΑΡΔΟΥ ΣΟΦΙΑ	ΛΟΥΚΑ ΡΑΛΛΗ 95-97	ΠΕΙΡΑΙΑΣ	18534	2109511892
ΛΟΥΙΖΟΥ ΕΙΡΗΝΗ	ΠΙΝΔΑΡΟΥ 15	ΑΓ. ΑΝΑΡΓΥΡΟΙ	13562	2102621314
ΛΟΥΚΙΣΑ ΚΑΤΕΡΙΝΑ	ΣΕΒΑΣΤΟΥΠΟΛΕΩΣ 63	ΑΘΗΝΑ	11526	2107779031
ΛΟΥΚΟΥΖΑ ΜΑΡΙΝΑ - ΠΑΡΑΣΚΕΥΗ	ΓΡΑΒΙΑΣ 62	ΠΕΤΡΟΥΠΟΛΗ	13231	2105059577
ΛΥΜΠΕΡΗ ΜΑΡΙΑ	ΓΟΡΓΥΡΑΣ	ΣΑΜΟΣ - ΚΑΡΛΟΒΑΣΙ	83200	2273032957
ΛΥΜΠΕΡΟΠΟΥΛΟΥ ΕΥΤΥΧΙΑ	ΚΡΗΤΩΝ ΜΑΚΕΔΟΝΟΜΑΧΩΝ 5 & ΚΕΡΚΥΡΑΣ	ΓΑΛΑΤΣΙ	11146	2102282993
ΜΑΑΛΟΥΦ ΛΟΥΙΖΑ	ΦΑΙΑΚΩΝ 41	Π. ΦΑΛΗΡΟ	17563	2109848369
ΜΑΓΓΟΠΟΥΛΟΥ ΒΑΣΙΛΙΚΗ	ΑΛ.ΠΑΝΑΓΟΥΛΗ 12	ΑΣΠΡΟΠΥΡΓΟΣ	19300	2105574777
ΜΑΓΓΟΥΣΗ ΜΑΡΙΑ	ΖΑΚΥΝΘΟΥ 11	ΑΙΓΑΛΕΩ	12243	2105310620
ΜΑΓΚΛΗ ΓΕΩΡΓΙΑ - ΕΛΕΝΗ	ΑΣΤΡΟΣ ΑΡΚΑΔΙΑΣ	ΑΣΤΡΟΣ	22001	2755023760
ΜΑΓΝΗΣΑΛΗΣ ΣΩΚΡΑΤΗΣ	ΠΑΝ.ΤΣΑΛΔΑΡΗ 50	ΒΥΡΩΝΑΣ	16232	2107613133`;

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
    const skippedAreas = ['ΣΑΜΟΣ', 'ΧΙΟΣ', 'ΛΗΜΝΟΣ- ΜΥΡΙΝΑ', 'ΣΑΜΟΣ – ΚΑΡΛΟΒΑΣΙ', 'Ν. ΚΑΡΛΟΒΑΣΙ', 'ΛΗΜΝΟΣ', 'ΓΑΛΑΤΑΣ', 'ΑΣΤΡΟΣ'];

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

    console.log(`Parsed ${batch.length} valid language centers in the Athens area for BATCH 5. Executing import...`);

    const newCredentials = [];

    for (let index = 0; index < batch.length; index++) {
      const inst = batch[index];
      const instituteName = `Κέντρο Ξένων Γλωσσών ${inst.ownerName}`;
      const emailName = generateSlug(inst.ownerName);
      const email = `${emailName}@tofrontistirio.gr`;
      const password = Math.random().toString(36).slice(-10) + 'S26!';

      console.log(`[${index + 1}/${batch.length}] Importing BATCH 5: ${instituteName}...`);

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

    console.log(`\n--- BATCH 5 ATHENS LANGUAGE CENTERS SUCCESSFULLY IMPORTED (${newCredentials.length} centers) ---`);

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
