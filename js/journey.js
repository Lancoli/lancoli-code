// LancoliCode data: the devlog of every project, then the career path.
// This is the only file to edit to update the page.
// Rule: only true things (dates, clients, roles). An empty field is better than a wrong one.
// Every visitor-facing text is { fr, en }: French is the original and the default (root rule "Language").

// Served by HAL (port 4101): the whole folder is reachable. In Docker or online: only Lancoli,
// LancoliStudio, LancoliCode and /jondi/ are published, the other projects stay "local".
const HAL = location.port === '4101';

window.JOURNEY = {
  // Portfolio projects. `id` links the project to its log entries.
  // `kind` groups them in "At a glance"; `answers` says in one sentence what it is for and for whom (read by a client
  // as well as by a tech team); `color` is its line on the metro map.
  projects: [
    {
      id: 'lancoli',
      kind: { fr: 'Site d\'artiste', en: 'Artist website' },
      answers: { fr: 'Montrer le travail d\'un artiste, et donner envie de le contacter.', en: 'Show an artist\'s work, and make people want to get in touch.' },
      color: '#d4572a',
      name: 'Lancoli',
      url: '../Lancoli/',
      description: {
        fr: 'Le site d\'artiste : galerie, projets, démarche, contact, et le mur de graffiti à peindre. Bilingue FR / EN.',
        en: 'The artist website: gallery, projects, approach, contact, and the graffiti wall to paint. Bilingual FR / EN.',
      },
      stack: ['HTML', 'CSS', 'JavaScript', 'i18n', 'three.js', 'WebGL', 'Canvas'],
      image: 'assets/lancoli.jpg',
    },
    {
      id: 'studio',
      kind: { fr: 'Site et outils', en: 'Website and tools' },
      answers: { fr: 'Écouter les sons, et préparer ses morceaux sans installer de logiciel.', en: 'Listen to the music, and prepare your tracks without installing any software.' },
      color: '#f58a2e',
      name: 'Lancoli Studio',
      url: '../LancoliStudio/',
      description: {
        fr: 'Le son : écoute, prods, et des outils dans le navigateur (mastering, BPM, séparation, pochettes, stories vidéo).',
        en: 'The sound: listening, beats, and in-browser tools (mastering, BPM, stem separation, covers, video stories).',
      },
      stack: ['JavaScript', 'Web Audio', 'Web Workers', 'Canvas', 'MediaRecorder', 'ONNX Runtime', 'WebGPU', 'Demucs', 'Motion'],
      image: 'assets/studio.jpg',
    },
    {
      id: 'jondi',
      kind: { fr: 'Application web', en: 'Web app' },
      answers: { fr: 'Où sortir à Dijon ce soir, et comment y aller en bus ou en tram.', en: 'Where to go out in Dijon tonight, and how to get there by bus or tram.' },
      color: '#7c5cd6',
      name: 'Jondi ça bouge',
      // Served by HAL: Jondi runs on its own; in Docker or online: relayed under /jondi/.
      url: HAL ? 'http://localhost:4021/' : '/jondi/',
      description: { fr: 'Agrégateur des événements à Dijon, croisé avec le réseau Divia.', en: 'Aggregator of events in Dijon, matched with the Divia transit network.' },
      stack: ['Node.js', 'Cheerio', 'Leaflet', 'GTFS'],
      image: 'assets/jondi.jpg',
    },
    {
      id: 'jardin',
      kind: { fr: 'Site vitrine', en: 'Showcase website' },
      answers: { fr: 'Présenter une offre de services au jardin, et estimer le temps qu\'il demande.', en: 'Present a garden services offer, and estimate the time a garden needs.' },
      color: '#3d9a5c',
      name: 'Jardin de demain',
      url: HAL ? '../JardinDeDemain/temps-au-jardin.html' : null,
      description: {
        fr: 'Horticulture, agronomie, paysage : l\'offre de services et un calculateur du temps à passer au jardin.',
        en: 'Horticulture, agronomy, landscape: the services offer and a calculator of the time to spend in the garden.',
      },
      stack: ['HTML', 'CSS', 'JavaScript'],
      image: 'assets/jardin.jpg',
    },
    {
      id: 'survie',
      kind: { fr: 'Jeu', en: 'Game' },
      answers: { fr: 'Un calculateur de survie alimentaire, rendu jouable.', en: 'A food survival calculator, made playable.' },
      color: '#c49a1a',
      name: { fr: 'Survie alimentaire', en: 'Food survival' },
      url: HAL ? '../Prototypes/calculateur-survie-alimentaire.html' : null,
      description: { fr: 'Le calculateur de survie alimentaire, repris en jeu.', en: 'The food survival calculator, reworked as a game.' },
      stack: ['HTML', 'CSS', 'JavaScript'],
      image: 'assets/survie.jpg',
    },
    {
      id: 'archive',
      kind: { fr: 'Boutique', en: 'Shop' },
      answers: { fr: 'Vendre des boutures de plantes rares comme on ouvre une armoire de collectionneur.', en: 'Sell cuttings of rare plants the way you open a collector\'s cabinet.' },
      color: '#a0784a',
      name: 'Archive Botanique',
      url: HAL ? '../ArchiveBotanique/' : null,
      description: {
        fr: 'Boutique de boutures en tube : quatre armoires éclairées au néon, fiches, colis et herbier à compléter. Prototype, paiement pas encore branché.',
        en: 'A shop of cuttings in tubes: four neon-lit cabinets, plant sheets, parcels and a herbarium to complete. Prototype, payment not wired yet.',
      },
      stack: ['HTML', 'CSS', 'JavaScript', 'SVG'],
      image: 'assets/archive.jpg',
    },
    {
      id: 'hal',
      kind: { fr: 'Outil interne', en: 'Internal tool' },
      answers: { fr: 'Piloter tous les sites depuis un seul poste, à la voix.', en: 'Run every site from a single workstation, by voice.' },
      color: '#2f7fd1',
      name: 'Hal',
      url: null, // local tool, no public page
      description: {
        fr: 'Poste de pilotage local du portfolio : sert les sites, voix, points d\'étape, tâches confiées à Claude.',
        en: 'The portfolio\'s local control station: serves the sites, voice, progress reports, tasks handed to Claude.',
      },
      stack: ['Node.js', 'three.js', 'Playwright'],
      image: 'assets/hal.jpg',
    },
    {
      id: 'code',
      kind: { fr: 'Devlog', en: 'Devlog' },
      answers: { fr: 'Cette page : les projets, et ce qui avance, jour après jour.', en: 'This page: the projects, and what moves forward, day after day.' },
      color: '#3d7a5c',
      name: 'Lancoli Code',
      url: './',
      description: { fr: 'Cette page : le devlog de tous les projets, et le parcours.', en: 'This page: the devlog of every project, and the career path.' },
      stack: ['HTML', 'CSS', 'JavaScript'],
      image: 'assets/code.jpg',
    },
    {
      id: 'infra',
      kind: { fr: 'Infrastructure', en: 'Infrastructure' },
      answers: { fr: 'Mettre tout le portfolio en ligne derrière une seule porte.', en: 'Put the whole portfolio online behind a single gateway.' },
      color: '#7a7f88',
      name: 'Infra',
      url: null,
      description: {
        fr: 'Le portfolio en conteneurs : une seule porte nginx pour la galerie, le studio, le code et Jondi.',
        en: 'The portfolio in containers: a single nginx gateway for the gallery, the studio, the code and Jondi.',
      },
      stack: ['Docker', 'nginx'],
      image: 'assets/infra.jpg',
    },
  ],

  // Log: one line per step forward, most recent first. Every date comes from a work session
  // or a dated file: no step without a trace.
  // { date: '2026-10-23', project: 'code', text: { fr: 'Une phrase courte.', en: 'A short sentence.' } }
  log: [
    { date: '2026-11-15', project: 'code', text: { fr: 'La page devient une vitrine : fiches de projets empilées, carte de métro du journal.', en: 'The page becomes a showcase: stacked project cards, a metro map of the log.' } },
    { date: '2026-11-15', project: 'archive', text: { fr: 'Armoire plus sombre, table de consultation à côté, navigation horizontale entre les armoires.', en: 'Darker cabinet, a reading table beside it, horizontal navigation between cabinets.' } },
    { date: '2026-11-12', project: 'studio', text: { fr: 'Version 1.0 candidate : site autonome en conteneur, réglages par .env, mesure d’audience sans cookie.', en: 'Release candidate 1.0: standalone site in a container, settings through .env, cookie-free analytics.' } },
    { date: '2026-11-12', project: 'infra', text: { fr: 'Retours « Dire à Claude » : un bouton dans chaque app, des tickets, un veilleur qui les traite.', en: '"Tell Claude" feedback: a button in every app, tickets, and a watcher that handles them.' } },
    { date: '2026-10-23', project: 'code', text: { fr: 'La page devient un devlog : tous les projets et leur journal au même endroit.', en: 'The page becomes a devlog: every project and its log in one place.' } },
    { date: '2026-10-22', project: 'infra', text: { fr: 'Tout le portfolio en conteneurs derrière une seule porte nginx ; Jondi relayé sous /jondi/.', en: 'The whole portfolio in containers behind a single nginx gateway; Jondi relayed under /jondi/.' } },
    { date: '2026-10-22', project: 'code', text: { fr: 'Première version : parcours, sites réalisés et projets du portfolio.', en: 'First version: career path, sites built and portfolio projects.' } },
    { date: '2026-10-20', project: 'studio', text: { fr: 'Accueil repensé en tableau de bord de cartes.', en: 'Home page redesigned as a dashboard of cards.' } },
    { date: '2026-10-19', project: 'lancoli', text: { fr: 'Mur de graffiti à peindre : spray, brosses, coulures, sur un mur three.js.', en: 'A graffiti wall to paint: spray, brushes, drips, on a three.js wall.' } },
    { date: '2026-10-18', project: 'studio', text: { fr: 'Choix des typos : catalogue de polices graffiti et urbaines.', en: 'Typeface choice: a catalogue of graffiti and urban fonts.' } },
    { date: '2026-10-17', project: 'studio', text: { fr: 'Onglet outils : mastering automatique prêt pour la distribution.', en: 'Tools tab: automatic mastering ready for distribution.' } },
    { date: '2026-10-17', project: 'studio', text: { fr: 'Pochettes vinyles en 3D pour présenter les sons.', en: '3D vinyl sleeves to present the tracks.' } },
    { date: '2026-10-12', project: 'hal', text: { fr: 'Naissance du poste de pilotage : sert les sites, interface vocale, points d’étape.', en: 'Birth of the control station: serves the sites, voice interface, progress reports.' } },
    { date: '2026-10-12', project: 'jondi', text: { fr: 'Thème sombre violet calé sur la maquette, lisérés et couleurs.', en: 'Dark purple theme matched to the mock-up, edgings and colours.' } },
    { date: '2026-10-11', project: 'lancoli', text: { fr: 'Galerie : SEO, branding, fonds en dégradés tirés des pochettes.', en: 'Gallery: SEO, branding, gradient backgrounds taken from the covers.' } },
    { date: '2026-10-10', project: 'jondi', text: { fr: 'Note : passer Jondi en référencement seul avec citation visible. À décider.', en: 'Note: switch Jondi to listing only, with a visible citation. To be decided.' } },
    { date: '2026-10-10', project: 'jardin', text: { fr: 'Temps au jardin : notice et calculateur selon la surface.', en: 'Time in the garden: guide and calculator by area.' } },
    { date: '2026-10-09', project: 'jondi', text: { fr: 'Relevé des événements de Dijon, filtres et itinéraires Divia.', en: 'Collection of Dijon events, filters and Divia routes.' } },
    { date: '2026-10-05', project: 'survie', text: { fr: 'Le calculateur passe en jeu, plus proche des gestes du joueur.', en: 'The calculator becomes a game, closer to what the player does.' } },
    { date: '2026-10-04', project: 'lancoli', text: { fr: 'Leaving home : récit par chapitres, vidéos en 9/16.', en: 'Leaving home: a story in chapters, 9:16 videos.' } },
    { date: '2026-10-04', project: 'lancoli', text: { fr: 'Refonte de la galerie : accueil et galerie fusionnés, parallaxe de filaments.', en: 'Gallery redesign: home and gallery merged, filament parallax.' } },
    { date: '2026-09-27', project: 'jardin', text: { fr: 'Offre de services : un seul appel à l’action sur l’accueil.', en: 'Services offer: a single call to action on the home page.' } },
  ],

  // Experience, most recent first.
  // { period: '2019 — 2021', role: { fr, en }, org: 'Name', place: 'Paris', summary: { fr, en }, stack: ['JS', 'PHP'] }
  experiences: [],

  // Sites you worked on: the card links to `url`.
  // { name: 'Site name', url: 'https://…', role: { fr, en }, year: '2020', stack: ['WordPress'], description: { fr, en } }
  sites: [],
};
