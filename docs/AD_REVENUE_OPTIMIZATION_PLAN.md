# AD Revenue Optimization Plan

## 1) Objective

Maximize AdSense revenue while protecting user experience and policy safety.

Primary business KPI:
- `Page RPM`

Supporting KPIs:
- `Viewable ad slots / session`
- `Ad request success rate`
- `CTR`
- `CLS` and `LCP` impact after ad deployment

## 2) Applied Settings in This Repository

Implemented ad-optimization settings:

1. Placement expansion
- `headerBanner`: above main content block
- `inArticle`: after calculator section
- `sidebarTop`, `sidebarBottom`: desktop rail
- `footerBanner`: post-content placement

2. Lazy loading for better viewability/perf balance
- IntersectionObserver-based request timing
- root margin configurable via env (`VITE_ADSENSE_LAZY_ROOT_MARGIN`)

3. Layout stability protection
- Slot-level `minHeight` reservation to reduce CLS spikes

4. Measurement hooks
- GA events emitted:
  - `ad_slot_viewable`
  - `ad_slot_requested`
  - `ad_slot_request_failed`

5. Configuration hardening
- Publisher ID pattern validation (`ca-pub-xxxxxxxxxxxxxxxx`)
- Slot ID pattern validation (10-digit numeric)
- Invalid slot values are auto-skipped

## 3) Device Strategy

Desktop (>= lg):
- Header banner + in-article + sticky side rail (top/bottom) + footer banner
- Goal: increase viewable inventory per session without stacking ads too tightly in content flow

Mobile (< lg):
- Header banner + in-article + footer banner
- Goal: avoid overcrowding and preserve session depth

## 4) Environment Variable Baseline

Use these values as default production baseline:

```env
VITE_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxxxxxx
VITE_ADSENSE_SLOT_HEADER_BANNER=1234567890
VITE_ADSENSE_SLOT_IN_ARTICLE=1234567890
VITE_ADSENSE_SLOT_SIDEBAR_TOP=1234567890
VITE_ADSENSE_SLOT_SIDEBAR_BOTTOM=1234567890
VITE_ADSENSE_SLOT_FOOTER_BANNER=1234567890

VITE_ADSENSE_LAZY_LOAD=true
VITE_ADSENSE_LAZY_ROOT_MARGIN=400px 0px
VITE_ADSENSE_SHOW_FALLBACK_IN_PROD=false

VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Traffic-band tuning guide:

1. Low traffic (< 3k sessions/day)
- Keep current placements
- Focus on content quality and geo expansion first

2. Mid traffic (3k to 20k sessions/day)
- A/B test `lazy_root_margin`:
  - Variant A: `300px 0px`
  - Variant B: `500px 0px`
- Keep ad count fixed during first experiment

3. High traffic (> 20k sessions/day)
- Run concurrent experiments by device segment:
  - Desktop: rail position and top spacing
  - Mobile: header vs in-article weight

## 5) Experiment Framework (2-week loop)

Week 1:
- Baseline collection (no layout changes)
- Capture per-device:
  - sessions
  - page RPM
  - ad request failure ratio
  - bounce rate

Week 2:
- One variable only (e.g., root margin)
- Minimum runtime: 7 full days
- Success criteria:
  - RPM +5% or more
  - No significant bounce increase
  - CLS does not regress materially

Promotion rule:
- Promote variant only when KPI lift is stable for at least 7 days and policy-safe.

## 6) Operational Guardrails

1. Do not force-refresh AdSense units on timers.
2. Do not hide content behind ad walls.
3. Keep ads clearly distinguishable from navigation and interactive controls.
4. Keep placeholders disabled in production to avoid accidental dead inventory.
5. Track errors and ad-block behavior separately from ad-performance decisions.

## 7) Code Ownership Map

Core files touched by this strategy:
- `App.tsx` (placement layout)
- `components/AdPlaceholder.tsx` (ad request lifecycle + lazy load + GA events)
- `marketing.ts` (slot/config validation + feature flags)
- `.env.example` (operational baseline)
- `README.md` (publish checklist)

## 8) Reference Sources (Official)

- AdSense ad placements report and top earnings patterns:
  - https://support.google.com/adsense/answer/9183363
- Auto ads overview and experiment behavior:
  - https://support.google.com/adsense/answer/7478225
- Ad load controls for Auto ads:
  - https://support.google.com/adsense/answer/12171612
- Core Web Vitals and user-centric performance:
  - https://web.dev/articles/vitals

