import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
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
  lazy?: boolean;
  priority?: 'high' | 'normal';
}

const DESKTOP_MEDIA_QUERY = '(min-width: 768px)';
const ADSTERRA_LAZY_MARGIN = import.meta.env.VITE_ADSTERRA_LAZY_MARGIN || '450px 0px';

const getPreferredSize = (slotKey: AdSlotKey, format: AdPlaceholderProps['format']): AdsterraSize => {
  if (format === 'rectangle') return '300x250';
  if (format === 'vertical') return '160x600';
  if (format === 'horizontal') return '728x90';
  return ADSTERRA_SLOT_SIZES[slotKey].desktop;
};

const getIsDesktopViewport = () =>
  typeof window !== 'undefined' ? window.matchMedia(DESKTOP_MEDIA_QUERY).matches : true;

const useIsDesktopViewport = () => {
  const [isDesktop, setIsDesktop] = useState(getIsDesktopViewport);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const update = () => setIsDesktop(mediaQuery.matches);

    update();
    mediaQuery.addEventListener?.('change', update);
    return () => mediaQuery.removeEventListener?.('change', update);
  }, []);

  return isDesktop;
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
  lazy = true,
  priority = 'normal',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const uniqueId = useId().replace(/:/g, '');
  const isDesktopViewport = useIsDesktopViewport();
  const [shouldLoad, setShouldLoad] = useState(!lazy || priority === 'high');
  const desktopSize = getPreferredSize(slotKey, format as AdPlaceholderProps['format']);
  const mobileSize = ADSTERRA_SLOT_SIZES[slotKey].mobile;
  const activeSize = isDesktopViewport ? desktopSize : mobileSize;
  const activeDimensions = ADSTERRA_DIMENSIONS[activeSize];
  const activeKey = getAdsterraZoneKey(activeSize);
  const isConfigured = isAdsterraZoneConfigured(activeKey);
  const reservedHeight = Math.max(minHeight, activeDimensions.height);

  const srcDoc = useMemo(
    () => buildAdsterraSrcDoc(activeKey, activeDimensions.width, activeDimensions.height),
    [activeDimensions.height, activeDimensions.width, activeKey]
  );

  useEffect(() => {
    trackEvent('adsterra_slot_mounted', {
      slot_key: slotKey,
      desktop_size: desktopSize,
      mobile_size: mobileSize,
      priority,
    });
  }, [desktopSize, mobileSize, priority, slotKey]);

  useEffect(() => {
    if (!lazy || priority === 'high') {
      setShouldLoad(true);
      return;
    }

    const containerElement = containerRef.current;
    if (!containerElement) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setShouldLoad(true);
        trackEvent('adsterra_slot_viewport_entry', {
          slot_key: slotKey,
          desktop_size: desktopSize,
          mobile_size: mobileSize,
        });
        observer.disconnect();
      },
      { rootMargin: ADSTERRA_LAZY_MARGIN }
    );

    observer.observe(containerElement);

    return () => observer.disconnect();
  }, [desktopSize, lazy, mobileSize, priority, slotKey]);

  useEffect(() => {
    if (!shouldLoad || !isConfigured) return;
    trackEvent('adsterra_slot_request', {
      slot_key: slotKey,
      active_size: activeSize,
      priority,
    });
  }, [activeSize, isConfigured, priority, shouldLoad, slotKey]);

  if (!isConfigured || !shouldLoad) {
    return (
      <div
        ref={containerRef}
        className={`bg-gray-950 border-2 border-dashed border-gray-800 rounded-lg flex items-center justify-center p-4 ${className ?? ''}`.trim()}
        style={{ minHeight: reservedHeight }}
      >
        <span className="text-gray-600 text-center">{fallbackLabel} ({activeSize})</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`bg-gray-950 border border-gray-900 rounded-lg p-2 overflow-hidden ${className ?? ''}`.trim()}
      style={{ minHeight: reservedHeight, maxWidth: '100%' }}
      role="complementary"
      aria-label={fallbackLabel}
    >
      <iframe
        key={`${slotKey}-${activeSize}`}
        title={`${slotKey}-adsterra-${activeSize}-${uniqueId}`}
        className="mx-auto block border-0"
        width={activeDimensions.width}
        height={activeDimensions.height}
        scrolling="no"
        loading={priority === 'high' ? 'eager' : 'lazy'}
        srcDoc={srcDoc}
      />
    </div>
  );
};

export default AdPlaceholder;
