import React, { useEffect } from 'react';
import { ADSENSE_CLIENT_ID, ADSENSE_SLOT_IDS, AdSlotKey, isAdsenseConfigured } from '../marketing';

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
}

const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ slotKey, className }) => {
  const slotId = ADSENSE_SLOT_IDS[slotKey];

  useEffect(() => {
    if (!isAdsenseConfigured() || !slotId) {
      return;
    }

    loadAdsenseScript();

    const pushAd = () => {
      try {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
      } catch (error) {
        console.warn('AdSense push failed', error);
      }
    };

    const timeout = window.setTimeout(pushAd, 500);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [slotId]);

  if (!isAdsenseConfigured() || !slotId) {
    return (
      <div
        className={`min-h-[250px] bg-gray-950 border-2 border-dashed border-gray-800 rounded-lg flex items-center justify-center p-4 ${className ?? ''}`.trim()}
      >
        <span className="text-gray-600 text-center">Advertisement Space</span>
      </div>
    );
  }

  return (
    <div className={`bg-gray-950 border border-gray-900 rounded-lg p-2 ${className ?? ''}`.trim()}>
      <ins
        className="adsbygoogle block"
        style={{ display: 'block', minHeight: '250px' }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdPlaceholder;