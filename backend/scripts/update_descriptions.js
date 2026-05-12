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
    
    console.log('Fetching all institutes and their subjects/cities...');
    
    const query = `
      SELECT 
          i.id, 
          i.name, 
          c.name as city_name,
          STRING_AGG(s.name, ', ') as subjects
      FROM "Institute" i
      LEFT JOIN "Branch" b ON i.id = b."instituteId" AND b."isMain" = true
      LEFT JOIN "City" c ON b."cityId" = c.id
      LEFT JOIN "InstituteService" isrv ON i.id = isrv."instituteId"
      LEFT JOIN "Service" s ON isrv."serviceId" = s.id
      GROUP BY i.id, i.name, c.name
    `;
    
    const res = await client.query(query);
    console.log(`Found ${res.rows.length} institutes. Updating descriptions...`);

    let count = 0;
    for (const row of res.rows) {
      const { id, name, city_name, subjects } = row;
      
      // Handle missing data gracefully
      const city = city_name || 'Κύπρο';
      const subjectsList = subjects || 'διάφορα μαθήματα';
      
      const description = `Το Φροντιστήριο ${name} προσφέρει τα ακόλουθα μαθήματα ${subjectsList} στην ${city}.`;
      
      await client.query('UPDATE "Institute" SET description = $1, "updatedAt" = NOW() WHERE id = $2', [description, id]);
      
      count++;
      if (count % 50 === 0) {
        console.log(`  Updated ${count}/${res.rows.length} descriptions...`);
      }
    }

    console.log(`\nSUCCESS: Updated ${count} institute descriptions.`);

  } catch (err) {
    console.error('Error updating descriptions:', err);
  } finally {
    await client.end();
  }
}

run();
