# diagrammm — glyph kit

Drop-in thin-line micrographics for the diagram row. All use the base classes from
`template.html` (`.mg .ln/.l2/.nd/.no/.thin/.acc/.accf`) and the shared `#ar`
marker. Size with `style="width:NNcqw"`. **Static by default**; add the noted
class (+ inline `--sp` speed / `animation-delay` stagger / `transform-box:view-box`
+ `transform-origin:<x>px <y>px` pivot) for motion under `.play`. One accent only.

> Pivot note: for `spin`/`sweep` set `transform-box:view-box;transform-origin:CXpx CYpx`
> on the wrapped element. `throb`/`ping`/`grow` use the element's own box (the class
> sets `fill-box`); override inline to pivot elsewhere.

---

### Orbital glyph — orchestration / system  ·  animate: `spin` the inner group
```html
<svg class="mg" viewBox="0 0 160 110" fill="none">
  <g class="spin" style="transform-box:view-box;transform-origin:80px 55px;--sp:26s"><g transform="translate(80 55) rotate(-18)">
    <ellipse class="ln" rx="58" ry="23"/><ellipse class="l2" rx="32" ry="13"/>
    <circle class="nd" cx="58" cy="0" r="3.6"/><circle class="nd" cx="-46" cy="-12" r="3"/><circle class="accf" cx="-12" cy="13" r="2.8"/></g></g>
  <path class="l2" d="M73 55h7M80 50v7"/>
</svg>
```

### Multi-orbit — concentric, dots orbit at different speeds  ·  animate: wrap each dot in `spin`/`spin-r`
```html
<svg class="mg" viewBox="0 0 160 110" fill="none">
  <circle class="l2" cx="80" cy="55" r="44"/><circle class="l2" cx="80" cy="55" r="30"/><circle class="ln" cx="80" cy="55" r="16"/>
  <g class="spin"   style="transform-box:view-box;transform-origin:80px 55px;--sp:14s"><circle class="nd" cx="80" cy="11" r="3.2"/></g>
  <g class="spin-r" style="transform-box:view-box;transform-origin:80px 55px;--sp:11s"><circle class="nd" cx="124" cy="55" r="3.2"/></g>
  <g class="spin"   style="transform-box:view-box;transform-origin:80px 55px;--sp:20s"><circle class="accf" cx="58" cy="83" r="3.2"/></g>
  <circle class="nd" cx="80" cy="55" r="2.6"/>
</svg>
```

### Hub & spokes — fleet / central agent  ·  animate: ring `spin`, center `throb`
```html
<svg class="mg" viewBox="0 0 160 110" fill="none">
  <circle class="nd throb" cx="80" cy="55" r="5" style="--sp:2.8s"/>
  <g class="ln"><path d="M80 55 L40 30"/><path d="M80 55 L120 30"/><path d="M80 55 L40 80"/><path d="M80 55 L120 80"/><path d="M80 55 L80 22"/></g>
  <g class="no"><circle cx="40" cy="30" r="4"/><circle cx="120" cy="30" r="4"/><circle cx="40" cy="80" r="4"/><circle cx="120" cy="80" r="4"/><circle cx="80" cy="22" r="4"/></g>
  <g class="spin" style="transform-box:view-box;transform-origin:80px 55px;--sp:22s"><circle class="ln" cx="80" cy="55" r="40" stroke-dasharray="2 7"/></g>
</svg>
```

### Signal funnel — many → ranked decision  ·  animate: `dash` the lines, `throb` the rank nodes
```html
<svg class="mg" viewBox="0 0 200 110" fill="none">
  <g class="ln dash" stroke-linecap="round" stroke-dasharray="5 5" style="--sp:1.8s">
    <path d="M22 28 L86 55"/><path d="M22 82 L86 55"/><path d="M52 16 L86 55"/><path d="M52 94 L86 55"/>
    <path d="M94 55 L116 55"/><path d="M124 55 L178 28"/><path d="M124 55 L178 82"/></g>
  <g class="no"><circle cx="20" cy="28" r="5"/><circle cx="20" cy="82" r="5"/><circle cx="50" cy="16" r="5"/><circle cx="50" cy="94" r="5"/><circle cx="180" cy="28" r="5"/><circle cx="180" cy="82" r="5"/></g>
  <g class="nd"><circle class="throb" cx="90" cy="55" r="5.5" style="--sp:2.2s"/><circle class="throb" cx="120" cy="55" r="5.5" style="--sp:2.2s;animation-delay:.5s"/></g>
</svg>
```
> For a *living* funnel, swap the `dash` lines for `<animateMotion>` particles
> streaming along fan-in paths into the rank node, and `ping` the top pick.

