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

const rawText = `ΜΠΕΡΚΕΤΗΣ ΑΓΓΕΛΟΣ	ΝΥΜΦΩΝ 39	ΗΛΙΟΥΠΟΛΗ	16341	2109932522
ΜΠΕΡΤΑΜΙΝΙ ΧΡΙΣΤΙΝΑ	ΑΓΙΟΥ ΙΩΑΝΝΟΥ 7	ΑΓ. ΠΑΡΑΣΚΕΥΗ	15343	2106015786
ΜΠΕΤΖΕΛΟΣ ΔΗΜΗΤΡΙΟΣ	ΑΓ. ΤΡΙΑΔΟΣ & ΡΙΜΙΝΙ 109	ΧΑΙΔΑΡΙ	12461	2105810163
ΜΠΕΤΣΗ ΜΑΡΙΝΑ - ΠΑΓΩΝΑ	ΠΟΝΤΟΥ 50	ΔΡΟΣΙΑ	14572	2106218312
ΜΠΕΤΣΗ - ΑΝΑΣΤΑΣΟΠΟΥΛΟΥ ΜΑΡΘΑ	ΜΙΑΟΥΛΗ 6	ΔΑΦΝΗ	17234	2109026446
ΜΠΕΤΣΗΣ ΕΜΜΑΝΟΥΗΛ	ΘΗΒΩΝ 109	ΠΕΙΡΑΙΑΣ	18542	2104916363
ΜΠΕΤΣΗΣ ΑΝΔΡΕΑΣ	ΠΥΡΓΟΥ 31	ΠΕΙΡΑΙΑΣ	18542	2104923475
ΜΠΙΚΟΥΛΗ - ΓΕΡΜΑΝΑΚΟΥ ΑΓΓΕΛΙΚΗ	ΕΛ. ΒΕΝΙΖΕΛΟΥ 48	ΝΕΑ ΧΑΛΚΗΔΟΝΑ	14343	2102510646
ΜΠΙΣΜΠΙΚΗΣ ΔΗΜΗΤΡΙΟΣ	ΓΡΗΓΟΡΙΟΥ ΑΥΞΕΝΤΙΟΥ 37	ΚΑΜΑΤΕΡΟ	13451	2102615888
ΜΠΛΑΖΟΓΙΑΝΝΑΚΗ - ΓΑΛΑΝΟΠΟΥΛΟΥ ΑΝΝΑ	ΒΙΑΝΤΟΣ 2	ΑΘΗΝΑ - ΚΟΛΩΝΟΣ	10442	2105144478
ΜΠΟΓΔΑΝΟΥ ΚΩΝΣΤΑΝΤΙΝΑ	7ης ΜΑΡΤΙΟΥ 23 (ΠΡΩΗΝ ΚΟΝΔΥΛΗ)	ΝΙΚΑΙΑ	18450	2104910590
ΜΠΟΓΔΑΝΟΥ ΕΛΕΥΘΕΡΙΑ	25ης ΜΑΡΤΙΟΥ 63	ΠΕΙΡΑΙΑΣ	18543	2104207800
ΜΠΟΓΟΡΔΟΥ ΕΛΕΥΘΕΡΙΑ	ΕΛ. ΒΕΝΙΖΕΛΟΥ 25	ΑΓ. ΒΑΡΒΑΡΑ	12351	2105610999
ΜΠΟΗ ΕΛΚΕ-ΑΝΕΤ	ΚΡΙΝΩΝ 29Α	ΧΑΛΑΝΔΡΙ	15233	2106858802
ΜΠΟΡΟΥ ΕΛΕΥΘΕΡΙΑ	ΕΘΝΙΚΗΣ ΑΝΤΙΣΤΑΣΕΩΣ & ΣΟΦΟΚΛΕΟΥΣ	ΛΗΜΝΟΣ - ΜΥΡΙΝΑ	81400	2254023347
ΜΠΟΡΤΖΙ - ΝΕΣΤΟΡΙΔΟΥ ΝΑΝΤΙΑ ΡΑΦΑΕΛΛΑ	ΥΨΗΛΑΝΤΟΥ 148	ΠΕΙΡΑΙΑΣ	18532	2104174047
ΜΠΟΣΙΝΑΚΗ ΑΝΔΡΙΑΝΗ	ΖΕΦΥΡΟΥ 25	ΝΕΟ ΗΡΑΚΛΕΙΟ	14122	2102826247
ΜΠΟΥΚΟΥΒΑΛΑ ΣΤΑΜΑΤΙΝΑ	ΑΜΕΡΙΚΑΝΙΔΩΝ ΚΥΡΙΩΝ 88	ΝΙΚΑΙΑ	18450	2104901822
ΜΠΟΥΛΝΤΟΥΜΗ ΒΑΣΙΛΙΚΗ	ΠΡΑΞΙΤΕΛΟΥΣ 131	ΠΕΙΡΑΙΑΣ	18532	2104223005
ΜΠΟΥΛΝΤΟΥΜΗΣ ΑΓΓΕΛΟΣ-ΙΩΑΝΝΗΣ	Μ.ΧΑΤΖΗΚΥΡΙΑΚΟΥ 29	ΠΕΙΡΑΙΑΣ - ΧΑΤΖΗΚΥΡΙΑΚΕΙΟ	18538	2104283121
ΜΠΟΥΜΠΟΥΛΗ ΕΥΓΕΝΙΑ	ΜΟΥΣΩΝ 13	ΝΙΚΑΙΑ	18452	2104926801
ΜΠΡΑΟΥΔΑΚΗ ΒΑΣΙΛΙΚΗ	ΚΡΥΣΤΑΛΛΗ 44	ΑΘΗΝΑ - ΓΑΛΑΤΣΙ	11141	2102017745
ΜΠΡΙΤΣΑ ΑΙΚΑΤΕΡΙΝΗ	ΝΑΡΚΙΣΣΩΝ 52	ΧΑΛΑΝΔΡΙ	15233	2106815000
ΜΠΡΟΥΣΤΗΣ ΓΕΩΡΓΙΟΣ	Κ.ΒΑΡΝΑΛΗ 16	ΠΕΤΡΟΥΠΟΛΗ	13231	2105027802
ΜΥΣΙΡΛΗ ΓΕΩΡΓΙΑ	ΠΑΠΑΝΑΣΤΑΣΙΟΥ 5	ΑΧΑΡΝΑΙ	13671	2102384493
ΜΥΤΙΛΗΝΑΙΟΣ 'ΣΤΡΑΤΗ' ΧΑΡΑΛΑΜΠΟΣ	ΗΡΟΔΟΤΟΥ 61	ΙΛΙΟΝ	13123	2105010691
ΜΩΡΟΥ ΑΡΧΟΝΤΙΑ	ΡΟΔΟΥ 21	ΑΘΗΝΑ - ΑΓ.ΝΙΚΟΛΑΟΣ	10446	2108611021
ΝΙΑΡΧΟΥ ΕΛΕΝΗ	ΛΙΑΚΟΙ ΕΝΑΝΤΙ 2ου ΛΥΚΕΙΟΥ	ΜΕΓΑΡΑ	19100	2296025556
ΝΙΚΗΤΑΚΗ - ΡΟΥΣΑΛΗ ΑΝΔΡΙΑΝΑ	ΜΟΥΣΩΝ 70	ΠΕΙΡΑΙΑΣ	18534	2104112577
ΝΙΚΗΤΟΠΟΥΛΟΥ - ΓΙΑΓΚΟΥΛΟΒΙΤΣ ΕΛΕΝΗ	ΚΛΕΙΣΟΥΡΑΣ 4	ΜΕΓΑΡΑ	19100	2296021545
ΝΙΚΗΦΟΡΑΚΗ-ΚΑΛΔΑΝΗ ΣΟΦΙΑ	ΚΩΝΣΤΑΝΤΙΝΟΥΠΟΛΕΩΣ 96 & ΑΝΕΞΑΡΤΗΣΙΑΣ	ΙΛΙΟΝ	13121	2105050107
ΝΙΚΟΛΑΙΔΗΣ ΕΛΕΥΘΕΡΙΟΣ	ΗΠΕΙΡΟΥ 76	ΠΕΡΑΜΑ	18863	2104413859
ΝΙΚΟΛΑΚΑΙΝΑ ΕΥΑΓΓΕΛΙΑ	ΚΑΛΥΨΟΥΣ 93	ΚΑΛΥΨΟΥΣ 93	ΚΑΛΛΙΘΕΑ	17671	2109565465
ΝΙΚΟΛΑΚΑΚΗ ΠΑΝΑΓΙΩΤΑ	ΑΓ. ΛΑΥΡΑΣ 164	ΠΕΤΡΟΥΠΟΛΗ	13231	2105010900
ΝΙΚΟΛΑΚΑΚΗ ΕΛΕΥΘΕΡΙΑ	ΝΑΟΥΣΑΣ 17	ΑΝΩ ΛΙΟΣΙΑ	13341	2102486678
ΝΙΚΟΛΑΟΥ ΠΑΝΑΓΙΩΤΗΣ	ΕΡΕΧΘΕΙΟΥ Κ' ΠΕΛΟΠΟΝΝΗΣΟΥ 63Β	ΚΟΡΥΔΑΛΛΟΣ	18121	2105696800
ΝΙΚΟΛΑΡΟΠΟΥΛΟΥ ΕΡΜΙΝΑ	ΠΛ. ΗΡΩΩΝ ΠΟΛΥΤΕΧΝΕΙΟΥ 75	ΧΑΙΔΑΡΙ - ΔΑΣΟΣ	12462	2105820920
ΝΙΚΟΛΟΥΔΑΚΗ ΜΑΡΙΑ	ΚΩΝΣΤΑΝΤΙΝΟΥΠΟΛΕΩΣ 9	ΠΕΤΡΟΥΠΟΛΗ	13231	2105068308
ΝΙΚΟΠΟΥΛΟΥ ΕΛΕΝΗ	Γ. ΜΑΡΙΝΟΥ 15	ΕΛΛΗΝΙΚΟ	16777	2109617683
ΝΙΚΟΥ ΣΠΥΡΙΔΟΥΛΑ	ΓΕΩΡΓ. ΠΑΠΑΝΔΡΕΟΥ 58	ΧΑΙΔΑΡΙ - ΔΑΣΟΣ	12462	2105810985
ΝΙΟΥΜΑΝ ΧΑΡΗΣ	25ης ΜΑΡΤΙΟΥ 2	ΝΕΑ ΠΕΝΤΕΛΗ	15236	2108049134
ΝΟΜΙΚΟΥ ΕΙΡΗΝΗ	ΨΗΛΟΡΕΙΤΗ 37	ΑΓ. ΔΗΜΗΤΡΙΟΣ	17342	2109888551
ΝΤΑΛΑΚΟΥΡΑ ΕΥΘΥΜΙΑ	ΜΙΧΑΗΛ ΒΟΔΑ 33	ΑΘΗΝΑ	10440	2108846264
ΝΤΑΝΑΣΗ ΜΑΡΙΑ	ΠΡΟΜΗΘΕΩΣ 52	ΑΘΗΝΑ	11254	2102015941
ΝΤΕΛΗ ΒΑΣΙΛΙΚΗ	ΔΕΞΑΜΕΝΗΣ 2 & Γ.ΠΑΠΑΝΔΡΕΟΥ	ΜΕΤΑΜΟΡΦΩΣΗ	14451	2112218660
ΝΤΙΝΟΠΟΥΛΟΣ ΑΝΔΡΕΑΣ	ΙΟΥΣ 68	ΑΘΗΝΑ - ΠΕΤΡΑΛΩΝΑ	11853	2103479230
ΝΤΟΝΤΟΥ ΕΥΑΓΓΕΛΙΑ	ΑΡΕΤΗΣ 41	ΑΓ. ΑΝΑΡΓΥΡΟΙ	13561	2102610980
ΝΤΟΥΡΟΣ ΙΩΑΝΝΗΣ	ΑΦΑΙΑΣ 17	ΑΙΓΙΝΑ	18010	2297023539
ΝΤΟΥΡΤΟΥΡΕΚΑΣ ΠΕΤΡΟΣ	ΦΘΙΩΤΙΔΟΣ 50	ΑΘΗΝΑ - ΠΟΛΥΓΩΝΟ	11522	2106436405
ΞΑΝΘΑΚΟΥ AΙΚΑΤΕΡΙΝΗ	28ης ΟΚΤΩΒΡΙΟΥ 15	ΝΕΑ ΠΑΛΑΤΙΑ	19015	2295034551
ΞΕΝΟΦΟΣ ΜΑΡΙΟΣ	ΡΟΔΟΥ ΚΑΙ ΚΑΛΥΜΝΟΥ 1	ΠΕΡΙΣΤΕΡΙ	12132	2105744640
ΞΕΝΟΦΟΣ ΝΙΚΟΛΑΟΣ	ΡΟΔΟΥ ΚΑΙ ΚΑΛΥΜΝΟΥ 1	ΠΕΡΙΣΤΕΡΙ	12132	2105744640
ΞΙΦΑΡΑΣ ΜΙΧΑΛΗΣ	ΑΣΠΡΟΠΟΤΑΜΟΥ 64	ΑΓ. ΔΗΜΗΤΡΙΟΣ	17342	2109810612
ΞΥΔΟΠΟΥΛΟΥ ΕΛΕΝΗ	ΚΑΡΑΙΣΚΟΥ 106	ΠΕΙΡΑΙΑΣ	18535	2104222216
ΞΥΝΗ ΓΕΩΡΓΙΑ	25ης ΜΑΡΤΙΟΥ & ΜΠΟΥΜΠΟΥΛΙΝΑΣ	ΠΕΤΡΟΥΠΟΛΗ	13231	2105051537
ΞΥΝΤΑΡΑΚΗ ΧΑΡΙΚΛΕΙΑ	ΑΡΚΑΔΙΑΣ 66	ΧΑΛΑΝΔΡΙ	15235	2106007125
ΟΙΚΟΝΟΜΑΚΟΥ - ΤΣΟΥΤΣΟΥΒΑ ΣΟΦΙΑ	ΔΕΥΚΑΛΙΩΝΟΣ 54	ΑΘΗΝΑ - ΚΑΤΩ ΠΑΤΗΣΙΑ	11144	2102010310
ΟΙΚΟΝΟΜΟΥ ΚΩΝΣΤΑΝΤΙΝΟΣ	ΚΡΗΤΗΣ 56	ΑΡΓΥΡΟΥΠΟΛΗ	16451	2109928072
ΠΑΓΚΑΛΟΣ ΑΝΑΣΤΑΣΙΟΣ	13ης ΟΚΤΩΒΡΙΟΥ 28	ΚΕΡΑΤΣΙΝΙ	18758	2104007982
ΠΑΓΚΕΙΟΥ ΑΙΚΑΤΕΡΙΝΗ	ΚΑΡΑΪΣΚΑΚΗ 13	ΑΙΓΙΝΑ	18010	2297023038
ΠΑΛΑΙΟΓΙΑΝΝΗ ΔΗΜΗΤΡΑ	ΛΟΥΚΙΑΝΟΥ 1	ΗΛΙΟΥΠΟΛΗ	16341	2109969543
ΠΑΛΑΜΑΡΑ ΕΛΕΝΗ	25ΗΣ ΜΑΡΤΙΟΥ 71	ΑΓ. ΔΗΜΗΤΡΙΟΣ	17343	2109701579
ΠΑΛΑΜΑΡΗ ΑΝΤΩΝΙΑ	ΑΓΙΟΥ ΙΩΑΝΝΟΥ 53	ΑΓ. ΠΑΡΑΣΚΕΥΗ	15342	2106003608
ΠΑΛΜΕΡ ΜΑΡΚ	ΑΠ. ΠΑΥΛΟΥ 1	ΝΕΟ ΗΡΑΚΛΕΙΟ	14122	2102810587
ΠΑΝΑΓΗ ΣΤΑΥΡΟΥΛΑ	ΧΡΙΣΤΟΦΟΡΙΔΟΥ 3-5	ΠΕΙΡΑΙΑΣ - ΚΑΜΙΝΙΑ	18541	2104815018
ΠΑΝΑΓΙΩΤΟΠΟΥΛΟΥ ΚΑΛΛΙΟΠΗ	ΜΑΚΡΥΓΙΑΝΝΗ 52	ΓΕΡΑΚΑΣ	15344	2106047796
ΠΑΝΑΓΟΥ ΕΥΤΥΧΙΑ	ΙΘΑΚΗΣ 23	ΓΕΡΑΚΑΣ	15344	2106617371
ΠΑΝΑΓΟΥΛΙΑ ΠΑΓΩΝΑ	ΜΑΤΡΩΖΟΥ 105	ΝΙΚΑΙΑ	18452	2155012697
ΠΑΝΙΤΣΑ ΔΗΜΗΤΡΑ	ΚΟΡΔΕΛΙΟΥ 22	ΠΕΡΙΣΣΟΣ	14232	2102797211
ΠΑΝΟΥΣΟΠΟΥΛΟΣ ΙΩΑΝΝΗΣ	ΘΕΜΙΣΤΟΚΛΕΟΥΣ 21	ΑΡΤΕΜΙΣ	19016	2294088957
ΠΑΝΟΥΣΟΠΟΥΛΟΥ ΕΥΣΤΑΘΙΑ	ΑΡΙΣΤΕΙΔΟΥ 17	ΙΛΙΟΝ	13122	2102629076
ΠΑΝΤΑΖΗ ΑΘΑΝΑΣΙΑ	ΚΙΜΩΝΟΣ 5	ΕΛΕΥΣΙΝΑ	19200	2105544873
ΠΑΝΤΕΛΗ ΜΑΡΙΑ	ΜΑΡΙΝΟΥ ΑΝΤΥΠΑ 61	ΗΛΙΟΥΠΟΛΗ	16346	2109921947
ΠΑΝΤΕΛΟΓΙΑΝΝΗ ΜΑΡΙΑ	ΜΙΑΟΥΛΗ 60	ΓΕΡΑΚΑΣ	15344	2106048737
ΠΑΝΤΟΥ ΒΑΣΙΛΙΚΗ	ΣΩΤΗΡ.ΠΑΝΤΟΥ 10	ΑΦΙΔΝΑΙ	19014	2295022059
ΠΑΠΑ ΑΤΣΑΛΟΓΛΟΥ ΓΕΩΡΓΙΑ	ΑΡΤΕΜΙΔΟΣ 26	ΑΛΙΜΟΣ	17455	2109839275
ΠΑΠΑΒΑΡΣΑΜΗΣ ΓΕΩΡΓΙΟΣ	ΛΟΧΑΓΟΥ ΞΗΡΟΓΙΑΝΝΗ 50	ΖΩΓΡΑΦΟΣ	15771	2107773378
ΠΑΠΑΒΑΣΙΛΕΙΟΥ ΚΩΝΣΤΑΝΤΙΝΟΣ	ΘΗΡΑΣ 5	ΠΕΡΙΣΤΕΡΙ	12133	2155455855
ΠΑΠΑΒΑΣΙΛΕΙΟΥ ΑΝΝΑ	ΣΚΟΥΦΑ 126	ΠΕΤΡΟΥΠΟΛΗ	13231	2105059584
ΠΑΠΑΒΑΣΙΛΕΙΟΥ ΙΩΑΝΝΗΣ	Μ. ΑΣΙΑΣ 48	ΑΡΓΥΡΟΥΠΟΛΗ	16452	2109625303
ΠΑΠΑΓΕΩΡΓΙΟΥ ΑΛΕΞΑΝΔΡΑ	ΝΑΞΟΥ 24	ΑΘΗΝΑ	11256	2108656890
ΠΑΠΑΓΕΩΡΓΙΟΥ ΔΗΜΗΤΡΗΣ	ΓΕΝΝΗΜΑΤΑ 40	ΒΥΡΩΝΑΣ	16231	2107658452
ΠΑΠΑΓΙΑΝΝΙΩΔΗΣ ΒΑΣΙΛΕΙΟΣ	Δ. ΚΑΡΑΚΟΥΛΟΥΞΗ 55	ΝΙΚΑΙΑ	18450	2104929615
ΠΑΠΑΔΑΝΤΩΝΑΚΗΣ ΧΡΗΣΤΟΣ	ΕΛΕΥΘΕΡΙΑΣς 68 ΚΑΙ ΧΑΡ. ΤΡΙΚΟΥΠΗ	ΠΕΡΑΜΑ	18863	2104411590
ΠΑΠΑΔΑΤΟΥ ΑΣΗΜΙΝΑ (ΣΕΜΕΛΗ)	ΑΝΔΡΟΥΤΣΟΥ 76	ΠΕΙΡΑΙΑΣ	18532	2104173302
ΠΑΠΑΔΑΤΟΥ ΕΥΑΝΘΙΑ	ΑΝΔΡΟΥΤΣΟΥ 76	ΠΕΙΡΑΙΑΣ	18532	2104173302
ΠΑΠΑΔΕΛΗ ΣΟΦΙΑ	ΣΜΥΡΝΗΣ 4	ΚΑΙΣΑΡΙΑΝΗ	16121	2107220879
ΠΑΠΑΔΗΜΗΤΡΙΟΥ ΣΤΑΜΑΤΗΣ	ΠΑΝΔΡΟΣΟΥ 43	Π. ΦΑΛΗΡΟ	17563	2109851577
ΠΑΠΑΔΗΜΗΤΡΙΟΥ ΣΤΥΛΙΑΝΗ	ΔΕΡΒΕΝΑΚΙΩΝ 6	ΣΑΜΟΣ	83101	2273051103
ΠΑΠΑΔΟΠΟΥΛΟΣ ΕΛΑΝΤΕΡ ΟΣΚΑΡ ΜΑΡΙΟΣ	ΠΟΣΕΙΔΩΝΟΣ 5	ΚΟΡΥΔΑΛΛΟΣ	18120	2104960900
ΠΑΠΑΔΟΠΟΥΛΟΥ ΧΑΪΔΩ (ΧΑΙΝΤΙ)	ΑΙΓΟΣΘΕΝΩΝ 54	ΓΑΛΑΤΣΙ	11146	2102134914
ΠΑΠΑΔΟΠΟΥΛΟΥ ΚΩΝΣΤΑΝΤΙΝΑ	ΕΣΠΕΡΙΔΩΝ 31	ΑΧΑΡΝΑΙ	13678	2102476450
ΠΑΠΑΔΟΠΟΥΛΟΥ ΑΓΓΕΛΙΚΗ	ΚΟΥΝΤΟΥΡΙΩΤΟΥ 29	ΚΟΡΥΔΑΛΛΟΣ	18120	2104961373
ΠΑΠΑΔΟΠΟΥΛΟΥ ΜΑΡΙΑ	ΑΛΚΙΒΙΑΔΟΥ 19	ΕΛΕΥΣΙΝΑ	19200	2105547639
ΠΑΠΑΔΟΠΟΥΛΟΥ ΕΥΓΕΝΙΑ	Μ. ΜΗΤΡΟΠΟΥΛΟΥ 49-51	ΛΑΥΡΙΟ	19500	2292060950
ΠΑΠΑΘΑΝΑΣΙΟΥ ΣΤΑΥΡΟΥΛΑ	ΒΕΝΙΖΕΛΟΥ 35	ΣΑΛΑΜΙΝΑ	18901	2104673667
ΠΑΠΑΚΩΝΣΤΑΝΤΙΝΟΥ ΣΤΥΛΙΑΝΟΣ	ΦΟΛΕΓΑΝΔΡΟΥ 7	ΚΑΤΩ ΠΑΤΗΣΙΑ	11253	2108646107
ΠΑΠΑΚΩΝΣΤΑΝΤΙΝΟΥ ΒΑΣΙΛΙΚΗ	ΠΑΤΡΩΝ 19	ΑΧΑΡΝΑΙ	13671	2102313710
ΠΑΠΑΚΩΝΣΤΑΝΤΙΝΟΥ ΑΓΓΕΛΙΚΗ	Ι.ΧΡΥΣΟΣΤΟΜΟΥ 44	ΝΕΑ ΣΜΥΡΝΗ	17122	2109422080
ΠΑΠΑΛΕΞΙΟΥ ΑΛΕΞΙΟΣ	ΚΡΗΤΗΣ 4	ΝΕΟ ΨΥΧΙΚΟ	15451	2106723762`;

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

      let ownerName = parts[0].trim();
      let address = parts[1].trim();
      let areaName = parts[2].trim();
      let postalCode = parts[3] ? parts[3].trim() : '';
      let phone = parts[4] ? parts[4].trim() : '';

      // Fix duplicate details in raw text if any (e.g. ΝΙΚΟΛΑΚΑΙΝΑ ΕΥΑΓΓΕΛΙΑ line has duplicate columns)
      if (ownerName.includes('ΝΙΚΟΛΑΚΑΙΝΑ ΕΥΑΓΓΕΛΙΑ')) {
         address = 'ΚΑΛΥΨΟΥΣ 93';
         areaName = 'ΚΑΛΛΙΘΕΑ';
         postalCode = '17671';
         phone = '2109565465';
      }

      // Skip entries outside Attica region
      if (skippedAreas.some(sa => areaName.toUpperCase().includes(sa))) {
        console.log(`Skipping outside Athens: ${ownerName} (${areaName})`);
        continue;
      }

      batch.push({ ownerName, address, areaName, postalCode, phone });
    }

    console.log(`Parsed ${batch.length} valid language centers in the Athens area for BATCH 7. Executing import...`);

    const newCredentials = [];

    for (let index = 0; index < batch.length; index++) {
      const inst = batch[index];
      const instituteName = `Κέντρο Ξένων Γλωσσών ${inst.ownerName}`;
      const emailName = generateSlug(inst.ownerName);
      const email = `${emailName}@tofrontistirio.gr`;
      const password = Math.random().toString(36).slice(-10) + 'S26!';

      console.log(`[${index + 1}/${batch.length}] Importing BATCH 7: ${instituteName}...`);

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

    console.log(`\n--- BATCH 7 ATHENS LANGUAGE CENTERS SUCCESSFULLY IMPORTED (${newCredentials.length} centers) ---`);

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
