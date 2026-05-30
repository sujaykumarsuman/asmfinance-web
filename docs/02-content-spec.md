# Content Specification — asmfinance.in

This file is the **single source of truth for landing-page copy**. Implement verbatim. Any deviation requires explicit approval from the human owner.

## Global

- Brand name: **ASM Investments**
- Tagline (under wordmark): *Wealth advisory for Indian families, wherever they live.*
- Primary CTA copy: `Book a free 30-min call`
- Secondary CTA copy: `Send a message`
- Phone / WhatsApp: `+91 XX XXX XXXXX` (to be confirmed before launch)
- Email: `hello@asmfinance.in`
- Office: `Mathura, Uttar Pradesh, India`

## Section order

The order is deliberate. Do **not** rearrange. Contact form sits early to capture motivated leads while they're warm.

1. Hero
2. What we do (brief)
3. **Contact band** ← priority position
4. Service tiers
5. NRI / GIFT City wedge
6. How it works
7. About the founders
8. FAQ
9. Pre-footer CTA strip
10. Footer

---

## 1. Hero

**Eyebrow** (small caps, gold):
`AMFI-REGISTERED · MATHURA · EST. 2007`

**H1** (Fraunces, large, deep forest):
*Wealth advisory for Indian families, wherever they live.*

**Sub** (Inter, slate, max 2 lines):
Investments, protection, taxes and legacy — handled by people who pick up the phone, backed by institutional-grade products from across India and GIFT City.

**Buttons:**
- Primary: `Book a free 30-min call` → opens Calendly modal
- Secondary (ghost): `Send a message` → smooth-scroll to `#contact`

**Right side / supporting visual**: subtle product illustration (see `04-graphics-guide.md`) OR a clean composite of the duotone portraits.

**Trust strip below fold**:
- AMFI ARN-103139
- NISM V-A Certified
- Mirae Asset Sharekhan partner
- IRDAI POSP
- GIFT City partner network

Display as a horizontal row of muted chips. Greyscale logos preferred.

---

## 2. What we do (brief)

Three lines as chips/cards. Each links to the matching detailed tier in §4.

| Block | Headline | One-line body |
|---|---|---|
| 🌱 | **Build wealth.** | Mutual funds, equity, bonds, NPS — curated to your goals, not to product commissions. |
| 🛡️ | **Protect what you have.** | Life, health and general insurance — sized to what your family actually needs. |
| 🌍 | **Cross borders cleanly.** | NRI investing, GIFT City, repatriation, cross-border tax — one Indian touchpoint. |

(Use icons from Lucide — see `04-graphics-guide.md`. Emoji shown here only for clarity in this doc.)

---

## 3. Contact band ← priority position

**Section heading** (small, gold caps):
`TALK TO US`

**H2** (Fraunces):
*Start with a conversation, not a sales pitch.*

**Sub**:
A free 30-minute online call to understand your situation. In-person meetings in Mathura, Delhi-NCR and Lucknow are possible by appointment — please mention your city.

**Layout — two columns, equal width on desktop, stacked on mobile:**

### Left: short form

```
[ Full name * ]
[ Email * ]   [ WhatsApp (with +country code) ]
[ Country / Region * ]   ▾  India · UAE · USA · Canada · UK · Singapore · Other
[ I'm looking for * ]    ▾  Just exploring · Mutual fund / SIP help · A full plan · NRI services · Insurance review
[ Message — optional, 4 lines ]

[ ☐ ] I consent to ASM Investments contacting me about this enquiry.
      I have read the Privacy Notice.

[ Send message ]   Honeypot field hidden via CSS.
```

### Right: calendar embed

Heading: `Or pick a time directly`
Calendly or Zcal embed. Shows the next 7 days of availability. 30-min slots.

Below the calendar: a quiet line —
`Prefer WhatsApp? Tap to chat → +91 XX XXX XXXXX`

---

## 4. Service tiers (4 cards)

**Section heading** (small, gold caps):
`WHAT WE DO IN DETAIL`

**H2**: *Four ways we work with families.*

**Sub**: Pick the tier that fits. You can move between them as your needs change.

**Cards — grid 1×4 on desktop, 2×2 tablet, stacked mobile**

### Core
- *For starters and SIP savers.*
- AUM under ₹25 lakh
- Mutual fund SIPs across 3-5 schemes
- Term + family health insurance
- NPS for retirement
- Annual review
- Digital onboarding
- Commission-only — you pay no fee
- CTA: `Start a SIP` (links to contact form with segment pre-filled)

### Premium
- *For working families and small business owners.*
- AUM ₹25 lakh – ₹2 crore
- Everything in Core, plus:
- Written financial plan
- Tax-saving overlay (ELSS, NPS, insurance)
- Equity broking via Mirae Asset Sharekhan
- Half-yearly review with a named relationship manager
- Plan fee ₹25,000 – ₹75,000 one-time, or commission-only
- CTA: `Get a plan`

