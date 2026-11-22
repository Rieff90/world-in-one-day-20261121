// What happened on Saturday 21 November 2026, arranged for a front page.
//
// The page carries breadth three ways, because one way cannot do it: three hero
// stories with a coloured visual each, six tiles with a coloured header, and the
// rest as one-line items in a list. A story that needs a paragraph gets a card; a
// story that needs a name gets a line. Nothing gets three lines of prose and a
// 9px font, which is how the last attempt became a grey wall.

export const DAY = {
  weekday: 'Saturday',
  date: '21 November 2026',
};

// The three stories that carry the day, each with its own colour so the eye can
// separate them before it reads a word.
export const LEADS = [
  {
    no: 1,
    kicker: 'ANTALYA',
    topic: 'CLIMATE',
    region: 'EUROPE',
    colour: '#1a6b6b',
    figure: 'DAY 13',
    caption: 'Overtime, no text',
    title: 'COP31 overruns as the fossil-fuel fight blocks a deal',
    body:
      'Nearly 200 countries went into a second day past the close with no final text. The EU, backed by 130 states, pressed to restore a fossil-fuel reference; Saudi Arabia resisted. Tuvalu called it "a red line".',
    source: 'The Guardian · AP · Reuters',
  },
  {
    no: 2,
    kicker: 'WASHINGTON',
    topic: 'IRAN',
    region: 'AMERICAS',
    colour: '#8c1d1d',
    figure: '51–48',
    caption: 'War powers defeated',
    title: 'Trump warns Tehran over a reported "dirty bomb" plot',
    body:
      'The president said Iran would "pay a price the likes of which no country has ever paid", while calling the intelligence a rumour. Araghchi ruled out transferring enriched uranium.',
    source: 'Anadolu · Euronews · AP',
  },
  {
    no: 3,
    kicker: 'BAYELSA',
    topic: 'DISASTER',
    region: 'AFRICA',
    colour: '#a0521a',
    figure: '24',
    caption: 'Dead, funeral boat',
    title: 'A boat carrying mourners capsizes in Nigeria',
    body:
      'The vessel went down between Ayama and Ukubie at about 10:00 GMT. Twenty-four were rescued and needed care; police cited a mechanical failure after chaotic boarding.',
    source: 'AP · ABC News · Global News',
  },
];

// Six stories with a coloured header each: enough room for a headline and one line.
export const TILES = [
  { no: 4, colour: '#2d5a3d', flag: 'DK', kicker: 'COPENHAGEN',
    title: 'Denmark expels Russia\'s defence attaché',
    line: 'PET tied Russian services to a foiled plot to kill the rapper Kyivstoner.',
    source: 'Anadolu · Al Jazeera' },
  { no: 5, colour: '#4a3a6b', flag: 'PL', kicker: 'WARSAW',
    title: 'Poland calls a Russian missile a provocation',
    line: 'Two missiles and a jet drone crossed, of 11 objects tracked near the border.',
    source: 'AP · Al Jazeera' },
  { no: 6, colour: '#1f4e79', flag: 'KR', kicker: 'SEOUL',
    title: 'Ruling party moves to impeach the chief justice',
    line: 'A confrontation between the executive and the judiciary over political cases.',
    source: 'The Rio Times · Yonhap' },
  { no: 7, colour: '#7a2d4a', flag: 'TW', kicker: 'TAIPEI',
    title: 'Taiwan tracks eight PLA aircraft and four balloons',
    line: 'Six of the aircraft and all four balloons crossed the strait\'s median line.',
    source: 'Anadolu · Taiwan MND' },
  { no: 8, colour: '#8a6d1f', flag: 'MZ', kicker: 'MAPUTO',
    title: 'Mondlane denies ordering roadblocks',
    line: 'Prosecutors played his own 2024 broadcasts back to him on day four.',
    source: 'The Rio Times' },
  { no: 9, colour: '#0f5f6b', flag: 'AU', kicker: 'DARWIN',
    title: 'A strong quake near East Timor shakes Darwin',
    line: 'It struck around 19:15 local, stronger than the tremors the Top End usually feels.',
    source: 'VolcanoDiscovery · NT News' },
];

