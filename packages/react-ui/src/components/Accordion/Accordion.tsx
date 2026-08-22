import { useId, useState, type ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import './Accordion.css';

export interface AccordionProps {
  title: string;
  /** When passed, uses the compact 12px title (icon-slot variant) - e.g. a payment-method logo. */
  leadingIcon?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

/**
 * Snacky Accordion - header and (when open) panel render as two separate
 * elevated cards with a small gap between them, not one continuous card;
 * title size responds to whether `leadingIcon` is passed (matches the
 * Figma source, which models icon presence as a real variant rather than
 * optional content). Neither state ever has a border, only elevation.
 */
export function Accordion({ title, leadingIcon, children, defaultOpen = false, className }: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <div className={cx('snacky-accordion', !!leadingIcon && 'snacky-accordion--icon', className)}>
      <button
        type="button"
        className="snacky-accordion__header"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        {leadingIcon && <span className="snacky-accordion__icon">{leadingIcon}</span>}
        <span className="snacky-accordion__title">{title}</span>
        <svg
          className={cx('snacky-accordion__chevron', open && 'snacky-accordion__chevron--open')}
          viewBox="0 0 20 20"
          fill="none"
        >
          <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div id={panelId} className="snacky-accordion__panel">
          {children}
        </div>
      )}
    </div>
  );
}
