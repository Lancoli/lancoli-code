# Lancoli Code

Lancoli côté code : expérience utilisateur, design et développement front. Une page qui présente chaque projet du portfolio
(à quoi il sert, comment il est fait) et le journal de bord. Elle sert de vitrine pour l'emploi et pour les clients web.

## Lancer

Site statique, sans étape de construction.

- **Avec tout le portfolio** : `lancer.cmd` à la racine du portfolio, puis http://localhost:4101/LancoliCode/
- **Dans Docker** (comme en ligne) : `lancer docker`, puis http://localhost:8080/LancoliCode/
- **Seul** : n'importe quel serveur statique ouvert dans ce dossier (les chemins sont relatifs).

## Qualité

Ce projet suit les jalons du portfolio (`docs/JALONS.md` à la racine) : ses objectifs et son état sont dans `jalons.json`.
Vérification : `node tools/jalons.mjs LancoliCode` depuis la racine du portfolio.
