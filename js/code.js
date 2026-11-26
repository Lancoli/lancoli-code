// LancoliCode rendering from window.JOURNEY (journey.js):
//   the front page (figures), "At a glance" (projects grouped by kind), the stack of project cards, the metro map of
//   the log (one line per project, one station per step), the filterable log, then the career path if filled in.
// Interface text comes from i18n/<lang>.json (js/i18n.js), content text from the { fr, en } fields of journey.js.
// The page renders once the dictionary is loaded, and again when the visitor switches language.
(function () {
  const data = window.JOURNEY || {};
  const projects = data.projects || [];
  const log = (data.log || []).slice().sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  const byId = Object.fromEntries(projects.map((p) => [p.id, p]));
  const $ = (id) => document.getElementById(id);
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const t = (k, v) => i18n.t(k, v);
  const pick = (v) => i18n.pick(v);

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }

  function tags(list) {
    const ul = el('ul', 'tags');
    (list || []).forEach((x) => ul.appendChild(el('li', null, x)));
    return ul;
  }

  function empty(target, text) {
    target.appendChild(el('p', 'empty', text));
  }

  // 2026-10-23 → 23 oct. / 23 Oct
  const day = (iso) => new Date(iso + 'T12:00:00');
  function short(iso) {
    const d = day(iso);
    return isNaN(d) ? iso : d.toLocaleDateString(i18n.locale(), { day: 'numeric', month: 'short' });
  }

  // Outgoing link: new tab for another site, same tab for the portfolio.
  function isExternal(url) {
    try { return new URL(url, location.href).origin !== location.origin; } catch { return false; }
  }

  function link(node, url) {
    node.href = url;
    if (isExternal(url)) { node.target = '_blank'; node.rel = 'noopener'; }
  }

  function card(item) {
    const node = el(item.url ? 'a' : 'div', 'card' + (item.url ? '' : ' is-local'));
    if (item.url) link(node, item.url);
    const head = el('div', 'card-head');
    head.appendChild(el('h3', null, pick(item.name)));
    head.appendChild(el('span', 'card-go', item.url ? '↗' : t('card.local')));
    node.appendChild(head);
    if (item.url && /^https?:/.test(item.url)) node.appendChild(el('span', 'card-url', item.url.replace(/^https?:\/\//, '').replace(/\/$/, '')));
    const meta = [pick(item.role), item.year].filter(Boolean).join(' · ');
    if (meta) node.appendChild(el('p', 'card-meta', meta));
    if (item.description) node.appendChild(el('p', 'card-desc', pick(item.description)));
    node.appendChild(tags(item.stack));
    return node;
  }

  const entriesOf = (id) => log.filter((j) => j.project === id);
  const colorOf = (p) => (p && p.color) || 'var(--accent)';
  const kindOf = (p) => pick(p.kind) || t('kind.other');

  // ---- front page: issue number (one log entry = one edition), date, figures
  function renderFront() {
    const last = log[0];
    $('issue-number').textContent = `N° ${log.length}`;
    $('front-date').textContent = last ? day(last.date).toLocaleDateString(i18n.locale(), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '';
    const online = projects.filter((p) => p.url).length;
    const technologies = new Set(projects.flatMap((p) => p.stack || [])).size;
    $('figures').replaceChildren(...[
      [projects.length, 'figures.projects'],
      [log.length, 'figures.steps'],
      [technologies, 'figures.technologies'],
      [online, 'figures.online'],
    ].map(([v, key]) => { const d = el('div'); d.append(el('dd', null, String(v)), el('dt', null, t(key))); return d; }));
  }

  // ---- 00 at a glance: projects grouped by kind (the order of first appearance)
  function renderBrief() {
    const kinds = [];
    projects.forEach((p) => { const k = kindOf(p); if (!kinds.includes(k)) kinds.push(k); });
    $('summary').replaceChildren(...kinds.map((k) => {
      const col = el('div', 'brief');
      col.appendChild(el('p', 'brief-kind', k));
      projects.filter((p) => kindOf(p) === k).forEach((p) => {
        const a = el('a', 'brief-project');
        a.href = `#project-${p.id}`;
        a.style.setProperty('--c', colorOf(p));
        a.append(el('span', 'brief-name', pick(p.name)), el('span', 'brief-answer', pick(p.answers) || pick(p.description)));
        col.appendChild(a);
      });
      return col;
    }));
  }

  // ---- 01 the stack: one card per project; while scrolling, each one settles on the previous one
  function renderStack() {
    const stack = $('projects');
    stack.replaceChildren();
    projects.forEach((p, i) => {
      const f = el('article', 'project-card');
      f.id = `project-${p.id}`;
      f.style.setProperty('--i', i);
      f.style.setProperty('--c', colorOf(p));
      const head = el('header', 'project-card-head');
      head.append(el('span', 'project-card-num', String(i + 1).padStart(2, '0')), el('span', 'project-card-kind', pick(p.kind)));
      const status = el(p.url ? 'a' : 'span', 'project-card-status', p.url ? t('project.open') : t('project.local'));
      if (p.url) link(status, p.url);
      head.appendChild(status);
      f.appendChild(head);
      if (p.image) {
        const img = el('img', 'project-card-image');
        img.src = p.image;
        img.alt = t('project.image_alt', { name: pick(p.name) });
        img.loading = 'lazy';
        f.appendChild(img);
      }
      const left = el('div', 'project-card-left');
      left.append(el('h3', 'project-card-name', pick(p.name)));
      if (p.answers) left.appendChild(el('p', 'project-card-answer', pick(p.answers)));
      left.appendChild(el('p', 'project-card-desc', pick(p.description)));
      const right = el('div', 'project-card-right');
      right.appendChild(el('p', 'project-card-label', t('project.under_the_hood')));
      right.appendChild(tags(p.stack));
      const own = entriesOf(p.id);
      right.appendChild(el('p', 'project-card-label', own.length ? t(own.length > 1 ? 'project.log_count.other' : 'project.log_count.one', { n: own.length }) : t('project.log')));
      const latest = el('p', 'project-card-latest');
      if (own.length) {
        const time = el('time', null, short(own[0].date));
        time.dateTime = own[0].date;
        latest.append(time, document.createTextNode(` ${pick(own[0].text)}`));
      } else latest.textContent = t('project.no_entry');
      right.appendChild(latest);
      f.append(left, right);
      stack.appendChild(f);
    });
    // the cards slide into place as they enter the screen
    if (!calm && 'IntersectionObserver' in window) {
      const seen = new IntersectionObserver((es) => es.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-seen'); seen.unobserve(e.target); }
      }), { rootMargin: '0px 0px -12% 0px' });
      stack.querySelectorAll('.project-card').forEach((f) => { f.classList.add('is-pending'); seen.observe(f); });
    }
  }

  // ---- 02 the metro map: one line per project, one station per day with a step
  const NS = 'http://www.w3.org/2000/svg';
  const svgEl = (tag, attrs) => { const n = document.createElementNS(NS, tag); Object.entries(attrs || {}).forEach(([k, v]) => n.setAttribute(k, v)); return n; };
  function renderMap() {
    const frame = $('map');
    frame.replaceChildren();
    const lines = projects.filter((p) => entriesOf(p.id).length)
      .sort((a, b) => (entriesOf(a.id).at(-1).date < entriesOf(b.id).at(-1).date ? -1 : 1));
    if (!lines.length) return empty(frame, t('map.empty'));
    const dates = log.map((j) => day(j.date).getTime());
    const t0 = Math.min(...dates), t1 = Math.max(...dates);
    const W = 1100, G = 170, D = 40, H0 = 46, STEP = 46;
    const H = H0 + lines.length * STEP + 10;
    const x = (iso) => G + ((day(iso).getTime() - t0) / Math.max(1, t1 - t0)) * (W - G - D);
    const y = (i) => H0 + i * STEP + STEP / 2;
    const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': t('map.aria', { lines: lines.length, steps: log.length }) });

    // the months, in the background
    const m = day(log.at(-1).date);
    m.setDate(1);
    for (m.setMonth(m.getMonth() + 1); m.getTime() <= t1; m.setMonth(m.getMonth() + 1)) {
      const iso = `${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, '0')}-01`;
      svg.append(svgEl('line', { x1: x(iso), x2: x(iso), y1: 22, y2: H - 6, class: 'map-month' }));
      const label = svgEl('text', { x: x(iso) + 6, y: 30, class: 'map-month-name' });
      label.textContent = m.toLocaleDateString(i18n.locale(), { month: 'long' });
      svg.append(label);
    }

    // the lines
    const stations = [];
    lines.forEach((p, i) => {
      const own = entriesOf(p.id);
      const xa = x(own.at(-1).date), xb = x(own[0].date);
      svg.append(svgEl('line', { x1: xa - 14, x2: xb + 14, y1: y(i), y2: y(i), stroke: colorOf(p), class: 'map-line' }));
      const name = svgEl('text', { x: G - 30, y: y(i) + 5, class: 'map-name', fill: colorOf(p) });
      name.textContent = pick(p.name);
      svg.append(name);
      const perDay = {};
      own.forEach((j) => { (perDay[j.date] = perDay[j.date] || []).push(pick(j.text)); });
      Object.entries(perDay).forEach(([date, texts]) => stations.push({ p, i, date, texts }));
    });

    // the interchanges: several projects on the same day
    const sameDay = {};
    stations.forEach((s) => { (sameDay[s.date] = sameDay[s.date] || []).push(s); });
    Object.entries(sameDay).filter(([, l]) => l.length > 1).forEach(([date, l]) => {
      const ys = l.map((s) => y(s.i));
      const top = Math.min(...ys), bottom = Math.max(...ys);
      svg.append(svgEl('rect', { x: x(date) - 9, y: top - 9, width: 18, height: bottom - top + 18, rx: 9, class: 'map-interchange' }));
    });

    // the stations: hover or focus → the bubble; click → the log filtered on that project
    const bubble = $('station-bubble');
    bubble.hidden = true;
    stations.forEach((s) => {
      const g = svgEl('g', { class: 'map-station', tabindex: '0', role: 'button', 'aria-label': `${pick(s.p.name)}, ${short(s.date)} : ${s.texts.join(' ')}` });
      g.append(svgEl('circle', { cx: x(s.date), cy: y(s.i), r: 12, class: 'map-target' }), svgEl('circle', { cx: x(s.date), cy: y(s.i), r: 6.5, stroke: colorOf(s.p), class: 'map-dot' }));
      const show = () => {
        bubble.replaceChildren(el('span', 'bubble-head', `${pick(s.p.name)} · ${short(s.date)}`), ...s.texts.map((x) => el('span', 'bubble-text', x)));
        bubble.style.setProperty('--c', colorOf(s.p));
        // the bubble sits in the frame (which does not scroll), above the station
        const r = bubble.parentElement.getBoundingClientRect();
        const c = g.getBoundingClientRect();
        bubble.hidden = false;
        const left = Math.min(Math.max(8, c.left - r.left + c.width / 2 - bubble.offsetWidth / 2), r.width - bubble.offsetWidth - 8);
        bubble.style.left = `${left}px`;
        bubble.style.top = `${c.top - r.top - bubble.offsetHeight - 10}px`;
      };
      g.addEventListener('pointerenter', show);
      g.addEventListener('focus', show);
      g.addEventListener('pointerleave', () => { bubble.hidden = true; });
      g.addEventListener('blur', () => { bubble.hidden = true; });
      const go = () => { filter(s.p.id); $('t-log').scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'start' }); };
      g.addEventListener('click', go);
      g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
      svg.append(g);
    });
    frame.replaceChildren(svg);
  }

  // ---- 03 log, filterable by project
  const list = $('journal');
  const filters = $('filters-bar');
  let current = '';

  function renderLog() {
    list.textContent = '';
    const rows = log.filter((j) => !current || j.project === current);
    if (!rows.length) return empty(list, t('log.empty'));
    rows.forEach((j) => {
      const li = el('li', 'entry');
      li.style.setProperty('--c', colorOf(byId[j.project]));
      const when = el('time', 'entry-when', short(j.date));
      when.dateTime = j.date;
      li.appendChild(when);
      li.appendChild(el('span', 'entry-proj', pick((byId[j.project] || {}).name) || j.project));
      li.appendChild(el('span', 'entry-text', pick(j.text)));
      list.appendChild(li);
    });
  }

  function filter(id) {
    current = id;
    filters.querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.id === id)));
    renderLog();
  }

  function chip(id, label) {
    const b = el('button', 'chip', label);
    b.type = 'button';
    b.dataset.id = id;
    b.setAttribute('aria-pressed', String(id === current));
    b.addEventListener('click', () => filter(id));
    filters.appendChild(b);
  }

  function renderFilters() {
    filters.replaceChildren();
    chip('', t('filters.all'));
    projects.filter((p) => log.some((j) => j.project === p.id)).forEach((p) => chip(p.id, pick(p.name)));
  }

  // ---- the career path: experience then sites built, if filled in journey.js
  function renderPath() {
    const exp = $('experiences');
    exp.replaceChildren();
    (data.experiences || []).forEach((x) => {
      const li = el('li', 'step');
      li.appendChild(el('span', 'step-when', x.period));
      const body = el('div', 'step-body');
      body.appendChild(el('h3', null, pick(x.role)));
      const where = [x.org, x.place].filter(Boolean).join(' · ');
      if (where) body.appendChild(el('p', 'card-meta', where));
      if (x.summary) body.appendChild(el('p', 'card-desc', pick(x.summary)));
      body.appendChild(tags(x.stack));
      li.appendChild(body);
      exp.appendChild(li);
    });
    $('sites').replaceChildren(...(data.sites || []).map(card));
  }

  // ---- language switch: FR ↔ EN, in the header nav
  function renderSwitch() {
    const b = $('lang-switch');
    b.textContent = t('lang.switch');
    b.lang = i18n.lang === 'fr' ? 'en' : 'fr';
  }

  function render() {
    document.title = t('meta.title');
    document.querySelector('meta[name="description"]').content = t('meta.description');
    renderFront(); renderBrief(); renderStack(); renderMap(); renderFilters(); renderLog(); renderPath(); renderSwitch();
  }

  $('lang-switch').addEventListener('click', () => i18n.set(i18n.lang === 'fr' ? 'en' : 'fr'));
  document.addEventListener('i18n:change', render);
  i18n.ready.then(render);
})();
