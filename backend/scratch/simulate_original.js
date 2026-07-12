const { Client } = require('pg');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
require('dotenv').config();

async function run() {
  const c = new Client({ connectionString: process.env.DIRECT_URL });
  await c.connect();

  const res = await c.query(`
    SELECT i.id, i.name, i."isFeatured", i."isVerified", i."createdAt"
    FROM "Institute" i
    WHERE i.status = 'APPROVED' 
    AND i.id IN (
      SELECT b."instituteId" 
      FROM "Branch" b 
      JOIN "City" ci ON ci.id = b."cityId" 
      WHERE ci."countryCode" = 'CY'
    )
    ORDER BY i."isFeatured" DESC, i."createdAt" DESC
  `);
  
  console.log("ORIGINAL DEFAULT ORDER (top 5):");
  res.rows.slice(0, 5).forEach((m, idx) => {
    console.log(`${idx + 1}. ${m.name} (ID: ${m.id}, Created: ${m.createdAt})`);
  });

  await c.end();
}

run().catch(console.error);
