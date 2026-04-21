
const { createClient } = require('@supabase/supabase-js');

async function main() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  const { data, error } = await supabase.storage.listBuckets();

  if (error) {
    console.error('Error listing buckets:', error.message);
    return;
  }

  console.log('Available buckets:');
  data.forEach(b => console.log(`- ${b.name} (${b.public ? 'Public' : 'Private'})`));
}

main();
