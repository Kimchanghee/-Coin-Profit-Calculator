import React, { useEffect } from 'react';
import { initAnalytics, trackPageView } from '../utils/analytics';
import { isAnalyticsConfigured } from '../marketing';

const GoogleAnalytics: React.FC = () => {
  const enabled = isAnalyticsConfigured();

  useEffect(() => {
    if (!enabled || !initAnalytics()) {
      return;
    }

    trackPageView(window.location.pathname + window.location.search);
  }, [enabled]);

  return null;
};

export default GoogleAnalytics;
