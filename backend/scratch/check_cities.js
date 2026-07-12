const { Client } = require('pg');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
require('dotenv').config();

async function run() {
  const c = new Client({ connectionString: process.env.DIRECT_URL });
  await c.connect();

  const cities = await c.query('SELECT id, name, "countryCode" FROM "City" ORDER BY "countryCode", name');
  console.log('=== ALL CITIES ===');
  cities.rows.forEach(r => console.log(r.countryCode, '|', r.name, '|', r.id));

  const instCount = await c.query(`
    SELECT c."countryCode", COUNT(DISTINCT i.id) as cnt 
    FROM "Institute" i 
    JOIN "Branch" b ON b."instituteId" = i.id 
    JOIN "City" c ON c.id = b."cityId" 
    WHERE i.status = 'APPROVED' 
    GROUP BY c."countryCode"
  `);
  console.log('\n=== APPROVED INSTITUTES BY COUNTRY ===');
  instCount.rows.forEach(r => console.log(r.countryCode, ':', r.cnt));

  await c.end();
}

run().catch(e => { console.error(e); process.exit(1); });
