# Google AdSense Integration

This module integrates AdSense ad units into the app.

## Required Env Vars

```env
VITE_ADSENSE_CLIENT_ID=ca-pub-1234567890123456
VITE_ADSENSE_SLOT_SIDEBAR_TOP=1234567890
VITE_ADSENSE_SLOT_SIDEBAR_BOTTOM=0987654321
VITE_ADSENSE_SLOT_HEADER_BANNER=1122334455
VITE_ADSENSE_SLOT_FOOTER_BANNER=5544332211
VITE_ADSENSE_SLOT_IN_ARTICLE=6677889900
```

## Basic Usage

```tsx
import AdUnitEnhanced from './integrations/google-adsense/AdUnitEnhanced';

<AdUnitEnhanced slotKey="sidebarTop" />
```

## Optional Global Script

Add to `<head>` in `index.html` if required by your ad strategy:

```html
<script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456"
  crossorigin="anonymous"
></script>
```

## Lovable Deployment Notes

Set all `VITE_ADSENSE_*` variables in Lovable environment variables.
