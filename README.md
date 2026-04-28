# Coin Profit Calculator

A React + TypeScript crypto futures PnL calculator focused on speed, multilingual discovery, and risk-aware trading estimates.

## Platform Policy

This repository is configured for Lovable-only deployment.

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

# Adsterra public zone key overrides (optional)
VITE_ADSTERRA_728_KEY=
VITE_ADSTERRA_300_KEY=
VITE_ADSTERRA_160_KEY=
VITE_ADSTERRA_320_KEY=
```

The app ships with Adsterra display placements for header, in-article, sidebar, and footer inventory. Do not put the Adsterra Publisher API key in client-side env vars.

## Build

```bash
npm run typecheck
npm run check
npm run build
npm run preview
```

Build output is generated in `dist/`.

## Deploy on Lovable

1. Import this Git repository into Lovable.
2. Configure build settings:
   - Install command: `npm ci`
   - Build command: `npm run build`
   - Output directory: `dist`
3. Add optional environment variables in Lovable project settings.
4. Publish from your target branch.

## SEO, GEO, and AEO

- `index.html` contains canonical, Open Graph, Twitter, WebApplication, FAQPage, and BreadcrumbList schema.
- `public/sitemap.xml` declares hreflang alternates for supported languages.
- `public/robots.txt` allows search and AI crawlers.
- `public/llms.txt` summarizes the calculator for AI and answer engines.

## Monetization

- Adsterra banner inventory is loaded through isolated iframes to keep third-party scripts away from the React tree.
- `public/ads.txt` declares Adsterra authorized sellers.
- Legacy Google ad code and configuration have been removed.

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
