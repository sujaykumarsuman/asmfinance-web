# Design System — ASM Investments

This is the canonical brand definition. Both repos (`asmfinance-web` and `asmfinance`) consume from this file. If you change a token here, propagate it to `asmfinance/docs/06-design-system.md`.

## Brand essence

- **Heritage** — practice founded 2007, two-generation continuity.
- **Calm** — financial advisory, not fintech. Conviction, not hype.
- **Cream over white** — softer, more editorial than a typical SaaS site.
- **Money green over navy** — every wealth firm uses navy. We don't.
- **Gold accents, not glitter** — sparingly, for hairlines and small marks.

## Palette

### Surface (creams)
| Token | Hex | Use |
|---|---|---|
| `cream` | `#FBF8F1` | Default page background |
| `ivory` | `#F5EFE3` | Alternate section background, soft separation |
| `paper` | `#FDFBF6` | Card backgrounds, popovers, modals |

### Primary (forest greens)
| Token | Hex | Use |
|---|---|---|
| `forest` | `#1F5132` | Brand primary — H1, primary buttons, NRI band bg |
| `forest-dark` | `#163A23` | Button hover, focused states |
| `emerald` | `#2D6A4F` | Links, secondary buttons, badges |
| `sage` | `#95D5B2` | Subtle highlights, success badge bg |

### Accent
| Token | Hex | Use |
|---|---|---|
| `gold` | `#C9A227` | Eyebrow caps, hairlines, dividers, trust signals, pull quotes |
| `gold-soft` | `#E2C766` | Disabled / soft variant |
| `clay` | `#C26E3B` | Optional warm accent — use sparingly (1-2 places max) |

### Text
| Token | Hex | Use |
|---|---|---|
| `ink` | `#1A1A1A` | Body text on cream — highest contrast |
| `ink-soft` | `#2E2E2E` | Less-important text |
| `slate` | `#4B5563` | Captions, secondary text |
| `muted` | `#6B7280` | Footer, metadata, disabled labels |

### Functional
| Token | Hex | Use |
|---|---|---|
| `border` | `#E5DDD0` | Hairline borders (warm gray-beige) |
| `border-strong` | `#C7B89E` | Emphasised borders |
| `success` | `#2D6A4F` | Confirmation states (same as emerald) |
| `warn` | `#B7791F` | Warning states (warm yellow-brown) |
| `error` | `#9B2C2C` | Error states (deep red, not bright) |

### Contrast notes
- `ink` on `cream` = ratio 14.5:1 ✓ AAA
- `forest` on `cream` = ratio 7.8:1 ✓ AAA
- `gold` on `cream` = ratio 3.1:1 — use for caps headings only, **not for body**
- `cream` on `forest` = ratio 9.3:1 ✓ AAA (NRI band copy)

## Typography

### Fonts
- **Headings**: Fraunces (variable serif) — warm, distinctive, pairs with cream
- **Body + UI**: Inter (variable sans) — neutral, NRI-readable, screen-optimised
- **Devanagari headings (future)**: Tiro Devanagari Hindi
- **Numerals**: Inter with `font-variant-numeric: tabular-nums` for portfolio figures

Self-host via `@fontsource-variable/fraunces` and `@fontsource-variable/inter` for performance.

### Type scale

| Token | Size | Line | Weight | Use |
|---|---|---|---|---|
| `display` | `clamp(2.75rem, 4vw + 1rem, 4.5rem)` | 1.05 | 600 (Fraunces) | Hero H1 only |
| `h1` | `clamp(2.25rem, 2vw + 1.5rem, 3rem)` | 1.1 | 600 (Fraunces) | Page H1s |
| `h2` | `clamp(1.75rem, 1vw + 1.5rem, 2.25rem)` | 1.15 | 600 (Fraunces) | Section H2s |
| `h3` | `1.5rem` | 1.2 | 600 (Fraunces) | Card titles |
| `h4` | `1.25rem` | 1.3 | 600 (Inter) | Inline emphasis |
| `lead` | `1.25rem` | 1.55 | 400 (Inter) | Hero sub, section subs |
| `body` | `1rem` | 1.6 | 400 (Inter) | Default |
| `small` | `0.875rem` | 1.5 | 400 (Inter) | Captions, footer |
| `caps` | `0.75rem` | 1.4 | 600 (Inter), letter-spacing 0.08em | Gold eyebrow labels |

## Spacing

8px base. Use Tailwind's default scale; rely on `space-y-*` and `gap-*` over margins.

- Section vertical rhythm: `py-20 md:py-28 lg:py-32`
- Card interior: `p-6 md:p-8`
- Component gap: `gap-4` for small, `gap-8` for cards in a grid

