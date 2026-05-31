import { useEffect, useId, useRef, useState } from 'react';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { Send, Loader2, CheckCircle2, AlertCircle, MessageCircle } from 'lucide-react';
import {
  COUNTRY_OPTIONS,
  SEGMENT_OPTIONS,
  segmentEnumToKey,
  segmentForKey,
  isValidEmail,
  submitLead,
  CONSENT_TEXT,
  type CountryCode,
  type LeadPayload,
} from '../lib/leads';

export interface ContactFormProps {
  apiBase: string;
  turnstileSiteKey: string;
  email: string;
  whatsappHref?: string | null;
  privacyHref?: string;
}

type Status = 'idle' | 'submitting' | 'success' | 'error';
type FieldKey = 'fullName' | 'contact' | 'country' | 'segment' | 'consent' | 'turnstile';
type Errors = Partial<Record<FieldKey, string>>;

const inputCls =
  'w-full rounded-sm border border-border-strong bg-cream px-4 py-3 text-body text-ink placeholder:text-muted transition-colors focus:border-forest';
const labelCls = 'mb-1.5 block text-caps uppercase text-gold';
// Consent sentence is editable in src/data/site.json; the Privacy Notice link is
// injected where the phrase "Privacy Notice" appears.
const CONSENT_PARTS = CONSENT_TEXT.split('Privacy Notice');

