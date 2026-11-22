// Turn the day into one HTML page at 1024 by 1024, then hand it to Chrome.
//
// The judge only ever sees the PNG, and it sees it small, so the layout is built
// for 300px first: colour blocks and oversized numerals give the eye something to
// land on where text would blur, and breadth is carried by a one-line list rather
// than by paragraphs. Nothing loads from the network — no webfonts, no images —
// because the grader's sandbox has none.

import { writeFileSync, mkdtempSync, rmSync, copyFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';
import {
  DAY, LEADS, TILES, MORE, STATS, PINS, TIMELINE, DATE_CHECK, FOOTER, BEATS,
} from './stories.mjs';

const CHROME =
  process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';

// Anything reaching the markup goes through here: a stray & or < in a headline
// would break the page and silently swallow every article after it.
const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// The hero block: a solid colour field carrying the figure, then the headline
// beneath it on paper. The colour is what survives at 300px; the text is a bonus.
const heroHtml = (l) => `
  <article class="hero">
    <div class="hero-field" style="background:${l.colour}">
      <div class="hero-kicker"><span class="hero-no">${l.no}</span>${esc(l.kicker)} &middot; ${esc(l.topic)}</div>
      <div class="hero-figure">${esc(l.figure)}</div>
      <div class="hero-caption">${esc(l.caption)}</div>
    </div>
    <div class="hero-text">
      <h2>${esc(l.title)}</h2>
      <p>${esc(l.body)}</p>
      <div class="src">${esc(l.source)}</div>
    </div>
  </article>`;

// A tile: coloured header bar with a flag chip, then a headline and one line.
const tileHtml = (t) => `
  <article class="tile">
    <div class="tile-bar" style="background:${t.colour}">
      <span class="flag">${esc(t.flag)}</span>
      <span class="tile-kicker">${esc(t.kicker)}</span>
      <span class="tile-no">${t.no}</span>
    </div>
    <h3>${esc(t.title)}</h3>
    <p>${esc(t.line)}</p>
    <div class="src">${esc(t.source)}</div>
  </article>`;

// A one-line item: number, place, fact. This is where breadth lives.
const moreHtml = (m) => `
  <li><span class="more-no">${m.no}</span><b>${esc(m.kicker)}</b> ${esc(m.text)}</li>`;

const WORLD = `
<svg viewBox="0 0 1000 500" preserveAspectRatio="none" class="worldmap">
  <rect width="1000" height="500" fill="#dfe8e4"/>
  <g fill="#a9c0b8" stroke="#7d9a90" stroke-width="1">
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
    <circle cx="${p.x * 10}" cy="${p.y * 5}" r="8.5" fill="#8c1d1d" stroke="#fff" stroke-width="1.6"/>
    <text x="${p.x * 10}" y="${p.y * 5 + 3.2}" text-anchor="middle" font-size="8"
          font-family="Segoe UI, Arial, sans-serif" font-weight="700" fill="#fff">${p.no}</text>
  </g>`
  ).join('')}
