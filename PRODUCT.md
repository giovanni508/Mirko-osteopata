# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML + CSS + vanilla JS (brief: "nessun framework obbligatorio"), deploy on Netlify / Vercel / Cloudflare Pages. No build step. Libraries only from CDN with pinned version, if any.

## Users

People aged 25–55 in the Turate area (north-west Milan / Varesotto) who arrive from Meta Ads (Instagram/Facebook), almost always on a phone, often inside the in-app browser. They live with back, neck, shoulder pain or tension headaches tied to desk work, posture, repetition and stress. They describe it in plain words ("ho mal di schiena", "mal di testa a fascia dopo il lavoro"), never in clinical terms. Secondary: parents of babies and small children (2–3 months to 5 years) for neonatal/paediatric osteopathy.

## Product Purpose

Lead-generation landing page for Mirko Rimoldi, osteopath in Turate. Success = a visitor writes to Mirko on WhatsApp (prefilled message) to book the free introductory visit. Secondary conversion: a mini-form (name, phone, where it hurts) that opens WhatsApp and/or posts to a webhook.

## Positioning

An osteopath who listens before touching and tells you honestly what to expect, including when osteopathy is not the right path for you. The free first visit is an anamnesis and assessment, not a sales pitch. Mirko answers WhatsApp personally.

## Operating Context

- Booking happens only on WhatsApp (or phone). No online calendar. Slots reserved for leads (e.g. Thursday morning, 2 slots) — to be confirmed.
- First visit: clinical history, current and past problems, therapies; bring reports (RX, MRI, ultrasound) if any. Then a session plan is set.
- Typical path: acute → usually 1–2 sessions; chronic (posture, work, stress) → usually 4–5 sessions, then optional maintenance; some patients come year-round for prevention.
- Techniques: HVLA manipulations, fascial and deep muscular work, cranio-sacral, neonatal/paediatric osteopathy; courses in American-derived techniques for deep muscular release (confirmed by the client for use as written in the brief).
- Background: massotherapy → osteopathy school; one year with a youth football school (name not cited).

## Capabilities and Constraints

- Healthcare compliance (Italy + Meta Ads): never "guarigione garantita", "100%", "elimino il dolore", "cura definitiva", "risolvo ernie/discopatie"; no comparisons with other professionals; no invented testimonials; always point to a doctor for acute/severe symptoms.
- GDPR: Meta Pixel only after explicit consent; reject as easy as accept.
- Performance: mobile-first, LCP < 2.5 s, CLS ≈ 0, page < 1 MB excluding lazy photos.
- Undecided / pending from the client (filled later via config, hidden until present): WhatsApp number, address, VAT number, ROI registration/titles, years of experience, session duration, price, real slots, Google Maps link, Pixel ID, privacy/cookie policy.

## Brand Commitments

- Name: "Mirko Rimoldi · Osteopata". Existing ad creatives use a handwritten "Mirko Rimoldi" signature and a portrait in white uniform with crossed arms (1q.png, 1r.png).
- Voice: human, warm, direct, reassuring; colloquial but careful Italian, second person singular ("tu"); short sentences; no medical jargon; no hype. Radical honesty: "se non ci credi, ti dico di non farlo".
- Brief-pinned visual direction: "Dal blocco al rilascio" (tension → release). No stock photos, no clipart, no SaaS gradients.
- Palette: the client overrode the brief's warm palette on 2026-10-08 ("tonalità azzurre blu mediche per osteopata"): azure/medical blue world, with the yellow of the existing ad creatives reserved for CTAs and release moments (ad → page continuity). Photos use the original colours (light-blue studio background).
- The client asked explicitly for a "wow" landing (2026-10-08).
- Second revision requested by the client (2026-10-08): hero "più staccata e più neutra", "font più premium", and a UX pass on every section. Result: neutral detached hero card, ink/white CTAs (the ad yellow was retired), Instrument Serif + Geist.
- Third revision requested by the client (2026-11-24): "più professionale ma sempre animato e da oscar". Result: "Regia clinica" — a single variable typeface (Mona Sans: condensed/heavy = tension, wide/light = release), straight cards and a strict grid, cobalt CTAs, cinematic motion (title sequence, stage opening, X-ray scan of the spine, scroll-lit quote, end titles). The serif italic and tilted cards were retired.

## Evidence on Hand

- Real portrait photos of Mirko inside the ad creatives `1q.png` (1080×1080) and `1r.png` (1080×1920), with baked-in text: usable only as crops.
- No Google reviews collected yet: do NOT invent reviews, stars, patient counts or testimonials. The reviews block appears only with ≥ 5 real reviews.
- Claims in brief section 9 confirmed by the client (2026-10-08) for use as written.

## Product Principles

1. Honesty over persuasion: say what to expect, including limits.
2. Speak the patient's words, not the clinician's.
3. One action: write to Mirko on WhatsApp. Everything else supports it.
4. Never let a missing fact become a placeholder or an invented claim on the live page.

## Accessibility & Inclusion

WCAG AA contrast minimum; tap targets ≥ 48 px; full keyboard focus states; fully usable without animation JS and with `prefers-reduced-motion`; Italian `lang="it"`.
