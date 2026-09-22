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
