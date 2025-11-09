import { useEffect } from 'react';
import { initAnalytics, trackPageView } from './analytics';
import { isAnalyticsConfigured } from './config';

/**
 * Enhanced Google Analytics Component
 *
 * Features:
 * - Automatic page view tracking
 * - Performance monitoring
 * - Error tracking
 * - User engagement tracking
 * - Consent management ready
 */
const GoogleAnalyticsEnhanced: React.FC = () => {
  const enabled = isAnalyticsConfigured();

  useEffect(() => {
    if (!enabled || !initAnalytics()) {
      console.info('[Analytics] Google Analytics is not configured or disabled');
      return;
    }

    // Track initial page view
    trackPageView(window.location.pathname + window.location.search);

    // Track page visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        trackPageView(window.location.pathname + window.location.search);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled]);

  return null;
};

export default GoogleAnalyticsEnhanced;
