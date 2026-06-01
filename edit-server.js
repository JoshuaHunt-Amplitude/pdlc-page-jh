#!/usr/bin/env node
/* PDLC inline copy editor — local dev server.
 *
 *   node edit-server.js            # serves repo at http://localhost:4321
 *   PORT=5000 node edit-server.js
 *
 * Serves static files from this directory and injects the inline editor
 * (editor-client.js) into HTML responses ONLY — the files on disk stay clean.
 * Saving applies targeted, whitespace-tolerant text replacements to the source
 * and commits the file to git, so every save is a restorable version.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

const ROOT = __dirname;
const PORT = parseInt(process.env.PORT, 10) || 4321;

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.gif': 'image/gif', '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff': 'font/woff',
  '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.map': 'application/json; charset=utf-8'
};

/* ---------- helpers ---------- */
function send(res, code, body, type) {
  res.writeHead(code, { 'Content-Type': type || 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(body);
}
function sendJSON(res, code, obj) { send(res, code, JSON.stringify(obj), 'application/json; charset=utf-8'); }

function readBody(req) {
  return new Promise(function (resolve, reject) {
    let data = ''; let size = 0;
    req.on('data', function (c) { size += c.length; if (size > 8e6) { reject(new Error('body too large')); req.destroy(); } data += c; });
    req.on('end', function () { resolve(data); });
    req.on('error', reject);
  });
}
function git(args) {
  return new Promise(function (resolve, reject) {
    execFile('git', args, { cwd: ROOT, maxBuffer: 1e7 }, function (err, stdout, stderr) {
      if (err) { err.stderr = stderr; reject(err); } else resolve(stdout);
    });
  });
}
// resolve a request path safely within ROOT
function safePath(urlPath) {
  let rel = decodeURIComponent(urlPath.split('?')[0]).replace(/^\/+/, '');
  if (rel === '') rel = 'index.html';
  if (rel.endsWith('/')) rel += 'index.html';
  const full = path.normalize(path.join(ROOT, rel));
  if (full !== ROOT && !full.startsWith(ROOT + path.sep)) return null;
  return full;
}

/* ---------- save: whitespace-tolerant snippet replacement ---------- */
function flexible(before) {
  const esc = before.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return esc.replace(/\s+/g, '\\s+');
}
function applyEdits(text, edits) {
  const missed = [];
  let out = text;
  edits.forEach(function (e, idx) {
    const id = (typeof e.i === 'number') ? e.i : idx;
    if (e.before === e.after) return;
    if (out.indexOf(e.before) !== -1) {              // exact match first (clean diff)
      if (out.split(e.before).length - 1 === 1) { out = out.replace(e.before, function () { return e.after; }); return; }
    }
    const re = new RegExp(flexible(e.before), 'g');  // tolerate indentation/newline differences
    const matches = out.match(re);
    if (matches && matches.length === 1) { out = out.replace(re, function () { return e.after; }); }
    else { missed.push(id); }
  });
  return { out: out, missed: missed };
}

async function handleSave(req, res) {
  let body;
  try { body = JSON.parse(await readBody(req)); } catch (e) { return sendJSON(res, 400, { ok: false, error: 'bad json' }); }
  const full = safePath('/' + (body.file || ''));
  if (!full || !full.endsWith('.html') || !fs.existsSync(full)) return sendJSON(res, 400, { ok: false, error: 'bad file' });
  const edits = Array.isArray(body.edits) ? body.edits : [];
  if (!edits.length) return sendJSON(res, 400, { ok: false, error: 'no edits' });

  const before = fs.readFileSync(full, 'utf8');
  const { out, missed } = applyEdits(before, edits);
  if (out === before) return sendJSON(res, 200, { ok: false, error: 'nothing matched', missed: missed });

  try {
    fs.writeFileSync(full, out, 'utf8');
    const rel = path.relative(ROOT, full);
    const applied = edits.length - missed.length;
    const first = (edits.find(function (e, i) { return missed.indexOf(typeof e.i === 'number' ? e.i : i) === -1; }) || {}).preview || '';
    const msg = body.label && body.label.trim()
      ? body.label.trim()
      : 'edit: ' + applied + ' copy change' + (applied === 1 ? '' : 's') + (first ? ' — "' + first.replace(/"/g, "'").slice(0, 50) + '"' : '');
    await git(['add', '--', rel]);
    await git(['commit', '-m', msg, '--', rel]);
    const short = (await git(['rev-parse', '--short', 'HEAD'])).trim();
    sendJSON(res, 200, { ok: true, short: short, applied: applied, missed: missed });
  } catch (e) {
    sendJSON(res, 500, { ok: false, error: (e.stderr || e.message || 'git error').toString().trim().slice(0, 200), missed: missed });
  }
}

async function handleHistory(req, res, url) {
  const file = (url.searchParams.get('file') || '').replace(/^\/+/, '');
  const full = safePath('/' + file);
  if (!full) return sendJSON(res, 400, { ok: false, error: 'bad file' });
  const rel = path.relative(ROOT, full);
  try {
    const out = await git(['log', '--pretty=format:%h\x1f%ar\x1f%s', '-n', '50', '--', rel]);
    const commits = out.split('\n').filter(Boolean).map(function (l) {
      const p = l.split('\x1f'); return { hash: p[0], when: p[1], msg: p[2] || '' };
    });
    sendJSON(res, 200, { ok: true, commits: commits });
  } catch (e) {
    sendJSON(res, 200, { ok: false, error: (e.stderr || e.message).toString().trim().slice(0, 200), commits: [] });
  }
}

async function handleRevert(req, res) {
  let body;
  try { body = JSON.parse(await readBody(req)); } catch (e) { return sendJSON(res, 400, { ok: false, error: 'bad json' }); }
  const full = safePath('/' + (body.file || ''));
  const hash = (body.hash || '').replace(/[^0-9a-f]/gi, '');
  if (!full || !hash) return sendJSON(res, 400, { ok: false, error: 'bad request' });
  const rel = path.relative(ROOT, full);
  try {
    await git(['checkout', hash, '--', rel]);   // restore into working tree; user can re-save to keep moving forward
    sendJSON(res, 200, { ok: true });
  } catch (e) {
    sendJSON(res, 500, { ok: false, error: (e.stderr || e.message).toString().trim().slice(0, 200) });
  }
}

/* ---------- static ---------- */
function serveStatic(req, res, url) {
  const full = safePath(url.pathname);
  if (!full) return send(res, 403, 'forbidden');
  fs.stat(full, function (err, st) {
    if (err || !st.isFile()) return send(res, 404, 'not found');
    const ext = path.extname(full).toLowerCase();
    if (ext === '.html') {
      let html = fs.readFileSync(full, 'utf8');
      const tag = '\n<script src="/__editor.js"></script>\n';
      html = html.indexOf('</body>') !== -1 ? html.replace(/<\/body>/i, tag + '</body>') : html + tag;
      return send(res, 200, html, MIME['.html']);
    }
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    fs.createReadStream(full).pipe(res);
  });
}

/* ---------- router ---------- */
const server = http.createServer(function (req, res) {
  const url = new URL(req.url, 'http://localhost');
  const p = url.pathname;
  if (p === '/__editor.js') {
    return send(res, 200, fs.readFileSync(path.join(ROOT, 'editor-client.js'), 'utf8'), MIME['.js']);
  }
  if (p === '/api/config') return sendJSON(res, 200, {});               // page's analytics loader no-ops
  if (p === '/api/save' && req.method === 'POST') return handleSave(req, res);
  if (p === '/api/history') return handleHistory(req, res, url);
  if (p === '/api/revert' && req.method === 'POST') return handleRevert(req, res);
  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'method not allowed');
  serveStatic(req, res, url);
});

server.listen(PORT, '127.0.0.1', function () {
  const page = fs.existsSync(path.join(ROOT, 'index-v5.html')) ? 'index-v5.html' : 'index.html';
  console.log('PDLC editor running:  http://localhost:' + PORT + '/' + page);
  console.log('Edit inline → ⌘S to save (writes the file + git commit). Versions button = history/restore.');
});
