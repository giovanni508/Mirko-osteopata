# Landing "Regia clinica" · Mirko Rimoldi, Osteopata (Turate)

Landing page di lead generation per Meta Ads, mobile-first. HTML + CSS + JavaScript vanilla, nessuna dipendenza esterna, nessun build. **Il sito pubblico è solo la cartella `public/`**: tutto il resto (foto originali degli annunci, documenti di lavoro) resta fuori dal sito.

## Struttura

```
public/                           ← IL SITO: solo questa cartella va online
  index.html                      la pagina
  privacy.html                    informativa privacy (BOZZA da validare)
  cookie-policy.html              cookie policy (BOZZA da validare)
  assets/js/config.js             ← l'unico file da toccare per i dati reali
  assets/js/app.js                interazioni, tracking, animazioni
  assets/css/styles.css           stile (token colore in cima al file)
  assets/fonts/                   Mona Sans variabile, self-hosted (niente Google prima del consenso). I file Instrument Serif e Geist non sono più usati e si possono cancellare
  assets/img/                     foto, firma, favicon, immagine di condivisione (og.jpg)
  _headers                        cache e header di sicurezza (Netlify / Cloudflare Pages)
  robots.txt
netlify/functions/                funzione opzionale per la Conversions API di Meta
netlify.toml                      dice a Netlify di pubblicare solo public/
1q.png, 1r.png                    annunci originali (fonte delle foto), NON pubblici
README.md, DESIGN.md, PRODUCT.md  documentazione di lavoro, NON pubblica
.impeccable/                      dati del design system, NON pubblici
```

## 1. Dati reali → `public/assets/js/config.js`

Ogni campo vuoto nasconde da solo gli elementi che lo usano: la pagina non mostra mai segnaposto.

| Campo | Cosa mettere | Dove compare |
|---|---|---|
| `whatsappNumber` | solo cifre con prefisso, senza `+` (es. `393331234567`) | tutti i pulsanti WhatsApp e il form |
| `whatsappMessage` | testo precompilato | messaggio dei pulsanti |
| `phone` | numero leggibile | footer |
| `address`, `mapsUrl` | indirizzo dello studio e link Google Maps | FAQ "Dove si trova", footer |
| `vat`, `registration` | P.IVA, iscrizione ROI / titoli | footer, "Chi sono", privacy |
| `yearsExperience` | es. "8 anni di esperienza" | pillole in "Chi sono" |
| `sessionDuration`, `sessionPrice` | durata e prezzo | FAQ |
| `prescriptionAnswer` | risposta a "Serve la prescrizione?" | FAQ (nascosta se vuoto) |
| `slots` | **solo se vero**, es. "giovedì mattina" | sotto la CTA finale |
| `reviews` | recensioni Google reali, con consenso | con almeno 5 voci sostituisce "Le mie promesse" |
| `metaPixelId` | ID del Pixel | attiva banner cookie + Pixel |
| `capiEndpoint` | `/api/meta-capi` se usi la funzione inclusa | Conversions API |
| `formWebhookUrl` | webhook Make/Zapier/CRM | riceve i lead del form |
| `email` | email del titolare | informativa privacy |

## 2. Testi e titoli A/B

- I testi sono direttamente in `index.html`, sezione per sezione (commenti `<!-- ... -->`).
- Varianti del titolo per gli annunci, via URL:
  - nessun parametro: *Osteopata a Turate per il dolore a schiena, collo e spalla. Perché conviverci non è “normale”.*
  - `?h=d`: *Sono Mirko, osteopata a Turate. Quel dolore a schiena, collo o spalla non devi tenertelo.*
  - `?h=e`: *A Turate, l’osteopata per chi ha mal di schiena, collo o spalla. E non vuole più conviverci.*
  - `?h=b` e `?h=c`: le varianti B (esito) e C (stress) del brief.

  Le varianti si modificano nello script subito sotto l'`<h1>` in `index.html`.

### Menu

Voci del menu (desktop e mobile) in `index.html`, dentro `<nav class="nav">` e `<div class="menu">`: ogni voce punta all'`id` di una sezione. Il pulsante "Chiamami" nella hero compare da solo quando compili `phone` in `config.js`.

## 3. Foto

- `assets/img/mirko-hero-desktop.webp` (830×1400, metà destra della hero su desktop) e `mirko-hero-mobile.webp` (700×875, sotto il testo su mobile): ricavate da `1r.png` togliendo testi e pulsante dell'ad; la spalla coperta dal pulsante è stata ricostruita.
- "Chi sono" usa lo stesso scontornato della hero (`mirko-cutout.webp` / `mirko-cutout-m.webp`) inquadrato testa-spalle su sfondo azzurro: nessun file in più da scaricare. `mirko-avatar.webp` è il volto accanto al nome su mobile; `mirko-mani.webp` non è più usato.
- `firma-mirko.svg`: firma manoscritta generata con Higgsfield. È anche il **logo del sito**: in `index.html` è definita una volta come simbolo `#i-sign` (nello sprite in cima alla pagina) e riusata in header, "Chi sono" e footer con `<use href="#i-sign"/>`; le pagine legali usano il file. La favicon resta il marchio con le vertebre.
- Con foto nuove dello studio basta tenere gli stessi nomi file (WebP) e, se cambiano le proporzioni, aggiornare `width`/`height` nell'`<img>` / `<source>`.
- `og.jpg` (1200×630) è l'anteprima quando il link viene condiviso.

