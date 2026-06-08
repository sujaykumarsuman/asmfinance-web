// Apply the brand forest duotone to brand/founders-story.png (a transparent,
// full-colour cut-out) and export optimised webp + png to public/founders/.
// Duotone = grayscale, then a per-channel linear map shadows->forest-dark,
// highlights->cream. Alpha (transparency) is preserved.
//   Run: node scripts/treat-story-photo.mjs
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'brand/founders-story.png');
const outDir = join(root, 'public/founders');

const DARK = [22, 58, 35]; // forest-dark #163A23 (shadows)
const CREAM = [237, 223, 182]; // warm gold-cream (highlights) — matches the forest+gold duotone
const A = DARK.map((d, i) => (CREAM[i] - d) / 255); // linear slope per channel
const B = DARK; // linear offset per channel

const { width, height } = await sharp(src).metadata();

// Alpha as a raw 1-band buffer.
const alpha = await sharp(src).ensureAlpha().extractChannel(3).toColourspace('b-w').raw().toBuffer();

// Duotone RGB: desaturate to luminance in all 3 channels (recomb keeps it
// 3-band), then a per-channel linear map shadows->forest-dark, highlights->cream.
const LUMA = [0.299, 0.587, 0.114];
const rgb = await sharp(src)
  .removeAlpha()
  .recomb([LUMA, LUMA, LUMA])
  .linear(A, B)
  .raw()
  .toBuffer();

// Recombine duotone RGB + original alpha.
const base = sharp(rgb, { raw: { width, height, channels: 3 } }).joinChannel(alpha, {
  raw: { width, height, channels: 1 },
});

await base.clone().png().toFile(join(outDir, 'founders-story.png'));
await base.clone().webp({ quality: 82 }).toFile(join(outDir, 'founders-story.webp'));
// Also keep a treated copy of the source in brand/ for the record.
await base.clone().png().toFile(join(root, 'brand/founders-story-duotone.png'));

console.log(`done: ${width}x${height} -> public/founders/founders-story.{webp,png}`);
