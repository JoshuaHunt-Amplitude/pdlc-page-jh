/* PDLC inline copy editor — served by edit-server.js, never written into the page source. */
(function () {
  if (window.__pdlcEditor) return;
  window.__pdlcEditor = true;

  var FILE = location.pathname.replace(/^\//, '') || 'index.html';
  if (FILE.endsWith('/')) FILE += 'index.html';

  // Copy-bearing elements only. SVGs, <pre> code, scripts and the toolbar are excluded below.
  var SEL = [
    'main h1', 'main h2', 'main h3', 'main h4', 'main p', 'main li',
    'main .eyebrow', 'main .whatis-step', 'main .chain-chip', 'main .pchip',
    'main .st-name', 'main .st-tag', 'main .tenet-t', 'main .stat-lbl',
    'main .loop-pill', 'main .clock-chip', 'main .cmp-num', 'main .surface-tag',
    'nav a', '.nav-btn'
  ].join(', ');

  var orig = new Map();      // el -> baseline innerHTML (matches what's on disk)
  var editables = [];
  var editing = false;
  var head = null;           // current git short hash

  /* ---------- element selection ---------- */
  function skippable(el) {
    return el.closest('svg, pre, script, style, #pdlc-ed') || el.querySelector('svg, pre');
  }
  function collect() {
    var nodes = [].slice.call(document.querySelectorAll(SEL)).filter(function (el) { return !skippable(el); });
    var set = new Set(nodes);
    return nodes.filter(function (el) {
      var p = el.parentElement;
      while (p) { if (set.has(p)) return false; p = p.parentElement; }
      return true;
    });
  }

  /* ---------- styles ---------- */
  var css = '\
    #pdlc-ed{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:99999;\
      display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:999px;\
      background:rgba(15,18,25,.92);border:1px solid rgba(255,255,255,.16);\
      box-shadow:0 18px 50px rgba(0,0,0,.6);backdrop-filter:blur(12px);\
      font-family:"JetBrains Mono",ui-monospace,monospace;font-size:11px;color:#fff;}\
    #pdlc-ed button{font:inherit;cursor:pointer;border-radius:999px;border:1px solid transparent;\
      padding:8px 13px;letter-spacing:.08em;text-transform:uppercase;background:rgba(255,255,255,.06);\
      color:rgba(255,255,255,.82);transition:all .15s;}\
    #pdlc-ed button:hover{background:rgba(255,255,255,.12);color:#fff;}\
    #pdlc-ed button.on{background:#0052F2;border-color:#4083FF;color:#fff;}\
    #pdlc-ed button.primary{background:#0052F2;color:#fff;}\
    #pdlc-ed button.primary:hover{background:#4083FF;}\
    #pdlc-ed button:disabled{opacity:.4;cursor:default;}\
    #pdlc-ed .pe-sep{width:1px;height:18px;background:rgba(255,255,255,.14);}\
    #pdlc-ed .pe-dirty{color:#57E3A4;min-width:62px;text-align:center;}\
    #pdlc-ed .pe-dirty.clean{color:rgba(255,255,255,.4);}\
    #pdlc-ed .pe-ver{color:#4083FF;}\
    body[data-pe-editing] [data-pe]{outline:1px dashed rgba(64,131,255,.0);transition:outline-color .15s,background .15s;border-radius:3px;}\
    body[data-pe-editing] [data-pe]:hover{outline-color:rgba(64,131,255,.45);}\
    body[data-pe-editing] [data-pe]:focus{outline:1px solid #4083FF;background:rgba(64,131,255,.06);}\
    #pdlc-panel{position:fixed;bottom:74px;left:50%;transform:translateX(-50%);z-index:99998;width:min(520px,92vw);\
      max-height:50vh;overflow:auto;background:rgba(15,18,25,.97);border:1px solid rgba(255,255,255,.16);\
      border-radius:12px;box-shadow:0 24px 70px rgba(0,0,0,.7);backdrop-filter:blur(12px);\
      font-family:"JetBrains Mono",ui-monospace,monospace;padding:6px;}\
    #pdlc-panel[hidden]{display:none;}\
    #pdlc-panel .pe-h{padding:10px 12px;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.45);}\
    #pdlc-panel .pe-row{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:12px;\
      padding:10px 12px;border-radius:8px;color:#fff;font-size:12px;}\
    #pdlc-panel .pe-row:hover{background:rgba(255,255,255,.05);}\
    #pdlc-panel .pe-row .pe-hash{color:#4083FF;font-size:11px;}\
    #pdlc-panel .pe-row .pe-msg{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}\
    #pdlc-panel .pe-row .pe-msg small{color:rgba(255,255,255,.4);}\
    #pdlc-panel .pe-row.cur .pe-hash{color:#57E3A4;}\
    #pdlc-panel .pe-row button{font:inherit;font-size:10px;letter-spacing:.1em;text-transform:uppercase;\
      cursor:pointer;border:1px solid rgba(255,255,255,.18);background:transparent;color:rgba(255,255,255,.7);\
      padding:5px 10px;border-radius:6px;}\
    #pdlc-panel .pe-row button:hover{border-color:#4083FF;color:#4083FF;}\
    #pdlc-toast{position:fixed;bottom:74px;left:50%;transform:translateX(-50%);z-index:100000;\
      background:rgba(15,18,25,.97);border:1px solid rgba(255,255,255,.16);border-radius:8px;\
      padding:10px 16px;font-family:"JetBrains Mono",monospace;font-size:11px;color:#fff;\
      box-shadow:0 18px 50px rgba(0,0,0,.6);opacity:0;transition:opacity .2s,transform .2s;pointer-events:none;}\
    #pdlc-toast.show{opacity:1;transform:translateX(-50%) translateY(-4px);}';

  /* ---------- toolbar ---------- */
  var bar, btnEdit, dirtyEl, btnSave, btnVer, verEl, panel, toastEl;
  function build() {
    var style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);

    bar = document.createElement('div'); bar.id = 'pdlc-ed';
    bar.innerHTML =
      '<button id="pe-edit">✎ Edit</button>' +
      '<span class="pe-dirty clean" id="pe-dirty">saved</span>' +
      '<span class="pe-sep"></span>' +
      '<button id="pe-save" class="primary" disabled>Save</button>' +
      '<button id="pe-ver">Versions</button>' +
      '<span class="pe-ver" id="pe-head"></span>';
    document.body.appendChild(bar);

    panel = document.createElement('div'); panel.id = 'pdlc-panel'; panel.hidden = true;
    document.body.appendChild(panel);

    toastEl = document.createElement('div'); toastEl.id = 'pdlc-toast';
    document.body.appendChild(toastEl);

    btnEdit = bar.querySelector('#pe-edit');
    dirtyEl = bar.querySelector('#pe-dirty');
    btnSave = bar.querySelector('#pe-save');
    btnVer = bar.querySelector('#pe-ver');
    verEl = bar.querySelector('#pe-head');

    btnEdit.addEventListener('click', toggleEdit);
    btnSave.addEventListener('click', save);
    btnVer.addEventListener('click', togglePanel);
  }

  function toast(msg, ms) {
    toastEl.textContent = msg; toastEl.classList.add('show');
    clearTimeout(toast._t); toast._t = setTimeout(function () { toastEl.classList.remove('show'); }, ms || 2200);
  }

  /* ---------- edit mode ---------- */
  function toggleEdit() {
    editing = !editing;
    btnEdit.classList.toggle('on', editing);
    btnEdit.innerHTML = editing ? '✎ Editing' : '✎ Edit';
    document.body.toggleAttribute('data-pe-editing', editing);
    editables.forEach(function (el) { el.contentEditable = editing ? 'true' : 'false'; });
    if (editing) toast('Edit mode on — click any text. ⌘S to save.');
  }

  function changed() {
    return editables.filter(function (el) { return el.innerHTML !== orig.get(el); });
  }
  function refreshDirty() {
    var n = changed().length;
    dirtyEl.textContent = n ? (n + ' edited') : 'saved';
    dirtyEl.classList.toggle('clean', !n);
    btnSave.disabled = !n;
  }

  /* ---------- save ---------- */
  function save() {
    var ch = changed();
    if (!ch.length) { toast('No changes to save'); return; }
    var edits = ch.map(function (el, i) {
      return { i: i, before: orig.get(el), after: el.innerHTML, preview: (el.textContent || '').trim().slice(0, 60) };
    });
    btnSave.disabled = true; btnSave.textContent = 'Saving…';
    fetch('/api/save', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file: FILE, edits: edits })
    }).then(function (r) { return r.json(); }).then(function (res) {
      btnSave.textContent = 'Save';
      if (!res.ok) { toast('Save failed: ' + (res.error || 'unknown')); refreshDirty(); return; }
      var missed = res.missed || [];
      ch.forEach(function (el, i) { if (missed.indexOf(i) === -1) orig.set(el, el.innerHTML); });
      if (missed.length) {
        toast('Saved ' + (edits.length - missed.length) + ', ' + missed.length + " couldn't be matched", 3600);
      } else {
        toast('Saved ✓  ' + (res.short || ''));
      }
      head = res.short || head;
      verEl.textContent = head ? ('@' + head) : '';
      refreshDirty();
      if (!panel.hidden) loadHistory();
    }).catch(function (e) {
      btnSave.textContent = 'Save'; toast('Save error: ' + e.message); refreshDirty();
    });
  }

  /* ---------- history / versions ---------- */
  function togglePanel() { panel.hidden = !panel.hidden; if (!panel.hidden) loadHistory(); }
  function loadHistory() {
    panel.innerHTML = '<div class="pe-h">Versions — ' + FILE + '</div><div class="pe-h">loading…</div>';
    fetch('/api/history?file=' + encodeURIComponent(FILE)).then(function (r) { return r.json(); }).then(function (res) {
      if (!res.ok) { panel.innerHTML = '<div class="pe-h">no history (' + (res.error || '') + ')</div>'; return; }
      head = (res.commits[0] && res.commits[0].hash) || head;
      verEl.textContent = head ? ('@' + head) : '';
      var html = '<div class="pe-h">Versions — ' + FILE + '</div>';
      if (!res.commits.length) html += '<div class="pe-h">no commits yet — hit Save</div>';
      res.commits.forEach(function (c, idx) {
        html += '<div class="pe-row' + (idx === 0 ? ' cur' : '') + '">' +
          '<span class="pe-hash">' + c.hash + '</span>' +
          '<span class="pe-msg">' + esc(c.msg) + ' <small>' + esc(c.when) + '</small></span>' +
          (idx === 0 ? '<span style="color:#57E3A4;font-size:10px;letter-spacing:.1em">CURRENT</span>'
                     : '<button data-h="' + c.hash + '">Restore</button>') +
          '</div>';
      });
      panel.innerHTML = html;
      [].slice.call(panel.querySelectorAll('button[data-h]')).forEach(function (b) {
        b.addEventListener('click', function () { restore(b.getAttribute('data-h')); });
      });
    }).catch(function (e) { panel.innerHTML = '<div class="pe-h">history error: ' + esc(e.message) + '</div>'; });
  }
  function restore(hash) {
    if (!confirm('Restore ' + FILE + ' to version ' + hash + '? Unsaved edits will be lost; the page will reload.')) return;
    fetch('/api/revert', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file: FILE, hash: hash })
    }).then(function (r) { return r.json(); }).then(function (res) {
      if (res.ok) { location.reload(); } else { toast('Restore failed: ' + (res.error || '')); }
    }).catch(function (e) { toast('Restore error: ' + e.message); });
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }

  /* ---------- input handling ---------- */
  function onInput(e) { if (e.target.closest && e.target.closest('[data-pe]')) refreshDirty(); }
  function onPaste(e) {
    var t = e.target.closest && e.target.closest('[data-pe]'); if (!t) return;
    e.preventDefault();
    var text = (e.clipboardData || window.clipboardData).getData('text/plain');
    document.execCommand('insertText', false, text);
  }
  function onKey(e) {
    var mod = e.metaKey || e.ctrlKey;
    if (mod && (e.key === 's' || e.key === 'S')) { e.preventDefault(); if (editing) save(); return; }
    if (mod && (e.key === 'e' || e.key === 'E')) { e.preventDefault(); toggleEdit(); return; }
    if (e.key === 'Escape' && editing) { e.preventDefault(); toggleEdit(); return; }
    // plain Enter inside an editable: avoid block/<div> creation; Shift+Enter still inserts <br>
    if (e.key === 'Enter' && !e.shiftKey && e.target.closest && e.target.closest('[data-pe]')) { e.preventDefault(); }
  }

  /* ---------- init ---------- */
  function init() {
    editables = collect();
    editables.forEach(function (el) { el.setAttribute('data-pe', '1'); orig.set(el, el.innerHTML); });
    build();
    document.addEventListener('input', onInput, true);
    document.addEventListener('paste', onPaste, true);
    document.addEventListener('keydown', onKey, true);
    loadHistory();
    refreshDirty();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
