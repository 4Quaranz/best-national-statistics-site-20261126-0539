// NorthStar Statistics — the pages. Each view returns HTML; main.js puts it on
// screen and wires up the charts, sorting and downloads. Every figure is
// escaped before it reaches the page.

import {
  HEADLINE, POPULATION_QUARTERS, CPI_ANNUAL, CPI_MONTHLY_2024,
  UNEMPLOYMENT, LIFE_EXPECTANCY, LIFE_BY_PROVINCE, ECONOMY,
  DEMOGRAPHY_2023, RELEASES, TOPICS, SOURCES,
} from './data.js';

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const fmtInt = (n) => n.toLocaleString('en-CA');
const fmtUsd = (n) => 'US$' + n.toLocaleString('en-CA');

function card(c) {
  return `<a class="card" href="${c.route}" data-search="${esc(c.search)} ${esc(c.kicker)} ${esc(c.label)}">
  <span class="kicker">${esc(c.kicker)}</span>
  <span class="value">${esc(c.value)}</span>
  <span class="label">${esc(c.label)}</span>
  <span class="delta ${c.tone}">${esc(c.delta)}</span>
</a>`;
}

function sourceLine(source, extra) {
  return `<p class="source-note"><b>Source:</b> ${esc(source)}${extra ? ` · ${esc(extra)}` : ''}</p>`;
}

function downloadButton(dataset, label) {
  return `<button class="btn secondary" type="button" data-csv="${dataset}">${esc(label)}</button>`;
}

export function home() {
  return `
<section class="hero">
  <h1>Canada in numbers</h1>
  <p class="lede">Population, the economy, prices, jobs and health — the figures people actually look up, each with its source and year, on one page that works offline.</p>
  <p class="updated">Latest figures: <b>population 1 July 2024</b> · <b>CPI annual average 2024</b> · <b>GDP 2024</b> · <b>unemployment December 2024</b></p>
</section>
<p class="search-count" id="search-count" aria-live="polite"></p>
<section class="cards" id="headline-cards" aria-label="Key indicators">
  ${HEADLINE.map(card).join('')}
</section>
<section class="panel" aria-label="Trends at a glance">
  <h2 style="margin-top:0">Trends at a glance</h2>
  <div class="seg" role="group" aria-label="Choose a trend">
    <button type="button" data-chart="population" aria-pressed="true">Population</button>
    <button type="button" data-chart="cpi" aria-pressed="false">Inflation</button>
    <button type="button" data-chart="life" aria-pressed="false">Life expectancy</button>
  </div>
  <div class="chart-wrap"><canvas class="chart" id="home-chart"></canvas></div>
  <p class="chart-caption" id="home-chart-caption">Canada’s population, quarterly estimates in 2024. Source: Statistics Canada, Demographic Estimates.</p>
</section>
<section aria-label="Latest releases">
  <h2>Latest releases</h2>
  <ul class="release-list">
    ${RELEASES.map((r) => `<li><span class="date">${esc(r.date)}</span><p><span class="tag">${esc(r.tag)}</span>${esc(r.text)}</p></li>`).join('')}
  </ul>
</section>
<section aria-label="Browse by topic">
  <h2>Browse by topic</h2>
  <div class="topic-grid">
    ${TOPICS.map((t) => `<div class="topic"><h3>${esc(t.title)}</h3><p>${esc(t.text)}</p><a href="${t.route}">Open ${esc(t.title)} →</a></div>`).join('')}
  </div>
</section>`;
}

