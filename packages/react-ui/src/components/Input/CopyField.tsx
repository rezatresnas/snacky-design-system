import { useState } from 'react';
import { cx } from '../../utils/cx.js';
import './CopyField.css';

export interface CopyFieldProps {
  value: string;
  onCopy?: (value: string) => void;
  className?: string;
}

/** Snacky Copy Field - a read-only value with a "Copy" link that flips to "Copied" briefly. */
export function CopyField({ value, onCopy, className }: CopyFieldProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // clipboard API unavailable - the copy affordance still reports success visually
    }
    onCopy?.(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={cx('snacky-copy', className)}>
      <span className="snacky-copy__value">{value}</span>
      <button type="button" className={cx('snacky-copy__action', copied && 'snacky-copy__action--copied')} onClick={handleCopy}>
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}