## Layout

- Max content width: `1200px` (configure as `max-w-screen-xl` or custom `container`)
- Section gutters: `px-6 md:px-12 lg:px-20`
- Two-column desktop layouts: 50/50 with `gap-12` (or 60/40 when copy-heavy left)
- Grid for service tiers: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`

## Radii

| Token | Value | Use |
|---|---|---|
| `none` | 0 | Hairlines, dividers |
| `sm` | `0.25rem` | Inputs, chips |
| `md` | `0.5rem` | Buttons, cards |
| `lg` | `1rem` | Large cards |
| `xl` | `1.5rem` | Hero illustration containers |
| `full` | `9999px` | Pills, avatars |

## Shadows

Calm, low-spread. Avoid drop-shadow drama.

```
shadow-card:   0 1px 2px 0 rgba(22,58,35,0.04), 0 2px 8px -2px rgba(22,58,35,0.06)
shadow-pop:    0 4px 12px -4px rgba(22,58,35,0.10), 0 8px 24px -8px rgba(22,58,35,0.08)
shadow-focus:  0 0 0 3px rgba(31,81,50,0.25)
```

## Components — design specs

### Button
- Primary: `bg-forest text-cream hover:bg-forest-dark`, padding `px-5 py-3`, radius `md`, font-weight 500
- Secondary (ghost): `bg-transparent text-forest border border-forest hover:bg-forest hover:text-cream`
- Tertiary (text): `text-emerald underline-offset-4 hover:underline`
- Focus ring: `shadow-focus`

### Card
- Bg: `paper`, border: `border` (1px), radius: `lg`, shadow: `card`
- Top-left or top accent: thin gold rule (1px, 24px long) using `border-t-2 border-gold`

### Input / Form field
- Bg: `cream` (slightly inset on the cream page) OR `paper`
- Border: `border-strong`
- Focused: ring `shadow-focus`, border `forest`
- Padding: `px-4 py-3`
- Label: `caps` style above, gold

### TrustChip
- Bg: transparent, border: `border`, padding `px-3 py-1`, radius `full`, text `slate`, font `small`
- Optional left icon (16px)

### Eyebrow (small caps gold label)
- Style: `caps` token, color `gold`, margin-bottom `0.75rem`

### Section divider
- 1px hairline in `gold`, max-width 40px, centered or left-aligned per section

## Motion

- Default transition: `transition-colors duration-150 ease-out`
- Hover lift on cards: `transform: translateY(-2px)` over 200ms
- No parallax. No scroll-jacking. No autoplay video.

## Tailwind config snippet

Wire this into `tailwind.config.js`:

```js
// tailwind.config.js
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ['./src/**/*.{astro,html,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        cream:        '#FBF8F1',
        ivory:        '#F5EFE3',
        paper:        '#FDFBF6',
        forest:       '#1F5132',
        'forest-dark':'#163A23',
        emerald:      '#2D6A4F',
        sage:         '#95D5B2',
        gold:         '#C9A227',
        'gold-soft':  '#E2C766',
        clay:         '#C26E3B',
        ink:          '#1A1A1A',
        'ink-soft':   '#2E2E2E',
        slate:        '#4B5563',
        muted:        '#6B7280',
        border:       '#E5DDD0',
        'border-strong':'#C7B89E',
        success:      '#2D6A4F',
        warn:         '#B7791F',
        error:        '#9B2C2C',
      },
      fontFamily: {
        serif: ['"Fraunces Variable"', ...defaultTheme.fontFamily.serif],
        sans:  ['"Inter Variable"',    ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        display: ['clamp(2.75rem, 4vw + 1rem, 4.5rem)', { lineHeight: '1.05' }],
        h1:      ['clamp(2.25rem, 2vw + 1.5rem, 3rem)', { lineHeight: '1.1' }],
        h2:      ['clamp(1.75rem, 1vw + 1.5rem, 2.25rem)', { lineHeight: '1.15' }],
      },
      boxShadow: {
        card:  '0 1px 2px 0 rgba(22,58,35,0.04), 0 2px 8px -2px rgba(22,58,35,0.06)',
        pop:   '0 4px 12px -4px rgba(22,58,35,0.10), 0 8px 24px -8px rgba(22,58,35,0.08)',
        focus: '0 0 0 3px rgba(31,81,50,0.25)',
      },
      borderRadius: { md: '0.5rem', lg: '1rem' },
      container: { center: true, padding: { DEFAULT: '1.5rem', md: '3rem', lg: '5rem' } },
    },
  },
};
```
