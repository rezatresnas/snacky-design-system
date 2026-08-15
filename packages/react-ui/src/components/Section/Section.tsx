import type { ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import './Section.css';

export interface SectionProps {
  title: string;
  /** Small circular chevron button in the header, shown when provided (e.g. "see more"). */
  onAction?: () => void;
  children: ReactNode;
  className?: string;
}

/**
 * Snacky Section - the shared content-block shell every documented Section
 * "variant" (Variant Selector, Product Description, Buyer Reviews, product
 * rows, Order Summary, etc.) composes from, matching
 * `SnackySection(title = "...", onAction = {...}) { ...content... }`.
 */
export function Section({ title, onAction, children, className }: SectionProps) {
  return (
    <section className={cx('snacky-section', className)}>
      <div className="snacky-section__header">
        <h3 className="snacky-section__title">{title}</h3>
        {onAction && (
          <button type="button" className="snacky-section__action" onClick={onAction} aria-label={`See more: ${title}`}>
            <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
              <path d="M6 3.5L10.5 8L6 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>
      {children}
    </section>
  );
}
