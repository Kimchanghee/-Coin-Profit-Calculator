import React from 'react';
import { useTranslations } from './hooks/useTranslations';
import LanguageSelector from './components/LanguageSelector';
import Calculator from './components/Calculator';

import GoogleAnalytics from './components/GoogleAnalytics';
import ExposureLinks from './components/ExposureLinks';
import { SUPPORTED_LANGUAGES } from './constants';

const App: React.FC = () => {
  const { t, setLanguageCode, currentLanguageCode, isLoading } = useTranslations();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-200 font-sans">
      <GoogleAnalytics />
      <header className="site-header bg-gray-950/80 backdrop-blur-sm sticky top-0 z-10 shadow-lg p-4 flex justify-between items-center border-b border-gray-800">
        <a href="/" className="brand">Profit<span>Calc</span></a>
        <div className="flex items-center gap-4">

          <LanguageSelector
            supportedLanguages={SUPPORTED_LANGUAGES}
            currentLanguageCode={currentLanguageCode}
            onSelectLanguage={setLanguageCode}
          />
        </div>
      </header>

      <main className="site-main container mx-auto p-4 md:p-8">
        <div className="mt-8">
          <section className="space-y-8">
            <Calculator t={t} localeCode={currentLanguageCode} />
          </section>
        </div>

        <ExposureLinks t={t} />
      </main>

      <footer className="text-center p-4 mt-8 text-gray-600 text-sm border-t border-gray-900">
        <p>{t('disclaimer')}</p>
        <nav className="footer-links"><a href="/about.html">{t('about')}</a><a href="/methodology.html">{t('methodology')}</a></nav>
      </footer>
    </div>
  );
};

export default App;
