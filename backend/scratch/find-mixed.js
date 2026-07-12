const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function isLatin(char) {
  const code = char.charCodeAt(0);
  return (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
}

function isGreek(char) {
  const code = char.charCodeAt(0);
  return (code >= 0x0370 && code <= 0x03ff);
}

async function main() {
  const institutes = await prisma.institute.findMany({
    select: { id: true, name: true }
  });

  console.log('Checking for mixed-script words in institute names:');
  let count = 0;
  for (const inst of institutes) {
    const words = inst.name.split(/\s+/);
    let mixedWords = [];
    for (const word of words) {
      let hasLatin = false;
      let hasGreek = false;
      for (const char of word) {
        if (isLatin(char)) hasLatin = true;
        if (isGreek(char)) hasGreek = true;
      }
      if (hasLatin && hasGreek) {
        mixedWords.push(word);
      }
    }
    if (mixedWords.length > 0) {
      count++;
      console.log(`- ID: ${inst.id}`);
      console.log(`  Name: ${inst.name}`);
      console.log(`  Mixed words: ${mixedWords.join(', ')}`);
      // Print detailed chars of mixed words
      for (const word of mixedWords) {
        const charDetails = [...word].map(c => {
          const code = c.charCodeAt(0);
          const type = isLatin(c) ? 'Latin' : (isGreek(c) ? 'Greek' : 'Other');
          return `${c} (U+${code.toString(16).padStart(4, '0')} ${type})`;
        }).join(', ');
        console.log(`    Chars: ${charDetails}`);
      }
    }
  }
  console.log(`Total institutes with mixed-script words: ${count}`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
