import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import './IconButton.css';

export type IconButtonVariant = 'primary' | 'secondary' | 'tertiary';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant;
  /** 24px (default) or 16px (small) circle - only meaningful on the primary variant. */
  size?: 'default' | 'small';
  icon: ReactNode;
  /** Toggled/favorited state on the Secondary variant - tints the icon with icon-active, fill unchanged. */
  selected?: boolean;
  /** Accessible label - required since the button has no visible text. */
  ariaLabel: string;
}

/**
 * Snacky Icon Button - compact circular touch target for a single icon.
 * Secondary doubles as a toggle control via `selected` (e.g. Favorite).
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { variant = 'primary', size = 'default', icon, selected = false, ariaLabel, className, disabled, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={selected}
      className={cx(
        'snacky-iconbtn',
        `snacky-iconbtn--${variant}`,
        size === 'small' && 'snacky-iconbtn--small',
        selected && 'snacky-iconbtn--selected',
        className
      )}
      {...rest}
    >
      <span className="snacky-iconbtn__icon">{icon}</span>
    </button>
  );
});
