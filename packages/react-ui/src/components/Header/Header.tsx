import type { ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import { SnackyIcons } from '../../icons/index.js';
import './Header.css';

export type HeaderLeadingIcon = 'back' | 'close';

export interface HeaderProps {
  title: string;
  /** Back drills deeper into a flow (goes to the previous screen); Close dismisses it entirely. */
  leadingIcon?: HeaderLeadingIcon;
  onLeadingClick?: () => void;
  /** Only ever pairs with leadingIcon="close", never "back", per the documented variants. */
  trailingIcon?: ReactNode;
  onTrailingClick?: () => void;
  className?: string;
}

/**
 * Snacky Header - page header bar. Title always centers in the remaining
 * space - when a leading icon is present but there's no trailing action,
 * the title row gets matching right padding so it stays optically centered
 * against the whole bar, not just the leftover space next to the icon.
 */
export function Header({ title, leadingIcon, onLeadingClick, trailingIcon, onTrailingClick, className }: HeaderProps) {
  const LeadingIconEl = leadingIcon === 'back' ? SnackyIcons.outline.back : SnackyIcons.outline.close;
  return (
    <header className={cx('snacky-header', className)}>
      {leadingIcon && (
        <button
          type="button"
          className="snacky-header__icon-btn"
          onClick={onLeadingClick}
          aria-label={leadingIcon === 'back' ? 'Back' : 'Close'}
        >
          <LeadingIconEl width={24} height={24} />
        </button>
      )}
      <div className={cx('snacky-header__title-row', leadingIcon && !trailingIcon && 'snacky-header__title-row--balance')}>
        <span className="snacky-header__title">{title}</span>
      </div>
      {trailingIcon && (
        <button type="button" className="snacky-header__icon-btn" onClick={onTrailingClick} aria-label="Action">
          {trailingIcon}
        </button>
      )}
    </header>
  );
}
