/* =====================================================================
   CONFIGURAZIONE — l'unico file da modificare per i dati reali.
   Ogni campo vuoto ("") nasconde automaticamente gli elementi che lo
   usano: la pagina non mostra mai segnaposto.
   ===================================================================== */
window.SITE_CONFIG = {
  /* WhatsApp: solo cifre, con prefisso internazionale, senza "+" (es. "393331234567").
     Se vuoto, il link apre WhatsApp chiedendo a chi scrivere. */
  whatsappNumber: "",

  /* Messaggio precompilato per tutti i pulsanti WhatsApp. */
  whatsappMessage:
    "Ciao Mirko, vorrei prenotare la visita conoscitiva gratuita. Ho dolore a: [schiena / collo / spalla / mal di testa / altro] da circa [tempo]. Quando c'è posto?",

  /* Aggiunge in fondo al messaggio un riferimento breve alla campagna (utm_campaign / utm_source). */
  appendCampaignRef: true,

  /* Telefono dello studio (formato leggibile). Mostra "Chiama lo studio" in hero, nella sezione Studio e nel footer. */
  phone: "+39 351 995 9599",

  /* Studio (dati della scheda Google "Centro MediTherapy", novembre 2026) */
  studioName: "Centro MediTherapy",
  address: "Via Libertà 11, 22078 Turate (CO)",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Centro%20MediTherapy%2C%20Via%20Libert%C3%A0%2011%2C%2022078%20Turate%20CO",

  /* Orari dello studio. Formato "HH:MM-HH:MM"; vuoto = chiuso.
     Con pausa pranzo: "09:00-13:00, 14:30-21:00". La pagina mostra la settimana,
     evidenzia il giorno di oggi e dice se lo studio è aperto ora (ora italiana). */
  hours: {
    lun: "09:00-21:00",
    mar: "09:00-21:00",
    mer: "09:00-21:00",
    gio: "09:00-21:00",
    ven: "09:00-21:00",
    sab: "09:00-13:00",
    dom: ""
  },

  vat: "",                // P.IVA
  registration: "",       // es. "Iscritto al Registro degli Osteopati d'Italia (ROI) n. 0000"
  yearsExperience: "",    // es. "8 anni di esperienza"
  email: "",              // usata nella privacy policy

  /* FAQ */
  sessionDuration: "",    // es. "Circa 45–60 minuti"
  sessionPrice: "",       // es. "Una seduta costa 60 €"
  prescriptionAnswer: "", // risposta a "Serve la prescrizione del medico?" (vuoto = domanda nascosta)

  /* Scarsità onesta: compila SOLO se vero. es. "giovedì mattina" */
  slots: "",

  /* Recensioni Google reali (con consenso). Con almeno 5 voci la sezione
     recensioni sostituisce "Le mie promesse".
     Formato: { name: "Laura B.", text: "…", rating: 5 } */
  reviews: [],

  /* Tracking — il Pixel parte solo dopo il consenso cookie. */
  metaPixelId: "",
  capiEndpoint: "",       // es. "/api/meta-capi" (funzione Netlify inclusa)
  formWebhookUrl: "",     // es. webhook Make/Zapier per ricevere i lead del form

  /* Pagine legali */
  privacyUrl: "privacy.html",
  cookieUrl: "cookie-policy.html"
};
