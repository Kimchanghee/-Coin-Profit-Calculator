import { useState, useEffect, useCallback } from 'react';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '../constants';
import type { Translations, TranslationKey } from '../types';

// A map to hold cached translations
const translationsCache: { [key: string]: Translations } = {};
const localeModules = import.meta.glob<{ default: Translations }>('../locales/*.json', { eager: true });

const bundledTranslations: Record<string, Translations> = Object.entries(localeModules).reduce(
    (acc, [path, module]) => {
        const match = path.match(/\/([a-z0-9_-]+)\.json$/i);
        if (match) {
            acc[match[1]] = module.default;
        }
        return acc;
    },
    {} as Record<string, Translations>,
);

const loadTranslation = async (langCode: string): Promise<Translations> => {
    if (translationsCache[langCode]) {
        return translationsCache[langCode];
    }
    const translations = bundledTranslations[langCode];
    if (translations) {
        translationsCache[langCode] = translations;
        return translations;
    }

    console.warn(`Could not load translation for ${langCode}, falling back to default.`);
    if (translationsCache[DEFAULT_LANGUAGE]) {
        return translationsCache[DEFAULT_LANGUAGE];
    }

    const fallback = bundledTranslations[DEFAULT_LANGUAGE];
    if (fallback) {
        translationsCache[DEFAULT_LANGUAGE] = fallback;
        return fallback;
    }

    console.error('Failed to load default translations: bundled default translation is missing.');
    return {} as Translations;
};

const LANGUAGE_STORAGE_KEY = 'coin-profit-calculator-language';

const getStoredLanguage = (): string | null => {
    try {
        return window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    } catch {
        return null;
    }
};

const setStoredLanguage = (languageCode: string) => {
    try {
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
    } catch {
        // Ignore storage failures (private mode, blocked storage, etc.)
    }
};

const updateMetaTag = (selector: string, attribute: string, content?: string) => {
    const element = document.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null;
    if (element && content) {
        element.setAttribute(attribute, content);
    }
};


export const useTranslations = () => {
    const [languageCode, setLanguageCode] = useState<string>(() => {
        const storedLanguage = getStoredLanguage();
        if (storedLanguage && SUPPORTED_LANGUAGES.some(lang => lang.code === storedLanguage)) {
            return storedLanguage;
        }

        const browserLang = navigator.language.split('-')[0];
        return SUPPORTED_LANGUAGES.some(lang => lang.code === browserLang) ? browserLang : DEFAULT_LANGUAGE;
    });
    const [translations, setTranslations] = useState<Translations | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        setIsLoading(true);
        loadTranslation(languageCode).then(data => {
            if (isMounted) {
                setTranslations(data);
                setIsLoading(false);
            }
        });
        return () => {
            isMounted = false;
        };
    }, [languageCode]);

    useEffect(() => {
        setStoredLanguage(languageCode);
    }, [languageCode]);

    const t = useCallback((key: TranslationKey): string => {
        if (!translations) return key;
        return translations[key] || key;
    }, [translations]);

    // SEO effect
    useEffect(() => {
        if (translations) {
            document.documentElement.lang = languageCode;
            document.title = translations.title;
            
            const currentUrl = `${window.location.origin}${window.location.pathname}`;

            updateMetaTag('meta[name="description"]', 'content', translations.description);
            updateMetaTag('meta[name="keywords"]', 'content', translations.meta_keywords);
            updateMetaTag('link[rel="canonical"]', 'href', currentUrl);

            // Open Graph
            updateMetaTag('meta[property="og:title"]', 'content', translations.og_title);
            updateMetaTag('meta[property="og:description"]', 'content', translations.og_description);
            updateMetaTag('meta[property="og:url"]', 'content', currentUrl);
            
            // Twitter
            updateMetaTag('meta[property="twitter:title"]', 'content', translations.og_title);
            updateMetaTag('meta[property="twitter:description"]', 'content', translations.og_description);
            updateMetaTag('meta[property="twitter:url"]', 'content', currentUrl);
        }
    }, [translations, languageCode]);

    return { t, setLanguageCode, currentLanguageCode: languageCode, isLoading };
};
