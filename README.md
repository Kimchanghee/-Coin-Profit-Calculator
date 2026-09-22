# ProfitCalc

A React and TypeScript linear USD futures scenario calculator. It estimates gross and net PnL, fees, ROI and final equity. It is not an exchange settlement engine or financial advice.

## Local development

Requires Node.js 20 or newer. The packaging step also requires PowerShell 7 (pwsh).

```sh
npm ci
npm run dev
```

Vite serves development at http://localhost:5173 by default. Optional VITE_GA_MEASUREMENT_ID enables the existing analytics component; index.html also contains the existing GA loader. Calculation arithmetic runs locally, which does not mean the page makes no network requests.

## Verification and build

```sh
npm run typecheck
npm run smoke:calculator
npm run build:cloudflare
```

The Cloudflare command repeats typecheck and smoke tests, runs Vite, and packages the fresh dist/ directory into **releases/profitcalc-restored.zip inside this repository**. releases/ and dist/ are ignored by Git. No commit, upload or deployment is performed by the build.

The packager dynamically verifies that ZIP entry count matches the dist file count. The current build contains 19 files; this is an observation, not a hard-coded count requirement. It checks that _headers exists, that no _redirects file or rejected HTML header glob is present, that archive paths use forward slashes, and that files have no dist/ wrapper.

Use genuine 404 asset handling on Cloudflare, not SPA fallback. The package includes public/404.html. A local Vite preview alone does not prove production HTTP 404 or header behavior.

## Indexing safeguards and semantic content

- Restoration QA retains noindex, nofollow and noarchive meta directives, X-Robots-Tag in public/_headers, and Disallow: / in public/robots.txt. Do not remove these during routine builds.
- index.html contains canonical, Open Graph and Twitter metadata plus WebApplication and FAQPage JSON-LD. It does not contain BreadcrumbList schema.
- Language alternate links, including x-default and all ten supported locale codes, are in index.html. public/sitemap.xml lists only the audited root, four English guides, about and methodology pages; it does not declare hreflang alternates.
- The English static calculator explanation is inside noscript, readable without JavaScript and absent from the JavaScript-enabled layout. React restores localized guide navigation and opt-in English reference answers through ExposureLinks. FAQ answers match data/calculator-reference.json and the static fallback.
- public/llms.txt lists audited pages and model limitations. It does not override robots restrictions or claim search/AI visibility.
- About, methodology and all four specialized guides retain noindex. Their formulas and examples follow components/Calculator.tsx.

## Calculation behavior

Entry and target prices initially stay blank. Direction, leverage, investment, per-side fee and optional referral payback feed the original linear formulas. Derived non-finite arithmetic is rejected instead of rendering Infinity or NaN. No exchange-specific maximum leverage, fee schedule or account protection is claimed.

Reset clears prices, restores 10× leverage, $1,000 investment and 0.075% fee, disables payback and retains direction. Explicit example presets replace assumptions and select long. Ten locales remain available. English-only reference content is labeled as such.

## Tests

The smoke test executes the actual calculation callback extracted from Calculator.tsx. It checks long/short results, gross/net fees, payback, zero/flat boundaries, blank and invalid inputs, derived arithmetic overflow, locale key parity, matching FAQ content, specialized guide examples, noscript placement and indexing safeguards. Browser layout and production HTTP behavior require separate checks.

## Structure

- components/: calculator, language controls and reference links
- data/calculator-reference.json: shared English reference answers
- hooks/ and locales/: locale loading and ten translation dictionaries
- public/guides/: four topic-specific static guides
- scripts/: smoke, build and packaging verification
- dist/ and releases/: ignored generated outputs

## License

MIT
