import type { ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import './Navbar.css';

export interface NavItem {
  label: string;
  icon: ReactNode;
  activeIcon?: ReactNode;
}

export interface NavBarProps {
  items: NavItem[];
  selected: number;
  onSelect: (index: number) => void;
  className?: string;
}

/** Snacky Nav Bar - bottom navigation, 5 tabs for the customer flow. */
export function NavBar({ items, selected, onSelect, className }: NavBarProps) {
  return (
    <nav className={cx('snacky-navbar', className)}>
      {items.map((item, i) => {
        const active = i === selected;
        return (
          <button
            key={item.label}
            type="button"
            className={cx('snacky-navbar__item', active && 'snacky-navbar__item--active')}
            aria-current={active ? 'page' : undefined}
            onClick={() => onSelect(i)}
          >
            <span className="snacky-navbar__icon">{active && item.activeIcon ? item.activeIcon : item.icon}</span>
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
