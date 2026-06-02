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

    console.log("Updating database to disable verified status for imported Athens language centers...");

    const res = await client.query(`
      UPDATE "Institute"
      SET "isVerified" = false
      WHERE "ownerId" IN (
        SELECT id FROM "User"
        WHERE email LIKE '%@tofrontistirio.gr'
      )
    `);

    console.log(`SUCCESS: Set "isVerified" = false for ${res.rowCount} institutes.`);

  } catch (err) {
    console.error("Error disabling verified status:", err);
  } finally {
    await client.end();
  }
}

run();
