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

The packager dynamically verifies that ZIP entry count matches the dist file count. The current build contains 19 files; this is an observation, not a hard-coded count requirement. It checks that _headers exists, that no _redirects file or rejected HTML header glob is present, that noindex headers remain scoped to the final `/discover` route and its direct file URL, that archive paths use forward slashes, and that files have no dist/ wrapper.

Use genuine 404 asset handling on Cloudflare, not SPA fallback. The package includes public/404.html. A local Vite preview alone does not prove production HTTP 404 or header behavior.

## Scoped indexing and semantic content

- Exactly seven content URLs are intended to be indexable: the root, four English guides, about and methodology. `public/sitemap.xml` contains those seven final 200 extensionless locations.
- `public/robots.txt` permits crawling and advertises the sitemap. The global `/*` header block contains security headers only.
- The six static indexable HTML pages use their final extensionless URL for canonical, Open Graph, Twitter and structured-data URL metadata; their navigation also avoids redirecting `.html` links.
- `public/discover.html` retains page-level noindex and clean self URL metadata. `_headers` scopes `X-Robots-Tag` to `/discover` and the direct `/discover.html` URL.
- Unknown paths depend on the noindex meta in the dedicated `public/404.html` body, not on a `/404.html` header rule matching arbitrary missing URLs. Cloudflare must serve that body with an actual HTTP 404 status.
- `index.html` keeps a static root canonical, Open Graph and Twitter URLs plus WebApplication and FAQPage JSON-LD. English and x-default alternates point to the root; query-language URLs are UX state, not separately canonicalized or advertised as hreflang pages.
- Ten client-side locales remain available. Language selection may update `?lang=` and localized presentation, but it does not mutate canonical or social URL metadata. Unsupported exchange/venue keyword metadata is not emitted.
- The English static calculator explanation is inside noscript, readable without JavaScript and absent from the JavaScript-enabled layout. React restores localized guide navigation and opt-in English reference answers through ExposureLinks. FAQ answers match data/calculator-reference.json and the static fallback.
- `public/llms.txt` lists the same seven scoped URLs and model limitations without promising search visibility or AI citation. Guide formulas and examples follow `components/Calculator.tsx`.

## Calculation behavior

Entry and target prices initially stay blank. Direction, leverage, investment, per-side fee and optional referral payback feed the original linear formulas. Derived non-finite arithmetic is rejected instead of rendering Infinity or NaN. No exchange-specific maximum leverage, fee schedule or account protection is claimed.

Reset clears prices, restores 10× leverage, $1,000 investment and 0.075% fee, disables payback and retains direction. Explicit example presets replace assumptions and select long. Ten locales remain available. English-only reference content is labeled as such.

## Tests

The smoke test executes the actual calculation callback extracted from Calculator.tsx. It checks long/short results, gross/net fees, payback, zero/flat boundaries, blank and invalid inputs, derived arithmetic overflow, locale key parity, matching FAQ content, specialized guide examples, noscript placement, the exact seven-URL sitemap, static canonical behavior, scoped noindex rules and crawl policy. Browser layout and production HTTP behavior require separate checks.

## Structure

- components/: calculator, language controls and reference links
- data/calculator-reference.json: shared English reference answers
- hooks/ and locales/: locale loading and ten translation dictionaries
- public/guides/: four topic-specific static guides
- scripts/: smoke, build and packaging verification
- dist/ and releases/: ignored generated outputs

## License

MIT
