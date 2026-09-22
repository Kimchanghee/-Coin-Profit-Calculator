# ProfitCalc Cloudflare ZIP forensics

Date: 2026-09-22

## Result

The original ProfitCalc archive was a valid ZIP and its container metadata matched the already accepted `calczen-restored.zip`. The dashboard failure was not explained by path separators, filename encoding, CRC, compression, central-directory corruption, archive comments, directory attributes, BOMs, file size, or trailing bytes.

A corrected dashboard-oriented package was rebuilt at:

`D:\웹 수익 자동화\releases\profitcalc-restored.zip`

- Final size: 100,001 bytes
- Final SHA-256: `9FCD03EA30A32B6708DEC52C2EFE2CF59A996A3A0824F1AB0DDE6A571709BB51`
- Entries: 17

## Original versus accepted CalcZen container

| Property | Original ProfitCalc | Accepted CalcZen |
| --- | ---: | ---: |
| ZIP entries | 18 | 61 |
| Compression | DEFLATE, method 8 | DEFLATE, method 8 |
| Version made by | 2.0, host 0/DOS | 2.0, host 0/DOS |
| Version needed | 2.0 | 2.0 |
| General-purpose flags | `0x0000` | `0x0000` |
| UTF-8 filename flag | Off, all names ASCII | Off, all names ASCII |
| External attributes | `0x00000000` | `0x00000000` |
| Extra fields | None | None |
| Directory entries | None | None |
| Archive comment | None | None |
| Leading/trailing bytes | None | None |
| Path separators | Forward slash only | Forward slash only |
| Local/central names | Exact match | Exact match |
| BOMs in packaged text | None | None |

The original ProfitCalc archive also opened and extracted successfully through .NET and native `tar`, and every entry decompressed correctly.

## Compatibility changes in the corrected upload ZIP

The compatibility layout is now part of the source build rather than a one-off staging transformation.

- All 17 ZIP entries are byte-identical to the final tested `dist/`.
- `_redirects` is absent from both `public/` and the generated ZIP. The parent should configure the www-to-apex redirect separately at Cloudflare.
- `_headers` remains UTF-8 without BOM and LF-only, but its route blocks are limited to the simple style already accepted in CalcZen:
  - global `/*` security and noindex headers
  - `/assets/*` immutable cache headers
  - `/robots.txt` revalidation
- The unique `/*.html` cache glob from the failed package was removed.
- The archive was rebuilt with the same .NET `ZipFile.CreateFromDirectory` conventions observed in CalcZen.

These compatibility changes targeted the remaining plausible dashboard package-parser difference. The user subsequently reported that deployment `f7cbab54` succeeded with the corrected 17-file layout.

The later visible-QA fix updates the Korean disclaimer and required-fields text, removes duplicated unit suffixes, and removes the inactive sponsored component from the active bundle. Calculator equations, controls, other locale files, routes, 404 page, robots lock, sitemap, verification files, and analytics behavior remain preserved.

## Corrected archive verification

- 17/17 entries passed CRC and uncompressed-size verification.
- Central-directory boundaries and EOCD boundaries match exactly.
- No absolute paths, `..` segments, backslashes, directory entries, comments, extra fields, or trailing bytes.
- Native `tar -tf` accepted the archive.
- Extraction succeeded.
- 17/17 files matched the final tested `dist/` by SHA-256.
- `_headers` is 447 bytes, UTF-8 without BOM, LF-only.
- `_redirects` is absent.

`build:cloudflare` now runs typecheck, arithmetic/UI smoke checks, Vite, control-file validation, and the .NET ZIP packager. No browser or deployment action was performed by this agent.