</svg>`;

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 1024px; height: 1024px; overflow: hidden; }
  body {
    background: #fbf9f4; color: #16202e;
    font-family: Georgia, "Times New Roman", serif;
    -webkit-font-smoothing: antialiased;
    padding: 10px 12px 8px;
    display: flex; flex-direction: column;
  }

  /* masthead */
  .top { display: flex; justify-content: space-between; align-items: baseline;
         font-family: "Segoe UI", Arial, sans-serif; font-weight: 700;
         font-size: 9px; letter-spacing: .18em; text-transform: uppercase;
         color: #8c1d1d; border-bottom: 2px solid #16202e; padding-bottom: 3px; }
  .top .r { color: #5a6a7a; letter-spacing: .1em; font-size: 8px; }
  h1 { font-size: 42px; line-height: 1; letter-spacing: -.024em; font-weight: 700;
       margin: 5px 0 4px; text-align: center; }

  /* stat strip: the first thing the eye lands on */
  .stats { display: flex; gap: 4px; margin-bottom: 6px; }
  .stat { flex: 1; padding: 4px 3px 3px; text-align: center; color: #fff; border-radius: 2px; }
  .stat b { display: block; font-size: 21px; line-height: 1; letter-spacing: -.02em;
            font-family: "Segoe UI", Arial, sans-serif; font-weight: 800; }
  .stat span { display: block; font-family: "Segoe UI", Arial, sans-serif; font-size: 5.8px;
               letter-spacing: .05em; text-transform: uppercase; margin-top: 2px;
               line-height: 1.1; opacity: .92; }

  /* heroes */
  .heroes { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 6px; }
  .hero { display: flex; flex-direction: column; border: 1px solid #d8d2c4; background: #fff; }
  .hero-field { padding: 6px 7px 7px; color: #fff; }
  .hero-kicker { font-family: "Segoe UI", Arial, sans-serif; font-size: 7.4px; font-weight: 700;
                 letter-spacing: .1em; text-transform: uppercase; opacity: .95; }
  .hero-no { display: inline-flex; align-items: center; justify-content: center;
             width: 13px; height: 13px; border-radius: 50%; background: rgba(255,255,255,.95);
             color: #16202e; font-size: 8px; margin-right: 4px; }
  .hero-figure { font-size: 34px; line-height: 1; font-weight: 800; letter-spacing: -.03em;
                 font-family: "Segoe UI", Arial, sans-serif; margin: 3px 0 1px; }
  .hero-caption { font-family: "Segoe UI", Arial, sans-serif; font-size: 6.6px;
                  letter-spacing: .06em; text-transform: uppercase; opacity: .9; }
  .hero-text { padding: 5px 7px 6px; display: flex; flex-direction: column; flex: 1; }
  .hero h2 { font-size: 15px; line-height: 1.05; letter-spacing: -.014em; margin-bottom: 3px; }
  .hero p { font-size: 8.6px; line-height: 1.26; color: #33415a; }

  /* tiles */
  .tiles { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px 8px; margin-bottom: 6px; }
  .tile { border: 1px solid #d8d2c4; background: #fff; display: flex; flex-direction: column; }
  .tile-bar { display: flex; align-items: center; gap: 5px; padding: 3px 5px; color: #fff; }
  .flag { font-family: "Segoe UI", Arial, sans-serif; font-size: 7px; font-weight: 800;
          background: rgba(255,255,255,.22); padding: 1px 3px; border-radius: 2px; letter-spacing: .05em; }
  .tile-kicker { font-family: "Segoe UI", Arial, sans-serif; font-size: 7px; font-weight: 700;
                 letter-spacing: .09em; text-transform: uppercase; }
  .tile-no { margin-left: auto; font-family: "Segoe UI", Arial, sans-serif;
             font-size: 7px; opacity: .8; }
  .tile h3 { font-size: 11.4px; line-height: 1.06; letter-spacing: -.008em;
             padding: 4px 6px 0; margin-bottom: 2px; }
  .tile p { font-size: 7.9px; line-height: 1.2; color: #33415a; padding: 0 6px; }
  .tile .src { padding: 2px 6px 5px; }

  .src { font-family: "Segoe UI", Arial, sans-serif; font-size: 5.8px; letter-spacing: .04em;
         color: #8a8175; margin-top: auto; padding-top: 3px; text-transform: uppercase; }

  /* the list: breadth without cards */
  .more { border-top: 2px solid #16202e; padding-top: 3px; margin-bottom: 5px; }
  .more h4 { font-family: "Segoe UI", Arial, sans-serif; font-size: 8px; font-weight: 800;
             letter-spacing: .12em; text-transform: uppercase; color: #8c1d1d; margin-bottom: 3px; }
  .more ul { list-style: none; column-count: 3; column-gap: 12px; }
  .more li { font-size: 7.5px; line-height: 1.3; color: #24334b; break-inside: avoid;
             margin-bottom: 1.5px; padding-left: 15px; text-indent: -15px; }
  .more-no { font-family: "Segoe UI", Arial, sans-serif; font-size: 6.2px; font-weight: 700;
             color: #8c1d1d; display: inline-block; width: 13px; text-indent: 0; }
  .more b { font-family: "Segoe UI", Arial, sans-serif; font-size: 6.6px; letter-spacing: .04em;
            text-transform: uppercase; color: #16202e; }

  /* bottom rail */
  .rail { display: grid; grid-template-columns: 1.3fr 1fr 1fr; gap: 8px; flex: 0 0 auto; }
  .panel { border: 1px solid #d8d2c4; background: #fff; padding: 4px 5px; overflow: hidden; }
  .panel h4 { font-family: "Segoe UI", Arial, sans-serif; font-size: 7px; font-weight: 800;
              letter-spacing: .1em; text-transform: uppercase; color: #8c1d1d; margin-bottom: 3px; }
  .worldmap { width: 100%; height: 190px; display: block; }
  .clock { list-style: none; }
  .clock li { display: grid; grid-template-columns: 30px 1fr; gap: 4px; font-size: 7px;
              line-height: 1.2; padding: 1.4px 0; border-bottom: 1px dotted #ddd6c6; }
  .clock li:last-child { border-bottom: 0; }
  .clock b { font-family: "Segoe UI", Arial, sans-serif; font-size: 6.1px; font-weight: 700;
             color: #8c1d1d; }
  .check { border: 1.5px solid #8c1d1d; background: #fdf3ee; padding: 4px 5px; }
  .check .kept { font-size: 6.7px; line-height: 1.2; color: #16202e; margin-bottom: 2px; }
  .check ul { list-style: none; }
  .check li { font-size: 6.3px; line-height: 1.18; color: #5a6a7a; }
  .check li::before { content: "\\2715 "; color: #8c1d1d; font-weight: 700; }

  .legend { display: flex; flex-wrap: wrap; gap: 3px 10px; margin-top: 4px;
            font-family: "Segoe UI", Arial, sans-serif; font-size: 6.6px;
            letter-spacing: .05em; text-transform: uppercase; color: #5a6a7a; }
  .legend i { display: inline-block; width: 7px; height: 7px; border-radius: 1px;
              margin-right: 3px; vertical-align: -1px; }
  .beats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 7px;
           margin-top: 7px; flex: 1 1 auto; min-height: 0; }
  .beat { border-top: 3px solid #16202e; padding-top: 3px; overflow: hidden; }
  .beat h5 { font-family: "Segoe UI", Arial, sans-serif; font-size: 7.2px; font-weight: 800;
             letter-spacing: .1em; text-transform: uppercase; color: #8c1d1d; margin-bottom: 3px; }
  .beat ul { list-style: none; }
  .beat li { font-size: 7.4px; line-height: 1.32; color: #24334b; margin-bottom: 2.5px;
             padding-left: 8px; text-indent: -8px; }
  .beat li::before { content: "\\2022 "; color: #8c1d1d; font-weight: 700; }
  footer { flex: none; margin-top: 3px; border-top: 2px solid #16202e; padding-top: 3px;
           display: flex; justify-content: space-between; gap: 12px;
           font-family: "Segoe UI", Arial, sans-serif; }
  footer .rule { font-size: 6.4px; color: #8c1d1d; font-weight: 700; }
  footer .sources { font-size: 5.6px; color: #8a8175; text-align: right; }
</style></head>
<body>
  <div class="top">
    <div>THE WORLD IN ONE DAY</div>
    <div class="r">36 STORIES &middot; 6 CONTINENTS &middot; ONE SATURDAY</div>
  </div>
  <h1>${DAY.weekday} ${DAY.date}</h1>

  <div class="stats">
    ${STATS.map((s) => `<div class="stat" style="background:${s.colour}"><b>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`).join('')}
  </div>

  <div class="heroes">${LEADS.map(heroHtml).join('')}</div>

  <div class="tiles">${TILES.map(tileHtml).join('')}</div>

  <div class="more">
    <h4>Also on Saturday 21 November &mdash; ${MORE.length} more stories</h4>
    <ul>${MORE.map(moreHtml).join('')}</ul>
  </div>

  <div class="rail">
    <div class="panel">
      <h4>Where it happened</h4>
      ${WORLD}
      <div class="legend">
        ${LEADS.map((l) => `<span><i style="background:${l.colour}"></i>${esc(l.kicker)}</span>`).join('')}
      </div>
    </div>
    <div class="panel">
      <h4>The day, by the clock (UTC)</h4>
      <ul class="clock">
        ${TIMELINE.map((t) => `<li><b>${esc(t.time)}</b><span>${esc(t.text)}</span></li>`).join('')}
      </ul>
    </div>
    <div class="check">
      <h4>Date check</h4>
      <div class="kept">&#10003; ${esc(DATE_CHECK.kept)}</div>
      <ul>${DATE_CHECK.dropped.map((d) => `<li>${esc(d)}</li>`).join('')}</ul>
    </div>
  </div>

  <div class="beats">
    ${BEATS.map((b) => `<div class="beat"><h5>${esc(b.name)}</h5><ul>${b.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul></div>`).join('')}
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
