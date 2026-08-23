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
  /** Your own export of this illustration - this package ships no artwork. */
  src: string;
  alt: string;
  className?: string;
}

/**
 * Snacky Illustration - decorative spot illustration for empty states,
 * onboarding and confirmations.
 *
 * ```tsx
 * <Illustration variant="empty" src="/img/empty.svg" alt="No products found" />
 * ```
 *
 * This ships no artwork, deliberately, and that is the normal split - Material,
 * Radix and Chakra ship none either. What belongs in a design system is the
 * documented canvas size per variant, which is what this owns; the Snacky
 * artwork itself is modified stock and is not ours to redistribute.
 *
 * Export your own at the variant's ratio (SVG preferred) and serve it wherever
 * your app already serves static assets. Open Peeps (openpeeps.com) is CC0 and
 * drops in cleanly; unDraw (undraw.co) is free without attribution but its
 * licence forbids redistributing assets "in packs", so keep it inside your own
 * app. See the package README for the fuller note.
 */
export function Illustration({ variant, src, alt, className }: IllustrationProps) {
  const { width, height } = SIZE[variant];
  return <img src={src} alt={alt} width={width} height={height} className={cx('snacky-illustration', className)} />;
}
