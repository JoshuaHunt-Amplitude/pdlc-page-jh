# PDLC landing page — working guide

## What this is
A **playground** for designing the website that re-announces Amplitude's **future product
vision** and the **PDLC product surface** — both of which we're still figuring out as we go.
Static HTML, no build step. Many full-page design variants live side by side
(`index.html` = V1 … `index-v10.html` = V10); a ⌘K modal in every file switches between them.
There is no single "final" page yet — we fork freely and compare directions. "PDLC" is a
**placeholder product name** (V6–V8 test alternatives). `docs.html` is a separate page.

Version families (current):
- **V1–V5** — the evolving full landing page; **V5** is the canonical / most-complete one.
- **V6–V8** — name-test forks of V5: **Loop** / **Product OS** / **Opportunities**.
- **V9 — Vision** — pared to the narrative: hero → manifesto → funnel → loop → CTA.
- **V10 — Product** — pared to the product: feed → map → brief → ways-in → loop → CTA.
- **V18** — current working version; Wave messaging, 8-beat narrative, blueprint hero.
- **V19** — active fork of V18; adds Unicorn Studio "Introducing Wave" interstitial, section reorder (data → Wave → solution → loop), `#00070E` deep background below the wave, hover cards on OODA/Boyd terms.

## How we work on it
- **Make structural & diagram changes by editing the relevant version file directly** (whichever
  Vn the thread is about). The files are hand-authored — match the surrounding formatting
  (indentation, attribute style); don't reformat. Changes to one version don't propagate — apply
  to others explicitly when asked.
- **The user refines copy inline** via a local editor: `node edit-server.js` →
  `http://localhost:4321/index-v18.html` (swap in any `index-vN.html`). The editor is **injected only when served** (the file on
  disk stays clean) and **each save writes the file + a git commit**. Therefore:
  - **Re-read the file before editing** — copy may have changed inline since you last saw it.
    Never clobber the user's inline copy edits.
  - Do large structural moves as **direct file edits**, not through the inline editor (its save
    path is tuned for small copy snippets, not block moves).
  - **The edit-server can silently wipe large structural blocks.** It does a whitespace-tolerant
    snippet replace against whatever HTML is in its in-memory buffer. If the buffer is stale (e.g.
    from before you added a big new section), the save will overwrite the file with the older
    version and drop your additions entirely — no warning. **After any session where you added a
    substantial new section, check that the section is still present before closing.** If it goes
    missing, restore from git (`git show <last-good-sha>:index-vN.html > index-vN.html`) and
    re-apply only the small edits on top.
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
before merge", "people decide what ships"). Frame access as exclusive — **"closed beta"** for a
small group of teams (this replaced the earlier "Q3 cohort / design partner" language); never
"waitlist". Ground claims in one real Amplitude-on-Amplitude example.

## Tech notes
- Palette = CSS vars (`--blue #0052F2`, `--blue-d #4083FF`, `--lilac`, `--violet`, `--pink`,
  `--green`, `--bg #070b1c`, `--panel #0c1226`, line tints). Fonts: Poppins (sans) + JetBrains Mono + Geist Mono.
- V19 introduces a second background register: **`#00070E`** (deeper navy) applied via a
  `.post-wave-bg` wrapper div that starts after the Unicorn Studio Wave embed and runs to the
  footer. The `::after` fade on `.intro-wave` targets this colour so the embed's bottom edge
  dissolves directly into it.
- SVG animation uses **SMIL** (`animateMotion` / `animate`). A `prefers-reduced-motion` block
  disables CSS animations; SMIL isn't covered by it (known limitation).
- **Third-party full-bleed embeds (e.g. Unicorn Studio):** wrap in a `position:relative` container,
  size with `width:100% !important; aspect-ratio: W/H` (overriding the embed's baked-in px size),
  and add `::before`/`::after` gradient fades to dissolve into the surrounding page background.
  The bottom fade should target the *next section's* background colour, not `--bg`, when the
  background changes below the embed.
- `edit-server.js` (Node, zero deps): serves the repo, injects `editor-client.js` into HTML
  responses, and exposes `/api/save` (whitespace-tolerant snippet replace + `git commit`),
  `/api/history`, `/api/revert`. `editor-client.js` is the in-browser toolbar.

## HTML patterns learned from bugs
- **Hover/tooltip cards inside inline text:** use `display: inline-block` (not `inline`) on the
  trigger element so it forms a positioning context for `position: absolute` children. Hidden state
  needs **both** `opacity: 0` and `visibility: hidden` — opacity alone still lets text leak into
  flow on some browsers. Never put block-level elements (`<p>`, `<div>`) inside an inline `<span>`
  inside a `<p>` — the browser's HTML repair closes the outer `<p>` early and ejects the card
  content into the page. Use `<span>` with `display: block` in CSS instead.
- **Section background changes mid-page:** wrap content in a `<div class="name">` with the new
  `background` value rather than trying to override individual section rules. Ensure the preceding
  transition element's fade gradient targets the wrapper's background colour, not the global `--bg`.
