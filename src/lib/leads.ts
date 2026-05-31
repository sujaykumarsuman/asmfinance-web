/**
 * Lead form data layer — request contract + submit wrapper.
 * Contract is frozen in docs/adr/003-form-handling.md. Do not change the field
 * names without coordinating with the asmfinance API (shared OpenAPI spec).
 *
 * The visible form options (country list, "I'm looking for" list) and the consent
 * sentence are EDITABLE in src/data/site.json (`form` section). Each segment option
 * maps to the frozen API enum via its `segment` field.
 */
import siteData from '../data/site.json';

export type Segment = 'core' | 'premium' | 'wealth' | 'nri' | 'exploring';
export type CountryCode = 'IN' | 'AE' | 'US' | 'CA' | 'GB' | 'SG' | 'OTHER';

/** POST body for https://api.asmfinance.tech/v1/leads */
export interface LeadPayload {
  full_name: string;
  email?: string;
  whatsapp?: string;
  country: CountryCode;
  segment: Segment;
  message?: string;
  consent: true;
  /** Optional: Cloudflare Turnstile was removed from the site. Kept optional for
   *  API back-compat; the API should no longer require it. */
  turnstile_token?: string;
}

/** Consent copy — edit in src/data/site.json (form.consentText). */
export const CONSENT_TEXT: string = siteData.form.consentText;

/** "I'm looking for" options (edit in site.json). `segment` maps to the API enum. */
export const SEGMENT_OPTIONS: { key: string; label: string; segment: Segment }[] =
  siteData.form.segments as { key: string; label: string; segment: Segment }[];

/** Country / Region options (edit in site.json) -> ISO alpha-2 / OTHER (ADR-003). */
export const COUNTRY_OPTIONS: { value: CountryCode; label: string }[] =
  siteData.form.countries as { value: CountryCode; label: string }[];

/** Map a tier-CTA deep-link (?seg=core|premium|wealth|nri|exploring) to a select key. */
export function segmentEnumToKey(seg: string | null): string | null {
  switch (seg) {
    case 'exploring':
      return 'exploring';
    case 'core':
      return 'sip';
    case 'premium':
    case 'wealth': // no dedicated friendly option — nearest is "A full plan"
      return 'plan';
    case 'nri':
      return 'nri';
    default:
      return null;
  }
}

export function segmentForKey(key: string): Segment | null {
  return SEGMENT_OPTIONS.find((o) => o.key === key)?.segment ?? null;
}

/** Loose RFC-5322-ish email check (full validation also happens server-side). */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export type SubmitResult =
  | { ok: true; id: string | null }
  | { ok: false; kind: 'validation'; fields?: Record<string, string> }
  | { ok: false; kind: 'rate_limited'; retryAfter?: number }
  | { ok: false; kind: 'server' }
  | { ok: false; kind: 'network' };

/** POST a lead to the API and normalise the response per the ADR-003 contract. */
export async function submitLead(payload: LeadPayload, apiBase: string): Promise<SubmitResult> {
  try {
    const res = await fetch(`${apiBase}/v1/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.status === 201) {
      const data = await res.json().catch(() => ({}) as Record<string, unknown>);
      return { ok: true, id: (data?.id as string) ?? null };
    }
    if (res.status === 400) {
      const data = await res.json().catch(() => ({}) as Record<string, unknown>);
      return { ok: false, kind: 'validation', fields: data?.fields as Record<string, string> };
    }
    if (res.status === 429) {
      const data = await res.json().catch(() => ({}) as Record<string, unknown>);
      return { ok: false, kind: 'rate_limited', retryAfter: data?.retry_after_seconds as number };
    }
    return { ok: false, kind: 'server' };
  } catch {
    return { ok: false, kind: 'network' };
  }
}
