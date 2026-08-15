import { useId } from 'react';
import { cx } from '../../utils/cx.js';
import './RadioButton.css';

export interface RadioOptionProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
  name?: string;
  className?: string;
}

/** Snacky Radio Option - single-selection control. Always use within a group of 2+ options. */
export function RadioOption({ label, selected, onClick, disabled, name, className }: RadioOptionProps) {
  const id = useId();
  return (
    <label
      htmlFor={id}
      className={cx('snacky-radio-option', disabled && 'snacky-radio-option--disabled', className)}
    >
      <input
        id={id}
        type="radio"
        className="snacky-radio"
        name={name}
        checked={selected}
        disabled={disabled}
        onChange={onClick}
      />
      {label}
    </label>
  );
}
