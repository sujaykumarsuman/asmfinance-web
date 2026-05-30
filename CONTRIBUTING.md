# Contributing to asmfinance-web

A small static marketing site. Keep it fast, accessible, and on-brand.

## Getting set up

```bash
corepack enable
pnpm install
cp .env.example .env.local
pnpm dev
```

## Editing site content (no code needed)

Common business data lives in **`src/data/site.json`** — edit it and redeploy (push to `main`; CI rebuilds). No component changes required:

- `brand` — name, tagline, **AMFI ARN**, credentials line
- `contact` — **email**, privacy email, **phone**, office, office hours
- `cta` — the two button labels
- `form` — the consent sentence, the **Country / Region** list, and the **"I'm looking for"** list

For form segments, `label` is what the visitor sees; `segment` is the value sent to the API and must stay one of `core | premium | wealth | nri | exploring` (the frozen contract in ADR-003). Keep it valid JSON (no trailing commas) — the build fails loudly if it isn't.

Marketing prose (hero, section copy, FAQ, service-tier details) still lives in the section components, verbatim from `docs/02-content-spec.md`. Ask if you want those externalised too.

## Non-negotiables (from the docs)

These are enforced by review — see `docs/`:

- **Copy is verbatim** from `docs/02-content-spec.md`. Don't paraphrase marketing copy; if it needs to change, change the spec first (with owner approval).
- **Colors via tokens only.** Use Tailwind tokens (`bg-forest`, `text-gold`, `text-h2`) defined in `tailwind.config.js`. Never hardcode hex in a component.
- **No `localStorage` / `sessionStorage`.** Anywhere.
- **Accessibility (WCAG AA):** semantic HTML, a `label` for every input, `alt` on every image, visible focus rings, keyboard-operable. Prefer native elements (e.g. the FAQ uses `<details>`).
- **Performance:** zero JS by default. Only add a React island if it's genuinely interactive, and hydrate it `client:visible`. Lighthouse target ≥ 95 on all four categories.
- **Analytics:** Plausible only. No GA4, Meta Pixel, chat widgets, or tracking cookies.
- **Don't relitigate ADRs** (`docs/adr/`). Propose a new ADR instead.

## Conventions

- **Components** are `.astro` (no JS shipped). React (`.tsx`) lives in `src/islands/` and is the exception, not the rule.
- **Shared values** (nav, contact details, env) live in `src/lib/site.ts`. The lead-form contract lives in `src/lib/leads.ts` — keep it in sync with the API's OpenAPI spec.
- **Section components** go in `src/components/sections/` and are composed in `src/pages/index.astro` in the spec's order (do not rearrange).
- Run `pnpm check` (type-check) and `pnpm build` before pushing. CI runs `astro check && astro build`.

## Adding a page

1. Create `src/pages/<name>.astro` using `BaseLayout`.
2. Add a `<url>` entry to `public/sitemap.xml` (it's hand-maintained).
3. Link it from the nav (`src/lib/site.ts` `NAV_LINKS`) and/or footer if it's primary navigation.

## Brand assets

Regenerate placeholder favicons + OG image after a logo change:

```bash
node scripts/gen-assets.mjs
```

## Commits / PRs

- Branch off `main`; open a PR. `main` auto-deploys on merge.
- Keep PRs focused. Note any deviation from the docs in the description.
- Tag prod releases (`git tag v0.1.0 && git push --tags`) so you can always check out a known-good build.
