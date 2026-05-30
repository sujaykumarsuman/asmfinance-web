# ADR 003 — Contact form posts to the API directly, with Turnstile

- Status: Accepted
- Date: 2026-05-30
- Author: Sujay

## Context

The landing site needs a lead capture form. The site is static on GitHub Pages. Form submissions need to (a) reach our database, (b) trigger an email/WhatsApp notification, (c) be DPDP-compliant, and (d) survive obvious spam.

## Options considered

1. **Direct POST from browser to `api.asmfinance.tech/v1/leads`**
2. **Third-party form service** (Formspree, Getform, Basin)
3. **Email-only** (`mailto:` link)
4. **Netlify/Cloudflare form handlers**

## Decision

**Direct browser POST to our own API, with Cloudflare Turnstile as the bot challenge.**

## Why

- **One source of truth.** The lead lives in our database the moment it's captured — no syncing from a third-party service to our backend later.
- **Our schema, our control.** We can evolve the request shape (add `country`, `segment`, etc.) without negotiating with a vendor's CRM-like UI.
- **No data shared with a third party.** DPDP-relevant. Even Formspree storing names + emails on a US server creates a cross-border-transfer question we don't need.
- **Cost: zero.** Vs $20+/mo for a paid Formspree tier.
- **Turnstile is free, privacy-first, and works in India.** No CAPTCHA images, no cookies, no Google.

## Why not third-party form services

- Adds a cross-border data transfer to the privacy notice.
- Adds a vendor account to manage.
- Doesn't write to our DB directly without webhook glue.
- Free tiers are small and rate-limited.

## Why not email-only

- Fragile. No structured data. Goes to spam.
- Doesn't capture into our CRM-equivalent (admin portal lead list).
- Bad UX — users get no in-page confirmation.

## Why not Netlify/Cloudflare form handlers

- Tied to that hosting provider, which we don't use.
- Cloudflare Pages forms would also imply changing the hosting decision (ADR-001).

## Implementation

### Request

```
POST https://api.asmfinance.tech/v1/leads
Content-Type: application/json
Origin: https://asmfinance.in

{
  "full_name": "string, 2-100 chars, required",
  "email": "string, RFC 5322, optional if whatsapp provided",
  "whatsapp": "string, +CC...., optional if email provided",
  "country": "string, ISO 3166 alpha-2 or 'OTHER', required",
  "segment": "core | premium | wealth | nri | exploring",
  "message": "string, max 1500 chars, optional",
  "consent": true,
  "turnstile_token": "string, required"
}
```

### Response

```
201 Created
{ "id": "lead_01HXXX...", "status": "received" }

400 Bad Request
{ "error": "validation_failed", "fields": { ... } }

429 Too Many Requests
{ "error": "rate_limited", "retry_after_seconds": 60 }

503 Service Unavailable
{ "error": "temporarily_unavailable" }
```

### CORS

The API must reply with:

```
Access-Control-Allow-Origin: https://asmfinance.in
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
Access-Control-Max-Age: 3600
```

No credentials cookies. No `Access-Control-Allow-Credentials`.

### Anti-spam stack

1. **Honeypot field** — a hidden input named `website`. Real users leave it empty; bots fill it. If non-empty, return 201 but never persist.
2. **Cloudflare Turnstile** — invisible challenge, run on submit. Token verified server-side by the API.
3. **Rate limit at the API** — per-IP 5/min, per-email 3/hour. Caddy + an in-process limiter.
4. **Email/phone format validation** — both client- and server-side.

### Consent (DPDP)

- Checkbox is required to submit. Defaults to unchecked.
- Label text: "I consent to ASM Investments contacting me about this enquiry. I have read the [Privacy Notice](/privacy)."
- The API persists `consent_given_at` and `consent_text_version` so we have proof of what the user agreed to.

### Failure UX

- Network error: inline error, "Couldn't send — please try again or WhatsApp us." with WA link.
- Turnstile fail: inline error, "Please verify you're not a bot and try again."
- Server error: same as network, plus error logged client-side via Sentry (free tier) — to be added in Phase 2.

### Resilience without JS

- The form renders server-side from Astro. If the React island fails to hydrate, the form still posts (as a multipart form to a `mailto:` action) — declared in `<noscript>`. Worst case: the user emails us directly.

## Consequences

- API in `asmfinance` repo must implement `POST /v1/leads` per the contract above.
- API must support OPTIONS preflight.
- Turnstile site key + secret managed:
  - Site key as `PUBLIC_TURNSTILE_SITE_KEY` in this repo (build-time env).
  - Secret key in `asmfinance` API config.
- Privacy notice at `/privacy` referenced from the consent label.

## Revisit triggers

- Spam rate above ~5/day → add reCAPTCHA Enterprise or stricter rate limits.
- Lead volume > 100/day → introduce a queue between API and notifier.
- DPDP Rules clarification on "consent manager" framework → integrate.
