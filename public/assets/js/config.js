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

  /* Telefono mostrato nel footer (formato leggibile, es. "+39 333 123 4567"). */
  phone: "",

  /* Studio */
  address: "",            // es. "Via Roma 1, 22078 Turate (CO)"
  mapsUrl: "",            // link Google Maps dello studio
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
