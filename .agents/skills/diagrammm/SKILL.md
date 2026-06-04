---
name: diagrammm
description: "Create technical-trading-card / system-module-badge micrographics — wide rectangular badges on a flat saturated background with a mono HUD title block and a custom thin line-art glyph (orbital, node graph, funnel, database, human→check flow), optionally animated. Use when the user asks for a micrographic, HUD badge, system module card, spec-sheet diagram, technical poster card, or invokes diagrammm by name."
version: 1.0.0
user-invocable: true
argument-hint: "[concept or value-prop to badge]"
---

# diagrammm

Make collectible **system-module badges**: wide rectangular cards on a flat,
saturated field with a monospace HUD title block and one custom **thin line-art
glyph** doing the explaining. Retro-futurist developer-console / blueprint
minimalism. Every badge has a **static** form and an **animated** form from the
same SVG.

This skill is the distilled output of a long iteration on exactly these cards.
Follow it literally — the rules below were each earned by a correction.

## The one-line brief
> A collectible trading card for a software subsystem: `MODULE 2.0` stamp →
> big spaced uppercase title → `Verb • Verb • Verb` → a custom line glyph +
> a `[ bracketed ]` state list + progress dots → lowercase tagline + `[ 2026 ]`.

---

## Hard rules (do not violate)

1. **It's a small/mid decoration, not a poster ad.** No giant hero
   illustration that fills the card; no marketing layout. The glyphs + HUD text
   ARE the content, edge to edge. Lay multiples out in a grid, ~2–3 per row.
2. **Everything monospace, white/near-white.** IBM Plex Mono / Space Mono /
   JetBrains Mono. **No bold** — weight 400–500 max; emphasis comes from
   *color/opacity*, not weight.
3. **Glyphs are thin white line-art, ~1.4–2px, mostly unfilled.** A few solid
   white node-dots for emphasis; exactly **one** accent color used sparingly
   (a single violet/blue node, ring, or pick). Real vector geometry, never
   emoji/glyph fonts.
4. **Flat matte background**, one of: deep cobalt blue, near-black charcoal,
   oxblood maroon, or a purple gradient. No photographic texture. A *whisper*
   of film grain (opacity ≤ .06) is allowed, never visible noise.
5. **Equidistant rhythm, generous negative space, invisible grid.** The diagram
   row uses `justify-content: space-evenly` (equal gaps between items AND at the
   ends) — never `space-between` (it flings items to the edges). Uniform
   vertical gaps; no element pinned with `margin:auto` (it leaves dead space).
6. **Size everything in `cqw`** against a `container-type:inline-size` poster, so
   one badge looks identical at 360px or 600px wide.
7. **Animate by composing the kit, gated for static.** Subtle motion that *means
   something* (orbits revolve, signals flow, nodes pulse in sequence, gauges
   draw, radars ping). Provide a static freeze (`prefers-reduced-motion` +
   toggle). See "Motion".

---

## Anatomy (the invisible grid)

```
┌─────────────────────────────────────────────────────────┐
│ MODULE 2.0                       ● ○ ◐ ◑   ⬭   ← stamp + progress/marks
│                                                           │
│ AUTONOMOUS ORCHESTRATION              ← big spaced title  │
│ Coordinate · Adapt · Recover · Optimize  ← verb subtitle  │
│                                                           │
│   [glyph]        [ Monitor ]        ▢ accent              │
│   line-art       [ Adjust  ]        ▢   (dots/pills/      │
│   diagram        [ Recover ]        ◼    arrow steps)     │
│                  [ Evolve  ]                              │
│                                                           │
│ resilient systems. continuous progress.        [ 2026 ]  │
└─────────────────────────────────────────────────────────┘
```

- **stamp** (top-left): `MODULE 2.0` / `ORCH 2.2` / `HITL 1.2` — small caps, wide tracking, dim.
- **marks** (top-right): progress dots/squares (some filled, some outline; one ringed = "current") and/or a tiny concept glyph.
- **title**: large uppercase, wide letter-spacing (~.02–.06em), weight 700 *only if mono badge style*; line-height 1.
- **subtitle**: capability verbs, `·` separated, dim.
- **diagram row**: the central glyph + a `[ ]` bracketed 3–4 state list + a right accent (dot grid / stacked pills / arrow steps). `space-evenly`.
- **footer**: lowercase tagline left, `[ 2026 ]` right.

---

## Build it (static HTML/CSS, no deps)

Copy the scaffold from [`references/template.html`](references/template.html) — it
has the full poster CSS, the shared arrow markers, the motion kit, and one worked
badge. Then:

1. Pick a **background** (`.pbg` inline gradient) from the palette.
2. Fill the **header / title / subtitle / footer** copy.
3. Drop a **glyph** into `.po-mid` from [`references/glyphs.md`](references/glyphs.md)
   (orbital, node-graph, funnel, database, human→check, …), sized `width:NNcqw`.
4. Add a `.po-brk` bracket list and/or `.po-chips` / `.po-cdots` / dot-matrix
   accent. Keep the row to **2–3 elements**, `space-evenly`.
5. Make it move: add motion **classes** to glyph parts (atomic kit) or author
   **SMIL** for a richly composed badge (particles flowing a path, radar sweep).

