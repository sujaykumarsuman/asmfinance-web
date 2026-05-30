# ADR 001 — Host the landing site on GitHub Pages

- Status: Accepted
- Date: 2026-05-30
- Author: Sujay

## Context

ASM Investments needs a public landing site at `asmfinance.in`. The site is content-only — no auth, no business logic, no SSR. Form submissions go to a separate backend at `api.asmfinance.tech` already planned for the `asmfinance` repo on a Hostinger VPS. The site needs fast global delivery, HTTPS, custom-domain support, and ideally zero recurring infrastructure cost.

## Options considered

1. **GitHub Pages** with custom domain
2. **Cloudflare Pages** with custom domain
3. **Hostinger VPS** (the one already paid for)
4. **Vercel** with custom domain

## Decision

**GitHub Pages.** Reasons in priority order:

- Zero recurring cost. Cloudflare Pages also free; Vercel free tier has bandwidth caps that become friction.
- Already comes with the repo. No extra dashboard, no extra account.
- Free TLS, automatic certificate management.
- Atomic deploys via GitHub Actions — pair naturally with the workflow we'll use for everything else.
- Global CDN backed by Fastly. Adequate latency in India.
- Public repo gets analytics via GitHub Insights for free.

## Trade-offs accepted

- **Static only.** No server-side anything. The contact form must post to our API (cross-origin) — explicit choice. We don't want form logic on Pages anyway; it would split concerns.
- **No edge functions.** If we later need SSR for a `/blog` with dynamic content, we'd have to either move blog content into Astro's static rendering or migrate to Cloudflare Pages.
- **GitHub-specific.** Lock-in is low because Astro builds a generic `dist/` we can serve anywhere. Migration cost ~30 minutes.

## Cloudflare Pages — why not (yet)

Cloudflare Pages is arguably better for India latency (Cloudflare PoP in Mumbai is closer than Fastly's). Acceptable migration target if Lighthouse on Indian 4G shows TTFB > 200ms on Pages. For now, GitHub Pages keeps the workflow simpler.

## Hostinger VPS — why not

We're using the VPS for the API and admin. Hosting the landing there means a single point of failure for both customer-acquisition and customer-management. Splitting them is the cheapest disaster-recovery posture we get for free.

## Vercel — why not

Vercel is excellent but the free tier's bandwidth cap (100 GB/month) is a soft constraint we'd worry about during a viral moment. The paid tier doesn't justify itself for a static site.

## Consequences

- Repo must contain a `public/CNAME` file with `asmfinance.in`.
- DNS for `asmfinance.in` configured per `docs/05-deployment.md`.
- All client-side code must be pre-rendered — no on-demand SSR.
- The contact form needs CORS headers from `api.asmfinance.tech` whitelisting `https://asmfinance.in`.

## Revisit triggers

- Lighthouse TTFB on Indian 4G > 200ms consistently → move to Cloudflare Pages.
- Need for any SSR (i18n with content negotiation, A/B tests with server logic) → reconsider Cloudflare Pages or Vercel.
- GitHub price changes affecting Pages tier.
