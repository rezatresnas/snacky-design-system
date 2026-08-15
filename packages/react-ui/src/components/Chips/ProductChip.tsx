import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import './Chips.css';

export interface ProductChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  selected: boolean;
  thumbnail: ReactNode;
}

/** Snacky Product Chip - pill chip with a 24x24 thumbnail (e.g. weight/variant picker). */
export function ProductChip({ label, selected, thumbnail, onClick, className, ...rest }: ProductChipProps) {
  return (
    <button
      type="button"
      className={cx('snacky-chip', selected && 'snacky-chip--selected', className)}
      aria-pressed={selected}
      onClick={onClick}
      {...rest}
    >
      <span className="snacky-chip__thumb">{thumbnail}</span>
      {label}
    </button>
  );
}
