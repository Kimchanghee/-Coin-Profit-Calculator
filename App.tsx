import React from 'react';
import { useTranslations } from './hooks/useTranslations';
import LanguageSelector from './components/LanguageSelector';
import Calculator from './components/Calculator';
import Clock from './components/Clock';
import GoogleAnalytics from './components/GoogleAnalytics';
import ExposureLinks from './components/ExposureLinks';
import SafeInlineAdsterra from './components/SafeInlineAdsterra';
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
        <div className="mt-8">
          <section className="space-y-8">
            <Calculator t={t} localeCode={currentLanguageCode} />
            <SafeInlineAdsterra />
          </section>
        </div>

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
    </div>
  );
};

export default App;
