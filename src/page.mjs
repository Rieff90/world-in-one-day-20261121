// Turn the day's stories into one HTML page, 1024 by 1024, and hand it to Chrome.
//
// The judge only ever sees the PNG, at most 1024 by 1024 and at most 1 MiB, so the
// layout is fixed at that size and screenshotted at that size. Nothing loads from
// the network: no webfonts, no images, no external stylesheet. The page has to
// survive the grader's sandbox, where there is no network at all.

import { writeFileSync, mkdtempSync, rmSync, copyFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';
import { DAY, STAND, LEADS, STORIES, TICKER, PINS, TIMELINE, DATE_CHECK, FOOTER } from './stories.mjs';
import { tally } from './regions.mjs';

const CHROME =
  process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';

// Everything that reaches the page goes through here: a stray < or & in a headline
// would otherwise break the markup and silently swallow the rest of the article.
const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const leadHtml = (l) => `
  <article class="lead">
    <div class="lead-kicker"><span class="num">${l.no}</span><span>${esc(l.kicker)}</span><span class="tag">${esc(l.tag)}</span></div>
    <h2>${esc(l.title)}</h2>
    <p>${esc(l.body)}</p>
    <div class="src">${esc(l.source)}</div>
  </article>`;

const briefHtml = (s) => `
  <article class="brief">
    <div class="brief-kicker"><span class="num sm">${s.no}</span><span>${esc(s.kicker)}</span></div>
    <h3>${esc(s.title)}</h3>
    <p>${esc(s.body)}</p>
    <div class="src">${esc(s.source)}</div>
  </article>`;

// A flat world silhouette. Simplified polygons are enough to read as a map at this
// size and small enough to keep inline; the numbered pins sit in the same space.
const WORLD = `
<svg viewBox="0 0 1000 500" preserveAspectRatio="none" class="worldmap">
  <rect width="1000" height="500" fill="#e6dcc8"/>
  <g fill="#c9bda4" stroke="#a99a7e" stroke-width="1">
    <path d="M120,120 L210,95 L280,110 L300,160 L275,205 L250,235 L215,250 L185,235 L165,195 L140,170 Z"/>
    <path d="M255,250 L300,240 L325,275 L318,330 L295,395 L270,430 L250,405 L245,350 L235,300 Z"/>
    <path d="M455,110 L500,95 L540,105 L560,130 L545,155 L515,165 L485,155 L465,135 Z"/>
    <path d="M470,175 L530,170 L560,205 L555,260 L530,320 L505,375 L480,395 L465,350 L455,285 L450,225 Z"/>
    <path d="M555,105 L640,90 L740,100 L820,120 L870,155 L860,200 L820,215 L775,200 L735,225 L700,210 L660,220 L620,195 L585,165 L565,135 Z"/>
    <path d="M690,240 L740,235 L760,270 L745,310 L715,320 L690,290 Z"/>
    <path d="M845,290 L895,285 L910,315 L890,345 L855,335 Z"/>
    <path d="M300,105 L360,98 L380,118 L350,132 L310,128 Z"/>
  </g>
  ${PINS.map(
    (p) => `
  <g>
    <circle cx="${p.x * 10}" cy="${p.y * 5}" r="8" fill="#8c1d1d" stroke="#f4efe4" stroke-width="1.6"/>
    <text x="${p.x * 10}" y="${p.y * 5 + 3}" text-anchor="middle" font-size="8"
          font-family="Segoe UI, Arial, sans-serif" font-weight="700" fill="#f4efe4">${p.no}</text>
  </g>`
  ).join('')}
</svg>`;

const regionRows = tally(LEADS, STORIES);

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 1024px; height: 1024px; overflow: hidden; }
  body {
    background: #f4efe4; color: #12233d;
    font-family: Georgia, "Times New Roman", serif;
    -webkit-font-smoothing: antialiased;
    padding: 12px 16px 10px;
    display: flex; flex-direction: column;
  }
  .masthead {
    display: flex; justify-content: space-between; align-items: baseline;
    border-bottom: 3px solid #12233d; padding-bottom: 4px;
    font-family: "Segoe UI", Arial, sans-serif; font-weight: 700;
    font-size: 9.5px; letter-spacing: .17em; text-transform: uppercase;
  }
  .masthead .right { font-weight: 600; letter-spacing: .1em; color: #4a5a72; font-size: 8.5px; }
  h1 {
    font-size: 44px; line-height: 1; letter-spacing: -.022em; font-weight: 700;
    margin: 6px 0 3px; text-align: center; white-space: nowrap;
  }
  .standfirst {
    font-style: italic; font-size: 10.5px; text-align: center; color: #2c3c56; margin: 0 0 5px;
  }
  .ticker {
    display: flex; border-top: 2px solid #12233d; border-bottom: 2px solid #12233d;
    background: #ece4d4; margin-bottom: 7px;
  }
  .tick { flex: 1; padding: 3px 2px; text-align: center; border-right: 1px solid #c3b79f; }
  .tick:last-child { border-right: 0; }
  .tick b { display: block; font-size: 14px; line-height: 1; letter-spacing: -.012em; }
  .tick span {
    display: block; font-family: "Segoe UI", Arial, sans-serif; font-size: 5.9px;
    letter-spacing: .04em; text-transform: uppercase; color: #4a5a72; margin-top: 2px; line-height: 1.1;
  }
  .leads { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 6px; }
  .lead { border-top: 3px solid #8c1d1d; padding-top: 4px; display: flex; flex-direction: column; }
  .lead-kicker {
    font-family: "Segoe UI", Arial, sans-serif; font-size: 8.2px; font-weight: 700;
    letter-spacing: .09em; text-transform: uppercase; color: #8c1d1d;
    display: flex; align-items: center; gap: 5px; margin-bottom: 3px;
  }
  .num {
    display: inline-flex; align-items: center; justify-content: center;
    width: 14px; height: 14px; border-radius: 50%; background: #8c1d1d; color: #f4efe4;
    font-size: 8.5px; font-weight: 700; letter-spacing: 0; flex: none;
  }
  .num.sm { width: 10px; height: 10px; font-size: 6.2px; background: #4a5a72; }
  .tag { margin-left: auto; font-size: 5.9px; letter-spacing: .07em; color: #7b6f59; font-weight: 600; }
  .lead h2 { font-size: 15.8px; line-height: 1.06; letter-spacing: -.014em; margin-bottom: 3px; }
  .lead p { font-size: 8.6px; line-height: 1.23; color: #24334b; }
  .src {
    font-family: "Segoe UI", Arial, sans-serif; font-size: 5.8px; letter-spacing: .04em;
    color: #7b6f59; margin-top: auto; padding-top: 3px; text-transform: uppercase;
  }
  .body { display: grid; grid-template-columns: 1fr 214px; gap: 9px; flex: 1 1 auto; min-height: 0; overflow: hidden; }
  .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px 10px; align-content: space-between; overflow: hidden; }
  .brief { border-top: 1px solid #b9ad95; padding-top: 2px; display: flex; flex-direction: column; }
  .brief-kicker {
    font-family: "Segoe UI", Arial, sans-serif; font-size: 6px; font-weight: 700;
    letter-spacing: .045em; text-transform: uppercase; color: #4a5a72;
    display: flex; align-items: center; gap: 4px; margin-bottom: 2px;
  }
  .brief h3 { font-size: 10px; line-height: 1.03; letter-spacing: -.008em; margin-bottom: 2px; }
  .brief p { font-size: 7.7px; line-height: 1.16; color: #33415a; }
  .brief .src { font-size: 5.7px; padding-top: 2px; }
  .rail { display: flex; flex-direction: column; gap: 7px; min-height: 0; }
  .panel { border: 1.5px solid #b9ad95; background: #efe7d7; padding: 5px 6px; }
  .panel h4 {
    font-family: "Segoe UI", Arial, sans-serif; font-size: 7px; font-weight: 800;
    letter-spacing: .1em; text-transform: uppercase; color: #8c1d1d; margin-bottom: 4px;
  }
  .worldmap { width: 100%; height: auto; display: block; border: 1px solid #b9ad95; }
  .timeline { list-style: none; }
  .timeline li {
    display: grid; grid-template-columns: 32px 1fr; gap: 4px;
    font-size: 7.2px; line-height: 1.2; padding: 1.4px 0; border-bottom: 1px dotted #c9bda4;
  }
  .timeline li:last-child { border-bottom: 0; }
  .timeline b {
    font-family: "Segoe UI", Arial, sans-serif; font-size: 6.1px; font-weight: 700;
    color: #8c1d1d; letter-spacing: .02em;
  }
  .check { border: 1.5px solid #8c1d1d; background: #f0e7d6; padding: 5px 6px; margin-top: auto; }
  .check h4 {
    font-family: "Segoe UI", Arial, sans-serif; font-size: 7px; font-weight: 800;
    letter-spacing: .1em; text-transform: uppercase; color: #8c1d1d; margin-bottom: 3px;
  }
  .check .kept { font-size: 6.9px; line-height: 1.22; color: #12233d; margin-bottom: 2px; }
  .check ul { list-style: none; }
  .check li { font-size: 6.5px; line-height: 1.2; color: #4a5a72; }
  .check li::before { content: "\\2715 "; color: #8c1d1d; font-weight: 700; }
  footer {
    margin-top: auto; flex: none; border-top: 2px solid #12233d; padding-top: 4px;
    display: flex; justify-content: space-between; gap: 14px;
    font-family: "Segoe UI", Arial, sans-serif;
  }
  footer .rule { font-size: 6.8px; color: #8c1d1d; font-weight: 700; letter-spacing: .03em; }
  footer .sources { font-size: 5.9px; color: #7b6f59; letter-spacing: .02em; text-align: right; }
</style></head>
<body>
  <div class="masthead">
    <div>THE WORLD IN ONE DAY</div>
    <div class="right">${DAY.stories} STORIES &middot; ${regionRows.length} REGIONS &middot; ALL FROM THIS ONE DAY</div>
  </div>

  <h1>${DAY.weekday} ${DAY.date}</h1>
  <div class="standfirst">${STAND.map(esc).join(' &middot; ')}</div>

  <div class="ticker">
    ${TICKER.map((t) => `<div class="tick"><b>${esc(t.value)}</b><span>${esc(t.label)}</span></div>`).join('')}
  </div>

  <div class="leads">${LEADS.map(leadHtml).join('')}</div>

  <div class="body">
    <div class="grid">${STORIES.map(briefHtml).join('')}</div>
    <div class="rail">
      <div class="panel">
        <h4>Where it happened</h4>
        ${WORLD}
      </div>
      <div class="panel">
        <h4>The day, by the clock (UTC)</h4>
        <ul class="timeline">
          ${TIMELINE.map((t) => `<li><b>${esc(t.time)}</b><span>${esc(t.text)}</span></li>`).join('')}
        </ul>
      </div>
      <div class="panel">
        <h4>By region</h4>
        <ul class="timeline">
          ${regionRows.map((r) => `<li><b>${r.count}</b><span>${esc(r.name)}</span></li>`).join('')}
        </ul>
      </div>
      <div class="check">
        <h4>Date check</h4>
        <div class="kept">&#10003; ${esc(DATE_CHECK.kept)}</div>
        <ul>${DATE_CHECK.dropped.map((d) => `<li>${esc(d)}</li>`).join('')}</ul>
      </div>
    </div>
  </div>

  <footer>
    <div class="rule">${esc(FOOTER.rule)}</div>
    <div class="sources">${esc(FOOTER.sources)}</div>
  </footer>
</body></html>`;

const out = process.argv[2] ?? 'entry.png';
const dir = mkdtempSync(join(tmpdir(), 'wiod-'));
const pagePath = join(dir, 'page.html');
const shotPath = join(dir, 'shot.png');
writeFileSync(pagePath, html, 'utf8');

execFileSync(
  CHROME,
  [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    '--window-size=1024,1024',
    '--screenshot=' + shotPath,
    '--no-sandbox',
    '--virtual-time-budget=2000',
    pathToFileURL(pagePath).href,
  ],
  { stdio: 'ignore' }
);

copyFileSync(shotPath, out);
rmSync(dir, { recursive: true, force: true });
console.log('wrote', out);
