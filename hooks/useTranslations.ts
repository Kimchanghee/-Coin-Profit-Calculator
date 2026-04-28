import { useState, useEffect, useCallback } from 'react';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '../constants';
import type { Translations, TranslationKey } from '../types';

// A map to hold cached translations
const translationsCache: { [key: string]: Translations } = {};
const localeModules = import.meta.glob<{ default: Translations }>('../locales/*.json', { eager: true });
const CANONICAL_ORIGIN = 'https://profitcalc.tech';

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

const isSupportedLanguage = (languageCode: string | null): languageCode is string =>
    Boolean(languageCode && SUPPORTED_LANGUAGES.some(lang => lang.code === languageCode));

const getQueryLanguage = (): string | null => {
    try {
        return new URLSearchParams(window.location.search).get('lang');
    } catch {
        return null;
    }
};

const getInitialLanguage = (): string => {
    const queryLanguage = getQueryLanguage();
    if (isSupportedLanguage(queryLanguage)) {
        return queryLanguage;
    }

    const storedLanguage = getStoredLanguage();
    if (isSupportedLanguage(storedLanguage)) {
        return storedLanguage;
    }

    const browserLang = navigator.language.split('-')[0];
    return isSupportedLanguage(browserLang) ? browserLang : DEFAULT_LANGUAGE;
};

const buildLocalizedUrl = (languageCode: string) => {
    const url = new URL(window.location.href);
    if (languageCode === DEFAULT_LANGUAGE) {
        url.searchParams.delete('lang');
    } else {
        url.searchParams.set('lang', languageCode);
    }
    return url;
};

const buildCanonicalUrl = (languageCode: string) => {
    const url = new URL(window.location.pathname, CANONICAL_ORIGIN);
    if (languageCode !== DEFAULT_LANGUAGE) {
        url.searchParams.set('lang', languageCode);
    }
    return url;
};

const updateMetaTag = (selector: string, attribute: string, content?: string) => {
    const element = document.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null;
    if (element && content) {
        element.setAttribute(attribute, content);
    }
};


export const useTranslations = () => {
    const [languageCode, setLanguageCodeState] = useState<string>(getInitialLanguage);
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

    const setLanguageCode = useCallback((nextLanguageCode: string) => {
        if (!isSupportedLanguage(nextLanguageCode)) {
            return;
        }

        setLanguageCodeState(nextLanguageCode);
        const localizedUrl = buildLocalizedUrl(nextLanguageCode);
        window.history.replaceState({}, '', `${localizedUrl.pathname}${localizedUrl.search}${localizedUrl.hash}`);
    }, []);

    const t = useCallback((key: TranslationKey): string => {
        if (!translations) return key;
        return translations[key] || key;
    }, [translations]);

    // SEO effect
    useEffect(() => {
        if (translations) {
            document.documentElement.lang = languageCode;
            document.title = translations.title;
            
            const canonicalUrl = buildCanonicalUrl(languageCode);
            const currentUrl = `${canonicalUrl.origin}${canonicalUrl.pathname}${canonicalUrl.search}`;

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
