# Lead-capture Worker (interim backend)

A tiny Cloudflare Worker that receives the contact-form POST and **emails the lead
to `contact@asmfinance.tech` from your own Google Workspace** — via a small Google
Apps Script. Free, no third-party email vendor, no extra DNS. It implements the same
`POST /v1/leads` contract the site already uses, so the frontend doesn't change —
you just point `PUBLIC_API_BASE` at this Worker.

```
form  ->  Worker (CORS + validate + honeypot)  ->  Apps Script  ->  Gmail (your Workspace)
```

When you build the full Go API later, repoint `PUBLIC_API_BASE` and delete `worker/`.

## 1. Apps Script (the email sender) — ~5 min

1. Sign in as **`contact@asmfinance.tech`** and open [script.google.com](https://script.google.com) → **New project**.
2. Paste **`leads.gs`** in as `Code.gs`.
3. Set `SHARED_SECRET` to a long random string — e.g. `openssl rand -hex 24`.
4. **Deploy → New deployment → Web app:**
   - **Execute as:** Me (contact@asmfinance.tech)
   - **Who has access:** Anyone
   - Authorize when prompted, then **copy the `/exec` Web app URL.**

Only the Worker (which knows `SHARED_SECRET`) can actually trigger a send.

## 2. Deploy the Worker — ~2 min

From this `worker/` directory:

```bash
npx wrangler login
npx wrangler secret put APPS_SCRIPT_URL       # paste the /exec URL from step 1
npx wrangler secret put LEADS_SHARED_SECRET   # paste the SAME secret as in leads.gs
npx wrangler deploy                           # prints your Worker URL
```

That prints `https://asmfinance-leads.<your-subdomain>.workers.dev`.
(`ALLOWED_ORIGIN` is already set in `wrangler.toml`.)

> Prefer the dashboard? **Workers & Pages → Create → Worker**, paste `index.js`,
> add the `ALLOWED_ORIGIN` var and the two secrets under **Settings → Variables**, Deploy.

## 3. Point the site at the Worker — 1 min

In the **site** repo set `PUBLIC_API_BASE` to your Worker URL (no trailing slash):

- `.github/workflows/deploy.yml` → under `pnpm build` `env:` change
  `PUBLIC_API_BASE: https://api.asmfinance.tech` → your `…workers.dev` URL.
- `.env.local` (local dev) → same.

Push to `main` → the site redeploys and the form posts to the Worker
(`${PUBLIC_API_BASE}/v1/leads`).

## 4. Test

```bash
curl -i -X POST https://asmfinance-leads.<sub>.workers.dev/v1/leads \
  -H 'Content-Type: application/json' -H 'Origin: https://asmfinance.tech' \
  -d '{"full_name":"Test Lead","email":"you@example.com","country":"IN","segment":"core","consent":true}'
# expect: 201 {"id":"lead_...","status":"received"}  + an email in contact@asmfinance.tech
```

## Notes

- **Sender:** create the Apps Script while signed in as `contact@asmfinance.tech` so
  mail comes from that address. Apps Script's MailApp quota (~1,500/day on Workspace)
  is far above a contact form's needs.
- **Spam:** the honeypot is enforced in the Worker. No rate limiting yet (needs
  Workers KV); add a Cloudflare rate-limit rule if spam appears.
- **No storage:** this only emails. To also keep a running log, have `leads.gs` append
  a row to a Google Sheet (`SpreadsheetApp`) — a couple of extra lines.
