# ADR 002 — Use Astro for the landing site, React only for islands

- Status: Accepted
- Date: 2026-05-30
- Author: Sujay

## Context

The landing site is mostly content. There is exactly one interactive thing (the contact form). Performance budget is tight — the site loads in Mathura on 4G, and we want a Lighthouse 95+ score. The team's engineer has Go + K8s background but limited frontend experience; the framework choice should optimise for clear separation between content and code.

## Options considered

1. **Astro** with React islands
2. **Next.js static export (`output: 'export'`)**
3. **Vite + React (SPA)**
4. **Hugo** (Go-based static site generator)
5. **Plain HTML + a sprinkle of JS**

## Decision

**Astro with React islands.**

## Why

- **Zero-JS by default.** Astro renders pages to HTML and ships no JS unless you opt in per component. For a content site this is the right default — most of the page should not run JS.
- **React only where needed.** The contact form is the only interactive piece; we hydrate just that component (`client:visible`), keeping the rest of the page static. The engineer doesn't need to learn an entire frontend framework — they need to maintain one form component.
- **Markdown-native content.** FAQs, service descriptions, NRI deep-dive content live as Markdown in `src/content/`, edited in any text editor, no rebuild loop for content updates.
- **First-class TypeScript and Tailwind integrations.** Both Phase-1 must-haves.
- **Build output is a static directory.** Hosts anywhere (matches ADR-001).
- **Excellent docs and stability.** Astro 4+ is production-grade; the Indian developer community has solid resources.

## Why not Next.js export

Next.js works as a static export but optimises for the SSR case. Static-export support has had rough edges over time. The mental overhead of "remember to never use server components / server actions / dynamic routes" makes it a worse fit for a small team with no frontend ramp-up time. Astro never gives us that footgun in the first place.

## Why not Vite + React SPA

A SPA pays the cost of shipping the whole React runtime even for visitors who never interact with anything. That breaks our performance budget. SPAs also need extra work for SEO meta tags per page; Astro does this trivially.

## Why not Hugo

Hugo is faster to build and the engineer would be comfortable with the Go templating. But: limited componentisation makes design system reuse painful, and the contact form would need a separate JS solution bolted on. Astro gives us the speed + the React escape hatch.

## Why not plain HTML

Tempting for honesty's sake. But the four service tiers, the NRI band, the FAQ — these benefit from componentisation. Maintaining hand-rolled HTML for a 10-section site invites copy-paste drift. Astro is plain HTML for the visitor; we get componentisation for the developer.

## Consequences

- Stack: Astro 4.x, React 18+, Tailwind 3.x, TypeScript strict.
- The contact form lives at `src/islands/ContactForm.tsx` and is hydrated via `client:visible`.
- All other components are `.astro` — no JS shipped.
- Content (FAQ, NRI page body, service tier text) lives as `.md` or `.mdx` in `src/content/` using Astro Content Collections (typed via Zod).
- Build target: `dist/` per ADR-001.

## Revisit triggers

- More than 3 islands needed (e.g., live chat, client portal preview, dashboard widgets) → reconsider whether we want a SPA architecture or a portal subdomain.
- Astro major version with breaking changes → audit migration cost vs. switching frameworks.
