require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    
    console.log('--- Counting Users ---');
    const localCount = await client.query('SELECT COUNT(*)::int as count FROM public."User"');
    console.log('Total local users (public.User):', localCount.rows[0].count);

    const authCount = await client.query('SELECT COUNT(*)::int as count FROM auth.users');
    console.log('Total Supabase users (auth.users):', authCount.rows[0].count);

    console.log('\n--- First 10 Supabase users ---');
    const authUsers = await client.query('SELECT id, email, created_at FROM auth.users LIMIT 10');
    console.log(authUsers.rows);

  } catch (err) {
    console.error('Error executing query:', err);
  } finally {
    await client.end();
  }
}

main();