## 4. Colori

In cima a `styles.css` (`:root`): luce di studio (paper, cloud, mist), blu notte per le scene del dolore, blu clinico (cobalto) per fiducia e azione, un solo corallo per il "punto di dolore". I pulsanti sono cobalto sui fondi chiari e bianchi sui fondi scuri (variabili `--btn-bg` / `--btn-fg` in `.btn`).

Un solo carattere, Mona Sans: **stretto e pesante** è la tensione, **largo e leggero** è il "rilascio". In ogni titolo una sola parte va in rilascio, dentro `<em>` (si mostra dritta, leggera e più larga, non in corsivo). Il design system completo è in `DESIGN.md`.

## 5. Tracking (Meta Ads)

- Il Pixel parte **solo dopo** il consenso (banner con "Rifiuta" e "Accetta" equivalenti, scelta ricordata 6 mesi, link "Gestisci cookie" nel footer). Senza `metaPixelId` non compare nessun banner.
- Le frasi selezionate in "Ti riconosci?" finiscono nel messaggio WhatsApp del pulsante sotto le card (nessun dato inviato a Meta).
- Eventi: `PageView`; `ViewContent` al 50% di scroll; `Lead` + `Contact` a ogni clic WhatsApp (con `cta_position`: header, hero, pain, percorso, final, sticky) e all'invio del form; eventi custom `ScrollDepth` (25/50/75/100) e `TimeOnPage30s`.
- Ogni evento ha un `eventID`: se attivi la Conversions API, Meta deduplica browser e server.
- UTM e `fbclid` vengono salvati per la sessione, aggiunti al webhook e, in forma breve (`rif. campagna`), in fondo al messaggio WhatsApp (`appendCampaignRef: false` per disattivarlo).
- Nessuna informazione sui dolori o sulla salute viene inviata a Meta.
- Debug: aggiungi `?debug=1` all'URL e guarda la console.

### Conversions API (opzionale, Netlify)

1. Su Netlify imposta le variabili `META_PIXEL_ID`, `META_CAPI_TOKEN` (da Events Manager), opzionali `META_API_VERSION`, `META_TEST_EVENT_CODE`.
2. In `config.js`: `capiEndpoint: "/api/meta-capi"`.
3. Su Vercel/Cloudflare va portata la stessa logica in una funzione di quella piattaforma.

## 6. Deploy

- **Netlify** (consigliato, collegato al repository GitHub): `netlify.toml` imposta già tutto (publish directory = `public`, funzioni in `netlify/functions`), nessun comando di build. In alternativa trascina **solo la cartella `public/`** su app.netlify.com/drop.
- **Cloudflare Pages**: collega il repository con build command vuoto e build output directory = `public`, oppure carica solo la cartella `public/`. `_headers` viene letto automaticamente.
- **Vercel**: importa il repository come sito statico (framework "Other") con Output Directory = `public`.
- Le foto originali degli annunci, i documenti di lavoro e le cartelle `.claude/` e `.impeccable/` stanno fuori da `public/`: non finiscono mai online.
- Dopo la pubblicazione, in `public/index.html` sostituisci `og:image` con l'URL assoluto (`https://tuodominio/assets/img/og.jpg`) e verifica con il Debugger di condivisione di Meta.

## 7. Prima di pubblicare (checklist)

- [ ] `config.js` compilato (almeno `whatsappNumber`, `address`, `vat`, `metaPixelId`).
- [ ] Privacy e cookie policy riviste da un consulente (sono bozze generiche). Il form raccoglie un dato sanitario ("dove senti dolore"): il consenso lo cita esplicitamente; se usi un webhook, quel fornitore va nominato responsabile del trattamento.
- [ ] Claim confermati con Mirko l'8/10/2026 (sezione 9 del brief): sollievo dopo la prima seduta ("molte persone"), tecniche di derivazione americana, esperienza con una realtà sportiva giovanile (nessun nome citato), risposta sulle manipolazioni.
- [ ] Nessuna recensione inventata: la sezione recensioni resta nascosta finché non ce ne sono almeno 5 reali.
- [ ] Test su iPhone (Safari e browser in-app di Instagram) e Android (Chrome), 360–430 px, e su desktop.
- [ ] Lighthouse mobile (Chrome DevTools → Lighthouse → Mobile): obiettivo Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95.

## Accessibilità e prestazioni

- Tutto il contenuto è leggibile senza JavaScript e con "riduci movimento" attivo (scena della colonna statica, nessun tremolio, nessun nastro in movimento).
- Animazioni su `transform`/`opacity`, attive solo quando gli elementi sono visibili; il campo di linee in hero si ferma fuori schermo e scende a 30 fps dopo l'intro.
- Peso complessivo della pagina ≈ 290 KB (font 98 KB, un solo file precaricato; immagini hero 50–86 KB a seconda del dispositivo).
