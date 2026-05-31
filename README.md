# asmfinance-web

Public landing site for **ASM Investments** — `https://asmfinance.tech` (custom domain on GitHub Pages).

Sister repo: [`asmfinance`](../asmfinance) (Go API + admin, at `api.asmfinance.tech`). The lead form POSTs to `https://api.asmfinance.tech/v1/leads` (CORS-allowed).

## Stack

- **Astro 4** — static, content-first; zero JS by default (per [ADR-002](docs/adr/002-framework-astro.md))
- **React 18 island** — only the contact form hydrates, and only when scrolled into view (`client:visible`)
- **Tailwind 3** — design tokens from [docs/03-design-system.md](docs/03-design-system.md)
- **TypeScript** strict · **pnpm** · **GitHub Pages** + Actions ([ADR-001](docs/adr/001-hosting-github-pages.md))

The only runtime JS on first paint is Astro's ~1 KB prefetch helper. The rest of the site is static HTML + CSS.

## Prerequisites

- **Node 22+** (a `.nvmrc` pins 22). Enable pnpm via corepack:
  ```bash
  corepack enable
  corepack prepare pnpm@latest --activate
  ```

## Local development

```bash
pnpm install            # install deps
pnpm dev                # dev server → http://localhost:4321
pnpm build              # type-check (astro check) + production build → dist/
pnpm preview            # serve the production build locally
pnpm check              # type-check only
```

Prefer `make`? Run `make help` to list targets — notably **`make preview`** (production build, then serve it locally to preview), plus `make dev`, `make build`, `make check`, and `make clean`.

Copy `.env.example` → `.env.local` for local env.

## Environment variables

All are build-time `PUBLIC_*` vars, inlined by Astro. None are secrets (the site is static; the API holds real secrets).

| Var | Purpose | Where set |
|---|---|---|
| `PUBLIC_API_BASE` | Lead API base; form POSTs to `${PUBLIC_API_BASE}/v1/leads` | `.env.local` / workflow |
| `PUBLIC_CALENDLY_URL` | Booking embed URL; blank = hide calendar, show form/WhatsApp | `.env.local` / workflow |
| `PUBLIC_PLAUSIBLE_DOMAIN` | Plausible domain; blank = no analytics script | `.env.local` / workflow |

## Project structure

```
src/
├── pages/            index · privacy · terms · nri  (.astro, static)
├── layouts/          BaseLayout.astro (head/meta/OG, Nav, Footer, skip-link)
├── components/       Button · Card · TrustChip · Eyebrow · Wordmark · Nav · Footer · Prose · SectionContainer
│   └── sections/     the 10 homepage sections, in spec order
├── islands/          ContactForm.tsx  (the only React/JS)
├── data/             site.json — editable business data (ARN, contact, CTA, form options)
├── lib/              site.ts / leads.ts — wire site.json into typed exports (+ env, submit)
└── styles/           global.css (@tailwind + fonts + base)
public/               CNAME · robots.txt · sitemap.xml · favicons · og-image.png · founders/
brand/                logo SVGs + founder composites (source)
scripts/              gen-assets.mjs (favicons + OG from the monogram)
```

## Content & design are spec-driven

- **Copy** is verbatim from [docs/02-content-spec.md](docs/02-content-spec.md) — that file is the source of truth.
- **Colors/type/spacing** come from [docs/03-design-system.md](docs/03-design-system.md), wired into `tailwind.config.js`. Components use tokens (`bg-forest`, `text-h2`), never hardcoded hex.
- **Editable business data** (ARN, contact details, CTA labels, contact-form dropdowns) lives in `src/data/site.json` — change it and redeploy, no code edits. See [CONTRIBUTING.md](CONTRIBUTING.md#editing-site-content-no-code-needed).

## Brand assets

Source files live in `brand/`. To regenerate placeholder favicons + the OG image from the monogram:

```bash
node scripts/gen-assets.mjs
```

Before launch, replace these with a proper set (realfavicongenerator.net) and a Figma OG image — see [docs/04-graphics-guide.md](docs/04-graphics-guide.md).

## Deployment

Push to `main` → GitHub Actions builds and deploys to Pages (`.github/workflows/deploy.yml`). One-time setup (DNS, Pages source, HTTPS) is in [docs/05-deployment.md](docs/05-deployment.md).

Verify after deploy:
```bash
curl -I https://asmfinance.tech           # expect HTTP/2 200, Server: GitHub.com
curl https://asmfinance.tech/CNAME        # expect: asmfinance.tech
pnpm dlx lighthouse https://asmfinance.tech --view   # target ≥ 95 across all four
```

## Before going live (human action)

- [ ] Buy `asmfinance.tech`; set DNS per docs/05 (4× A, 4× AAAA, `www` CNAME).
- [ ] Repo → Settings → Pages: source **GitHub Actions**, custom domain `asmfinance.tech`, enforce HTTPS.
- [ ] Ensure the API still accepts the lead payload without a Turnstile token (Turnstile was removed; the honeypot remains). Re-add a bot challenge later if spam appears.
- [ ] Set `PUBLIC_CALENDLY_URL` and `PUBLIC_PLAUSIBLE_DOMAIN`; set the real phone + AMFI ARN in `src/data/site.json` (the phone also builds the WhatsApp links).
- [ ] Legal review of `/privacy` and `/terms`.
- [ ] Replace placeholder favicons + OG image with finals.
- [ ] Ensure the API allows CORS from `https://asmfinance.tech` (per ADR-003).

See [CONTRIBUTING.md](CONTRIBUTING.md) for conventions.
