// NorthStar Statistics — the router and the wiring. Hash routes, one page per
// section; charts are drawn after each render, and every control on a page
// (search, chart switchers, table sorting, CSV downloads) does what it says.

import {
  HEADLINE, POPULATION_QUARTERS, CPI_ANNUAL, CPI_MONTHLY_2024,
  UNEMPLOYMENT, LIFE_EXPECTANCY, LIFE_BY_PROVINCE, ECONOMY,
  DEMOGRAPHY_2023, SOURCES, toCsv,
} from './data.js';
import { drawLineChart, drawBarChart } from './charts.js';
import {
  home, population, economy, prices, labour, health, regions, sources, notFound,
} from './views.js';

const app = document.getElementById('app');
const searchInput = document.getElementById('site-search');
const navLinks = Array.from(document.querySelectorAll('.mainnav a'));

const ROUTES = {
  '': home, population, economy, prices, labour, health, regions, sources,
};

const CHARTS = {
  population: {
    labels: POPULATION_QUARTERS.map((q) => q.period.replace(' 2024', '')),
    values: POPULATION_QUARTERS.map((q) => q.value),
    format: (v) => (v / 1000000).toFixed(2) + 'm',
    label: 'Population of Canada, quarterly estimates 2024',
    caption: 'Canada’s population, quarterly estimates in 2024. Source: Statistics Canada, Demographic Estimates.',
  },
  cpi: {
    labels: CPI_ANNUAL.map((r) => r.year),
    values: CPI_ANNUAL.map((r) => r.value),
    format: (v) => v.toFixed(1) + '%',
    unit: '%',
    label: 'Annual average CPI inflation, 2019 to 2024',
    caption: 'Annual average change in the Consumer Price Index, 2019–2024. Source: Statistics Canada.',
  },
  life: {
    labels: LIFE_EXPECTANCY.map((r) => r.year),
    values: LIFE_EXPECTANCY.map((r) => r.value),
    format: (v) => v.toFixed(2),
    label: 'Life expectancy at birth, 2019 to 2024',
    caption: 'Life expectancy at birth, both sexes, 2019–2024. Source: Statistics Canada, Table 13-10-0837-01.',
  },
  'cpi-annual': {
    labels: CPI_ANNUAL.map((r) => r.year),
    values: CPI_ANNUAL.map((r) => r.value),
    format: (v) => v.toFixed(1) + '%',
    unit: '%',
    label: 'Annual average CPI inflation, 2019 to 2024',
    caption: 'Annual average change in the Consumer Price Index, 2019–2024.',
  },
  'cpi-monthly': {
    labels: CPI_MONTHLY_2024.map((r) => r.period),
    values: CPI_MONTHLY_2024.map((r) => r.value),
    format: (v) => v.toFixed(1) + '%',
    unit: '%',
    label: 'CPI inflation year over year, September to December 2024',
    caption: 'CPI inflation, year over year, September–December 2024. Source: Statistics Canada.',
  },
};

const CSV_TABLES = {
  population: {
    columns: ['Reference date', 'Population', 'Change on quarter'],
    rows: [
      ['1 April 2024', '41012563', ''],
      ['1 July 2024', '41288599', '+276036 (+0.6%)'],
      ['1 October 2024', '41465298', '+176699 (+0.4%)'],
    ],
    file: 'northstar-population-2024.csv',
    source: SOURCES.statcanPop,
  },
  economy: {
    columns: ['Indicator', 'Value', 'Year', 'Source'],
    rows: [
      ['GDP, current US$', '2243636826634', '2024', SOURCES.worldBank],
      ['GDP per capita, current US$', '54340', '2024', SOURCES.worldBank],
      ['Real GDP growth, %', '1.6', '2024', SOURCES.worldBank],
      ['World rank by GDP', '9', '2024', SOURCES.worldBank],
    ],
    file: 'northstar-economy-2024.csv',
    source: SOURCES.worldBank,
  },
  prices: {
    columns: ['Year', 'CPI annual average change (%)'],
    rows: CPI_ANNUAL.map((r) => [r.year, String(r.value)]),
    file: 'northstar-cpi-2019-2024.csv',
    source: SOURCES.statcanCpi,
  },
  labour: {
    columns: ['Period', 'Unemployment rate (%)'],
    rows: UNEMPLOYMENT.map((u) => [u.period, String(u.value)]),
    file: 'northstar-unemployment.csv',
    source: SOURCES.statcanLfs,
  },
  health: {
    columns: ['Year', 'Life expectancy at birth (years)'],
    rows: LIFE_EXPECTANCY.map((r) => [r.year, String(r.value)]),
    file: 'northstar-life-expectancy-2019-2024.csv',
    source: SOURCES.statcanLife,
  },
  regions: {
    columns: ['Province', 'Life expectancy both sexes', 'Men', 'Women'],
    rows: LIFE_BY_PROVINCE.map((r) => [r.province, String(r.both), String(r.male), String(r.female)]),
    file: 'northstar-life-expectancy-provinces-2024.csv',
    source: SOURCES.statcanLife,
  },
  all: {
    columns: ['Table', 'Indicator', 'Value', 'Year', 'Source'],
    rows: [
      ['population', 'Population 1 Jul 2024', '41288599', '2024', SOURCES.statcanPop],
      ['economy', 'GDP current US$', '2243636826634', '2024', SOURCES.worldBank],
      ['economy', 'GDP per capita current US$', '54340', '2024', SOURCES.worldBank],
      ['prices', 'CPI annual average change %', '2.4', '2024', SOURCES.statcanCpi],
      ['labour', 'Unemployment rate Dec 2024 %', '6.7', '2024', SOURCES.statcanLfs],
      ['health', 'Life expectancy at birth years', '81.68', '2023', SOURCES.statcanLife],
      ['demography', 'Median age years', String(DEMOGRAPHY_2023.medianAge), '2023', SOURCES.owid],
      ['demography', 'Fertility rate', String(DEMOGRAPHY_2023.fertilityRate), '2023', SOURCES.owid],
    ],
    file: 'northstar-all-tables.csv',
    source: 'See Sources page',
  },
};

