import React, { useState, useMemo } from 'react';
import { PositionType } from '../types';
import type { TranslationKey } from '../types';

interface CalculatorProps {
  t: (key: TranslationKey) => string;
}

const Calculator: React.FC<CalculatorProps> = ({ t }) => {
    const [positionType, setPositionType] = useState<PositionType>(PositionType.LONG);
    const [entryPrice, setEntryPrice] = useState('');
    const [targetPrice, setTargetPrice] = useState('');
    const [leverage, setLeverage] = useState('10');
    const [investment, setInvestment] = useState('1000');
    const [fee, setFee] = useState('0.075');
    const [paybackEnabled, setPaybackEnabled] = useState(false);
    const [paybackRate, setPaybackRate] = useState('');
    
    const [error, setError] = useState('');

    const results = useMemo(() => {
        const ep = parseFloat(entryPrice);
        const tp = parseFloat(targetPrice);
        const l = parseFloat(leverage);
        const i = parseFloat(investment);
        const f = parseFloat(fee) / 100;
        const pr = parseFloat(paybackRate) / 100;

        if (isNaN(ep) || isNaN(tp) || isNaN(l) || isNaN(i) || isNaN(f) || ep <= 0 || l <= 0 || i <= 0) {
            if(entryPrice || targetPrice || leverage || investment || fee) {
              setError(t('error_invalid_numbers'));
            } else {
              setError('');
            }
            return null;
        }
        setError('');

        const investmentValue = i * l;
        const units = investmentValue / ep;
        const closingValue = units * tp;

        const grossPnl = positionType === PositionType.LONG ? (closingValue - investmentValue) : (investmentValue - closingValue);
        
        const entryFee = investmentValue * f;
        const exitFee = closingValue * f;
        const grossFees = entryFee + exitFee;
        
        const paybackAmount = paybackEnabled && !isNaN(pr) && pr > 0 ? grossFees * pr : 0;
        const totalFees = grossFees - paybackAmount;

        const netPnl = grossPnl - totalFees;
        const roi = (netPnl / i) * 100;
        const totalValue = i + netPnl;

        return { netPnl, roi, totalFees, totalValue };
    }, [entryPrice, targetPrice, leverage, investment, fee, positionType, paybackEnabled, paybackRate, t]);

    const resetFields = () => {
        setEntryPrice('');
        setTargetPrice('');
        setLeverage('10');
        setInvestment('1000');
        setFee('0.075');
        setPaybackEnabled(false);
        setPaybackRate('');
        setError('');
    };

    const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

    return (
        <div className="bg-gray-950 p-6 rounded-lg shadow-lg border border-gray-800">
            <h2 className="text-2xl font-bold mb-6 text-cyan-400">{t('calculator_title')}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                 {/* Position Type Toggle */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-2">{t('position_type')}</label>
                    <div className="flex bg-gray-900 rounded-md p-1 border border-gray-700">
                        <button onClick={() => setPositionType(PositionType.LONG)} className={`w-1/2 py-2 text-sm font-semibold rounded transition-colors ${positionType === PositionType.LONG ? 'bg-green-500 text-white shadow-md' : 'text-gray-400 hover:bg-gray-800'}`}>{t('long_position')}</button>
                        <button onClick={() => setPositionType(PositionType.SHORT)} className={`w-1/2 py-2 text-sm font-semibold rounded transition-colors ${positionType === PositionType.SHORT ? 'bg-red-500 text-white shadow-md' : 'text-gray-400 hover:bg-gray-800'}`}>{t('short_position')}</button>
                    </div>
                </div>
                {/* Input Fields */}
                <div>
                    <label htmlFor="entryPrice" className="block text-sm font-medium text-gray-400">{t('entry_price')}</label>
                    <input type="number" id="entryPrice" value={entryPrice} onChange={e => setEntryPrice(e.target.value)} className="mt-1 block w-full bg-gray-900 border-gray-700 rounded-md shadow-sm p-2 focus:ring-cyan-500 focus:border-cyan-500" placeholder="e.g., 50000" />
                </div>
                <div>
                    <label htmlFor="targetPrice" className="block text-sm font-medium text-gray-400">{t('target_price')}</label>
                    <input type="number" id="targetPrice" value={targetPrice} onChange={e => setTargetPrice(e.target.value)} className="mt-1 block w-full bg-gray-900 border-gray-700 rounded-md shadow-sm p-2 focus:ring-cyan-500 focus:border-cyan-500" placeholder="e.g., 55000" />
                </div>
                <div>
                    <label htmlFor="leverage" className="block text-sm font-medium text-gray-400">{t('leverage')} (x)</label>
                    <input type="number" id="leverage" value={leverage} onChange={e => setLeverage(e.target.value)} className="mt-1 block w-full bg-gray-900 border-gray-700 rounded-md shadow-sm p-2 focus:ring-cyan-500 focus:border-cyan-500" />
                </div>
                <div>
                    <label htmlFor="investment" className="block text-sm font-medium text-gray-400">{t('investment')} ($)</label>
                    <input type="number" id="investment" value={investment} onChange={e => setInvestment(e.target.value)} className="mt-1 block w-full bg-gray-900 border-gray-700 rounded-md shadow-sm p-2 focus:ring-cyan-500 focus:border-cyan-500" />
                </div>
                <div className="md:col-span-2">
                    <label htmlFor="fee" className="block text-sm font-medium text-gray-400">{t('fee_rate')} (%)</label>
                    <input type="number" id="fee" value={fee} onChange={e => setFee(e.target.value)} className="mt-1 block w-full bg-gray-900 border-gray-700 rounded-md shadow-sm p-2 focus:ring-cyan-500 focus:border-cyan-500" />
                </div>
                 {/* Referral Payback Section */}
                <div className="md:col-span-2 bg-gray-900/70 p-4 rounded-md border border-gray-800">
                    <div className="flex items-center justify-between">
                         <label htmlFor="paybackToggle" className="text-sm font-medium text-gray-300">{t('referral_payback_toggle')}</label>
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
                            <label htmlFor="paybackRate" className="block text-sm font-medium text-gray-400">{t('referral_payback_rate')}</label>
                            <input
                                type="number"
                                id="paybackRate"
                                value={paybackRate}
                                onChange={e => setPaybackRate(e.target.value)}
                                className="mt-1 block w-full bg-gray-900 border-gray-700 rounded-md shadow-sm p-2 focus:ring-cyan-500 focus:border-cyan-500"
                                placeholder="e.g., 20"
                            />
                        </div>
                    )}
                </div>
            </div>
             <button onClick={resetFields} className="w-full mt-4 py-2 px-4 border border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-300 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-600">{t('reset_button')}</button>


            {error && <div className="mt-4 text-red-400 text-center">{error}</div>}

            {results && !error && (
                <div className="mt-6 pt-6 border-t border-gray-800">
                    <h3 className="text-xl font-bold mb-4 text-center text-cyan-300">{t('results_title')}</h3>
                    <div className="space-y-3">
                        <div className={`flex justify-between items-center p-3 rounded-md ${results.netPnl >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                            <span className="font-semibold text-gray-300">{t('pnl')}</span>
                            <span className={`font-bold text-lg ${results.netPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>{formatCurrency(results.netPnl)}</span>
                        </div>
                         <div className={`flex justify-between items-center p-3 rounded-md ${results.roi >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                            <span className="font-semibold text-gray-300">{t('roi')}</span>
                            <span className={`font-bold text-lg ${results.roi >= 0 ? 'text-green-400' : 'text-red-400'}`}>{results.roi.toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between p-3 bg-gray-900/50 rounded-md">
                            <span className="font-semibold text-gray-400">{t('fees')}</span>
                            <span className="text-gray-300">{formatCurrency(results.totalFees)}</span>
                        </div>
                        <div className="flex justify-between p-3 bg-gray-900/50 rounded-md">
                            <span className="font-semibold text-gray-400">{t('total_value')}</span>
                            <span className="text-gray-300">{formatCurrency(results.totalValue)}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calculator;