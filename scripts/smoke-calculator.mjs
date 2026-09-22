import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const calculatorSource = fs.readFileSync(path.join(repoRoot, 'components', 'Calculator.tsx'), 'utf8');
const appSource = fs.readFileSync(path.join(repoRoot, 'App.tsx'), 'utf8');
const translationHookSource = fs.readFileSync(path.join(repoRoot, 'hooks', 'useTranslations.ts'), 'utf8');
const korean = JSON.parse(fs.readFileSync(path.join(repoRoot, 'locales', 'ko.json'), 'utf8'));

const requiredEquations = [
  'const investmentValue = i * l',
  'const units = investmentValue / ep',
  'const closingValue = units * tp',
  'const totalFees = grossFees - paybackAmount',
  'const roi = (netPnl / i) * 100',
];

for (const equation of requiredEquations) {
  if (!calculatorSource.includes(equation)) {
    throw new Error(`Calculator equation missing: ${equation}`);
  }
}

for (const duplicateLabel of ["{t('leverage')} (x)", "{t('investment')} ($)", "{t('fee_rate')} (%)"]) {
  if (calculatorSource.includes(duplicateLabel)) {
    throw new Error(`Duplicate unit label remains: ${duplicateLabel}`);
  }
}

if (appSource.includes('SafeInlineSponsored')) {
  throw new Error('Inactive sponsored slot is still mounted in App.tsx');
}

if (korean.disclaimer !== '면책 고지: 암호화폐 선물 거래에는 큰 손실 위험이 있습니다. 이 계산 결과는 정보 제공용이며 투자 조언이 아닙니다.') {
  throw new Error('Korean disclaimer regression');
}
if (korean.error_required_fields !== '먼저 모든 필수 입력값을 입력해 주세요.') {
  throw new Error('Korean required-fields message regression');
}

