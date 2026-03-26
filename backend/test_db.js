require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function testConnection() {
  try {
    console.log('Testing connection to:', process.env.DATABASE_URL.replace(/:[^:]+@/, ':****@'));
    await client.connect();
    console.log('SUCCESS: Connected to PostgreSQL');
    const res = await client.query('SELECT current_database(), current_user');
    console.log('Details:', res.rows[0]);
    await client.end();
  } catch (err) {
    console.error('FAILED: Connection error');
    console.error(err);
  }
}

testConnection();
