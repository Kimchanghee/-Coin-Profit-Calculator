import React, { useMemo, useState } from 'react';
import { PositionType } from '../types';
import type { TranslationKey } from '../types';

interface CalculatorProps {
  t: (key: TranslationKey) => string;
  localeCode: string;
}

interface CalculationResult {
  grossPnl: number;
  netPnl: number;
  roi: number;
  totalFees: number;
  totalValue: number;
}

interface CalculationState {
  error: string;
  data: CalculationResult | null;
}

const Calculator: React.FC<CalculatorProps> = ({ t, localeCode }) => {
  const [positionType, setPositionType] = useState<PositionType>(PositionType.LONG);
  const [entryPrice, setEntryPrice] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [leverage, setLeverage] = useState('10');
  const [investment, setInvestment] = useState('1000');
  const [fee, setFee] = useState('0.075');
  const [paybackEnabled, setPaybackEnabled] = useState(false);
  const [paybackRate, setPaybackRate] = useState('');

  const calculation = useMemo<CalculationState>(() => {
    const shouldValidate = entryPrice.trim() !== '' || targetPrice.trim() !== '';
    if (!shouldValidate) {
      return { error: '', data: null };
    }

    const requiredValues = [entryPrice, targetPrice, leverage, investment, fee];
    if (paybackEnabled) {
      requiredValues.push(paybackRate);
    }

    const hasEmptyField = requiredValues.some(value => value.trim() === '');
    if (hasEmptyField) {
      return { error: t('error_required_fields'), data: null };
    }

    const ep = Number(entryPrice);
    const tp = Number(targetPrice);
    const l = Number(leverage);
    const i = Number(investment);
    const f = Number(fee) / 100;

    if (!Number.isFinite(ep) || !Number.isFinite(tp) || !Number.isFinite(l) || !Number.isFinite(i) || !Number.isFinite(f)) {
      return { error: t('error_invalid_numbers'), data: null };
    }

    if (ep <= 0 || tp <= 0 || l <= 0 || i <= 0 || f < 0) {
      return { error: t('error_invalid_numbers'), data: null };
    }

    let pr = 0;
    if (paybackEnabled) {
      pr = Number(paybackRate) / 100;
      if (!Number.isFinite(pr) || pr < 0 || pr > 1) {
        return { error: t('error_invalid_numbers'), data: null };
      }
    }

    const investmentValue = i * l;
    const units = investmentValue / ep;
    const closingValue = units * tp;

    const grossPnl =
      positionType === PositionType.LONG
        ? closingValue - investmentValue
        : investmentValue - closingValue;

    const entryFee = investmentValue * f;
    const exitFee = closingValue * f;
    const grossFees = entryFee + exitFee;

    const paybackAmount = paybackEnabled ? grossFees * pr : 0;
    const totalFees = grossFees - paybackAmount;

    const netPnl = grossPnl - totalFees;
    const roi = (netPnl / i) * 100;
    const totalValue = i + netPnl;

    // Finite inputs can overflow derived arithmetic.
    if (![investmentValue, units, closingValue, grossPnl, entryFee, exitFee,
      grossFees, paybackAmount, totalFees, netPnl, roi, totalValue].every(Number.isFinite)) {
      return { error: t('error_invalid_numbers'), data: null };
    }

    return {
      error: '',
      data: { grossPnl, netPnl, roi, totalFees, totalValue },
    };
  }, [entryPrice, targetPrice, leverage, investment, fee, positionType, paybackEnabled, paybackRate, t]);

  const resetFields = () => {
    setEntryPrice('');
    setTargetPrice('');
    setLeverage('10');
    setInvestment('1000');
    setFee('0.075');
    setPaybackEnabled(false);
    setPaybackRate('');
  };

  const formatCurrency = (value: number) => {
    try {
      return new Intl.NumberFormat(localeCode, {
        style: 'currency',
        currency: 'USD',
      }).format(value);
    } catch {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(value);
    }
  };

  const formatPercentage = (value: number) => {
    const factor = 100;
    if (Math.abs(value) > Number.MAX_VALUE / factor) return value.toFixed(2);
    const rounded = (Math.sign(value) || 1) * Math.round((Math.abs(value) + Number.EPSILON) * factor) / factor;
    return rounded.toFixed(2);
  };

  const fields = [
    { id: 'entryPrice', label: 'entry_price', value: entryPrice, set: setEntryPrice, placeholder: '50000' },
    { id: 'targetPrice', label: 'target_price', value: targetPrice, set: setTargetPrice, placeholder: '55000' },
    { id: 'investment', label: 'investment', value: investment, set: setInvestment },
    { id: 'leverage', label: 'leverage', value: leverage, set: setLeverage },
    { id: 'fee', label: 'fee_rate', value: fee, set: setFee },
  ] as const;
  const data = calculation.data;
  const preset = (target: string) => {
    setEntryPrice('50000'); setTargetPrice(target); setInvestment('1000');
    setLeverage('10'); setFee('0.075'); setPositionType(PositionType.LONG);
    setPaybackEnabled(false); setPaybackRate('');
  };
  return (
    <section className="calculator" aria-labelledby="calculator-title">
      <div className="calculator-heading"><h1 id="calculator-title">{t('calculator_title')}</h1><span>USD · {t('linear_model')}</span></div>
      <div className="calculator-grid">
        <section className="trade-inputs" aria-labelledby="inputs-title">
          <h2 id="inputs-title">{t('trade_inputs')}</h2>
          <div className="side-switch" role="group" aria-label={t('position_type')}>
            {[PositionType.LONG, PositionType.SHORT].map(side => <button key={side} aria-pressed={positionType === side} onClick={() => setPositionType(side)}>{t(side === PositionType.LONG ? 'long_position' : 'short_position')}</button>)}
          </div>
          <div className="fields">{fields.map(field => <div key={field.id} className={field.id === 'fee' ? 'wide' : ''}>
            <label htmlFor={field.id}>{t(field.label)}</label>
            <input id={field.id} type="number" inputMode="decimal" step="any" value={field.value} placeholder={'placeholder' in field ? field.placeholder : undefined} onChange={e => field.set(e.target.value)} />
          </div>)}</div>
          <div className="payback"><label htmlFor="paybackToggle">{t('referral_payback_toggle')}</label><input id="paybackToggle" type="checkbox" checked={paybackEnabled} onChange={() => setPaybackEnabled(!paybackEnabled)} />
          {paybackEnabled && <div className="wide"><label htmlFor="paybackRate">{t('referral_payback_rate')}</label><input id="paybackRate" type="number" inputMode="decimal" step="any" value={paybackRate} onChange={e => setPaybackRate(e.target.value)} placeholder="20" /></div>}</div>
          <div className="preset-panel"><p>{t('presets_note')}</p><div className="preset-buttons"><button onClick={() => preset('55000')}>{t('preset_up')}</button><button onClick={() => preset('45000')}>{t('preset_down')}</button><button onClick={() => preset('50000')}>{t('preset_flat')}</button></div></div>
          <button className="reset" onClick={resetFields}>{t('reset_button')}</button>
          {calculation.error && <p className="error" role="alert">{calculation.error}</p>}
        </section>
        <aside className="result-panel" aria-labelledby="result-title">
          <h2 id="result-title">{t('results_title')}</h2>
          <div className={'result-display ' + (data && data.netPnl < 0 ? 'negative' : '')} aria-live="polite" aria-atomic="true">
            <span>{t('pnl')}</span><strong data-result="net">{data ? formatCurrency(data.netPnl) : '–'}</strong>
            <div className="roi"><span>{t('roi')}</span><b data-result="roi">{data ? formatPercentage(data.roi) + '%' : '–'}</b></div>
            {!data && <p>{t('empty_result')}</p>}
          </div>
          <section className="pnl-flow" aria-label={t('pnl_flow')}>
            <div><span>{t('gross_pnl')}</span><b data-result="gross">{data ? formatCurrency(data.grossPnl) : '–'}</b></div><i aria-hidden="true">−</i>
            <div><span>{t('fees')}</span><b data-result="fees">{data ? formatCurrency(data.totalFees) : '–'}</b></div><i aria-hidden="true">=</i>
            <div><span>{t('pnl')}</span><b>{data ? formatCurrency(data.netPnl) : '–'}</b></div>
          </section>
          <div className="equity"><span>{t('total_value')}</span><strong data-result="equity">{data ? formatCurrency(data.totalValue) : '–'}</strong></div>
          <p className="limitations">{t('model_limits')}</p>
        </aside>
        {data && <div className="compact-result"><span>{t('pnl')}<strong>{formatCurrency(data.netPnl)}</strong></span><span>{t('roi')}<strong>{formatPercentage(data.roi)}%</strong></span></div>}
      </div>
    </section>
  );
};
export default Calculator;
