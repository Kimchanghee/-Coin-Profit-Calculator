# ProfitCalc Cloudflare restoration report

Date: 2026-09-22

## Deliverable

- Static assets ZIP: `D:\웹 수익 자동화\releases\profitcalc-restored.zip`
- Final upload ZIP size: 100,001 bytes
- Final upload ZIP SHA-256: `9FCD03EA30A32B6708DEC52C2EFE2CF59A996A3A0824F1AB0DDE6A571709BB51`
- ZIP layout: 17 deployable files at the archive root, with no `dist/` wrapper
- `npm run build:cloudflare` now reproduces the successful layout directly: no `_redirects` and simplified `_headers`.

## Restoration scope

- Preserved the original React/TypeScript Coin Profit Calculator identity and UI.
- Preserved long/short PnL, leveraged ROI, entry/exit fees, referral payback, reset, validation, all 10 locales, guide pages, discovery files, and the existing GA tag.
- Corrected the corrupted Korean disclaimer and required-fields copy.
- Removed duplicate unit suffixes from rendered labels.
- The inactive sponsored slot is no longer mounted or included in the active bundle; its internal technical iframe identifier is not exposed.
- Added no trading execution, exchange connection, paid service, or active ad code.
- Removed the obsolete Vercel middleware/runtime dependency.
- Removed unused Gemini environment injection so a server-side key cannot be compiled into the browser bundle.
- Added Cloudflare static-asset files and a dedicated `404.html`. Source and package now both use the accepted no-redirects, simplified-headers layout.

## QA crawler lock

The release intentionally remains unavailable for indexing during restoration QA:

- `robots.txt` ends with `Disallow: /`.
- App, guide, discovery, and 404 pages carry `noindex` metadata.
- `_headers` applies `X-Robots-Tag: noindex, nofollow, noarchive` globally.

Do not remove this lock until the parent has uploaded the package and verified the live apex, routes, headers, calculator UI, analytics policy, and 404 response. Configure and verify the www-to-apex redirect separately at the Cloudflare edge because `_redirects` is intentionally absent from the corrected upload ZIP.

## Route map

| Route | Expected result |
| --- | --- |
| `/` | Calculator app, HTTP 200 |
| `/?lang=en` | English calculator, HTTP 200 |
| `/?lang=ko` | Korean calculator, HTTP 200 |
| `/?lang=es` | Spanish calculator, HTTP 200 |
| `/?lang=zh` | Chinese calculator, HTTP 200 |
| `/?lang=ja` | Japanese calculator, HTTP 200 |
| `/?lang=de` | German calculator, HTTP 200 |
| `/?lang=fr` | French calculator, HTTP 200 |
| `/?lang=ru` | Russian calculator, HTTP 200 |
| `/?lang=pt` | Portuguese calculator, HTTP 200 |
| `/?lang=hi` | Hindi calculator, HTTP 200 |
| `/discover.html` | Original discovery map, HTTP 200 |
| `/guides/crypto-futures-profit-formula.html` | Original formula guide, HTTP 200 |
| `/guides/leverage-roi-calculator.html` | Original leverage guide, HTTP 200 |
| `/guides/long-short-futures-pnl.html` | Original direction guide, HTTP 200 |
| `/guides/trading-fee-impact.html` | Original fee guide, HTTP 200 |
| `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/ads.txt` | Preserved static discovery/policy files, HTTP 200 |
| `/index.html` | Packaged static HTML; canonical metadata points to the apex root |
| `https://www.profitcalc.tech/*` | Configure and verify the redirect separately at the Cloudflare edge |
| Any missing path | Dedicated 404 body with HTTP 404; no catch-all 200 rule is included |

## Tests completed

- Clean install from the updated lockfile with Node 24 and `npm ci --ignore-scripts --cache D:\웹 수익 자동화\npm-cache`.
- TypeScript `tsc --noEmit`: passed.
- Vite production build: passed, 50 modules transformed.
- Local static HTTP harness: 19 expected routes returned 200; an unknown route returned 404 with the dedicated 404 body.
- Route/link integrity: internal static links resolved to packaged files.
- Canonicals: inspected HTML canonicals use `https://profitcalc.tech/`.
- QA lock: robots, page metadata, and global response-header directives validated.
- Security headers: nosniff, frame denial, strict referrer policy, restricted permissions policy, HSTS, and global noindex directives present.
- No SPA/catch-all 200 rule is present. The corrected upload archive omits `_redirects` for dashboard compatibility.
- Localization: all 10 locale files parse and contain the same 29 translation keys.
- Calculator regression equations: long, short, and 20% fee-payback cases passed against the implemented equations.
  - Long example: net PnL 984.25, ROI 98.425%, fees 15.75, total 1,984.25.
  - Short example: net PnL 985.75, ROI 98.575%, fees 14.25.
  - Payback example: net PnL 987.40, fees 12.60.
- Client bundle scan: no Gemini/API-key environment references or inactive Adsterra/technical iframe markers remain.
- Korean disclaimer text is present correctly in the production bundle.
- ZIP contents and root layout validated.
- ZIP forensic validation: all 17 entries passed CRC and decompression checks; names use forward slashes; local and central names match; no BOM, directory entries, extra fields, comments, trailing bytes, unsafe paths, or UTF-8 filename ambiguity were found.
- All 17 ZIP entries are byte-identical to the final tested `dist/`.

## Build sizes

- Build files: 17
- Raw build size: 313,988 bytes
- Sum of individually gzipped files: 97,688 bytes
- Main JavaScript: 241,930 bytes raw, 76,848 bytes gzip
- Main CSS: 27,910 bytes raw, 5,286 bytes gzip
- Main HTML: 9,975 bytes raw, 2,601 bytes gzip
- Final release ZIP: 100,001 bytes

## Remaining live-only checks

- Upload/deployment was deliberately not performed.
- The parent must verify Cloudflare applies `_headers` for the existing Worker static-assets configuration.
- Confirm the Worker asset configuration uses genuine not-found handling and does not force SPA fallback.
- Confirm apex behavior, configure the www redirect separately, and verify response headers, 404 status, calculator interaction, and existing analytics behavior after upload.
- The Browserslist data warning is non-blocking and was not changed because it is not a demonstrated restoration blocker.
