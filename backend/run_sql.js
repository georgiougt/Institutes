require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const client = new Client({
  connectionString: process.env.DIRECT_URL,
});

async function runSql() {
  try {
    const sqlPath = path.join(__dirname, 'schema.sql');
    if (!fs.existsSync(sqlPath)) {
      console.error('schema.sql not found');
      return;
    }

    const sql = fs.readFileSync(sqlPath, 'utf8');
    console.log('Connecting to Supabase...');
    await client.connect();
    console.log('Connected! Executing schema.sql...');
    
    // We run the whole thing as a single query (pg client handles multi-statement if they are simple)
    // Prisma output SQL usually has simple statements.
    await client.query(sql);
    
    console.log('SUCCESS: Schema applied successfully.');
    await client.end();
  } catch (err) {
    console.error('FAILED: SQL execution error');
    console.error(err);
    process.exit(1);
  }
}

runSql();
