import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
async function shot(file, out, opts={}) {
  await p.goto('file://' + process.cwd() + '/' + file, { waitUntil: 'networkidle' });
  // reveal-on-scroll: force everything visible
  await p.addStyleTag({ content: '.reveal{opacity:1!important;transform:none!important;}' });
  await p.waitForTimeout(400);
  await p.screenshot({ path: out, fullPage: opts.full ?? true });
}
await shot('index-v9.html', '_v9_full.png', { full: true });
await shot('index-v10.html', '_v10_full.png', { full: true });
await b.close();
console.log('done');
