const { Client } = require('pg');
const { createClient } = require('@supabase/supabase-js');
const https = require('https');
require('dotenv').config();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Use the service role key provided by the user
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlod3pvb3pxZWNpdW1udWluaG9lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzY2OTkxMCwiZXhwIjoyMDg5MjQ1OTEwfQ.9rdNxkgjNf3HA2W3v1fYtsQkLNPpEzKi1IFqFn6dTYc';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

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
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    const cityRes = await client.query('SELECT id, name FROM "City"');
    const cities = cityRes.rows;
    const serviceRes = await client.query('SELECT id, name FROM "Service"');
    const services = serviceRes.rows;

    const batch = [
      { name: "STUDIO8CTD", email: "info@studio8.com.cy", phone: "70001788", address: "Αρχιεπισκόπου Μακαρίου Γ' 100, Μέσα Γειτονιά", city: "Λεμεσός", subjects: ["Τέχνη", "IGCSE"] },
      { name: "THALIA'S PRIVATE INSTITUTE OF MATHEMATICS", email: "thalialambrou@gmail.com", phone: "70006064", address: "Λεωφόρος Κωνσταντίνου και Ευριπίδη 18Β, Τραχώνι", city: "Λεμεσός", subjects: ["Μαθηματικά"] },
      { name: "THE HERITAGE PRIVATE INSTITUTE", email: "administration@heritageschool.ac.cy", phone: "25367018", address: "Παλώδια", city: "Λεμεσός", subjects: ["Μελετητήριο", "IGCSE"] },
      { name: "THE ICARUS PRIVATE INSTITUTE LIMITED", email: "info@icarus.cy", phone: "25334033", address: "Αποστόλων Πέτρου και Παύλου 7", city: "Λεμεσός", subjects: ["Βιολογία", "Φυσική", "Αγγλικά", "Μαθηματικά", "Φιλολογικά", "Χημεία"] },
      { name: "THE LANGUAGE FACTORY ROULA LOIZOU PRIVATE INSTITUTE", email: "info@tlf.com.cy", phone: "25107011", address: "Γεσθημανής 2A, Άγιος Αθανάσιος", city: "Λεμεσός", subjects: ["Αγγλικά"] },
      { name: "THE MATHEMATICAL REFLECTIONS", email: "mathrefl-andreas@hotmail.com", phone: "25386986", address: "Μάριου Αγαθαγγέλου 17", city: "Λεμεσός", subjects: ["Μαθηματικά", "Στατιστική"] },
      { name: "THENET COMPUTER EDUCATION CENTER", email: "info@thenet.com.cy", phone: "77778384", address: "Βασιλέως Παύλου 53", city: "Λεμεσός", subjects: ["Αγγλικά", "Μελετητήριο", "Μαθηματικά", "Φιλολογικά", "Πληροφορική"] },
      { name: "THENET EDUCATION CENTER (ΠΑΡΑΡΤΗΜΑ)", email: "info@thenet-branch.com.cy", phone: "25877988", address: "Μάρτη Λούθερ Κινγκ 5, Άγιος Σπυρίδωνας", city: "Λεμεσός", subjects: ["Αγγλικά", "Μελετητήριο", "Μαθηματικά", "Φιλολογικά", "Πληροφορική"] },
      { name: "THE WISDOM LAB", email: "antria_mich@hotmail.com", phone: "96573918", address: "Δημητσάνης 5, Κάτω Πολεμίδια", city: "Λεμεσός", subjects: ["Μελετητήριο", "Αγγλικά"] },
      { name: "THINK ENGLISH KATERINA KOURTELLOY AGATHOCLEOUS", email: "think.english@cytanet.com.cy", phone: "93409622", address: "Παναγή Λάππα 29", city: "Λεμεσός", subjects: ["Αγγλικά"] },
      { name: "TOTALCY EDUCATION", email: "info@totalcy.com", phone: "25103848", address: "Ιωάννη Πολέμη 26, Κάψαλος", city: "Λεμεσός", subjects: ["Τούρκικα", "Μαθηματικά", "Ελληνικά", "Αρχαία Ελληνικά", "Ιστορία", "Autocad", "Photoshop", "Αγγλικά", "Πληροφορική"] },
      { name: "TRIADA EDUCATIONAL HUB", email: "info@triada.com.cy", phone: "25000000", address: "Σπύρου Κυπριανού 104", city: "Λεμεσός", subjects: ["Πληροφορική", "Μαθηματικά", "Αγγλικά", "Ελληνικά", "Ρωσικά"] },
      { name: "TUTORS PANARETOS LIMITED", email: "kpanaretos@tutors.ac.cy", phone: "25736661", address: "Βασιλέως Κωνσταντίνου Ι, 62", city: "Λεμεσός", subjects: ["Αγγλικά", "Φιλολογικά", "Φυσική", "Πληροφορική", "Μαθηματικά", "Λογιστική"] },
      { name: "U - LEARN LIMITED", email: "info@ulearn.com.cy", phone: "25387362", address: "Αιγύπτου 21, Κάψαλος", city: "Λεμεσός", subjects: ["Αγγλικά", "Πληροφορική"] },
      { name: "ULYSSES", email: "karapenelopi@gmail.com", phone: "99586691", address: "49ος Δρόμος Αρ. 55, Κάτω Πολεμίδια", city: "Λεμεσός", subjects: ["Αγγλικά"] },
      { name: "UP WITH ENGLISH", email: "up-with-english@hotmail.com", phone: "96514289", address: "Κωστή Παλαμά 139, Μέσα Γειτονιά", city: "Λεμεσός", subjects: ["Αγγλικά"] },
      { name: "V & D TIME FOR ENGLISH", email: "info@vdtime.com.cy", phone: "25000001", address: "Παναγίας Ευαγγελίστριας 21", city: "Λεμεσός", subjects: ["Αγγλικά"] },
      { name: "WE LOVE ENGLISH", email: "tesol_cy@yahoo.gr", phone: "99586086", address: "Μύριδος 12, Κάτω Πολεμίδια", city: "Λεμεσός", subjects: ["Μελετητήριο", "Μαθηματικά", "Φιλολογικά", "Αγγλικά"] },
      { name: "ΧΕΚΥ", email: "info@xeky.com.cy", phone: "25754575", address: "Γρηγορίου Αυξεντίου 3, Χαλκούτσα", city: "Λεμεσός", subjects: ["Αγγλικά"] },
      { name: "Y.K THE ENGLISH LEARNING CENTER PRIVATE INSTITUTE LIMITED", email: "info@ykenglish.com.cy", phone: "25387674", address: "Βασιλέως Κωνσταντίνου 138", city: "Λεμεσός", subjects: ["Αγγλικά"] }
    ];

    const results = [];
    for (const inst of batch) {
      console.log(`Processing: ${inst.name}...`);
      const password = Math.random().toString(36).slice(-10) + 'S22!';
      
      // Try to create auth user
      let uid;
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: inst.email,
        password: password,
        email_confirm: true
      });
      
      if (authError) {
        if (authError.message.includes('already registered')) {
            console.log(`  User ${inst.email} already exists in Auth, trying to get UID...`);
            const { data: existingUser } = await supabase.auth.admin.listUsers();
            uid = existingUser.users.find(u => u.email === inst.email)?.id;
        } else {
            console.error(`  Auth Error for ${inst.name}:`, authError.message);
            continue;
        }
      } else {
        uid = authUser.user.id;
      }

      if (!uid) {
          console.error(`  Could not obtain UID for ${inst.name}`);
          continue;
      }

      // Sync with DB
      await client.query(`
        INSERT INTO "User" (id, email, role, "onboardingStep", "createdAt", "updatedAt")
        VALUES ($1, $2, 'OWNER', 3, NOW(), NOW())
        ON CONFLICT (email) DO UPDATE SET id = EXCLUDED.id, role = 'OWNER'
      `, [uid, inst.email]);

      const slug = generateSlug(inst.name);
      const fullAddress = `${inst.address}, ${inst.city}, Cyprus`;
      let coords = await geocode(fullAddress);
      if (!coords) {
          coords = await geocode(`${inst.address.split(',')[0]}, ${inst.city}, Cyprus`);
      }

      try {
        const instInsert = await client.query(`
          INSERT INTO "Institute" (id, "ownerId", name, slug, status, "isVerified", "createdAt", "updatedAt")
          VALUES (gen_random_uuid(), $1, $2, $3, 'APPROVED', false, NOW(), NOW())
          RETURNING id
        `, [uid, inst.name, slug]);
        
        const instituteId = instInsert.rows[0].id;
        const cityId = cities.find(c => c.name === inst.city)?.id;
        await client.query(`
          INSERT INTO "Branch" (id, "instituteId", name, address, "cityId", phone, latitude, longitude, "isMain", status, "createdAt", "updatedAt")
          VALUES (gen_random_uuid(), $1, 'Main', $2, $3, $4, $5, $6, true, 'APPROVED', NOW(), NOW())
        `, [instituteId, inst.address, cityId, inst.phone || '', coords?.lat || null, coords?.lng || null]);

        for (const subjectName of inst.subjects) {
          const serviceId = services.find(s => s.name === subjectName)?.id;
          if (serviceId) {
            await client.query(`
              INSERT INTO "InstituteService" (id, "instituteId", "serviceId")
              VALUES (gen_random_uuid(), $1, $2)
              ON CONFLICT DO NOTHING
            `, [instituteId, serviceId]);
          }
        }

        results.push({ Name: inst.name, Email: inst.email, Password: password });
        console.log(`  SUCCESS: Created profile for ${inst.name}`);
        await new Promise(resolve => setTimeout(resolve, 1100)); // Rate limiting geocoding
      } catch (err) {
        console.error(`  DB Error for ${inst.name}:`, err.message);
      }
    }

    console.log('\n--- LIMASSOL PAGE 30-31 RESULTS ---');
    console.table(results);
    
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
