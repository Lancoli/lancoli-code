// Script pour capturer automatiquement les écrans de tous les projets du portfolio
// Utilise Playwright pour ouvrir chaque projet et faire une capture

const { chromium } = require('playwright');
const fs = require('fs/promises');
const path = require('path');

// Les projets à capturer, avec leurs URLs locales (via Hal sur le port 4101)
const captures = [
  { nom: 'lancoli', url: 'http://localhost:4101/Lancoli/', viewport: { width: 1600, height: 900 } },
  { nom: 'studio', url: 'http://localhost:4101/LancoliStudio/', viewport: { width: 1600, height: 900 } },
  { nom: 'jondi', url: 'http://localhost:4021/', viewport: { width: 1600, height: 900 } },
  { nom: 'jardin', url: 'http://localhost:4101/JardinDeDemain/temps-au-jardin.html', viewport: { width: 1600, height: 900 } },
  { nom: 'survie', url: 'http://localhost:4101/Prototypes/calculateur-survie-alimentaire.html', viewport: { width: 1600, height: 900 } },
  { nom: 'archive', url: 'http://localhost:4101/ArchiveBotanique/', viewport: { width: 1600, height: 900 } },
  { nom: 'code', url: 'http://localhost:4101/LancoliCode/', viewport: { width: 1600, height: 900 } },
];

async function capturerProjets() {
  console.log('🎬 Lancement des captures...\n');

  const browser = await chromium.launch({ headless: true });
  const dossierAssets = path.join(__dirname, '..', 'assets');

  // Vérifier que le dossier assets existe
  try {
    await fs.access(dossierAssets);
  } catch {
    console.error(`❌ Le dossier assets n'existe pas : ${dossierAssets}`);
    await browser.close();
    return;
  }

  let reussies = 0;
  let echouees = 0;

  for (const projet of captures) {
    const page = await browser.newPage({ viewport: projet.viewport });
    const fichier = path.join(dossierAssets, `${projet.nom}.jpg`);

    try {
      console.log(`📸 Capture de ${projet.nom}...`);
      console.log(`   URL : ${projet.url}`);

      // Charger la page avec un timeout de 30s
      await page.goto(projet.url, { waitUntil: 'networkidle', timeout: 30000 });

      // Attendre un peu pour que les animations se terminent
      await page.waitForTimeout(1500);

      // Prendre la capture en JPEG avec qualité 85
      await page.screenshot({
        path: fichier,
        type: 'jpeg',
        quality: 85,
        fullPage: false,
      });

      // Vérifier la taille du fichier
      const stats = await fs.stat(fichier);
      const tailleKo = Math.round(stats.size / 1024);
      console.log(`   ✓ ${projet.nom}.jpg créé (${tailleKo} Ko)\n`);
      reussies++;

    } catch (err) {
      console.error(`   ✗ Échec pour ${projet.nom} : ${err.message}\n`);
      echouees++;
    } finally {
      await page.close();
    }
  }

  await browser.close();

  console.log(`\n✨ Terminé : ${reussies} capture${reussies > 1 ? 's' : ''} réussie${reussies > 1 ? 's' : ''}`);
  if (echouees > 0) {
    console.log(`⚠️  ${echouees} échec${echouees > 1 ? 's' : ''}`);
  }
}

// Lancer les captures
capturerProjets().catch((err) => {
  console.error('❌ Erreur fatale :', err);
  process.exit(1);
});
