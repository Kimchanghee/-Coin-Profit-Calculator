/**
 * Google AdSense Configuration
 *
 * Environment Variables Required:
 * - VITE_ADSENSE_CLIENT_ID: Your AdSense Publisher ID (ca-pub-XXXXXXXXXXXXXXXX)
 * - VITE_ADSENSE_SLOT_SIDEBAR_TOP: Ad slot ID for sidebar top
 * - VITE_ADSENSE_SLOT_SIDEBAR_BOTTOM: Ad slot ID for sidebar bottom
 */

export const ADSENSE_CLIENT_ID = import.meta.env.VITE_ADSENSE_CLIENT_ID ?? '';

export const ADSENSE_SLOT_IDS = {
  sidebarTop: import.meta.env.VITE_ADSENSE_SLOT_SIDEBAR_TOP ?? '',
  sidebarBottom: import.meta.env.VITE_ADSENSE_SLOT_SIDEBAR_BOTTOM ?? '',
  headerBanner: import.meta.env.VITE_ADSENSE_SLOT_HEADER_BANNER ?? '',
  footerBanner: import.meta.env.VITE_ADSENSE_SLOT_FOOTER_BANNER ?? '',
  inArticle: import.meta.env.VITE_ADSENSE_SLOT_IN_ARTICLE ?? '',
} as const;

export type AdSlotKey = keyof typeof ADSENSE_SLOT_IDS;

/**
 * Check if Google AdSense is properly configured
 * @returns true if ADSENSE_CLIENT_ID is set and valid
 */
export const isAdsenseConfigured = (): boolean => {
  return Boolean(ADSENSE_CLIENT_ID) && ADSENSE_CLIENT_ID.startsWith('ca-pub-');
};

/**
 * Get all configured ad slots
 * @returns Array of configured slot keys
 */
export const getConfiguredSlots = (): AdSlotKey[] => {
  return (Object.keys(ADSENSE_SLOT_IDS) as AdSlotKey[]).filter(
    key => Boolean(ADSENSE_SLOT_IDS[key])
  );
};

/**
 * AdSense configuration options
 */
export const adsenseConfig = {
  // Enable test mode (shows test ads)
  testMode: import.meta.env.DEV,

  // Auto ads (full page optimization)
  autoAds: false,

  // Ad formats
  formats: {
    responsive: 'auto',
    rectangle: 'rectangle',
    horizontal: 'horizontal',
    vertical: 'vertical',
  },

  // Retry settings
  retry: {
    enabled: true,
    maxAttempts: 3,
    delayMs: 1000,
  },

  // Performance settings
  lazyLoad: true,
  delayMs: 500,
} as const;

/**
 * Ad placement recommendations
 */
export const adPlacements = {
  sidebar: {
    recommended: ['sidebarTop', 'sidebarBottom'],
    format: 'vertical',
    minHeight: '250px',
  },
  header: {
    recommended: ['headerBanner'],
    format: 'horizontal',
    minHeight: '90px',
  },
  footer: {
    recommended: ['footerBanner'],
    format: 'horizontal',
    minHeight: '90px',
  },
  content: {
    recommended: ['inArticle'],
    format: 'auto',
    minHeight: '250px',
  },
} as const;
