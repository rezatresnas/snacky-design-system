import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx.js';
import './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';
export type ButtonSize = 'default' | 'small';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  /** Hierarchy. Danger is a separate intent that layers onto any of these - it is not a fourth hierarchy. */
  variant?: ButtonVariant;
  /** Danger intent - a filled/outlined/text red treatment layered onto `variant`. */
  danger?: boolean;
  size?: ButtonSize;
  /** Optional 24x24 leading icon or social logo slot. */
  icon?: ReactNode;
  children?: ReactNode;
}

/**
 * Snacky Button - Primary/Secondary/Tertiary hierarchy, each with an optional
 * Danger intent, in two sizes. Hover/pressed are real CSS pseudo-classes, not
 * JS-tracked state, matching the design system's documented interaction model.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', danger = false, size = 'default', icon, children, className, disabled, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled}
      className={cx(
        'snacky-btn',
        `snacky-btn--${variant}`,
        size === 'small' && 'snacky-btn--small',
        danger && 'snacky-btn--danger',
        className
      )}
      {...rest}
    >
      {/* Icon is absolutely positioned at the left edge, matching the real
          Figma slot: the label stays centered on the button regardless of
          whether an icon is present, it doesn't shift the label over. */}
      {icon && <span className="snacky-btn__icon">{icon}</span>}
      {children}
    </button>
  );
});
