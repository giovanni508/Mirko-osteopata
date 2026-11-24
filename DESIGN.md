---
name: Mirko Rimoldi · Osteopata
description: Landing lead-gen "Regia clinica" — dal blocco al rilascio girato come un film. Luce di studio, notte cinematografica, blu clinico; un solo carattere (Mona Sans) che espira.
colors:
  paper: "#F5F7FA"
  white: "#FCFDFE"
  cloud: "#ECF0F5"
  mist: "#E1E9F2"
  ink: "#0B1A2B"
  ink-2: "#475767"
  ink-3: "#6E7C8B"
  midnight: "#060F1A"
  midnight-2: "#0C1A2A"
  midnight-3: "#13283B"
  on-dark: "#EDF2F8"
  on-dark-2: "#9AADC0"
  cobalt: "#1E55B3"
  cobalt-hi: "#2765CC"
  cobalt-lo: "#15428F"
  azure: "#5DA8E8"
  glow: "#8CCBFF"
  coral: "#EE6B4D"
  error: "#B42318"
typography:
  display:
    fontFamily: "'Mona Sans', 'Mona Sans Fallback', system-ui, sans-serif"
    fontSize: "clamp(2.625rem, 1.25rem + 6vw, 5.75rem)"
    fontWeight: 640
    lineHeight: 0.95
    letterSpacing: "-0.048em"
  headline:
    fontFamily: "'Mona Sans', 'Mona Sans Fallback', system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 1.3rem + 3.7vw, 4.625rem)"
    fontWeight: 620
    lineHeight: 1
    letterSpacing: "-0.04em"
  release:
    fontFamily: "'Mona Sans', 'Mona Sans Fallback', system-ui, sans-serif"
    fontWeight: 300
    fontStretch: "112%"
    letterSpacing: "-0.032em"
  title:
    fontFamily: "'Mona Sans', 'Mona Sans Fallback', system-ui, sans-serif"
    fontSize: "clamp(1.1875rem, 1.1rem + .4vw, 1.375rem)"
    fontWeight: 620
    lineHeight: 1.25
    letterSpacing: "-0.022em"
  body:
    fontFamily: "'Mona Sans', 'Mona Sans Fallback', system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, 1rem + .2vw, 1.125rem)"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "'Mona Sans', 'Mona Sans Fallback', system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 560
    lineHeight: 1.3
  index:
    fontFamily: "'Mona Sans', 'Mona Sans Fallback', system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 560
    letterSpacing: "0.02em"
    fontVariant: "tabular-nums"
rounded:
  sm: "10px"
  control: "14px"
  card: "20px"
  panel: "28px"
spacing:
  gutter: "clamp(1.25rem, 4vw, 3rem)"
  section: "clamp(5rem, 3.5rem + 6vw, 9.5rem)"
  container: "1280px"
components:
  button-primary:
    backgroundColor: "{colors.cobalt}"
    textColor: "{colors.white}"
    rounded: "{rounded.control}"
    padding: "12px 24px"
    height: "56px"
  button-primary-hover:
    backgroundColor: "{colors.cobalt-lo}"
  button-light:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    height: "56px"
  button-ghost:
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    height: "48px"
  chip:
    textColor: "{colors.ink}"
    rounded: "12px"
    height: "46px"
  chip-selected:
    backgroundColor: "{colors.cobalt}"
    textColor: "{colors.white}"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "12px"
    height: "52px"
  card-dark:
    backgroundColor: "{colors.midnight-2}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.card}"
  hero:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
---

# Design System: Mirko Rimoldi · Osteopata

## Overview

**Creative North Star: "Regia clinica"**

Terza revisione (24/11/2026), su richiesta del cliente: "più professionale ma sempre animato e da oscar". La storia resta "Dal blocco al rilascio", ma è girata come un film: si apre in luce di studio, scende nella notte dove il visitatore riconosce il proprio dolore, vede una radiografia scansionata che si riallinea mentre la luce torna, poi trova risposte in sezioni chiare e ordinate.

