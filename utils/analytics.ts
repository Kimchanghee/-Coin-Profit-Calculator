import { GA_MEASUREMENT_ID, isAnalyticsConfigured } from '../marketing';

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

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
      gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
    `;
    document.head.appendChild(inlineScript);
  }
};

export const initAnalytics = () => {
  if (!isAnalyticsConfigured()) {
    return false;
  }

  loadScript();
  return true;
};

export const trackPageView = (path: string) => {
  if (!isAnalyticsConfigured() || typeof window === 'undefined') {
    return;
  }

  window.gtag?.('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
  });
};

export const trackEvent = (action: string, params?: Record<string, unknown>) => {
  if (!isAnalyticsConfigured() || typeof window === 'undefined') {
    return;
  }

  window.gtag?.('event', action, params);
};