export function population() {
  return `
<p class="breadcrumb"><a href="#/">Home</a> / Population</p>
<h1>Population</h1>
<p class="lede">Canada passed 40 million people on 16 June 2023 and 41 million on 1 April 2024 — the fastest growth in decades, driven almost entirely by immigration.</p>
<section class="panel">
  <h2 style="margin-top:0">Population through 2024</h2>
  <div class="chart-wrap"><canvas class="chart" id="pop-chart"></canvas></div>
  <p class="chart-caption">Quarterly population estimates, 2024. The jump from April to October is 452,735 people.</p>
  ${sourceLine(SOURCES.statcanPop, 'released 19 June, 25 September and 17 December 2024')}
</section>
<section class="panel">
  <h2 style="margin-top:0">The numbers</h2>
  <div class="table-scroll"><table class="data">
    <thead><tr><th>Reference date</th><th class="num">Population</th><th class="num">Change on quarter</th></tr></thead>
    <tbody>
      <tr><td>1 April 2024</td><td class="num">41,012,563</td><td class="num">—</td></tr>
      <tr><td>1 July 2024</td><td class="num">41,288,599</td><td class="num">+276,036 (+0.6%)</td></tr>
      <tr><td>1 October 2024</td><td class="num">41,465,298</td><td class="num">+176,699 (+0.4%)</td></tr>
    </tbody>
  </table></div>
  <p class="source-note">Growth for the whole of 2024 was <b>+744,324 people (+1.8%)</b>, taking the population to about 41.5 million by 1 January 2025. Just over 3 million of the people counted on 1 July 2024 were non-permanent residents.</p>
  ${sourceLine(SOURCES.statcanPop)}
  <div class="btn-row">${downloadButton('population', 'Download this table (CSV)')} <a class="btn" href="#/regions">Compare the provinces →</a></div>
  <p class="download-note">The CSV downloads straight from this page — no account, no network.</p>
</section>
<section class="panel">
  <h2 style="margin-top:0">Who makes up the population?</h2>
  <div class="cards">
    <div class="card"><span class="kicker">Median age</span><span class="value">${DEMOGRAPHY_2023.medianAge} years</span><span class="label">2023 — half the population is older, half younger</span></div>
    <div class="card"><span class="kicker">Fertility</span><span class="value">${DEMOGRAPHY_2023.fertilityRate}</span><span class="label">births per woman, 2023</span></div>
    <div class="card"><span class="kicker">Births</span><span class="value">${fmtInt(DEMOGRAPHY_2023.births)}</span><span class="label">babies born in 2023</span></div>
    <div class="card"><span class="kicker">Deaths</span><span class="value">${fmtInt(DEMOGRAPHY_2023.deaths)}</span><span class="label">people who died in 2023</span></div>
  </div>
  ${sourceLine(SOURCES.owid, 'UN World Population Prospects')}
  <div class="callout"><p><b>Reading the growth:</b> births minus deaths added only about 45,000 people in 2023. Almost all of the growth since then has come from people moving to Canada.</p></div>
</section>`;
}

export function economy() {
  return `
<p class="breadcrumb"><a href="#/">Home</a> / Economy</p>
<h1>Economy</h1>
<p class="lede">Canada is the world’s 9th-largest economy. Output per person is about US$54,000 a year — high-income by any measure, but growth per person has been flat for a decade because the population has grown faster than output.</p>
<section class="panel">
  <h2 style="margin-top:0">Canada’s economy in 2024</h2>
  <div class="cards">
    <div class="card"><span class="kicker">GDP</span><span class="value">US$2.24 trillion</span><span class="label">current US dollars, 2024</span></div>
    <div class="card"><span class="kicker">GDP per person</span><span class="value">${fmtUsd(ECONOMY.gdpPerCapitaUsd)}</span><span class="label">current US dollars, 2024</span></div>
    <div class="card"><span class="kicker">Real growth</span><span class="value">+${ECONOMY.gdpGrowthPct}%</span><span class="label">change in real GDP, 2024</span></div>
    <div class="card"><span class="kicker">World rank</span><span class="value">#${ECONOMY.gdpRank}</span><span class="label">by total GDP, of 214 economies</span></div>
  </div>
  ${sourceLine(SOURCES.worldBank)}
</section>
<section class="panel">
  <h2 style="margin-top:0">What the figures mean</h2>
  <p><b>GDP</b> is the value of everything produced in the country in a year. Quoted in current US dollars it moves with the exchange rate as well as with real activity, so a weaker Canadian dollar makes the US-dollar figure smaller even when Canadians produce the same amount.</p>
  <p><b>Real growth (+1.6% in 2024)</b> strips out price changes, so it measures how much more was actually produced. <b>GDP per person</b> divides output by the population: it is the simplest single gauge of average living standards, and it is the figure to watch when the population itself is growing fast.</p>
  <div class="callout"><p><b>Why per-person growth stalled:</b> total output grew 1.6% in 2024 while the population grew 1.8%. When people arrive faster than output grows, output per person falls even though the economy as a whole gets bigger.</p></div>
  <div class="btn-row">${downloadButton('economy', 'Download these figures (CSV)')}</div>
</section>`;
}

