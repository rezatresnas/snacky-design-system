import { cx } from '../../utils/cx.js';
import { close as CloseIcon } from '../../icons/outline.js';
import './Stepper.css';

export type StepState = 'done' | 'pending' | 'cancelled';

export interface Step {
  label: string;
  /** Optional timestamp line under the label, e.g. "Dec 30, 11:00 AM". */
  timestamp?: string;
  state: StepState;
}

export interface StepperProps {
  steps: Step[];
  className?: string;
}

/**
 * Snacky Stepper - the vertical order-progress timeline behind Section's four
 * `order-status-*` variants and Modal's driver-tracking sheet.
 *
 * This pattern was drawn by hand in every screen that used it before becoming a
 * component: Figma has 19 copies of it across 5 documented variants, under two
 * different frame names (`Order status step` in Section, `Driver Order Status
 * Item` in Modal), with the dot already named like a component variant
 * (`Progress dot/active`, `Progress dot/disabled`).
 *
 * The state names here come from the dots' real fills, not those Figma layer
 * names - `order-status-received` has a dot named "disabled" that is filled
 * icon-brand, i.e. actually done. Trusting the name would have produced a grey
 * dot in a completed timeline.
 */
export function Stepper({ steps, className }: StepperProps) {
  return (
    <ol className={cx('snacky-stepper', className)}>
      {steps.map((step, i) => (
        <li
          key={`${step.label}-${i}`}
          className={cx('snacky-stepper__step', i === steps.length - 1 && 'snacky-stepper__step--last')}
        >
          <span className={cx('snacky-stepper__dot', `snacky-stepper__dot--${step.state}`)}>
            {step.state === 'cancelled' && <CloseIcon width={12} height={12} />}
          </span>
          <span className="snacky-stepper__body">
            <span className={cx('snacky-stepper__label', `snacky-stepper__label--${step.state}`)}>
              {step.label}
            </span>
            {step.timestamp && <span className="snacky-stepper__time">{step.timestamp}</span>}
          </span>
        </li>
      ))}
    </ol>
  );
}
