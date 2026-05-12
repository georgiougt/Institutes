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

async function run() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    
    const branchRes = await client.query(`
      SELECT b.id, b.address, c.name as city_name
      FROM "Branch" b
      JOIN "City" c ON b."cityId" = c.id
      WHERE (b.latitude IS NULL OR b.longitude IS NULL)
      AND b."createdAt" > '2026-05-11'
    `);
    
    const branches = branchRes.rows;
    console.log(`Found ${branches.length} branches for city center fallback.`);

    let fixedCount = 0;
    for (const b of branches) {
      // Extract village/area from address if available (usually the last part before city)
      const parts = b.address.split(',');
      const area = parts.length > 1 ? parts[parts.length - 1].trim() : '';
      
      const strategies = [
        area ? `${area}, Cyprus` : null,
        `${b.city_name}, Cyprus`
      ].filter(Boolean);

      let coords = null;
      for (const query of strategies) {
        console.log(`Trying fallback for ${b.id}: ${query}`);
        coords = await geocode(query);
        if (coords) break;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      if (coords) {
        await client.query(`
          UPDATE "Branch"
          SET latitude = $1, longitude = $2, "updatedAt" = NOW()
          WHERE id = $3
        `, [coords.lat, coords.lng, b.id]);
        console.log(`  SUCCESS: Set to ${coords.lat}, ${coords.lng}`);
        fixedCount++;
      } else {
        console.log(`  FAILED: No city center found for ${b.city_name}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log(`\nApplied fallback to ${fixedCount} out of ${branches.length} branches.`);
    
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
