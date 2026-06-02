require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    
    console.log('--- Mismatched users ---');
    const localNotAuth = await client.query('SELECT id, email FROM public."User" WHERE email NOT IN (SELECT email FROM auth.users)');
    console.log('Local users not in Supabase auth.users:', localNotAuth.rows.length);
    console.log(localNotAuth.rows);

    const authNotLocal = await client.query('SELECT id, email FROM auth.users WHERE email NOT IN (SELECT email FROM public."User")');
    console.log('\nSupabase auth.users not in local public.User:', authNotLocal.rows.length);
    console.log(authNotLocal.rows);

  } catch (err) {
    console.error('Error executing query:', err);
  } finally {
    await client.end();
  }
}

main();