export default function ContactForm({
  apiBase,
  turnstileSiteKey,
  email,
  whatsappHref,
  privacyHref = '/privacy',
}: ContactFormProps) {
  const [fullName, setFullName] = useState('');
  const [emailVal, setEmailVal] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [country, setCountry] = useState('');
  const [segmentKey, setSegmentKey] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(''); // honeypot — real users leave empty
  const [token, setToken] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorKind, setErrorKind] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});

  const turnstileRef = useRef<TurnstileInstance>(null);
  const uid = useId();
  const fid = (s: string) => `${uid}-${s}`;
  const err = (k: FieldKey) => (errors[k] ? fid(`${k}-err`) : undefined);

  // Prefill "I'm looking for" from a tier-CTA deep link (?seg=core|premium|wealth|nri).
  useEffect(() => {
    const key = segmentEnumToKey(new URLSearchParams(window.location.search).get('seg'));
    if (key) setSegmentKey(key);
  }, []);

  function validate(): Errors {
    const e: Errors = {};
    const name = fullName.trim();
    if (name.length < 2 || name.length > 100) e.fullName = 'Please enter your name (2–100 characters).';
    const hasEmail = emailVal.trim() !== '';
    const hasWa = whatsapp.trim() !== '';
    if (!hasEmail && !hasWa) e.contact = 'Add at least one — email or WhatsApp.';
    else if (hasEmail && !isValidEmail(emailVal.trim())) e.contact = 'Please enter a valid email address.';
    if (!country) e.country = 'Please select your country or region.';
    if (!segmentKey) e.segment = 'Please tell us what you’re looking for.';
    if (!consent) e.consent = 'Please tick the consent box so we can reply.';
    if (turnstileSiteKey && !token) e.turnstile = 'Please complete the anti-spam check.';
    return e;
  }

  async function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    // Honeypot tripped: behave like success, never hit the API (mirrors ADR-003).
    if (website.trim() !== '') {
      setStatus('success');
      return;
    }
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    const segment = segmentForKey(segmentKey);
    if (!segment) {
      setErrors({ segment: 'Please tell us what you’re looking for.' });
      return;
    }

    const payload: LeadPayload = {
      full_name: fullName.trim(),
      country: country as CountryCode,
      segment,
      consent: true,
      turnstile_token: token,
      ...(emailVal.trim() ? { email: emailVal.trim() } : {}),
      ...(whatsapp.trim() ? { whatsapp: whatsapp.trim() } : {}),
      ...(message.trim() ? { message: message.trim().slice(0, 1500) } : {}),
    };

    setStatus('submitting');
    const result = await submitLead(payload, apiBase);
    if (result.ok) {
      setStatus('success');
      return;
    }
    setErrorKind(result.kind);
    setStatus('error');
    // Tokens are single-use; reset the widget so the user can retry.
    turnstileRef.current?.reset();
    setToken('');
  }

  if (status === 'success') {
    return (
      <div
        role="status"
        className="flex h-full flex-col items-start justify-center gap-3 rounded-lg border border-border bg-cream p-8"
      >
        <CheckCircle2 className="h-9 w-9 text-emerald" aria-hidden="true" />
        <h3 className="text-h3 text-forest">Thank you — message received.</h3>
        <p className="text-body text-slate">
          We've got your enquiry and will reply within one business day. For anything urgent, reach
          us on WhatsApp.
        </p>
        {whatsappHref && (
          <a
            href={whatsappHref}
            rel="noopener"
            className="mt-1 inline-flex items-center gap-2 font-medium text-emerald underline underline-offset-4 hover:text-forest"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Message us on WhatsApp
          </a>
        )}
      </div>
    );
  }

  const errorMessages: Record<string, string> = {
    network: "Couldn't send — please try again, or reach us on WhatsApp.",
    server: 'Our server is busy right now. Please try again in a moment, or WhatsApp us.',
    rate_limited: 'Too many attempts. Please wait a minute and try again.',
    validation: 'Please check the highlighted fields and try again.',
  };

  return (
    <form
      onSubmit={handleSubmit}
      action={`mailto:${email}`}
      method="post"
      encType="text/plain"
      noValidate
      className="space-y-4"
      aria-label="Contact ASM Investments"
    >
      {/* Honeypot — hidden from people, tempting to bots (ADR-003). */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor={fid('website')}>Leave this field empty</label>
        <input
          id={fid('website')}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      {/* Full name */}
      <div>
        <label className={labelCls} htmlFor={fid('name')}>
          Full name <span className="text-gold" aria-hidden="true">*</span>
        </label>
        <input
          id={fid('name')}
          name="full_name"
          type="text"
          autoComplete="name"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className={inputCls}
          aria-invalid={errors.fullName ? true : undefined}
          aria-describedby={err('fullName')}
        />
        {errors.fullName && (
          <p id={err('fullName')} className="mt-1 text-small text-error">
            {errors.fullName}
          </p>
        )}
      </div>

      {/* Email + WhatsApp */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor={fid('email')}>
            Email
          </label>
          <input
            id={fid('email')}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={emailVal}
            onChange={(e) => setEmailVal(e.target.value)}
            className={inputCls}
            aria-invalid={errors.contact ? true : undefined}
            aria-describedby={err('contact') ?? fid('contact-help')}
          />
        </div>
        <div>
          <label className={labelCls} htmlFor={fid('whatsapp')}>
            WhatsApp <span className="normal-case tracking-normal text-muted">(with +country code)</span>
          </label>
          <input
            id={fid('whatsapp')}
            name="whatsapp"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+91 ..."
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className={inputCls}
            aria-invalid={errors.contact ? true : undefined}
            aria-describedby={err('contact') ?? fid('contact-help')}
          />
        </div>
      </div>
      {errors.contact ? (
        <p id={err('contact')} className="-mt-2 text-small text-error">
          {errors.contact}
        </p>
      ) : (
        <p id={fid('contact-help')} className="-mt-2 text-small text-muted">
          Add at least one so we can reach you.
        </p>
      )}

      {/* Country + Segment */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor={fid('country')}>
            Country / Region <span className="text-gold" aria-hidden="true">*</span>
          </label>
          <select
            id={fid('country')}
            name="country"
            required
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className={inputCls}
            aria-invalid={errors.country ? true : undefined}
            aria-describedby={err('country')}
          >
            <option value="" disabled>
              Select…
            </option>
            {COUNTRY_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          {errors.country && (
            <p id={err('country')} className="mt-1 text-small text-error">
              {errors.country}
            </p>
          )}
        </div>
        <div>
          <label className={labelCls} htmlFor={fid('segment')}>
            I'm looking for <span className="text-gold" aria-hidden="true">*</span>
          </label>
          <select
            id={fid('segment')}
            name="segment"
            required
            value={segmentKey}
            onChange={(e) => setSegmentKey(e.target.value)}
            className={inputCls}
            aria-invalid={errors.segment ? true : undefined}
            aria-describedby={err('segment')}
          >
            <option value="" disabled>
              Select…
            </option>
            {SEGMENT_OPTIONS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
          {errors.segment && (
            <p id={err('segment')} className="mt-1 text-small text-error">
              {errors.segment}
            </p>
          )}
        </div>
      </div>

      {/* Message */}
      <div>
        <label className={labelCls} htmlFor={fid('message')}>
          Message <span className="normal-case tracking-normal text-muted">(optional)</span>
        </label>
        <textarea
          id={fid('message')}
          name="message"
          rows={4}
          maxLength={1500}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`${inputCls} resize-y`}
          placeholder="A line about your situation, your city, or your question."
        />
      </div>

      {/* Consent (DPDP) */}
      <div>
        <label className="flex items-start gap-3 text-body text-ink-soft">
          <input
            type="checkbox"
            name="consent"
            required
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 h-5 w-5 shrink-0 rounded-sm border-border-strong text-forest accent-forest"
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={err('consent')}
          />
          <span>
            {CONSENT_PARTS[0]}
            <a
              href={privacyHref}
              className="font-medium text-emerald underline underline-offset-2 hover:text-forest"
            >
              Privacy Notice
            </a>
            {CONSENT_PARTS[1] ?? ''}
          </span>
        </label>
        {errors.consent && (
          <p id={err('consent')} className="mt-1 text-small text-error">
            {errors.consent}
          </p>
        )}
      </div>

      {/* Turnstile anti-spam (invisible/managed). Renders only when a key is set. */}
      {turnstileSiteKey && (
        <div>
          <Turnstile
            ref={turnstileRef}
            siteKey={turnstileSiteKey}
            options={{ theme: 'light', size: 'flexible' }}
            onSuccess={setToken}
            onError={() => setToken('')}
            onExpire={() => setToken('')}
          />
          {errors.turnstile && (
            <p id={err('turnstile')} className="mt-1 text-small text-error">
              {errors.turnstile}
            </p>
          )}
        </div>
      )}

      {/* Error banner */}
      {status === 'error' && errorKind && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-sm border border-error/30 bg-error/5 p-3 text-small text-error"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            {errorMessages[errorKind] ?? errorMessages.network}
            {whatsappHref && (errorKind === 'network' || errorKind === 'server') && (
              <>
                {' '}
                <a href={whatsappHref} rel="noopener" className="font-medium underline underline-offset-2">
                  WhatsApp us
                </a>
                .
              </>
            )}
          </span>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-forest px-5 py-3 font-medium text-cream transition-colors duration-150 ease-out hover:bg-forest-dark disabled:pointer-events-none disabled:opacity-60"
      >
        {status === 'submitting' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Sending…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" aria-hidden="true" />
            Send message
          </>
        )}
      </button>
    </form>
  );
}
