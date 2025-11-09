import React, { useState, useMemo } from 'react';
import { PositionType } from '../types';
import type { TranslationKey } from '../types';

interface CalculatorProps {
  t: (key: TranslationKey) => string;
}

const CalculatorEnhanced: React.FC<CalculatorProps> = ({ t }) => {
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
        <div className="relative bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-8 rounded-2xl shadow-2xl border border-gray-800/50 backdrop-blur-sm overflow-hidden">
            {/* Decorative gradient orbs */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    {t('calculator_title')}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                     {/* Position Type Toggle - Enhanced */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-400 mb-3">{t('position_type')}</label>
                        <div className="relative flex bg-gray-900/80 rounded-xl p-1.5 border border-gray-700/50 backdrop-blur-sm shadow-inner">
                            <div
                                className={`absolute top-1.5 bottom-1.5 w-[calc(50%-0.375rem)] transition-all duration-300 ease-out rounded-lg shadow-lg ${
                                    positionType === PositionType.LONG
                                        ? 'left-1.5 bg-gradient-to-r from-green-500 to-green-600'
                                        : 'left-[calc(50%+0.375rem)] bg-gradient-to-r from-red-500 to-red-600'
                                }`}
                            />
                            <button
                                onClick={() => setPositionType(PositionType.LONG)}
                                className={`relative w-1/2 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ${
                                    positionType === PositionType.LONG
                                        ? 'text-white scale-105'
                                        : 'text-gray-400 hover:text-gray-300'
                                }`}
                            >
                                {t('long_position')}
                            </button>
                            <button
                                onClick={() => setPositionType(PositionType.SHORT)}
                                className={`relative w-1/2 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ${
                                    positionType === PositionType.SHORT
                                        ? 'text-white scale-105'
                                        : 'text-gray-400 hover:text-gray-300'
                                }`}
                            >
                                {t('short_position')}
                            </button>
                        </div>
                    </div>

                    {/* Enhanced Input Fields */}
                    <div className="group">
                        <label htmlFor="entryPrice" className="block text-sm font-medium text-gray-400 mb-2">
                            {t('entry_price')}
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                id="entryPrice"
                                value={entryPrice}
                                onChange={e => setEntryPrice(e.target.value)}
                                className="w-full bg-gray-900/60 border border-gray-700/50 rounded-xl shadow-sm p-3.5
                                         text-white placeholder-gray-500
                                         focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50
                                         transition-all duration-200 outline-none
                                         hover:border-gray-600/50"
                                placeholder="e.g., 50000"
                            />
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        </div>
                    </div>

                    <div className="group">
                        <label htmlFor="targetPrice" className="block text-sm font-medium text-gray-400 mb-2">
                            {t('target_price')}
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                id="targetPrice"
                                value={targetPrice}
                                onChange={e => setTargetPrice(e.target.value)}
                                className="w-full bg-gray-900/60 border border-gray-700/50 rounded-xl shadow-sm p-3.5
                                         text-white placeholder-gray-500
                                         focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50
                                         transition-all duration-200 outline-none
                                         hover:border-gray-600/50"
                                placeholder="e.g., 55000"
                            />
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        </div>
                    </div>

                    <div className="group">
                        <label htmlFor="leverage" className="block text-sm font-medium text-gray-400 mb-2">
                            {t('leverage')} <span className="text-cyan-400/70">(x)</span>
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                id="leverage"
                                value={leverage}
                                onChange={e => setLeverage(e.target.value)}
                                className="w-full bg-gray-900/60 border border-gray-700/50 rounded-xl shadow-sm p-3.5
                                         text-white placeholder-gray-500
                                         focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50
                                         transition-all duration-200 outline-none
                                         hover:border-gray-600/50"
                            />
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        </div>
                    </div>

                    <div className="group">
                        <label htmlFor="investment" className="block text-sm font-medium text-gray-400 mb-2">
                            {t('investment')} <span className="text-green-400/70">($)</span>
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                id="investment"
                                value={investment}
                                onChange={e => setInvestment(e.target.value)}
                                className="w-full bg-gray-900/60 border border-gray-700/50 rounded-xl shadow-sm p-3.5
                                         text-white placeholder-gray-500
                                         focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50
                                         transition-all duration-200 outline-none
                                         hover:border-gray-600/50"
                            />
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        </div>
                    </div>

                    <div className="md:col-span-2 group">
                        <label htmlFor="fee" className="block text-sm font-medium text-gray-400 mb-2">
                            {t('fee_rate')} <span className="text-orange-400/70">(%)</span>
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                id="fee"
                                value={fee}
                                onChange={e => setFee(e.target.value)}
                                className="w-full bg-gray-900/60 border border-gray-700/50 rounded-xl shadow-sm p-3.5
                                         text-white placeholder-gray-500
                                         focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50
                                         transition-all duration-200 outline-none
                                         hover:border-gray-600/50"
                            />
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        </div>
                    </div>

                     {/* Referral Payback Section - Enhanced */}
                    <div className="md:col-span-2 bg-gradient-to-br from-gray-900/80 to-gray-900/40 p-5 rounded-xl border border-gray-800/50 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-4">
                             <label htmlFor="paybackToggle" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></span>
                                {t('referral_payback_toggle')}
                             </label>
                             <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    id="paybackToggle"
                                    checked={paybackEnabled}
                                    onChange={() => setPaybackEnabled(!paybackEnabled)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-700 rounded-full peer
                                              peer-focus:ring-4 peer-focus:ring-cyan-500/20
                                              peer-checked:after:translate-x-full
                                              peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-blue-500
                                              after:content-[''] after:absolute after:top-0.5 after:left-[2px]
                                              after:bg-white after:rounded-full after:h-5 after:w-5
                                              after:transition-all after:shadow-md">
                                </div>
                            </label>
                        </div>
                        <div className={`overflow-hidden transition-all duration-300 ${paybackEnabled ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <label htmlFor="paybackRate" className="block text-sm font-medium text-gray-400 mb-2">
                                {t('referral_payback_rate')}
                            </label>
                            <input
                                type="number"
                                id="paybackRate"
                                value={paybackRate}
                                onChange={e => setPaybackRate(e.target.value)}
                                className="w-full bg-gray-900/60 border border-gray-700/50 rounded-xl shadow-sm p-3.5
                                         text-white placeholder-gray-500
                                         focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50
                                         transition-all duration-200 outline-none"
                                placeholder="e.g., 20"
                            />
                        </div>
                    </div>
                </div>

                 {/* Enhanced Reset Button */}
                 <button
                    onClick={resetFields}
                    className="w-full mt-4 py-3.5 px-4
                             bg-gradient-to-r from-gray-800/80 to-gray-900/80
                             border border-gray-700/50 rounded-xl shadow-lg
                             text-sm font-medium text-gray-300
                             hover:from-gray-700/80 hover:to-gray-800/80
                             hover:border-gray-600/50 hover:shadow-xl
                             active:scale-[0.98]
                             focus:outline-none focus:ring-2 focus:ring-cyan-500/50
                             transition-all duration-200"
                >
                    {t('reset_button')}
                </button>

                {/* Error Message */}
                {error && (
                    <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-center backdrop-blur-sm animate-shake">
                        {error}
                    </div>
                )}

                {/* Enhanced Results */}
                {results && !error && (
                    <div className="mt-8 pt-8 border-t border-gray-800/50">
                        <h3 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                            {t('results_title')}
                        </h3>
                        <div className="space-y-4">
                            <div className={`relative flex justify-between items-center p-5 rounded-xl overflow-hidden backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] ${
                                results.netPnl >= 0
                                    ? 'bg-gradient-to-r from-green-500/20 to-green-600/10 border border-green-500/30'
                                    : 'bg-gradient-to-r from-red-500/20 to-red-600/10 border border-red-500/30'
                            }`}>
                                <span className="font-semibold text-gray-200">{t('pnl')}</span>
                                <span className={`font-bold text-2xl ${results.netPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {results.netPnl >= 0 ? '+' : ''}{formatCurrency(results.netPnl)}
                                </span>
                            </div>

                             <div className={`relative flex justify-between items-center p-5 rounded-xl overflow-hidden backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] ${
                                results.roi >= 0
                                    ? 'bg-gradient-to-r from-green-500/20 to-green-600/10 border border-green-500/30'
                                    : 'bg-gradient-to-r from-red-500/20 to-red-600/10 border border-red-500/30'
                            }`}>
                                <span className="font-semibold text-gray-200">{t('roi')}</span>
                                <span className={`font-bold text-2xl ${results.roi >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {results.roi >= 0 ? '+' : ''}{results.roi.toFixed(2)}%
                                </span>
                            </div>

                            <div className="flex justify-between items-center p-5 bg-gray-900/40 border border-gray-800/50 rounded-xl backdrop-blur-sm transition-all duration-300 hover:bg-gray-900/60">
                                <span className="font-semibold text-gray-400">{t('fees')}</span>
                                <span className="text-gray-300 font-medium">{formatCurrency(results.totalFees)}</span>
                            </div>

                            <div className="flex justify-between items-center p-5 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl backdrop-blur-sm transition-all duration-300 hover:from-cyan-500/20 hover:to-blue-500/20">
                                <span className="font-semibold text-gray-300">{t('total_value')}</span>
                                <span className="text-cyan-300 font-bold text-xl">{formatCurrency(results.totalValue)}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CalculatorEnhanced;
