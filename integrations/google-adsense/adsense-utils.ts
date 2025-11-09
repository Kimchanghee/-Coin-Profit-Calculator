import { ADSENSE_CLIENT_ID, isAdsenseConfigured } from './config';

/**
 * Initialize AdSense auto ads
 * Call this once in your app initialization
 */
export const initAutoAds = (): void => {
  if (!isAdsenseConfigured()) {
    console.warn('[AdSense] Cannot initialize auto ads - AdSense not configured');
    return;
  }

  const scriptId = 'adsense-auto-ads';
  if (!document.getElementById(scriptId)) {
    const script = document.createElement('script');
    script.id = scriptId;
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`;
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-ad-client', ADSENSE_CLIENT_ID);
    document.head.appendChild(script);
  }
};

/**
 * Refresh all ads on the page
 * Useful after dynamic content changes
 */
export const refreshAds = (): void => {
  if (!isAdsenseConfigured() || typeof window === 'undefined') {
    return;
  }

  try {
    window.adsbygoogle = window.adsbygoogle || [];

    // Find all ad units that haven't been filled
    const ads = document.querySelectorAll<HTMLElement>('.adsbygoogle');
    ads.forEach(ad => {
      if (!ad.dataset.adsbygoogleStatus) {
        window.adsbygoogle?.push({});
      }
    });
  } catch (error) {
    console.error('[AdSense] Failed to refresh ads:', error);
  }
};

/**
 * Check if ad blocker is active
 * @returns Promise that resolves to true if ad blocker is detected
 */
export const detectAdBlocker = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    const testAd = document.createElement('div');
    testAd.innerHTML = '&nbsp;';
    testAd.className = 'adsbox ad-test-element';
    testAd.style.cssText = 'position:absolute;top:-9999px;left:-9999px;';

    document.body.appendChild(testAd);

    setTimeout(() => {
      const isBlocked = testAd.offsetHeight === 0;
      document.body.removeChild(testAd);
      resolve(isBlocked);
    }, 100);
  });
};

/**
 * Track ad performance (requires Google Analytics)
 */
export const trackAdImpression = (slotId: string, slotKey: string): void => {
  if (typeof window === 'undefined') {
    return;
  }

  // Use Google Analytics if available
  if (window.gtag) {
    window.gtag('event', 'ad_impression', {
      ad_slot_id: slotId,
      ad_slot_key: slotKey,
    });
  }

  console.debug(`[AdSense] Ad impression: ${slotKey}`);
};

/**
 * Track ad click (requires Google Analytics)
 */
export const trackAdClick = (slotId: string, slotKey: string): void => {
  if (typeof window === 'undefined') {
    return;
  }

  // Use Google Analytics if available
  if (window.gtag) {
    window.gtag('event', 'ad_click', {
      ad_slot_id: slotId,
      ad_slot_key: slotKey,
    });
  }

  console.debug(`[AdSense] Ad click: ${slotKey}`);
};

/**
 * Calculate estimated revenue
 * Note: This is just an estimate based on average CTR and CPC
 */
export const estimateRevenue = (params: {
  impressions: number;
  ctr?: number; // Click-through rate (default: 1%)
  cpc?: number; // Cost per click in USD (default: $0.50)
}): number => {
  const { impressions, ctr = 0.01, cpc = 0.5 } = params;
  const clicks = impressions * ctr;
  const revenue = clicks * cpc;
  return revenue;
};

/**
 * Get ad performance report
 * This would typically fetch from AdSense API, but here's a mock implementation
 */
export interface AdPerformance {
  slotKey: string;
  impressions: number;
  clicks: number;
  ctr: number;
  estimatedRevenue: number;
}

export const getAdPerformance = async (slotKey: string): Promise<AdPerformance> => {
  // This is a mock implementation
  // In production, you would fetch from AdSense Management API
  return {
    slotKey,
    impressions: 0,
    clicks: 0,
    ctr: 0,
    estimatedRevenue: 0,
  };
};

/**
 * Lazy load ads when they come into viewport
 */
export const setupLazyAdLoading = (): void => {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const adElement = entry.target as HTMLElement;
          const adSlot = adElement.dataset.adSlot;

          if (adSlot && !adElement.dataset.adLoaded) {
            // Load the ad
            window.adsbygoogle = window.adsbygoogle || [];
            window.adsbygoogle.push({});
            adElement.dataset.adLoaded = 'true';

            // Stop observing this element
            observer.unobserve(adElement);
          }
        }
      });
    },
    {
      rootMargin: '50px', // Start loading 50px before entering viewport
    }
  );

  // Observe all ad containers
  document.querySelectorAll('.adsbygoogle').forEach((ad) => {
    observer.observe(ad);
  });
};

/**
 * Handle AdSense errors
 */
export const handleAdError = (error: Error, slotKey: string): void => {
  console.error(`[AdSense] Error loading ad for ${slotKey}:`, error);

  // Track error with analytics if available
  if (window.gtag) {
    window.gtag('event', 'exception', {
      description: `AdSense error: ${error.message}`,
      fatal: false,
      ad_slot_key: slotKey,
    });
  }
};

declare global {
  interface Window {
    adsbygoogle?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
