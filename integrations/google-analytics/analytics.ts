import { GA_MEASUREMENT_ID, isAnalyticsConfigured } from './config';

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Load Google Analytics script
 */
const loadScript = () => {
  if (!isAnalyticsConfigured()) {
    return;
  }

  const scriptId = 'ga-script';
  if (!document.getElementById(scriptId)) {
    const script = document.createElement('script');
    script.id = scriptId;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);
  }

  const inlineScriptId = 'ga-inline-config';
  if (!document.getElementById(inlineScriptId)) {
    const inlineScript = document.createElement('script');
    inlineScript.id = inlineScriptId;
    inlineScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_MEASUREMENT_ID}', {
        send_page_view: false,
        cookie_flags: 'SameSite=None;Secure'
      });
    `;
    document.head.appendChild(inlineScript);
  }
};

/**
 * Initialize Google Analytics
 * @returns true if initialized successfully
 */
export const initAnalytics = (): boolean => {
  if (!isAnalyticsConfigured()) {
    return false;
  }

  loadScript();
  return true;
};

/**
 * Track page view
 * @param path - Page path to track
 */
export const trackPageView = (path: string): void => {
  if (!isAnalyticsConfigured() || typeof window === 'undefined') {
    return;
  }

  window.gtag?.('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
};

/**
 * Track custom event
 * @param action - Event action name
 * @param params - Additional event parameters
 */
export const trackEvent = (action: string, params?: Record<string, unknown>): void => {
  if (!isAnalyticsConfigured() || typeof window === 'undefined') {
    return;
  }

  window.gtag?.('event', action, params);
};

/**
 * Track calculator usage
 */
export const trackCalculatorUsage = (params: {
  positionType: string;
  leverage: number;
  hasProfit: boolean;
}): void => {
  trackEvent('calculator_used', {
    position_type: params.positionType,
    leverage: params.leverage,
    has_profit: params.hasProfit,
  });
};

/**
 * Track button click
 */
export const trackButtonClick = (buttonName: string, location?: string): void => {
  trackEvent('button_click', {
    button_name: buttonName,
    location,
  });
};

/**
 * Track referral link click
 */
export const trackReferralClick = (platform: string): void => {
  trackEvent('referral_click', {
    platform,
  });
};

/**
 * Track language change
 */
export const trackLanguageChange = (language: string): void => {
  trackEvent('language_change', {
    language,
  });
};

/**
 * Track error
 */
export const trackError = (error: Error, context?: string): void => {
  trackEvent('exception', {
    description: error.message,
    context,
    fatal: false,
  });
};

/**
 * Track performance timing
 */
export const trackTiming = (category: string, variable: string, value: number): void => {
  trackEvent('timing_complete', {
    name: variable,
    value,
    event_category: category,
  });
};

/**
 * Set user properties
 */
export const setUserProperties = (properties: Record<string, unknown>): void => {
  if (!isAnalyticsConfigured() || typeof window === 'undefined') {
    return;
  }

  window.gtag?.('set', 'user_properties', properties);
};

/**
 * Enable/disable analytics based on user consent
 */
export const setAnalyticsConsent = (granted: boolean): void => {
  if (typeof window === 'undefined') {
    return;
  }

  window.gtag?.('consent', 'update', {
    analytics_storage: granted ? 'granted' : 'denied',
  });
};
