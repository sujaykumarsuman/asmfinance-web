/**
 * Site-wide constants and build-time env reads.
 *
 * EDITABLE BUSINESS DATA (brand name, tagline, ARN, email, phone, office hours,
 * CTA copy, and the contact-form dropdown options) lives in `src/data/site.json`.
 * Change it there and redeploy — no code edits needed. This module just wires that
 * JSON into typed exports, plus structural bits (anchors, nav, env) that are code,
 * not content.
 */
import siteData from '../data/site.json';

/** Brand + contact details — edit in src/data/site.json. */
export const SITE = {
  name: siteData.brand.name,
  tagline: siteData.brand.tagline,
  email: siteData.contact.email,
  privacyEmail: siteData.contact.privacyEmail,
  office: siteData.contact.office,
  phoneDisplay: siteData.contact.phoneDisplay,
  officeHours: siteData.contact.officeHours,
  arn: siteData.brand.arn,
  credentials: siteData.brand.credentials,
};

/** Primary/secondary CTA copy — edit in src/data/site.json. */
export const CTA = {
  primary: siteData.cta.primary,
  secondary: siteData.cta.secondary,
};

/** Section anchor ids — structural (used across Nav, Footer, in-page links). */
export const ANCHORS = {
  contact: 'contact',
  services: 'services',
  nri: 'nri',
  about: 'about',
  faq: 'faq',
  disclosures: 'disclosures',
} as const;

export const NAV_LINKS = [
  { label: 'Services', href: `#${ANCHORS.services}` },
  { label: 'NRI', href: `#${ANCHORS.nri}` },
  { label: 'About', href: `#${ANCHORS.about}` },
  { label: 'FAQ', href: `#${ANCHORS.faq}` },
] as const;

/**
 * Build-time public env. Astro inlines import.meta.env.PUBLIC_* at build.
 * Empty string = feature off (e.g. no Plausible, no calendar embed).
 */
export const ENV = {
  apiBase: import.meta.env.PUBLIC_API_BASE ?? 'https://api.asmfinance.tech',
  calendlyUrl: import.meta.env.PUBLIC_CALENDLY_URL ?? '',
  plausibleDomain: import.meta.env.PUBLIC_PLAUSIBLE_DOMAIN ?? '',
} as const;

/**
 * Build a wa.me link from the contact phone in site.json. The phone is stripped
 * to digits (so it must include the country code, e.g. "+91 9045-7489-71" ->
 * "919045748971"). Returns null while the number is still a placeholder.
 */
export function whatsappLink(text?: string): string | null {
  const digits = SITE.phoneDisplay.replace(/\D/g, '');
  if (digits.length < 10) return null; // e.g. the "+91 XX XXX XXXXX" placeholder
  const q = text ? `?text=${encodeURIComponent(text)}` : '';
  return `https://wa.me/${digits}${q}`;
}
