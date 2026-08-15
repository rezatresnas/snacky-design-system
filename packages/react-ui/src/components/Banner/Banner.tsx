import type { ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import './Banner.css';

export interface ImageBannerProps {
  imageUrl: string;
  alt: string;
  onClick?: () => void;
  className?: string;
}

/** Snacky Hero Banner - main promo carousel image. */
export function HeroBanner({ imageUrl, alt, onClick, className }: ImageBannerProps) {
  return <img src={imageUrl} alt={alt} onClick={onClick} className={cx('snacky-banner-hero', className)} />;
}

/** Snacky Square Banner - featured category tile (Discount / Favourites / Deals). */
export function SquareBanner({ imageUrl, alt, onClick, className }: ImageBannerProps) {
  return <img src={imageUrl} alt={alt} onClick={onClick} className={cx('snacky-banner-square', className)} />;
}

/** Snacky Full-width Banner - prominent promotional banner on detail pages. */
export function FullWidthBanner({ imageUrl, alt, onClick, className }: ImageBannerProps) {
  return <img src={imageUrl} alt={alt} onClick={onClick} className={cx('snacky-banner-full', className)} />;
}

export interface PointBalanceBannerProps {
  pointsIcon: ReactNode;
  points: string;
  balanceIcon: ReactNode;
  balance: string;
  className?: string;
}

/** Snacky Point Balance Banner - loyalty points + wallet balance summary strip. */
export function PointBalanceBanner({ pointsIcon, points, balanceIcon, balance, className }: PointBalanceBannerProps) {
  return (
    <div className={cx('snacky-banner-point-balance', className)}>
      <div className="snacky-banner-point-balance__item">
        <span className="snacky-banner-point-balance__icon">{pointsIcon}</span>
        <div>
          <p className="snacky-banner-point-balance__label">Points</p>
          <p className="snacky-banner-point-balance__value">{points}</p>
        </div>
      </div>
      <div className="snacky-banner-point-balance__divider" />
      <div className="snacky-banner-point-balance__item">
        <span className="snacky-banner-point-balance__icon">{balanceIcon}</span>
        <div>
          <p className="snacky-banner-point-balance__label">Balance</p>
          <p className="snacky-banner-point-balance__value">{balance}</p>
        </div>
      </div>
    </div>
  );
}

export interface AlertBannerProps {
  message: string;
  countdown?: string;
  className?: string;
}

/** Snacky Alert Banner - inline info/warning strip, optionally with a countdown. */
export function AlertBanner({ message, countdown, className }: AlertBannerProps) {
  return (
    <div className={cx('snacky-banner-alert', className)}>
      <p className="snacky-banner-alert__message">{message}</p>
      {countdown && <p className="snacky-banner-alert__countdown">{countdown}</p>}
    </div>
  );
}
