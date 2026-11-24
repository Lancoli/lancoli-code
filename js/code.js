// Rendu de LancoliCode à partir de window.PARCOURS (parcours.js) :
//   la une (chiffres), « En bref » (projets classés par nature), la pile de fiches projets, la carte de métro du
//   journal (une ligne par projet, une station par avancée), le journal filtrable, puis le parcours s'il est rempli.
(function () {
  const data = window.PARCOURS || {};
  const projets = data.projets || [];
  const journal = (data.journal || []).slice().sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  const byId = Object.fromEntries(projets.map((p) => [p.id, p]));
  const $ = (id) => document.getElementById(id);
  const calme = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }

  function tags(list) {
    const ul = el('ul', 'tags');
    (list || []).forEach((t) => ul.appendChild(el('li', null, t)));
    return ul;
  }

  function empty(target, text) {
    target.appendChild(el('p', 'empty', text));
  }

  // 2026-10-23 → 23 oct.
  const jour = (iso) => new Date(iso + 'T12:00:00');
  function short(iso) {
    const d = jour(iso);
    return isNaN(d) ? iso : d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  }

  // Lien sortant : nouvel onglet pour un autre site, même onglet pour le portfolio.
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
    head.appendChild(el('h3', null, item.nom));
    head.appendChild(el('span', 'card-go', item.url ? '↗' : 'local'));
    node.appendChild(head);
    if (item.url && /^https?:/.test(item.url)) node.appendChild(el('span', 'card-url', item.url.replace(/^https?:\/\//, '').replace(/\/$/, '')));
    const meta = [item.role, item.annee].filter(Boolean).join(' · ');
    if (meta) node.appendChild(el('p', 'card-meta', meta));
    if (item.description) node.appendChild(el('p', 'card-desc', item.description));
    node.appendChild(tags(item.techno));
    return node;
  }

  const entreesDe = (id) => journal.filter((j) => j.projet === id);
  const couleur = (p) => (p && p.couleur) || 'var(--accent)';

  // ---- la une : numéro (une entrée de journal = une édition), date, chiffres
  const last = journal[0];
  $('numero').textContent = `N° ${journal.length}`;
  $('date-une').textContent = last ? jour(last.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '';
  const enLigne = projets.filter((p) => p.url).length;
  const technos = new Set(projets.flatMap((p) => p.techno || [])).size;
  $('chiffres').replaceChildren(...[
    [projets.length, 'projets'],
    [journal.length, 'avancées datées'],
    [technos, 'technologies'],
    [enLigne, 'à ouvrir ici'],
  ].map(([v, mot]) => { const d = el('div'); d.append(el('dd', null, String(v)), el('dt', null, mot)); return d; }));

  // ---- 00 en bref : les projets rangés par nature
  const natures = [];
  projets.forEach((p) => { const n = p.nature || 'Autre'; if (!natures.includes(n)) natures.push(n); });
  $('sommaire').replaceChildren(...natures.map((n) => {
    const col = el('div', 'bref');
    col.appendChild(el('p', 'bref-nature', n));
    projets.filter((p) => (p.nature || 'Autre') === n).forEach((p) => {
      const a = el('a', 'bref-projet');
      a.href = `#projet-${p.id}`;
      a.style.setProperty('--c', couleur(p));
      a.append(el('span', 'bref-nom', p.nom), el('span', 'bref-repond', p.repond || p.description || ''));
      col.appendChild(a);
    });
    return col;
  }));

  // ---- 01 la pile : une fiche par projet ; au défilement, chacune vient se poser sur la précédente
  const pile = $('projets');
  projets.forEach((p, i) => {
    const f = el('article', 'fiche');
    f.id = `projet-${p.id}`;
    f.style.setProperty('--i', i);
    f.style.setProperty('--c', couleur(p));
    const tete = el('header', 'fiche-tete');
    tete.append(el('span', 'fiche-num', String(i + 1).padStart(2, '0')), el('span', 'fiche-nature', p.nature || ''));
    const etat = el(p.url ? 'a' : 'span', 'fiche-etat', p.url ? 'Ouvrir ↗' : 'Local, pas en ligne');
    if (p.url) link(etat, p.url);
    tete.appendChild(etat);
    f.appendChild(tete);
    if (p.image) {
      const img = el('img', 'fiche-image');
      img.src = p.image;
      img.alt = `Capture d'écran du projet ${p.nom}`;
      img.loading = 'lazy';
      f.appendChild(img);
    }
    const titre = el('h3', 'fiche-nom', p.nom);
    const gauche = el('div', 'fiche-gauche');
    gauche.append(titre);
    if (p.repond) gauche.appendChild(el('p', 'fiche-repond', p.repond));
    gauche.appendChild(el('p', 'fiche-desc', p.description));
    const droite = el('div', 'fiche-droite');
    droite.appendChild(el('p', 'fiche-label', 'Sous le capot'));
    droite.appendChild(tags(p.techno));
    const siens = entreesDe(p.id);
    droite.appendChild(el('p', 'fiche-label', siens.length ? `Journal · ${siens.length} entrée${siens.length > 1 ? 's' : ''}` : 'Journal'));
    const derniere = el('p', 'fiche-derniere');
    if (siens.length) {
      const t = el('time', null, short(siens[0].date));
      t.dateTime = siens[0].date;
      derniere.append(t, document.createTextNode(` ${siens[0].texte}`));
    } else derniere.textContent = 'Pas encore d\'entrée.';
    droite.appendChild(derniere);
    f.append(gauche, droite);
    pile.appendChild(f);
  });
  // les fiches apparaissent en glissant à leur place quand elles entrent à l'écran
  if (!calme && 'IntersectionObserver' in window) {
    const vu = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-vu'); vu.unobserve(e.target); }
    }), { rootMargin: '0px 0px -12% 0px' });
    pile.querySelectorAll('.fiche').forEach((f) => { f.classList.add('a-venir'); vu.observe(f); });
  }

  // ---- 02 la carte de métro : une ligne par projet, une station par jour d'avancée
  const NS = 'http://www.w3.org/2000/svg';
  const svgEl = (tag, attrs) => { const n = document.createElementNS(NS, tag); Object.entries(attrs || {}).forEach(([k, v]) => n.setAttribute(k, v)); return n; };
  function carte() {
    const lignes = projets.filter((p) => entreesDe(p.id).length)
      .sort((a, b) => (entreesDe(a.id).at(-1).date < entreesDe(b.id).at(-1).date ? -1 : 1));
    if (!lignes.length) return empty($('carte'), 'La carte se dessine avec le journal.');
    const dates = journal.map((j) => jour(j.date).getTime());
    const t0 = Math.min(...dates), t1 = Math.max(...dates);
    const W = 1100, G = 170, D = 40, H0 = 46, PAS = 46;
    const H = H0 + lignes.length * PAS + 10;
    const x = (iso) => G + ((jour(iso).getTime() - t0) / Math.max(1, t1 - t0)) * (W - G - D);
    const y = (i) => H0 + i * PAS + PAS / 2;
    const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': `Carte des projets : ${lignes.length} lignes, ${journal.length} avancées. Le détail est dans le journal plus bas.` });

    // les mois, en fond
    const m = jour(journal.at(-1).date);
    m.setDate(1);
    for (m.setMonth(m.getMonth() + 1); m.getTime() <= t1; m.setMonth(m.getMonth() + 1)) {
      const iso = `${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, '0')}-01`;
      svg.append(svgEl('line', { x1: x(iso), x2: x(iso), y1: 22, y2: H - 6, class: 'carte-mois' }));
      const t = svgEl('text', { x: x(iso) + 6, y: 30, class: 'carte-mois-nom' });
      t.textContent = m.toLocaleDateString('fr-FR', { month: 'long' });
      svg.append(t);
    }

    // les lignes
    const stations = [];
    lignes.forEach((p, i) => {
      const siens = entreesDe(p.id);
      const xa = x(siens.at(-1).date), xb = x(siens[0].date);
      svg.append(svgEl('line', { x1: xa - 14, x2: xb + 14, y1: y(i), y2: y(i), stroke: couleur(p), class: 'carte-ligne' }));
      const nom = svgEl('text', { x: G - 30, y: y(i) + 5, class: 'carte-nom', fill: couleur(p) });
      nom.textContent = p.nom;
      svg.append(nom);
      const parJour = {};
      siens.forEach((j) => { (parJour[j.date] = parJour[j.date] || []).push(j.texte); });
      Object.entries(parJour).forEach(([date, textes]) => stations.push({ p, i, date, textes }));
    });

    // les correspondances : plusieurs projets le même jour
    const memeJour = {};
    stations.forEach((s) => { (memeJour[s.date] = memeJour[s.date] || []).push(s); });
    Object.entries(memeJour).filter(([, l]) => l.length > 1).forEach(([date, l]) => {
      const ys = l.map((s) => y(s.i));
      const haut = Math.min(...ys), bas = Math.max(...ys);
      svg.append(svgEl('rect', { x: x(date) - 9, y: haut - 9, width: 18, height: bas - haut + 18, rx: 9, class: 'carte-correspondance' }));
    });

    // les stations : survol ou focus → la bulle ; clic → le journal filtré sur ce projet
    const bulle = $('bulle-station');
    const cadre = $('carte');
    stations.forEach((s) => {
      const g = svgEl('g', { class: 'carte-station', tabindex: '0', role: 'button', 'aria-label': `${s.p.nom}, ${short(s.date)} : ${s.textes.join(' ')}` });
      g.append(svgEl('circle', { cx: x(s.date), cy: y(s.i), r: 12, class: 'carte-cible' }), svgEl('circle', { cx: x(s.date), cy: y(s.i), r: 6.5, stroke: couleur(s.p), class: 'carte-point' }));
      const montrer = () => {
        bulle.replaceChildren(el('span', 'bulle-tete', `${s.p.nom} · ${short(s.date)}`), ...s.textes.map((t) => el('span', 'bulle-texte', t)));
        bulle.style.setProperty('--c', couleur(s.p));
        // la bulle est placée dans le cadre (qui ne défile pas), au-dessus de la station
        const r = bulle.parentElement.getBoundingClientRect();
        const c = g.getBoundingClientRect();
        bulle.hidden = false;
        const gauche = Math.min(Math.max(8, c.left - r.left + c.width / 2 - bulle.offsetWidth / 2), r.width - bulle.offsetWidth - 8);
        bulle.style.left = `${gauche}px`;
        bulle.style.top = `${c.top - r.top - bulle.offsetHeight - 10}px`;
      };
      g.addEventListener('pointerenter', montrer);
      g.addEventListener('focus', montrer);
      g.addEventListener('pointerleave', () => { bulle.hidden = true; });
      g.addEventListener('blur', () => { bulle.hidden = true; });
      const aller = () => { filtrer(s.p.id); $('t-log').scrollIntoView({ behavior: calme ? 'auto' : 'smooth', block: 'start' }); };
      g.addEventListener('click', aller);
      g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); aller(); } });
      svg.append(g);
    });
    cadre.replaceChildren(svg);
  }

  // ---- 03 journal, filtrable par projet
  const log = $('journal');
  const filters = $('filtres');
  let current = '';

  function renderLog() {
    log.textContent = '';
    const rows = journal.filter((j) => !current || j.projet === current);
    if (!rows.length) return empty(log, 'Rien pour l’instant.');
    rows.forEach((j) => {
      const li = el('li', 'entry');
      li.style.setProperty('--c', couleur(byId[j.projet]));
      const when = el('time', 'entry-when', short(j.date));
      when.dateTime = j.date;
      li.appendChild(when);
      li.appendChild(el('span', 'entry-proj', (byId[j.projet] || {}).nom || j.projet));
      li.appendChild(el('span', 'entry-text', j.texte));
      log.appendChild(li);
    });
  }

  function filtrer(id) {
    current = id;
    filters.querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.id === id)));
    renderLog();
  }

  function chip(id, label) {
    const b = el('button', 'chip', label);
    b.type = 'button';
    b.dataset.id = id;
    b.setAttribute('aria-pressed', String(id === current));
    b.addEventListener('click', () => filtrer(id));
    filters.appendChild(b);
  }

  chip('', 'Tout');
  projets.filter((p) => journal.some((j) => j.projet === p.id)).forEach((p) => chip(p.id, p.nom));
  renderLog();
  carte();

  // ---- le parcours : expériences puis sites réalisés, s'ils sont remplis dans parcours.js
  const exp = $('experiences');
  (data.experiences || []).forEach((x) => {
    const li = el('li', 'step');
    li.appendChild(el('span', 'step-when', x.periode));
    const body = el('div', 'step-body');
    body.appendChild(el('h3', null, x.role));
    const where = [x.structure, x.lieu].filter(Boolean).join(' · ');
    if (where) body.appendChild(el('p', 'card-meta', where));
    if (x.resume) body.appendChild(el('p', 'card-desc', x.resume));
    body.appendChild(tags(x.techno));
    li.appendChild(body);
    exp.appendChild(li);
  });
  (data.sites || []).forEach((s) => $('sites').appendChild(card(s)));
})();
