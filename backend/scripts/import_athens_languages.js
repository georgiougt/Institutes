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
    connectionString: process.env.DATABASE_URL?.replace('pgbouncer=true', 'pgbouncer=false'), // ensure direct transaction support
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    
    // Fetch seeded Cities, Areas and Services to map relationships dynamically
    const cityRes = await client.query('SELECT id, name FROM "City"');
    const cities = cityRes.rows;
    
    const areaRes = await client.query('SELECT id, name, "cityId" FROM "Area"');
    const areas = areaRes.rows;

    const serviceRes = await client.query('SELECT id, name FROM "Service"');
    const services = serviceRes.rows;

    const atticaCity = cities.find(c => c.name === 'Αττική');
    if (!atticaCity) {
      console.error("Attica (Αττική) city not found in the database. Please make sure database seeding completed.");
      process.exit(1);
    }
    const targetCityId = atticaCity.id;

    // Define Athens batch: premium language centers mapping to their respective seeded areas
    const batch = [
      { 
        name: 'Κέντρο Ξένων Γλωσσών Ευρωγνώση (Μαρούσι)', 
        email: 'eurognosi.marousi@tofrontistirio.gr', 
        phone: '2106123456', 
        address: 'Λεωφόρος Κηφισίας 120', 
        city: 'Αττική', 
        area: 'Μαρούσι', 
        subjects: ['Αγγλικά', 'Γερμανικά', 'Γαλλικά'] 
      },
      { 
        name: 'Κέντρο Ξένων Γλωσσών So Easy (Χαλάνδρι)', 
        email: 'soeasy.chalandri@tofrontistirio.gr', 
        phone: '2106823456', 
        address: 'Ανδρέα Παπανδρέου 25', 
        city: 'Αττική', 
        area: 'Χαλάνδρι', 
        subjects: ['Αγγλικά', 'Ισπανικά', 'Ιταλικά'] 
      },
      { 
        name: 'Κέντρο Ξένων Γλωσσών Μπαχαράκη (Γλυφάδα)', 
        email: 'baharakis.glyfada@tofrontistirio.gr', 
        phone: '2108923456', 
        address: 'Λεωφόρος Βουλιαγμένης 85', 
        city: 'Αττική', 
        area: 'Γλυφάδα', 
        subjects: ['Αγγλικά', 'Γερμανικά', 'Γαλλικά'] 
      },
      { 
        name: 'Κέντρο Ξένων Γλωσσών Galileo Galilei (Πειραιάς)', 
        email: 'galileo.piraeus@tofrontistirio.gr', 
        phone: '2104123456', 
        address: 'Ηρώων Πολυτεχνείου 40', 
        city: 'Αττική', 
        area: 'Πειραιάς', 
        subjects: ['Ιταλικά', 'Ισπανικά'] 
      },
      { 
        name: 'Ξένες Γλώσσες Καπάτου (Νέα Σμύρνη)', 
        email: 'kapatos.neasmyrni@tofrontistirio.gr', 
        phone: '2109323456', 
        address: 'Ομήρου 20', 
        city: 'Αττική', 
        area: 'Νέα Σμύρνη', 
        subjects: ['Ιταλικά', 'Ισπανικά', 'Γαλλικά'] 
      },
      { 
        name: 'Κέντρο Ξένων Γλωσσών Στρατηγάκη (Περιστέρι)', 
        email: 'stratigakis.peristeri@tofrontistirio.gr', 
        phone: '2105723456', 
        address: 'Παναγή Τσαλδάρη 15', 
        city: 'Αττική', 
        area: 'Περιστέρι', 
        subjects: ['Αγγλικά', 'Γερμανικά', 'Ρωσικά'] 
      }
    ];

    const results = [];
    for (const inst of batch) {
      console.log(`Processing: ${inst.name}...`);
      const password = Math.random().toString(36).slice(-10) + 'S26!';
      
      let uid;
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: inst.email,
        password: password,
        email_confirm: true
      });
      
      if (authError) {
        if (authError.message.includes('already registered')) {
            const { data: existingUser } = await supabase.auth.admin.listUsers();
            uid = existingUser.users.find(u => u.email === inst.email)?.id;
        } else {
            console.error(`  Auth Error for ${inst.name}:`, authError.message);
            continue;
        }
      } else {
        uid = authUser.user.id;
      }

      if (!uid) continue;

      // Upsert User in local database with role OWNER
      await client.query(`
        INSERT INTO "User" (id, email, role, "onboardingStep", "createdAt", "updatedAt")
        VALUES ($1, $2, 'OWNER', 3, NOW(), NOW())
        ON CONFLICT (email) DO UPDATE SET id = EXCLUDED.id, role = 'OWNER'
      `, [uid, inst.email]);

      // Resolve areaId dynamically
      const targetArea = areas.find(a => a.name === inst.area && a.cityId === targetCityId);
      const targetAreaId = targetArea ? targetArea.id : null;

      const slug = generateSlug(inst.name);
      
      // Dynamic geocoding mapping: OSM query with exact municipality and Greece limits
      const fullAddressForGeocoding = `${inst.address}, ${inst.area}, Attica, Greece`;
      let coords = await geocode(fullAddressForGeocoding);
      if (!coords) {
          coords = await geocode(`${inst.address}, ${inst.area}, Greece`);
      }

      try {
        const instInsert = await client.query(`
          INSERT INTO "Institute" (id, "ownerId", name, slug, status, "isVerified", "createdAt", "updatedAt")
          VALUES (gen_random_uuid(), $1, $2, $3, 'APPROVED', false, NOW(), NOW())
          RETURNING id
        `, [uid, inst.name, slug]);
        
        const instituteId = instInsert.rows[0].id;
        
        await client.query(`
          INSERT INTO "Branch" (id, "instituteId", name, address, "cityId", "areaId", phone, latitude, longitude, "isMain", status, "createdAt", "updatedAt")
          VALUES (gen_random_uuid(), $1, 'Κεντρικό', $2, $3, $4, $5, $6, $7, true, 'APPROVED', NOW(), NOW())
        `, [instituteId, inst.address, targetCityId, targetAreaId, inst.phone || '', coords?.lat || null, coords?.lng || null]);

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

        results.push({ Name: inst.name, Email: inst.email, Password: password, Area: inst.area });
        console.log(`  SUCCESS: Created profile for ${inst.name} (${coords ? 'Geocoded' : 'Coords missing'})`);
        
        // Bounded throttle wait to prevent Osm nominatim geocoding rate-limiting
        await new Promise(resolve => setTimeout(resolve, 1100));
      } catch (err) {
        console.error(`  DB Error for ${inst.name}:`, err.message);
      }
    }

    console.log('\n--- ATHENS LANGUAGE CENTERS RESULTS ---');
    console.table(results);
    
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
