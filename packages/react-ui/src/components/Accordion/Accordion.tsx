import { useId, useState, type ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
// The real set icon rather than a hand-drawn polyline. Both platforms used to
// stroke (5,7.5)-(10,12.5)-(15,7.5) in a 20x20 box, copied from each other and
// not from Figma: measured off accordion-withicon-default.png, Figma's chevron
// is 11.41x5.71 and this icon at 20px is 11.67x5.98, while the polyline came
// out 11.50x6.50, about 14% too tall.
import { chevronDown as ChevronDownIcon } from '../../icons/outline.js';
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
        <span className={cx('snacky-accordion__chevron', open && 'snacky-accordion__chevron--open')}>
          <ChevronDownIcon width={20} height={20} />
        </span>
      </button>
      {open && (
        <div id={panelId} className="snacky-accordion__panel">
          {children}
        </div>
      )}
    </div>
  );
}
