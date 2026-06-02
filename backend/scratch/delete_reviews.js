require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();

    // 1. Find the institute
    const instRes = await client.query(
      `SELECT id, name FROM "Institute" WHERE name ILIKE '%elesson%' OR name ILIKE '%e-lesson%' OR name ILIKE '%e lesson%'`
    );
    console.log('Matching institutes:', instRes.rows);

    if (instRes.rows.length === 0) {
      console.log('No institute found matching "elesson". Trying broader search...');
      const broader = await client.query(
        `SELECT id, name FROM "Institute" WHERE name ILIKE '%lesson%'`
      );
      console.log('Broader results:', broader.rows);
      return;
    }

    const instituteId = instRes.rows[0].id;
    const instituteName = instRes.rows[0].name;

    // 2. Show existing reviews
    const reviews = await client.query(
      `SELECT id, "guestName", rating, comment, status, "createdAt" FROM "Review" WHERE "instituteId" = $1 ORDER BY "createdAt" DESC`,
      [instituteId]
    );
    console.log(`\nReviews for "${instituteName}" (${reviews.rows.length} total):`);
    console.table(reviews.rows);

    // 3. Delete all reviews for this institute
    const delRes = await client.query(
      `DELETE FROM "Review" WHERE "instituteId" = $1 RETURNING id`,
      [instituteId]
    );
    console.log(`\nDeleted ${delRes.rowCount} reviews.`);

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

main();
