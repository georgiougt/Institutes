const { Client } = require('pg');
require('dotenv').config();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function run() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL?.replace('pgbouncer=true', 'pgbouncer=false'),
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();

    console.log("Checking verification status of all institutes in database...");

    const res = await client.query(`
      SELECT 
        i.id, 
        i.name, 
        i."isVerified", 
        i."isFeatured", 
        u.email,
        b.address
      FROM "Institute" i
      JOIN "User" u ON i."ownerId" = u.id
      LEFT JOIN "Branch" b ON b."instituteId" = i.id AND b."isMain" = true
      ORDER BY i.name ASC
    `);

    const all = res.rows;
    console.log(`Total institutes in DB: ${all.length}`);

    const verified = all.filter(x => x.isVerified);
    console.log(`Verified institutes: ${verified.length}`);

    console.log("\nSample of Verified Institutes:");
    console.table(verified.slice(0, 20).map(x => ({ name: x.name, email: x.email, address: x.address })));

    const verifiedGr = verified.filter(x => x.email.endsWith('@tofrontistirio.gr'));
    console.log(`\nVerified institutes with @tofrontistirio.gr: ${verifiedGr.length}`);

    const unverifiedGr = all.filter(x => !x.isVerified && x.email.endsWith('@tofrontistirio.gr'));
    console.log(`Unverified institutes with @tofrontistirio.gr: ${unverifiedGr.length}`);

  } catch (err) {
    console.error("Error checking verification status:", err);
  } finally {
    await client.end();
  }
}

run();
