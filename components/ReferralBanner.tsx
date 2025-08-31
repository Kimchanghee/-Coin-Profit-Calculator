import React from 'react';
import type { TranslationKey } from '../types';

interface ReferralBannerProps {
  t: (key: TranslationKey) => string;
}

const ReferralBanner: React.FC<ReferralBannerProps> = ({ t }) => {
  return (
    <a 
      href="https://www.gate.com/signup?ref_type=103&ref=DJBWKAIF"
      target="_blank"
      rel="noopener noreferrer"
      className="block p-6 md:p-8 rounded-lg shadow-xl overflow-hidden bg-gradient-to-r from-cyan-900 to-gray-900 border border-gray-800 hover:from-cyan-800 hover:to-gray-800 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-cyan-500/50"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">
            {t('referral_banner_title')}
          </h2>
          <p className="mt-2 text-gray-300">
            {t('referral_banner_subtitle')}
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex-shrink-0">
          <span className="inline-block bg-cyan-400 text-black font-bold py-3 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105">
            {t('referral_banner_cta')}
          </span>
        </div>
      </div>
    </a>
  );
};

export default ReferralBanner;