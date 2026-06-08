/**
 * ASM Investments — lead-capture Worker (interim backend).
 *
 * Receives the contact-form POST from the static site, emails the lead to the
 * configured inbox via Resend (https://resend.com), and replies per the
 * ADR-003 contract (201 / 400 / 503). No database — just a notification email.
 *
 * Config (wrangler.toml [vars], except the API key which is a secret):
 *   RESEND_API_KEY  (secret) — set with `wrangler secret put RESEND_API_KEY`
 *   TO_EMAIL        (var)    — where leads land, e.g. asminvestments@gmail.com
 *   FROM_EMAIL      (var)    — sender, e.g. "ASM Leads <onboarding@resend.dev>"
 *                             (use your verified domain once set up in Resend)
 *   ALLOWED_ORIGIN  (var)    — comma-separated, e.g.
 *                             "https://asmfinance.tech,http://localhost:4321"
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

    // Friendly health check in the browser.
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

    // Honeypot — bots fill `website`. Pretend success, never email.
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
    const ok = await sendEmail(env, id, body);
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
  const rnd = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID().replace(/-/g, '')
    : Math.random().toString(36).slice(2);
  return `lead_${rnd}`;
}

async function sendEmail(env, id, lead) {
  const seg = SEGMENTS[lead.segment] || lead.segment;
  const row = (k, v) =>
    `<tr><td style="padding:4px 12px 4px 0;color:#6B7280"><b>${k}</b></td><td style="padding:4px 0">${esc(v) || '—'}</td></tr>`;
  const html = `
    <div style="font-family:system-ui,Segoe UI,Arial,sans-serif;font-size:14px;color:#1A1A1A">
      <h2 style="color:#1F5132;margin:0 0 12px">New enquiry via asmfinance.tech</h2>
      <table style="border-collapse:collapse">
        ${row('Name', lead.full_name)}
        ${row('Email', lead.email)}
        ${row('WhatsApp', lead.whatsapp)}
        ${row('Country', lead.country)}
        ${row('Looking for', seg)}
        ${row('Message', lead.message)}
        ${row('Consent', lead.consent === true ? 'yes' : 'no')}
        ${row('Lead id', id)}
      </table>
    </div>`;
  const text = [
    'New enquiry via asmfinance.tech',
    '',
    `Name:        ${lead.full_name}`,
    `Email:       ${lead.email || '—'}`,
    `WhatsApp:    ${lead.whatsapp || '—'}`,
    `Country:     ${lead.country}`,
    `Looking for: ${seg}`,
    `Message:     ${lead.message || '—'}`,
    `Consent:     ${lead.consent === true ? 'yes' : 'no'}`,
    `Lead id:     ${id}`,
  ].join('\n');

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.FROM_EMAIL || 'ASM Leads <onboarding@resend.dev>',
        to: [env.TO_EMAIL],
        reply_to: lead.email || undefined,
        subject: `New enquiry: ${lead.full_name} — ${seg}`,
        text,
        html,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

function esc(s) {
  return String(s ?? '').replace(
    /[&<>"]/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c],
  );
}