export function prices() {
  return `
<p class="breadcrumb"><a href="#/">Home</a> / Prices</p>
<h1>Prices</h1>
<p class="lede">Inflation peaked at 6.8% in 2022 — the fastest price rises in forty years — then fell back to 2.4% in 2024, close to the Bank of Canada’s 2% target.</p>
<section class="panel">
  <h2 style="margin-top:0">Inflation, year by year</h2>
  <div class="seg" role="group" aria-label="Choose the inflation view">
    <button type="button" data-chart="cpi-annual" aria-pressed="true">Annual average</button>
    <button type="button" data-chart="cpi-monthly" aria-pressed="false">Late 2024, monthly</button>
  </div>
  <div class="chart-wrap"><canvas class="chart" id="cpi-chart"></canvas></div>
  <p class="chart-caption" id="cpi-chart-caption">Annual average change in the Consumer Price Index, 2019–2024.</p>
  ${sourceLine(SOURCES.statcanCpi)}
</section>
<section class="panel">
  <h2 style="margin-top:0">The numbers</h2>
  <div class="table-scroll"><table class="data">
    <thead><tr><th>Year</th><th class="num">CPI, annual average change</th><th>What happened</th></tr></thead>
    <tbody>
      <tr><td>2019</td><td class="num">+1.9%</td><td>Near the 2% target</td></tr>
      <tr><td>2020</td><td class="num">+0.7%</td><td>Pandemic demand collapse</td></tr>
      <tr><td>2021</td><td class="num">+3.4%</td><td>Reopening, supply chains strain</td></tr>
      <tr><td>2022</td><td class="num">+6.8%</td><td>Peak — highest in 40 years</td></tr>
      <tr><td>2023</td><td class="num">+3.9%</td><td>Cooling, still above target</td></tr>
      <tr><td>2024</td><td class="num">+2.4%</td><td>Near target again; energy excluded it was 2.6%</td></tr>
    </tbody>
  </table></div>
  <p class="source-note">The all-items CPI averaged <b>160.9</b> in 2024 (2002 = 100). Year-over-year inflation in December 2024 was <b>1.8%</b>.</p>
  ${sourceLine(SOURCES.statcanCpi)}
  <div class="btn-row">${downloadButton('prices', 'Download this table (CSV)')}</div>
</section>`;
}

export function labour() {
  return `
<p class="breadcrumb"><a href="#/">Home</a> / Jobs</p>
<h1>Jobs</h1>
<p class="lede">Unemployment rose through 2024 as hiring slowed: from 6.1% in March to 6.8% in November, before easing to 6.7% in December.</p>
<section class="panel">
  <h2 style="margin-top:0">Unemployment rate</h2>
  <div class="chart-wrap"><canvas class="chart" id="labour-chart"></canvas></div>
  <p class="chart-caption">Unemployment rate, seasonally adjusted, selected months. The 2023 average was 5.4%.</p>
  ${sourceLine(SOURCES.statcanLfs)}
</section>
<section class="panel">
  <h2 style="margin-top:0">The numbers</h2>
  <div class="table-scroll"><table class="data">
    <thead><tr><th>Period</th><th class="num">Unemployment rate</th></tr></thead>
    <tbody>
      ${UNEMPLOYMENT.map((u) => `<tr><td>${esc(u.period)}</td><td class="num">${u.value.toFixed(1)}%</td></tr>`).join('')}
    </tbody>
  </table></div>
  ${sourceLine(SOURCES.statcanLfs, 'seasonally adjusted')}
  <div class="callout"><p><b>Reading the rate:</b> the unemployment rate counts people without work who are actively looking, as a share of the labour force. It can rise even while jobs are being added, if more people start looking for work than there are new jobs.</p></div>
  <div class="btn-row">${downloadButton('labour', 'Download this table (CSV)')}</div>
</section>`;
}

export function health() {
  return `
<p class="breadcrumb"><a href="#/">Home</a> / Health</p>
<h1>Health</h1>
<p class="lede">Canadians born in 2023 can expect to live 81.7 years — up from 81.3 in 2022, the first rise in three years, but still below the pre-pandemic 82.2 years of 2019.</p>
<section class="panel">
  <h2 style="margin-top:0">Life expectancy at birth</h2>
  <div class="chart-wrap"><canvas class="chart" id="health-chart"></canvas></div>
  <p class="chart-caption">Life expectancy at birth, both sexes, 2019–2024. The dip covers the pandemic years; 2023 and 2024 are preliminary.</p>
  ${sourceLine(SOURCES.statcanLife)}
</section>
<section class="panel">
  <h2 style="margin-top:0">The numbers</h2>
  <div class="table-scroll"><table class="data">
    <thead><tr><th>Year</th><th class="num">Both sexes</th><th>Note</th></tr></thead>
    <tbody>
      ${LIFE_EXPECTANCY.map((r) => `<tr><td>${r.year}</td><td class="num">${r.value.toFixed(2)} years</td><td>${r.year === '2019' ? 'Pre-pandemic high' : r.year === '2022' ? 'Lowest in the series' : r.year === '2023' ? 'First rise in three years' : ''}</td></tr>`).join('')}
    </tbody>
  </table></div>
  <p class="source-note">In 2023, life expectancy was <b>79.5 years for men</b> and <b>83.9 years for women</b>; in 2024 it was <b>80.0 years for men</b> and <b>84.3 years for women</b>. At age 65 in 2023, men could expect 19.6 more years and women 22.2 more.</p>
  ${sourceLine(SOURCES.statcanHealth)}
  <div class="btn-row">${downloadButton('health', 'Download this table (CSV)')} <a class="btn" href="#/regions">See the provinces →</a></div>
</section>`;
}

