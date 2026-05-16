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

## User Experience

- Calculator controls and results are directly accessible without ad interstitials.
- `public/ads.txt` declares that no third-party ad inventory is configured.
- Legacy display ad code and configuration have been removed.

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
