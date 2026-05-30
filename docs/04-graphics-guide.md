# Graphics Guide

A step-by-step recipe for the brand assets the landing site needs. Time estimates assume someone non-designer using free tools.

## Asset inventory

| Asset | Where it goes | Format(s) | Status |
|---|---|---|---|
| Wordmark logo | nav, footer | SVG + PNG @ 1x/2x | TODO |
| Monogram (favicon) | favicon, OG | SVG + ICO + 16/32/192/512 PNG | TODO |
| OG share image | meta tags | 1200×630 PNG | TODO |
| Founder portraits — Anjali, Arvind | About section | duotone JPG/WebP, 800×800 + 1600×1600 | **Source files needed** |
| Hero supporting illustration | Hero right column | SVG | TODO |
| Service tier icons | 4 cards in §4 | Lucide React icons | DONE (via `lucide-react`) |
| Geo flag chips (NRI section) | NRI band | SVG | use `flag-icons` package |
| Partner logos (AMFI, NISM, etc.) | Trust strip | grayscale SVG | TODO |

All originals live in `brand/`. Compressed exports for the site live in `public/`.

---

## 1. Logo

### Decision: wordmark, not pictorial

Pictorial marks date quickly. A wordmark in Fraunces SemiBold ages well and signals heritage.

### Design recipe (DIY in Figma, ~90 minutes)

1. New Figma file, 600×200 canvas.
2. Type `ASM` in **Fraunces SemiBold**, 96pt, color `#1F5132`.
3. Tighten kerning: `S` to `M` by -2, `A` to `S` by -1.
4. Below the wordmark, type `INVESTMENTS` in **Inter SemiBold**, 14pt, letter-spacing 0.32em, color `#4B5563`.
5. Draw a 1px gold hairline (`#C9A227`) above `INVESTMENTS`, 80px wide, centered.
6. Export variants:
   - `brand/logo.svg` (primary, full color)
   - `brand/logo-mono-forest.svg` (forest only)
   - `brand/logo-mono-cream.svg` (cream only, for NRI band footer)
   - `brand/logo-monogram.svg` — just `ASM` (no INVESTMENTS line) for square uses

### Alternative: commission

- **Looka** (~₹1,200-2,400, instant) — auto-generated, decent for a starter mark.
- **Fiverr** (~₹1,500-5,000) — search "wordmark logo for financial advisory". Give them this file as the brief. Ask for SVG + 3 variants.

### Favicon set

Generate from monogram once approved:

