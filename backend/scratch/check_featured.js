const { Client } = require('pg');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
require('dotenv').config();

async function run() {
  const c = new Client({ connectionString: process.env.DIRECT_URL });
  await c.connect();

  const res = await c.query(`
    SELECT i.id, i.name, i."isFeatured", i."isVerified" 
    FROM "Institute" i
    WHERE i.status = 'APPROVED' 
    AND i.id IN (
      SELECT b."instituteId" 
      FROM "Branch" b 
      JOIN "City" ci ON ci.id = b."cityId" 
      WHERE ci."countryCode" = 'CY'
    )
  `);
  console.log(res.rows);
  await c.end();
}

run().catch(console.error);
