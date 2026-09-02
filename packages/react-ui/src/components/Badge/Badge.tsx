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

export interface InfoBadgeProps {
  /** The whole string, including its own prefix if it has one - Figma draws this as a single text node ("Variant: 75 Grams", "Points: 20,000"). */
  label: string;
  /** Optional 12x12 leading icon. Its presence is the only structural difference between Figma's `Property 2=variant` and `Property 2=points`. */
  icon?: ReactNode;
  className?: string;
}

/**
 * Snacky Info Badge - static, non-interactive `Label: Value` chip on the
 * accent-highlighted style, for a single attribute of something: the selected
 * product variant, a loyalty points total, and so on.
 *
 * Named for the shape of the information, not one use of it. It was
 * `VariantBadge` until Figma grew a second use (`Points: 20,000` in the Home
 * header), which was identical apart from the icon - so the icon became a slot
 * rather than the pattern becoming a second component.
 */
export function InfoBadge({ label, icon, className }: InfoBadgeProps) {
  return (
    <span className={cx('snacky-info-badge', className)}>
      {icon && <span className="snacky-info-badge__icon">{icon}</span>}
      {label}
    </span>
  );
}

/** @deprecated Renamed to {@link InfoBadge} in 0.8.0 - the same component, now with an optional `icon`. This alias will be removed in a future release. */
export const VariantBadge = InfoBadge;
/** @deprecated Renamed to {@link InfoBadgeProps} in 0.8.0. */
export type VariantBadgeProps = InfoBadgeProps;
