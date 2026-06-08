/**
 * ASM Investments — lead mailer (Google Apps Script web app).
 *
 * Receives a lead from the Cloudflare Worker and emails it from your Google
 * Workspace. No third-party sender.
 *
 * Setup:
 *   1. Sign in as contact@asmfinance.tech, go to https://script.google.com → New project.
 *   2. Paste this file in as Code.gs.
 *   3. Set SHARED_SECRET below to a long random string (e.g. `openssl rand -hex 24`).
 *   4. Deploy → New deployment → type "Web app":
 *        Execute as:        Me (contact@asmfinance.tech)
 *        Who has access:    Anyone
 *      Authorize when prompted. Copy the "/exec" Web app URL.
 *   5. In the Worker, set the same secret + that URL:
 *        wrangler secret put APPS_SCRIPT_URL       (paste the /exec URL)
 *        wrangler secret put LEADS_SHARED_SECRET   (paste the SAME secret as below)
 */

const SHARED_SECRET = 'CHANGE-ME-to-a-long-random-string';
const TO = 'contact@asmfinance.tech';

const SEGMENTS = {
  core: 'Core',
  premium: 'Premium',
  wealth: 'Wealth',
  nri: 'NRI',
  exploring: 'Just exploring',
};

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    if (body.secret !== SHARED_SECRET) {
      return json({ ok: false, error: 'unauthorized' });
    }
    const lead = body.lead || {};
    const seg = SEGMENTS[lead.segment] || lead.segment || '—';
    const text = [
      'New enquiry via asmfinance.tech',
      '',
      'Name:        ' + (lead.full_name || '—'),
      'Email:       ' + (lead.email || '—'),
      'WhatsApp:    ' + (lead.whatsapp || '—'),
      'Country:     ' + (lead.country || '—'),
      'Looking for: ' + seg,
      'Message:     ' + (lead.message || '—'),
      'Consent:     ' + (lead.consent === true ? 'yes' : 'no'),
      'Lead id:     ' + (body.id || '—'),
    ].join('\n');

    MailApp.sendEmail({
      to: TO,
      subject: 'New enquiry: ' + (lead.full_name || 'Unknown') + ' — ' + seg,
      body: text,
      name: 'ASM Investments',
      replyTo: lead.email || undefined,
    });
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function doGet() {
  return json({ ok: true, service: 'asm-leads' });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
