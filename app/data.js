// NorthStar Statistics — the figures behind the site. Every number below was
// taken from a public release and is labelled with its source and reference
// period on the page where it appears. Nothing here is estimated by us and
// nothing is fetched at run time: the site works fully offline.

export const SOURCES = {
  statcanPop: 'Statistics Canada, Demographic Estimates (quarterly), Table 17-10-0009-01',
  statcanCpi: 'Statistics Canada, Consumer Price Index: Annual review 2024, Table 18-10-0005-01',
  worldBank: 'World Bank, World Development Indicators (2024)',
  statcanLife: 'Statistics Canada, Table 13-10-0837-01 (life tables)',
  statcanHealth: 'Statistics Canada, Health of Canadians 2024 (82-570-X)',
  owid: 'Our World in Data, Canada country profile (UN World Population Prospects)',
  statcanLfs: 'Statistics Canada, Labour Force Survey (monthly)',
};

export const HEADLINE = [
  {
    id: 'population', route: '#/population', kicker: 'Population',
    value: '41,288,599', label: 'people on 1 July 2024',
    delta: '+0.6% in one quarter', tone: 'up',
    search: 'population people residents growth census',
  },
  {
    id: 'gdp', route: '#/economy', kicker: 'Economy',
    value: 'US$2.24 trillion', label: 'GDP, current US$, 2024',
    delta: '+1.6% real growth in 2024', tone: 'up',
    search: 'gdp economy growth dollars output',
  },
  {
    id: 'cpi', route: '#/prices', kicker: 'Prices',
    value: '2.4%', label: 'CPI inflation, annual average 2024',
    delta: 'down from 3.9% in 2023', tone: 'down',
    search: 'inflation cpi prices cost of living',
  },
  {
    id: 'unemployment', route: '#/labour', kicker: 'Jobs',
    value: '6.7%', label: 'unemployment rate, December 2024',
    delta: 'up from 6.1% in March 2024', tone: 'down',
    search: 'unemployment jobs employment labour workforce',
  },
  {
    id: 'life', route: '#/health', kicker: 'Health',
    value: '81.7 years', label: 'life expectancy at birth, 2023',
    delta: 'up from 81.3 years in 2022', tone: 'up',
    search: 'life expectancy health deaths births longevity',
  },
  {
    id: 'income', route: '#/economy', kicker: 'Living standards',
    value: 'US$54,340', label: 'GDP per person, 2024',
    delta: '9th-largest economy in the world', tone: 'flat',
    search: 'income per capita living standards gdp per person',
  },
];

// Quarterly population estimates, 2024 (Statistics Canada).
export const POPULATION_QUARTERS = [
  { period: '1 Apr 2024', value: 41012563 },
  { period: '1 Jul 2024', value: 41288599 },
  { period: '1 Oct 2024', value: 41465298 },
];

// Annual average CPI change, % (Statistics Canada).
export const CPI_ANNUAL = [
  { year: '2019', value: 1.9 },
  { year: '2020', value: 0.7 },
  { year: '2021', value: 3.4 },
  { year: '2022', value: 6.8 },
  { year: '2023', value: 3.9 },
  { year: '2024', value: 2.4 },
];

// Monthly CPI, year-over-year % in late 2024 (Statistics Canada).
export const CPI_MONTHLY_2024 = [
  { period: 'Sep 2024', value: 1.6 },
  { period: 'Oct 2024', value: 2.0 },
  { period: 'Nov 2024', value: 1.9 },
  { period: 'Dec 2024', value: 1.8 },
];

// Unemployment rate, seasonally adjusted, % (Statistics Canada, Labour Force Survey).
export const UNEMPLOYMENT = [
  { period: '2023 average', value: 5.4 },
  { period: 'Mar 2024', value: 6.1 },
  { period: 'Nov 2024', value: 6.8 },
  { period: 'Dec 2024', value: 6.7 },
  { period: 'Jan 2025', value: 6.6 },
  { period: 'Feb 2025', value: 6.6 },
  { period: 'Mar 2025', value: 6.7 },
];

