import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const node = process.execPath;
const run = (command, args, label) => {
  console.log(`\n=== ${label} ===`);
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    env: process.env,
    stdio: 'inherit',
    windowsHide: true,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${label} failed with exit code ${result.status}`);
};

run(node, [path.join(repoRoot, 'node_modules', 'typescript', 'bin', 'tsc'), '--noEmit'], 'TYPECHECK');
run(node, [path.join(repoRoot, 'scripts', 'smoke-calculator.mjs')], 'CALCULATOR SMOKE');
run(node, [path.join(repoRoot, 'node_modules', 'vite', 'bin', 'vite.js'), 'build'], 'VITE BUILD');

const dist = path.join(repoRoot, 'dist');
const redirects = path.join(dist, '_redirects');
const headers = path.join(dist, '_headers');
const robots = path.join(dist, 'robots.txt');
const sitemap = path.join(dist, 'sitemap.xml');
if (fs.existsSync(redirects)) throw new Error('dist contains _redirects; refusing to package the rejected layout.');
if (!fs.existsSync(headers)) throw new Error('dist is missing _headers.');
const headerText = fs.readFileSync(headers, 'utf8');
if (headerText.includes('/*.html')) throw new Error('dist contains the rejected /*.html header glob.');
const headerBlocks = Object.fromEntries(headerText.trim().split(/\r?\n(?=\/)/).map(block => {
  const [route, ...lines] = block.split(/\r?\n/);
  return [route.trim(), lines.join('\n')];
}));
if (/X-Robots-Tag/i.test(headerBlocks['/*'] || '')) throw new Error('dist applies X-Robots-Tag globally.');
for (const route of ['/discover', '/discover.html']) {
  if (!/X-Robots-Tag:\s*noindex, nofollow, noarchive/i.test(headerBlocks[route] || '')) {
    throw new Error(`dist is missing the scoped discover noindex header for ${route}.`);
  }
}
const robotsText = fs.readFileSync(robots, 'utf8');
if (/^\s*Disallow:/mi.test(robotsText) || !/^Allow:\s*\/$/mi.test(robotsText) || !/^Sitemap:\s*https:\/\/profitcalc\.tech\/sitemap\.xml$/mi.test(robotsText)) {
  throw new Error('dist crawler policy is not open and sitemap-scoped.');
}
const scopedUrls = [
  'https://profitcalc.tech/',
  'https://profitcalc.tech/guides/crypto-futures-profit-formula',
  'https://profitcalc.tech/guides/leverage-roi-calculator',
  'https://profitcalc.tech/guides/long-short-futures-pnl',
  'https://profitcalc.tech/guides/trading-fee-impact',
  'https://profitcalc.tech/about',
  'https://profitcalc.tech/methodology',
];
const staticPages = [
  ['about.html', 'https://profitcalc.tech/about'],
  ['methodology.html', 'https://profitcalc.tech/methodology'],
  ['guides/crypto-futures-profit-formula.html', 'https://profitcalc.tech/guides/crypto-futures-profit-formula'],
  ['guides/leverage-roi-calculator.html', 'https://profitcalc.tech/guides/leverage-roi-calculator'],
  ['guides/long-short-futures-pnl.html', 'https://profitcalc.tech/guides/long-short-futures-pnl'],
  ['guides/trading-fee-impact.html', 'https://profitcalc.tech/guides/trading-fee-impact'],
];
const sitemapUrls = [...fs.readFileSync(sitemap, 'utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
if (JSON.stringify(sitemapUrls) !== JSON.stringify(scopedUrls)) throw new Error('dist sitemap is not the exact seven final clean URLs.');
for (const file of ['index.html', ...staticPages.map(([file]) => file)]) {
  if (/<meta[^>]+noindex/i.test(fs.readFileSync(path.join(dist, file), 'utf8'))) throw new Error(`dist indexable page contains noindex: ${file}`);
}
for (const [file, url] of staticPages) {
  const html = fs.readFileSync(path.join(dist, file), 'utf8');
  for (const tag of [`<link rel="canonical" href="${url}">`, `<meta property="og:url" content="${url}">`, `<meta name="twitter:url" content="${url}">`]) {
    if (!html.includes(tag)) throw new Error(`dist clean self URL metadata is missing: ${file}`);
  }
  if (/href="\/(?:about|methodology|guides\/[^"?#]+)\.html"/i.test(html)) throw new Error(`dist contains a redirecting internal link: ${file}`);
}
for (const file of ['discover.html', '404.html']) {
  if (!/<meta name="robots" content="[^"]*noindex/i.test(fs.readFileSync(path.join(dist, file), 'utf8'))) throw new Error(`dist noindex page lost directive: ${file}`);
}

const releaseZip = path.resolve(repoRoot, 'releases', 'profitcalc-restored.zip');
const packager = path.join(repoRoot, 'scripts', 'package-cloudflare.ps1');
const shell = process.platform === 'win32' ? 'pwsh.exe' : 'pwsh';
run(shell, ['-NoLogo', '-NoProfile', '-NonInteractive', '-File', packager, '-DistPath', dist, '-ZipPath', releaseZip], 'CLOUDFLARE PACKAGE');

console.log('\nCloudflare build completed with seven final clean sitemap URLs, six self-canonical static pages, scoped discover noindex headers, and the 404 HTML meta safeguard.');
