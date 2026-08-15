import { cx } from '../../utils/cx.js';
import './Illustration.css';

export type IllustrationVariant = 'empty' | 'createAccount' | 'welcome' | 'success' | 'discountReferral';

const SIZE: Record<IllustrationVariant, { width: number; height: number }> = {
  empty: { width: 268, height: 200 },
  createAccount: { width: 360, height: 240 },
  welcome: { width: 200, height: 200 },
  success: { width: 200, height: 200 },
  discountReferral: { width: 268, height: 200 },
};

export interface IllustrationProps {
  variant: IllustrationVariant;
  /** Host your own export of this illustration (this package ships no artwork). */
  src: string;
  alt: string;
  className?: string;
}

/** Snacky Illustration - decorative spot illustration for empty states, onboarding, confirmations. */
export function Illustration({ variant, src, alt, className }: IllustrationProps) {
  const { width, height } = SIZE[variant];
  return <img src={src} alt={alt} width={width} height={height} className={cx('snacky-illustration', className)} />;
}