### Wealth
- *For HNI families and successful professionals.*
- AUM ₹2 crore – ₹10 crore+
- Everything in Premium, plus:
- PMS, AIFs, structured products
- Documented Investment Policy Statement
- Family-CFO services on request
- Quarterly review with senior advisor
- AUA-based advisory fee under SEBI RIA (in progress)
- CTA: `Schedule a private consultation`

### NRI
- *For Indians living abroad.*
- For non-resident Indians in the GCC, US, Canada, UK, EU, Singapore and SEA.
- NRE / NRO / FCNR account setup help
- GIFT City funds, PMS, USD ULIPs
- Repatriation and Form 15CA / 15CB via CA partner
- Cross-border tax pack (US clients paired with a US CPA)
- Will / succession basics across jurisdictions
- Service in your time zone
- CTA: `Talk to us about NRI services` → links to `/nri`

---

## 5. NRI / GIFT City wedge band

A visually distinctive section — darker background (deep forest `#1F5132`), cream text, gold rules. Stands out from the cream sections above and below.

**Eyebrow** (cream caps):
`FOR THE DIASPORA`

**H2** (Fraunces, cream):
*Built for Indians abroad — finally.*

**Body** (cream, two short paragraphs):
Most onshore Indian mutual funds don't accept US or Canada NRIs. GIFT City — India's International Financial Services Centre, USD-denominated and tax-efficient — does.

We help families across the GCC, North America, the UK, EU and Singapore invest in India without the usual paperwork burden. One Indian touchpoint that handles investments, repatriation, taxes and succession.

**Geo chips**:
🇦🇪 GCC · 🇺🇸 US & Canada · 🇬🇧 UK & EU · 🇸🇬 Singapore & SEA

(Use SVG flag icons rather than emoji on production.)

**CTA**: `Read the NRI guide` → `/nri`

---

## 6. How it works (4 steps)

**Section heading** (gold caps):
`HOW IT WORKS`

**H2**: *Four steps. No surprises.*

Use horizontal stepper on desktop, vertical timeline on mobile.

| # | Step | Detail |
|---|---|---|
| 01 | **Discovery call** | A free 30-minute online call to understand your goals, current portfolio and family context. In-person where possible. |
| 02 | **Plan and proposal** | We write a one-page plan, recommend a tier and propose either a fee-based or commission-based engagement. Your choice. |
| 03 | **Onboarding** | Digital KYC, e-mandates and the first transaction. Residents in 48-72 hours. NRIs in 7-10 working days. |
| 04 | **Review and adapt** | Quarterly for Wealth, half-yearly for Premium, annual for Core. Mid-cycle updates over WhatsApp. |

---

## 7. About the founders

**Section heading** (gold caps):
`THE PEOPLE BEHIND ASM`

**H2**: *Two generations. One commitment.*

Two-column layout. Left: portraits of Anjali and Arvind side by side, treated as duotone (forest-cream — see `04-graphics-guide.md`). Right: copy.

**Copy:**

ASM Investments was founded in **2007 by Anjali Suman**, who began advising a small circle of families in Mathura through what was then a rapidly evolving Indian mutual fund landscape. In **2017, Arvind Kumar Suman** — her husband and an AMFI-registered IFA — expanded the practice into a multi-asset advisory covering equity broking through the Mirae Asset Sharekhan franchise, insurance, and goal-based investing for families.

What started as a few client families has grown into a diverse book across Delhi-NCR, Uttar Pradesh, South India, East India, and select high-net-worth and NRI relationships. The thing that has not changed in two decades: every client speaks to the same partner who started the relationship.

The next generation — Sujay, a backend engineer — is now building the tech platform that will let ASM serve clients across India and the diaspora at the standard a modern wealth advisory demands.

**Quote pull** (optional, beneath copy, italic gold):
> *"We've never measured ourselves by AUM. We've measured ourselves by how many of our first clients still call us back."*
> — Arvind Kumar Suman

---

## 8. FAQ

**Section heading** (gold caps):
`COMMON QUESTIONS`

**H2**: *Things people ask us before they sign on.*

Accordion. Default-closed. Each opens to a 2-3 paragraph answer.

1. **Are you fee-based or commission-based?**
   Both, depending on the tier. Core and Premium clients pay nothing — we earn a trail commission from the mutual funds we recommend. Wealth and NRI clients can opt for AUA-based advisory fees under our SEBI Registered Investment Adviser registration (in progress). We will never charge an advisory fee and a commission on the same product to the same client — that is regulated against.

2. **I'm an NRI in the US — can I invest in Indian mutual funds?**
   Most onshore Indian AMCs restrict US and Canada NRIs because of FATCA reporting. We use GIFT City Portfolio Management Services instead — securities are held in your own name, which avoids the PFIC tax trap most pooled funds create for US taxpayers. We pair this with a referral to a US-licensed CPA so your US tax position stays clean.

3. **What is GIFT City?**
   GIFT City is India's International Financial Services Centre, located near Gandhinagar. Although it sits in India physically, it is treated as a foreign jurisdiction under FEMA. USD-denominated, tax-efficient, and accessible to NRIs from any geography. See our [NRI guide](/nri) for a longer explanation.

