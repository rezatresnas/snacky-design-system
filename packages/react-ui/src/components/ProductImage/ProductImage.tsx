import { cx } from '../../utils/cx.js';
import './ProductImage.css';

export type ProductImageUsage = 'product-card' | 'product-details' | 'list' | 'review' | 'variant' | 'accordion-modal';

export interface ProductImageProps {
  src: string;
  alt: string;
  usage: ProductImageUsage;
  /** Overlays a centered "Sold Out" badge - product-card and product-details only. */
  sold?: boolean;
  className?: string;
}

/**
 * Snacky Product Image - adapts its frame size/border to where it appears:
 * product-card (128) and product-details (200) are bare transparent images;
 * list (56/48 inner) and review (48/40 inner, bordered) wrap in a padded
 * frame; variant (88) is a bordered selection frame; accordion-modal (24)
 * renders a payment-method logo instead of a product photo.
 */
export function ProductImage({ src, alt, usage, sold = false, className }: ProductImageProps) {
  return (
    <span className={cx('snacky-product-image-wrap', `snacky-product-image-wrap--${usage}`, className)}>
      <img src={src} alt={alt} className={cx('snacky-product-image', `snacky-product-image--${usage}`)} />
      {sold && (
        <span className="snacky-product-image-sold-overlay">
          <span className="snacky-product-image-sold-label">Sold Out</span>
        </span>
      )}
    </span>
  );
}
