const { Client } = require('pg');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
require('dotenv').config();

// Standard seed PRNG used in backend
const getSeedRandom = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  let seedVal = hash;
  seedVal = (seedVal * 1664525 + 1013904223) % 4294967296;
  return seedVal / 4294967296;
};

async function run() {
  const c = new Client({ connectionString: process.env.DIRECT_URL });
  await c.connect();

  const res = await c.query(`
    SELECT i.id, i.name, i."isFeatured", i."isVerified" 
    FROM "Institute" i
    WHERE i.status = 'APPROVED' 
    AND i.id IN (
      SELECT b."instituteId" 
      FROM "Branch" b 
      JOIN "City" ci ON ci.id = b."cityId" 
      WHERE ci."countryCode" = 'CY'
    )
  `);
  
  const allMatches = res.rows;
  
  // Test with tenMinSeed fallback (e.g. current block)
  const tenMinSeed = Math.floor(Date.now() / 600000).toString();
  
  const sortedMatches = allMatches.sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    if (a.isVerified && !b.isVerified) return -1;
    if (!a.isVerified && b.isVerified) return 1;
    
    const randA = getSeedRandom(a.id + tenMinSeed);
    const randB = getSeedRandom(b.id + tenMinSeed);
    return randA - randB;
  });

  console.log("SHUFFLED ORDER (top 5):");
  sortedMatches.slice(0, 5).forEach((m, idx) => {
    console.log(`${idx + 1}. ${m.name} (ID: ${m.id}, Featured: ${m.isFeatured}, Verified: ${m.isVerified})`);
  });

  await c.end();
}

run().catch(console.error);
