# Lancoli Code

<!-- badges : généré par tools/kit-github.mjs -->
[![qualité](https://github.com/Lancoli/lancoli-code/actions/workflows/qualite.yml/badge.svg)](https://github.com/Lancoli/lancoli-code/actions/workflows/qualite.yml) [![release](https://img.shields.io/github/v/release/Lancoli/lancoli-code?include_prereleases&label=version)](https://github.com/Lancoli/lancoli-code/releases) [![Conventional Commits](https://img.shields.io/badge/commits-conventionnels%20%2B%20gitmoji-ff69b4)](https://www.conventionalcommits.org/fr/) [![dernier commit](https://img.shields.io/github/last-commit/Lancoli/lancoli-code)](https://github.com/Lancoli/lancoli-code/commits)
<!-- /badges -->

> Personal tech portfolio: a library of technically oriented projects.

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
