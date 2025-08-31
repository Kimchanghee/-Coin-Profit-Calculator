import { useState, useEffect, useCallback } from 'react';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '../constants';
import type { Translations, TranslationKey } from '../types';

// A map to hold cached translations
const translationsCache: { [key: string]: Translations } = {};

const loadTranslation = async (langCode: string): Promise<Translations> => {
    if (translationsCache[langCode]) {
        return translationsCache[langCode];
    }
    try {
        const response = await fetch(`./locales/${langCode}.json`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const translations = await response.json();
        translationsCache[langCode] = translations;
        return translations;
    } catch (error) {
        console.warn(`Could not load translation for ${langCode}, falling back to default.`, error);
        // Fallback to default language
        try {
            if (translationsCache[DEFAULT_LANGUAGE]) {
                return translationsCache[DEFAULT_LANGUAGE];
            }
            const response = await fetch(`./locales/${DEFAULT_LANGUAGE}.json`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const translations = await response.json();
            translationsCache[DEFAULT_LANGUAGE] = translations;
            return translations;
        } catch (fallbackError) {
            console.error('Failed to load default translations:', fallbackError);
            return {} as Translations; // Return empty object to prevent crash
        }
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

    const t = useCallback((key: TranslationKey): string => {
        if (!translations) return key;
        return translations[key] || key;
    }, [translations]);

    // SEO effect
    useEffect(() => {
        if (translations) {
            document.documentElement.lang = languageCode;
            document.title = translations.title;
            
            const currentUrl = window.location.href;

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