const { Client } = require('pg');
require('dotenv').config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function check() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();
  const res = await client.query('SELECT count(*) FROM "User" WHERE "passwordHash" IS NOT NULL');
  console.log('Users with passwordHash:', res.rows[0].count);
  const sample = await client.query('SELECT email FROM "User" WHERE "passwordHash" IS NOT NULL LIMIT 3');
  console.log('Sample:', sample.rows);
  await client.end();
}
check();
