# Lancoli Code — UI guide: a newspaper page, with terminal accent

> **Status: REFERENCE (27/11/2026)** for tokens, components, and layout. Shared method:
> [../../docs/DESIGN-SYSTEM.md](../../docs/DESIGN-SYSTEM.md). Check: `node tools/design-lint.mjs LancoliCode`
> (from portfolio root).

---

## 1. Identity: the same paper as Lancoli, in code style

Lancoli Code presents the technical showcase as a newspaper page: front page title and standfirst, "At a glance"
summary, stacking project cards, metro map of the log. Clean, readable, nothing moves on hover (border or colour
change only).

| Element | Style | Reference |
|---|---|---|
| Paper | cream light (`#fbfaf7`), dark charcoal in dark mode | Lancoli brand |
| Accents | green (`#3d7a5c` light, `#7cc39c` dark) | terminal, nature, craft |
| Typography | Georgia serif (titles), Arial sans (body), monospace (labels, metadata) | newspaper layout |
| Interaction | border colour on hover, no movement (transform forbidden) | calm, deterministic |

---

## 2. Portfolio UX rules (L1–L4, N1)

Lancoli Code follows the portfolio-wide UX principles ([../../docs/UX-PRINCIPLES.md](../../docs/UX-PRINCIPLES.md)).
Application to this app:

| Rule | Application in Lancoli Code |
|---|---|
| **L1 · No overlap** | The page is a single scrolling column; cards stack one below the other. The only floating element is `.station-bubble` (tooltip), which appears above the map, z-index 2. No element covers another. |
| **L2 · One layer at a time** | Layer order: page (z-index auto) < station bubble (z-index 2). The bubble yields (hides) when the user moves the mouse away. |
| **L3 · Reserved zones** | - **Top bar** (`.top`): navigation, fixed width, flex space-between<br>- **Front page** (`.front`): title, doors, figures<br>- **Sections** (`.block`): "At a glance", projects, map, log, each separated by `border-top`, growing downward<br>- **Project cards** (`.project-card`): sticky-positioned stack, each offset 12 px from the previous one<br>- **Bottom bar** (`.bottom`): contact, cities, fixed width |
| **L4 · Harmony** | Spacing on the scale 4 · 8 · 12 · 16 · 24 · 32. Inside cards and bars: equal top/bottom space, left/right space. Project cards: 26 px top padding, 30 px bottom padding (± 2 px tolerance), consistent gaps (18 px between columns, 44 px for the right divider). |
| **N1 · Deterministic navigation** | The page has no internal routing (single-page, scroll-based). Anchors (`#t-proj`, `#t-map`, `#t-log`) jump to sections deterministically. Filters in the log section change visibility without changing the URL (stateless UI). |

---

## 3. Tokens

### 3.1 Colours

```css
:root {
  /* paper and surfaces */
  --paper: #fbfaf7;   /* background */
  --sheet: #ffffff;   /* cards, panels */

  /* ink: two levels */
  --ink: #171717;     /* main text */
  --muted: #6f6a63;   /* secondary text, metadata */

  /* structure */
  --line: rgba(23, 23, 23, .12);  /* borders, dividers */
  --card: rgba(255, 255, 255, .6); /* translucent card background */

  /* accent */
  --accent: #3d7a5c;  /* links, highlights, terminal green */
}
```

**Dark mode** (via `@media (prefers-color-scheme: dark)`): paper becomes `#121211`, sheet `#1b1b1a`, ink `#ecebe7`,
muted `#9a958d`, accent `#7cc39c`.

**Derived colours** (examples in code):
- Border hover: `border-color: var(--accent)`
- Text hover: `color: var(--ink)` from `color: var(--muted)`
- Filled door: `background: var(--ink); color: var(--paper)`

### 3.2 Typography

| Token | Value | Usage |
|---|---|---|
| `--serif` | Georgia, 'Times New Roman', serif | titles (h1, card names, figures) |
| `--mono` | ui-monospace, 'SFMono-Regular', Consolas, monospace | labels, metadata, code accent |
| (body) | 14px/1.5 Arial, sans-serif | body text (set on `body`, inherited) |

**Sizes in use** (not tokenized, applied directly):
- 11–12 px: labels (`.door-for`, `.bubble-head`, `.entry-when`), uppercase, `letter-spacing: .08em`
- 13–14 px: body, card text
- 17–20 px: doors (`.door-what`), card answer (`.project-card-answer`)
- 30–46 px: project card titles (clamp)
- 40–92 px: front page h1 (clamp)

### 3.3 Spacing

The scale: **4 · 8 · 12 · 16 · 24 · 32**. Applied as: gaps (14, 16, 18, 24, 44 px), padding (20, 22, 26, 30 px),
margins (22, 28, 36 px). Deviations (like 14, 18, 22, 26, 44) are allowed for optical balance but kept minimal.