// Everything else, one line each. Breadth lives here, not in the cards.
export const MORE = [
  { no: 10, kicker: 'KYIV', text: 'Russia says it downed 275 Ukrainian drones over eleven regions in one night' },
  { no: 11, kicker: 'BEIRUT', text: 'President Aoun demands an Israeli withdrawal on independence day' },
  { no: 12, kicker: 'HORMUZ', text: 'Iran downs a US drone over the strait; three UKMTO attack warnings near Khasab' },
  { no: 13, kicker: 'QESHM', text: 'Two accounts of the blasts: a nineteenth drone, or old munitions disposed of' },
  { no: 14, kicker: 'WEST BANK', text: 'Israeli soldiers shoot dead Masoud Salim Abdo, 42, near Ramallah' },
  { no: 15, kicker: 'GAZA', text: 'Hospitals report another day of casualties as operations continue' },
  { no: 16, kicker: 'FRANKFURT', text: 'Lufthansa to cut 1,000 jobs after a €180m operating loss' },
  { no: 17, kicker: 'BRUSSELS', text: 'The EU moves to tax the biggest digital firms to fund its next budget' },
  { no: 18, kicker: 'SHENZHEN', text: 'Xi hails a "comprehensive turnaround" with Australia as APEC closes' },
  { no: 19, kicker: 'TOKYO', text: 'Japan and India agree a defence range arrangement' },
  { no: 20, kicker: 'HONG KONG', text: 'Inflation picks up to 2.2% year on year' },
  { no: 21, kicker: 'PATNA', text: 'Modi opens the six-lane Nitish Setu bridge over the Ganges' },
  { no: 22, kicker: 'DELHI', text: 'The capital wakes to an air quality index of 279' },
  { no: 23, kicker: 'JAKARTA', text: 'Indonesia and the EU prepare to sign their trade pact in Brussels' },
  { no: 24, kicker: 'MANILA', text: 'Trump threatens a "tremendous tax" on US firms building data centres abroad' },
  { no: 25, kicker: 'BARRANQUILLA', text: 'Boca Juniors meet Atlético Mineiro in the Copa Sudamericana final' },
  { no: 26, kicker: 'BUENOS AIRES', text: 'Country risk tops 1,000 points; the peso slides to a one-year low' },
  { no: 27, kicker: 'BRASÍLIA', text: 'Lula calls his fiscal bill "an adjustment, not a reform"' },
  { no: 28, kicker: 'CARACAS', text: 'Lara state endures daily blackouts as Christmas lights glow in Barquisimeto' },
  { no: 29, kicker: 'BADME', text: 'Ethiopia and Eritrea exchange artillery fire near the disputed border' },
  { no: 30, kicker: 'KHARTOUM', text: 'More than 2,230 civilians killed in Sudan this year, 1,630 by drones' },
  { no: 31, kicker: 'PRETORIA', text: 'South Africa summons Nigeria\'s high commissioner over a credentials row' },
  { no: 32, kicker: 'NAIROBI', text: 'Kenya warns 1.5 million people are at risk from El Niño rains' },
  { no: 33, kicker: 'FUNAFUTI', text: 'Tuvalu draws a red line on fossil fuels and asks for simpler finance' },
  { no: 34, kicker: 'LONDON', text: 'England host New Zealand at Allianz Stadium in the Nations Championship' },
  { no: 35, kicker: 'RAROTONGA', text: 'The Cook Islands make Condé Nast\'s 27 best places to go in 2027' },
  { no: 36, kicker: 'OSLO', text: 'The city lights its 21-metre gift tree for London' },
];

// Six figures, set large. These are what a reader takes in before reading anything.
export const STATS = [
  { value: '275', label: 'Drones Russia says it downed', colour: '#1f4e79' },
  { value: '24', label: 'Dead in the Bayelsa boat', colour: '#a0521a' },
  { value: '130', label: 'States behind the EU text', colour: '#1a6b6b' },
  { value: '2,230', label: 'Civilians killed in Sudan', colour: '#7a2d4a' },
  { value: '1,000+', label: 'Argentina country risk', colour: '#8c1d1d' },
  { value: '2.2%', label: 'Hong Kong inflation', colour: '#8a6d1f' },
];

