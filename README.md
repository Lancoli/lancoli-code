# Lancoli Code

<!-- badges : généré par tools/kit-github.mjs -->
[![qualité](https://github.com/Lancoli/lancoli-code/actions/workflows/qualite.yml/badge.svg)](https://github.com/Lancoli/lancoli-code/actions/workflows/qualite.yml) [![release](https://img.shields.io/github/v/release/Lancoli/lancoli-code?include_prereleases&label=version)](https://github.com/Lancoli/lancoli-code/releases) [![Conventional Commits](https://img.shields.io/badge/commits-conventionnels%20%2B%20gitmoji-ff69b4)](https://www.conventionalcommits.org/fr/) [![dernier commit](https://img.shields.io/github/last-commit/Lancoli/lancoli-code)](https://github.com/Lancoli/lancoli-code/commits)
<!-- /badges -->

> Personal tech portfolio: a library of technically oriented projects.

Lancoli on the code side: user experience, design and front-end development. A page that presents each portfolio project
(what it is for, how it is built) and the logbook. It is the showcase for jobs and for web clients. French by default,
English one click away (`?lang=en`).

## Run

Static site, no build step.

- **With the whole portfolio**: `lancer.cmd` at the portfolio root, then http://localhost:4101/LancoliCode/
- **In Docker** (as online): `lancer docker`, then http://localhost:8080/LancoliCode/
- **Alone**: any static server opened in this folder (paths are relative; the dictionaries need http, not file://).

## Update the content

- Projects and log entries: `js/journey.js`, each text as `{ fr, en }`.
- Interface text: `i18n/fr.json` and `i18n/en.json` (same keys in both).
- Project screenshots: `node tools/capture-projects.js` writes `assets/<id>.jpg`.

## Quality

This project follows the portfolio milestones (`docs/JALONS.md` at the root): its goals and state are in `jalons.json`.
Check: `node tools/jalons.mjs LancoliCode` from the portfolio root.
