require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { Client } = require('pg');
const { createClient } = require('@supabase/supabase-js');

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase URL or Key is missing');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const client = new Client({
    connectionString: process.env.DIRECT_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    
    console.log('Fetching user details from public."User" table...');
    const userRes = await client.query('SELECT id, email FROM public."User" WHERE email = $1', ['georgiougt94@icloud.com']);
    
    if (userRes.rows.length === 0) {
      console.error('User georgiougt94@icloud.com not found in public."User" table');
      return;
    }

    const localUser = userRes.rows[0];
    console.log('Found local user:', localUser);

    console.log('Creating user in Supabase Auth via admin API...');
    const randomPassword = Math.random().toString(36).slice(-10) + 'S99!';
    
    const { data, error } = await supabase.auth.admin.createUser({
      id: localUser.id,
      email: localUser.email,
      password: randomPassword,
      email_confirm: true
    });

    if (error) {
      console.error('Failed to create user in Supabase Auth:', error);
    } else {
      console.log('SUCCESS: User successfully migrated/created in Supabase Auth!');
      console.log('Auth User ID:', data.user.id);
    }

  } catch (err) {
    console.error('An error occurred:', err);
  } finally {
    await client.end();
  }
}

main();
