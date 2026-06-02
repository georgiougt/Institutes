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

const rawText = `ΔΑΣΚΑΛΟΠΟΥΛΟΥ ΚΩΝΣΤΑΝΤΙΝΑ	ΒΟΣΠΟΡΟΥ 154	ΝΙΚΑΙΑ	18453	2104958750
ΔΑΥΪΔΟΠΟΥΛΟΥ ΧΡΙΣΤΙΝΑ	ΕΛ. ΒΕΝΙΖΕΛΟΥ 52	ΔΡΑΠΕΤΣΩΝΑ	18648	2104617571
ΔΕΔΕ ΜΑΡΙΑ	28ης ΟΚΤΩΒΡΙΟΥ 2	ΒΥΡΩΝΑΣ	16233	2107568585
ΔΕΔΕ ΕΛΕΝΗ	ΛΕΩΦ. ΑΜΦΙΑΡΙΟΥ	ΚΑΛΑΜΟΣ	19017	2295062600
ΔΕΛΗ ΑΓΓΕΛΙΚΗ	ΣΙΦΝΟΥ 7	ΑΘΗΝΑ	11254	2117055124
ΔΕΛΗΜΙΧΑΛΗ ΜΑΡΙΑ	Γ. ΛΟΥΚΑ 38	ΣΑΛΑΜΙΝΑ	18900	2104656130
ΔΕΛΗΜΙΧΑΛΗ ΕΥΑΓΓΕΛΙΑ	Γ. ΛΟΥΚΑ 38	ΣΑΛΑΜΙΝΑ	18900	2104656130
ΔΕΛΗΜΙΧΑΛΗ ΑΓΛΑΪΑ (ΛΙΑ)	Γ. ΛΟΥΚΑ 38	ΣΑΛΑΜΙΝΑ	18900	2104656130
ΔΕΜΠΕΛΑ ΑΙΚΑΤΕΡΙΝΗ	ΑΠΟΛΛΩΝΟΣ 13	ΜΑΝΔΡΑ	19600	2105550191
ΔΕΡΖΙΩΤΗΣ ΑΛΕΞΑΝΔΡΟΣ ΙΚΕ	ΑΡΙΣΤΟΤΕΛΟΥΣ 27	ΔΡΑΠΕΤΣΩΝΑ	18648	2104617175
ΔΕΡΚΕΒΟΡΚΙΑΝ ΣΙΡΑΝ	7ΗΣ ΜΑΡΤΙΟΥ & ΜΥΛΑΣΣΩΝ 1	ΝΙΚΑΙΑ	18450	2104914050
ΔΕΡΜΕΤΖΟΠΟΥΛΟΥ-ΜΠΕΛΛΟΥ ΜΑΡΙΑ	ΜΕΝΕΛΑΟΥ 205	ΑΓ. ΔΗΜΗΤΡΙΟΣ	17342	2114034637
ΔΗΜΗΤΡΙΑΔΗΣ ΣΠΥΡΙΔΩΝ	ΜΑΡΚΟΥ ΜΠΟΤΣΑΡΗ 47	ΑΙΓΑΛΕΩ	12241	6976559312
ΔΗΜΗΤΡΙΑΔΗΣ ΠΑΝΑΓΙΩΤΗΣ	ΤΡΙΠΟΛΕΩΣ 48	ΑΓ. ΑΝΑΡΓΥΡΟΙ	13561	2102627972
ΔΗΜΗΤΡΙΑΔΗΣ ΛΕΑΝΔΡΟΣ	Λ.ΔΙΟΝΥΣΟΥ & ΑΓΑΠΗΣ	ΝΕΑ ΜΑΚΡΗ	19005	2294097119
ΔΗΜΗΤΡΙΟΥ ΜΙΝΑ	ΕΥΡΙΠΙΔΟΥ 3 & ΣΟΛΩΜΟΥ 58	ΠΕΡΙΣΤΕΡΙ	12133	2105735683
ΔΗΜΗΤΡΙΟΥ ΕΛΕΝΗ	ΠΛΑΤΩΝΟΣ 20	ΣΠΑΤΑ	19004	2106635022
ΔΗΜΟΥ ΕΛΕΝΗ	Ηρώων Πολυτεχνείου 7-9	ΠΕΙΡΑΙΑΣ	18532	2104935885
ΔΙΑΒΑΤΗ ΜΑΡΙΑ	ΒΑΣΙΛΕΩΣ ΚΩΝ/ΝΟΥ 259	ΚΟΡΩΠΙ	19400	2106623165
ΔΙΑΚΑΤΟΥ ΠΕΡΣΕΦΟΝΗ	ΚΑΡΔΙΤΣΗΣ 5	ΠΕΙΡΑΙΑΣ	18542	2104203818
ΔΙΑΚΟΔΗΜΗΤΡΙΟΥ ΔΗΜΗΤΡΙΟΣ	ΠΟΛΥΔΕΥΚΟΥΣ 41 & Α.ΠΑΠΑΝΔΡΕΟΥ 180	ΙΛΙΟΝ	13122	2102620299
ΔΙΑΚΟΣΤΑΜΑΤΗΣ ΙΩΑΝΝΗΣ	ΓΟΡΓΥΡΑΣ	ΣΑΜΟΣ	83200	2273033388
ΔΙΑΜΑΝΤΙΔΟΥ ΑΡΙΑΔΝΗ	ΚΑΝΑΡΗ 11	ΣΑΜΟΣ	83100	2273024352
ΔΙΑΜΑΝΤΟΠΟΥΛΟΥ ΒΑΣΙΛΙΚΗ	ΕΛ.ΒΕΝΙΖΕΛΟΥ 93	ΝΕΑ ΣΜΥΡΝΗ	17123	2109342210
ΔΙΑΜΑΝΤΟΠΟΥΛΟΥ ΣΤΑΥΡΟΥΛΑ	ΜΚΕ ΠΑΠΑΔΟΠΟΥΛΟΥ 21 ΚΑΙ ΔΗΜΟΣΘΕΝΗ ΝΙΟΥ 2	ΝΕΑ ΠΕΡΑΜΟΣ	19006	2296043783
ΔΟΛΙΑΝΙΤΗΣ ΘΕΟΧΑΡΗΣ	ΑΔΑΜ 5 ΠΑΡΟΔΟΣ ΥΔΡΑΣ	ΜΑΓΟΥΛΑ	19018	2105556928
ΔΟΥΒΛΑΡΗ ΠΑΝΑΓΙΩΤΑ	Β.ΛΑΣΚΟΥ 50	ΕΛΕΥΣΙΝΑ	19200	29624738
ΔΟΥΓΕΚΟΥ-ΜΠΑΜΠΙΝΙΩΤΟΥ ΕΛΕΝΗ	ΚΟΛΟΚΟΤΡΩΝΗ 64	ΠΕΥΚΗ	15121	2108028357
ΔΟΥΝΑΒΗ ΛΑΜΠΡΙΝΗ	ΛΥΚΟΥΡΓΟΥ 219	ΚΑΛΛΙΘΕΑ	17675	2109579954
ΔΟΥΡΑΛΑ ΑΘΑΝΑΣΙΑ	ΜΕΣΟΛΟΓΓΙΟΥ 2	ΑΛΙΜΟΣ	17456	2109940905
ΔΟΥΡΟΥ ΚΟΚΚΩΝΗ ΕΛΕΝΗ	ΒΟΡΕΙΟΥ ΗΠΕΙΡΟΥ & ΚΡΙΜΑΙΑΣ 46	ΓΛΥΦΑΔΑ	16562	2109629479
ΔΡΑΚΟΥ ΕΙΡΗΝΗ	ΣΟΥΛΙΟΥ 38 & ΧΙΟΥ	ΑΙΓΑΛΕΩ	12243	2105901949
ΔΡΑΚΟΥΛΑΚΟΥ ΑΝΝΑ	ΑΝΤΙΠΛΟΙΑΡΧΟΥ ΠΑΝΑΓΙΩΤΗ ΒΛΑΧΑΚΟΥ 68 & ΦΩΤΙΟΥ ΚΟΡΥΤΣΑΣ	ΠΕΙΡΑΙΑΣ	18544	2130325711
ΔΡΑΜΙΣΙΩΤΗ ΣΤΕΙΣΗ	ΠΕΥΚΩΝ 64	ΠΕΡΙΣΤΕΡΙ	12137	2105016029
ΔΡΙΖΗ ΧΡΙΣΤΙΝΑ	ΣΩΚΡΑΤΟΥΣ 7	ΑΝΑΒΥΣΣΟΣ	19013	2291040220
ΔΡΙΤΣΑ ΑΡΤΕΜΙΣ	ΧΕΛΙΔΟΝΟΥΣ 27	Ν. ΚΗΦΙΣΙΑ	14561	2108000932
ΔΡΟΥΖΑ ΧΡΙΣΤΙΝΑ-ΜΑΡΙΑ-ΕΙΡΗΝΗ	ΚΑΛΛΕΡΓΗ 22	Ν. ΦΑΛΗΡΟ	18547	2104831971
ΔΡΟΥΚΑΣ ΛΑΜΠΡΟΣ	ΕΥΡΙΠΙΔΟΥ 13Α & ΘΕΜΙΔΟΣ 155	ΣΑΛΑΜΙΝΑ	18900	2104640853
ΕΛΕΥΘΕΡΑΚΗΣ ΑΘΑΝΑΣΙΟΣ	ΚΟΜΝΗΝΩΝ 24	ΚΕΡΑΤΣΙΝΙ	18755	2104326298
ΕΞΑΡΧΟΥ ΑΡΓΥΡΩ	ΜΗΤΡΟΜΑΡΑ 83	ΑΧΑΡΝΑΙ	13671	2102409740
ΕΣΛΙΝΓΚΕΡ ΑΛΕΞΑΝΔΡΟΣ - ΣΩΤΗΡΙΟΣ	ΣΟΦ. ΒΕΝΙΖΕΛΟΥ 14	ΛΥΚΟΒΡΥΣΗ	14123	
ΕΥΑΓΓΕΛΙΔΗΣ ΑΝΤΩΝΙΟΣ	ΣΜΥΡΝΗΣ 27	ΥΜΗΤΤΟΣ	17237	2107622418
ΕΥΑΓΓΕΛΙΔΟΥ ΜΑΡΙΑ ΑΡΙΣΤΕΑ	ΧΑΤΖΗΚΩΝΣΤΑΝΤΗ 41	ΑΘΗΝΑ	11524	2106917522
ΕΥΑΓΓΕΛΙΔΟΥ ΑΓΓΕΛΙΚΗ	ΤΡΩΩΝ 76-78	ΑΘΗΝΑ - ΑΝΩ ΠΕΤΡΑΛΩΝΑ	11852	2103455383
ΕΥΑΓΓΕΛΙΟΥ ΣΤΕΛΛΑ	ΓΡ. ΛΑΜΠΡΑΚΗ 8	ΤΑΥΡΟΣ	17778	2103465258
ΕΥΣΤΑΘΙΟΥ ΕΥΓΕΝΙΑ	ΑΙΟΛΟΥ 25	Π. ΦΑΛΗΡΟ	17561	2109838829
ΖΑΖΑΝΗ ΝΤΑΝΙΕΛ	ΗΛΕΚΤΡΟΥΠΟΛΕΩΣ 18	ΑΡΓΥΡΟΥΠΟΛΗ	16452	2109956500
ΖΑΡΓΙΑΝΝΑΚΗΣ ΓΕΩΡΓΙΟΣ	17ΗΣ ΝΟΕΜΒΡΙΟΥ 12	ΜΕΛΙΣΣΙΑ	15127	2106136710
ΖΑΡΚΑΔΑ ΑΘΑΝΑΣΙΑ	ΠΑΠΑΝΙΚΟΛΗ 43	ΠΕΙΡΑΙΑΣ - ΧΑΤΖΗΚΥΡΙΑΚΕΙΟ	18538	2104183140
ΖΑΡΚΑΔΟΥΛΑ ΒΑΣΙΛΙΚΗ	ΧΑΡΙΛΑΟΥ ΤΡΙΚΟΥΠΗ 29	ΓΛΥΦΑΔΑ	16675	2109637864
ΖΑΡΜΠΟΝΗ ΣΤΡΑΤΟΝΙΚΗ	ΑΓ. ΠΑΝΤΕΛΕΗΜΟΝΟΣ 79&ΑΝΑΠΑΥΣΕΩΣ	ΚΕΡΑΤΣΙΝΙ	18755	2104318788
ΖΑΧΑΡΙΟΥ ΕΙΡΗΝΗ	ΣΕΡΦΙΩΤΟΥ 74	ΠΕΙΡΑΙΑΣ - ΚΑΛΛΙΠΟΛΗ	18539	2104186700
ΖΑΧΑΡΟΠΟΥΛΟΥ ΚΛΕΟΠΑΤΡΑ	ΚΙΣΣΑΒΟΥ 18Α & ΔΙΡΦΗΣ	ΒΡΙΛΗΣΣΙΑ	15235	2108031717
ΖΑΧΑΡΟΠΟΥΛΟΥ ΕΙΡΗΝΗ	Τ.ΠΕΡΤΣΕΜΛΗ 51	ΒΥΡΩΝΑΣ	16231	2107601307
ΖΑΧΟΠΟΥΛΟΣ ΣΩΤΗΡΙΟΣ	ΕΥΦΡΟΝΙΟΥ 19	ΑΘΗΝΑ - ΠΑΓΚΡΑΤΙ	11634	2107244244
ΖΑΧΟΥ ΕΥΑΓΓΕΛΙΑ	ΛΥΚΟΣΟΥΡΑΣ 1Γ	ΠΕΡΙΣΤΕΡΙ	12136	2105773339
ZEΥΓΙΤΟΥ ΚΩΝΣΤΑΝΤΙΝΑ	ΛΕΩΦΟΡΟΣ ΕΙΡΗΝΗΣ 26	ΗΛΙΟΥΠΟΛΗ	16345	2130881220
ΖΗΚΟΠΟΥΛΟΣ ΓΕΩΡΓΙΟΣ	ΘΩΡΙΚΙΩΝ 21 & ΜΥΡΜHΔΟΝΩΝ (ΑΠΟ ΤΡΙΩΝ ΙΕΡΑΡΧΩΝ 34)	ΑΘΗΝΑ - ΠΕΤΡΑΛΩΝΑ	11851	2103413764
ΖΗΝΟΒΗΣ ΒΑΣΙΛΕΙΟΣ	ΤΡΟΙΑΣ 4	ΑΓ. ΔΗΜΗΤΡΙΟΣ	17343	2109763602
ΖΗΣΗ ΚΩΝΣΤΑΝΤΙΝΑ	ΚΑΡΥΑΤΙΔΟΣ 15	ΠΕΡΙΣΤΕΡΙ	12135	2105767333
ΖΙΑΝΙΚΑ ΠΑΡΑΣΚΕΥΗ	ΑΓΛΑΟΝΙΚΗΣ 9	ΑΘΗΝΑ - ΝΕΟΣ ΚΟΣΜΟΣ	11743	2109234239
ΖΙΟΓΚΑ ΕΛΕΝΗ	17ης ΝΟΕΜΒΡΙΟΥ 73	ΧΟΛΑΡΓΟΣ	15562	2106531943
ΖΟΓΚΑ - ΛΙΑΤΣΟΥ ΣΩΤΗΡΙΑ	ΠΡΕΜΕΤΗΣ 8	ΠΕΙΡΑΙΑΣ	18542	2104930585
ΖΟΥΜΠΟΥΛΑΚΗΣ ΙΩΑΝΝΗΣ	ΣΩΚΡΑΤΟΥΣ 12	ΑΝΩ ΛΙΟΣΙΑ	13341	2102470884
ΖΟΥΡΟΥ ΑΝΑΣΤΑΣΙΑ	ΚΑΛΛΙΘΕΑΣ 33	ΑΓ.ΔΗΜΗΤΡΙΟΣ	17343	2114041857
ΖΩΓΟΠΟΥΛΟΥ ΚΩΝΣΤΑΝΤΙΝΑ	ΛΟΝΤΟΥ 8	ΑΘΗΝΑ - ΕΞΑΡΧΕΙΑ	10681	2103803193
ΖΩΓΡΑΦΟΥ ΣΤΥΛΙΑΝΗ	ΠΙΝΔΑΡΟΥ 3	ΝΕΑ ΠΑΛΑΤΙΑ	19015	2295039776
ΖΩΝΤΑΝΟΥ ΑΝΑΣΤΑΣΙΑ	Π. ΜΙΚΡΟΠΟΥΛΟΥ 32	ΝΕΟ ΗΡΑΚΛΕΙΟ	14121	2102752986
ΖΩΡΑΠΑ ΣΤΕΛΛΑ	Κ. ΠΑΛΑΜΑ 127Α	ΝΙΚΑΙΑ	18452	2104972329
ΗΛΙΑ ΕΛΕΝΗ	ΣΟΥΛΙΟΥ 171	ΠΕΤΡΟΥΠΟΛΗ	13231	2105060780
ΗΛΙΟΠΟΥΛΟΥ ΣΟΦΙΑ	ΑΡΙΣΤΟΓΕΙΤΟΝΟΣ & ΑΓ.ΚΩΝ/ΝΟΥ 1	ΑΦΙΔΝΑΙ	19014	2295023570
ΘΑΛΑΣΣΕΛΗ ΜΑΙΡΗ	17ΗΣ ΝΟΕΜΒΡΙΟΥ 2	ΜΕΛΙΣΣΙΑ	15127	2108048192
ΘΕΜΕΛΗ ΕΛΕΝΗ	ΑΓΝΑΝΤΩΝ 1 & ΘΗΒΩΝ	ΙΛΙΟΝ	13123	2102693172
ΘΕΟΔΩΡΑΚΗ ΣΤΑΥΡΟΥΛΑ	ΚΑΡΔΑΜΥΛΑ	ΧΙΟΣ	82300	2272022709
ΘΕΟΔΩΡΑΚΟΠΟΥΛΟΣ ΚΩΝ/ΝΟΣ	ΑΓ. ΚΩΝΣΤΑΝΤΙΝΟΥ 40	ΜΑΡΟΥΣΙ	15124	2111846633
ΘΕΟΔΩΡΙΔΟΥ ΠΑΝΑΓΙΩΤΑ	ΕΛ. ΒΕΝΙΖΕΛΟΥ 157-159 & ΜΑΔΥΤΟΥ 1	ΚΕΡΑΤΣΙΝΙ	18755	2104618678
ΘΕΟΔΩΡΟΠΟΥΛΟΥ ΔΗΜΗΤΡΑ	ΑΡΙΣΤΟΤΕΛΟΥΣ 27Α	ΧΟΛΑΡΓΟΣ	15562	2106548929
ΘΕΟΔΩΡΟΠΟΥΛΟΥ - ΑΧΙΛΛΕΩΣ ΕΥΑΓΓΕΛΙΑ	ΛΕΩΦ.ΜΑΡΑΘΩΝΟΣ & ΚΥΠΡΟΥ 5	ΑΓΙΟΣ ΣΤΕΦΑΝΟΣ	14565	2108140165
ΘΕΟΦΙΛΑΚΗ ΔΙΟΝΥΣΙΑ	ΑΘΑΝΑΤΩΝ 1 & ΚΩΝΣΤΑΝΤΙΝΟΥΠΟΛΕΩΣ	ΑΧΑΡΝΑΙ	13671	2102386979
ΘΕΟΧΑΡΗ ΕΥΣΤΑΘΙΑ	ΓΛΑΥΚΩΝΟΣ 19	ΑΘΗΝΑ - ΑΓ. ΑΡΤΕΜΙΟΣ	11632	2107514235
ΘΕΟΧΑΡΗ ΑΓΓΕΛΙΚΗ	ΓΛΑΥΚΩΝΟΣ 19	ΑΘΗΝΑ - ΑΓ. ΑΡΤΕΜΙΟΣ	11632	2107514235
ΘΕΟΧΑΡΗΣ ΕΥΑΓΓΕΛΟΣ	ΑΓΙΑΣ ΛΑΥΡΑΣ 24	ΗΡΑΚΛΕΙΟ ΑΤΤΙΚΗΣ	14121	2102846158
ΘΩΜΑΔΑΚΗ ΒΑΣΙΛΕΙΑ	ΤΑΤΑΟΥΛΩΝ 11	ΒΥΡΩΝΑΣ	16232	2107608878
ΘΩΜΟΠΟΥΛΟΥ AΝΤΙΓΟΝΗ	ΙΑΛΕΜΟΥ 30	ΑΘΗΝΑ - ΑΝΩ ΠΑΤΗΣΙΑ	11142	2121043926
ΙΓΓΛΕΖΑΚΗ ΕΥΑΓΓΕΛΙΑ	ΘΕΟΤΟΚΟΠΟΥΛΟΥ 54	ΜΕΤΑΜΟΡΦΩΣΗ	14452	2102810215
ΙΜΠΛΙΚΙΑΝ ΛΑΖΑΡΟΣ	ΘΕΜΙΣΤΟΚΛΕΟΥΣ 18	ΧΑΙΔΑΡΙ	12461	2105813774
ΙΣΑΡΗ ΖΩΗ	Λ. ΠΕΝΤΕΛΗΣ 54	ΧΑΛΑΝΔΡΙ	15234	2117506314
ΙΩΑΚΕΙΜΙΔΗΣ ΚΩΝΣΤΑΝΤΙΝΟΣ	ΠΕΥΚΩΝ 25	ΝΕΟ ΗΡΑΚΛΕΙΟ	14122	2102816200
ΚΑΒΑΛΙΕΡΑΤΟΥ ΒΑΣΙΛΙΚΗ	ΠΑΜΒΩΤΙΔΟΣ 43	ΓΛΥΦΑΔΑ	16562	2109610851
ΚΑΘΑΡΟΣ ΣΤΥΛΙΑΝΟΣ	ΛΕΩΦ.ΣΑΛΑΜΙΝΑΣ 141Α	ΣΑΛΑΜΙΝΑ	18900	2104640855
ΚΑΚΑΓΙΑΝΝΗ ΣΜΑΡΑΓΔΑ	ΨΑΡΩΝ 71 & ΝΙΚΗΤΑΡΑ	ΧΑΛΑΝΔΡΙ	15232	2111162181
ΚΑΛΑΒΡΟΥΖΙΩΤΗ ΚΑΤΕΡΙΝΑ	ΠΑΡΟΥ 26	ΑΓ. ΔΗΜΗΤΡΙΟΣ	17342	2109969792
ΚΑΛΑΙΤΖΑΚΗ ΕΛΕΝΗ	ΠΩΓΩΝΑΤΟΥ 6	ΙΛΙΟΝ	13121	2102625803
ΚΑΛΑΙΤΖΗ ΑΔΑΜΑΝΤΙΑ	ΧΡ. ΠΕΡΡΑ 3	ΕΛΕΥΣΙΝΑ	19200	2105541185
ΚΑΛΑΝΔΡΑΝΗ ΕΛΕΝΗ	ΠΥΘΕΙΑΣ 3	ΑΘΗΝΑ - ΚΥΨΕΛΗ	11364	2108653384
ΚΑΛΑΠΟΤΛΗ ΒΑΣΙΛΙΚΗ	ΚΑΖΑΝΤΖΑΚΗ 13	ΝΕΟ ΗΡΑΚΛΕΙΟ	14121	2102777702
ΚΑΛΑΤΖΟΓΛΟΥ ΙΩΑΝΝΑ	ΔΗΜΗΤΡΑΚΟΠΟΥΛΟΥ 8	ΚΟΡΥΔΑΛΛΟΣ	18120	2104945795
ΚΑΛΙΤΣΗ ΑΘΗΝΑ	ΠΕΡΡΑΙΒΟΥ 25	ΚΕΡΑΤΣΙΝΙ	18757	2104328740
ΚΑΛΛΕΡΓΗ ΕΥΤΥΧΙΑ	ΠΡΟΦΗΤΗ ΗΛΙΑ 14 & ΣΑΧΤΟΥΡΗ	ΝΕΑ ΣΜΥΡΝΗ	17124	2109765058
ΚΑΛΟΒΡΕΝΤΗ ΑΛΕΞΙΑ	ΑΓΙΩΝ ΑΝΑΡΓΥΡΩΝ 28	ΜΑΡΟΥΣΙ	15124	2108065622`;

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

    console.log(`Parsed ${batch.length} valid language centers in the Athens area for BATCH 3. Executing import...`);

    const newCredentials = [];

    for (let index = 0; index < batch.length; index++) {
      const inst = batch[index];
      const instituteName = `Κέντρο Ξένων Γλωσσών ${inst.ownerName}`;
      const emailName = generateSlug(inst.ownerName);
      const email = `${emailName}@tofrontistirio.gr`;
      const password = Math.random().toString(36).slice(-10) + 'S26!';

      console.log(`[${index + 1}/${batch.length}] Importing BATCH 3: ${instituteName}...`);

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

    console.log(`\n--- BATCH 3 ATHENS LANGUAGE CENTERS SUCCESSFULLY IMPORTED (${newCredentials.length} centers) ---`);

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