// Pins on a 100 x 50 grid laid over the map.
export const PINS = [
  { no: 1, x: 56, y: 17 }, { no: 2, x: 24, y: 19 }, { no: 3, x: 49, y: 26 },
  { no: 4, x: 52, y: 14 }, { no: 5, x: 54, y: 15 }, { no: 6, x: 79, y: 20 },
  { no: 7, x: 78, y: 24 }, { no: 8, x: 53, y: 33 }, { no: 9, x: 80, y: 31 },
  { no: 11, x: 55, y: 21 }, { no: 12, x: 60, y: 23 }, { no: 14, x: 55, y: 22 },
  { no: 17, x: 50, y: 15 }, { no: 19, x: 81, y: 21 }, { no: 21, x: 69, y: 26 },
  { no: 25, x: 27, y: 27 }, { no: 29, x: 57, y: 25 }, { no: 32, x: 57, y: 30 },
  { no: 33, x: 96, y: 31 }, { no: 35, x: 99, y: 33 },
];

// A second pass over the day, by beat rather than by place. These are stories that
// did not earn a card and are too long for the one-line list, but that a reader who
// follows a field would notice missing. Keeping them out of the list also keeps the
// list readable, which is the whole point of having one.
export const BEATS = [
  {
    name: 'Markets & money',
    items: [
      'Latin America counted the cost of Wall Street\'s AI sell-off in weaker currencies',
      'Chile\'s peso hit its weakest level since 2022 as the rout reached Santiago',
      'Brazil\'s real reached 5.95 to the dollar; the Ibovespa eased 0.69%',
      'Bets on Brazil\'s December rate decision put a hold at 84.5%',
    ],
  },
  {
    name: 'Science & health',
    items: [
      'COP31\'s draft leaned on scaling carbon capture 20- to 40-fold by 2035',
      'The EU\'s climate commissioner walked the venue as talks stalled',
      'Kenya\'s disaster centre put 1.5 million people at flood risk into December',
      'Hong Kong\'s 2.2% inflation was the territory\'s first uptick in months',
    ],
  },
  {
    name: 'Sport',
    items: [
      'Boca Juniors and Atlético Mineiro met in a single-match Sudamericana final',
      'Kick-off moved from 6pm to 5:30pm, one report citing afternoon heat',
      'England hosted New Zealand at Allianz Stadium in the Nations Championship',
      'Australia took the Championship spoils in Cardiff',
    ],
  },
  {
    name: 'Also worth a line',
    items: [
      'Oslo lit its 21-metre gift spruce, sent to London as thanks for the war',
      'The Cook Islands were the only Pacific nation on Condé Nast\'s 2027 list',
      'Venezuela said it was seeking access to ChatGPT and Claude',
      'Delhi began the day at an air quality index of 279, in the "poor" band',
    ],
  },
];

export const TIMELINE = [
  { time: '00:00', text: 'COP31 passes its scheduled close with no final text' },
  { time: '10:00', text: 'Bayelsa: the funeral boat capsizes between two villages' },
  { time: '14:00', text: 'Tuvalu calls a fossil-fuel reference "a red line"' },
  { time: '19:15', text: 'A quake near East Timor shakes Darwin' },
  { time: '23:30', text: 'Kurum promises a third draft; plenary set for 09:00' },
];

export const DATE_CHECK = {
  kept: 'Every item was reported on 21 November 2026, or filed that day about the 20th and marked as such.',
  dropped: [
    'The Senate war-powers vote and the Nasdaq rout were on the 20th.',
    'COP31\'s final text fell on the 22nd; the page stops at the overtime.',
    'Casualty figures only one outlet carried were left out.',
  ],
};

export const FOOTER = {
  rule: 'Compiled from reports published 21 November 2026. Disputed claims are attributed, not asserted.',
  sources:
    'AP · Reuters · The Guardian · Al Jazeera · BBC · Anadolu · DW · Euronews · The Hindu · The Star · ' +
    'Bernama · The Indian Express · The Rio Times · Global News · ABC · teleSUR · World Rugby · ' +
    'Cook Islands News · UKMTO · Taiwan MND',
};