4. **Do you handle insurance?**
   Yes — life, health, and general insurance. We are an IRDAI Point-of-Sale Person today and are upgrading to a Corporate Agent registration to offer products from up to nine insurers across categories.

5. **How quickly can I start?**
   Resident Indians can be onboarded with their first investment in 48-72 hours after KYC. NRIs typically take 7-10 working days because of the document set required, plus IFSC banking unit account opening if going via GIFT City.

6. **How do I know my advisor will be around for the long run?**
   ASM Investments is a two-generation practice. Arvind anchors current relationships, and the next generation is already involved in operations and tech. Every client meeting from the Wealth tier upward is co-signed by both, so continuity is baked in.

7. **What is the minimum to work with you?**
   None for Core (SIP starting from ₹500/month). For Premium, we suggest at least ₹25 lakh investable to make a written plan worthwhile. Wealth begins at ₹2 crore. NRI Premium begins at the equivalent of about ₹50 lakh investable.

8. **Where can we meet in person?**
   Mathura is home. We meet clients in Delhi-NCR, Lucknow and Agra periodically by appointment. For other cities and for NRIs, all calls are online over Zoom or WhatsApp.

---

## 9. Pre-footer CTA strip

A wide, calm band — cream bg, deep forest text, no images.

**Heading**: *Not sure yet? That's fine.*

**Body**: A 30-minute conversation costs nothing and rarely changes anything. Sometimes it changes a lot.

**Buttons**:
- Primary: `Book a free call`
- Secondary: `WhatsApp us`

---

## 10. Footer

Four columns on desktop, stacked on mobile.

**Column 1 — Brand**
- ASM Investments wordmark
- One-line tagline
- AMFI ARN: `[number]`
- NISM V-A Certified · IRDAI POSP

**Column 2 — Navigate**
- Services
- NRI
- About
- FAQ
- Book a call

**Column 3 — Contact**
- Mathura, Uttar Pradesh, India
- `hello@asmfinance.in`
- `+91 XX XXX XXXXX`
- WhatsApp link
- Office hours: Mon-Sat, 10:00-18:00 IST

**Column 4 — Legal**
- Privacy Notice (DPDP-compliant)
- Terms of Use
- Disclosures

**Footer bar (full width, smaller text)**:
> *Mutual fund investments are subject to market risks. Read all scheme-related documents carefully. ASM Investments is an AMFI-registered Mutual Fund Distributor (ARN: [number]). Distribution of mutual funds and other financial products is on a commission basis as disclosed at the time of investment. ASM Investments does not provide investment advice on a fee basis except under SEBI Registered Investment Adviser registration (in progress); until that registration is granted, no fee-based advice is offered.*
> © 2026 ASM Investments. All rights reserved.

---

## Privacy Notice (DPDP-aligned) — for `/privacy.astro`

Use this skeleton verbatim. Final review by a CA / lawyer before launch.

```
Privacy Notice

Last updated: [date]

ASM Investments ("we", "us") collects and processes personal information
under the Digital Personal Data Protection Act, 2023 ("DPDP Act"). This
notice explains what we collect, why, who we share it with, how long we
keep it, and your rights.

1. What we collect
   When you contact us via this site, we collect: name, email, phone /
   WhatsApp, country / region, your selected segment, and any message you
   send us. If you become a client, we collect identification documents
   (KYC), financial information, and account details as required by AMFI,
   SEBI, IRDAI and applicable tax authorities.

2. Why we collect it
   To respond to your enquiry. To onboard you as a client if you choose to
   work with us. To comply with our regulatory obligations under SEBI,
   AMFI, IRDAI, PMLA, FEMA and the Income Tax Act.

3. Who we share it with
   Asset Management Companies, stock brokers, insurers, payment gateways
   and registrars and transfer agents (CAMS, KFintech) — only as required
   for the products you choose. Regulators on lawful request. We do not
   sell your data.

4. How long we keep it
   Enquiry data: 24 months from last contact. Client records: 8 years
   minimum after relationship ends, per PMLA and SEBI retention rules.

5. Your rights
   You may request access, correction, deletion or withdrawal of consent
   by emailing privacy@asmfinance.in. Some data we are legally required
   to retain even after a deletion request.

6. Security
   We store data in encrypted form in India (AWS ap-south-1 / Hyderabad).
   We follow the SEBI Cybersecurity and Cyber Resilience Framework
   baseline. Access is restricted to staff who need it.

7. Cookies and tracking
   This site uses Plausible Analytics, which does not use cookies or
   collect personal data. We do not use third-party advertising cookies.

8. Contact for privacy concerns
   Data Protection Officer (interim): privacy@asmfinance.in
```

---

## Terms of Use (lightweight skeleton) — for `/terms.astro`

Standard service-provider terms. Final draft by a lawyer. Not produced verbatim here. Include: nature of the site (informational), no investment advice via the site, disclaimer of warranties, governing law (India), jurisdiction (Mathura), contact.
