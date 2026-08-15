import type { ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import './Callout.css';

export type CalloutVariant = 'received' | 'sent' | 'pending';

export interface CalloutProps {
  message: string;
  timestamp: string;
  variant: CalloutVariant;
  /** Sent shows a checkmark, Pending a clock - pass your own icon for either. */
  statusIcon?: ReactNode;
  className?: string;
}

/** Snacky Callout - chat message bubble. Received aligns left/white, Sent/Pending align right/accent. */
export function Callout({ message, timestamp, variant, statusIcon, className }: CalloutProps) {
  return (
    <div className={cx('snacky-callout', `snacky-callout--${variant}`, className)}>
      <p className="snacky-callout__message">{message}</p>
      <span className="snacky-callout__meta">
        {timestamp}
        {statusIcon && variant !== 'received' && <span className="snacky-callout__meta-icon">{statusIcon}</span>}
      </span>
    </div>
  );
}
