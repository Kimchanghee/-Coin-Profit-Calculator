# ProfitCalc implementation and review remediation

## Review blockers resolved

1. index.html static explanation is inside noscript. React ExposureLinks restores all four links with localized labels in ten locales, localizes the always-visible limitations, and puts explicitly labeled English reference answers behind details. data/calculator-reference.json, FAQ JSON-LD and the no-JS fallback are checked for exact question/answer parity.
2. Calculator.tsx rejects non-finite derived position value, quantity, closing value, gross PnL, entry/exit/gross/net fees, payback, net PnL, ROI and equity using the existing localized invalid-number error. Original finite formulas and input constraints are unchanged. Large finite ROI formatting is protected against scaling overflow.
3. Four distinct guides now provide topic-specific explanations, examples, validation, precision and limitations. They reference the active calculation implementation, not unverified exchange claims. Smoke tests verify their numeric examples and minimum substantive content.
4. README now states the in-repository releases/profitcalc-restored.zip path, dynamic package count validation (currently 19), actual WebApplication/FAQPage schemas, index.html language alternates and absence of sitemap hreflang. Whitespace is clean.
5. releases/ is ignored. git check-ignore confirms the ZIP is ignored; git ls-files releases returns no tracked release files.

## Verification

- npm run typecheck: passed; direct TypeScript executable confirmed exit 0 after a runtime npm-wrapper exit-code anomaly.
- npm run smoke:calculator: passed.
- npm run build:cloudflare: passed, including internal direct typecheck, smoke, Vite build and PowerShell packaging.
- git diff --check: exit 0.
- Fresh ZIP: releases/profitcalc-restored.zip, 19 files, 109172 bytes.
- SHA256: 3287FA2972F4DF7D01FB89C33532F241122479492D894714B8644978EE85B9AD.
- Every ZIP entry SHA256 matches the corresponding fresh dist file.
- No _redirects added. Meta noindex, robots Disallow, _headers X-Robots-Tag and 404.html retained.
- No commit, push or deployment performed. All changes remain within profitcalc-original.

## Scope of evidence

This review pass verifies source, actual-callback arithmetic, semantic contracts, build and archive parity. It does not establish production HTTP 404/header behavior or new browser/mobile visual verification. The existing Browserslist database age warning is non-blocking. English guides and opt-in reference answers are clearly labeled; interactive labels retain all ten locales.
