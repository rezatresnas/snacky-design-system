import type { ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import { angleSmallRight as AngleSmallRightIcon } from '../../icons/solid.js';
import { IconButton } from '../IconButton/IconButton.js';
import './Section.css';

export interface SectionProps {
  title: string;
  /** "See more" action, shown when provided: Figma's small Icon-Button (24px circle, full-size angle chevron). */
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
          <IconButton size="small" icon={<AngleSmallRightIcon />} onClick={onAction} ariaLabel={`See more: ${title}`} />
        )}
      </div>
      {children}
    </section>
  );
}
