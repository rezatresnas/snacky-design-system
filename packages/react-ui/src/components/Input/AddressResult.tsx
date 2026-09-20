import type { ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
// The map pin is part of this row's spec, not caller decoration: Figma draws
// it in every "Address, Search" state and the docs sample passes it at 20px.
// Omitting the prop used to render a bare two-line row.
import { address as AddressIcon } from '../../icons/outline.js';
import './AddressResult.css';

export interface AddressResultProps {
  icon?: ReactNode;
  title: string;
  subtitle: string;
  onClick?: () => void;
  className?: string;
}

/** Snacky Address Search Result row - selected address entry in a results list. */
export function AddressResult({ icon, title, subtitle, onClick, className }: AddressResultProps) {
  return (
    <button type="button" className={cx('snacky-address-result', className)} onClick={onClick}>
      <span className="snacky-address-result__icon">{icon ?? <AddressIcon width={20} height={20} />}</span>
      <span>
        <p className="snacky-address-result__title">{title}</p>
        <p className="snacky-address-result__subtitle">{subtitle}</p>
      </span>
    </button>
  );
}
