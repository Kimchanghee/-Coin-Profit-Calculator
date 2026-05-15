import React from 'react';
import type { AdSlotKey } from '../marketing';

interface AdPlaceholderProps {
  slotKey: AdSlotKey;
  className?: string;
  fallbackLabel?: string;
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  minHeight?: number;
  lazy?: boolean;
  priority?: 'high' | 'normal';
}

const AdPlaceholder: React.FC<AdPlaceholderProps> = () => null;

export default AdPlaceholder;
