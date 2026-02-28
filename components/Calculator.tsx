import React, { useMemo, useState } from 'react';
import { PositionType } from '../types';
import type { TranslationKey } from '../types';

interface CalculatorProps {
  t: (key: TranslationKey) => string;
  localeCode: string;
}

interface CalculationResult {
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

    return {
      error: '',
      data: { netPnl, roi, totalFees, totalValue },
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

  return (
    <div className="bg-gray-950 p-6 rounded-lg shadow-lg border border-gray-800">
      <h2 className="text-2xl font-bold mb-6 text-cyan-400">{t('calculator_title')}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-400 mb-2">{t('position_type')}</label>
          <div className="flex bg-gray-900 rounded-md p-1 border border-gray-700">
            <button
              onClick={() => setPositionType(PositionType.LONG)}
              className={`w-1/2 py-2 text-sm font-semibold rounded transition-colors ${
                positionType === PositionType.LONG
                  ? 'bg-green-500 text-white shadow-md'
                  : 'text-gray-400 hover:bg-gray-800'
              }`}
            >
              {t('long_position')}
            </button>
            <button
              onClick={() => setPositionType(PositionType.SHORT)}
              className={`w-1/2 py-2 text-sm font-semibold rounded transition-colors ${
                positionType === PositionType.SHORT
                  ? 'bg-red-500 text-white shadow-md'
                  : 'text-gray-400 hover:bg-gray-800'
              }`}
            >
              {t('short_position')}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="entryPrice" className="block text-sm font-medium text-gray-400">
            {t('entry_price')}
          </label>
          <input
            type="number"
            id="entryPrice"
            value={entryPrice}
            onChange={e => setEntryPrice(e.target.value)}
            className="mt-1 block w-full bg-gray-900 border-gray-700 rounded-md shadow-sm p-2 focus:ring-cyan-500 focus:border-cyan-500"
            placeholder="50000"
          />
        </div>

        <div>
          <label htmlFor="targetPrice" className="block text-sm font-medium text-gray-400">
            {t('target_price')}
          </label>
          <input
            type="number"
            id="targetPrice"
            value={targetPrice}
            onChange={e => setTargetPrice(e.target.value)}
            className="mt-1 block w-full bg-gray-900 border-gray-700 rounded-md shadow-sm p-2 focus:ring-cyan-500 focus:border-cyan-500"
            placeholder="55000"
          />
        </div>

        <div>
          <label htmlFor="leverage" className="block text-sm font-medium text-gray-400">
            {t('leverage')} (x)
          </label>
          <input
            type="number"
            id="leverage"
            value={leverage}
            onChange={e => setLeverage(e.target.value)}
            className="mt-1 block w-full bg-gray-900 border-gray-700 rounded-md shadow-sm p-2 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>

        <div>
          <label htmlFor="investment" className="block text-sm font-medium text-gray-400">
            {t('investment')} ($)
          </label>
          <input
            type="number"
            id="investment"
            value={investment}
            onChange={e => setInvestment(e.target.value)}
            className="mt-1 block w-full bg-gray-900 border-gray-700 rounded-md shadow-sm p-2 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="fee" className="block text-sm font-medium text-gray-400">
            {t('fee_rate')} (%)
          </label>
          <input
            type="number"
            id="fee"
            value={fee}
            onChange={e => setFee(e.target.value)}
            className="mt-1 block w-full bg-gray-900 border-gray-700 rounded-md shadow-sm p-2 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>

        <div className="md:col-span-2 bg-gray-900/70 p-4 rounded-md border border-gray-800">
          <div className="flex items-center justify-between">
            <label htmlFor="paybackToggle" className="text-sm font-medium text-gray-300">
              {t('referral_payback_toggle')}
            </label>
            <input
              type="checkbox"
              id="paybackToggle"
              checked={paybackEnabled}
              onChange={() => setPaybackEnabled(!paybackEnabled)}
              className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-cyan-500 focus:ring-cyan-600"
            />
          </div>
          {paybackEnabled && (
            <div className="mt-3">
              <label htmlFor="paybackRate" className="block text-sm font-medium text-gray-400">
                {t('referral_payback_rate')}
              </label>
              <input
                type="number"
                id="paybackRate"
                value={paybackRate}
                onChange={e => setPaybackRate(e.target.value)}
                className="mt-1 block w-full bg-gray-900 border-gray-700 rounded-md shadow-sm p-2 focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="20"
              />
            </div>
          )}
        </div>
      </div>

      <button
        onClick={resetFields}
        className="w-full mt-4 py-2 px-4 border border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-300 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-600"
      >
        {t('reset_button')}
      </button>

      {calculation.error && <div className="mt-4 text-red-400 text-center">{calculation.error}</div>}

      {calculation.data && !calculation.error && (
        <div className="mt-6 pt-6 border-t border-gray-800">
          <h3 className="text-xl font-bold mb-4 text-center text-cyan-300">{t('results_title')}</h3>
          <div className="space-y-3">
            <div
              className={`flex justify-between items-center p-3 rounded-md ${
                calculation.data.netPnl >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'
              }`}
            >
              <span className="font-semibold text-gray-300">{t('pnl')}</span>
              <span
                className={`font-bold text-lg ${
                  calculation.data.netPnl >= 0 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {formatCurrency(calculation.data.netPnl)}
              </span>
            </div>
            <div
              className={`flex justify-between items-center p-3 rounded-md ${
                calculation.data.roi >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'
              }`}
            >
              <span className="font-semibold text-gray-300">{t('roi')}</span>
              <span
                className={`font-bold text-lg ${
                  calculation.data.roi >= 0 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {calculation.data.roi.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between p-3 bg-gray-900/50 rounded-md">
              <span className="font-semibold text-gray-400">{t('fees')}</span>
              <span className="text-gray-300">{formatCurrency(calculation.data.totalFees)}</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-900/50 rounded-md">
              <span className="font-semibold text-gray-400">{t('total_value')}</span>
              <span className="text-gray-300">{formatCurrency(calculation.data.totalValue)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calculator;