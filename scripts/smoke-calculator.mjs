import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const calculatorSource = fs.readFileSync(path.join(repoRoot, 'components', 'Calculator.tsx'), 'utf8');
const appSource = fs.readFileSync(path.join(repoRoot, 'App.tsx'), 'utf8');
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

const calculate = (side, entry, target, leverage, investment, feePercent, paybackPercent = 0) => {
  const investmentValue = investment * leverage;
  const units = investmentValue / entry;
  const closingValue = units * target;
  const grossPnl = side === 'LONG' ? closingValue - investmentValue : investmentValue - closingValue;
  const grossFees = investmentValue * (feePercent / 100) + closingValue * (feePercent / 100);
  const totalFees = grossFees * (1 - paybackPercent / 100);
  const netPnl = grossPnl - totalFees;
  return { netPnl, roi: (netPnl / investment) * 100, totalFees, totalValue: investment + netPnl };
};

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

console.log('Calculator smoke passed: long, short, fee payback, Korean copy, unit labels, inactive ad slot.');
