const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function transliterateGreek(text) {
  const map = {
    'α': 'a', 'β': 'v', 'γ': 'g', 'δ': 'd', 'ε': 'e', 'ζ': 'z', 'η': 'i', 'θ': 'th',
    'ι': 'i', 'κ': 'k', 'λ': 'l', 'μ': 'm', 'ν': 'n', 'ξ': 'x', 'ο': 'o', 'π': 'p',
    'ρ': 'r', 'σ': 's', 'ς': 's', 'τ': 't', 'υ': 'y', 'φ': 'f', 'χ': 'ch', 'ψ': 'ps',
    'ω': 'o', 'ά': 'a', 'έ': 'e', 'ή': 'i', 'ί': 'i', 'ό': 'o', 'ύ': 'y', 'ώ': 'o',
    'ϊ': 'i', 'ϋ': 'y', 'ΐ': 'i', 'ΰ': 'y',
    'Α': 'a', 'Β': 'v', 'Γ': 'g', 'Δ': 'd', 'Ε': 'e', 'Ζ': 'z', 'Η': 'i', 'Θ': 'th',
    'Ι': 'i', 'Κ': 'k', 'Λ': 'l', 'Μ': 'm', 'Ν': 'n', 'Ξ': 'x', 'Ο': 'o', 'Π': 'p',
    'Ρ': 'r', 'Σ': 's', 'Τ': 't', 'Υ': 'y', 'Φ': 'f', 'Χ': 'ch', 'Ψ': 'ps', 'Ω': 'o'
  };
  
  return text.split('').map(char => map[char] || char).join('');
}

function slugify(text) {
  return transliterateGreek(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

async function main() {
  console.log('Populating city slugs...');
  const cities = await prisma.city.findMany();
  for (const city of cities) {
    const derivedSlug = city.nameEn ? city.nameEn.toLowerCase() : slugify(city.name);
    await prisma.city.update({
      where: { id: city.id },
      data: { slug: derivedSlug }
    });
    console.log(`City: ${city.name} -> ${derivedSlug}`);
  }

  console.log('\nPopulating service slugs...');
  const services = await prisma.service.findMany();
  for (const service of services) {
    if (!service.slug) {
      const derivedSlug = slugify(service.name);
      await prisma.service.update({
        where: { id: service.id },
        data: { slug: derivedSlug }
      });
      console.log(`Service: ${service.name} -> ${derivedSlug}`);
    } else {
      console.log(`Service: ${service.name} already has slug: ${service.slug}`);
    }
  }

  console.log('\nSlug population complete!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