Il professionale viene dalla disciplina: una griglia rigorosa a 1280px, card dritte (niente rotazioni), hairline al posto delle ombre pesanti, numeri d'indice tabellari, un solo carattere. Il cinematografico viene dalla regia del movimento: titoli di testa, palco che si apre, scena della radiografia, parole che si accendono, titoli di coda.

**Caratteristiche chiave:**
- Un solo carattere, Mona Sans variabile (peso 200–900, larghezza 75–125%). **Stretto e pesante = tensione, largo e leggero = rilascio.** La tipografia "espira".
- Colore a scala di sezione: luce di studio (paper/cloud/mist) → notte (midnight) → blu clinico (cobalt) → luce.
- Un'azione: cobalto sui fondi chiari, bianco sui fondi scuri.
- Un solo corallo, solo per il punto di dolore.

## Colors

Strategia **Committed**: il blu (notte + cobalto) occupa intere sezioni; i neutri sono freddi e mai bianco puro. Valori in hex per compatibilità con i browser in-app più vecchi.

### Primary
- **Cobalt** (#1E55B3): pulsanti primari (etichetta bianca, 7.3:1), parte "rilascio" dei titoli su fondo chiaro, passi raggiunti, chip selezionati, pannello "È per te se". Hover **Cobalt Lo** (#15428F).

### Secondary
- **Glow** (#8CCBFF): la luce sui fondi scuri — parte "rilascio" dei titoli, radiografia, linea di scansione, toggle selezionato. Leggibile come testo su Midnight (≈11:1).
- **Azure** (#5DA8E8): solo decorativo (collegamenti della colonna, punti prevenzione).

### Tertiary
- **Coral** (#EE6B4D): solo il dolore — sottolineatura delle parole del dolore in hero, punto e impulso sulla colonna, soglia del "carico", indicatore del suggerimento. Mai testo, mai pulsante.

### Neutral
- **Paper** (#F5F7FA) fondo pagina · **White** (#FCFDFE) card e form · **Cloud** (#ECF0F5) e **Mist** (#E1E9F2) sezioni alternate.
- **Ink** (#0B1A2B) testo · **Ink 2** (#475767) testo secondario (≈6.8:1 su paper) · **Ink 3** (#6E7C8B) solo indici e decorazioni.
- **Midnight** (#060F1A / #0C1A2A / #13283B): dolore, scena, finale, footer; testo **On-dark** (#EDF2F8) e **On-dark 2** (#9AADC0, ≈8:1).

### Named Rules
**The Neutral Door Rule.** Il primo viewport resta luce di studio: paper, ink, il ritratto. Il blu compare solo nella frase di rilascio, nel pulsante e negli anelli.

**The One Coral Rule.** Il corallo segna dove fa male e nient'altro.

## Typography

**Carattere unico:** Mona Sans (variabile, self-hosted, 98 KB, precaricato). Fallback Arial con metriche aggiustate.

**Carattere:** un grotesk preciso e contemporaneo; gli assi di peso e larghezza sono la voce del brand.

### Hierarchy
- **Display** (640, 2.6–5.75rem, 0.95, −0.048em): solo l'H1. Seconda riga a 0.46em peso 420; riga di rilascio a 0.34em (0.44em su telefono) peso 300, larghezza 112%, cobalto.
- **Headline** (620, 2.25–4.6rem, 1.0, −0.04em): titoli di sezione, `text-wrap: balance`, una parte in **rilascio** dentro `<em>`.
- **Release** (300, larghezza 112%): la parte che porta sollievo in ogni titolo, la citazione "Ogni persona, un percorso", i numeri delle sedute, la nota onesta.
- **Title** (620, 1.19–1.375rem): pilastri, passi, percorsi.
- **Body** (400, 17–18px, 1.6).
- **Label** (560, 15px): pulsanti, chip, etichette.
- **Index** (560, 13px, tabular): 01–06 su card, pilastri, promesse, menu.

### Named Rules
**The Exhale Rule.** Tensione = stretto e pesante, rilascio = largo e leggero. Ogni titolo può mettere in rilascio una sola parte, mai tutto il titolo. Niente corsivo.

**The No-Kicker Rule.** Nessuna etichetta maiuscola spaziata sopra i titoli; gli indici numerici stanno dentro i componenti, non sopra le sezioni.

## Layout

Mobile-first, colonna singola con gutter minimo 20px, container 1280px. Le sezioni respirano su `clamp(5rem, 3.5rem + 6vw, 9.5rem)`. Da 900–960px: hero 1fr + ritratto; split editoriali per agitazione (5/6), FAQ e promesse (4/7, titolo sticky), finale (6/5); righe da tre per pilastri, percorsi, passi. La scena della radiografia resta fissata per 260vh sui dispositivi con animazioni e ripiega su un layout statico a gradiente.

Alternanza fondi: hero paper → dolore/agitazione midnight → radiografia midnight→cobalt→paper → come lavoro paper → citazione cloud → percorso mist → aspettative paper → per chi è cloud → chi sono paper → promesse cloud → FAQ paper → finale midnight → footer midnight.

## Elevation & Depth

Tonale prima di tutto; ombre morbide solo per oggetti appoggiati.
- **Shadow 1** (`0 1px 2px rgba(11,26,43,.06), 0 10px 24px -16px rgba(11,26,43,.24)`): card dei percorsi, bolla chat.
- **Shadow 2** (`0 1px 2px rgba(11,26,43,.06), 0 28px 56px -28px rgba(11,26,43,.38)`): foto, etichetta in hero, hover dei percorsi.
- **Action** (`0 1px 1px rgba(11,26,43,.16), 0 14px 28px -16px rgba(21,66,143,.7)`): pulsanti primari.

**The Hairline Rule.** Bordi a 1px in inset (10–20% ink, 10–22% on-dark sui fondi scuri). Niente bande colorate laterali.

## Shapes

Rettangoli arrotondati, non pillole: 14px per pulsanti, 12px per chip e campi, 20px card, 28px pannelli e foto. Indicatori dei passi e toggle a quadrato arrondato (12–14px). Cerchi solo per avatar e punti.

## Components

### Buttons
- **Primary:** cobalto, etichetta bianca, icona WhatsApp; hover cobalto scuro + un riflesso di luce che attraversa il pulsante; press `scale(.98)`; magnete leggero solo con il mouse.
- **Light:** bianco con etichetta ink, per fondi scuri (header e barra mobile sopra le sezioni scure, riepilogo selezione, finale).
- **Ghost:** trasparente con hairline 1.5px (banner cookie: Rifiuta e Accetta di pari peso).

### Header
68px fisso: **logo = la firma manoscritta di Mirko** (simbolo SVG `#i-sign`, colore `currentColor`, quindi inchiostro sui fondi chiari e bianca su quelli scuri; all'apertura si scrive da sinistra a destra) + "Osteopata a Turate" separato da una linea sottile (sotto la firma su telefono). La favicon resta il quadrato con le quattro vertebre, perché la firma a 16px non si leggerebbe; link centrati da 1100px con sottolineatura che si disegna; barra di avanzamento della lettura (2px) sul bordo inferiore. Trasparente in cima, vetro chiaro dopo lo scroll, vetro notte sopra le sezioni scure.

### Hero
Copia a sinistra, ritratto scontornato a destra (sotto il testo su telefono) con alone azzurro e due anelli di precisione (uno si disegna, uno tratteggiato ruota lentissimo).

### Pain card (firma)
Midnight 2, 20px, dritta, indice 01–06, toggle quadrato. Selezionata: bordo glow, toggle glow con spunta, la frase passa a peso 340 e larghezza 108% ("si scioglie") e si apre la spiegazione; la frase finisce nel messaggio WhatsApp. Su desktop una luce morbida segue il puntatore.

### Carico (agitazione)
Schema, non dati: un contenitore che si riempie di quattro strati (postura, ore alla scrivania, ripetizione, stress); l'ultimo supera una soglia tratteggiata corallo che pulsa.

### Radiografia (firma)
Colonna SVG di 17 vertebre, cranio, clavicole e bacino resa come radiografia (contorni glow su notte, alone). Una linea di scansione scende con lo scroll, il punto di dolore compare quando la scansione lo attraversa, poi la colonna si riallinea mentre la notte diventa cobalto e poi carta; in luce la colonna diventa disegno a inchiostro e compaiono le cause.

### Chi sono: ritratto e firma
Ritratto testa-spalle ricavato dallo scontornato della hero (stesso file, già in cache) su luce di studio azzurra, 4:5, angoli 28px; entra "accendendo le luci" (da scuro e desaturato a pieno) con uno zoom-out. Sotto il testo, la firma manoscritta in corsivo (SVG generato con Higgsfield, definita una sola volta come simbolo `#i-sign` nello sprite di `index.html` e riusata in header, Chi sono e footer; copia in `public/assets/img/firma-mirko.svg` per le pagine legali) che si "scrive" da sinistra a destra quando entra in vista.

### Lo studio
Sezione cloud prima del finale: a sinistra titolo ("Ti aspetto *in studio.*"), nome dello studio, indirizzo e telefono con icone cobalto, due pulsanti ghost (Google Maps, Chiama lo studio); a destra una card bianca con la settimana degli orari, il giorno di oggi evidenziato (fondo cloud, etichetta "oggi") e uno stato "Aperto ora / Chiuso ora" calcolato in ora italiana, con punto cobalto che pulsa quando è aperto. Tutto viene da `config.js`; nessuna mappa incorporata (niente terze parti prima del consenso).

### Inputs
Fondo paper, hairline 1.5px, 12px, 52px. Focus: bianco, bordo cobalto, alone cobalto 16%. Errore #B42318 con messaggio; il focus va al primo errore.

## Motion

Curve: `--ease` expo-out (rivelazioni), `--ease-q` quart-out (stati), `--ease-io` (scene). Nessun rimbalzo.
- **Titoli di testa (hero):** le parole salgono da maschere riga per riga; "schiena, collo, spalla" entrano strette e pesanti (75%, 820) e poi espirano (100%, 600); la sottolineatura corallo si disegna; il ritratto "accende le luci" (da scuro e desaturato a pieno), gli anelli si disegnano.
- **Titoli di sezione:** stesse maschere per parola; la parte in rilascio parte stretta (84%, 600) e si allarga. A fine animazione il titolo torna testo semplice.
- **Palco:** la prima sezione scura entra con angoli arrotondati e margini laterali che si chiudono a tutta pagina.
- **Citazione:** le parole si accendono mentre la leggi (scroll).
- **Percorso:** la linea si disegna, i numeri diventano cobalto con un piccolo impulso.
- **Footer:** "Mirko Rimoldi" enorme, in contorno, sale come titolo di coda.
- Tutto è visibile senza JavaScript e con "riduci movimento" (classe `.motion` assente).

## Do's and Don'ts

### Do:
- **Do** mettere in rilascio (largo e leggero, colore `--em`) una sola parte per titolo.
- **Do** usare cobalto sui fondi chiari e bianco sui fondi scuri per le azioni.
- **Do** cambiare colore per sezioni intere.
- **Do** tenere ogni stato animato visibile di default senza `.motion`.

### Don't:
- **Don't** reintrodurre serif corsivi, card ruotate, pillole o effetti ripple.
- **Don't** usare il corallo per testo o pulsanti.
- **Don't** aggiungere etichette maiuscole spaziate sopra i titoli.
- **Don't** usare stock, clipart o icone emoji; icone SVG a tratto 1.5–2px.
- **Don't** inventare recensioni, numeri di pazienti o anni di esperienza.
