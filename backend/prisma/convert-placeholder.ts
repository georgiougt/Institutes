import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function convert() {
  const source = 'C:\\Users\\Georg\\.gemini\\antigravity\\brain\\ff68261c-7643-4fa4-b600-fb7d103c5827\\institute_placeholder_v2_1776844053683.png';
  const targetDir = path.join(__dirname, '..', '..', 'web', 'public', 'images');
  const target = path.join(targetDir, 'placeholder-institute.webp');

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  console.log(`Converting ${source} to ${target}...`);

  await sharp(source)
    .webp({ quality: 80 })
    .toFile(target);

  console.log('Conversion successful!');
}

convert().catch(console.error);
