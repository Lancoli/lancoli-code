# Lancoli Code — app rules

The technical showcase: each portfolio project, what it is for, how it is built, and the log (see [README.md](README.md)).
Shared rules: [../CLAUDE.md](../CLAUDE.md).

## Own rules

- **Each project card** states the problem solved, the impact for the user and the technical choices, without jargon
  ([../docs/VISION.md](../docs/VISION.md), "Application to project cards").
- **Invent nothing**: a figure, a technology or a result comes from the project's code or from David.
- The log is kept from git (`devlog` skill), not by hand.
- **Languages**: interface text in `i18n/fr.json` (default) and `i18n/en.json`; content (projects, log entries) in
  `js/journey.js` as `{ fr, en }` fields. A new entry gets both languages.

## Check

`node tools/jalons.mjs LancoliCode` · `lancer liens LancoliCode` (from the root).
