import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
// Real icons as the fallback for both slots. The leading magnifier is part of
// this component's spec, not a caller decoration, so omitting the prop used to
// render the field with no icon at all; the clear button drew a literal "✕"
// character, the same "never a glyph" rule the docs give integrators. Both are
// authored at 16px in the icon set, matching the 16px slots in SearchField.css.
import { closeInput as CloseInputIcon, search as SearchIcon } from '../../icons/outline.js';
import './SearchField.css';

export interface SearchFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  searchIcon?: ReactNode;
  clearIcon?: ReactNode;
  onClear?: () => void;
}

/** Snacky Search Field - compact 40px field with a leading search icon and a clear button once filled. */
export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(function SearchField(
  { value, onChange, searchIcon, clearIcon, onClear, className, placeholder = 'Search products...', ...rest },
  ref
) {
  return (
    <div className={cx('snacky-search', className)}>
      <span className="snacky-search__icon">{searchIcon ?? <SearchIcon width={16} height={16} />}</span>
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
          {clearIcon ?? <CloseInputIcon width={16} height={16} />}
        </button>
      )}
    </div>
  );
});
