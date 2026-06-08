# Lead-capture Worker (interim backend)

A tiny Cloudflare Worker that receives the contact-form POST and **emails the lead
to your Gmail** via [Resend](https://resend.com). Free, serverless, no VPS. It
implements the same `POST /v1/leads` contract the site already uses, so the
frontend doesn't change — you just point `PUBLIC_API_BASE` at this Worker.

When you build the full Go API later, swap `PUBLIC_API_BASE` back and delete this.

## 1. Resend (the email sender) — 2 min

1. Sign up at [resend.com](https://resend.com) **using `asminvestments@gmail.com`** —
   that lets emails reach that inbox immediately, before any domain setup.
2. Create an **API key** (Dashboard → API Keys). Copy it.
3. Sender: the default `onboarding@resend.dev` works right away for delivery to
   your own signup address. Later, verify `asmfinance.tech` in Resend (add the DNS
   records it shows) and change `FROM_EMAIL` to e.g. `ASM Leads <leads@asmfinance.tech>`.

## 2. Deploy the Worker — 2 min

From this `worker/` directory:

```bash
npx wrangler login                      # opens a browser to authorize Cloudflare
npx wrangler secret put RESEND_API_KEY  # paste the Resend key when prompted
npx wrangler deploy                     # prints your Worker URL
```

That prints a URL like `https://asmfinance-leads.<your-subdomain>.workers.dev`.

> Prefer no CLI? In the Cloudflare dashboard: **Workers & Pages → Create → Worker**,
> paste `index.js`, add the `[vars]` from `wrangler.toml` under **Settings → Variables**,
> add `RESEND_API_KEY` as a **secret**, and Deploy.

Edit `TO_EMAIL` / `FROM_EMAIL` / `ALLOWED_ORIGIN` in `wrangler.toml` first if needed.

## 3. Point the site at the Worker — 1 min

In the **site** repo, set `PUBLIC_API_BASE` to your Worker URL (no trailing slash):

- `.github/workflows/deploy.yml` → under `pnpm build` `env:` change
  `PUBLIC_API_BASE: https://api.asmfinance.tech` → your `…workers.dev` URL.
- `.env.local` (for local dev) → same.

Push to `main` → the site redeploys and the form now posts to the Worker
(`${PUBLIC_API_BASE}/v1/leads`).

## 4. Test

```bash
curl -i -X POST https://asmfinance-leads.<sub>.workers.dev/v1/leads \
  -H 'Content-Type: application/json' -H 'Origin: https://asmfinance.tech' \
  -d '{"full_name":"Test Lead","email":"you@example.com","country":"IN","segment":"core","consent":true}'
# expect: HTTP/1.1 201 + {"id":"lead_...","status":"received"}  and an email in your inbox
```

## Notes

- **Spam:** the honeypot is enforced here too. No rate limiting yet (that needs
  Workers KV); if spam appears, add a Cloudflare rate-limit rule or a bot challenge.
- **No storage:** this only emails. To also keep a log, add a Google Sheet or
  Workers KV/D1 sink later (easy to bolt on).
- **Custom domain (optional):** bind the Worker to `api.asmfinance.tech` in
  Cloudflare and you can keep `PUBLIC_API_BASE=https://api.asmfinance.tech`.
