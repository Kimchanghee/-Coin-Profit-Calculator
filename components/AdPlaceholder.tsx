import React, { useEffect, useRef, useState } from 'react';
import {
  ADSENSE_CLIENT_ID,
  ADSENSE_SETTINGS,
  ADSENSE_SLOT_IDS,
  AdSlotKey,
  hasAdSlotConfigured,
  isAdsenseConfigured,
} from '../marketing';
import { trackEvent } from '../utils/analytics';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const loadAdsenseScript = () => {
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
    document.head.appendChild(script);
  }
};

interface AdPlaceholderProps {
  slotKey: AdSlotKey;
  className?: string;
  fallbackLabel?: string;
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  minHeight?: number;
}

const AdPlaceholder: React.FC<AdPlaceholderProps> = ({
  slotKey,
  className,
  fallbackLabel = 'Advertisement Space',
  format = 'auto',
  minHeight = 250,
}) => {
  const slotId = ADSENSE_SLOT_IDS[slotKey];
  const adRef = useRef<HTMLModElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [requestFailed, setRequestFailed] = useState(false);

  useEffect(() => {
    if (!isAdsenseConfigured() || !hasAdSlotConfigured(slotKey)) {
      return;
    }

    setRequestFailed(false);
    loadAdsenseScript();

    let isCancelled = false;
    let timeoutId: number | undefined;
    let observer: IntersectionObserver | null = null;
    const adElement = adRef.current;
    const containerElement = containerRef.current;

    if (!adElement || !containerElement) {
      return;
    }

    const pushAd = () => {
      if (isCancelled || adElement.dataset.adLoaded === 'true') {
        return;
      }

      try {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
        adElement.dataset.adLoaded = 'true';
        trackEvent('ad_slot_requested', { slot_key: slotKey, slot_id: slotId });
      } catch (error) {
        setRequestFailed(true);
        trackEvent('ad_slot_request_failed', { slot_key: slotKey, slot_id: slotId });
        console.warn('AdSense push failed', error);
      }
    };

    if (ADSENSE_SETTINGS.lazyLoadEnabled && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting || adElement.dataset.adViewed === 'true') {
              return;
            }

            adElement.dataset.adViewed = 'true';
            trackEvent('ad_slot_viewable', { slot_key: slotKey, slot_id: slotId });
            pushAd();
            observer?.disconnect();
          });
        },
        { rootMargin: ADSENSE_SETTINGS.lazyRootMargin }
      );
      observer.observe(containerElement);
    } else {
      timeoutId = window.setTimeout(pushAd, 500);
    }

    return () => {
      isCancelled = true;
      if (typeof timeoutId === 'number') {
        window.clearTimeout(timeoutId);
      }
      observer?.disconnect();
    };
  }, [slotId, slotKey]);

  const showFallback = import.meta.env.DEV || ADSENSE_SETTINGS.fallbackEnabledInProd;
  if (!isAdsenseConfigured() || !hasAdSlotConfigured(slotKey)) {
    if (!showFallback) {
      return null;
    }
    return (
      <div
        className={`bg-gray-950 border-2 border-dashed border-gray-800 rounded-lg flex items-center justify-center p-4 ${className ?? ''}`.trim()}
        style={{ minHeight }}
      >
        <span className="text-gray-600 text-center">{fallbackLabel}</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`bg-gray-950 border border-gray-900 rounded-lg p-2 ${className ?? ''}`.trim()}
      style={{ minHeight }}
    >
      <ins
        ref={adRef}
        className="adsbygoogle block"
        style={{ display: 'block', minHeight }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
      {requestFailed && showFallback && (
        <div className="mt-2 text-xs text-center text-gray-600">{fallbackLabel}</div>
      )}
    </div>
  );
};

export default AdPlaceholder;
