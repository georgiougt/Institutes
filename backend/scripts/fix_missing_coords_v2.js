const { Client } = require('pg');
const https = require('https');
require('dotenv').config();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

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

function cleanAddress(addr) {
  // Remove floor/unit info like "Διαμ. 102", "1ος όροφος", "Αρ. 55", "Κατ. 1"
  let cleaned = addr.replace(/(Διαμ\.|Αρ\.|Κατ\.|όροφος|Ισόγειο|Polykatikia|Διαμέρισμα|[\d]+[Α-ΩA-Z]?)[^,]*/gi, '');
  // Specifically target the street part before the first comma
  let parts = addr.split(',');
  let street = parts[0].replace(/\d+.*/g, '').trim(); // Remove number and anything after it in the first part
  
  if (parts.length > 1) {
    return `${street}, ${parts.slice(1).join(',').trim()}`;
  }
  return street;
}

async function run() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    
    const branchRes = await client.query(`
      SELECT b.id, b.address, c.name as city_name, b."instituteId"
      FROM "Branch" b
      JOIN "City" c ON b."cityId" = c.id
      WHERE (b.latitude IS NULL OR b.longitude IS NULL)
      AND b."createdAt" > '2026-05-11'
    `);
    
    const branches = branchRes.rows;
    console.log(`Found ${branches.length} branches with missing coordinates.`);

    let fixedCount = 0;
    for (const b of branches) {
      console.log(`Trying to fix: ${b.address}, ${b.city_name}...`);
      
      const strategies = [
        `${b.address}, ${b.city_name}, Cyprus`, // Full address
        `${cleanAddress(b.address)}, ${b.city_name}, Cyprus`, // Cleaned address
        `${b.address.split(',')[0]}, ${b.city_name}, Cyprus`, // Just street name
        `${cleanAddress(b.address.split(',')[0])}, ${b.city_name}, Cyprus` // Cleaned street name
      ];

      let coords = null;
      for (const query of strategies) {
        console.log(`  Querying: ${query}`);
        coords = await geocode(query);
        if (coords) break;
        await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
      }

      if (coords) {
        await client.query(`
          UPDATE "Branch"
          SET latitude = $1, longitude = $2, "updatedAt" = NOW()
          WHERE id = $3
        `, [coords.lat, coords.lng, b.id]);
        console.log(`  SUCCESS: Found coords [${coords.lat}, ${coords.lng}]`);
        fixedCount++;
      } else {
        console.log(`  FAILED: No location found for ${b.address}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log(`\nFixed ${fixedCount} out of ${branches.length} missing locations.`);
    
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
