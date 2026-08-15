import { useId } from 'react';
import { cx } from '../../utils/cx.js';
import './Checkbox.css';

export interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

/** Snacky Checkbox - binary on/off selection control. */
export function Checkbox({ label, checked, onChange, disabled, className }: CheckboxProps) {
  const id = useId();
  return (
    <label htmlFor={id} className={cx('snacky-checkbox-option', className)}>
      <input
        id={id}
        type="checkbox"
        className="snacky-checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}
