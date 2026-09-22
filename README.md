# Coin Profit Calculator

A React + TypeScript crypto futures PnL calculator focused on speed, multilingual discovery, and risk-aware trading estimates.

## Deployment Target

This repository builds to static assets for the existing Cloudflare Worker assets deployment. It does not require a server runtime.

## Tech Stack

- React 19
- TypeScript 5
- Vite 6
- Tailwind CSS compiled locally via PostCSS

## Local Development

Prerequisite: Node.js 20+

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173`.

## Environment Variables

Optional variables:

```env
# Gemini (optional)
GEMINI_API_KEY=

# Google Analytics (optional)
VITE_GA_MEASUREMENT_ID=

```

The app does not ship popup, redirect, social bar, anchor, referral banner, or third-party display network scripts.

## Build

```bash
npm run typecheck
npm run check
npm run build
npm run preview
```

Build output is generated in `dist/`.

## Cloudflare static assets

1. Install from the lockfile with `npm ci --ignore-scripts`.
2. Run the typecheck and Vite build.
3. Upload the contents of `dist/` as the Worker static-assets package.
4. Keep Cloudflare's asset handling on a genuine 404 mode rather than SPA fallback.

The build includes `_headers`, `_redirects`, and `404.html`. During restoration QA it deliberately ships `X-Robots-Tag: noindex` and `robots.txt` with `Disallow: /`.

## SEO, GEO, and AEO

- `index.html` contains canonical, Open Graph, Twitter, WebApplication, FAQPage, and BreadcrumbList schema.
- `public/sitemap.xml` declares hreflang alternates for supported languages.
- `public/robots.txt` is temporarily locked to `Disallow: /` for restoration QA.
- `public/llms.txt` summarizes the calculator for AI and answer engines.

## User Experience

- Calculator controls and results are directly accessible without ad interstitials.
- `public/ads.txt` and the original inline sponsored slot are preserved as they existed in the source repository.
- No new ad network, paid service, redirect ad, or trading action is added by the Cloudflare migration.

## Project Structure

```text
components/                # Main React components
hooks/                     # Custom hooks
locales/                   # i18n JSON files
ui-enhanced/               # Alternative enhanced UI components
utils/                     # Utilities
```

## License

MIT
