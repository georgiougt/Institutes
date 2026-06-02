const { Client } = require('pg');
const { createClient } = require('@supabase/supabase-js');
const https = require('https');
require('dotenv').config();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing Supabase URL or Service Role Key in environment!");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const rawText = `ΑΒΔΕΛΑ ΒΑΣΙΛΙΚΗ	ΙΛΙΣΣΙΩΝ 11	Ν. ΚΗΦΙΣΙΑ	14564	2106255598
ΑΓΓΕΛΑΚΗΣ ΠΑΝΑΓΙΩΤΗΣ	ΓΡΗΓ. ΛΑΜΠΡΑΚΗ 10	ΓΛΥΦΑΔΑ	16674	2108941481
ΑΓΓΕΛΕΑ ΕΛΕΥΘΕΡΙΑ	Μ. ΑΝΑΤΟΛΗΣ 9	ΙΛΙΟΝ	13122	2102630694
ΑΓΓΕΛΗΣ ΠΑΝΑΓΙΩΤΗΣ	ΘΕΟΜΗΤΩΡΟΣ 26	ΑΓ. ΔΗΜΗΤΡΙΟΣ	17342	2109948109
ΑΓΓΕΛΟΠΟΥΛΟΣ ΙΩΑΝΝΗΣ	ΚΟΡΥΔΑΛΛΟΥ 17	ΑΙΓΑΛΕΩ	12244	2105622652
ΑΓΓΕΛΟΠΟΥΛΟΥ ΛΑΜΠΡΙΝΗ (ΛΩΡΑ)	ΚΟΡΥΔΑΛΛΟΥ 17	ΑΙΓΑΛΕΩ	12244	2105622652
ΑΓΓΕΛΟΠΟΥΛΟΥ ΔΗΜΗΤΡΑ	ΠΕΥΚΩΝ 128	ΗΡΑΚΛΕΙΟ ΑΤΤΙΚΗΣ	14122	2102838628
ΑΓΓΕΛΟΠΟΥΛΟΥ ΕΛΕΝΗ	Λ. ΑΜΦΙΘΕΑΣ 73Α	Π. ΦΑΛΗΡΟ	17564	2109408191
ΑΔΑΜΑΚΗ ΕΥΑΓΓΕΛΙΑ	ΔΑΜΑΓΗΤΟΥ 82 & ΒΛΑΝΤΗ 2	ΑΘΗΝΑ - ΥΜΗΤΤΟΣ	11631	2107564139
ΑΔΑΜΟΠΟΥΛΟΣ ΗΛΙΑΣ	ΦΥΛΑΣΙΩΝ 30	ΑΘΗΝΑ - ΚΑΤΩ ΠΕΤΡΑΛΩΝΑ	11854	2103478316
ΑΔΑΜΟΠΟΥΛΟΣ ΝΕΚΤΑΡΙΟΣ - ΓΕΩΡΓΙΟΣ	ΘΕΡΣΙΤΟΥ 20	ΙΛΙΟΝ	13121	2102630767
ΑΔΑΜΟΠΟΥΛΟΥ ΑΝΑΣΤΑΣΙΑ	ΣΚΥΡΟΥ 4	ΧΑΙΔΑΡΙ	12461	2105810302
ΑΘΑΝΑΣΙΑΔΗ ΣΤΥΛΙΑΝΗ	ΤΙΤΑΝΩΝ 9	ΑΘΗΝΑ - ΚΥΨΕΛΗ	11362	2108812376
ΑΘΑΝΑΣΙΑΔΟΥ ΒΙΡΓΙΝΙΑ	Ν. ΓΙΑΝΝΑ 53	ΠΕΡΙΣΣΟΣ	14233	2102795179
ΑΘΑΝΑΣΙΟΥ ΜΑΡΓΑΡΙΤΑ	ΠΛΑΤΩΝΟΣ 40	ΑΘΗΝΑ - ΚΟΛΩΝΟΣ	10441	2105238490
ΑΘΑΝΑΣΟΠΟΥΛΟΣ ΔΗΜΗΤΡΙΟΣ	ΑΪΝΣΤΑΙΝ 6	ΚΕΡΑΤΣΙΝΙ	18757	2104314921
ΑΘΑΝΑΣΟΥΛΙΑ - ΣΙΑΧΑΛΟΥ ΑΙΚΑΤΕΡΙΝΗ	ΔΕΚΕΛΕΙΑΣ 32	ΜΕΤΑΜΟΡΦΩΣΗ	14451	2102847072
ΑΘΗΝΑΙΟΥ ΕΙΡΗΝΗ	ΑΝΑΠΑΥΣΕΩΣ 3	ΜΑΡΟΥΣΙ	15126	2104614185
ΑΛΑΙΣΚΑ ΕΥΓΕΝΙΑ	Λ. ΦΑΝΕΡΩΜΕΝΗΣ 83	ΣΑΛΑΜΙΝΑ	18900	2104658608
ΑΛΑΜΑΝΟΣ ΑΡΣΕΝΙΟΣ	ΠΑΝΔΟΣΙΑΣ 17 ΚΑΙ ΙΩΑΝΝΟΥ ΦΩΚΑ 77	ΓΑΛΑΤΣΙ	11146	2102922000
ΑΛΑΜΑΝΟΣ ΜΙΧΑΗΛ	ΦΡΥΝΩΝΟΣ 18	ΑΘΗΝΑ - ΑΓ. ΑΡΤΕΜΙΟΣ	11632	2107515053
ΑΛΑΜΑΝΟΥ ΜΑΡΙΑ	ΠΑΡΝΗΘΩΣ 10	ΑΘΗΝΑ - ΚΥΨΕΛΗ	11364	2108642788
ΑΛΒΕΡΤΗ ΜΑΡΙΑ	Κ. ΠΑΛΑΜΑ 15	ΝΕΟ ΗΡΑΚΛΕΙΟ	14122	2102819389
ΑΛΕΞΑΝΔΡΗ ΚΑΛΛΙΟΠΗ	ΖΥΜΠΡΑΚΑΚΗ 74	ΑΘΗΝΑ - ΚΑΤΩ ΠΑΤΗΣΙΑ	10445	2108315525
ΑΛΕΞΑΝΔΡΟΥ ΓΕΩΡΓΙΑ	Ν. ΚΑΡΛΟΒΑΣΙ	ΣΑΜΟΣ	83200	2273033119
ΑΛΕΞΟΠΟΥΛΟΣ ΒΑΣΙΛΕΙΟΣ	ΕΛ.ΒΕΝΙΖΕΛΟΥ ΚΑΙ ΕΛΕΥΘΕΡΙΑΣ 1	ΡΑΦΗΝΑ	19009	2294075649
ΑΛΕΞΟΠΟΥΛΟΥ ΑΣΗΜΙΝΑ	ΑΛΚΙΜΟΥ 78	ΠΕΡΙΣΤΕΡΙ	12135	2105776640
ΑΛΕΞΟΠΟΥΛΟΥ ΕΥΤΥΧΙΑ	ΠΛΑΤΩΝΟΣ 146Β	ΜΟΣΧΑΤΟ	18345	2109408520
ΑΛΕΞΟΠΟΥΛΟΥ ΝΙΚΟΛΕΤΑ	ΚΟΡΑΗ 44	ΚΕΡΑΤΣΙΝΙ	18756	2104007569
ΑΛΕΞΟΠΟΥΛΟΥ ΓΕΩΡΓΙΑ	Λ.ΒΡΑΥΡΩΝΟΣ 63	ΑΡΤΕΜΙΣ	19016	
ΑΛΕΥΡΑ - ΚΑΡΑΚΙΤΣΟΥ ΚΩΝΣΤΑΝΤΙΝΑ	ΗΒΗΣ 73	ΓΛΥΦΑΔΑ	16562	2109614764
ΑΛΕΥΡΙΔΟΥ ΟΛΓΑ	ΜΕΤΑΜΟΡΦΩΣΕΩΣ 81	ΜΟΣΧΑΤΟ	18345	2109484074
ΑΛΙΤΖΙΑΔΟΥ ΕΛΕΝΗ	ΑΓ.ΒΑΡΒΑΡΑΣ ΚΑΙ ΔΗΜΟΣΘΕΝΟΥΣ	ΑΝΑΒΥΣΣΟΣ	19013	2291079307
ΑΝΑΓΝΩΣΤΑΚΟΥ ΕΛΕΝΗ	ΑΛΚΥΟΝΗΣ 76	Π. ΦΑΛΗΡΟ	17562	2109834254
ΑΝΑΣΤΑΣΙΑΔΗΣ ΧΑΡΑΛΑΜΠΟΣ	ΣΥΡΟΥ 50	ΚΟΡΥΔΑΛΛΟΣ	18122	2104973006
ΑΝΑΣΤΑΣΟΠΟΥΛΟΣ ΔΙΟΝΥΣΙΟΣ	ΚΟΡΔΕΛΙΟΥ 12	ΒΥΡΩΝΑΣ	16231	2107657214
ΑΝΔΡΕΑΔΕΛΗ ΚΑΛΛΙΟΠΗ	Γ. ΓΕΝΝΗΜΑΤΑ 42	ΩΡΩΠΟΣ	19015	2295030559
ΑΝΔΡΙΑΝΟΠΟΥΛΟΣ ΔΗΜΗΤΡΙΟΣ	ΡΑΓΚΑΒΗ 40	ΗΛΙΟΥΠΟΛΗ	16341	2109913600
ΑΝΔΡΙΚΟΠΟΥΛΟΥ ΕΛΕΝΗ	ΤΡΙΠΟΛΕΩΣ 36 & ΒΕΡΓΙΝΑΣ 75	ΑΓ. ΔΗΜΗΤΡΙΟΣ	17341	2109331127
ΑΝΔΡΟΝΙΚΟΣ ΔΗΜΗΤΡΙΟΣ	ΠΕΥΚΩΝ 22	ΠΕΡΙΣΤΕΡΙ	12137	2105771775
ΑΝΔΡΟΥΛΑΚΗ ΕΛΕΝΗ	ΘΕΣΣΑΛΙΑΣ 4	ΗΛΙΟΥΠΟΛΗ	16345	2109927292
ΑΝΔΡΩΝΗ ΣΟΦΙΑ	ΑΓ. ΑΝΑΡΓΥΡΩΝ ΝΕΝΗΤΑ	ΧΙΟΣ	82100	2271061718
ΑΝΤΩΝΙΑΔΟΥ ΑΙΚΑΤΕΡΙΝΗ	ΚΑΛΛΙΠΟΛΕΩΣ 29	ΝΙΚΑΙΑ	18454	2104903662
ΑΝΤΩΝΙΟΥ ΑΝΝΑ	ΕΜΠΟΡΙΚΟ ΚΕΝΤΡΟ ΕΡΜΗΣ	ΣΑΜΟΣ – ΚΑΡΛΟΒΑΣΙ	83200	2273034225
ΑΝΤΩΝΟΠΟΥΛΟΥ-ΔΕΛΗΓΙΩΡΓΗ ΕΛΙΣΣΑΒΕΤ	ΠΑΤΗΣΙΩΝ 236	ΑΘΗΝΑ	11256	2108654316
ΑΠΟΣΤΟΛΑΚΗ ΜΑΡΙΑ	Α.ΠΑΠΑΝΔΡΕΟΥ 12	ΑΓ. ΔΗΜΗΤΡΙΟΣ	17342	2109730002
ΑΠΟΣΤΟΛΑΚΗ ΧΡΥΣΟΥΛΑ	Α.ΠΑΠΑΝΔΡΕΟΥ 12	ΑΓ. ΔΗΜΗΤΡΙΟΣ	17342	2109730002
ΑΠΟΣΤΟΛΙΔΟΥ ΕΛΕΝΗ	ΣΜΥΡΝΗΣ 38	ΠΕΡΙΣΤΕΡΙ	12132	2105727997
ΑΠΟΣΤΟΛΟΠΟΥΛΟΣ ΠΑΝΑΓΙΩΤΗΣ	ΓΟΡΓΟΠΟΤΑΜΟΥ 2	ΖΩΓΡΑΦΟΣ	15772	2107709124
ΑΠΟΣΤΟΛΟΠΟΥΛΟΥ ΕΥΣΤΑΘΙΑ	ΑΓ.ΤΡΙΑΔΟΣ 31	ΑΓ. ΠΑΡΑΣΚΕΥΗ	15343	2106016410
ΑΠΟΣΤΟΛΟΠΟΥΛΟΥ ΚΥΡΙΑΚΗ	ΣΤΡ.ΠΑΠΟΥΛΑ 6	ΝΕΑ ΣΜΥΡΝΗ	17123	2109333105
ΑΠΟΣΤΟΛΟΠΟΥΛΟΥ ΚΥΡΙΑΚΗ	ΣΤΡ.ΠΑΠΟΥΛΑ 6	ΝΕΑ ΣΜΥΡΝΗ	17123	2109333105
ΑΡΑΜΠΑΤΖΗ ΑΝΔΡΟΝΙΚΗ	ΑΛΕΞΑΝΔΡΑΣ 22	ΚΑΜΑΤΕΡΟ	13451	2102382492
ΑΡΓΟΥΔΕΛΗΣ ΑΘΑΝΑΣΙΟΣ	ΕΒΡΟΥ 248	ΠΕΙΡΑΙΑΣ	18546	2104616275
ΑΡΓΥΡΟΠΟΥΛΟΥ ΓΕΩΡΓΙΑ	ΡΟΥΜΕΛΗΣ 27 & ΜΥΚΗΝΩΝ 15	ΧΑΛΑΝΔΡΙ	15233	2106800708
ΑΡΙΣΤΟΤΕΛΟΥΣ ΑΓΓΕΛΙΚΗ	ΠΡΙΗΝΗΣ 16 & ΚΟΥΝΤΟΥΡΙΩΤΟΥ 11	ΝΕΑ ΣΜΥΡΝΗ	17122	2109413640
ΑΡΧΑΤΖΙΚΑΚΗ ΕΙΡΗΝΗ	ΜΥΘΗΜΝΗΣ 2	ΤΑΥΡΟΣ	17778	2103458445
ΑΡΩΝΗ ΧΡΙΣΤΙΝΑ	ΠΛ. 28ΗΣ ΟΚΤΩΒΡΙΟΥ 2	ΝΕΑ ΦΙΛΑΔΕΛΦΕΙΑ	14342	2102384115
ΑΣΗΜΑΚΟΠΟΥΛΟΥ ΚΑΝΕΛΛΑ	ΚΟΥΤΣΟΝΙΚΑ 5	ΑΘΗΝΑ - ΝΕΟΣ ΚΟΣΜΟΣ	11744	2109029307
ΑΣΗΜΑΚΟΠΟΥΛΟΥ ΕΜΜΑΝΟΥΕΛΛΑ	ΣΜΥΡΝΗΣ 7 & ΦΩΚΑΙΑΣ	ΝΕΑ ΕΡΥΘΡΑΙΑ	14671	2108001997
ΑΣΛΑΝΙΔΟΥ - ΝΙΚΟΛΑΡΟΠΟΥΛΟΥ ΕΥΘΥΜΙΑ	ΠΛ. ΗΡΩΩΝ ΠΟΛΥΤΕΧΝΕΙΟΥ 75	ΧΑΙΔΑΡΙ - ΔΑΣΟΣ	12462	2105820920
ΑΣΜΑΡΓΙΑΝΝΑΚΗ ΕΙΡΗΝΗ	ΚΟΝΤΟΥΛΗ 46	ΕΛΕΥΣΙΝΑ	19200	2105544783
ΑΣΣΙΟΥΡΑ ΣΜΑΡΑΓΔΗ	ΜΕΣΟΓΕΙΩΝ 56	ΜΑΡΟΥΣΙ	15125	2108069184
ΑΣΩΝΙΤΗ ΑΝΥΣΙΑ	ΔΙΣΤΟΜΟΥ 8 & ΔΩΡΙΔΟΣ	ΥΜΗΤΤΟΣ	17237	2107610692
ΑΤΜΑΤΖΙΔΟΥ ΜΑΡΟΥΛΑ	ΑΓ. ΝΙΚΟΛΑΟΥ 93 & ΑΙΓΑΙΟΥ 35	ΚΟΡΥΔΑΛΛΟΣ	18121	2105696626
ΑΥΓΟΥΛΑ ΖΗΝΟΒΙΑ	ΚΩΝΣΤΑΝΤΙΝΟΥΠΟΛΕΩΣ 54	ΜΟΣΧΑΤΟ	18344	2104815042
ΑΥΓΟΥΣΤΑΤΟΥ ΜΑΡΙΑ	ΞΕΝΟΦΩΝΤΟΣ 158 & ΑΣΚΛΗΠΙΟΥ 20	ΚΑΛΛΙΘΕΑ	17674	2114048912
ΒΑΒΛΕΚΑ ΜΑΡΙΑ	ΠΟΛΥΤΕΚΝΩΝ 9	ΙΛΙΟΝ	13121	2105727133
ΒΑΒΟΥΛΙΔΗΣ ΓΕΩΡΓΙΟΣ	ΔΙΚΑΙΑΡΧΟΥ 7	ΑΘΗΝΑ - ΠΑΓΚΡΑΤΙ	11634	2107013244
ΒΑΖΕΝΙΟΥ ΜΑΡΘΑ	Κ. ΠΑΛΑΙΟΛΟΓΟΥ 14	ΝΕΑ ΣΜΥΡΝΗ	17121	2109350112
ΒΑΚΚΑΣ ΒΑΣΙΛΕΙΟΣ	ΔΑΣΚΑΡΟΛΗ 27	ΓΛΥΦΑΔΑ	16675	2109633054
ΒΑΚΟΦΤΣΗ ΕΛΕΝΗ	ΑΜΥΝΤΑΙΟΥ 54	ΠΕΡΙΣΤΕΡΙ	12135	2105716650
ΒΑΛΑΣΙΑΔΗ ΑΙΚΑΤΕΡΙΝΗ	ΔΕΡΒΑΝΑΚΙΩΝ 43	ΠΕΡΙΣΤΕΡΙ	12131	2105739774
ΒΑΛΑΣΙΑΔΗΣ ΑΙΜΙΛΙΟΣ	ΣΑΜΟΥ 28	ΧΑΙΔΑΡΙ	12461	2105821352
ΒΑΞΕΒΑΝΟΥ ΑΘΗΝΑ	28ΗΣ ΟΚΤΩΒΡΙΟΥ 6-8	ΠΕΤΡΟΥΠΟΛΗ	13231	2105060390
ΒΑΡΔΑΡΟΣ ΞΕΝΟΦΩΝ	ΒΑΚΤΡΙΑΝΗΣ 73	ΖΩΓΡΑΦΟΣ	15772	2107771166
ΒΑΡΔΟΝΙΚΟΛΑΚΗ ΕΛΕΥΘΕΡΙΑ	ΑΤΖΑΜΠΟΥ ΚΑΙ ΠΑΡΝΗΘΟΣ 17	ΑΝΩ ΛΙΟΣΙΑ	13341	2114072576
ΒΑΡΕΛΤΖΗ ΦΩΤΕΙΝΗ	ΘΡΑΚΗΣ 5	ΛΗΜΝΟΣ- ΜΥΡΙΝΑ	81400	2254029604
ΒΑΡΝΑΚΙΩΤΗ ΑΓΓΕΛΙΚΗ	ΜΙΚΡΑΣ ΑΣΙΑΣ 28 ΠΛΑΤΕΙΑ ΚΑΝΡΙΑ	ΚΟΡΥΔΑΛΛΟΣ	18121	2105613674
ΒΑΣΑΛΟΣ ΙΩΑΝΝΗΣ	ΑΝΔΡΙΑΝΟΥΠΟΛΕΩΣ 73	ΑΙΓΑΛΕΩ	12242	2105313110
ΒΑΣΙΛΑΚΗ ΧΡΙΣΤΙΝΑ	ΓΑΛΗΝΗΣ 34	ΖΩΓΡΑΦΟΣ	15779	2107719038
ΒΑΣΙΛΑΚΗΣ ΓΙΩΡΓΟΣ	Π. ΡΑΛΛΗ 459	ΝΙΚΑΙΑ	18450	2104913924
ΒΑΣΙΛΕΙΑΔΗ ΣΩΤΗΡΙΑ	ΛΕΩΦ. ΠΕΝΤΕΛΗΣ 10	ΧΑΛΑΝΔΡΙ	15233	2106821322
ΒΑΣΙΛΕΙΑΔΗΣ ΟΔΥΣΣΕΑΣ	ΜΕΓ. ΣΠΗΛΑΙΟΥ 8	ΑΛΙΜΟΣ	17455	2109829912
ΒΑΣΙΛΕΙΑΔΟΥ ΜΑΡΙΝΑ	ANΘΙΜΟΥ ΓΑΖΗ 13 & ΡΟΔΟΥ	ΚΕΡΑΤΣΙΝΙ	18758	2104319610
ΒΑΣΙΛΕΙΟΥ ΧΑΡΙΚΛΕΙΑ	ΚΩΝΣΤΑΝΤΙΝΟΥΠΟΛΕΩΣ 341-343	ΑΘΗΝΑ - ΚΟΛΩΝΟΣ	10444	2105158185
ΒΑΣΙΛΕΙΟΥ ΜΑΡΙΑ	ΤΡ. ΑΥΓΕΡΙΝΟΥ 12	ΠΕΡΙΣΣΟΣ	14233	2102790025
ΒΑΣΙΛΕΙΟΥ ΙΩΑΝΝΑ	ΑΡΓΟΥΣ 4	ΜΕΤΑΜΟΡΦΩΣΗ	14452	2102852819
ΒΑΣΙΛΕΙΟΥ ΒΑΣΙΛΕΙΟΣ	ΣΠΥΡΟΥ ΜΗΛΙΟΥ 34	ΑΓ. ΔΗΜΗΤΡΙΟΣ	17342	2109941305
ΒΑΣΙΛΕΙΟΥ ΚΩΝΣΤΑΝΤΙΝΑ	ΔΕΛΗΓΙΩΡΓΗ 69	ΑΛΙΜΟΣ	17456	2109941305
ΒΑΣΙΛΟΠΟΥΛΟΥ ΣΟΦΙΑ	ΜΕΓΙΣΤΗΣ 33	ΑΛΙΜΟΣ	17455	2109810122
ΒΑΣΙΛΟΠΟΥΛΟΥ ΑΙΜΙΛΙΑ	ΗΛΕΚΤΡΑΣ 52	ΚΑΛΛΙΘΕΑ	17673	2109519393
ΒΑΣΣΙΟΥ ΑΡΓΥΡΩ	ΦΑΒΝΟΥ 55	ΓΑΛΑΤΣΙ	11146	2102919580
ΒΑΦΕΙΑΔΗΣ ΝΙΚΟΛΑΟΣ	Λ. ΚΑΛΑΜΑΚΙΟΥ 104	ΑΛΙΜΟΣ	17455	2109830258
ΒΑΦΕΙΑΔΟΥ ΕΛΕΝΗ	ΛEΩΦΟΡΟΣ ΜΑΡΑΘΩΝΟΣ 89	ΝΕΑ ΜΑΚΡΗ	19005	2294091481
ΒΕΛΙΓΚΟΥ ΜΑΡΙΑ	ΠΟΛΥΤΕΚΝΩΝ 9	ΙΛΙΟΝ	13121	2105727133
ΒΕΛΛΗ ΑΙΚΑΤΕΡΙΝΗ	ΛΕΩΦ. ΠΗΓΗΣ 31	ΜΕΛΙΣΣΙΑ	15127	2106134984
ΒΕΝΑΡΔΟΥ ΖΩΗ	ΜΑΚΕΔΟΝΙΑΣ 50	ΚΟΡΥΔΑΛΛΟΣ	18121	2105616584
ΒΕΝΕΤΗ ΠΑΝΑΓΙΩΤΑ-ΝΕΚΤΑΡΙΑ	ΠΑΡΟΔΟΣ ΠΡΕΣΠΑΣ 10	ΠΕΡΙΣΣΟΣ	14233	2102790025
ΒΕΡΓΙΩΤΗ ΕΙΡΗΝΗ	ΥΨΗΛΑΝΤΟΥ 40 & ΠΡΟΠΥΛΑΙΩΝ	ΑΛΙΜΟΣ	17455	2114060572
ΒΕΡΔΕΛΗ ΕΛΕΝΗ	ΑΙΓΑΛΕΩ 52	ΠΕΙΡΑΙΑΣ	18545	2104204408`;

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

    // 1. Purge the previous temporary mock batch safely to prevent duplication
    const mockEmails = [
      'eurognosi.marousi@tofrontistirio.gr',
      'soeasy.chalandri@tofrontistirio.gr',
      'baharakis.glyfada@tofrontistirio.gr',
      'galileo.piraeus@tofrontistirio.gr',
      'kapatos.neasmyrni@tofrontistirio.gr',
      'stratigakis.peristeri@tofrontistirio.gr'
    ];
    
    console.log("Cleaning up previous testing mock data...");
    const mockUsers = await client.query('SELECT id FROM "User" WHERE email = ANY($1)', [mockEmails]);
    const mockUserIds = mockUsers.rows.map(u => u.id);
    
    if (mockUserIds.length > 0) {
      await client.query('DELETE FROM "Institute" WHERE "ownerId" = ANY($1)', [mockUserIds]);
      await client.query('DELETE FROM "User" WHERE id = ANY($1)', [mockUserIds]);
      // Attempt clean up inside Supabase Auth
      for (const email of mockEmails) {
        try {
          const { data: existingUser } = await supabase.auth.admin.listUsers();
          const authId = existingUser.users.find(u => u.email === email)?.id;
          if (authId) {
            await supabase.auth.admin.deleteUser(authId);
          }
        } catch (err) {}
      }
    }
    console.log("Cleanup completed.");

    // 2. Fetch seeded baseline data
    const cityRes = await client.query('SELECT id, name FROM "City"');
    const cities = cityRes.rows;
    
    const areaRes = await client.query('SELECT id, name, "cityId" FROM "Area"');
    const areas = areaRes.rows;

    const serviceRes = await client.query('SELECT id, name FROM "Service"');
    const services = serviceRes.rows;

    const atticaCity = cities.find(c => c.name === 'Αττική');
    if (!atticaCity) {
      console.error("Attica (Αττική) city not found in the database. Please ensure seeding was successful.");
      process.exit(1);
    }
    const targetCityId = atticaCity.id;

    // Parse raw input text lines dynamically
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

      batch.push({
        ownerName,
        address,
        areaName,
        postalCode,
        phone
      });
    }

    console.log(`Parsed ${batch.length} valid language centers in the Athens area. Executing import...`);

    const results = [];
    for (let index = 0; index < batch.length; index++) {
      const inst = batch[index];
      const instituteName = `Κέντρο Ξένων Γλωσσών ${inst.ownerName}`;
      const emailName = generateSlug(inst.ownerName);
      const email = `${emailName}@tofrontistirio.gr`;
      const password = Math.random().toString(36).slice(-10) + 'S26!';

      console.log(`[${index + 1}/${batch.length}] Importing: ${instituteName}...`);

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

      // Resolve areaId dynamically (insert Area if not already seeded under Attica)
      let areaId = null;
      const cleanAreaName = inst.areaName.replace('ΑΘΗΝΑ - ', '').trim();
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
          // Fallback if unique constraint collides on slug/name
          const existingArea = await client.query('SELECT id FROM "Area" WHERE name = $1 AND "cityId" = $2', [cleanAreaName, targetCityId]);
          areaId = existingArea.rows[0]?.id || null;
        }
      } else {
        areaId = area.id;
      }

      const slug = generateSlug(instituteName);
      
      // Dynamic geocoding mapping in Attica, Greece
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

        // Map languages services: English, German, French as requested
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

        results.push({ Name: instituteName, Email: email, Password: password, Area: cleanAreaName });
        console.log(`  SUCCESS: Created profile for ${instituteName} in ${cleanAreaName}`);
        
        // Anti rate-limiting wait throttle
        await new Promise(resolve => setTimeout(resolve, 1100));
      } catch (err) {
        console.error(`  DB Error for ${instituteName}:`, err.message);
      }
    }

    console.log('\n--- REAL ATHENS LANGUAGE CENTERS SUCCESSFULLY IMPORTED ---');
    console.table(results);
    
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
