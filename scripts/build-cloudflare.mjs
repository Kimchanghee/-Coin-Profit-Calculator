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
if (fs.existsSync(redirects)) throw new Error('dist contains _redirects; refusing to package the rejected layout.');
if (!fs.existsSync(headers)) throw new Error('dist is missing _headers.');
if (fs.readFileSync(headers, 'utf8').includes('/*.html')) throw new Error('dist contains the rejected /*.html header glob.');
if (!fs.readFileSync(robots, 'utf8').includes('Disallow: /')) throw new Error('restoration QA robots lock is missing.');

const releaseZip = path.resolve(repoRoot, 'releases', 'profitcalc-restored.zip');
const packager = path.join(repoRoot, 'scripts', 'package-cloudflare.ps1');
const shell = process.platform === 'win32' ? 'pwsh.exe' : 'pwsh';
run(shell, ['-NoLogo', '-NoProfile', '-NonInteractive', '-File', packager, '-DistPath', dist, '-ZipPath', releaseZip], 'CLOUDFLARE PACKAGE');

console.log('\nCloudflare build completed with the accepted no-redirects, simplified-headers layout.');
