export interface Language {
  code: string;
  name: string;
}

export type TranslationKey = 
  | 'title'
  | 'description'
  | 'meta_keywords'
  | 'og_title'
  | 'og_description'
  | 'referral_banner_title'
  | 'referral_banner_subtitle'
  | 'referral_banner_cta'
  | 'calculator_title'
  | 'entry_price'
  | 'target_price'
  | 'leverage'
  | 'investment'
  | 'fee_rate'
  | 'calculate_button'
  | 'results_title'
  | 'pnl'
  | 'roi'
  | 'fees'
  | 'total_value'
  | 'reset_button'
  | 'long_position'
  | 'short_position'
  | 'position_type'
  | 'error_invalid_numbers'
  | 'referral_payback_toggle'
  | 'referral_payback_rate';

export type Translations = Record<TranslationKey, string>;

export enum PositionType {
    LONG = 'LONG',
    SHORT = 'SHORT'
}