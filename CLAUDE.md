# PDLC landing page — working guide

## What this is
Marketing landing page for **PDLC** (Amplitude). Static HTML, no build step. Several design
versions live side by side: `index.html` (V1) … `index-v5.html` (V5). **V5 is the active
version.** A ⌘K modal in every file switches versions. `docs.html` is a separate page.

## How we work on it
- **Make structural & diagram changes by editing `index-v5.html` directly.** It's hand-authored —
  match the surrounding formatting (indentation, attribute style); don't reformat.
- **The user refines copy inline** via a local editor: `node edit-server.js` →
  `http://localhost:4321/index-v5.html`. The editor is **injected only when served** (the file on
  disk stays clean) and **each save writes the file + a git commit**. Therefore:
  - **Re-read the file before editing** — copy may have changed inline since you last saw it.
    Never clobber the user's inline copy edits.
  - Do large structural moves as **direct file edits**, not through the inline editor (its save
    path is tuned for small copy snippets, not block moves).
- **Validate after every structural/SVG edit** (quick python check): every `url(#id)` / `href="#id"`
  resolves to a defined `id=`; `<svg>` / `<section>` / `<g>` tags balance; any strings you removed
  are actually gone. This repeatedly caught broken refs and half-moved blocks.
- **Commit each cohesive change** with a clear, scoped message (+ `Co-Authored-By`). The git-backed
  editor exists to keep a clean, restorable history — keep commits tidy.

## Design philosophy (earned from iteration)
- **Diagrams are the centerpiece — invest in them.** Most iteration is on the SVGs (the
  build→ship→use→learn loop, the 6-stage product loop, the signal funnel). "Make them shine."
- **Reduce, don't add.** Recurring instinct: cut redundant copy, labels, center text, sub-headings,
  and whole sections that overlap ("it's obvious from the diagram" — let the visual carry it). When
  unsure, remove.
- **Motion must mean something, and feel natural.**
  - Many *small* particles + a few larger glowing "leads" = volume / throughput. Keep most small.
  - Stagger timing irregularly → organic, not metronomic.
  - To show a bottleneck: give every particle the **same `dur` + `keyPoints`/`keyTimes`** so they all
    slow to one identical rate through the constrained segment and visibly queue up.
  - Drop gimmicks once motion implies the idea (e.g. removed directional arrowheads — the circular
    flow already reads as clockwise).
- **Icons: real vector icons, never glyphs/emoji.** Use a high-quality CDN set (currently **Lucide**,
  ISC, via jsDelivr) and inline the **exact** fetched path data. 24px grid, ~1.8 stroke,
  `currentColor` → `--blue-d`.
- **Comment complex SVG/animation blocks thoroughly.** Document geometry (center, radius, key
  coords), the math (path formulas; what `keyTimes`/`keyPoints` mean), and a **"tuning knobs"** list
  so the next editor knows which value changes what. The user explicitly asks for this.
- **Expect pixel-level spatial iteration.** Feedback arrives as annotated screenshots with precise
  nudges ("offset the labels", "tighten the radius", "move up a little", "underlap the element
  above", "shift the label right"). Implement literally, then surface the single value to tweak.
- **Decorative transitions thread the narrative.** e.g. a funnel of signal-orbs collapsing into one
  focal point that "seeds" the next section. Continuity beats standalone flourishes.
- **Frosted cards over decoration.** The page has a fixed grid + radial-glow background. Opaque
  `--panel` cards block it; translucent surfaces need `backdrop-filter: blur()` so the decoration
  never bleeds into text.

## Narrative / information architecture
- **Signals are the differentiator.** PDLC's edge = a fleet of agents reading Amplitude's data
  (session replays, dashboards, feedback, web vitals, competitive, agent traces) **plus your own via
  MCP**. Foreground this; tell "how it works" *through* the signals.
- Flow leans **model-first**: problem (the decide-what-to-build bottleneck) → the loop/system →
  signals → the tangible ranked output → product proof → how you use it → CTA. The current order in
  the file is the source of truth.
- Custom agents (your own MCPs) are **available today** — never label "coming soon".

## Voice (detail in memory: `pdlc-page-voice`)
Clear, operational, opinionated, human — not "AI-keynote-y". Cut ~30%; let visuals explain. Avoid
jargon ("sensing layer", "compound flywheel", "surfaces"). Reinforce human-in-the-loop ("reviewed
before merge", "people decide what ships"). Frame access as exclusive ("Q3 cohort / design
partners"). Ground claims in one real Amplitude-on-Amplitude example.

## Tech notes
- Palette = CSS vars (`--blue #0052F2`, `--blue-d #4083FF`, `--lilac`, `--violet`, `--pink`,
  `--green`, `--bg`, `--panel`, line tints). Fonts: Poppins (sans) + JetBrains Mono.
- SVG animation uses **SMIL** (`animateMotion` / `animate`). A `prefers-reduced-motion` block
  disables CSS animations; SMIL isn't covered by it (known limitation).
- `edit-server.js` (Node, zero deps): serves the repo, injects `editor-client.js` into HTML
  responses, and exposes `/api/save` (whitespace-tolerant snippet replace + `git commit`),
  `/api/history`, `/api/revert`. `editor-client.js` is the in-browser toolbar.
