import React from 'react';
import { useTranslations } from '../hooks/useTranslations';
import LanguageSelector from '../components/LanguageSelector';
import ReferralBanner from '../components/ReferralBanner';
import CalculatorEnhanced from './CalculatorEnhanced';
import AdPlaceholder from '../components/AdPlaceholder';
import Clock from '../components/Clock';
import GoogleAnalytics from '../components/GoogleAnalytics';
import { SUPPORTED_LANGUAGES } from '../constants';

const AppEnhanced: React.FC = () => {
  const { t, setLanguageCode, currentLanguageCode, isLoading } = useTranslations();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950">
        <div className="relative">
          {/* Spinner */}
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-800 border-t-cyan-400"></div>
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-cyan-400/20 blur-xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950 text-gray-200 font-sans">
      {/* Animated background pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <GoogleAnalytics />

      {/* Enhanced Header */}
      <header className="relative bg-gray-950/80 backdrop-blur-md sticky top-0 z-50 shadow-2xl border-b border-gray-800/50">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5"></div>
        <div className="relative container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent animate-gradient">
            {t('title')}
          </h1>
          <div className="flex items-center gap-4 md:gap-6">
            <Clock />
            <LanguageSelector
              supportedLanguages={SUPPORTED_LANGUAGES}
              currentLanguageCode={currentLanguageCode}
              onSelectLanguage={setLanguageCode}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative container mx-auto p-4 md:p-8">
        <ReferralBanner t={t} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Calculator Section */}
          <div className="lg:col-span-2">
            <CalculatorEnhanced t={t} />
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            <div className="transform transition-all duration-300 hover:scale-[1.02]">
              <AdPlaceholder slotKey="sidebarTop" />
            </div>
            <div className="transform transition-all duration-300 hover:scale-[1.02]">
              <AdPlaceholder slotKey="sidebarBottom" />
            </div>
          </aside>
        </div>
      </main>

      {/* Enhanced Footer */}
      <footer className="relative mt-16 border-t border-gray-800/50 bg-gray-950/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className="max-w-2xl">
                <strong className="text-gray-400">Disclaimer:</strong> Trading cryptocurrency involves significant risk of loss.
                This calculator is for informational and educational purposes only and does not constitute financial advice.
              </p>
            </div>

            <div className="flex items-center justify-center gap-6 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Online</span>
              </div>
              <span>•</span>
              <span>© 2025 Coin Profit Calculator</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom CSS for gradient animation */}
      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        .animate-shake {
          animation: shake 0.5s ease;
        }
      `}</style>
    </div>
  );
};

export default AppEnhanced;
