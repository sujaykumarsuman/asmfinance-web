# Deployment — asmfinance-web

Static site → GitHub Pages → custom domain `asmfinance.in`. Free TLS, free CDN, zero VPS load.

## DNS (one-time, on your domain registrar)

Buy `asmfinance.in` from Hostinger / Namecheap / Bigrock. Set DNS:

```
Type    Host    Value                         TTL
A       @       185.199.108.153               3600
A       @       185.199.109.153               3600
A       @       185.199.110.153               3600
A       @       185.199.111.153               3600
AAAA    @       2606:50c0:8000::153           3600
AAAA    @       2606:50c0:8001::153           3600
AAAA    @       2606:50c0:8002::153           3600
AAAA    @       2606:50c0:8003::153           3600
CNAME   www     <your-gh-username>.github.io  3600
```

The four `A` records are GitHub Pages' IPs. The `CNAME` for `www` points back to your GitHub Pages site.

In the repo, commit `public/CNAME` containing exactly:

```
asmfinance.in
```

## GitHub repo settings

1. Push the repo to GitHub: `github.com/<user>/asmfinance-web` (recommend private).
2. Repo Settings → Pages:
   - Source: **GitHub Actions** (not "Deploy from branch").
   - Custom domain: `asmfinance.in`.
   - Tick "Enforce HTTPS" once the cert is issued (5-20 min after DNS propagates).

## Build + deploy workflow

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch: {}

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
        env:
          PUBLIC_API_BASE: https://api.asmfinance.tech
          PUBLIC_TURNSTILE_SITE_KEY: ${{ secrets.PUBLIC_TURNSTILE_SITE_KEY }}
      - uses: actions/upload-pages-artifact@v3
        with: { path: ./dist }

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

### Required GitHub Actions secrets

- `PUBLIC_TURNSTILE_SITE_KEY` — Cloudflare Turnstile site key for the contact form's anti-bot.

`PUBLIC_API_BASE` can stay as an env var in the workflow (not secret).

## Astro config

`astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://asmfinance.in',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  integrations: [tailwind({ applyBaseStyles: false }), react()],
  prefetch: { prefetchAll: false },
});
```

`build.format: 'directory'` means `/about` resolves to `/about/index.html`, which GitHub Pages handles cleanly.

## Local development

```bash
# Prereqs
node --version    # 22+
corepack enable
corepack prepare pnpm@latest --activate

# First time
pnpm install

# Dev server
pnpm dev          # http://localhost:4321

# Production build, served locally
pnpm build && pnpm preview
```

## Environment variables

| Var | Build/runtime | Where set |
|---|---|---|
| `PUBLIC_API_BASE` | build | `.env.local` for dev, workflow for CI |
| `PUBLIC_TURNSTILE_SITE_KEY` | build | secret |
| `PUBLIC_CALENDLY_URL` | build | env, not secret |
| `PUBLIC_WHATSAPP_NUMBER` | build | env |

Astro inlines `PUBLIC_*` vars at build time. No runtime secrets are ever exposed (the form posts to the API, which holds the real secrets).

## Verifying the deploy

After first deploy:

```
curl -I https://asmfinance.in
# expect HTTP/2 200 and a Server: GitHub.com header.

curl https://asmfinance.in/CNAME
# expect: asmfinance.in
```

Check Lighthouse: `pnpm dlx lighthouse https://asmfinance.in --view`. Target ≥ 95 on all four categories.

## Rollback

GitHub Pages doesn't keep deploy history natively. Roll back by reverting the offending commit on `main` — the workflow redeploys from the new HEAD.

```bash
git revert <bad-commit>
git push
```

For a true safety net, tag every prod release (`git tag v0.1.0 && git push --tags`) so you can always check out a known-good build.

## What runs server-side: nothing

There is no server. Form submissions hit `api.asmfinance.tech`. Calendar embeds load from Calendly/Zcal. Analytics from Plausible. The site itself is 100% static HTML, CSS, and a tiny amount of hydrated JS for the form island.
