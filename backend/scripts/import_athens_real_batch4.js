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

const rawText = `ΚΑΛΟΓΕΡΟΠΟΥΛΟΥ ΣΤΑΥΡΟΥΛΑ	ΔΑΦΝΗΣ 76 & ΔΕΞΑΜΕΝΗΣ	ΚΟΡΥΔΑΛΛΟΣ	18122	2104949331
ΚΑΛΟΔΙΚΗΣ ΣΠΥΡΟΣ	ΙΘΩΜΗΣ 3	ΑΘΗΝΑ - ΓΚΥΖΗ	11474	2106433050
ΚΑΛΟΚΑΘΗ ΕΛΕΥΘΕΡΙΑ	ΑΝΑΓΕΝΝΗΣΕΩΣ 51	ΠΕΡΙΣΤΕΡΙ	12137	2105751850
ΚΑΛΟΥΔΑ ΣΟΦΙΑ	ΑΛΚΑΜΕΝΟΥΣ 61	ΑΘΗΝΑ	10440	2108830121
ΚΑΛΟΥΔΑ ΑΝΝΑ	28ης ΟΚΤΩΒΡΙΟΥ 8	ΜΑΝΔΡΑ	19600	2130360187
ΚΑΛΦΟΠΟΥΛΟΥ ΟΛΥΜΠΙΑ	ΘΕΣΠΙΕΩΝ 66 & ΚΑΛΛΙΚΡΑΤΟΥΣ	ΚΟΡΥΔΑΛΛΟΣ	18122	2104940927
ΚΑΜΑΚΑΡΗ ΡΟΔΑΝΘΗ	ΑΥΛΩΝΟΣ 114-116	ΑΘΗΝΑ - ΣΕΠΟΛΙΑ	10443	2105146072
ΚΑΜΑΡΙΩΤΟΥ ΜΑΡΓΑΡΙΤΑ	ΔΕΛΦΩΝ 70	ΑΙΓΑΛΕΩ	12243	2105982055
ΚΑΜΠΑΔΑΚΗ ΕΛΕΝΗ	ΑΡΑΧΝΑΙΟΥ 14	ΑΘΗΝΑ - ΠΟΛΥΓΩΝΟ	11522	2106400425
ΚΑΜΠΑΔΑΚΗ ΝΙΚΗ	ΑΓ.ΑΝΤΩΝΙΟΥ 128	ΧΑΛΑΝΔΡΙ	15238	2108031837
ΚΑΜΠΕΡΕΡΕ ΙΑΚΩΒΟΣ	Ι.ΜΗΤΣΑ 2	ΠΕΙΡΑΙΑΣ - ΝΕΟ ΦΑΛΗΡΟ	18547	2104824258
ΚΑΜΤΣΙΩΡΑΣ ΧΡΗΣΤΟΣ	ΕΘΝΙΚΗΣ ΑΝΤΙΣΤΑΣΕΩΣ 18	ΠΑΛΛΗΝΗ	15351	2106665259
ΚΑΝΑΒΟΥ ΑΚΡΙΒΗ	ΚΑΛΑΜΑ 6	ΑΘΗΝΑ - ΣΕΠΟΛΙΑ	10443	2105126544
ΚΑΝΑΚΗ ΑΦΡΟΔΙΤΗ	ΛΕΩΦ. ΒΑΣΙΛΙΚΩΝ 121	ΣΑΛΑΜΙΝΑ	18900	2104686377
ΚΑΝΑΡΙΟΥ ΛΑΜΠΡΙΝΗ	ΘΕΟΦΙΛΟΥ 1 & ΕΓΓΟΝΟΠΟΥΛΟΥ	ΑΝΩ ΛΙΟΣΙΑ	13341	2102470404
ΚΑΝΔΥΛΑΚΗΣ ΕΜΜΑΝΟΥΗΛ	ΑΓ. ΒΑΡΒΑΡΑΣ 31 & ΠΟΝΤΟΥ	ΑΡΓΥΡΟΥΠΟΛΗ	16452	2109625238
ΚΑΝΕΛΛΟΠΟΥΛΟΥ ΑΝΝΑ	ΑΓΙΑΣ ΛΑΥΡΑΣ 31	ΛΥΚΟΒΡΥΣΗ	14123	2102829780
ΚΑΝΤΕΡΑΚΗ ΔΕΣΠΟΙΝΑ	ΦΙΛΟΛΑΟΥ 168	ΑΘΗΝΑ - ΑΓ. ΑΡΤΕΜΙΟΣ	11632	2107012939
ΚΑΟΥΚΑΚΗ - ΚΥΡΙΑΚΕΑ ΕΥΦΡΟΣΥΝΗ	ΦΛΩΡΙΝΗΣ 3	ΙΛΙΟΝ	13121	2105734173
ΚΑΠΑΜΑ ΜΕΛΠΟΜΕΝΗ	ΑΝΑΠΑΥΣΕΩΣ 27 & ΜΗΤΡΟΠΟΥΛΟΥ	ΒΡΙΛΗΣΣΙΑ	15235	2108037894
ΚΑΠΑΤΟΥ ΠΑΝΑΓΙΩΤΑ	ΟΜΗΡΟΥ 13	ΑΘΗΝΑ - ΚΕΝΤΡΟ	10678	2103803355
ΚΑΠΕΛΛΟΥ ΒΑΡΒΑΡΑ	ΓΡ. ΛΑΜΠΡΑΚΗ 39	ΚΑΜΑΤΕΡΟ	13451	2102321833
ΚΑΠΕΡΩΝΗ ΠΑΡΑΣΚΕΥΗ	ΕΘΝΙΚΗΣ ΑΝΤΙΣΤΑΣΕΩΣ 202	ΠΕΡΙΣΤΕΡΙ	12135	2160707640
ΚΑΠΕΤΑΝΑΚΗ ΠΑΝΑΓΙΩΤΑ	ΣΑΜΨΟΥΝΤΟΣ 30	ΑΧΑΡΝΑΙ	13675	2102460770
ΚΑΠΕΤΑΝΑΚΗ ΦΛΩΡΕΝΤΙΑ	ΔΙΔΥΜΩΝ 18	ΑΧΑΡΝΑΙ	13679	2102445300
ΚΑΠΕΤΑΝΑΚΗ ΕΛΕΝΗ	ΧΑΡΙΛΑΟΥ ΤΡΙΚΟΥΠΗ 29	ΓΛΥΦΑΔΑ	16675	2109637864
ΚΑΠΕΤΑΝΑΚΗ - ΜΙΛΠΑΝΗ ΜΑΡΙΑ	ΡΙΖΑΡΕΙΟΥ 15 & ΡΟΥΜΕΛΗΣ 52	ΧΑΛΑΝΔΡΙ	15233	2106844281
ΚΑΠΟΤΑ ΖΩΗ	Δ. ΣΟΛΩΜΟΥ 26-28	ΦΥΛΗ	13341	2105061090
ΚΑΡΑΒΑ ΕΛΕΝΗ	ΜΕΤΣΟΒΟΥ 20	ΓΛΥΦΑΔΑ	16674	2109642652
ΚΑΡΑΓΙΑΝΝΗ ΕΙΡΗΝΗ	ΚΟΝΙΤΣΗΣ 49	ΗΛΙΟΥΠΟΛΗ	16345	2109709966
ΚΑΡΑΓΙΑΝΝΗ ΙΑΝΘΗ- ΑΝΑΣΤΑΣΙΑ	ΑΓ. ΔΗΜΗΤΡΙΟΥ 59	ΑΓ. ΔΗΜΗΤΡΙΟΣ	17343	2109715856
ΚΑΡΑΓΙΑΝΝΗ ΕΛΕΝΗ	ΗΦΑΙΣΤΟΥ 25	ΛΗΜΝΟΣ- ΜΥΡΙΝΑ	81400	2254110166
ΚΑΡΑΓΙΑΝΝΙΔΟΥ ΘΑΛΕΙΑ	ΙΩΑΝΝΟΥ ΒΕΡΓΗ Κ ΤΡΙΦΥΛΙΑΣ 16-18	ΖΩΓΡΑΦΟΣ	15772	2107488668
ΚΑΡΑΓΙΑΝΝΟΠΟΥΛΟΥ ΑΙΚΑΤΕΡΙΝΗ	ΑΤΤΑΛΕΙΑΣ 181	ΝΙΚΑΙΑ	18453	2104971592
ΚΑΡΑΓΚΟΥΝΗ ΕΥΔΟΚΙΑ	ΤΡΙΩΝ ΙΕΡΑΡΧΩΝ 36	ΑΘΗΝΑ - ΠΕΤΡΑΛΩΝΑ	11851	2103454936
ΚΑΡΑΔΗΜΑ ΑΙΚΑΤΕΡΙΝΗ	ΚΑΡΑΟΛΗ & ΔΗΜΗΤΡΙΟΥ 7	ΑΓ. ΣΤΕΦΑΝΟΣ	14565	2108142226
ΚΑΡΑΘΑΝΑΣΗ ΑΘΗΝΑ	ΠΗΝΕΙΟΥ & ΘΕΣΣΑΛΟΝΙΚΗΣ 1	ΚΑΜΑΤΕΡΟ	13451	2102314055
ΚΑΡΑΙΣΚΑΚΗ ΓΛΥΚΕΡΙΑ	ΦΙΛΕΛΛΗΝΩΝ 9	ΚΡΥΟΝΕΡΙ	14568	2106220407
ΚΑΡΑΚΩΣΤΑ ΟΥΡΑΝΙΑ	ΗΡΑΚΛΕΟΥΣ 90-92 & ΕΠΑΜΕΙΝΩΝΔΑ	ΑΝΩ ΛΙΟΣΙΑ	13341	2114108390
ΚΑΡΑΜΗΤΣΟΥ ΔΗΜΗΤΡΑ	Γ.ΖΩΓΡΑΦΟΥ 104	ΖΩΓΡΑΦΟΣ	15772	2107486205
ΚΑΡΑΜΟΥΖΗ ΑΓΓΕΛΙΚΗ	ΙΛΙΣΣΙΩΝ 11	Ν. ΚΗΦΙΣΙΑ	14564	2106255598
ΚΑΡΑΜΠΑΣ ΑΛΕΞΗΣ	ΔΡΑΓΑΤΣΑΝΙΟΥ 24Α	ΧΑΛΑΝΔΡΙ	15233	2106849215
ΚΑΡΑΜΠΑΤΣΟΥ ΑΘΗΝΑ	ΜΕΓ. ΚΩΝΣΤΑΝΤΙΝΟΥ 29	ΝΕΟ ΗΡΑΚΛΕΙΟ	14122	2102825550
ΚΑΡΑΜΠΑΤΣΟΥ ΕΛΕΝΑ	ΑΠΟΣΤΟΛΟΥ ΠΑΥΛΟΥ 6	ΜΑΡΟΥΣΙ	15123	2102779780
ΚΑΡΑΝΤΖΟΥΝΗΣ ΙΩΑΝΝΗΣ	ΤΕΡΤΙΠΗ 31	ΑΘΗΝΑ - ΚΑΤΩ ΠΑΤΗΣΙΑ	10445	2108312909
ΚΑΡΑΠΑΝΟΣ ΝΙΚΟΛΑΟΣ	ΚΙΟΥΤΑΧΙΑΣ 15	ΒΥΡΩΝΑΣ	16231	2107648686
ΚΑΡΑΠΑΤΑΚΗ ΑΓΓΕΛΙΚΗ	Β. ΑΜΑΛΙΑΣ 29	ΑΓ. ΔΗΜΗΤΡΙΟΣ	17343	2109703273
ΚΑΡΑΠΕΤΡΙΔΗ ΚΟΡΙΝΑ ΕΙΡΗΝΗ	ΣΩΚΡΑΤΟΥΣ 18	ΒΟΥΛΑ	16673	2109658577
ΚΑΡΑΣΑΒΒΑ ΣΟΦΙΑ	ΠΑΡΝΗΘΟΣ & ΒΕΡΜΙΟΥ 19	ΚΕΡΑΤΣΙΝΙ	18758	2104326470
ΚΑΡΑΣΑΛΗ ΕΛΕΝΗ	ΡΑΒΙΝΕ 12	ΠΕΡΙΣΤΕΡΙ	12134	2105781020
ΚΑΡΑΤΖΑ ΜΑΡΙΓΙΑΝΝΑ	ΜΙΛΤΙΑΔΟΥ 52	Π. ΦΑΛΗΡΟ	17563	2109833955
ΚΑΡΔΙΟΛΑΚΑ ΒΑΣΙΛΙΚΗ	ΜΗΤΡΩΟΥ 29	ΠΕΙΡΑΙΑΣ	18537	2104182497
ΚΑΡΠΑΘΑΚΗ ΒΑΣΙΛΙΚΗ	ΠΑΝΔΙΩΝΟΣ 7	ΑΘΗΝΑ - ΑΝΩ ΠΑΤΗΣΙΑ	11143	2102529864
ΚΑΡΠΑΘΑΚΗΣ ΔΙΟΝΥΣΗΣ	ΠΑΝΔΙΩΝΟΣ 7	ΑΘΗΝΑ - ΑΝΩ ΠΑΤΗΣΙΑ	11143	2102529864
ΚΑΡΠΟΥΖΗ ΕΛΕΝΗ	ΚΡΑΤΗΤΟΣ 40	ΝΕΑ ΣΜΥΡΝΗ	17121	2109344023
ΚΑΡΥΔΗ ΓΛΥΚΕΡΙΑ	ΣΕΛΙΝΟΥΝΤΟΣ 33 & ΚΑΒΑΛΑΣ	ΝΕΑ ΙΩΝΙΑ	14231	2102723543
ΚΑΡΥΔΗ ΕΥΑΓΓΕΛΙΑ	ΞΑΝΘΟΥ 11	ΤΑΥΡΟΣ	17778	2104830047
ΚΑΣΤΑΝΗ ΑΝΑΣΤΑΣΙΑ	ΑΤΣΙΚΗ	ΛΗΜΝΟΣ	81401	2254031842
ΚΑΣΤΡΟΥΝΗΣ ΓΕΩΡΓΙΟΣ -ΑΝΤΩΝΙΟΣ	ΕΘΝ. ΑΝΤΙΣΤΑΣΕΩΝ 160	ΚΑΙΣΑΡΙΑΝΗ	16121	2107212298
ΚΑΣΩΤΑΚΗ ΕΥΑΓΓΕΛΙΑ	Π.ΙΩΑΚΕΙΜ 40	ΝΙΚΑΙΑ	18454	2104250013
ΚΑΤΕΒΑΤΗ ΕΛΕΝΗ	ΑΘΗΝΑΣ 3 & ΜΙΑΟΥΛΗ 3Α	ΝΙΚΑΙΑ	18453	2104965853
ΚΑΤΕΡΙΝΑΚΗ ΣΟΦΙΑ	ΧΕΙΜΑΡΑΣ 21	ΠΕΡΙΣΤΕΡΙ	12132	2105750069
ΚΑΤΙΝΑΚΗ ΜΑΡΙΑ	ΣΕΡΡΩΝ 4	ΒΟΥΛΑ	16673	2109657355
ΚΑΤΡΑΚΑΖΑ ΑΡΤΕΜΙΣ	ΑΡΓΟΝΑΥΤΩΝ 29	ΕΛΛΗΝΙΚΟ	16777	2109618857
ΚΑΤΡΑΚΗ ΜΑΡΙΑ	25ΗΣ ΜΑΡΤΙΟΥ 19	ΜΑΓΟΥΛΑ	19018	2105558119
ΚΑΤΡΑΚΗΣ ΙΩΑΝΝΗΣ	ΣΑΛΑΜΙΝΟΣ 8	ΜΑΝΔΡΑ	19600	2105541434
ΚΑΤΡΗΣ ΓΕΩΡΓΙΟΣ	ΑΣΚΛΗΠΙΟΥ 85	ΠΕΡΙΣΤΕΡΙ	12137	2105757834
ΚΑΤΣΑΝΤΩΝΗΣ ΣΠΥΡΙΔΩΝ	ΜΑΚΕΔΟΝΙΑΣ ΚΑΙ ΠΛΑΤΑΜΩΝΑ 21	ΑΝΩ ΛΙΟΣΙΑ	13341	2102474951
ΚΑΤΣΑΠΗ ΑΝΑΣΤΑΣΙΑ	ΛΕΩΦ. ΙΩΝΙΑΣ 94 & ΟΜΗΡΟΥ 22	ΑΛΙΜΟΣ	17456	2114074837
ΚΑΤΣΑΡΗΣ ΠΑΝΑΓΙΩΤΗΣ	ΑΝΘΕΩΝ 5	ΑΘΗΝΑ - ΑΝΩ ΠΑΤΗΣΙΑ	11143	2102520123
ΚΑΤΣΕΛΗ ΣΤΑΜΑΤΙΑ	ΒΛΑΧΕΡΝΩΝ 25	ΠΑΛΛΗΝΗ	15351	2106665891
ΚΑΤΣΙΓΙΑΝΝΗ ΑΣΗΜΙΝΑ	ΦΙΛΟΞΕΝΙΑΣ 23	ΓΛΥΚΑ ΝΕΡΑ	15354	2106049094
ΚΑΤΣΙΚΑ ΠΑΝΑΓΙΩΤΑ	ΚΙΟΥΡΚΑΤΙΩΤΟΥ 49 Κ ΔΑΜΑΣΚΟΥ 27	ΑΧΑΡΝΑΙ	13673	2111180398
ΚΑΤΣΙΜΙΧΑ ΔΗΜ. ΚΩΝΣΤΑΝΤΙΝΑ	ΜΗΛΙΑΡΑΚΗ 24-26	ΑΘΗΝΑ - ΚΑΤΩ ΠΑΤΗΣΙΑ	11145	2108323040
ΚΑΤΣΟΥΛΗΣ ΣΠΥΡΟΣ	ΙΣΜΗΝΗΣ 14 & ΚΑΛΑΒΡΥΤΩΝ 15	ΑΘΗΝΑ - ΚΟΛΩΝΟΣ	10444	2105153555
ΚΑΥΚΙΑ ΝΙΚΟΛΕΤΑ	ΒΑΣ. ΣΟΦΙΑΣ 11	ΠΑΙΑΝΙΑ	19002	2106028555
ΚΑΦΕΤΖΗ ΕΥΦΡΟΣΥΝΗ	ΒΑΛΑΩΡΙΤΟΥ 12	ΠΕΡΑΜΑ	18863	2104411551
ΚΕΣΙΣΟΓΛΟΥ ΕΡΜΙΝΑ - ΕΛΕΝΗ	ΕΥΦΟΡΙΩΝΟΣ 17	ΑΘΗΝΑ - ΠΑΓΚΡΑΤΙ	11635	2107511020
ΚΕΣΙΣΟΓΛΟΥ ΞΕΝΙΑ	ΒΑΣΙΛΕΩΣ ΓΕΩΡΓΙΟΥ Β' 3	ΧΑΛΑΝΔΡΙ	15232	2106851616
ΚΕΦΑΛΙΔΗ ΑΝΝΑ	ΠΛΩΜΑΡΙΟΥ 19	ΜΟΣΧΑΤΟ	18345	2109429654
ΚΕΧΑΓΙΑ ΕΛΙΣΑΒΕΤ	ΜΕΣΟΓΕΙΩΝ 354	ΧΟΛΑΡΓΟΣ	15341	2111131353
ΚΙΑΜΙΛΗ ΜΑΡΙΑ	ΘΕΜΙΔΟΣ 86	ΣΑΛΑΜΙΝΑ	18901	2104671214
ΚΙΝΝΙΚ ΧΡΙΣΤΙΝΑ	ΔΙΑΓΟΡΑ 13	Π. ΦΑΛΗΡΟ	17563	2109853124
ΚΙΝΝΙΚ - ΣΤΑΜΑΤΟΠΟΥΛΟΥ ΑΓΓΕΛΙΚΗ	ΑΓΙΟΥΤΑΚΗ & ΔΗΛΟΥ 1	ΑΓ. ΔΗΜΗΤΡΙΟΣ	17342	2109829389
ΚΙΟΥΣΗ ΒΑΣΙΛΙΚΗ	ΑΓ. ΝΙΚΟΛΑΟΥ 9	ΣΑΛΑΜΙΝΑ	18900	2104655238
ΚΙΤΡΙΝΟΣ ΚΩΣΤΑΣ	ΛΑΕΡΤΟΥ 30 & ΤΕΛΑΜΩΝΟΣ	ΑΘΗΝΑ - ΠΑΓΚΡΑΤΙ	11633	2107600965
ΚΛΗΜΕΝΤΖΟΥ ΕΥΦΡΟΣΥΝΗ	ΜΕΓΑΛΟΥ ΑΛΕΞΑΝΔΡΟΥ & ΣΥΡΟΥ	ΑΓ. ΑΝΑΡΓΥΡΟΙ	13561	2130454586
ΚΟΖΑΤΖΑΝΙΔΗ ΑΡΓΥΡΩ	ΣΟΦ. ΒΕΝΙΖΕΛΟΥ 14	ΠΕΡΙΣΤΕΡΙ	12131	2105755731
ΚΟΚΚΙΝΙΔΗ ΛΙΜΙΑΝΝΑ	ΠΟΣΕΙΔΩΝΟΣ 8	ΗΡΑΚΛΕΙΟ ΑΤΤΙΚΗΣ	14121	2102770241
KOKKINOΣ ΔΗΜΗΤΡΙΟΣ	ΠΛΑΤΕΙΑ ΠΑΝΟΠΟΥΛΟΥ 4	ΑΙΓΑΛΕΩ	12244	2105699779
ΚΟΚΚΙΝΟΥ ΜΑΡΙΑ	ΙΚΑΡΟΥ 22Α	ΙΛΙΟΝ	13122	2102693053
ΚΟΚΚΙΝΟΥ ΚΥΡΙΑΚΗ	ΑΓΙΑΣ ΚΥΡΙΑΚΗΣ 84	ΣΑΛΑΜΙΝΑ	18900	2100102344
ΚΟΚΩΣΗΣ ΠΑΝΑΓΙΩΤΗΣ	ΑΜΑΡΙΟΥ 1	ΠΕΡΙΣΤΕΡΙ	12135	2105742309
ΚΟΛΛΙΝΣ ΤΖΕΗΝ	ΦΡΥΝΩΝΟΣ 18	ΑΘΗΝΑ - ΑΓ. ΑΡΤΕΜΙΟΣ	11632	2107515053
ΚΟΜΝΑ ΕΛΕΝΗ	ΑΓΙΑΣ ΚΥΡΙΑΚΗΣ 84	ΣΑΛΑΜΙΝΑ	18900	2100102344
ΚΟΝΤΑΔΑ ΑΝΑΣΤΑΣΙΑ	ΕΛΕΥΘ. ΒΕΝΙΖΕΛΟΥ 31	ΠΕΙΡΑΙΑΣ - ΝΕΟ ΦΑΛΗΡΟ	18547	2104819090
ΚΟΝΤΑΞΑΚΗ ΑΝΑΣΤΑΣΙΑ	ΛΥΚΟΥΡΓΟΥ 8	ΑΧΑΡΝΑΙ	13673	2102441416
ΚΟΝΤΑΞΗ ΑΙΚΑΤΕΡΙΝΗ	ΛΑΜΠΑΚΗ 60	ΚΑΤΩ ΠΑΤΗΣΙΑ	11143	2102019846
ΚΟΝΤΑΞΗΣ ΕΛΕΥΘΕΡΙΟΣ	ΛΑΜΠΑΚΗ 60	ΚΑΤΩ ΠΑΤΗΣΙΑ	11143	2102019846`;

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
    const skippedAreas = ['ΣΑΜΟΣ', 'ΧΙΟΣ', 'ΛΗΜΝΟΣ- ΜΥΡΙΝΑ', 'ΣΑΜΟΣ – ΚΑΡΛΟΒΑΣΙ', 'Ν. ΚΑΡΛΟΒΑΣΙ', 'ΛΗΜΝΟΣ'];

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

    console.log(`Parsed ${batch.length} valid language centers in the Athens area for BATCH 4. Executing import...`);

    const newCredentials = [];

    for (let index = 0; index < batch.length; index++) {
      const inst = batch[index];
      const instituteName = `Κέντρο Ξένων Γλωσσών ${inst.ownerName}`;
      const emailName = generateSlug(inst.ownerName);
      const email = `${emailName}@tofrontistirio.gr`;
      const password = Math.random().toString(36).slice(-10) + 'S26!';

      console.log(`[${index + 1}/${batch.length}] Importing BATCH 4: ${instituteName}...`);

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

    console.log(`\n--- BATCH 4 ATHENS LANGUAGE CENTERS SUCCESSFULLY IMPORTED (${newCredentials.length} centers) ---`);

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
