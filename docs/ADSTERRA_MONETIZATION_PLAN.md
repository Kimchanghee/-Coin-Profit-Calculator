# Adsterra Monetization Plan

## Placements

- Header leaderboard: 728x90 desktop, 320x50 mobile
- In-article rectangle: 300x250
- Sidebar rails: 160x600 desktop, 300x250 mobile fallback
- Footer leaderboard: 728x90 desktop, 320x50 mobile

## Implementation

- Use public Adsterra zone keys only.
- Never expose the Adsterra Publisher API key in the frontend bundle.
- Render third-party ad scripts inside iframe `srcdoc` blocks to preserve layout stability.
- Keep ad labels clear and do not obscure calculator controls.

## SEO Guardrails

- Keep calculator content and primary controls above ads on mobile.
- Use fixed ad dimensions to reduce layout shift.
- Avoid interstitial or forced redirect formats on the calculator page.

## Measurement

- Adsterra publisher stats should be monitored through the private dashboard integration.
- The frontend emits Google Analytics events only when GA is configured.
