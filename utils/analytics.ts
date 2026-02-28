import { GA_MEASUREMENT_ID, isAnalyticsConfigured } from '../marketing';

declare global {
  interface Window {
    dataLayer?: unknown[];
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

  window.dataLayer = window.dataLayer || [];
  window.gtag = (...args: unknown[]) => {
    window.dataLayer?.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, { send_page_view: false });
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
