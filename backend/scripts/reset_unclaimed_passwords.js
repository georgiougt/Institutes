const { Client } = require('pg');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlod3pvb3pxZWNpdW1udWluaG9lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzY2OTkxMCwiZXhwIjoyMDg5MjQ1OTEwfQ.9rdNxkgjNf3HA2W3v1fYtsQkLNPpEzKi1IFqFn6dTYc';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const TEMP_PASSWORD = 'Frontistirio2026!';

async function run() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    
    let allUsers = [];
    let page = 1;
    let hasMore = true;

    console.log('Fetching all users from Supabase (paginated)...');
    while (hasMore) {
        const { data, error } = await supabase.auth.admin.listUsers({
            page: page,
            perPage: 1000 // Try to get as many as possible per page
        });
        
        if (error) throw error;
        
        allUsers = allUsers.concat(data.users);
        if (data.users.length < 1000) {
            hasMore = false;
        } else {
            page++;
        }
    }

    const owners = allUsers.filter(u => u.email !== 'georgiougt@gmail.com'); // Exclude main admin
    
    console.log(`Found ${owners.length} owners. Resetting passwords...`);

    const csvData = [['Institute Name', 'City', 'Phone', 'Email/Username', 'Temporary Password']];

    for (const user of owners) {
        try {
            // Reset password
            await supabase.auth.admin.updateUserById(user.id, { password: TEMP_PASSWORD });
            
            // Get institute info from DB
            const instRes = await client.query(`
                SELECT i.name as inst_name, c.name as city_name, b.phone
                FROM "Institute" i
                JOIN "Branch" b ON i.id = b."instituteId"
                JOIN "City" c ON b."cityId" = c.id
                WHERE i."ownerId" = $1 AND b."isMain" = true
                LIMIT 1
            `, [user.id]);

            if (instRes.rows.length > 0) {
                const info = instRes.rows[0];
                csvData.push([
                    info.inst_name,
                    info.city_name,
                    info.phone,
                    user.email,
                    TEMP_PASSWORD
                ]);
                process.stdout.write('.'); // Progress indicator
            } else {
                csvData.push(['Unknown Institute', 'N/A', 'N/A', user.email, TEMP_PASSWORD]);
            }
            
            await new Promise(resolve => setTimeout(resolve, 50)); // Fast but safe
        } catch (err) {
            console.error(`\n  Error resetting ${user.email}:`, err.message);
        }
    }

    const csvContent = csvData.map(row => row.map(cell => `"${(cell || '').toString().replace(/"/g, '""')}"`).join(',')).join('\n');
    fs.writeFileSync('full_institutes_directory.csv', csvContent);

    console.log('\n\nSUCCESS: All passwords reset to: ' + TEMP_PASSWORD);
    console.log('Directory exported to: full_institutes_directory.csv');

  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
