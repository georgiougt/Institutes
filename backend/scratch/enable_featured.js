require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();

    const instituteId = '6b290308-cf5c-4623-91ae-73cbc7aeb8ca';

    // Set verified for 1 year, featured permanently
    const verifiedUntil = new Date();
    verifiedUntil.setFullYear(verifiedUntil.getFullYear() + 1);

    // 1. Update institute flags
    await client.query(`
      UPDATE "Institute" 
      SET "isVerified" = true, 
          "isFeatured" = true, 
          "verifiedAt" = NOW(), 
          "verifiedUntil" = $1
      WHERE id = $2
    `, [verifiedUntil, instituteId]);

    // 2. Create a featured listing record
    await client.query(`
      INSERT INTO "FeaturedListing" (id, "instituteId", "placementType", priority, "startsAt", "endsAt", "isActive", "createdBy", "createdAt")
      VALUES (gen_random_uuid(), $1, 'SEARCH', 10, NOW(), $2, true, 'admin', NOW())
    `, [instituteId, verifiedUntil]);

    // 3. Verify
    const res = await client.query(
      `SELECT name, "isVerified", "isFeatured", "verifiedAt", "verifiedUntil" FROM "Institute" WHERE id = $1`,
      [instituteId]
    );
    console.log('Updated Elesson institute:');
    console.table(res.rows);

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

main();
