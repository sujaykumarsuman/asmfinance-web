// Trim the transparent margins from the hero founders cut-out so the founders
// fill the frame, then regenerate the responsive webp + png variants.
//
// The source is the existing forest-duotone cut-out (1600x1056). Trimming only
// crops the empty transparent border — it preserves the exact colour treatment,
// so the hero's look is unchanged, just tighter. (The duotone itself was baked
// into this asset by an earlier step; we don't re-colour here.)
//   Run: node scripts/treat-hero-photo.mjs
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'brand/founders/founders-transparent-1600.png');
const outDir = join(root, 'public/founders');

// Auto-trim the transparent border (the source has ~10% left / ~13% right /
// ~5% top of empty space around the founders).
const trimmed = await sharp(src).trim({ threshold: 10 }).png().toBuffer();
const { width, height } = await sharp(trimmed).metadata();

// Two responsive tiers: the full trimmed crop (large) + an 800px-wide small.
const variants = [
  { name: 'founders-transparent-1600', w: width }, // large (full trimmed crop)
  { name: 'founders-transparent-800', w: Math.min(800, width) }, // small
];
for (const v of variants) {
  const pipe = sharp(trimmed).resize({ width: v.w });
  await pipe.clone().webp({ quality: 82 }).toFile(join(outDir, `${v.name}.webp`));
  await pipe.clone().png().toFile(join(outDir, `${v.name}.png`));
}

console.log(`done: trimmed to ${width}x${height} -> public/founders/founders-transparent-{800,1600}.{webp,png}`);