function drawChartInto(canvasId, key) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const spec = CHARTS[key];
  drawLineChart(canvas, spec.labels, spec.values, {
    format: spec.format, unit: spec.unit || '', label: spec.label,
  });
  const caption = document.getElementById('home-chart-caption') || document.getElementById('cpi-chart-caption');
  if (caption) caption.textContent = spec.caption;
}

function wireSegmented(container, canvasId) {
  const buttons = Array.from(container.querySelectorAll('[data-chart]'));
  for (const button of buttons) {
    button.addEventListener('click', () => {
      for (const b of buttons) b.setAttribute('aria-pressed', b === button ? 'true' : 'false');
      drawChartInto(canvasId, button.dataset.chart);
    });
  }
}

function wireSearch() {
  const count = document.getElementById('search-count');
  const cards = Array.from(document.querySelectorAll('#headline-cards .card'));
  if (!count || cards.length === 0) return;
  const apply = () => {
    const q = searchInput.value.trim().toLowerCase();
    let shown = 0;
    for (const c of cards) {
      const hit = q === '' || (c.dataset.search || '').toLowerCase().includes(q);
      c.classList.toggle('hidden', !hit);
      if (hit) shown += 1;
    }
    count.textContent = q === '' ? '' : `${shown} of ${cards.length} key indicators match “${searchInput.value.trim()}”.`;
  };
  searchInput.addEventListener('input', apply);
}

function wireSorting() {
  const table = document.getElementById('regions-table');
  if (!table) return;
  const body = table.querySelector('tbody');
  let direction = 1;
  let lastKey = 'both';
  const sortBy = (key) => {
    direction = key === lastKey ? -direction : 1;
    lastKey = key;
    const rows = Array.from(body.querySelectorAll('tr'));
    rows.sort((a, b) => {
      const cellsA = a.querySelectorAll('td');
      const cellsB = b.querySelectorAll('td');
      const index = { province: 0, both: 1, male: 2, female: 3 }[key];
      const va = cellsA[index].textContent.trim();
      const vb = cellsB[index].textContent.trim();
      const num = Number.parseFloat(va);
      if (!Number.isNaN(num)) return (num - Number.parseFloat(vb)) * direction;
      return va.localeCompare(vb) * direction;
    });
    for (const row of rows) body.appendChild(row);
  };
  for (const th of table.querySelectorAll('th.sortable')) {
    th.addEventListener('click', () => sortBy(th.dataset.sort));
    th.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); sortBy(th.dataset.sort); }
    });
  }
}

function downloadCsv(name) {
  const table = CSV_TABLES[name];
  if (!table) return;
  const text = `# NorthStar Statistics — ${table.file}\n# Source: ${table.source}\n${toCsv(table.columns, table.rows)}`;
  const blob = new Blob([text], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = table.file;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function render() {
  window.__shotReady = false;
  const route = (location.hash.match(/^#\/([^/?#]*)/) || ['', ''])[1];
  const view = ROUTES[route] || null;
  if (view) {
    app.innerHTML = view();
    document.title = route === ''
      ? 'NorthStar Statistics — Canada in Numbers'
      : `${route[0].toUpperCase()}${route.slice(1)} | NorthStar Statistics — Canada in Numbers`;
  } else {
    app.innerHTML = notFound(route);
    document.title = 'Page not found | NorthStar Statistics';
  }
  for (const link of navLinks) link.classList.toggle('active', link.dataset.route === route);

  if (route === '') {
    drawChartInto('home-chart', 'population');
    const panel = app.querySelector('.panel');
    if (panel) wireSegmented(panel, 'home-chart');
    wireSearch();
  } else if (route === 'population') {
    drawChartInto('pop-chart', 'population');
  } else if (route === 'prices') {
    drawChartInto('cpi-chart', 'cpi-annual');
    const panel = app.querySelector('.panel');
    if (panel) wireSegmented(panel, 'cpi-chart');
  } else if (route === 'labour') {
    drawLineChart(document.getElementById('labour-chart'),
      UNEMPLOYMENT.map((u) => u.period.replace(' average', '')),
      UNEMPLOYMENT.map((u) => u.value),
      { format: (v) => v.toFixed(1) + '%', unit: '%', label: 'Unemployment rate, selected months' });
  } else if (route === 'health') {
    drawChartInto('health-chart', 'life');
  } else if (route === 'regions') {
    drawBarChart(document.getElementById('regions-chart'),
      LIFE_BY_PROVINCE.map((r) => r.province),
      LIFE_BY_PROVINCE.map((r) => r.both),
      { format: (v) => v.toFixed(2), label: 'Life expectancy by province, 2024' });
    wireSorting();
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-csv]');
  if (button) downloadCsv(button.dataset.csv);
});

window.addEventListener('hashchange', render);
render();
