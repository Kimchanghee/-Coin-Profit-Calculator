/**
 * Google Analytics Configuration
 *
 * Environment Variables Required:
 * - VITE_GA_MEASUREMENT_ID: Your Google Analytics Measurement ID (G-XXXXXXXXXX)
 */

export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID ?? '';

/**
 * Check if Google Analytics is properly configured
 * @returns true if GA_MEASUREMENT_ID is set
 */
export const isAnalyticsConfigured = (): boolean => {
  return Boolean(GA_MEASUREMENT_ID) && GA_MEASUREMENT_ID.startsWith('G-');
};

/**
 * Analytics configuration options
 */
export const analyticsConfig = {
  // Enable debug mode (logs events to console)
  debug: import.meta.env.DEV,

  // Track page views automatically
  autoPageView: true,

  // Track outbound links
  trackOutboundLinks: true,

  // Track file downloads
  trackDownloads: false,

  // Cookie settings
  cookieSettings: {
    cookieDomain: 'auto',
    cookieExpires: 63072000, // 2 years in seconds
    cookiePrefix: '_ga',
  },
} as const;

/**
 * Event names for consistent tracking
 */
export const EventNames = {
  // Calculator events
  CALCULATOR_USED: 'calculator_used',
  CALCULATOR_RESET: 'calculator_reset',

  // User interaction events
  BUTTON_CLICK: 'button_click',
  LINK_CLICK: 'link_click',
  REFERRAL_CLICK: 'referral_click',

  // Language events
  LANGUAGE_CHANGE: 'language_change',

  // Ad events
  AD_IMPRESSION: 'ad_impression',
  AD_CLICK: 'ad_click',

  // Error events
  ERROR: 'exception',
} as const;

/**
 * Event categories for organization
 */
export const EventCategories = {
  ENGAGEMENT: 'engagement',
  NAVIGATION: 'navigation',
  CALCULATOR: 'calculator',
  MARKETING: 'marketing',
  ERROR: 'error',
} as const;
