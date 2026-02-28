# Coin Profit Calculator

A React + TypeScript crypto futures PnL calculator focused on speed and clarity.

## Platform Policy

This repository is now configured for **Lovable-only deployment**.

## Tech Stack

- React 19
- TypeScript 5
- Vite 6
- Tailwind CSS (compiled locally via PostCSS)

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

# Google AdSense (optional)
VITE_ADSENSE_CLIENT_ID=
VITE_ADSENSE_SLOT_SIDEBAR_TOP=
VITE_ADSENSE_SLOT_SIDEBAR_BOTTOM=
VITE_ADSENSE_SLOT_HEADER_BANNER=
VITE_ADSENSE_SLOT_FOOTER_BANNER=
VITE_ADSENSE_SLOT_IN_ARTICLE=
```

## Build

```bash
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
3. Add environment variables in Lovable project settings (same keys listed above).
4. Deploy from your target branch.

## Project Structure

```text
components/                # Main React components
hooks/                     # Custom hooks
integrations/              # Optional GA/AdSense integrations
locales/                   # i18n JSON files
ui-enhanced/               # Alternative enhanced UI components
utils/                     # Utilities
```

## Integration Docs

- `integrations/google-analytics/README.md`
- `integrations/google-adsense/README.md`
- `ui-enhanced/README.md`

## License

MIT
