export const ADSENSE_CLIENT_ID = import.meta.env.VITE_ADSENSE_CLIENT_ID ?? '';

export const ADSENSE_SLOT_IDS = {
  sidebarTop: import.meta.env.VITE_ADSENSE_SLOT_SIDEBAR_TOP ?? '',
  sidebarBottom: import.meta.env.VITE_ADSENSE_SLOT_SIDEBAR_BOTTOM ?? '',
} as const;

export type AdSlotKey = keyof typeof ADSENSE_SLOT_IDS;

export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID ?? '';

const ADSENSE_CLIENT_ID_PATTERN = /^ca-pub-\d{16}$/;
const GA_MEASUREMENT_ID_PATTERN = /^G-[A-Z0-9]+$/i;

export const isAdsenseConfigured = () => ADSENSE_CLIENT_ID_PATTERN.test(ADSENSE_CLIENT_ID);

export const isAnalyticsConfigured = () => GA_MEASUREMENT_ID_PATTERN.test(GA_MEASUREMENT_ID);
