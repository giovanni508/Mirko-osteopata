/* Meta Conversions API — funzione Netlify (opzionale).
   Variabili d'ambiente da impostare su Netlify:
     META_PIXEL_ID        id del Pixel
     META_CAPI_TOKEN      access token generato in Events Manager
     META_API_VERSION     opzionale, es. "v21.0"
     META_TEST_EVENT_CODE opzionale, solo per i test in Events Manager
   Poi in assets/js/config.js: capiEndpoint: "/api/meta-capi"
   Il browser invia lo stesso event_id del Pixel: Meta deduplica i due eventi. */
import { createHash } from 'node:crypto';

const ALLOWED = new Set(['Lead', 'Contact', 'ViewContent']);
const sha256 = (v) => createHash('sha256').update(v).digest('hex');

function normPhone(p) {
  let d = String(p || '').replace(/\D/g, '');
  if (!d) return null;
  if (d.startsWith('00')) d = d.slice(2);
  else if (d.length <= 11 && !d.startsWith('39')) d = '39' + d; // numeri italiani senza prefisso
  return d;
}

export default async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  const { META_PIXEL_ID, META_CAPI_TOKEN, META_API_VERSION = 'v21.0', META_TEST_EVENT_CODE } = process.env;
  if (!META_PIXEL_ID || !META_CAPI_TOKEN) return new Response('CAPI non configurata', { status: 501 });

  let body;
  try { body = await req.json(); } catch { return new Response('Bad request', { status: 400 }); }
  if (!ALLOWED.has(body.event_name)) return new Response('Evento non ammesso', { status: 400 });

  const ip = req.headers.get('x-nf-client-connection-ip') || (req.headers.get('x-forwarded-for') || '').split(',')[0].trim();
  const user_data = {
    client_ip_address: ip || undefined,
    client_user_agent: req.headers.get('user-agent') || undefined,
    fbp: body.fbp || undefined,
    fbc: body.fbc || undefined,
    country: [sha256('it')]
  };
  const phone = normPhone(body.user && body.user.phone);
  if (phone) user_data.ph = [sha256(phone)];
  const first = body.user && body.user.name ? String(body.user.name).trim().split(/\s+/)[0].toLowerCase() : '';
  if (first) user_data.fn = [sha256(first)];

  const payload = {
    data: [{
      event_name: body.event_name,
      event_time: Number(body.event_time) || Math.floor(Date.now() / 1000),
      event_id: String(body.event_id || ''),
      event_source_url: String(body.event_source_url || ''),
      action_source: 'website',
      user_data,
      custom_data: {
        content_name: body.custom_data && body.custom_data.content_name,
        content_category: body.custom_data && body.custom_data.content_category,
        cta_position: body.custom_data && body.custom_data.cta_position
      }
    }]
  };
  if (META_TEST_EVENT_CODE) payload.test_event_code = META_TEST_EVENT_CODE;

  const res = await fetch(`https://graph.facebook.com/${META_API_VERSION}/${META_PIXEL_ID}/events?access_token=${encodeURIComponent(META_CAPI_TOKEN)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return new Response(JSON.stringify({ ok: res.ok }), { status: res.ok ? 200 : 502, headers: { 'Content-Type': 'application/json' } });
};

export const config = { path: '/api/meta-capi' };