// Execute the actual React useMemo callback, not a duplicate formula implementation.
const callbackStart = calculatorSource.indexOf('    const shouldValidate =');
const callbackEnd = calculatorSource.indexOf('  }, [entryPrice', callbackStart);
if (callbackStart < 0 || callbackEnd < 0) throw new Error('Calculation callback not located');
const runActual = new Function('entryPrice','targetPrice','leverage','investment','fee','positionType','paybackEnabled','paybackRate','t','PositionType', calculatorSource.slice(callbackStart,callbackEnd));
const actualState = (entry, target, leverage='10', investment='1000', fee='0.075', enabled=false, rate='', side='LONG') => runActual(String(entry), String(target), String(leverage), String(investment), String(fee), side, enabled, String(rate), key=>key, {LONG:'LONG',SHORT:'SHORT'});
const calculate = (side, entry, target, leverage, investment, fee, payback=0) => actualState(entry,target,leverage,investment,fee,payback!==0,payback,side).data;
for (const args of [['','50000'],['0','50000'],['-1','50000'],['NaN','50000'],['Infinity','50000'],['50000','55000','','1000'],['50000','55000','10','1000','-1'],['50000','55000','10','1000','0.075',true,''],['50000','55000','10','1000','0.075',true,'101'],['50000','55000','10','1000','0.075',true,'-1']]) {
 const state=actualState(...args); if(!state.error || state.data) throw new Error('Invalid state accepted: '+args);
}
const blank=actualState('',''); if(blank.error || blank.data) throw new Error('Blank initial state changed');
if(calculate('LONG',50000,50000,10,1000,.075).netPnl !== -15) throw new Error('Flat-price fee regression');
if(calculate('LONG',50000,55000,10,1000,.075,100).totalFees !== 0) throw new Error('100% payback regression');
if(calculate('LONG',50000,55000,10,1000,0).netPnl !== 1000) throw new Error('Zero fee regression');
if(!actualState(50000,55000,500,1000,6).data) throw new Error('Existing uncapped fee/leverage validation changed');
const locales=fs.readdirSync(path.join(repoRoot,'locales')).filter(f=>f.endsWith('.json'));
const english=JSON.parse(fs.readFileSync(path.join(repoRoot,'locales/en.json'),'utf8'));
if(locales.length!==10) throw new Error('Locale count regression');
for(const file of locales){const data=JSON.parse(fs.readFileSync(path.join(repoRoot,'locales',file),'utf8'));for(const key of Object.keys(english)){if(typeof data[key]!=='string'||!data[key].trim())throw new Error(file+' missing '+key);}}
const index=fs.readFileSync(path.join(repoRoot,'index.html'),'utf8');
const schema=JSON.parse(index.match(/<script type="application\/ld\+json" id="structured-data">([\s\S]*?)<\/script>/)[1]);
for(const item of schema['@graph'].find(x=>x['@type']==='FAQPage').mainEntity){if(!index.includes('<h2>'+item.name+'</h2><p>'+item.acceptedAnswer.text+'</p>'))throw new Error('FAQ body/schema mismatch');}
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
  ['public/about.html','https://profitcalc.tech/about'],
  ['public/methodology.html','https://profitcalc.tech/methodology'],
  ['public/guides/crypto-futures-profit-formula.html','https://profitcalc.tech/guides/crypto-futures-profit-formula'],
  ['public/guides/leverage-roi-calculator.html','https://profitcalc.tech/guides/leverage-roi-calculator'],
  ['public/guides/long-short-futures-pnl.html','https://profitcalc.tech/guides/long-short-futures-pnl'],
  ['public/guides/trading-fee-impact.html','https://profitcalc.tech/guides/trading-fee-impact'],
];
const indexableFiles = ['index.html',...staticPages.map(([file])=>file)];
if(indexableFiles.length!==7)throw new Error('Indexable page count regression');
for(const file of indexableFiles){const text=fs.readFileSync(path.join(repoRoot,file),'utf8');if(/<meta[^>]+noindex/i.test(text)||/liquidat/i.test(text))throw new Error('Indexability/claim regression: '+file);}
for(const [file,url] of staticPages){const text=fs.readFileSync(path.join(repoRoot,file),'utf8');for(const tag of [`<link rel="canonical" href="${url}">`,`<meta property="og:url" content="${url}">`,`<meta name="twitter:url" content="${url}">`])if(!text.includes(tag))throw new Error('Clean self URL metadata missing: '+file);if(/href="\/(?:about|methodology|guides\/[^"?#]+)\.html"/i.test(text))throw new Error('Redirecting internal link remains: '+file);}
if((index.match(/<link rel="canonical" href="https:\/\/profitcalc\.tech\/" \/>/g)||[]).length!==1)throw new Error('Homepage root canonical changed');
if(/<link rel="alternate"[^>]+\?lang=/i.test(index))throw new Error('Query-language hreflang returned');
if(/<meta\s+name="keywords"/i.test(index)||translationHookSource.includes('meta_keywords'))throw new Error('Unsupported keyword metadata returned');
if(translationHookSource.includes('link[rel="canonical"]')||translationHookSource.includes('og:url')||translationHookSource.includes('twitter:url')||translationHookSource.includes('buildCanonicalUrl'))throw new Error('Locale hook mutates static URL metadata');
if(!translationHookSource.includes('buildLocalizedUrl')||!translationHookSource.includes('replaceState'))throw new Error('Ten-locale query UX was removed');
const sitemap=fs.readFileSync(path.join(repoRoot,'public/sitemap.xml'),'utf8');
const sitemapUrls=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match=>match[1]);
if(JSON.stringify(sitemapUrls)!==JSON.stringify(scopedUrls))throw new Error('Sitemap must contain exactly the seven scoped URLs');
for(const file of ['public/discover.html','public/404.html']){const text=fs.readFileSync(path.join(repoRoot,file),'utf8');if(!/<meta name="robots" content="[^"]*noindex/i.test(text))throw new Error('Noindex missing: '+file);}
if(fs.existsSync(path.join(repoRoot,'public/_redirects')))throw new Error('Redirect file added');
const headers=fs.readFileSync(path.join(repoRoot,'public/_headers'),'utf8');
const headerBlocks=Object.fromEntries(headers.trim().split(/\r?\n(?=\/)/).map(block=>{const [route,...lines]=block.split(/\r?\n/);return [route.trim(),lines.join('\n')];}));
if(/X-Robots-Tag/i.test(headerBlocks['/*']||''))throw new Error('Global X-Robots-Tag returned');
for(const route of ['/discover','/discover.html'])if(!/X-Robots-Tag:\s*noindex, nofollow, noarchive/i.test(headerBlocks[route]||''))throw new Error('Scoped discover noindex header missing: '+route);
const robots=fs.readFileSync(path.join(repoRoot,'public/robots.txt'),'utf8');
if(/^\s*Disallow:/mi.test(robots)||!/^Allow:\s*\/$/mi.test(robots)||!/^Sitemap:\s*https:\/\/profitcalc\.tech\/sitemap\.xml$/mi.test(robots))throw new Error('Crawler policy regression');

const close = (actual, expected) => Math.abs(actual - expected) < 1e-9;
const cases = [
  ['long', calculate('LONG', 50000, 55000, 10, 1000, 0.075), { netPnl: 984.25, roi: 98.425, totalFees: 15.75, totalValue: 1984.25 }],
  ['short', calculate('SHORT', 50000, 45000, 10, 1000, 0.075), { netPnl: 985.75, roi: 98.575, totalFees: 14.25, totalValue: 1985.75 }],
  ['payback', calculate('LONG', 50000, 55000, 10, 1000, 0.075, 20), { netPnl: 987.4, roi: 98.74, totalFees: 12.6, totalValue: 1987.4 }],
];

