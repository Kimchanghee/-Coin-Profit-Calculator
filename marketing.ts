export const ADSENSE_CLIENT_ID = import.meta.env.VITE_ADSENSE_CLIENT_ID ?? '';

export const ADSENSE_SLOT_IDS = {
  headerBanner: import.meta.env.VITE_ADSENSE_SLOT_HEADER_BANNER ?? '',
  inArticle: import.meta.env.VITE_ADSENSE_SLOT_IN_ARTICLE ?? '',
  sidebarTop: import.meta.env.VITE_ADSENSE_SLOT_SIDEBAR_TOP ?? '',
  sidebarBottom: import.meta.env.VITE_ADSENSE_SLOT_SIDEBAR_BOTTOM ?? '',
  footerBanner: import.meta.env.VITE_ADSENSE_SLOT_FOOTER_BANNER ?? '',
} as const;

export type AdSlotKey = keyof typeof ADSENSE_SLOT_IDS;

export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID ?? '';

const ADSENSE_CLIENT_ID_PATTERN = /^ca-pub-\d{16}$/;
const ADSENSE_SLOT_PATTERN = /^\d{10}$/;
const GA_MEASUREMENT_ID_PATTERN = /^G-[A-Z0-9]+$/i;

const parseBoolean = (value: string | undefined, fallback: boolean) => {
  if (!value) {
    return fallback;
  }

  const normalized = value.trim().toLowerCase();
  if (normalized === '1' || normalized === 'true' || normalized === 'yes') {
    return true;
  }
  if (normalized === '0' || normalized === 'false' || normalized === 'no') {
    return false;
  }
  return fallback;
};

export const ADSENSE_SETTINGS = {
  lazyLoadEnabled: parseBoolean(import.meta.env.VITE_ADSENSE_LAZY_LOAD, true),
  lazyRootMargin: import.meta.env.VITE_ADSENSE_LAZY_ROOT_MARGIN ?? '400px 0px',
  fallbackEnabledInProd: parseBoolean(import.meta.env.VITE_ADSENSE_SHOW_FALLBACK_IN_PROD, false),
} as const;

export const isAdsenseConfigured = () => ADSENSE_CLIENT_ID_PATTERN.test(ADSENSE_CLIENT_ID);

export const isAnalyticsConfigured = () => GA_MEASUREMENT_ID_PATTERN.test(GA_MEASUREMENT_ID);

export const hasAdSlotConfigured = (slotKey: AdSlotKey) => ADSENSE_SLOT_PATTERN.test(ADSENSE_SLOT_IDS[slotKey]);

export const getConfiguredAdSlotKeys = () => {
  return (Object.keys(ADSENSE_SLOT_IDS) as AdSlotKey[]).filter(hasAdSlotConfigured);
};
