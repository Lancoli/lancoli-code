// i18n: the text a visitor reads lives in i18n/<lang>.json, keyed in English (dot.case). French is the default;
// English is ready (?lang=en, or the visitor's saved choice). No dependency, classic script, safe to load anywhere.
//
//   <script src="js/i18n.js"></script>                    before the scripts that need t()
//   <h1 data-i18n="home.title"></h1>                      text content
//   <input data-i18n-attr="placeholder:search.hint">      attributes, comma-separated "attr:key" pairs
//   i18n.t('player.play')  ·  i18n.t('feed.count', { n: 3 })   "{n} items" → "3 items"
//   i18n.set('en')                                        switch language (saved in localStorage)
//   await i18n.ready                                      dictionary loaded and the page translated
//
//   i18n.pick({ fr: '…', en: '…' })                      content data: the current language, French as fallback
//   i18n.locale()                                         'fr-FR' or 'en-GB', for toLocaleDateString
//
// A missing key: t() returns the key and warns once; a data-i18n element keeps its written (French) text.
(function () {
  const DEFAULT = 'fr', SUPPORTED = ['fr', 'en'], STORE = 'lang';
  const base = (document.currentScript?.src || '').replace(/js\/i18n\.js(\?.*)?$/, '');
  const fromUrl = new URLSearchParams(location.search).get('lang');
  let saved = null; try { saved = localStorage.getItem(STORE); } catch { /* private mode */ }
  let lang = [fromUrl, saved].find((l) => SUPPORTED.includes(l)) || DEFAULT;
  let dict = {};
  const warned = new Set();

  const t = (key, vars) => {
    let s = dict[key];
    if (s == null) { if (!warned.has(key)) { warned.add(key); console.warn(`i18n: missing "${key}" (${lang})`); } s = key; }
    return vars ? s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m)) : s;
  };
  const apply = (root = document) => {
    // a key missing from the dictionary leaves the element as written (its French text is the fallback)
    root.querySelectorAll('[data-i18n]').forEach((el) => { if (el.dataset.i18n in dict) el.textContent = t(el.dataset.i18n); });
    root.querySelectorAll('[data-i18n-attr]').forEach((el) => {
      for (const pair of el.dataset.i18nAttr.split(',')) { const [a, k] = pair.split(':').map((x) => x.trim()); if (a && k && k in dict) el.setAttribute(a, t(k)); }
    });
    document.documentElement.lang = lang;
  };
  const load = (l) => fetch(`${base}i18n/${l}.json`).then((r) => (r.ok ? r.json() : {})).catch(() => ({}));

  // content data (descriptions, log entries) carries both languages: { fr: '…', en: '…' } → the current one
  const pick = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? (v[lang] ?? v[DEFAULT] ?? '') : (v ?? ''));
  const locale = () => (lang === 'fr' ? 'fr-FR' : 'en-GB');

  const api = {
    t, apply, pick, locale,
    get lang() { return lang; },
    set(l) {
      if (!SUPPORTED.includes(l)) return Promise.resolve();
      lang = l; try { localStorage.setItem(STORE, l); } catch { /* private mode */ }
      return load(l).then((d) => { dict = d; apply(); document.dispatchEvent(new CustomEvent('i18n:change', { detail: { lang } })); });
    },
  };
  api.ready = load(lang).then((d) => {
    dict = d;
    if (document.readyState === 'loading') return new Promise((ok) => document.addEventListener('DOMContentLoaded', () => { apply(); ok(); }, { once: true }));
    apply();
  });
  window.i18n = api;
})();
