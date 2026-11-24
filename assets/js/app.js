/* =====================================================================
   Mirko Rimoldi · Osteopata — interazioni, tracking, motion
   Vanilla JS, nessuna dipendenza. Tutto funziona anche senza animazioni.
   ===================================================================== */
(function () {
  'use strict';

  var CFG = window.SITE_CONFIG || {};
  var doc = document;
  var root = doc.documentElement;
  var MOTION = root.classList.contains('motion');
  var FINE = window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches;
  var DEBUG = /[?&]debug=1/.test(location.search);

  var qs = function (s, c) { return (c || doc).querySelector(s); };
  var qsa = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var ramp = function (a, b, v) { return clamp((v - a) / (b - a), 0, 1); };
  var easeOut = function (t) { return 1 - Math.pow(1 - t, 3); };
  var easeInOut = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  var log = function () { if (DEBUG && window.console) console.log.apply(console, ['[mr]'].concat([].slice.call(arguments))); };

  /* ------------------------------------------------------------------
     1. Config → pagina (gli elementi senza dato restano nascosti)
     ------------------------------------------------------------------ */
  function has(key) {
    var v = CFG[key];
    return Array.isArray(v) ? v.length > 0 : v != null && String(v).trim() !== '';
  }
  function applyConfig() {
    qsa('[data-fill]').forEach(function (el) {
      var k = el.getAttribute('data-fill');
      if (has(k)) el.textContent = String(CFG[k]).trim();
    });
    qsa('[data-if]').forEach(function (el) {
      if (has(el.getAttribute('data-if'))) el.classList.add('is-on');
    });
    qsa('[data-unless]').forEach(function (el) {
      if (has(el.getAttribute('data-unless'))) el.hidden = true;
    });
    qsa('[data-href]').forEach(function (el) {
      var k = el.getAttribute('data-href');
      if (has(k)) el.setAttribute('href', CFG[k]);
    });
    qsa('[data-href-tel]').forEach(function (el) {
      var k = el.getAttribute('data-href-tel');
      if (has(k)) el.setAttribute('href', 'tel:' + String(CFG[k]).replace(/[^\d+]/g, ''));
    });
    qsa('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

    // Recensioni: solo con almeno 5 recensioni reali
    var reviews = Array.isArray(CFG.reviews) ? CFG.reviews.filter(function (r) { return r && r.text && r.name; }) : [];
    if (reviews.length >= 5) {
      var list = qs('[data-reviews]');
      var star = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 3.2l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L3.4 9.5l6-.8z"/></svg>';
      list.innerHTML = reviews.map(function (r) {
        var n = clamp(Math.round(r.rating || 5), 1, 5);
        return '<li class="review"><div class="review__stars" role="img" aria-label="' + n + ' stelle su 5">' +
          new Array(n + 1).join(star) + '</div><p></p><cite></cite></li>';
      }).join('');
      qsa('.review', list).forEach(function (li, i) {
        qs('p', li).textContent = '“' + reviews[i].text + '”';
        qs('cite', li).textContent = reviews[i].name;
      });
      qs('#recensioni').hidden = false;
      qs('#promesse').hidden = true;
    }
  }

  /* ------------------------------------------------------------------
     1b. Orari dello studio: settimana, giorno di oggi, aperto/chiuso ora
         (sempre in ora italiana, ovunque si trovi chi guarda)
     ------------------------------------------------------------------ */
  function initHours() {
    var H = CFG.hours;
    if (!H || typeof H !== 'object') return;
    var KEYS = ['lun', 'mar', 'mer', 'gio', 'ven', 'sab', 'dom'];
    var NAMES = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
    var SHORT = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
    function ranges(v) {
      return String(v || '').split(',').map(function (r) {
        var m = r.trim().match(/^(\d{1,2})[:.](\d{2})\s*[-–]\s*(\d{1,2})[:.](\d{2})$/);
        return m ? [+m[1] * 60 + +m[2], +m[3] * 60 + +m[4]] : null;
      }).filter(Boolean);
    }
    function hhmm(min) { var h = Math.floor(min / 60), m = min % 60; return h + ':' + (m < 10 ? '0' : '') + m; }
    function label(rs) { return rs.length ? rs.map(function (r) { return hhmm(r[0]) + ' – ' + hhmm(r[1]); }).join(', ') : 'Chiuso'; }
    var week = KEYS.map(function (k) { return ranges(H[k]); });

    // giorno e ora in Italia
    var today = -1, now = 0;
    try {
      var parts = new Intl.DateTimeFormat('it-IT', { timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
      var get = function (t) { var p = parts.filter(function (x) { return x.type === t; })[0]; return p ? p.value : ''; };
      today = KEYS.indexOf(get('weekday').toLowerCase().replace('.', '').slice(0, 3));
      now = (+get('hour') % 24) * 60 + +get('minute');
    } catch (e) { var d = new Date(); today = (d.getDay() + 6) % 7; now = d.getHours() * 60 + d.getMinutes(); }

    var list = qs('[data-hours]');
    if (list) {
      list.innerHTML = '';
      week.forEach(function (rs, i) {
        var li = doc.createElement('li');
        li.className = 'hours__row' + (i === today ? ' is-today' : '') + (rs.length ? '' : ' is-closed');
        var a = doc.createElement('span'); a.className = 'hours__day'; a.textContent = NAMES[i];
        if (i === today) { var t = doc.createElement('span'); t.className = 'hours__today'; t.textContent = 'oggi'; a.appendChild(t); }
        var b = doc.createElement('span'); b.className = 'hours__time'; b.textContent = label(rs);
        li.appendChild(a); li.appendChild(b); list.appendChild(li);
      });
      list.setAttribute('data-stagger', '');
    }

    var status = qs('[data-hours-status]');
    if (status && today >= 0) {
      var open = null;
      week[today].forEach(function (r) { if (now >= r[0] && now < r[1]) open = r; });
      var txt;
      if (open) {
        txt = 'Aperto ora · chiude alle ' + hhmm(open[1]);
      } else {
        txt = 'Chiuso ora';
        for (var k = 0; k < 8; k++) {
          var di = (today + k) % 7;
          var next = week[di].filter(function (r) { return k > 0 || r[0] > now; })[0];
          if (next) { txt += ' · riapre ' + (k === 0 ? 'alle ' : k === 1 ? 'domani alle ' : NAMES[di].toLowerCase() + ' alle ') + hhmm(next[0]); break; }
        }
      }
      status.textContent = txt;
      status.classList.toggle('is-open', !!open);
    }

    // versione breve per il footer: giorni consecutivi con lo stesso orario raggruppati
    var short = qs('[data-hours-short]');
    if (short) {
      var out = [], i = 0;
      while (i < 7) {
        var j = i;
        while (j + 1 < 7 && label(week[j + 1]) === label(week[i])) j++;
        out.push((j > i ? SHORT[i] + '–' + SHORT[j] : SHORT[i]) + ' ' + (week[i].length ? label(week[i]).replace(/ – /g, '–') : 'chiuso'));
        i = j + 1;
      }
      short.textContent = out.join(' · ');
    }
  }

  /* ------------------------------------------------------------------
     2. UTM / fbclid (sessionStorage, solo per questa sessione)
     ------------------------------------------------------------------ */
  var UTM = (function () {
    var keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid'];
    var stored = {};
    try { stored = JSON.parse(sessionStorage.getItem('mr_utm')) || {}; } catch (e) {}
    try {
      var q = new URLSearchParams(location.search);
      keys.forEach(function (k) { var v = q.get(k); if (v) stored[k] = v.slice(0, 200); });
      sessionStorage.setItem('mr_utm', JSON.stringify(stored));
    } catch (e) {}
    return stored;
  })();

  /* ------------------------------------------------------------------
     3. Consenso + Meta Pixel + Conversions API
     ------------------------------------------------------------------ */
  var Track = (function () {
    var KEY = 'mr_consent_v1';
    var MAX_AGE = 180 * 864e5; // 6 mesi, poi si richiede di nuovo
    var enabled = has('metaPixelId');
    var consent = null;
    try {
      var saved = JSON.parse(localStorage.getItem(KEY));
      if (saved && Date.now() - saved.t < MAX_AGE) consent = saved.v;
    } catch (e) {}

    var banner = qs('[data-consent]');
    var settingsBtn = qs('[data-cookie-settings]');

    function save(v) {
      consent = v;
      try { localStorage.setItem(KEY, JSON.stringify({ v: v, t: Date.now() })); } catch (e) {}
    }
    function granted() { return enabled && consent === 'granted'; }
    function cookie(name) {
      var m = doc.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
      return m ? decodeURIComponent(m[1]) : undefined;
    }
    function loadPixel() {
      if (!granted() || window.fbq) return;
      /* eslint-disable */
      !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments) }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s) }(window, doc, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      /* eslint-enable */
      window.fbq('init', String(CFG.metaPixelId));
      window.fbq('track', 'PageView');
      log('pixel loaded');
    }
    function newId(name) {
      return name.toLowerCase() + '.' + Date.now().toString(36) + '.' + Math.random().toString(36).slice(2, 8);
    }
    function sendCapi(name, id, params, user) {
      if (!has('capiEndpoint')) return;
      var fbc = cookie('_fbc') || (UTM.fbclid ? 'fb.1.' + Date.now() + '.' + UTM.fbclid : undefined);
      var body = {
        event_name: name,
        event_id: id,
        event_time: Math.floor(Date.now() / 1000),
        event_source_url: location.href,
        custom_data: params,
        fbp: cookie('_fbp'),
        fbc: fbc,
        user: user || undefined,
        utm: UTM
      };
      try {
        fetch(CFG.capiEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), keepalive: true }).catch(function () {});
      } catch (e) {}
    }
    /* opts: { custom: bool, user: {name, phone}, capi: bool } */
    function event(name, params, opts) {
      opts = opts || {};
      params = params || {};
      var id = opts.eventId || newId(name);
      log(opts.custom ? 'custom' : 'event', name, params, id, granted() ? '' : '(non inviato: nessun consenso)');
      if (!granted()) return id;
      if (window.fbq) window.fbq(opts.custom ? 'trackCustom' : 'track', name, params, { eventID: id });
      if (opts.capi) sendCapi(name, id, params, opts.user);
      return id;
    }

    function showBanner() {
      if (!banner) return;
      banner.hidden = false;
      root.classList.add('has-banner');
    }
    function hideBanner() {
      if (!banner) return;
      banner.hidden = true;
      root.classList.remove('has-banner');
    }
    function choose(v) {
      var was = consent;
      save(v);
      hideBanner();
      if (v === 'granted') loadPixel();
      if (v === 'denied' && was === 'granted') {
        if (window.fbq) window.fbq('consent', 'revoke');
        ['_fbp', '_fbc'].forEach(function (c) {
          doc.cookie = c + '=; Max-Age=0; path=/; domain=' + location.hostname.replace(/^www\./, '.');
          doc.cookie = c + '=; Max-Age=0; path=/';
        });
      }
      onScroll();
    }

    function init() {
      if (!enabled) { log('Pixel non configurato: nessun banner, nessun tracciamento'); return; }
      if (settingsBtn) {
        settingsBtn.hidden = false;
        settingsBtn.addEventListener('click', showBanner);
      }
      qsa('[data-consent-choice]').forEach(function (b) {
        b.addEventListener('click', function () { choose(b.getAttribute('data-consent-choice')); });
      });
      if (consent === 'granted') loadPixel();
      else if (consent === null) showBanner();
    }

    return { init: init, event: event, bannerOpen: function () { return banner && !banner.hidden; } };
  })();

  /* ------------------------------------------------------------------
     4. WhatsApp
     ------------------------------------------------------------------ */
  function waText(text) {
    var t = text || CFG.whatsappMessage || 'Ciao Mirko, vorrei prenotare la visita conoscitiva gratuita.';
    var ref = UTM.utm_campaign || UTM.utm_source;
    if (CFG.appendCampaignRef && ref) t += '\n\n(rif. ' + ref + ')';
    return t;
  }
  function waUrl(text) {
    var n = String(CFG.whatsappNumber || '').replace(/\D/g, '');
    return 'https://wa.me/' + n + '?text=' + encodeURIComponent(waText(text));
  }
  function initCalls() {
    qsa('[data-call]').forEach(function (a) {
      a.addEventListener('click', function () {
        Track.event('Contact', { content_name: 'Visita conoscitiva gratuita', content_category: 'telefono', cta_position: a.getAttribute('data-cta') || 'altro' }, { capi: true });
      });
    });
  }
  function initWhatsApp() {
    var url = waUrl();
    qsa('[data-wa]').forEach(function (a) {
      a.setAttribute('href', url);
      a.addEventListener('click', function () {
        var pos = a.getAttribute('data-cta') || 'altro';
        var params = { content_name: 'Visita conoscitiva gratuita', content_category: 'whatsapp', cta_position: pos };
        Track.event('Lead', params, { capi: true });
        Track.event('Contact', params, { capi: true });
      });
    });
  }

  /* ------------------------------------------------------------------
     5. Header, barra mobile, theme-color, profondità di scroll
     ------------------------------------------------------------------ */
  var header = qs('[data-header]');
  var themed = qsa('[data-theme]');
  var metaTheme = qs('meta[name="theme-color"]');
  var sticky = qs('[data-sticky]');
  var stickyLink = sticky && qs('a', sticky);
  var heroCta = qs('[data-hero-cta]');
  var finalSec = qs('[data-final]');
  var reframeSec = qs('[data-reframe]');
  var THEME_COLORS = { light: '#F5F7FA', dark: '#060F1A' };
  var lastTone = '';
  var depthFired = {};
  var scrollers = [];

  function toneAt(probe) {
    var tone = 'light';
    for (var i = 0; i < themed.length; i++) {
      var r = themed[i].getBoundingClientRect();
      if (r.top <= probe && r.bottom > probe) tone = themed[i].getAttribute('data-theme');
    }
    return tone;
  }
  function updateHeader() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 8);
    var tone = root.classList.contains('menu-open') ? 'light' : toneAt(32);
    if (tone !== lastTone) {
      lastTone = tone;
      header.setAttribute('data-tone', tone === 'dark' ? 'dark' : 'light');
      if (metaTheme) metaTheme.setAttribute('content', THEME_COLORS[tone] || THEME_COLORS.light);
    }
  }
  function updateSticky() {
    if (!sticky || !heroCta || !finalSec) return;
    var vh = window.innerHeight;
    var rf = reframeSec && reframeSec.classList.contains('is-scrub') ? reframeSec.getBoundingClientRect() : null;
    var pinned = rf && rf.top <= 1 && rf.bottom >= vh - 1; // la scena della colonna respira senza barra
    var show = !pinned && !root.classList.contains('menu-open') && heroCta.getBoundingClientRect().bottom < 0 &&
      finalSec.getBoundingClientRect().top > vh * .92 &&
      !Track.bannerOpen();
    if (show) sticky.setAttribute('data-tone', toneAt(vh - 40) === 'dark' ? 'dark' : 'light');
    if (show !== sticky.classList.contains('is-visible')) {
      sticky.classList.toggle('is-visible', show);
      sticky.setAttribute('aria-hidden', show ? 'false' : 'true');
      if (stickyLink) stickyLink.tabIndex = show ? 0 : -1;
    }
  }
  function updateDepth() {
    var h = doc.documentElement.scrollHeight - window.innerHeight;
    if (h <= 0) return;
    var pct = (window.scrollY / h) * 100;
    [25, 50, 75, 100].forEach(function (t) {
      if (pct >= t - .5 && !depthFired[t]) {
        depthFired[t] = true;
        Track.event('ScrollDepth', { percent: t }, { custom: true });
        if (t === 50) Track.event('ViewContent', { content_name: 'Landing osteopata Turate' }, { capi: true });
      }
    });
  }
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      for (var i = 0; i < scrollers.length; i++) scrollers[i]();
      updateHeader();
      updateSticky();
      updateDepth();
    });
  }

  function initTimeOnPage() {
    var visibleMs = 0, last = Date.now(), done = false;
    var iv = setInterval(function () {
      var now = Date.now();
      if (doc.visibilityState === 'visible') visibleMs += now - last;
      last = now;
      if (!done && visibleMs >= 30000) {
        done = true;
        clearInterval(iv);
        Track.event('TimeOnPage30s', { seconds: 30 }, { custom: true });
      }
    }, 1000);
  }

  /* ------------------------------------------------------------------
     6. Hero: campo di linee che vibra e si scioglie
     ------------------------------------------------------------------ */
  function initField() {
    var canvas = qs('.hero__field');
    var hero = qs('.hero');
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    var W = 0, H = 0, lines = [], raf = 0, t0 = 0, lastDraw = 0, inView = true;
    var ptr = { x: -9999, y: -9999, tx: -9999, ty: -9999, on: false };
    var INTRO_HOLD = .35, INTRO_REL = 1.25;

    function build() {
      var n = Math.round(clamp(H / 23, 18, 44));
      lines = [];
      for (var i = 0; i < n; i++) {
        lines.push({ base: (i + .5) / n, phase: i * .42 + Math.random() * .5, amp: .55 + Math.random() * .8, seed: Math.random() * 100, accent: i % 7 === 3 });
      }
    }
    function resize() {
      var r = canvas.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; H = r.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
      if (!MOTION) draw(9);
    }
    function draw(el) {
      var rel = MOTION ? easeOut(clamp((el - INTRO_HOLD) / INTRO_REL, 0, 1)) : 1;
      var tension = 1 - rel;
      var cy = H * .46;
      var contract = .5 + .5 * rel;
      var pts = Math.ceil(W / 14) + 1;
      var seg = W / (pts - 1);
      var k = (Math.PI * 2) / (W * .95);
      var A = clamp(H * .011, 5, 11);
      var wide = W >= 960;
      ptr.x += (ptr.tx - ptr.x) * .14;
      ptr.y += (ptr.ty - ptr.y) * .14;
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < lines.length; i++) {
        var L = lines[i];
        var y0 = cy + (L.base * H - cy) * contract;
        ctx.beginPath();
        for (var j = 0; j < pts; j++) {
          var x = j * seg;
          var y = y0 + Math.sin(x * k + el * .32 + L.phase) * A * L.amp * rel;
          if (tension > .001) {
            y += tension * (Math.sin(x * .23 + L.seed + el * 41) * 2.4 + (Math.random() - .5) * 2.6);
          }
          if (ptr.on) {
            var dx = x - ptr.x, dy = y0 - ptr.y;
            var d2 = dx * dx + dy * dy;
            if (d2 < 52000) y += Math.exp(-d2 / 9000) * 16 * (dy >= 0 ? 1 : -1);
          }
          if (j === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        var a;
        if (L.accent) {
          a = .07 + .16 * rel;
          ctx.strokeStyle = 'rgba(30,85,179,' + a + ')';
          ctx.lineWidth = 1.25;
        } else {
          a = (wide ? .075 : .06) * (1 - .25 * rel) + .06 * tension;
          ctx.strokeStyle = 'rgba(11,26,43,' + a + ')';
          ctx.lineWidth = 1;
        }
        ctx.stroke();
      }
    }
    function frame(now) {
      raf = 0;
      if (!inView || doc.hidden) return;
      if (!t0) t0 = now;
      var el = (now - t0) / 1000;
      var settled = el > INTRO_HOLD + INTRO_REL + .2;
      // dopo l'intro: 30 fps bastano per la deriva lenta
      if (!settled || ptr.on || now - lastDraw > 32) {
        draw(el);
        lastDraw = now;
      }
      raf = requestAnimationFrame(frame);
    }
    function start() { if (MOTION && !raf) raf = requestAnimationFrame(frame); }

    resize();
    if ('ResizeObserver' in window) new ResizeObserver(function () { resize(); }).observe(canvas);
    else window.addEventListener('resize', resize);
    if (!MOTION) return;

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        inView = es[0].isIntersecting;
        if (inView) start();
      }).observe(hero);
    }
    doc.addEventListener('visibilitychange', function () { if (!doc.hidden) start(); });
    function setPtr(e) {
      var r = canvas.getBoundingClientRect();
      ptr.tx = e.clientX - r.left;
      ptr.ty = e.clientY - r.top;
      if (!ptr.on) { ptr.x = ptr.tx; ptr.y = ptr.ty; }
      ptr.on = true;
    }
    hero.addEventListener('pointermove', setPtr, { passive: true });
    hero.addEventListener('pointerdown', setPtr, { passive: true });
    hero.addEventListener('pointerleave', function () { ptr.on = false; });
    hero.addEventListener('pointerup', function (e) { if (e.pointerType !== 'mouse') ptr.on = false; });
    hero.addEventListener('pointercancel', function () { ptr.on = false; });
    start();
  }

  /* ------------------------------------------------------------------
     7. Reveal a scroll (IntersectionObserver)
     ------------------------------------------------------------------ */
  /* Spezza un titolo in parole mascherate (misurate nello stato finale),
     poi lo restituisce intatto a fine animazione. */
  function splitWords(el) {
    var original = el.innerHTML;
    var words = [];
    (function walk(n) {
      Array.prototype.slice.call(n.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          var f = doc.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) { f.appendChild(doc.createTextNode(p)); return; }
            var o = doc.createElement('span'), i = doc.createElement('span');
            o.className = 'w'; i.className = 'w__i'; i.textContent = p;
            o.appendChild(i); f.appendChild(o); words.push(o);
          });
          c.parentNode.replaceChild(f, c);
        } else if (c.nodeType === 1) { walk(c); }
      });
    })(el);
    var top = null, line = -1;
    words.forEach(function (w) {
      var t = w.offsetTop;
      if (top === null || Math.abs(t - top) > 6) { top = t; line++; }
      w.style.setProperty('--l', line);
      // le parole in "rilascio" partono strette: la loro scatola resta della misura finale
      if (w.parentNode && w.parentNode.closest && w.parentNode.closest('em')) w.style.width = Math.ceil(w.getBoundingClientRect().width) + 'px';
    });
    el.classList.add('is-lines');
    return { lines: line + 1, restore: function () { el.innerHTML = original; el.classList.remove('is-lines'); } };
  }

  function initReveal() {
    qsa('[data-stagger]').forEach(function (list) {
      Array.prototype.forEach.call(list.children, function (c, i) { c.style.setProperty('--i', i); });
    });
    var masks = qsa('[data-reveal="mask"]');
    var targets = qsa('[data-reveal]:not([data-reveal="mask"]), [data-stagger], [data-load], [data-paths], .pillar, .footer__end');
    if (!MOTION || !('IntersectionObserver' in window)) {
      targets.concat(masks).forEach(function (t) { t.classList.add('is-in'); });
      return;
    }
    function playMask(m) {
      if (m.__played) return;
      m.__played = true;
      var split = m.__split;
      requestAnimationFrame(function () {
        m.classList.add('is-in');
        if (split) setTimeout(split.restore, 1400 + split.lines * 90 + 1400);
      });
    }
    var maskIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        playMask(e.target);
        maskIo.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0 });
    function armMasks() {
      masks.forEach(function (m) {
        if (m.__split || m.__played) return;
        m.__split = splitWords(m);
        maskIo.observe(m);
      });
    }
    // si misura con il font definitivo, così le righe non cambiano a metà animazione
    var armed = false;
    function arm() { if (armed) return; armed = true; armMasks(); }
    setTimeout(arm, 900);
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(arm);
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
        if (e.target.hasAttribute('data-paths')) countUp(e.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: .12 });
    targets.forEach(function (t) { io.observe(t); });
  }
  function countUp(scope) {
    qsa('[data-count]', scope).forEach(function (el) {
      var full = el.getAttribute('data-count');
      var target = parseInt(full, 10);
      if (!target) return;
      el.style.width = Math.ceil(el.getBoundingClientRect().width + 1) + 'px'; // larghezza fissa: niente spostamenti
      var t0 = 0;
      function step(now) {
        if (!t0) t0 = now;
        var k = clamp((now - t0) / 750, 0, 1);
        el.textContent = k < 1 ? String(Math.round(easeOut(k) * target)) : full;
        if (k < 1) requestAnimationFrame(step);
      }
      el.textContent = '0';
      setTimeout(function () { requestAnimationFrame(step); }, 250);
    });
  }

  /* ------------------------------------------------------------------
     8. Card "Ti riconosci?": tap per rilassare, tilt su desktop
     ------------------------------------------------------------------ */
  function initQuotes() {
    var cards = qsa('.quote');
    var count = qs('[data-pick-count]'), label = qs('[data-pick-label]'), cta = qs('[data-pick-cta]');
    var base = count ? count.innerHTML : '';
    function syncPick() {
      var picked = cards.filter(function (c) { return c.classList.contains('is-open'); });
      if (!count || !cta) return;
      if (!picked.length) {
        count.innerHTML = base;
        label.textContent = 'Parliamone su WhatsApp';
        cta.setAttribute('href', waUrl());
        return;
      }
      count.innerHTML = picked.length === 1 ? 'Ti riconosci in <em>1 situazione.</em>' : 'Ti riconosci in <em>' + picked.length + ' situazioni.</em>';
      label.textContent = 'Raccontamelo su WhatsApp';
      var list = picked.map(function (c) { return c.getAttribute('data-short'); }).join('; ');
      cta.setAttribute('href', waUrl('Ciao Mirko, vorrei prenotare la visita conoscitiva gratuita. Mi riconosco in: ' + list + '. Quando c’è posto?'));
    }
    cards.forEach(function (li) {
      var btn = qs('.quote__btn', li);
      btn.addEventListener('click', function () {
        var open = !li.classList.contains('is-open');
        li.classList.toggle('is-open', open);
        btn.setAttribute('aria-pressed', open ? 'true' : 'false');
        syncPick();
      });
      if (FINE && MOTION) {
        // una luce morbida segue il puntatore dentro la card
        li.addEventListener('pointermove', function (e) {
          var r = li.getBoundingClientRect();
          li.style.setProperty('--mx', (e.clientX - r.left).toFixed(0) + 'px');
          li.style.setProperty('--my', (e.clientY - r.top).toFixed(0) + 'px');
        });
      }
    });
  }

  /* ------------------------------------------------------------------
     9. Reframe: la colonna spezzata si riallinea a scroll
     ------------------------------------------------------------------ */
  function initSpine() {
    var section = qs('[data-reframe]');
    if (!section) return;
    var fig = qs('.spine', section);
    var svg = qs('.spine__svg', section);
    var NS = 'http://www.w3.org/2000/svg';
    var VB_W = 480, VB_H = 600, CX = 240;
    svg.setAttribute('viewBox', '0 0 ' + VB_W + ' ' + VB_H);
    var bodyG = qs('.spine__body', svg), linksG = qs('.spine__links', svg), painG = qs('.spine__pain', svg);
    var stage = qs('.reframe__stage', section);
    var title = qs('.reframe__title', section), text = qs('.reframe__text', section);
    var layerDark = qs('.reframe__layer--dark', section), layerMid = qs('.reframe__layer--mid', section);
    var tags = qsa('.spine__tag', fig);

    var seed = 11;
    function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
    function el(name, attrs, parent) {
      var n = doc.createElementNS(NS, name);
      for (var k in attrs) n.setAttribute(k, attrs[k]);
      if (parent) parent.appendChild(n);
      return n;
    }

    // Clavicole, spalle, bacino (sotto le vertebre), poi vertebre e cranio
    var frameG = el('g', {}, bodyG);
    var clavR = [el('path', { class: 'frame frame--shade' }, frameG), el('path', { class: 'frame' }, frameG)];
    var clavL = [el('path', { class: 'frame frame--shade' }, frameG), el('path', { class: 'frame' }, frameG)];
    var pelvis = el('g', {}, frameG);
    el('path', { d: 'M-66 -10 Q0 44 66 -10', class: 'frame frame--shade' }, pelvis);
    el('path', { d: 'M-66 -10 Q0 44 66 -10', class: 'frame' }, pelvis);
    var shR = el('circle', { r: 9, class: 'bone' }, frameG);
    var shL = el('circle', { r: 9, class: 'bone' }, frameG);

    // Vertebre
    var N = 17, TOP = 128, BOT = 468, verts = [];
    for (var i = 0; i < N; i++) {
      var t = i / (N - 1);
      var K = Math.PI * 2.1, PH = .15, AMP = 11;
      var ya = TOP + t * (BOT - TOP);
      var xa = CX + AMP * Math.sin(t * K + PH);
      var slope = AMP * Math.cos(t * K + PH) * K / (BOT - TOP);
      var ra = -Math.atan(slope) * 180 / Math.PI;
      var w = 26 + t * 26, h = 11 + t * 7;
      var sgn = rnd() < .5 ? -1 : 1;
      var g = el('g', {}, bodyG);
      el('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: h / 2, class: 'bone' }, g);
      verts.push({
        g: g, xa: xa, ya: ya, ra: ra,
        xb: xa + sgn * (7 + rnd() * 17) * (i % 4 === 1 ? 1.5 : 1),
        yb: 168 + t * (BOT - 168) * .9 + (rnd() - .5) * 8,
        rb: (rnd() < .5 ? -1 : 1) * (8 + rnd() * 18),
        s: rnd() * 100
      });
    }
    var skull = el('circle', { r: 33, class: 'skull' }, bodyG);

    var P = {
      skull: { a: [CX + 4, 66], b: [CX - 16, 98] },
      shR: { a: [CX + 100, 174], b: [CX + 88, 200] },
      shL: { a: [CX - 100, 174], b: [CX - 86, 150] },
      pelvis: { a: [CX, 504, 0], b: [CX - 12, 496, 11] }
    };
    var PAIN_I = 14;

    // Collegamenti dolore → cause
    var links = tags.map(function () {
      var p = el('path', { pathLength: 1 }, linksG);
      var c = el('circle', { r: 3.5 }, linksG);
      return { p: p, c: c, ax: 0, ay: 0 };
    });
    function measureAnchors() {
      var fw = fig.offsetWidth || 1;
      var sc = VB_W / fw;
      tags.forEach(function (tag, i) {
        var left = tag.offsetLeft, top = tag.offsetTop, tw = tag.offsetWidth, th = tag.offsetHeight;
        var rightSide = left > fw / 2;
        links[i].ax = (rightSide ? left : left + tw) * sc;
        links[i].ay = (top + th / 2) * sc;
        links[i].right = rightSide;
      });
    }

    var scrub = MOTION && 'requestAnimationFrame' in window;
    var p = scrub ? 0 : 1, jitterOn = false, loopRaf = 0, inView = false;

    function render(now) {
      var e = scrub ? easeInOut(ramp(.12, .72, p)) : 1;
      var jit = scrub ? (1 - ramp(.08, .46, p)) : 0;
      var tt = (now || 0) / 1000;
      for (var i = 0; i < verts.length; i++) {
        var v = verts[i];
        var jx = jit ? (Math.sin(tt * 37 + v.s) * 1.6 + (Math.random() - .5) * 1.2) * jit : 0;
        var jr = jit ? Math.sin(tt * 29 + v.s * 2) * 2.2 * jit : 0;
        v.x = lerp(v.xb, v.xa, e) + jx;
        v.y = lerp(v.yb, v.ya, e);
        v.g.setAttribute('transform', 'translate(' + v.x.toFixed(2) + ' ' + v.y.toFixed(2) + ') rotate(' + (lerp(v.rb, v.ra, e) + jr).toFixed(2) + ')');
      }
      var s = [lerp(P.skull.b[0], P.skull.a[0], e), lerp(P.skull.b[1], P.skull.a[1], e)];
      skull.setAttribute('cx', s[0].toFixed(2)); skull.setAttribute('cy', s[1].toFixed(2));
      var r = [lerp(P.shR.b[0], P.shR.a[0], e), lerp(P.shR.b[1], P.shR.a[1], e)];
      var l = [lerp(P.shL.b[0], P.shL.a[0], e), lerp(P.shL.b[1], P.shL.a[1], e)];
      shR.setAttribute('cx', r[0].toFixed(2)); shR.setAttribute('cy', r[1].toFixed(2));
      shL.setAttribute('cx', l[0].toFixed(2)); shL.setAttribute('cy', l[1].toFixed(2));
      var v3 = verts[3];
      var dR = 'M' + v3.x.toFixed(1) + ' ' + v3.y.toFixed(1) + ' Q' + ((v3.x + r[0]) / 2).toFixed(1) + ' ' + (Math.min(v3.y, r[1]) - 14).toFixed(1) + ' ' + r[0].toFixed(1) + ' ' + r[1].toFixed(1);
      var dL = 'M' + v3.x.toFixed(1) + ' ' + v3.y.toFixed(1) + ' Q' + ((v3.x + l[0]) / 2).toFixed(1) + ' ' + (Math.min(v3.y, l[1]) - 14).toFixed(1) + ' ' + l[0].toFixed(1) + ' ' + l[1].toFixed(1);
      clavR[0].setAttribute('d', dR); clavR[1].setAttribute('d', dR);
      clavL[0].setAttribute('d', dL); clavL[1].setAttribute('d', dL);
      pelvis.setAttribute('transform', 'translate(' + lerp(P.pelvis.b[0], P.pelvis.a[0], e).toFixed(2) + ' ' + lerp(P.pelvis.b[1], P.pelvis.a[1], e).toFixed(2) + ') rotate(' + lerp(P.pelvis.b[2], P.pelvis.a[2], e).toFixed(2) + ')');

      var pv = verts[PAIN_I];
      painG.setAttribute('transform', 'translate(' + pv.x.toFixed(2) + ' ' + pv.y.toFixed(2) + ')');
      // la linea di scansione scende sulla colonna; il punto di dolore compare quando lo attraversa
      if (scrub) {
        var scanned = ramp(.04, .34, p);
        var fh = fig.offsetHeight || 1;
        fig.style.setProperty('--scan-y', (scanned * fh).toFixed(1) + 'px');
        fig.style.setProperty('--scan-o', (Math.min(ramp(.02, .06, p), 1 - ramp(.32, .38, p))).toFixed(3));
        fig.style.setProperty('--ui-o', (1 - ramp(.58, .74, p)).toFixed(3));
        var painAt = pv.y / VB_H;
        painG.style.opacity = ramp(painAt - .03, painAt + .02, scanned).toFixed(3);
        fig.classList.toggle('is-light', p >= .7);
      }

      var draw = scrub ? ramp(.36, .62, p) : 1;
      links.forEach(function (L) {
        var x0 = pv.x, y0 = pv.y, x1 = L.ax, y1 = L.ay;
        var out = L.right ? 70 : -70;
        var d = 'M' + x0.toFixed(1) + ' ' + y0.toFixed(1) +
          ' C' + (x0 + out).toFixed(1) + ' ' + (y0 - 30).toFixed(1) +
          ' ' + (x1 + (L.right ? -50 : 50)).toFixed(1) + ' ' + (y1 + 70).toFixed(1) +
          ' ' + x1.toFixed(1) + ' ' + y1.toFixed(1);
        L.p.setAttribute('d', d);
        L.p.style.strokeDashoffset = (1 - draw).toFixed(3);
        L.p.style.opacity = draw > 0 ? 1 : 0;
        L.c.setAttribute('cx', x1.toFixed(1)); L.c.setAttribute('cy', y1.toFixed(1));
        L.c.style.opacity = draw > .98 ? 1 : 0;
      });
      if (scrub) {
        tags.forEach(function (tg, i) {
          var k = ramp(.5 + i * .025, .6 + i * .025, p);
          tg.style.opacity = k.toFixed(3);
          tg.style.transform = 'translateY(' + ((1 - k) * 10).toFixed(1) + 'px)';
        });
        var ta = 1 - ramp(.27, .38, p);
        title.style.opacity = ta.toFixed(3);
        title.style.transform = 'translateY(' + ((1 - ta) * -16).toFixed(1) + 'px)';
        var xa = ramp(.8, .9, p);
        text.style.opacity = xa.toFixed(3);
        text.style.transform = 'translateY(' + ((1 - xa) * 16).toFixed(1) + 'px)';
        layerDark.style.opacity = (1 - ramp(.36, .6, p)).toFixed(3);
        layerMid.style.opacity = (1 - ramp(.6, .84, p)).toFixed(3);
        stage.setAttribute('data-theme', p < .72 ? 'dark' : 'light');
        fig.classList.toggle('is-tense', p < .74);
      }
    }

    function progress() {
      var r = section.getBoundingClientRect();
      var total = section.offsetHeight - window.innerHeight;
      p = total > 0 ? clamp(-r.top / total, 0, 1) : 1;
      inView = r.bottom > 0 && r.top < window.innerHeight;
    }
    function loop(now) {
      loopRaf = 0;
      render(now);
      if (jitterOn && inView) loopRaf = requestAnimationFrame(loop);
    }
    function onScrub() {
      progress();
      stage.setAttribute('data-theme', p < .72 ? 'dark' : 'light');
      jitterOn = p < .46;
      if (!loopRaf) loopRaf = requestAnimationFrame(loop);
    }

    if (scrub) {
      section.classList.add('is-scrub');
      measureAnchors();
      onScrub();
      scrollers.push(onScrub);
      window.addEventListener('resize', function () { measureAnchors(); onScrub(); });
    } else {
      measureAnchors();
      render(0);
      window.addEventListener('resize', function () { measureAnchors(); render(0); });
    }
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () { measureAnchors(); scrub ? onScrub() : render(0); });
  }

  /* ------------------------------------------------------------------
     10. Percorso: linea che si disegna a scroll
     ------------------------------------------------------------------ */
  function initSteps() {
    var wrap = qs('[data-steps]');
    if (!wrap) return;
    var bar = qs('.steps__line span', wrap);
    var steps = qsa('.step', wrap);
    if (!MOTION) { steps.forEach(function (s) { s.classList.add('is-reached'); }); return; }
    function update() {
      var r = wrap.getBoundingClientRect();
      var vh = window.innerHeight;
      if (r.bottom < -200 || r.top > vh + 200) return;
      var pr = clamp((vh * .72 - r.top) / (r.height * .8), 0, 1);
      bar.style.setProperty('--p', pr.toFixed(3));
      steps.forEach(function (s, i) {
        s.classList.toggle('is-reached', pr >= (i / Math.max(steps.length - 1, 1)) * .96);
      });
    }
    scrollers.push(update);
    update();
  }

  /* ------------------------------------------------------------------
     11. FAQ: apertura fluida (details/summary nativi)
     ------------------------------------------------------------------ */
  function initFaq() {
    qsa('.qa').forEach(function (d) {
      var s = qs('summary', d), a = qs('.qa__a', d);
      s.addEventListener('click', function (e) {
        if (!MOTION || !a.animate) return;
        e.preventDefault();
        var opts = { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)' };
        if (d.open) {
          d.classList.add('is-closing');
          var h = a.offsetHeight;
          a.animate([{ height: h + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], opts).onfinish = function () {
            d.open = false;
            d.classList.remove('is-closing');
          };
        } else {
          d.open = true;
          var h2 = a.offsetHeight;
          a.animate([{ height: '0px', opacity: 0 }, { height: h2 + 'px', opacity: 1 }], opts);
        }
      });
    });
  }

  /* ------------------------------------------------------------------
     12. Mini-form → messaggio WhatsApp (+ webhook opzionale)
     ------------------------------------------------------------------ */
  function initForm() {
    var form = qs('#lead-form');
    if (!form) return;
    var name = qs('#f-name', form), phone = qs('#f-phone', form), consent = qs('#f-consent', form);
    var areaSet = qs('.chips[aria-describedby="f-area-err"]', form);
    var status = qs('.lead-form__status', form);

    function setErr(input, id, msg) {
      var out = qs('#' + id);
      if (out) out.textContent = msg || '';
      if (input) input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    }
    function cleanPhone(v) { return v.replace(/[\s.\-()\/]/g, ''); }
    function validate() {
      var first = null;
      var nm = name.value.trim();
      if (nm.length < 2) { setErr(name, 'f-name-err', 'Scrivi il tuo nome.'); first = first || name; }
      else setErr(name, 'f-name-err', '');
      var ph = cleanPhone(phone.value.trim());
      if (!/^\+?\d{8,15}$/.test(ph)) { setErr(phone, 'f-phone-err', 'Inserisci un numero di telefono valido, ad esempio 333 123 4567.'); first = first || phone; }
      else setErr(phone, 'f-phone-err', '');
      var areas = qsa('input[name="area"]:checked', form);
      if (!areas.length) { setErr(areaSet, 'f-area-err', 'Scegli almeno una zona (puoi anche indicare “Altro”).'); first = first || qs('input[name="area"]', form); }
      else setErr(areaSet, 'f-area-err', '');
      if (!consent.checked) { setErr(consent, 'f-consent-err', 'Serve il consenso per poterti ricontattare.'); first = first || consent; }
      else setErr(consent, 'f-consent-err', '');
      return first;
    }
    qsa('input', form).forEach(function (inp) {
      inp.addEventListener('change', function () { if (form.classList.contains('was-validated')) validate(); });
      inp.addEventListener('blur', function () { if (form.classList.contains('was-validated')) validate(); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      form.classList.add('was-validated');
      var first = validate();
      if (first) { first.focus(); return; }

      var nm = name.value.trim();
      var ph = phone.value.trim();
      var areas = qsa('input[name="area"]:checked', form).map(function (i) { return i.value; });
      var sinceEl = qs('input[name="since"]:checked', form);
      var since = sinceEl ? sinceEl.value : '';
      var areaTxt = areas.length > 1 ? areas.slice(0, -1).join(', ') + ' e ' + areas[areas.length - 1] : areas[0];
      var msg = 'Ciao Mirko, sono ' + nm + '. Vorrei prenotare la visita conoscitiva gratuita. Ho dolore a: ' + areaTxt +
        (since ? ' da ' + since : '') + '. Il mio numero è ' + ph + '. Quando c’è posto?';
      var url = waUrl(msg);
      var params = { content_name: 'Visita conoscitiva gratuita', content_category: 'form', cta_position: 'form' };
      var id = Track.event('Lead', params, { capi: true, user: { name: nm, phone: ph } });

      if (has('formWebhookUrl')) {
        try {
          fetch(CFG.formWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            keepalive: true,
            body: JSON.stringify({ name: nm, phone: ph, areas: areas, since: since, consent: true, utm: UTM, page: location.href, event_id: id, created_at: new Date().toISOString() })
          }).catch(function () {});
        } catch (err) {}
      }

      status.innerHTML = '';
      var p1 = doc.createTextNode('Sto aprendo WhatsApp con il messaggio pronto. Se non si apre, ');
      var a = doc.createElement('a');
      a.href = url; a.target = '_blank'; a.rel = 'noopener'; a.textContent = 'tocca qui';
      status.appendChild(p1); status.appendChild(a); status.appendChild(doc.createTextNode('.'));
      var w = window.open(url, '_blank', 'noopener');
      if (!w) window.location.href = url;
    });
  }

  /* ------------------------------------------------------------------
     13. Micro-interazioni: magnete, ripple, glow del puntatore
     ------------------------------------------------------------------ */
  function initMicro() {
    if (!MOTION || !FINE) return;
    // magnete leggero sui pulsanti principali (solo mouse)
    qsa('.btn--magnetic').forEach(function (b) {
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        b.style.translate = (x * .1).toFixed(1) + 'px ' + (y * .18).toFixed(1) + 'px';
      });
      b.addEventListener('pointerleave', function () { b.style.translate = '0 0'; });
    });
  }

  /* ------------------------------------------------------------------
     13b. Regia dello scroll: barra di avanzamento, palco che si apre,
          parallasse del ritratto, citazione che si accende parola per parola
     ------------------------------------------------------------------ */
  function initScrollFx() {
    var bar = qs('[data-progress]');
    if (bar && header) {
      scrollers.push(function () {
        var h = doc.documentElement.scrollHeight - window.innerHeight;
        header.style.setProperty('--sp', h > 0 ? clamp(window.scrollY / h, 0, 1).toFixed(4) : '0');
      });
    }
    if (!MOTION) return;

    // Le sezioni scure entrano come un palco che si apre a tutta pagina
    qsa('[data-stage]').forEach(function (sec) {
      scrollers.push(function () {
        var r = sec.getBoundingClientRect();
        var vh = window.innerHeight;
        if (r.top > vh || r.bottom < 0) return;
        var k = easeOut(clamp((vh - r.top) / (vh * .7), 0, 1));
        var maxX = window.innerWidth < 720 ? 10 : 28;
        sec.style.setProperty('--st-x', ((1 - k) * maxX).toFixed(1) + 'px');
        sec.style.setProperty('--st-r', ((1 - k) * 36).toFixed(1) + 'px');
      });
    });

    // Ritratto in hero: scorre un po' più lento della pagina
    var fig = qs('[data-parallax]');
    var hero = qs('.hero');
    if (fig && hero) {
      scrollers.push(function () {
        var y = window.scrollY;
        if (y > hero.offsetHeight) return;
        // su telefono il ritratto è sotto il testo: niente parallasse, resta intero
        fig.style.transform = window.innerWidth >= 960 ? 'translate3d(0,' + (y * .1).toFixed(1) + 'px,0)' : '';
      });
    }

    // Citazione: le parole si accendono mentre la leggi
    qsa('[data-words]').forEach(function (q) {
      var words = [];
      qsa('p span, p em', q).forEach(function (part) {
        var f = doc.createDocumentFragment();
        part.textContent.split(/(\s+)/).forEach(function (t) {
          if (!t) return;
          if (/^\s+$/.test(t)) { f.appendChild(doc.createTextNode(t)); return; }
          var w = doc.createElement('span');
          w.className = 'wd'; w.textContent = t;
          f.appendChild(w); words.push(w);
        });
        part.textContent = '';
        part.appendChild(f);
      });
      q.classList.add('is-words');
      var n = words.length;
      scrollers.push(function () {
        var r = q.getBoundingClientRect();
        var vh = window.innerHeight;
        if (r.bottom < -100 || r.top > vh + 100) return;
        var k = clamp((vh * .82 - r.top) / (vh * .5), 0, 1) * (n + 2);
        for (var i = 0; i < n; i++) words[i].style.setProperty('--wo', (.16 + .84 * clamp(k - i, 0, 1)).toFixed(3));
      });
    });
  }

  /* ------------------------------------------------------------------
     14. Menu (mobile/tablet) e sezione attiva nel menu desktop
     ------------------------------------------------------------------ */
  function initMenu() {
    var toggle = qs('[data-menu-toggle]'), menu = qs('[data-menu]');
    if (!toggle || !menu) return;
    var label = qs('[data-menu-label]', toggle);
    var links = qsa('a', menu);
    var open = false, timer = 0;
    qsa('.menu__list li', menu).forEach(function (li, i) { li.style.setProperty('--i', i); });
    function set(state, keepFocus) {
      open = state;
      clearTimeout(timer);
      toggle.setAttribute('aria-expanded', state ? 'true' : 'false');
      if (label) label.textContent = state ? 'Chiudi il menu' : 'Apri il menu';
      root.classList.toggle('menu-open', state);
      if (state) {
        menu.hidden = false;
        requestAnimationFrame(function () { menu.classList.add('is-open'); });
        setTimeout(function () { if (links[0]) links[0].focus({ preventScroll: true }); }, 60);
      } else {
        menu.classList.remove('is-open');
        timer = setTimeout(function () { menu.hidden = true; }, MOTION ? 360 : 0);
        if (!keepFocus) toggle.focus({ preventScroll: true });
      }
      onScroll();
    }
    toggle.addEventListener('click', function () { set(!open); });
    links.forEach(function (a) { a.addEventListener('click', function () { set(false, true); }); });
    doc.addEventListener('keydown', function (e) {
      if (!open) return;
      if (e.key === 'Escape') { e.preventDefault(); set(false); return; }
      if (e.key !== 'Tab') return;
      var items = [toggle].concat(links);
      var i = items.indexOf(doc.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); items[items.length - 1].focus(); }
      else if (!e.shiftKey && i === items.length - 1) { e.preventDefault(); items[0].focus(); }
    });
    window.addEventListener('resize', function () { if (open && window.innerWidth >= 1100) set(false, true); });
  }
  function initScrollSpy() {
    var links = qsa('[data-nav]');
    if (!links.length || !('IntersectionObserver' in window)) return;
    var map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (l) { l.removeAttribute('aria-current'); });
        if (map[e.target.id]) map[e.target.id].setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    qsa('main > section[id]').forEach(function (s) { io.observe(s); });
  }

  /* ------------------------------------------------------------------
     Avvio
     ------------------------------------------------------------------ */
  function boot() {
    applyConfig();
    initHours();
    Track.init();
    initWhatsApp();
    initCalls();
    initMenu();
    initScrollSpy();
    initField();
    initReveal();
    initQuotes();
    initSpine();
    initSteps();
    initFaq();
    initForm();
    initMicro();
    initScrollFx();
    initTimeOnPage();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
  }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
