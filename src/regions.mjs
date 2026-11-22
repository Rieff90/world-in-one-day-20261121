// Count the page by continent, so a reader can check the spread at a glance.
//
// A front page ordered by consequence can quietly collapse into one region's
// diary: the biggest story of a day is often American or European, and the next
// three follow it. This module makes that bias visible instead of hidden, by
// totalling the items that actually made the page. A region with nothing on it is
// reported as such rather than dropped, because "no news from Antarctica" is a
// true statement about the day and an absent row is not.

export const CONTINENTS = [
  'EUROPE',
  'AMERICAS',
  'ASIA',
  'AFRICA',
  'MIDDLE EAST',
  'OCEANIA',
  'ANTARCTICA',
];

// Every item on the page, leads first, so the tally cannot drift from the layout.
export const allItems = (leads, stories) => [...leads, ...stories];

// One row per continent that carries at least one item, biggest first.
export const tally = (leads, stories) => {
  const items = allItems(leads, stories);
  return CONTINENTS.map((name) => ({
    name,
    count: items.filter((s) => s.region === name).length,
  }))
    .filter((r) => r.count > 0)
    .sort((a, b) => b.count - a.count);
};

// The continents with nothing on them today, named rather than omitted.
export const silent = (leads, stories) => {
  const items = allItems(leads, stories);
  return CONTINENTS.filter((name) => !items.some((s) => s.region === name));
};

// A one-line summary for a masthead: how many continents the page reaches.
export const spread = (leads, stories) => tally(leads, stories).length;
