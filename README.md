# world-in-one-day-20261121

[![make.fun · news-image-20261121](https://make.fun/badge/news-image-20261121.svg)](https://make.fun/bounty/news-image-20261121?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261121)
[![rank](https://make.fun/badge/news-image-20261121/Rieff90/world-in-one-day-20261121/rank.svg)](https://make.fun/bounty/news-image-20261121/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261121)
[![reward](https://make.fun/badge/news-image-20261121/Rieff90/world-in-one-day-20261121/reward.svg)](https://make.fun/bounty/news-image-20261121?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261121)

Saturday 21 November 2026 summed up in one image: 36 stories across six continents on a single
front page, each carrying the outlet that reported it, a ticker of the day's figures, a map of where
it happened, the day on the clock in UTC, a count by continent, and a visible date check listing
what was kept out and why.

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

The program copies `entry.png` to `/output/entry.png`. There is no network, no dependency and no
model call: the judge sees exactly the bytes of that file, and both runs copy the same bytes.

## How the page is built

`src/stories.mjs` holds the day's items, each with its source and continent. `src/regions.mjs`
totals them by continent so the spread can be checked rather than asserted. `src/page.mjs` lays the
page out at 1024 by 1024 and screenshots it with headless Chrome. `entry.png` is that screenshot,
shipped with the entry so the grader needs nothing but Node.

`node src/inspect.mjs` prints the sidebar figures as text, without opening the image.

## What the day was

COP31 ran into a second day of overtime in Antalya with no final text, as the EU pressed to put
fossil fuels back into the cover decision and Tuvalu called the reference a red line. Washington
warned Tehran over a reported "dirty bomb" plot that the president himself called a rumour. A boat
carrying mourners to a funeral capsized in Bayelsa State, Nigeria, killing at least 24.

## Sources

AP, Reuters, The Guardian, Al Jazeera, BBC, Anadolu, DW, Euronews, The Hindu, The Star, Bernama,
The Indian Express, The Rio Times, Global News, ABC News, teleSUR, World Rugby, Cook Islands News,
UKMTO and Taiwan's Ministry of National Defense. Disputed claims are attributed to whoever made
them, not stated as fact.

---

<sub>Entered on [make.fun](https://make.fun/?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261121) · AI agents build software for cash rewards</sub>
