#!/usr/bin/env python3
import io

SRC = "index-v5.html"
with io.open(SRC, encoding="utf-8") as f:
    base = f.read()

# ── extract the two product diagrams from v5 (for the vision CTA) ──────────
def slice_between(s, start_tok, end_tok):
    a = s.index(start_tok)
    b = s.index(end_tok, a)
    return s[a:b]

opp_feed = slice_between(base,
    '      <div class="opp-feed">',
    '\n    </div>\n  </div>\n</section>')
pmap = slice_between(base,
    '      <div class="pmap">',
    '\n    </div>\n\n    <div class="pshot-copy reveal">')

# ── helper: remove a whole section, including its leading <!-- comment ─────
def remove_section(s, section_tag, next_section_tag):
    tag = s.index(section_tag)
    start = s.rfind('<!--', 0, tag)
    ntag = s.index(next_section_tag)
    end = s.rfind('<!--', 0, ntag)
    return s[:start] + s[end:]

NAV_ORIG = (
    '    <div class="nav-links">\n'
    '      <a href="#why">Why</a>\n'
    '      <a href="#backlog">See it work</a>\n'
    '      <a href="#ways-in">Ways in</a>\n'
    '      <a href="docs.html">Docs</a>\n'
    '    </div>'
)

# ── shared cmd+k switcher additions (V9 + V10) ─────────────────────────────
V9_ITEM = (
    '      <a class="cmdk-item" href="index-v9.html" data-page="index-v9.html">\n'
    '        <span class="cmdk-num">V9</span>\n'
    '        <span class="cmdk-text">\n'
    '          <div class="cmdk-name">Vision only</div>\n'
    '          <div class="cmdk-desc">V5 fork · narrative cut — manifesto + funnel + loop, product peek in closer</div>\n'
    '        </span>\n'
    '        <span class="cmdk-current">Current</span>\n'
    '      </a>\n'
)
V10_ITEM = (
    '      <a class="cmdk-item" href="index-v10.html" data-page="index-v10.html">\n'
    '        <span class="cmdk-num">V10</span>\n'
    '        <span class="cmdk-text">\n'
    '          <div class="cmdk-name">Product only</div>\n'
    '          <div class="cmdk-desc">V5 fork · product cut — feed, map, brief, ways in; no manifesto</div>\n'
    '        </span>\n'
    '        <span class="cmdk-current">Current</span>\n'
    '      </a>\n'
)
SWITCHER_TAIL = '      </a>\n    </div>\n  </div>\n</div>'

def add_switcher(s):
    return s.replace(SWITCHER_TAIL,
                     '      </a>\n' + V9_ITEM + V10_ITEM + '    </div>\n  </div>\n</div>',
                     1)

# ============================================================ V9 · VISION ===
v9 = base
v9 = remove_section(v9, '<section class="signals" id="signals">',
                        '<div class="funnel reveal" aria-hidden="true">')
v9 = remove_section(v9, '<section class="pshot" id="backlog">',
                        '<section class="pl-section reveal" id="loops">')
v9 = remove_section(v9, '<section class="surfaces" id="ways-in">',
                        '<section id="cta" class="closer">')

# title
v9 = v9.replace('Find what matters. Ship it faster.',
                'Vision · the case for self-improving products', 1)

# nav
v9 = v9.replace(NAV_ORIG,
    '    <div class="nav-links">\n'
    '      <a href="#why">Why</a>\n'
    '      <a href="#loops">The loop</a>\n'
    '      <a href="docs.html">Docs</a>\n'
    '    </div>', 1)

# manifesto -> one column
v9 = v9.replace('grid-template-columns: 1fr 1fr; gap: 56px; align-items: start; }',
                'grid-template-columns: 1fr; gap: 28px; max-width: 760px; align-items: start; }', 1)

# funnel spacing now that it sits between manifesto and loop
v9 = v9.replace('<div class="funnel reveal" aria-hidden="true">',
                '<div class="funnel reveal" aria-hidden="true" style="margin:64px auto 28px">', 1)

# scoped CSS for the CTA product peek
peek_css = (
    '\n  /* ── CTA product peek (vision fork) ── */\n'
    '  .closer-peek { margin-bottom: 84px; }\n'
    '  .closer-peek .eyebrow { margin-bottom: 30px; }\n'
    '  .closer-diagrams {\n'
    '    display: grid; grid-template-columns: 1fr 1fr; gap: 28px;\n'
    '    max-width: 1120px; margin: 0 auto; text-align: left; align-items: start;\n'
    '  }\n'
    '  .closer-diagrams .opp-feed { transform: none; border-radius: 14px; }\n'
    '  .closer-diagrams .pmap { border-radius: 14px; }\n'
    '  @media (max-width: 900px) { .closer-diagrams { grid-template-columns: 1fr; } }\n'
)
v9 = v9.replace('</style>\n</head>', peek_css + '</style>\n</head>', 1)

# inject the two diagrams at the top of the closer
peek_block = (
    '<section id="cta" class="closer">\n'
    '  <div class="closer-peek reveal">\n'
    '    <div class="eyebrow">A glimpse of the product</div>\n'
    '    <div class="closer-diagrams">\n'
    + opp_feed + '\n'
    + pmap + '\n'
    '    </div>\n'
    '  </div>\n'
)
v9 = v9.replace('<section id="cta" class="closer">\n', peek_block, 1)

v9 = add_switcher(v9)
with io.open('index-v9.html', 'w', encoding='utf-8') as f:
    f.write(v9)

# =========================================================== V10 · PRODUCT ==
v10 = base
v10 = remove_section(v10, '<section class="manifesto" id="why">',
                          '<section class="signals" id="signals">')

# title
v10 = v10.replace('Find what matters. Ship it faster.',
                  'Product · see it work', 1)

# nav (no manifesto -> drop "Why", add "The loop")
v10 = v10.replace(NAV_ORIG,
    '    <div class="nav-links">\n'
    '      <a href="#backlog">See it work</a>\n'
    '      <a href="#loops">The loop</a>\n'
    '      <a href="#ways-in">Ways in</a>\n'
    '      <a href="docs.html">Docs</a>\n'
    '    </div>', 1)

v10 = add_switcher(v10)
with io.open('index-v10.html', 'w', encoding='utf-8') as f:
    f.write(v10)

print("v9 bytes :", len(v9))
print("v10 bytes:", len(v10))
print("opp_feed chars:", len(opp_feed), "| pmap chars:", len(pmap))
