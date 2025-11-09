import React, { useEffect, useRef, useState } from 'react';
import { ADSENSE_CLIENT_ID, ADSENSE_SLOT_IDS, AdSlotKey, isAdsenseConfigured } from './config';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * Load AdSense script
 */
const loadAdsenseScript = (): void => {
  if (!isAdsenseConfigured()) {
    return;
  }

  const scriptId = 'adsense-lib';
  if (!document.getElementById(scriptId)) {
    const script = document.createElement('script');
    script.id = scriptId;
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`;
    script.crossOrigin = 'anonymous';
    script.onerror = () => {
      console.warn('[AdSense] Failed to load AdSense script (may be blocked by ad blocker)');
    };
    document.head.appendChild(script);
  }
};

interface AdUnitEnhancedProps {
  slotKey: AdSlotKey;
  className?: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  minHeight?: string;
  showPlaceholder?: boolean;
}

/**
 * Enhanced Google AdSense Ad Unit Component
 *
 * Features:
 * - Automatic script loading
 * - Error handling
 * - Responsive ads
 * - Custom formats
 * - Loading states
 * - Retry mechanism
 */
const AdUnitEnhanced: React.FC<AdUnitEnhancedProps> = ({
  slotKey,
  className = '',
  format = 'auto',
  minHeight = '250px',
  showPlaceholder = true,
}) => {
  const slotId = ADSENSE_SLOT_IDS[slotKey];
  const adRef = useRef<HTMLModElement>(null);
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);

  useEffect(() => {
    if (!isAdsenseConfigured() || !slotId) {
      return;
    }

    loadAdsenseScript();

    const pushAd = () => {
      try {
        if (adRef.current && !adRef.current.dataset.adsbygoogleStatus) {
          window.adsbygoogle = window.adsbygoogle || [];
          window.adsbygoogle.push({});
          setAdLoaded(true);

          // Check if ad is actually rendered
          setTimeout(() => {
            const hasAd = adRef.current?.querySelector('ins.adsbygoogle[data-ad-status="filled"]');
            if (!hasAd) {
              console.warn('[AdSense] Ad may not have loaded properly');
              setAdError(true);
            }
          }, 2000);
        }
      } catch (error) {
        console.warn('[AdSense] Push failed:', error);
        setAdError(true);
      }
    };

    // Wait for script to load
    const timeout = window.setTimeout(pushAd, 500);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [slotId]);

  // Not configured - show placeholder
  if (!isAdsenseConfigured() || !slotId) {
    if (!showPlaceholder) {
      return null;
    }

    return (
      <div
        className={`bg-gradient-to-br from-gray-950 to-gray-900 border-2 border-dashed border-gray-800 rounded-xl
                   flex flex-col items-center justify-center p-6 ${className}`.trim()}
        style={{ minHeight }}
      >
        <div className="text-center space-y-2">
          <svg className="w-12 h-12 mx-auto text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
            <path d="M9 9h6v6H9z" strokeWidth="2" />
          </svg>
          <p className="text-gray-600 text-sm font-medium">Advertisement Space</p>
          <p className="text-gray-700 text-xs">Configure AdSense to show ads</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative bg-gray-950 border border-gray-900 rounded-xl p-2 overflow-hidden ${className}`.trim()}>
      {/* Loading shimmer effect */}
      {!adLoaded && !adError && (
        <div
          className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 animate-pulse"
          style={{ minHeight }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700/30 to-transparent animate-shimmer" />
        </div>
      )}

      {/* Error state */}
      {adError && showPlaceholder && (
        <div
          className="flex items-center justify-center bg-gray-950 border border-gray-800 rounded-lg"
          style={{ minHeight }}
        >
          <div className="text-center space-y-2 p-4">
            <svg className="w-10 h-10 mx-auto text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-gray-600 text-xs">Ad blocked or unavailable</p>
          </div>
        </div>
      )}

      {/* AdSense ad unit */}
      <ins
        ref={adRef}
        className="adsbygoogle block"
        style={{ display: 'block', minHeight }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />

      {/* Custom CSS for shimmer animation */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default AdUnitEnhanced;