1. Drop the monogram SVG into [realfavicongenerator.net](https://realfavicongenerator.net/).
2. Configure: iOS background `#FBF8F1`, Android theme `#1F5132`.
3. Download zip, extract everything into `public/`.

---

## 2. Founder portraits — duotone treatment

This is the standout visual on the site. Done well, it makes ASM look like a heritage private bank. Done quickly with the wrong tools, it looks like a phone filter. Spend 30 minutes per photo doing it properly.

### Source requirements

- One photo each of Anjali Suman and Arvind Kumar Suman.
- Ideally: shoulders-up portrait, neutral background, eye-level, soft natural light.
- Resolution: at least 2000×2000 from the original capture.
- If only smaller photos exist, upscale once with [Upscayl](https://upscayl.org/) (free, open source) before treatment.

### Recipe — Photopea (free, browser-based, behaves like Photoshop)

Open `https://www.photopea.com/`, then:

**Step 1 — Crop and clean**
- Crop to square (1:1), shoulders-up.
- Use the Healing Brush to remove minor distractions in the background.

**Step 2 — Convert to grayscale baseline**
- `Image → Adjustments → Black & White...`
- Bump Reds and Yellows slightly to keep skin tones from going chalky.

**Step 3 — Apply duotone (the magic step)**
- `Image → Adjustments → Gradient Map...`
- Click the gradient bar to edit the gradient.
- Set the left stop to `#163A23` (forest-dark) at position 0%.
- Set a middle stop to `#1F5132` (forest) at position 50%.
- Set the right stop to `#FBF8F1` (cream) at position 100%.
- Click OK. The photo should now feel like an editorial illustration.

**Step 4 — Soften and grade**
- `Filter → Camera Raw Filter...`
- Texture: -10 (slightly softer)
- Clarity: -5
- Vibrance: 0 (we don't need color information at this point)

**Step 5 — Add subtle film grain (optional but recommended)**
- New layer, fill 50% gray.
- `Filter → Noise → Add Noise` → 4%, Gaussian, Monochromatic.
- Set blend mode to `Overlay`, opacity 30%.

**Step 6 — Export**
- Anjali: `brand/founders/anjali-duotone.jpg` (1600×1600, 85% quality JPG)
- Arvind: `brand/founders/arvind-duotone.jpg` (same)
- Also export 800×800 versions for the responsive `<picture>` source set.
- Optimise: run both through [Squoosh](https://squoosh.app/) → WebP at 80% quality. Save alongside the JPG.

### Alternative tools

- **GIMP** (free, desktop): `Colors → Curves` per channel + `Colors → Color Balance`. Slower but more powerful.
- **Affinity Photo** (₹2,000 one-time): better UX than Photopea, no subscription.
- **CSS-only fallback** (last resort): `filter: grayscale(1) sepia(0.2) hue-rotate(75deg) saturate(1.4)` — gets close to forest duotone but loses depth. Use only if you can't pre-process.

### Placement

- About section (§7): side-by-side, square cards, hover state lifts subtly (`shadow-pop`).
- Hero (optional): one composite of both, blended into the right side. Lower priority — ship without first.

---

## 3. Hero supporting illustration

Two options, pick one:

### Option A — Abstract editorial mark (recommended)

A simple SVG geometric composition that evokes growth without literal money or graphs. Build it from these primitives in Figma:

- Three vertically stacked rounded rectangles (varying widths), forest gradient.
- A thin gold arc cutting across them at 15°.
- One small `sage` dot at the top, suggesting movement upward.
- Export as `brand/hero-mark.svg`.

This feels custom and avoids the stock-illustration look.

### Option B — unDraw illustration, recolored

- Go to [undraw.co](https://undraw.co/).
- Pick a financial / growth illustration with minimal characters (e.g., "Investing", "Savings", "Personal finance").
- Change palette color to `#1F5132` in the side panel.
- Download SVG.
- Open in Figma, recolor secondary tones to `#C9A227` and `#95D5B2`.
- Export as `brand/hero-illustration.svg`.

unDraw is free, customisable, and used by countless professional sites — but it's recognisable. The custom mark is the better long-term call.

---

## 4. OG share image

For social previews when the link is shared on WhatsApp, LinkedIn etc.

- Canvas: 1200×630.
- Bg: cream `#FBF8F1` with a subtle ivory geometric corner accent.
- Top-left: ASM logo at 280px wide.
- Center-left: H1 in Fraunces SemiBold, 64pt, forest — "Wealth advisory for Indian families, wherever they live."
- Bottom-left: small caps "AMFI-REGISTERED · MATHURA · EST. 2007" in gold.
- Right side: the founder duotone composite OR the hero mark.
- Export as `public/og-image.png`.

Build this once in Figma. Templates: search Figma Community for "OG image template", import, swap content.

---

## 5. Trust strip — partner logos

You need grayscale versions of:

- AMFI logo
- NISM logo
- Mirae Asset Sharekhan
- IRDAI POSP badge
- GIFT City logo (use the IFSCA mark as a stand-in)

How to make them grayscale + uniform height:

1. Source each official logo (SVG preferred). For most, search "[brand name] logo svg" or check the official site's press kit.
2. Open in Figma. Apply `Image → Adjustments → Desaturate` (or, in Figma, set layer to grayscale via the Color Effects plugin).
3. Resize so they all share the same visual weight (typically 36-40px tall, varying widths).
4. Export individually as `brand/trust/amfi.svg`, `brand/trust/nism.svg`, etc.

Use them with `opacity-70` on the site and `opacity-100` on hover.

---

## 6. Icons

### Use Lucide

```bash
pnpm add lucide-react
```

Per-section icon mapping (use these consistently):

| Section | Icon |
|---|---|
| "Build wealth" | `Sprout` |
| "Protect what you have" | `ShieldCheck` |
| "Cross borders cleanly" | `Globe2` |
| Service tier — Core | `Leaf` |
| Service tier — Premium | `Layers` |
| Service tier — Wealth | `Gem` |
| Service tier — NRI | `Plane` |
| FAQ chevron | `ChevronDown` |
| WhatsApp link | `MessageCircle` |
| Calendar link | `CalendarDays` |
| Email link | `Mail` |
| Phone link | `Phone` |

### Flag icons

```bash
pnpm add flag-icons
```

Import the CSS once, then use `<span class="fi fi-ae" />` (UAE), `fi-us`, `fi-gb`, `fi-sg`.

---

## 7. Generation checklist

Before merging the launch PR, every item must be ticked.

- [ ] Wordmark SVG (full color + 2 mono variants) in `brand/`.
- [ ] Favicon set generated and placed in `public/`.
- [ ] Anjali duotone portrait (1600 + 800 + WebP) in `brand/founders/`.
- [ ] Arvind duotone portrait (same) in `brand/founders/`.
- [ ] Hero illustration / mark in `brand/`.
- [ ] OG share image in `public/og-image.png`.
- [ ] Trust strip logos (grayscale SVG) in `brand/trust/`.
- [ ] All assets above also have alt-text strings written and committed alongside their `<img>` references.

---

## Tools summary

| Need | Free option | Paid option |
|---|---|---|
| Vector + layout | Figma (free for solo) | Affinity Designer (₹2,000) |
| Photo edit / duotone | Photopea, GIMP | Affinity Photo (₹2,000) |
| Upscale | Upscayl (open source) | Topaz Gigapixel |
| Compress | Squoosh | ImageOptim |
| Favicon generator | realfavicongenerator.net | — |
| OG template | Figma Community | — |
| Illustration | unDraw | Storyset (some free) |
| Stock photo | Unsplash | (avoid for ASM — use real photos) |

Total cost to a clean launch: ₹0 if you DIY in Photopea + Figma. ₹4,000-9,000 if you commission the logo on Fiverr and buy Affinity for ongoing edits.
