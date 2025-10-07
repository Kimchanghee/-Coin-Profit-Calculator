export const ADSENSE_CLIENT_ID = import.meta.env.VITE_ADSENSE_CLIENT_ID ?? '';

export const ADSENSE_SLOT_IDS = {
  sidebarTop: import.meta.env.VITE_ADSENSE_SLOT_SIDEBAR_TOP ?? '',
  sidebarBottom: import.meta.env.VITE_ADSENSE_SLOT_SIDEBAR_BOTTOM ?? '',
} as const;

export type AdSlotKey = keyof typeof ADSENSE_SLOT_IDS;

export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID ?? '';

export const isAdsenseConfigured = () => Boolean(ADSENSE_CLIENT_ID);

export const isAnalyticsConfigured = () => Boolean(GA_MEASUREMENT_ID);
