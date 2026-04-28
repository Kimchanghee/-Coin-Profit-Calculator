import React, { useEffect, useId, useRef } from 'react';
import {
  ADSTERRA_SLOT_SIZES,
  AdSlotKey,
  AdsterraSize,
  getAdsterraZoneKey,
  isAdsterraZoneConfigured,
} from '../marketing';
import { trackEvent } from '../utils/analytics';

const ADSTERRA_IFRAME_HOST = 'www.highperformanceformat.com';

const ADSTERRA_DIMENSIONS: Record<AdsterraSize, { width: number; height: number }> = {
  '728x90': { width: 728, height: 90 },
  '300x250': { width: 300, height: 250 },
  '160x600': { width: 160, height: 600 },
  '320x50': { width: 320, height: 50 },
};

interface AdPlaceholderProps {
  slotKey: AdSlotKey;
  className?: string;
  fallbackLabel?: string;
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  minHeight?: number;
}

const getPreferredSize = (slotKey: AdSlotKey, format: AdPlaceholderProps['format']): AdsterraSize => {
  if (format === 'rectangle') return '300x250';
  if (format === 'vertical') return '160x600';
  if (format === 'horizontal') return '728x90';
  return ADSTERRA_SLOT_SIZES[slotKey].desktop;
};

const buildAdsterraSrcDoc = (key: string, width: number, height: number) =>
  '<!doctype html><html><head><meta charset="utf-8">' +
  '<style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}</style></head><body>' +
  `<script type="text/javascript">atOptions={'key':'${key}','format':'iframe','height':${height},'width':${width},'params':{}};<\/script>` +
  `<script type="text/javascript" src="https://${ADSTERRA_IFRAME_HOST}/${key}/invoke.js"><\/script>` +
  '</body></html>';

const AdPlaceholder: React.FC<AdPlaceholderProps> = ({
  slotKey,
  className,
  fallbackLabel = 'Advertisement Space',
  format = 'auto',
  minHeight = 250,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const uniqueId = useId().replace(/:/g, '');
  const desktopSize = getPreferredSize(slotKey, format as AdPlaceholderProps['format']);
  const mobileSize = ADSTERRA_SLOT_SIZES[slotKey].mobile;
  const desktop = ADSTERRA_DIMENSIONS[desktopSize];
  const mobile = ADSTERRA_DIMENSIONS[mobileSize];
  const desktopKey = getAdsterraZoneKey(desktopSize);
  const mobileKey = getAdsterraZoneKey(mobileSize);
  const isConfigured = isAdsterraZoneConfigured(desktopKey) && isAdsterraZoneConfigured(mobileKey);

  useEffect(() => {
    const containerElement = containerRef.current;
    if (!containerElement || !isConfigured) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        trackEvent('adsterra_slot_viewable', { slot_key: slotKey, desktop_size: desktopSize, mobile_size: mobileSize });
        observer.disconnect();
      },
      { rootMargin: '400px 0px' }
    );

    observer.observe(containerElement);
    trackEvent('adsterra_slot_mounted', { slot_key: slotKey, desktop_size: desktopSize, mobile_size: mobileSize });

    return () => observer.disconnect();
  }, [desktopSize, isConfigured, mobileSize, slotKey]);

  if (!isConfigured) {
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
      className={`bg-gray-950 border border-gray-900 rounded-lg p-2 overflow-hidden ${className ?? ''}`.trim()}
      style={{ minHeight: Math.max(minHeight, mobile.height), maxWidth: '100%' }}
      role="complementary"
      aria-label={fallbackLabel}
    >
      <iframe
        title={`${slotKey}-adsterra-mobile-${uniqueId}`}
        className="mx-auto block border-0 md:hidden"
        width={mobile.width}
        height={mobile.height}
        scrolling="no"
        srcDoc={buildAdsterraSrcDoc(mobileKey, mobile.width, mobile.height)}
      />
      <iframe
        title={`${slotKey}-adsterra-desktop-${uniqueId}`}
        className="mx-auto hidden border-0 md:block"
        width={desktop.width}
        height={desktop.height}
        scrolling="no"
        srcDoc={buildAdsterraSrcDoc(desktopKey, desktop.width, desktop.height)}
      />
    </div>
  );
};

export default AdPlaceholder;
