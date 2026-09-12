import { cx } from '../../utils/cx.js';
import './PageIndicator.css';

export interface PageIndicatorProps {
  /** How many pages the carousel has. */
  count: number;
  /** Zero-based index of the page currently shown. */
  activeIndex: number;
  /**
   * Announced to screen readers, defaulting to "Page 2 of 3". Pass your own
   * when the pages are not pages (a step counter, an onboarding sequence).
   */
  ariaLabel?: string;
  className?: string;
}

/**
 * Snacky Page Indicator - the dot row under a carousel. Figma draws the current
 * page as a 28x8 pill and every other page as an 8x8 dot, 4 apart, and the Home
 * hero carousel sits it 10 below the banner, centred.
 *
 * It reports position, it does not change it: the dots are decoration to a
 * screen reader and the row carries the label instead. Make the carousel itself
 * keyboard operable; do not wire clicks onto these.
 */
export function PageIndicator({ count, activeIndex, ariaLabel, className }: PageIndicatorProps) {
  return (
    <div
      className={cx('snacky-page-indicator', className)}
      role="status"
      aria-label={ariaLabel ?? `Page ${activeIndex + 1} of ${count}`}
    >
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={cx('snacky-page-indicator__dot', i === activeIndex && 'snacky-page-indicator__dot--active')}
        />
      ))}
    </div>
  );
}