### Agentic chain — pipeline  ·  animate: `dash` the links, `throb` the filled nodes (stagger)
```html
<svg class="mg" viewBox="0 0 200 110" fill="none">
  <g class="ln dash" stroke-linecap="round" stroke-dasharray="5 5" style="--sp:1.8s"><path d="M24 36 L70 55 M24 74 L70 55 M78 55 L100 38 M78 55 L100 72 M108 38 L130 55 M108 72 L130 55 M138 55 L160 38 M138 55 L160 72"/></g>
  <g class="no"><circle cx="20" cy="36" r="5"/><circle cx="20" cy="74" r="5"/><circle cx="104" cy="36" r="5"/><circle cx="104" cy="74" r="5"/><circle cx="164" cy="36" r="5"/><circle cx="164" cy="74" r="5"/></g>
  <g class="nd"><circle class="throb" cx="74" cy="55" r="5" style="--sp:2.4s"/><circle class="throb" cx="134" cy="55" r="5" style="--sp:2.4s;animation-delay:.6s"/></g>
</svg>
```

### Neural arch — model / AI  ·  animate: `throb` nodes in an L→R wave (stagger by x)
```html
<svg class="mg" viewBox="0 0 200 110" fill="none">
  <g class="ln"><path d="M16 28 L48 55 M16 82 L48 55 M16 28 L16 82 M48 55 L80 28 M48 55 L80 82"/>
    <path d="M88 55 L108 55" marker-end="url(#ar)"/>
    <path d="M116 55 L150 30 M116 55 L150 80 M150 30 L184 55 M150 80 L184 55 M150 30 L150 80"/></g>
  <g class="nd"><circle class="throb" cx="16" cy="28" r="3" style="--sp:2.6s"/><circle class="throb" cx="48" cy="55" r="3.6" style="--sp:2.6s;animation-delay:.4s"/><circle class="throb" cx="116" cy="55" r="3.6" style="--sp:2.6s;animation-delay:.8s"/><circle class="throb" cx="184" cy="55" r="3.6" style="--sp:2.6s;animation-delay:1.2s"/></g>
</svg>
```

### Human → check — human-in-the-loop  ·  animate: `draw` the check (set pathLength/dasharray)
```html
<svg class="mg" viewBox="0 0 200 80" fill="none" stroke="#fff" stroke-width="2">
  <path d="M16 14 H8 V56 H16 M62 14 H70 V56 H62"/><circle cx="39" cy="30" r="8"/><path d="M25 52 a14 12 0 0 1 28 0"/>
  <path d="M84 35 H112" marker-end="url(#ar)"/>
  <circle cx="150" cy="35" r="20" stroke-dasharray="2.5 5.5"/><path d="M178 35 H206" marker-end="url(#ar)"/>
  <rect x="222" y="17" width="36" height="36" rx="3"/>
  <circle cx="332" cy="35" r="20" transform="translate(-100 0)"/>
  <path class="draw" d="M222 35 l7 7 l13 -15" pathLength="100" stroke-dasharray="100" stroke-linecap="round" stroke-linejoin="round" style="--sp:2.6s"/>
</svg>
```

### Database cylinder — memory / data  ·  animate: inner band `pulse`
```html
<svg class="mg" viewBox="0 0 90 96" fill="none" stroke="#fff" stroke-width="2">
  <ellipse cx="45" cy="18" rx="34" ry="13"/><path d="M11 18 V70 a34 13 0 0 0 68 0 V18"/>
  <path class="l2 pulse" d="M11 44 a34 13 0 0 0 68 0" style="--sp:2.8s"/>
</svg>
```

### Reticle — targeting / focus  ·  animate: marching ants (`dash`) + center `throb`
```html
<svg class="mg" viewBox="0 0 160 110" fill="none">
  <rect class="l2 dash" x="40" y="25" width="80" height="60" rx="3" stroke-dasharray="5 6" style="--sp:3s"/>
  <circle class="ln" cx="80" cy="55" r="13"/><path class="ln" d="M80 38v8 M80 64v8 M62 55h8 M90 55h8"/>
  <circle class="accf throb" cx="80" cy="55" r="2.4" style="--sp:2.4s"/>
</svg>
```

### Radar sweep — scan / metrics  ·  animate: `sweep` the arm, `ping` the blip ring
```html
<svg class="mg" viewBox="0 0 160 110" fill="none">
  <g class="l2"><circle cx="80" cy="55" r="42"/><circle cx="80" cy="55" r="28"/><circle cx="80" cy="55" r="14"/><path d="M80 9v92 M34 55h92" class="thin"/></g>
  <line class="sweep" x1="80" y1="55" x2="80" y2="14" stroke="var(--acc)" stroke-width="1.6" stroke-linecap="round" opacity=".75" style="transform-box:view-box;transform-origin:80px 55px;--sp:3.6s"/>
  <circle class="accf" cx="104" cy="40" r="3.4"/>
  <circle class="acc ping" cx="104" cy="40" r="9" fill="none" opacity=".6" style="--sp:2.6s"/>
</svg>
```

### Histogram — ranked output  ·  animate: bars `grow` (stagger), accent bar = the pick
```html
<svg class="mg" viewBox="0 0 160 110" fill="none">
  <path class="l2 thin" d="M24 90 H140"/>
  <g class="ln"><rect class="grow" x="30" y="62" width="12" height="28" style="--sp:2.8s"/><rect class="grow" x="50" y="44" width="12" height="46" style="--sp:2.8s;animation-delay:.4s"/><rect class="grow" x="70" y="54" width="12" height="36" style="--sp:2.8s;animation-delay:.8s"/><rect class="grow" x="110" y="58" width="12" height="32" style="--sp:2.8s;animation-delay:1.6s"/><rect class="grow" x="130" y="48" width="12" height="42" style="--sp:2.8s;animation-delay:2s"/></g>
  <rect class="accf grow" x="90" y="30" width="12" height="60" style="--sp:2.8s;animation-delay:1.2s"/>
</svg>
```

