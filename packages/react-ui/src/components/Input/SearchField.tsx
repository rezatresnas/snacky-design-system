import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import './SearchField.css';

export interface SearchFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  searchIcon?: ReactNode;
  onClear?: () => void;
}

/** Snacky Search Field - compact 40px field with a leading search icon and a clear button once filled. */
export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(function SearchField(
  { value, onChange, searchIcon, onClear, className, placeholder = 'Search products...', ...rest },
  ref
) {
  return (
    <div className={cx('snacky-search', className)}>
      {searchIcon && <span className="snacky-search__icon">{searchIcon}</span>}
      <input
        ref={ref}
        className="snacky-search__input"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        {...rest}
      />
      {value && onClear && (
        <button type="button" className="snacky-search__clear" onClick={onClear} aria-label="Clear search">
          ✕
        </button>
      )}
    </div>
  );
});
