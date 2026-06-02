# PDLC site playground

A scrappy **playground for building the best, sickest website** to re-announce Amplitude's
**future product vision** and the **PDLC product surface** — both of which we're still figuring
out as we go. Nothing here is final: we fork variants freely, compare directions, and iterate.

> **"PDLC" is a placeholder name.** V6–V8 test real alternatives (Loop / Product OS / Opportunities).

## What's in here

Plain static HTML — no build step, no framework. Each `index-vN.html` is a self-contained
full-page design variant. A **⌘K** modal in every file switches between versions.

| File | What it is |
|------|------------|
| `index.html` … `index-v5.html` | The evolving full landing page (V1→V5). **V5 is the canonical, most-complete one.** |
| `index-v6/7/8.html` | Name tests forked from V5 — **Loop**, **Product OS**, **Opportunities**. |
| `index-v9.html` | **Vision** cut — narrative only: hero → manifesto → funnel → loop → CTA. |
| `index-v10.html` | **Product** cut — product only: feed → map → brief → ways-in → loop → CTA. |
| `docs.html` | A separate docs page. |

## Editing it

Two ways:

1. **Open the file** directly and edit the HTML/CSS by hand (structural changes, diagrams, layout).
2. **Inline copy editor** — a tiny local server that lets you edit copy in the browser and
   saves each change back to the file as a git commit:

   ```bash
   node edit-server.js          # → http://localhost:4321
   # open http://localhost:4321/index-v9.html (or any index-vN.html)
   ```

   - Click **Edit**, change copy in place, **⌘S** to save (writes the file + commits).
   - **Versions** panel = git history with one-click restore.
   - The editor is injected only when served, so the files on disk stay clean — there's no
     editor code committed into them.

Versions are independent: a change to one `index-vN.html` does **not** propagate to the others.

## Conventions

Design/voice/working notes for collaborators (human and AI) live in **`CLAUDE.md`** — diagrams-first,
"reduce don't add," motion-with-meaning, real CDN icons, frosted cards, and the project voice.
