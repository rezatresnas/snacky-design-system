import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import './TextField.css';

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size'> {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  /** Leading (left) icon or logo - e.g. a marker or payment-method logo. */
  leadingIcon?: ReactNode;
  /** Trailing (right) icon - e.g. eye toggle, chevron, calendar, clear. */
  trailingIcon?: ReactNode;
  /** Rotates the trailing icon 180deg - used by Dropdown while open. */
  trailingIconRotated?: boolean;
  error?: boolean | string;
}

/**
 * Snacky Text Field - the shared 312x48 field used for Text, Password
 * (type="password" + trailingIcon), Dropdown (trailingIcon chevron, readOnly),
 * Date Picker (trailingIcon calendar, readOnly) and Address (leading/trailing
 * marker). Focus/error borders are real CSS (:focus-within, .snacky-field--error),
 * not JS-tracked state.
 */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  {
    value,
    onChange,
    label,
    leadingIcon,
    trailingIcon,
    trailingIconRotated = false,
    error,
    disabled,
    className,
    id,
    ...rest
  },
  ref
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const errorMessage = typeof error === 'string' ? error : undefined;

  return (
    <div className={className}>
      {label && (
        <label className="snacky-field-label" htmlFor={fieldId}>
          {label}
        </label>
      )}
      <div
        className={cx('snacky-field', !!error && 'snacky-field--error', disabled && 'snacky-field--disabled')}
      >
        {leadingIcon && <span className="snacky-field__icon">{leadingIcon}</span>}
        <input
          ref={ref}
          id={fieldId}
          className="snacky-field__input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          {...rest}
        />
        {trailingIcon && (
          <span
            className="snacky-field__icon"
            style={trailingIconRotated ? { transform: 'rotate(180deg)' } : undefined}
          >
            {trailingIcon}
          </span>
        )}
      </div>
      {errorMessage && <span className="snacky-field-error">{errorMessage}</span>}
    </div>
  );
});
