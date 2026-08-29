import { cx } from '../../utils/cx.js';
import './ImagePlaceholder.css';

export interface ImagePlaceholderProps {
  /** Match the width of the image slot this replaces. */
  width: number;
  /** Match the height of the image slot this replaces. */
  height: number;
  className?: string;
}

/**
 * Snacky Image Placeholder - a neutral "no image yet" state for any of this
 * package's required image slots (ProductCard, ProductImage, Avatar, the
 * Banner family, Illustration). This package ships no photography or
 * illustration artwork (see Illustration's own doc comment), so every image
 * prop is required rather than optional - pass this explicitly for a
 * genuinely empty state (a new product with no photo yet, a user with no
 * avatar) instead of inventing your own placeholder or leaving `src` empty,
 * which falls through to the browser's own broken-image icon.
 *
 * ```tsx
 * {photo ? (
 *   <ProductCard imageUrl={photo} ... />
 * ) : (
 *   <ImagePlaceholder width={152} height={128} />
 * )}
 * ```
 *
 * Standalone utility, not one of the 24 Figma-sourced components - there is
 * no Figma node for it. It exists to close a real integration gap without
 * reaching for stock imagery this package has no rights to bundle. Apply
 * your own border radius via `className` to match whatever slot it fills.
 */
export function ImagePlaceholder({ width, height, className }: ImagePlaceholderProps) {
  const iconSize = Math.round(Math.min(width, height) * 0.32);
  return (
    <div
      className={cx('snacky-image-placeholder', className)}
      style={{ width, height }}
      role="img"
      aria-label="No image"
    >
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" stroke="none" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    </div>
  );
}
