/**
 * ASM Investments — lead-capture Worker (interim backend).
 *
 * Receives the contact-form POST, validates + honeypots, and forwards the lead
 * to a Google Apps Script web app that emails it from your own Google Workspace
 * (contact@asmfinance.tech). No third-party email vendor — the Worker only adds
 * CORS + validation in front of your Workspace.
 *
 *   form  ->  this Worker (CORS, validate, honeypot)  ->  Apps Script  ->  Gmail
 *
 * Secrets (set with `wrangler secret put <NAME>`):
 *   APPS_SCRIPT_URL      — the Apps Script web-app /exec URL
 *   LEADS_SHARED_SECRET  — random token; must equal SHARED_SECRET in leads.gs
 * Vars (wrangler.toml):
 *   ALLOWED_ORIGIN       — comma-separated allowed origins
 */

const SEGMENTS = {
  core: 'Core',
  premium: 'Premium',
  wealth: 'Wealth',
  nri: 'NRI',
  exploring: 'Just exploring',
};

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const cors = corsHeaders(origin, env);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    const url = new URL(request.url);

    if (request.method === 'GET') {
      return new Response('ASM leads worker is running. POST JSON to /v1/leads.', {
        status: 200,
        headers: { 'Content-Type': 'text/plain', ...cors },
      });
    }

    if (request.method !== 'POST' || !url.pathname.endsWith('/v1/leads')) {
      return json({ error: 'not_found' }, 404, cors);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'validation_failed', fields: { body: 'invalid JSON' } }, 400, cors);
    }

    // Honeypot — bots fill `website`. Pretend success, never forward.
    if (body.website && String(body.website).trim() !== '') {
      return json({ id: leadId(), status: 'received' }, 201, cors);
    }

    // Validate (mirrors the form rules + ADR-003).
    const fields = {};
    const name = String(body.full_name || '').trim();
    if (name.length < 2 || name.length > 100) fields.full_name = 'required, 2-100 chars';
    const email = String(body.email || '').trim();
    const whatsapp = String(body.whatsapp || '').trim();
    if (!email && !whatsapp) fields.contact = 'email or whatsapp required';
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fields.email = 'invalid email';
    if (!body.country) fields.country = 'required';
    if (!SEGMENTS[body.segment]) fields.segment = 'invalid segment';
    if (body.consent !== true) fields.consent = 'consent required';
    if (Object.keys(fields).length) {
      return json({ error: 'validation_failed', fields }, 400, cors);
    }

    const id = leadId();
    const ok = await forwardToScript(env, id, body);
    if (!ok) return json({ error: 'temporarily_unavailable' }, 503, cors);

    return json({ id, status: 'received' }, 201, cors);
  },
};

function corsHeaders(origin, env) {
  const allowed = String(env.ALLOWED_ORIGIN || 'https://asmfinance.tech')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const allow = allowed.includes(origin) ? origin : allowed[0];
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '3600',
    Vary: 'Origin',
  };
}

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors },
  });
}

function leadId() {
  const rnd =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID().replace(/-/g, '')
      : Math.random().toString(36).slice(2);
  return `lead_${rnd}`;
}

/** Forward the validated lead to the Apps Script web app, which sends the email. */
async function forwardToScript(env, id, lead) {
  if (!env.APPS_SCRIPT_URL) return false;
  try {
    const res = await fetch(env.APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: env.LEADS_SHARED_SECRET, id, lead }),
      // Apps Script /exec runs doPost, then 302-redirects to googleusercontent
      // (whose body isn't readable server-side). A 302/opaqueredirect means doPost
      // executed; with a matching secret the email was sent. So don't follow it.
      redirect: 'manual',
    });
    if (res.status === 302 || res.status === 0) return true;
    if (res.ok) return /"ok"\s*:\s*true/.test(await res.text().catch(() => ''));
    return false;
  } catch {
    return false;
  }
}
