const defaultString = (value: unknown, fallback: string): string => {
  const trimmed = String(value ?? '').trim();
  return trimmed.length > 0 ? trimmed : fallback;
};

export const ADSTERRA_DOMAIN_ID = 5752506;
export const ADSTERRA_SELLER_ID = '25838423';

export const ADSTERRA_ZONE_KEYS = {
  leaderboard: defaultString(import.meta.env.VITE_ADSTERRA_728_KEY, '9f438e50c758b7b6688c24531c7db784'),
  rectangle: defaultString(import.meta.env.VITE_ADSTERRA_300_KEY, '50a099945ac68e0be8d16466f67f0a2a'),
  skyscraper: defaultString(import.meta.env.VITE_ADSTERRA_160_KEY, '33b0bf9260f4fa57324614ebfc48182d'),
  mobile: defaultString(import.meta.env.VITE_ADSTERRA_320_KEY, 'aa05b9fd1fff117b1528e9fd5ab6c337'),
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
