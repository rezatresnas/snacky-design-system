import type { ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import './Badge.css';

export interface NotificationBadgeProps {
  count: number;
  max?: number;
  children: ReactNode;
  className?: string;
}

/** Snacky Notification Badge - numeric count overlay on an icon (e.g. cart). */
export function NotificationBadge({ count, max = 99, children, className }: NotificationBadgeProps) {
  if (count <= 0) return <>{children}</>;
  return (
    <span className={cx('snacky-badge-wrap', className)}>
      {children}
      <span className="snacky-badge-notification">{count > max ? `${max}+` : count}</span>
    </span>
  );
}

export interface DiscountTagProps {
  label: string;
  className?: string;
}

/** Snacky Discount Tag - inline promo/percentage-off tag, e.g. on Product Card. */
export function DiscountTag({ label, className }: DiscountTagProps) {
  return <span className={cx('snacky-discount-tag', className)}>{label}</span>;
}

export interface SoldOutBadgeProps {
  className?: string;
}

/** Snacky Sold Out Badge - absolute overlay on a product image. Position it with your own layout. */
export function SoldOutBadge({ className }: SoldOutBadgeProps) {
  return <span className={cx('snacky-soldout-badge', className)}>Sold Out</span>;
}

export interface VariantBadgeProps {
  label: string;
  className?: string;
}

/** Snacky Variant Badge - static, non-interactive label for the currently selected product variant. */
export function VariantBadge({ label, className }: VariantBadgeProps) {
  return <span className={cx('snacky-variant-badge', className)}>{label}</span>;
}
