# Google Analytics Integration

This module integrates GA4 into the app.

## Required Env Var

```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Basic Setup

Add the analytics component near the top level of the app:

```tsx
import GoogleAnalyticsEnhanced from './integrations/google-analytics/GoogleAnalyticsEnhanced';

function App() {
  return (
    <>
      <GoogleAnalyticsEnhanced />
      {/* rest of app */}
    </>
  );
}
```

## Event Tracking

```tsx
import { trackEvent } from './integrations/google-analytics/analytics';

trackEvent('calculator_used', {
  position_type: 'long',
  leverage: 10,
});
```

## Lovable Deployment Notes

Set `VITE_GA_MEASUREMENT_ID` in Lovable environment variables before deploying.
