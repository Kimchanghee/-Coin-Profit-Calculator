param(
  [Parameter(Mandatory = $true)][string]$DistPath,
  [Parameter(Mandatory = $true)][string]$ZipPath
)

$ErrorActionPreference = 'Stop'
$dist = (Resolve-Path -LiteralPath $DistPath).Path

if (Test-Path -LiteralPath (Join-Path $dist '_redirects')) {
  throw 'Cloudflare package must not contain _redirects.'
}

$headersPath = Join-Path $dist '_headers'
if (-not (Test-Path -LiteralPath $headersPath)) {
  throw 'Cloudflare package is missing _headers.'
}
$headers = [IO.File]::ReadAllText($headersPath)
if ($headers.Contains('/*.html')) {
  throw 'Cloudflare package contains the rejected /*.html header glob.'
}
if (-not $headers.Contains('/assets/*')) {
  throw 'Cloudflare package is missing the immutable asset rule.'
}
$globalBlock = [regex]::Match($headers, '(?ms)^/\*\r?\n(.*?)(?=^/\S|\z)').Groups[1].Value
if ($globalBlock -match 'X-Robots-Tag') {
  throw 'Cloudflare package must not apply X-Robots-Tag globally.'
}
foreach ($route in @('/discover', '/discover.html')) {
  $escapedRoute = [regex]::Escape($route)
  if ($headers -notmatch "(?ms)^$escapedRoute\r?\n(?:(?!^/\S).)*X-Robots-Tag:\s*noindex, nofollow, noarchive") {
    throw "Cloudflare package is missing the scoped discover noindex rule for $route."
  }
}

$robotsPath = Join-Path $dist 'robots.txt'
$robots = [IO.File]::ReadAllText($robotsPath)
if ($robots -match '(?mi)^\s*Disallow:' -or $robots -notmatch '(?mi)^Allow:\s*/$' -or $robots -notmatch '(?mi)^Sitemap:\s*https://profitcalc\.tech/sitemap\.xml$') {
  throw 'Cloudflare package crawler policy is not open and sitemap-scoped.'
}

$expectedLocs = @(
  'https://profitcalc.tech/',
  'https://profitcalc.tech/guides/crypto-futures-profit-formula',
  'https://profitcalc.tech/guides/leverage-roi-calculator',
  'https://profitcalc.tech/guides/long-short-futures-pnl',
  'https://profitcalc.tech/guides/trading-fee-impact',
  'https://profitcalc.tech/about',
  'https://profitcalc.tech/methodology'
)
$sitemap = [IO.File]::ReadAllText((Join-Path $dist 'sitemap.xml'))
$actualLocs = [regex]::Matches($sitemap, '<loc>(.*?)</loc>') | ForEach-Object { $_.Groups[1].Value }
if (($actualLocs.Count -ne $expectedLocs.Count) -or (Compare-Object $expectedLocs $actualLocs -SyncWindow 0)) {
  throw 'Cloudflare package sitemap is not the exact seven final clean URLs.'
}

$staticPages = @(
  @{ File = 'about.html'; Url = 'https://profitcalc.tech/about' },
  @{ File = 'methodology.html'; Url = 'https://profitcalc.tech/methodology' },
  @{ File = 'guides/crypto-futures-profit-formula.html'; Url = 'https://profitcalc.tech/guides/crypto-futures-profit-formula' },
  @{ File = 'guides/leverage-roi-calculator.html'; Url = 'https://profitcalc.tech/guides/leverage-roi-calculator' },
  @{ File = 'guides/long-short-futures-pnl.html'; Url = 'https://profitcalc.tech/guides/long-short-futures-pnl' },
  @{ File = 'guides/trading-fee-impact.html'; Url = 'https://profitcalc.tech/guides/trading-fee-impact' }
)
foreach ($page in $staticPages) {
  $html = [IO.File]::ReadAllText((Join-Path $dist $page.File))
  foreach ($tag in @(
    "<link rel=`"canonical`" href=`"$($page.Url)`">",
    "<meta property=`"og:url`" content=`"$($page.Url)`">",
    "<meta name=`"twitter:url`" content=`"$($page.Url)`">"
  )) {
    if (-not $html.Contains($tag)) {
      throw "Cloudflare package clean self URL metadata is missing: $($page.File)"
    }
  }
  if ($html -match 'href="/(?:about|methodology|guides/[^"?#]+)\.html"') {
    throw "Cloudflare package contains a redirecting internal link: $($page.File)"
  }
}

$notFoundHtml = [IO.File]::ReadAllText((Join-Path $dist '404.html'))
if ($notFoundHtml -notmatch '<meta name="robots" content="[^"]*noindex') {
  throw 'Cloudflare package 404 HTML lost its page-level noindex directive.'
}

$parent = Split-Path -Parent $ZipPath
New-Item -ItemType Directory -Force -Path $parent | Out-Null
if (Test-Path -LiteralPath $ZipPath) {
  Remove-Item -LiteralPath $ZipPath -Force
}

Add-Type -AssemblyName System.IO.Compression.FileSystem
[IO.Compression.ZipFile]::CreateFromDirectory(
  $dist,
  $ZipPath,
  [IO.Compression.CompressionLevel]::Optimal,
  $false
)

$archive = [IO.Compression.ZipFile]::OpenRead($ZipPath)
try {
  $sourceFiles = Get-ChildItem -LiteralPath $dist -Recurse -File
  if ($archive.Entries.Count -ne $sourceFiles.Count) {
    throw "ZIP entry count $($archive.Entries.Count) does not match dist file count $($sourceFiles.Count)."
  }
  if ($archive.GetEntry('_redirects')) {
    throw 'Generated ZIP unexpectedly contains _redirects.'
  }
  if (-not $archive.GetEntry('_headers')) {
    throw 'Generated ZIP is missing _headers.'
  }
  if ($archive.Entries | Where-Object { $_.FullName.Contains('\') }) {
    throw 'Generated ZIP contains backslash path separators.'
  }
} finally {
  $archive.Dispose()
}

$hash = Get-FileHash -LiteralPath $ZipPath -Algorithm SHA256
$info = Get-Item -LiteralPath $ZipPath
Write-Output "Cloudflare ZIP: $($info.FullName)"
Write-Output "Files: $($sourceFiles.Count)"
Write-Output "Bytes: $($info.Length)"
Write-Output "SHA256: $($hash.Hash)"