### 3.4 Shapes

- **Border radius**: 6 px (small: bubble, map), 8 px (images), 14 px (cards, doors), 18 px (project cards), 999 px (pills: tags, chips, status badges)
- **Borders**: 1 px solid `var(--line)` (default), 3 px double `var(--ink)` (masthead), 6 px solid `var(--c)` (project card top)

### 3.5 Motion

- **Duration**: `.15s` (hover: dots), `.2s` (chips, status), `.25s` (doors, cards), `.3s` (links), `.8s` (card entrance)
- **Easing**: `--ease-out: cubic-bezier(.16, 1, .3, 1)` (entrances), `ease` or `linear` for others
- **Reduced motion**: `@media (prefers-reduced-motion: reduce)` removes all transitions

---

## 4. Components (closed catalogue)

| Component | Class | Variants | Usage |
|---|---|---|---|
| **Door** | `.door` | `.door-filled` (inverted) | front page: two entry points, one for tech, one for clients |
| **Card** | `.card` | `.is-local` (local project, dimmed) | sites, resources, links |
| **Project card** | `.project-card` | `.is-pending` / `.is-seen` (entrance) | stacking cards in section 01 |
| **Chip** | `.chip` | `[aria-pressed="true"]` (toggled) | log filters |
| **Tag** | `.tags li` | — | technologies, categories (not clickable) |
| **Station** | `.map-station` | — | metro map: one per log entry |
| **Bubble** | `.station-bubble` | — | tooltip for metro stations |

**Rule**: a tag is not clickable, a chip always is. Cards and doors are links.

---

## 5. Layout: zones and expansion

```
┌─────────────────────────────────────────────┐
│ .top (header: mark, nav)                    │
├─────────────────────────────────────────────┤
│ .front (title, doors, figures)              │
├─────────────────────────────────────────────┤
│ .block #summary (At a glance)               │
│   ↓ grows down, grid auto-fill              │
├─────────────────────────────────────────────┤
│ .block #projects (cards)                    │
│   ↓ grows down, sticky stack                │
├─────────────────────────────────────────────┤
│ .block #map (metro + timeline)              │
│   → map scrolls horizontally if narrow      │
├─────────────────────────────────────────────┤
│ .block #journal (log)                       │
│   ↓ grows down                              │
├─────────────────────────────────────────────┤
│ .bottom (footer: cities, contact)           │
└─────────────────────────────────────────────┘
```

**Expansion axes** (DESIGN-SYSTEM rules 11–13):
- **Page**: grows downward; max-width 1080 px, centred
- **Top bar / bottom bar**: flex space-between, fixed height, full width
- **Doors**: 2 columns (1 on mobile), equal width
- **Summary**: grid auto-fill, equal-width cards
- **Project cards**: sticky stack, each offset by `calc(18px + var(--i) * 12px)`
- **Map**: SVG full width of container, horizontal scroll when narrow
- **Log**: list, one row per entry

---

## 6. Forbidden

- Hexadecimal or `rgba(...)` values outside `:root` (use tokens or derived)
- `transform` (translate, rotate, scale) on hover (rule: nothing moves)
- Emojis in the interface (arrows like ↓ ↗ are Unicode, allowed)
- Border radius other than 0, 6, 8, 14, 18, 999 px

---

## 7. Files

```
css/
  code.css        all styles (tokens, base, components, layout, responsive)
js/
  code.js         journey rendering, map drawing, filters
  journey.js      projects and log data (content)
  i18n.js         language switching (fr ↔ en)
i18n/
  fr.json         interface text (default)
  en.json         English translation
```

The file `code.css` follows the order: tokens (`:root`), dark mode, reset, base, components (doors, cards, chips,
map, log), layout (page, sections), responsive (`@media`), reduced motion.

---

## 8. Checks

- **Conformity**: `node tools/conforme.mjs` (portfolio root) — Lancoli Code as `type: "statique"`
- **Links**: `lancer liens LancoliCode` — all internal anchors and paths valid
- **Design lint**: `node tools/design-lint.mjs LancoliCode` — forbidden patterns (transform on hover, off-brand colours)
- **Overlap audit**: skill `check-overlap` (not yet run, L1 expected to pass)

---

## 9. Decisions (27/11/2026)

1. **No internal routing**: the page is a single scroll. Filters do not change the URL (stateless).
2. **Sticky stack**: project cards use `position: sticky` with offset `var(--i)`, creating the stacking effect as the
   user scrolls. This is a **progressive enhancement**: on browsers without sticky support, cards just stack normally.
3. **Metro map**: SVG drawn by `code.js` from `journey.js` data, one line per project, one station per dated entry.
   The map scrolls horizontally on narrow screens. The same data feeds the linear log below.
4. **Languages**: interface text via i18n files (fr/en); content (projects, log) has `{ fr, en }` fields in `journey.js`.
   A new entry gets both languages.
