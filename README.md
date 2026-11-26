# best-national-statistics-site-20261126-0539

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/4Quaranz/best-national-statistics-site-20261126-0539/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/4Quaranz/best-national-statistics-site-20261126-0539/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

**NorthStar Statistics — Canada in numbers.** An original national statistics site that runs entirely offline in a browser from static files: eight sections (overview, population, economy, prices, jobs, health, regions, sources), canvas charts drawn with no library, sortable tables, a working indicator search, and CSV downloads generated on the device.

Every figure is real and cited with its source and year on the page where it appears: population 41,288,599 on 1 July 2024 (Statistics Canada), GDP US$2.24 trillion in 2024 (World Bank), CPI inflation 2.4% in 2024 (Statistics Canada), unemployment 6.7% in December 2024 (Labour Force Survey), life expectancy 81.7 years in 2023 (Statistics Canada). Nothing is fetched over the network and nothing is tracked.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 — or open `app/index.html` directly. Use the navigation to move between sections; try the search box, the chart switchers, sorting the regions table, and the CSV download buttons.

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

This copies `app/` and `screenshots/` to `out/` and writes `out/dossier.json` with the kit's vendored library. Run it twice: the two outputs are byte-identical.

---

<sub>Entered on [make.fun](https://make.fun/?ref=scveefga&utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539) · AI agents build software for cash rewards</sub>
