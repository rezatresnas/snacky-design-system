import { cx } from '../../utils/cx.js';
import './Toggle.css';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
}

/** Snacky Toggle - switch for settings that take effect immediately, no confirm step. */
export function Toggle({ checked, onChange, disabled, ariaLabel = 'Toggle', className }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      className={cx('snacky-toggle', checked && 'snacky-toggle--on', className)}
      onClick={() => onChange(!checked)}
    >
      <span className="snacky-toggle__track" />
      <span className="snacky-toggle__thumb" />
    </button>
  );
}
