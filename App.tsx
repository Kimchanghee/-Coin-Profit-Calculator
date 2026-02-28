import React from 'react';
import { useTranslations } from './hooks/useTranslations';
import LanguageSelector from './components/LanguageSelector';
import ReferralBanner from './components/ReferralBanner';
import Calculator from './components/Calculator';
import AdPlaceholder from './components/AdPlaceholder';
import Clock from './components/Clock';
import GoogleAnalytics from './components/GoogleAnalytics';
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
        <ReferralBanner t={t} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <Calculator t={t} localeCode={currentLanguageCode} />
          </div>
          <aside className="space-y-8">
            <AdPlaceholder slotKey="sidebarTop" fallbackLabel={t('ad_space_label')} />
            <AdPlaceholder slotKey="sidebarBottom" fallbackLabel={t('ad_space_label')} />
          </aside>
        </div>
      </main>
      
      <footer className="text-center p-4 mt-8 text-gray-600 text-sm border-t border-gray-900">
        <p>{t('disclaimer')}</p>
      </footer>
    </div>
  );
};

export default App;
