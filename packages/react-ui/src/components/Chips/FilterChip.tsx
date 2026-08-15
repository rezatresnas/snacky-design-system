import type { ButtonHTMLAttributes } from 'react';
import { cx } from '../../utils/cx.js';
import './Chips.css';

export interface FilterChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  selected: boolean;
}

/** Snacky Filter Chip - text-only pill toggle, e.g. category/sort filters. */
export function FilterChip({ label, selected, onClick, className, ...rest }: FilterChipProps) {
  return (
    <button
      type="button"
      className={cx('snacky-chip', selected && 'snacky-chip--selected', className)}
      aria-pressed={selected}
      onClick={onClick}
      {...rest}
    >
      {label}
    </button>
  );
}
