import defaultTheme from 'tailwindcss/defaultTheme';

/**
 * Design tokens — single source of truth is docs/03-design-system.md.
 * Every value below is mapped 1:1 from that doc. Components must use these
 * tokens (e.g. `bg-forest`, `text-h2`) and never hardcode hex.
 *
 * Note: naming single-tone colors `slate`/`emerald`/`success` intentionally
 * REPLACES Tailwind's built-in numeric scales for those names (e.g. there is
 * no `bg-emerald-500`). This is per the design system, which uses one tone each.
 *
 * @type {import('tailwindcss').Config}
 */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        // Surface (creams)
        cream: '#FBF8F1',
        ivory: '#F5EFE3',
        paper: '#FDFBF6',
        // Primary (forest greens)
        forest: '#1F5132',
        'forest-dark': '#163A23',
        emerald: '#2D6A4F',
        sage: '#95D5B2',
        // Accent
        gold: '#C9A227',
        'gold-soft': '#E2C766',
        clay: '#C26E3B',
        // Text
        ink: '#1A1A1A',
        'ink-soft': '#2E2E2E',
        slate: '#4B5563',
        muted: '#6B7280',
        // Functional
        border: '#E5DDD0',
        'border-strong': '#C7B89E',
        success: '#2D6A4F',
        warn: '#B7791F',
        error: '#9B2C2C',
      },
      fontFamily: {
        serif: ['"Fraunces Variable"', ...defaultTheme.fontFamily.serif],
        sans: ['"Inter Variable"', ...defaultTheme.fontFamily.sans],
      },
      // Full type scale from docs/03-design-system.md §Type scale.
      fontSize: {
        display: ['clamp(2.75rem, 4vw + 1rem, 4.5rem)', { lineHeight: '1.05', fontWeight: '600' }],
        h1: ['clamp(2.25rem, 2vw + 1.5rem, 3rem)', { lineHeight: '1.1', fontWeight: '600' }],
        h2: ['clamp(1.75rem, 1vw + 1.5rem, 2.25rem)', { lineHeight: '1.15', fontWeight: '600' }],
        h3: ['1.5rem', { lineHeight: '1.2', fontWeight: '600' }],
        h4: ['1.25rem', { lineHeight: '1.3', fontWeight: '600' }],
        lead: ['1.25rem', { lineHeight: '1.55', fontWeight: '400' }],
        body: ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        small: ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        caps: ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.08em', fontWeight: '600' }],
      },
      letterSpacing: { caps: '0.08em' },
      boxShadow: {
        card: '0 1px 2px 0 rgba(22,58,35,0.04), 0 2px 8px -2px rgba(22,58,35,0.06)',
        pop: '0 4px 12px -4px rgba(22,58,35,0.10), 0 8px 24px -8px rgba(22,58,35,0.08)',
        focus: '0 0 0 3px rgba(31,81,50,0.25)',
      },
      // Radii from §Radii (none=0 and full=9999px are Tailwind defaults already).
      borderRadius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '1rem',
        xl: '1.5rem',
      },
      // §Layout: max content width 1200px. Used by SectionContainer (max-w-content).
      maxWidth: { content: '75rem' },
      container: {
        center: true,
        padding: { DEFAULT: '1.5rem', md: '3rem', lg: '5rem' },
      },
      // §Motion: hover lift on cards.
      transitionTimingFunction: { out: 'cubic-bezier(0.16, 1, 0.3, 1)' },
      // Spacing: §Spacing says use Tailwind's default 8px scale — intentionally no overrides.
    },
  },
  plugins: [],
};
