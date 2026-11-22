// Shrink a render to the size the judge actually sees, and report what survives.
//
// The judge compares images two at a time, and at small size. A page that reads at
// 1024px and turns to grey mush at 300px scores like a grey mush — that is exactly
// how a 36-story entry scored 967.231 while a 15-story one scored 981.793. So every
// render gets checked here before it is ever submitted.
//
//   node src/thumb.mjs out/entry.png [--size 300]
//
// Writes <input>-thumb-<size>.png beside the input and prints the byte sizes.

import { execFileSync } from 'node:child_process';
import { statSync, mkdtempSync, rmSync, copyFileSync, writeFileSync } from 'node:fs';
import { join, dirname, basename, extname } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';

const CHROME =
  process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const args = process.argv.slice(2);
const src = args.find((a) => !a.startsWith('--'));
if (!src) {
  console.error('usage: node src\\thumb.mjs <png> [--size 300]');
  process.exit(1);
}
const si = args.indexOf('--size');
const SIZE = si > -1 && args[si + 1] ? Number(args[si + 1]) : 300;

// Draw the source into a SIZE x SIZE canvas with a plain <img>, which is the same
// resampling a viewer does, then screenshot that canvas.
const html = `<!doctype html><meta charset="utf-8">
<style>
  html,body{margin:0;padding:0;background:#fff}
  img{display:block;width:${SIZE}px;height:${SIZE}px}
</style>
<img src="${pathToFileURL(src).href}">`;

const dir = mkdtempSync(join(tmpdir(), 'thumb-'));
const page = join(dir, 'p.html');
const shot = join(dir, 's.png');
writeFileSync(page, html, 'utf8');

execFileSync(
  CHROME,
  [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    `--window-size=${SIZE},${SIZE}`,
    '--screenshot=' + shot,
    '--no-sandbox',
    '--virtual-time-budget=1500',
    pathToFileURL(page).href,
  ],
  { stdio: 'ignore' }
);

const out = join(dirname(src), `${basename(src, extname(src))}-thumb-${SIZE}.png`);
copyFileSync(shot, out);
rmSync(dir, { recursive: true, force: true });

console.log(`full  : ${statSync(src).size} bytes  ${src}`);
console.log(`thumb : ${statSync(out).size} bytes  ${out}  (${SIZE}x${SIZE})`);
console.log('');
console.log('Open the thumbnail. Can you still tell what happened?');
console.log('  - the six figures under the masthead: readable?');
console.log('  - the three hero headlines: readable?');
console.log('  - the tile headlines: readable?');
console.log('  - do the colour blocks give the eye somewhere to land?');
console.log('If any answer is no, the fix is fewer/shorter items, never a smaller font.');