for (const [name, actual, expected] of cases) {
  for (const key of Object.keys(expected)) {
    if (!close(actual[key], expected[key])) {
      throw new Error(`${name} ${key}: expected ${expected[key]}, got ${actual[key]}`);
    }
  }
}

console.log('Calculator smoke passed: arithmetic, 10 locales, matching FAQ, seven final clean sitemap URLs, six self-canonical static pages, scoped discover headers, and 404 meta safeguard.');

// Review regression cases: all inputs are finite, but intermediate arithmetic is not.
for (const args of [
  [50000, 55000, 1e308, 1000, 0], // position value
  [1e-308, 1, 10, 1000, 0], // quantity
  [1, 1e308, 10, 1000, 0], // closing value
  [1, 1, 1, 1e308, 200], // individual fees
  [1, 1, 1, 1e308, 100], // fee sum
  [1, 2, 1e308, 1e-308, 0], // ROI
  [1, 2, 1, 8e307, 0, false, '', 'SHORT'], // finite loss control
]) {
  const state = actualState(...args);
  if (args[7] === 'SHORT') {
    if (!state.data) throw new Error('Finite large loss incorrectly rejected');
  } else if (state.data || state.error !== 'error_invalid_numbers') {
    throw new Error('Derived overflow was not rejected: ' + args);
  }
}
const fallback = index.match(/<noscript>([\s\S]*?)<\/noscript>/)?.[1];
if (!fallback?.includes('class="semantic-copy"')) throw new Error('Semantic fallback must be no-JS only');
if (index.replace(/<noscript>[\s\S]*?<\/noscript>/g, '').includes('class="semantic-copy"')) throw new Error('Duplicate always-visible fallback');
const reference = JSON.parse(fs.readFileSync(path.join(repoRoot, 'data/calculator-reference.json'), 'utf8'));
const faq = schema['@graph'].find(x => x['@type'] === 'FAQPage').mainEntity;
for (const [i, item] of reference.entries()) {
  if (item.question !== faq[i].name || item.answer !== faq[i].acceptedAnswer.text || !fallback.includes(item.answer)) throw new Error('React/static/schema FAQ drift');
}
const linksSource = fs.readFileSync(path.join(repoRoot, 'components/ExposureLinks.tsx'), 'utf8');
if (!linksSource.includes('referenceAnswers.map') || !appSource.includes('<ExposureLinks t={t} />')) throw new Error('React guides or answers missing');
const guideContracts = {
  'crypto-futures-profit-formula': ['From margin to position quantity', '$984.25'],
  'leverage-roi-calculator': ['The denominator matters', '49.2125%'],
  'long-short-futures-pnl': ['The two gross PnL branches', '$985.75'],
  'trading-fee-impact': ['Fees can reverse a small gain', '−$5.0075'],
};
for (const [slug, markers] of Object.entries(guideContracts)) {
  const text = fs.readFileSync(path.join(repoRoot, 'public/guides', slug + '.html'), 'utf8');
  for (const marker of markers) if (!text.includes(marker)) throw new Error('Specialized guide missing ' + marker);
  if (text.replace(/<[^>]*>/g, ' ').split(/\s+/).length < 400) throw new Error('Guide content too thin: ' + slug);
}
for (const [name, actual, expected] of [
  ['1x long', calculate('LONG', 50000, 55000, 1, 1000, .075), {netPnl:98.425,roi:9.8425}],
  ['5x long', calculate('LONG', 50000, 55000, 5, 1000, .075), {netPnl:492.125,roi:49.2125}],
  ['adverse long', calculate('LONG', 50000, 45000, 10, 1000, .075), {netPnl:-1014.25,totalValue:-14.25}],
  ['adverse short', calculate('SHORT', 50000, 55000, 10, 1000, .075), {netPnl:-1015.75}],
  ['small gain after fees', calculate('LONG', 50000, 50050, 10, 1000, .075), {netPnl:-5.0075,roi:-.50075}],
]) for (const key of Object.keys(expected)) if (!close(actual[key], expected[key])) throw new Error(name + ' example mismatch');
if (!fs.readFileSync(path.join(repoRoot, '.gitignore'), 'utf8').split(/\r?\n/).includes('releases/')) throw new Error('Release ZIP is not ignored');
console.log('Review regressions passed: overflow guards, fallback visibility, React FAQ parity, substantive guides and ignored ZIP.');

const percentageStart = calculatorSource.indexOf('    const factor = 100;');
const percentageEnd = calculatorSource.indexOf('  };', percentageStart);
const formatActualPercentage = new Function('value', calculatorSource.slice(percentageStart, percentageEnd));
if (/Infinity|NaN/.test(formatActualPercentage(1e308))) throw new Error('Finite ROI overflowed during display rounding');
if (formatActualPercentage(98.425) !== '98.43' || formatActualPercentage(-101.425) !== '-101.43') throw new Error('ROI rounding regression');
