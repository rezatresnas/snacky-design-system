import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import './UploadButton.css';

export interface UploadButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  ariaLabel?: string;
}

/** Snacky Upload Button - circular dashed-border image drop zone. */
export const UploadButton = forwardRef<HTMLButtonElement, UploadButtonProps>(function UploadButton(
  { icon, ariaLabel = 'Upload image', className, ...rest },
  ref
) {
  return (
    <button ref={ref} type="button" aria-label={ariaLabel} className={cx('snacky-upload', className)} {...rest}>
      {icon}
    </button>
  );
});
