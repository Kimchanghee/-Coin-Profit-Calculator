import React, { useEffect, useState } from 'react';
import { useTranslations } from './hooks/useTranslations';
import LanguageSelector from './components/LanguageSelector';
import ReferralBanner from './components/ReferralBanner';
import Calculator from './components/Calculator';
import AdPlaceholder from './components/AdPlaceholder';
import Clock from './components/Clock';
import GoogleAnalytics from './components/GoogleAnalytics';
import ExposureLinks from './components/ExposureLinks';
import { SUPPORTED_LANGUAGES } from './constants';

const buildAmazonUrl = (keyword: string) =>
  `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}&tag=amazonfi00681-20&linkCode=ll2`;

const buildCoupangUrl = (keyword: string) =>
  `https://www.coupang.com/np/search?component=&q=${encodeURIComponent(keyword)}`;

const buildAliExpressUrl = (keyword: string) =>
  `https://www.aliexpress.com/w/wholesale-${encodeURIComponent(keyword.replace(/\s+/g, '-'))}.html`;

const App: React.FC = () => {
  const { t, setLanguageCode, currentLanguageCode, isLoading } = useTranslations();
  const [showMobileAnchor, setShowMobileAnchor] = useState(false);
  const [isMobileAnchorDismissed, setIsMobileAnchorDismissed] = useState(false);

  useEffect(() => {
    const updateMobileAnchor = () => {
      setShowMobileAnchor(window.scrollY > 280);
    };

    updateMobileAnchor();
    window.addEventListener('scroll', updateMobileAnchor, { passive: true });

    return () => window.removeEventListener('scroll', updateMobileAnchor);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-black text-gray-200 font-sans ${showMobileAnchor && !isMobileAnchorDismissed ? 'pb-24 md:pb-0' : ''}`.trim()}>
      <GoogleAnalytics />
      <header className="bg-gray-950/80 backdrop-blur-sm sticky top-0 z-10 shadow-lg p-4 flex justify-between items-center border-b border-gray-800">
        <h1 className="text-xl md:text-2xl font-bold text-cyan-400">{t('title')}</h1>
        <div className="flex items-center gap-4">
          <Clock />
          <LanguageSelector
            supportedLanguages={SUPPORTED_LANGUAGES}
            currentLanguageCode={currentLanguageCode}
            onSelectLanguage={setLanguageCode}
          />
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <ReferralBanner t={t} />
        <AdPlaceholder
          slotKey="headerBanner"
          fallbackLabel={t('ad_space_label')}
          format="horizontal"
          minHeight={90}
          priority="high"
          lazy={false}
          className="mt-6"
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <section className="lg:col-span-2 space-y-8">
            <Calculator t={t} localeCode={currentLanguageCode} />
            <section className="rounded-xl border border-gray-800 bg-gray-950/70 p-5">
              <h2 className="text-lg font-semibold text-cyan-300">Trading & Setup Picks</h2>
              <p className="mt-2 text-sm text-gray-400">트레이딩/업무 환경 개선용 추천 링크입니다.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <a
                  className="rounded-lg border border-amber-700/50 bg-amber-950/30 p-4 transition-colors hover:border-amber-500"
                  href={buildAmazonUrl('trading desk mat')}
                  target="_blank"
                  rel="sponsored noopener noreferrer"
                >
                  <p className="text-xs font-semibold uppercase text-amber-400">Amazon</p>
                  <p className="mt-1 text-sm text-gray-100">Trading Desk Mat</p>
                </a>
                <a
                  className="rounded-lg border border-blue-700/50 bg-blue-950/30 p-4 transition-colors hover:border-blue-500"
                  href={buildCoupangUrl('모니터암')}
                  target="_blank"
                  rel="sponsored noopener noreferrer"
                >
                  <p className="text-xs font-semibold uppercase text-blue-400">Coupang</p>
                  <p className="mt-1 text-sm text-gray-100">모니터암</p>
                </a>
                <a
                  className="rounded-lg border border-rose-700/50 bg-rose-950/30 p-4 transition-colors hover:border-rose-500"
                  href={buildAliExpressUrl('mechanical keyboard')}
                  target="_blank"
                  rel="sponsored noopener noreferrer"
                >
                  <p className="text-xs font-semibold uppercase text-rose-400">AliExpress</p>
                  <p className="mt-1 text-sm text-gray-100">Mechanical Keyboard</p>
                </a>
              </div>
            </section>
            <AdPlaceholder
              slotKey="inArticle"
              fallbackLabel={t('ad_space_label')}
              format="rectangle"
              minHeight={280}
            />
          </section>
          <aside className="hidden space-y-8 lg:sticky lg:top-24 lg:block lg:self-start">
            <AdPlaceholder
              slotKey="sidebarTop"
              fallbackLabel={t('ad_space_label')}
              format="vertical"
              minHeight={300}
            />
            <AdPlaceholder
              slotKey="sidebarBottom"
              fallbackLabel={t('ad_space_label')}
              format="vertical"
              minHeight={300}
            />
          </aside>
        </div>

        <AdPlaceholder
          slotKey="footerBanner"
          fallbackLabel={t('ad_space_label')}
          format="horizontal"
          minHeight={90}
          className="mt-8"
        />

        <ExposureLinks />
      </main>
      
      <footer className="text-center p-4 mt-8 text-gray-600 text-sm border-t border-gray-900">
        <p>{t('disclaimer')}</p>
        <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs text-gray-500">
          <span>Sister Sites:</span>
          <a href="https://econo-jabis-web.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">EconoJabis News</a>
          <span>|</span>
          <a href="https://creator-hub-iota.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">Creator Hub</a>
          <span>|</span>
          <a href="https://howmuchis.info" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">HowMuchIs</a>
          <span>|</span>
          <a href="https://finoracalc.tech" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">Finora Calculator</a>
        </div>
      </footer>
      {showMobileAnchor && !isMobileAnchorDismissed && (
        <div className="md:hidden fixed inset-x-0 bottom-0 z-40 border-t border-gray-800 bg-black/95 px-3 py-2 shadow-2xl">
          <button
            type="button"
            aria-label="Close advertisement"
            className="absolute right-2 top-1 flex h-6 w-6 items-center justify-center rounded-full border border-gray-700 bg-gray-950 text-gray-400"
            onClick={() => setIsMobileAnchorDismissed(true)}
          >
            ×
          </button>
          <AdPlaceholder
            slotKey="footerBanner"
            fallbackLabel={t('ad_space_label')}
            format="horizontal"
            minHeight={50}
            priority="high"
            lazy={false}
            className="mx-auto max-w-[336px] rounded-none border-0 bg-transparent p-0"
          />
        </div>
      )}
    </div>
  );
};

export default App;
