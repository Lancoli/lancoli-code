// Données de LancoliCode : le devlog de tous les projets, puis le parcours.
// C'est le seul fichier à modifier pour mettre la page à jour.
// Règle : ne mettre que du vrai (dates, clients, rôles). Une case absente vaut mieux qu'une case fausse.

// Servi par Hal (port 4101) : tout le dossier est accessible. En Docker ou en ligne : seuls Lancoli,
// LancoliStudio, LancoliCode et /jondi/ sont publiés, les autres projets restent « local ».
const HAL = location.port === '4101';

window.PARCOURS = {
  // Projets du portfolio. `id` relie le projet à ses entrées de journal.
  // `nature` les classe dans « En bref » ; `repond` dit en une phrase à quoi il sert, pour qui (lu par un client
  // comme par une équipe tech) ; `couleur` est celle de sa ligne sur la carte de métro.
  projets: [
    {
      id: 'lancoli',
      nature: 'Site d\'artiste',
      repond: 'Montrer le travail d\'un artiste, et donner envie de le contacter.',
      couleur: '#d4572a',
      nom: 'Lancoli',
      url: '../Lancoli/',
      description: 'Le site d\'artiste : galerie, projets, démarche, contact, et le mur de graffiti à peindre. Bilingue FR / EN.',
      techno: ['HTML', 'CSS', 'JavaScript', 'i18n', 'three.js', 'WebGL', 'Canvas'],
      image: 'assets/lancoli.jpg',
    },
    {
      id: 'studio',
      nature: 'Site et outils',
      repond: 'Écouter les sons, et préparer ses morceaux sans installer de logiciel.',
      couleur: '#f58a2e',
      nom: 'Lancoli Studio',
      url: '../LancoliStudio/',
      description: 'Le son : écoute, prods, et des outils dans le navigateur (mastering, BPM, séparation, pochettes, stories vidéo).',
      techno: ['JavaScript', 'Web Audio', 'Web Workers', 'Canvas', 'MediaRecorder', 'ONNX Runtime', 'WebGPU', 'Demucs', 'Motion'],
      image: 'assets/studio.jpg',
    },
    {
      id: 'jondi',
      nature: 'Application web',
      repond: 'Où sortir à Dijon ce soir, et comment y aller en bus ou en tram.',
      couleur: '#7c5cd6',
      nom: 'Jondi ça bouge',
      // Servi par Hal : Jondi tourne à part ; en Docker ou en ligne : relayé sous /jondi/.
      url: HAL ? 'http://localhost:4021/' : '/jondi/',
      description: 'Agrégateur des événements à Dijon, croisé avec le réseau Divia.',
      techno: ['Node.js', 'Cheerio', 'Leaflet', 'GTFS'],
      image: 'assets/jondi.jpg',
    },
    {
      id: 'jardin',
      nature: 'Site vitrine',
      repond: 'Présenter une offre de services au jardin, et estimer le temps qu\'il demande.',
      couleur: '#3d9a5c',
      nom: 'Jardin de demain',
      url: HAL ? '../JardinDeDemain/temps-au-jardin.html' : null,
      description: 'Horticulture, agronomie, paysage : l\'offre de services et un calculateur du temps à passer au jardin.',
      techno: ['HTML', 'CSS', 'JavaScript'],
      image: 'assets/jardin.jpg',
    },
    {
      id: 'survie',
      nature: 'Jeu',
      repond: 'Un calculateur de survie alimentaire, rendu jouable.',
      couleur: '#c49a1a',
      nom: 'Survie alimentaire',
      url: HAL ? '../Prototypes/calculateur-survie-alimentaire.html' : null,
      description: 'Le calculateur de survie alimentaire, repris en jeu.',
      techno: ['HTML', 'CSS', 'JavaScript'],
      image: 'assets/survie.jpg',
    },
    {
      id: 'archive',
      nature: 'Boutique',
      repond: 'Vendre des boutures de plantes rares comme on ouvre une armoire de collectionneur.',
      couleur: '#a0784a',
      nom: 'Archive Botanique',
      url: HAL ? '../ArchiveBotanique/' : null,
      description: 'Boutique de boutures en tube : quatre armoires éclairées au néon, fiches, colis et herbier à compléter. Prototype, paiement pas encore branché.',
      techno: ['HTML', 'CSS', 'JavaScript', 'SVG'],
      image: 'assets/archive.jpg',
    },
    {
      id: 'hal',
      nature: 'Outil interne',
      repond: 'Piloter tous les sites depuis un seul poste, à la voix.',
      couleur: '#2f7fd1',
      nom: 'Hal',
      url: null, // outil local, pas de page publique
      description: 'Poste de pilotage local du portfolio : sert les sites, voix, points d\'étape, tâches confiées à Claude.',
      techno: ['Node.js', 'three.js', 'Playwright'],
      image: 'assets/hal.jpg',
    },
    {
      id: 'code',
      nature: 'Devlog',
      repond: 'Cette page : les projets, et ce qui avance, jour après jour.',
      couleur: '#3d7a5c',
      nom: 'Lancoli Code',
      url: './',
      description: 'Cette page : le devlog de tous les projets, et le parcours.',
      techno: ['HTML', 'CSS', 'JavaScript'],
      image: 'assets/code.jpg',
    },
    {
      id: 'infra',
      nature: 'Infrastructure',
      repond: 'Mettre tout le portfolio en ligne derrière une seule porte.',
      couleur: '#7a7f88',
      nom: 'Infra',
      url: null,
      description: 'Le portfolio en conteneurs : une seule porte nginx pour la galerie, le studio, le code et Jondi.',
      techno: ['Docker', 'nginx'],
      image: 'assets/infra.jpg',
    },
  ],

  // Journal : une ligne par avancée, la plus récente d'abord. Chaque date vient d'une session de travail
  // ou d'un fichier daté : pas d'avancée sans trace.
  // { date: '2026-10-23', projet: 'code', texte: 'Une phrase courte.' }
  journal: [
    { date: '2026-11-15', projet: 'code', texte: 'La page devient une vitrine : fiches de projets empilées, carte de métro du journal.' },
    { date: '2026-11-15', projet: 'archive', texte: 'Armoire plus sombre, table de consultation à côté, navigation horizontale entre les armoires.' },
    { date: '2026-11-12', projet: 'studio', texte: 'Version 1.0 candidate : site autonome en conteneur, réglages par .env, mesure d’audience sans cookie.' },
    { date: '2026-11-12', projet: 'infra', texte: 'Retours « Dire à Claude » : un bouton dans chaque app, des tickets, un veilleur qui les traite.' },
    { date: '2026-10-23', projet: 'code', texte: 'La page devient un devlog : tous les projets et leur journal au même endroit.' },
    { date: '2026-10-22', projet: 'infra', texte: 'Tout le portfolio en conteneurs derrière une seule porte nginx ; Jondi relayé sous /jondi/.' },
    { date: '2026-10-22', projet: 'code', texte: 'Première version : parcours, sites réalisés et projets du portfolio.' },
    { date: '2026-10-20', projet: 'studio', texte: 'Accueil repensé en tableau de bord de cartes.' },
    { date: '2026-10-19', projet: 'lancoli', texte: 'Mur de graffiti à peindre : spray, brosses, coulures, sur un mur three.js.' },
    { date: '2026-10-18', projet: 'studio', texte: 'Choix des typos : catalogue de polices graffiti et urbaines.' },
    { date: '2026-10-17', projet: 'studio', texte: 'Onglet outils : mastering automatique prêt pour la distribution.' },
    { date: '2026-10-17', projet: 'studio', texte: 'Pochettes vinyles en 3D pour présenter les sons.' },
    { date: '2026-10-12', projet: 'hal', texte: 'Naissance du poste de pilotage : sert les sites, interface vocale, points d’étape.' },
    { date: '2026-10-12', projet: 'jondi', texte: 'Thème sombre violet calé sur la maquette, lisérés et couleurs.' },
    { date: '2026-10-11', projet: 'lancoli', texte: 'Galerie : SEO, branding, fonds en dégradés tirés des pochettes.' },
    { date: '2026-10-10', projet: 'jondi', texte: 'Note : passer Jondi en référencement seul avec citation visible. À décider.' },
    { date: '2026-10-10', projet: 'jardin', texte: 'Temps au jardin : notice et calculateur selon la surface.' },
    { date: '2026-10-09', projet: 'jondi', texte: 'Relevé des événements de Dijon, filtres et itinéraires Divia.' },
    { date: '2026-10-05', projet: 'survie', texte: 'Le calculateur passe en jeu, plus proche des gestes du joueur.' },
    { date: '2026-10-04', projet: 'lancoli', texte: 'Leaving home : récit par chapitres, vidéos en 9/16.' },
    { date: '2026-10-04', projet: 'lancoli', texte: 'Refonte de la galerie : accueil et galerie fusionnés, parallaxe de filaments.' },
    { date: '2026-09-27', projet: 'jardin', texte: 'Offre de services : un seul appel à l’action sur l’accueil.' },
  ],

  // Expériences, de la plus récente à la plus ancienne.
  // { periode: '2019 — 2021', role: 'Développeur front', structure: 'Nom', lieu: 'Paris', resume: 'Une phrase.', techno: ['JS', 'PHP'] }
  experiences: [],

  // Sites sur lesquels tu as travaillé : la carte redirige vers `url`.
  // { nom: 'Nom du site', url: 'https://…', role: 'Intégration, maintenance', annee: '2020', techno: ['WordPress'], description: 'Une phrase.' }
  sites: [],
};