### Sparkline — trend  ·  animate: `draw` the line, `throb` the end dot
```html
<svg class="mg" viewBox="0 0 160 110" fill="none">
  <path class="l2 thin" d="M22 88 H138"/>
  <path class="ln draw" d="M22 72 L48 58 L70 66 L94 38 L116 48 L138 26" pathLength="100" stroke-dasharray="100 100" stroke-linecap="round" stroke-linejoin="round" style="--sp:3.6s"/>
  <circle class="accf throb" cx="138" cy="26" r="3.2" style="--sp:2.6s"/>
</svg>
```

### Pulse / EKG — heartbeat / live  ·  animate: `draw` sweeps the trace
```html
<svg class="mg" viewBox="0 0 160 110" fill="none">
  <path class="ln draw" d="M16 55 H56 L64 55 L70 30 L78 82 L86 42 L92 55 L100 55 H144" pathLength="100" stroke-dasharray="100 100" stroke-linecap="round" stroke-linejoin="round" style="--sp:2.6s"/>
  <circle class="accf throb" cx="78" cy="82" r="2.6" style="--sp:2.6s"/>
</svg>
```

### Spinner ring — loading / running  ·  animate: `spin` the arc
```html
<svg class="mg" viewBox="0 0 160 110" fill="none">
  <circle class="l2" cx="80" cy="55" r="38" stroke-dasharray="3 8"/>
  <g class="spin" style="transform-box:view-box;transform-origin:80px 55px;--sp:2.4s"><circle class="ln" cx="80" cy="55" r="38" stroke-dasharray="44 200" stroke-linecap="round" transform="rotate(-90 80 55)"/></g>
  <circle class="accf" cx="80" cy="55" r="3"/>
</svg>
```

### Hexagon node — module / object  ·  animate: inner hex `spin-r`, core `throb`
```html
<svg class="mg" viewBox="0 0 160 110" fill="none">
  <polygon class="ln" points="80,18 116,38 116,77 80,97 44,77 44,38"/>
  <polygon class="l2 spin-r" points="80,40 98,50 98,67 80,77 62,67 62,50" style="transform-box:view-box;transform-origin:80px 57px;--sp:18s"/>
  <circle class="accf throb" cx="80" cy="57" r="3" style="--sp:2.6s"/>
  <g class="l2 thin"><path d="M80 18v22 M116 38l-18 12 M44 38l18 12 M116 77l-18-10 M44 77l18-10 M80 97v-20"/></g>
</svg>
```

### Dot matrix — data field  ·  animate: `blink` the bright dots (varied delays)
```html
<svg class="mg" viewBox="0 0 64 64" fill="#fff">
  <g opacity=".4"><circle cx="8" cy="8" r="3.4"/><circle cx="26" cy="8" r="3.4"/><circle cx="44" cy="8" r="3.4"/><circle cx="62" cy="8" r="3.4"/><circle cx="8" cy="26" r="3.4"/><circle cx="26" cy="26" r="3.4"/><circle cx="44" cy="26" r="3.4"/><circle cx="62" cy="26" r="3.4"/><circle cx="8" cy="44" r="3.4"/><circle cx="26" cy="44" r="3.4"/><circle cx="44" cy="44" r="3.4"/><circle cx="62" cy="44" r="3.4"/></g>
  <circle class="blink" cx="8" cy="8" r="3.4" style="--sp:2.4s"/><circle class="blink" cx="44" cy="8" r="3.4" style="--sp:2.8s;animation-delay:.9s"/><circle class="blink" cx="26" cy="26" r="3.4" style="--sp:3s;animation-delay:.5s"/><circle class="blink" cx="62" cy="44" r="3.4" style="--sp:2.6s;animation-delay:1.2s"/>
</svg>
```

---

## Header marks & accents (CSS, no SVG)
- **progress dots/squares**: a small inline `<svg>` of `<circle>`s/`<rect>`s — some `fill="#fff"`, some `stroke="#fff"`; one ringed (outer stroke + inner fill dot) = current. Pulse the current with `<animate>`/`throb`.
- **bracket state list**: `.po-brk` (literal `[ ]` via pseudo-borders) — 3–4 single words.
- **stacked pills**: `.po-chips` (2 outline + 1 filled).
- **filled squares row**: `.po-sq`.  **circle column**: `.po-cdots`.

## Composing a *living* badge (SMIL)
Nest several primitives on one focal point and drive with SMIL: `animateMotion` +
`<mpath href="#path">` for particles tracing orbits/funnels/chains, `animate` on
`r`/`opacity`/`stroke-dashoffset` for pulses, draws and pings, `animateTransform
type="rotate"` for sweeps. Namespace ids per badge. The static toggle pauses SMIL.
