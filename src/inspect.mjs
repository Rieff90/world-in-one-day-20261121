// Print the sidebar fragments exactly as page.mjs builds them, so a claim about
// what the image shows can be checked against text instead of squinting at a PNG.
//
//   node src/inspect.mjs

import { LEADS, STORIES, DATE_CHECK } from './stories.mjs';
import { tally, silent } from './regions.mjs';

const rows = tally(LEADS, STORIES);

console.log('BY REGION');
for (const r of rows) console.log(`  ${String(r.count).padStart(3)}  ${r.name}`);
const none = silent(LEADS, STORIES);
console.log(`  silent: ${none.length ? none.join(', ') : 'none'}`);

console.log('\nDATE CHECK');
console.log('  kept:', DATE_CHECK.kept);
for (const d of DATE_CHECK.dropped) console.log('  dropped:', d);

console.log('\ntotals');
console.log('  items:', LEADS.length + STORIES.length, '(leads', LEADS.length, '+ briefs', STORIES.length, ')');
console.log('  regions:', rows.length);