### The poster shell (essence)
```css
.poster{position:relative;width:100%;container-type:inline-size;overflow:hidden;
  color:#f3f3f8;display:flex;flex-direction:column;gap:3.6cqw;padding:6cqw;}
.poster>.row{position:relative;z-index:2;}
.po-head{display:flex;align-items:center;gap:2.6cqw;}        /* stamp + .sp + marks */
.po-stamp{font:500 2.7cqw/1 var(--mono);letter-spacing:.14em;}
.po-head .sp{flex:1;}
.po-tt{display:flex;flex-direction:column;gap:1.6cqw;}
.po-title{font:700 5cqw/1 var(--mono);letter-spacing:.02em;text-transform:uppercase;white-space:nowrap;}
.po-sub{font:2.5cqw var(--mono);letter-spacing:.04em;} .po-sub .gt{opacity:.5;margin:0 .4cqw;}
.po-mid{display:flex;align-items:center;justify-content:space-evenly;gap:2cqw;}
.po-foot{display:flex;align-items:flex-end;justify-content:space-between;}
.po-note,.po-yr{font:2.1cqw var(--mono);opacity:.85;}
/* bracket list — literal [ ] via pseudo-borders */
.po-brk{position:relative;display:inline-flex;flex-direction:column;gap:.3cqw;
  padding:1cqw 2.4cqw;font:2.5cqw/1.22 var(--mono);}
.po-brk::before,.po-brk::after{content:"";position:absolute;top:0;bottom:0;width:1.2cqw;border:.34cqw solid currentColor;}
.po-brk::before{left:0;border-right:0;} .po-brk::after{right:0;border-left:0;}
```
Glyph base classes: `.mg .ln{fill:none;stroke:#f3f3f8;stroke-width:1.4}`
`.l2{stroke:rgba(243,243,248,.45)}` `.nd{fill:#fff}` `.no{fill:none;stroke:#f3f3f8;stroke-width:1.4}`
`.thin{stroke-width:1}` `.acc{stroke:var(--acc)}` `.accf{fill:var(--acc)}` — one accent only.

---

## Motion

Two ways; both must be freezable to a static version.

**A. Atomic CSS kit (gated).** Animations live behind a `.play` ancestor, so the
same markup is static (no `.play`) or animated (with it). Put `play` on `<body>`
by default; a toggle flips it and `pauseAnimations()` on the SVGs. Classes (add to
a glyph element; tune with inline `--sp` speed + `animation-delay` stagger +
`transform-box`/`transform-origin` pivot): `spin` `spin-r` `sweep` (rotation),
`throb` `ping` `grow` (in-place scale), `pulse` `blink` (opacity), `dash`
(marching flow), `draw` (pathLength sweep — set `pathLength="100" stroke-dasharray="100"`),
`bob` (lift). Full keyframes in [`references/template.html`](references/template.html).

**B. SMIL for composed badges.** For a "living instrument" (e.g. signals flowing
into a ranked decision), use `animateMotion`/`<mpath>` for particles along a path,
`animate` for pulsing `r`/`opacity`, `animateTransform` for sweeps. Namespace defs
ids per badge (`c10-orbit`, `c11-ship`). The static-toggle pauses SMIL too.

Motion must mean the concept: orbits revolve, the active node pulses clockwise
around a loop, raw signals stream up fan-in lines and the pick pings, a gauge/EKG
draws, a radar sweeps, a matrix flickers, a folder bobs.

---

## Concept → glyph map (pick the one that tells the story)

| Concept | Glyph |
| --- | --- |
| orchestration / system | orbital glyph, multi-orbit, hub & spokes |
| the loop / always-running | product-loop ring (cardinal nodes + center reticle) |
| signals → decision | signal funnel (many fan-in → rank → diverge, top = pick) |
| agent pipeline / workflow | agentic chain (pairs → filled → pairs) |
| AI / model architecture | neural-arch clusters with arrows |
| human-in-the-loop | bracketed-person `[👤]` → review gate → drawn check |
| memory / data | database cylinder, dot-matrix |
| ranked output / metrics | histogram (bars grow), sparkline draw, radar |
| targeting / focus | reticle, corner frame, crosshair |

Ground the copy in the product's real value props and voice — operational, human,
no jargon. For PDLC/Amplitude Wave that means: signals are the edge; the loop;
people decide what ships; closed beta.

---

## Workflow & validation

- Hand-author the SVG; match surrounding formatting. Inline the glyph; keep ids
  unique (namespace per badge).
- After every structural/SVG edit, **validate**: every `url(#id)` / `href="#id"`
  resolves to a defined `id=`; `<svg>`/`<g>`/`<figure>`/`<div>` tags balance.
  ```bash
  python3 - <<'PY'
  import re; t=open('FILE','r',encoding='utf-8').read()
  for a,b in [('<svg','</svg>'),('<g','</g>'),('<figure','</figure>'),('<div','</div>')]:
      print(a, t.count(a), b, t.count(b))
  ids=set(re.findall(r'\bid="([^"]+)"',t)); refs=set(re.findall(r'url\(#([^)]+)\)',t))|set(re.findall(r'href="#([^"]+)"',t))
  print('unresolved:', refs-ids or 'none')
  PY
  ```
- Open in a browser to eyeball; toggle the animation; check it scales (resize).

## Anti-patterns (each one was a real correction)
- ❌ a big hero illustration / self-contained "ad" → ✅ HUD text + glyphs edge to edge.
- ❌ `space-between` in the diagram row → ✅ `space-evenly`.
- ❌ `margin-top:auto` / mixed margins leaving dead vertical space → ✅ one uniform gap.
- ❌ bold titles / heavy weights → ✅ weight ≤ 500, emphasis by color.
- ❌ visible grain / photo texture → ✅ flat matte, grain ≤ .06.
- ❌ emoji or icon-font glyphs → ✅ hand-drawn thin vector line-art.
- ❌ animation that only runs via JS (breaks when toggled/stale) → ✅ `.play` on `<body>` + longhand `animation-*` (a `var()` duration in the shorthand can invalidate it).
- ❌ rainbow of accents → ✅ exactly one accent color, used once or twice.