// Life expectancy at birth, years (Statistics Canada life tables).
export const LIFE_EXPECTANCY = [
  { year: '2019', value: 82.22 },
  { year: '2020', value: 81.58 },
  { year: '2021', value: 81.5 },
  { year: '2022', value: 81.13 },
  { year: '2023', value: 81.68 },
  { year: '2024', value: 82.16 },
];

// Life expectancy at birth by province, 2024, years (Statistics Canada).
export const LIFE_BY_PROVINCE = [
  { province: 'Ontario', both: 82.85, male: 80.68, female: 84.99 },
  { province: 'Quebec', both: 82.65, male: 80.9, female: 84.39 },
  { province: 'British Columbia', both: 82.58, male: 80.16, female: 85.07 },
  { province: 'Alberta', both: 81.53, male: 79.32, female: 83.87 },
  { province: 'Nova Scotia', both: 80.7, male: 78.59, female: 82.85 },
  { province: 'New Brunswick', both: 80.44, male: 78.44, female: 82.49 },
  { province: 'Saskatchewan', both: 79.66, male: 77.43, female: 82.05 },
  { province: 'Manitoba', both: 79.29, male: 76.93, female: 81.85 },
];

// Economy snapshot (World Bank, World Development Indicators, 2024).
export const ECONOMY = {
  gdpUsd: 2243636826634,
  gdpPerCapitaUsd: 54340,
  gdpGrowthPct: 1.6,
  gdpRank: 9,
};

// Demography snapshot, 2023 (UN World Population Prospects via Our World in Data).
export const DEMOGRAPHY_2023 = {
  medianAge: 40.3,
  fertilityRate: 1.35,
  births: 356700,
  deaths: 311800,
};

export const RELEASES = [
  {
    date: '21 Jan 2025', tag: 'Prices',
    text: 'Consumer prices rose 2.4% on an annual average basis in 2024, down from 3.9% in 2023 — the smallest yearly rise since 2021.',
  },
  {
    date: '17 Dec 2024', tag: 'Population',
    text: 'Canada’s population reached an estimated 41,465,298 on 1 October 2024, up 176,699 (+0.4%) from 1 July.',
  },
  {
    date: '25 Sep 2024', tag: 'Population',
    text: 'Canada’s population reached an estimated 41,288,599 on 1 July 2024 — passing 41 million for the first time in the spring.',
  },
  {
    date: '19 Jun 2024', tag: 'Population',
    text: 'Canada passed 41 million people on 1 April 2024 (41,012,563), less than a year after passing 40 million on 16 June 2023.',
  },
  {
    date: '5 Mar 2025', tag: 'Health',
    text: 'Life expectancy at birth rose for the first time in three years, from 81.3 years in 2022 to 81.7 years in 2023.',
  },
];

export const TOPICS = [
  { route: '#/population', title: 'Population', text: 'How many people live in Canada, how fast the population is growing, and the age structure behind it.' },
  { route: '#/economy', title: 'Economy', text: 'The size of the economy, output per person and growth — Canada in the world ranking.' },
  { route: '#/prices', title: 'Prices', text: 'Inflation year by year and month by month: what the CPI actually did after the 2022 peak.' },
  { route: '#/labour', title: 'Jobs', text: 'The unemployment rate, month by month, and what it means for people looking for work.' },
  { route: '#/health', title: 'Health', text: 'How long Canadians live, how that changed through the pandemic, and where people live longest.' },
  { route: '#/regions', title: 'Regions', text: 'The provinces side by side on life expectancy — and how to read the gaps between them.' },
];

// Build a CSV string from a {columns, rows} table description.
export function toCsv(columns, rows) {
  const cell = (v) => `"${String(v).replaceAll('"', '""')}"`;
  const lines = [columns.map(cell).join(',')];
  for (const row of rows) lines.push(row.map(cell).join(','));
  return lines.join('\r\n');
}