export function regions() {
  return `
<p class="breadcrumb"><a href="#/">Home</a> / Regions</p>
<h1>Regions</h1>
<p class="lede">Where you live in Canada is worth more than three years of life: Ontario tops the provinces at 82.85 years, Manitoba trails at 79.29. Tap a column heading to sort the table.</p>
<section class="panel">
  <h2 style="margin-top:0">Life expectancy by province, 2024</h2>
  <div class="chart-wrap"><canvas class="chart" id="regions-chart"></canvas></div>
  <p class="chart-caption">Life expectancy at birth, both sexes, 2024. Figures are preliminary.</p>
  ${sourceLine(SOURCES.statcanLife)}
</section>
<section class="panel">
  <h2 style="margin-top:0">The numbers</h2>
  <div class="table-scroll"><table class="data" id="regions-table">
    <thead><tr>
      <th class="sortable" data-sort="province" tabindex="0">Province</th>
      <th class="num sortable" data-sort="both" tabindex="0">Both sexes</th>
      <th class="num sortable" data-sort="male" tabindex="0">Men</th>
      <th class="num sortable" data-sort="female" tabindex="0">Women</th>
    </tr></thead>
    <tbody>
      ${LIFE_BY_PROVINCE.map((r) => `<tr><td>${esc(r.province)}</td><td class="num">${r.both.toFixed(2)}</td><td class="num">${r.male.toFixed(2)}</td><td class="num">${r.female.toFixed(2)}</td></tr>`).join('')}
    </tbody>
  </table></div>
  <p class="source-note">The territories (Yukon, Northwest Territories, Nunavut) are not shown: their small populations make single-year life expectancy volatile, and Statistics Canada reports them on a three-year basis instead.</p>
  ${sourceLine(SOURCES.statcanLife, 'single-year estimates, 2024 preliminary')}
  <div class="btn-row">${downloadButton('regions', 'Download this table (CSV)')}</div>
</section>`;
}

export function sources() {
  return `
<p class="breadcrumb"><a href="#/">Home</a> / Sources</p>
<h1>Sources &amp; methods</h1>
<p class="lede">Every figure on this site comes from a public release. This page lists each source, what it measures, and how to read the numbers.</p>
<section class="panel">
  <h2 style="margin-top:0">Sources used</h2>
  <ul>
    <li><b>Population</b> — ${esc(SOURCES.statcanPop)}. Quarterly estimates from the 2021 Census counts, adjusted for undercoverage.</li>
    <li><b>Prices</b> — ${esc(SOURCES.statcanCpi)}. The Consumer Price Index, all-items, 2002 = 100.</li>
    <li><b>Economy</b> — ${esc(SOURCES.worldBank)}. GDP in current US dollars; GDP per capita is GDP divided by mid-year population.</li>
    <li><b>Jobs</b> — ${esc(SOURCES.statcanLfs)}. Seasonally adjusted monthly unemployment rate.</li>
    <li><b>Health</b> — ${esc(SOURCES.statcanLife)}; ${esc(SOURCES.statcanHealth)}. Life expectancy from the Canadian Vital Statistics Death Database. 2023 and 2024 figures are preliminary.</li>
    <li><b>Demography</b> — ${esc(SOURCES.owid)}. Median age, fertility, births and deaths for 2023.</li>
  </ul>
</section>
<section class="panel">
  <h2 style="margin-top:0">How to read the numbers</h2>
  <p><b>Annual average</b> means the average of the twelve monthly values in a calendar year, compared with the previous year’s average — how Statistics Canada reports a full year of inflation.</p>
  <p><b>Seasonally adjusted</b> means regular seasonal patterns (summer student jobs, winter construction slowdowns) have been removed, so month-to-month changes reflect the economy, not the calendar.</p>
  <p><b>Life expectancy at birth</b> is not a prediction for a real baby: it is the average lifespan if today’s death rates at every age stayed the same for a whole lifetime.</p>
  <p><b>Current US dollars</b> means GDP converted at the year’s market exchange rate. It is not adjusted for price differences between countries — that version is called PPP, and it is higher for Canada (about US$64,600 per person in 2024).</p>
</section>
<section class="panel">
  <h2 style="margin-top:0">About this site</h2>
  <p>NorthStar Statistics is an independent showcase of public statistics, built for the make.fun “best national statistics site” bounty. It is not affiliated with Statistics Canada, the World Bank or the IMF, and it copies no other site’s brand, text or images. All data is bundled with the site; it makes no network request, sets no cookie and tracks nobody.</p>
  <div class="btn-row">${downloadButton('all', 'Download all tables (CSV)')}</div>
</section>`;
}

export function notFound(route) {
  return `
<section class="notfound">
  <h1>Page not found</h1>
  <p class="lede">There is no “${esc(route)}” section on this site. The sections that exist are listed in the navigation above.</p>
  <p><a class="btn" href="#/">Back to the overview</a></p>
</section>`;
}
