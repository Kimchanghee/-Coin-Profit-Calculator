import React, { useState, useRef, useEffect } from 'react';
import type { Language } from '../types';
import GlobeIcon from './icons/GlobeIcon';

interface LanguageSelectorProps {
  supportedLanguages: Language[];
  currentLanguageCode: string;
  onSelectLanguage: (code: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ supportedLanguages, currentLanguageCode, onSelectLanguage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (code: string) => {
    onSelectLanguage(code);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLanguageName = supportedLanguages.find(lang => lang.code === currentLanguageCode)?.name;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 border border-gray-700"
      >
        <GlobeIcon className="w-5 h-5" />
        <span className="hidden md:inline">{currentLanguageName}</span>
        <span className="md:hidden">{currentLanguageCode.toUpperCase()}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-20 overflow-hidden border border-gray-700">
          <ul className="py-1">
            {supportedLanguages.map(lang => (
              <li key={lang.code}>
                <button
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full text-left px-4 py-2 text-sm ${
                    currentLanguageCode === lang.code
                      ? 'bg-cyan-500 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {lang.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;