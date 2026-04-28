const defaultString = (value: unknown, fallback: string): string => {
  const trimmed = String(value ?? '').trim();
  return trimmed.length > 0 ? trimmed : fallback;
};

export const ADSTERRA_DOMAIN_ID = 5752840;
export const ADSTERRA_SELLER_ID = '25838423';

export const ADSTERRA_ZONE_KEYS = {
  leaderboard: defaultString(import.meta.env.VITE_ADSTERRA_728_KEY, '088a70ca7e3c76c2f716675bf43f40ad'),
  rectangle: defaultString(import.meta.env.VITE_ADSTERRA_300_KEY, '8c9983d2e443c2e7b96b5a9064f7455e'),
  skyscraper: defaultString(import.meta.env.VITE_ADSTERRA_160_KEY, '09905b00a66dd0981eae1c8d3736cedb'),
  mobile: defaultString(import.meta.env.VITE_ADSTERRA_320_KEY, '2bc0864a210835bdbf935abf5c6cb4be'),
} as const;

export type AdSlotKey = 'headerBanner' | 'inArticle' | 'sidebarTop' | 'sidebarBottom' | 'footerBanner';
export type AdsterraSize = '728x90' | '300x250' | '160x600' | '320x50';

export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID ?? '';

const GA_MEASUREMENT_ID_PATTERN = /^G-[A-Z0-9]+$/i;
const ADSTERRA_ZONE_KEY_PATTERN = /^[a-f0-9]{32}$/i;

export const ADSTERRA_SLOT_SIZES: Record<AdSlotKey, { desktop: AdsterraSize; mobile: AdsterraSize }> = {
  headerBanner: { desktop: '728x90', mobile: '320x50' },
  inArticle: { desktop: '300x250', mobile: '300x250' },
  sidebarTop: { desktop: '160x600', mobile: '300x250' },
  sidebarBottom: { desktop: '160x600', mobile: '300x250' },
  footerBanner: { desktop: '728x90', mobile: '320x50' },
};

export const isAnalyticsConfigured = () => GA_MEASUREMENT_ID_PATTERN.test(GA_MEASUREMENT_ID);

export const isAdsterraZoneConfigured = (key: string) => ADSTERRA_ZONE_KEY_PATTERN.test(key);

export const getAdsterraZoneKey = (size: AdsterraSize): string => {
  if (size === '728x90') return ADSTERRA_ZONE_KEYS.leaderboard;
  if (size === '160x600') return ADSTERRA_ZONE_KEYS.skyscraper;
  if (size === '320x50') return ADSTERRA_ZONE_KEYS.mobile;
  return ADSTERRA_ZONE_KEYS.rectangle;
};
