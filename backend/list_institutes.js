const { Client } = require('pg');
require('dotenv').config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';


async function run() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    const res = await client.query('SELECT name FROM "Institute" ORDER BY name ASC');
    console.log('--- Current Institutes in DB ---');
    res.rows.forEach((row, i) => console.log(`${i + 1}. ${row.name}`));
    console.log('--------------------------------');
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
