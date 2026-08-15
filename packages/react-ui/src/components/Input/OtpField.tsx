import { useRef } from 'react';
import type { KeyboardEvent } from 'react';
import './OtpField.css';

export interface OtpFieldProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
}

/** Snacky OTP Field - N individual 48x48 cells with auto-advance and backspace-to-previous. */
export function OtpField({ value, onChange, length = 6, disabled }: OtpFieldProps) {
  const cellRefs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? '');

  function setDigit(index: number, digit: string) {
    const next = digits.slice();
    next[index] = digit;
    onChange(next.join(''));
    if (digit && index < length - 1) cellRefs.current[index + 1]?.focus();
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      cellRefs.current[index - 1]?.focus();
    }
  }

  return (
    <div className="snacky-otp">
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => {
            cellRefs.current[i] = el;
          }}
          className="snacky-otp__cell"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => setDigit(i, e.target.value.replace(/\D/g, '').slice(-1))}
          onKeyDown={(e) => handleKeyDown(i, e)}
          aria-label={`Digit ${i + 1}`}
        />
      ))}
    </div>
  );
}
