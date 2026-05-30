# Start Here

You (Claude Code, or a future contributor) are reading the planning bundle for the **ASM Investments landing site**. This page tells you what to read, in what order, and what to do next.

## Context in one paragraph

ASM Investments is a financial advisory practice founded in **2007 by Anjali Suman**, expanded by **Arvind Kumar Suman in 2017** (AMFI-registered IFA). Based in Mathura, UP. Current AUM ₹30-50 Cr, mostly older clients across Delhi-NCR, UP, South India, East India, plus a few HNI and NRI relationships. Stack being built so the practice can scale to ₹300 Cr AUM and a structured NRI book (US/Canada, UK/EU, GCC, Singapore/SEA) over 36 months. See the four baseline documents in the parent project folder (`../`) for full context — especially `4-Business-Plan.docx`.

## Reading order

1. **This file** — orientation.
2. `02-content-spec.md` — every section of the landing page, written copy.
3. `03-design-system.md` — palette, typography, spacing, tokens.
4. `04-graphics-guide.md` — logo creation, photo treatment, icons, illustrations.
5. `05-deployment.md` — GitHub Pages + custom domain + GH Actions.
6. ADRs in `adr/` — frozen architecture decisions.
7. `01-claude-code-prompt.md` — the prompt to drive the build session.

## What you (Claude Code) should produce

Follow `01-claude-code-prompt.md`. In short:

- An Astro project scaffold with Tailwind, React islands for the lead form.
- All sections per `02-content-spec.md` implemented.
- Design tokens from `03-design-system.md` wired into `tailwind.config.js`.
- GH Actions workflow for deploy.
- README updated with local-dev instructions.
- Brand assets referenced from `brand/` (placeholders OK at first).

## Non-goals for this site

- No SSR, no Node runtime, no backend logic.
- No client portal (that lives in `asmfinance`).
- No authentication.
- No localStorage / sessionStorage (we may build this static, no need).
- No tracking other than Plausible (privacy-first analytics) — see ADR-003.

## Key constraints

- **DPDP-compliant by default** — explicit consent checkbox on the lead form, privacy notice link in footer.
- **SEBI-mandated disclosure** in footer: *"Mutual fund investments are subject to market risks. Read all scheme-related documents carefully."* + ARN number + NISM credentials.
- **Performance** — Lighthouse ≥ 95 across all categories. This site loads in Mathura on 4G; we can't afford bloat.
- **Accessibility** — WCAG AA, semantic HTML, keyboard navigable.
- **Bilingual readiness** — copy in English now, Hindi later. Use `lang` attributes correctly.

## Reference to sister repo

The lead form on this site posts to `https://api.asmfinance.tech/v1/leads`. That endpoint lives in [`asmfinance`](../asmfinance). Coordinate any request/response schema changes via shared OpenAPI spec (to live at `asmfinance/docs/openapi.yaml` once that repo is built).
