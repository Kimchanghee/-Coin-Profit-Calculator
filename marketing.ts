export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID ?? '';

const GA_MEASUREMENT_ID_PATTERN = /^G-[A-Z0-9]+$/i;

export const isAnalyticsConfigured = () => GA_MEASUREMENT_ID_PATTERN.test(GA_MEASUREMENT_ID);
