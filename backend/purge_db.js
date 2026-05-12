const { Client } = require('pg');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlod3pvb3pxZWNpdW1udWluaG9lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzY2OTkxMCwiZXhwIjoyMDg5MjQ1OTEwfQ.9rdNxkgjNf3HA2W3v1fYtsQkLNPpEzKi1IFqFn6dTYc';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();

    // Find Elesson owner email to preserve it
    const elessonRes = await client.query(`
      SELECT u.email FROM "User" u
      JOIN "Institute" i ON u.id = i."ownerId"
      WHERE i.name = 'Elesson'
    `);
    const preserveEmail = elessonRes.rows[0]?.email;
    console.log(`Preserving owner: ${preserveEmail || 'None found'}`);

    // Get all OWNER emails to delete from Supabase
    const ownersRes = await client.query(`
      SELECT email, id FROM "User" 
      WHERE role = 'OWNER' ${preserveEmail ? "AND email != $1" : ""}
    `, preserveEmail ? [preserveEmail] : []);
    
    console.log(`Found ${ownersRes.rows.length} owners to delete.`);

    for (const row of ownersRes.rows) {
      console.log(`Deleting auth user: ${row.email}`);
      const { error } = await supabase.auth.admin.deleteUser(row.id);
      if (error) console.error(`Auth Delete Error for ${row.email}:`, error.message);
    }

    // Delete DB entries
    await client.query('DELETE FROM "InstituteService" WHERE "instituteId" IN (SELECT id FROM "Institute" WHERE name != \'Elesson\')');
    await client.query('DELETE FROM "Branch" WHERE "instituteId" IN (SELECT id FROM "Institute" WHERE name != \'Elesson\')');
    await client.query('DELETE FROM "Institute" WHERE name != \'Elesson\'');
    await client.query(`DELETE FROM "User" WHERE role = 'OWNER' ${preserveEmail ? "AND email != $1" : ""}`, preserveEmail ? [preserveEmail] : []);

    console.log('PURGE COMPLETE. Database is clean.');

  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
