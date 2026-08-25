import { cx } from '../../utils/cx.js';
import { back as BackIcon } from '../../icons/outline.js';
import { Button } from '../Button/Button.js';
import './Calendar.css';

export interface CalendarProps {
  /** Month shown, as any day within it. */
  month: Date;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
  /** Selected day, or the two ends of a selected range. */
  selected?: Date | [Date, Date];
  onSelect?: (day: Date) => void;
  /** Days that get the small accent dot under them, e.g. days with an order. */
  marked?: Date[];
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

/**
 * Whole weeks covering the month, padded with the neighbouring months' days.
 * Only as many rows as the month actually needs - five for a month like June
 * 2021, six when one is genuinely required - which is what makes the grid match
 * Figma's 325px `date` frame instead of always reserving a sixth row.
 */
function buildGrid(month: Date): Date[] {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const last = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  const start = new Date(first);
  start.setDate(1 - first.getDay());
  const end = new Date(last);
  end.setDate(last.getDate() + (6 - last.getDay()));
  const days: Date[] = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
  }
  return days;
}

/**
 * Snacky Calendar - the month grid behind Modal's `Calendar` variant, and the
 * panel the Input family's Date Picker field is meant to open.
 *
 * Figma already had this as a COMPONENT (360x505) with a full structure -
 * header, weekday row, six date rows, a range highlight and a Select Date
 * button - but no package ever shipped it, so the Date Picker field existed as
 * a component while the calendar it opens did not. Every screen that needed one
 * drew its own grid.
 */
export function Calendar({
  month,
  onPrevMonth,
  onNextMonth,
  selected,
  onSelect,
  marked = [],
  actionLabel = 'Select Date',
  onAction,
  className,
}: CalendarProps) {
  const days = buildGrid(month);
  const range = Array.isArray(selected) ? selected : null;
  const single = selected instanceof Date ? selected : null;
  const [lo, hi] = range
    ? [range[0], range[1]].sort((a, b) => a.getTime() - b.getTime())
    : [null, null];

  const isEnd = (d: Date) =>
    (single && sameDay(d, single)) || (lo && hi && (sameDay(d, lo) || sameDay(d, hi)));
  const isInRange = (d: Date) => lo && hi && d > lo && d < hi;

  return (
    <div className={cx('snacky-calendar', className)}>
      <div className="snacky-calendar__header">
        <button
          type="button"
          className="snacky-calendar__nav"
          onClick={onPrevMonth}
          aria-label="Previous month"
        >
          <BackIcon width={24} height={24} />
        </button>
        <span className="snacky-calendar__label">
          {MONTHS[month.getMonth()]} {month.getFullYear()}
        </span>
        <button
          type="button"
          className="snacky-calendar__nav snacky-calendar__nav--next"
          onClick={onNextMonth}
          aria-label="Next month"
        >
          <BackIcon width={24} height={24} />
        </button>
      </div>

      <div className="snacky-calendar__grid">
        {WEEKDAYS.map((d) => (
          <span key={d} className="snacky-calendar__weekday">
            {d}
          </span>
        ))}
        {days.map((d, i) => {
          const outside = d.getMonth() !== month.getMonth();
          return (
            <button
              key={i}
              type="button"
              className={cx(
                'snacky-calendar__day',
                outside && 'snacky-calendar__day--outside',
                isInRange(d) && 'snacky-calendar__day--in-range',
                isEnd(d) && 'snacky-calendar__day--selected'
              )}
              onClick={() => onSelect?.(d)}
              disabled={outside}
              aria-current={isEnd(d) ? 'date' : undefined}
            >
              <span className="snacky-calendar__day-number">{d.getDate()}</span>
              {marked.some((m) => sameDay(m, d)) && <span className="snacky-calendar__marker" />}
            </button>
          );
        })}
      </div>

      {onAction && (
        <Button onClick={onAction} style={{ width: '100%' }}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
