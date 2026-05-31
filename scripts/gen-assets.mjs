// Generate placeholder favicons + OG image from the brand monogram.
// Run with: node scripts/gen-assets.mjs
// TODO(human): replace with a proper set from realfavicongenerator.net + a Figma OG image.
import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = join(root, 'public');
mkdirSync(pub, { recursive: true });

const svgBuf = readFileSync(join(root, 'brand/logo/asm-monogram-on-cream.svg'));

// PNG icons from the monogram
const sizes = {
  'favicon-32.png': 32,
  'apple-touch-icon.png': 180,
  'favicon-192.png': 192,
  'favicon-512.png': 512,
};
for (const [name, size] of Object.entries(sizes)) {
  await sharp(svgBuf).resize(size, size).png().toFile(join(pub, name));
}

// favicon.svg = the vector monogram
writeFileSync(join(pub, 'favicon.svg'), svgBuf);

// favicon.ico containing 16px + 32px PNG frames
const frames = [
  { size: 16, buf: await sharp(svgBuf).resize(16, 16).png().toBuffer() },
  { size: 32, buf: await sharp(svgBuf).resize(32, 32).png().toBuffer() },
];
writeFileSync(join(pub, 'favicon.ico'), buildIco(frames));

function buildIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4); // count
  const entries = [];
  const datas = [];
  let offset = 6 + images.length * 16;
  for (const img of images) {
    const e = Buffer.alloc(16);
    e.writeUInt8(img.size >= 256 ? 0 : img.size, 0); // width
    e.writeUInt8(img.size >= 256 ? 0 : img.size, 1); // height
    e.writeUInt8(0, 2); // palette
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // color planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(img.buf.length, 8); // size of data
    e.writeUInt32LE(offset, 12); // offset
    offset += img.buf.length;
    entries.push(e);
    datas.push(img.buf);
  }
  return Buffer.concat([header, ...entries, ...datas]);
}

// OG share image (1200x630). Serif text falls back to Georgia in the rasterizer.
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#FBF8F1"/>
  <path d="M1200 0 L1200 300 Q 940 360 940 630 L1200 630 Z" fill="#F5EFE3"/>
  <g font-family="Georgia, 'Times New Roman', serif">
    <text x="80" y="118" font-size="42" font-weight="700" fill="#1F5132" letter-spacing="2">ASM</text>
    <text x="80" y="148" font-family="Arial, sans-serif" font-size="15" font-weight="600" fill="#4B5563" letter-spacing="6">INVESTMENTS</text>
    <text x="80" y="300" font-size="56" font-weight="700" fill="#1F5132">Wealth advisory for Indian</text>
    <text x="80" y="368" font-size="56" font-weight="700" fill="#1F5132">families, wherever they live.</text>
  </g>
  <text x="80" y="468" font-family="Arial, sans-serif" font-size="19" font-weight="700" fill="#C9A227" letter-spacing="3">AMFI-REGISTERED · MATHURA · EST. 2007</text>
  <circle cx="1070" cy="170" r="10" fill="#95D5B2"/>
  <rect x="980" y="232" width="170" height="34" rx="17" fill="#1F5132"/>
  <rect x="1006" y="280" width="118" height="34" rx="17" fill="#2D6A4F"/>
</svg>`;
await sharp(Buffer.from(og)).png().toFile(join(pub, 'og-image.png'));

console.log('Generated favicons + og-image.png in public/');
