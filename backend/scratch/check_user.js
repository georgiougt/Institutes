require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    
    console.log('--- Checking public."User" table ---');
    const userRes = await client.query('SELECT id, email, role, "firstName", "lastName" FROM public."User" WHERE email = $1', ['georgiougt94@icloud.com']);
    console.log('Public User records found:', userRes.rows.length);
    if (userRes.rows.length > 0) {
      console.log(userRes.rows);
    } else {
      console.log('No user record found in public."User" table for georgiougt94@icloud.com');
    }

    console.log('\n--- Checking auth.users table ---');
    const authRes = await client.query('SELECT id, email, confirmed_at, last_sign_in_at, created_at FROM auth.users WHERE email = $1', ['georgiougt94@icloud.com']);
    console.log('Auth User records found in Supabase auth.users:', authRes.rows.length);
    if (authRes.rows.length > 0) {
      console.log(authRes.rows);
    } else {
      console.log('No user record found in auth.users for georgiougt94@icloud.com');
    }

    console.log('\n--- Checking all users in public."User" table for reference ---');
    const allUsers = await client.query('SELECT email FROM public."User" LIMIT 10');
    console.log('First 10 users in DB:', allUsers.rows.map(r => r.email));

  } catch (err) {
    console.error('Error executing query:', err);
  } finally {
    await client.end();
  }
}

main();
