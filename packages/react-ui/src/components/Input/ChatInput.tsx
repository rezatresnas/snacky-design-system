import { type InputHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
// Real send glyph rather than the '➤' text arrow this used to fall back to.
// 20px matches index.html's verified preview.
import { send as SendIcon } from '../../icons/outline.js';
import './ChatInput.css';

export interface ChatInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  sendIcon?: ReactNode;
}

/** Snacky Chat Input - message compose bar with an inline 48x48 send button. */
export function ChatInput({ value, onChange, onSend, sendIcon, className, placeholder = 'Write your message here', ...rest }: ChatInputProps) {
  return (
    <div className={cx('snacky-chatfield', className)}>
      <input
        className="snacky-chatfield__input"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && value && onSend()}
        {...rest}
      />
      <button
        type="button"
        className={cx('snacky-chatfield__send', value && 'snacky-chatfield__send--active')}
        onClick={onSend}
        disabled={!value}
        aria-label="Send"
      >
        {sendIcon ?? <SendIcon width={20} height={20} />}
      </button>
    </div>
  );
}
