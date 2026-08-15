import type { ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
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
      {icon && <span className="snacky-address-result__icon">{icon}</span>}
      <span>
        <p className="snacky-address-result__title">{title}</p>
        <p className="snacky-address-result__subtitle">{subtitle}</p>
      </span>
    </button>
  );
}
