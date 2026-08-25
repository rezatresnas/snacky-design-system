import { Calendar } from '@snacky/ui';

/* The grid renders only the weeks the month needs, so June 2021 is five rows and
   Figma's 505px tall, while a six-week month grows by one row. */

const JUNE_2021 = new Date(2021, 5, 1);
const MAY_2021 = new Date(2021, 4, 1);

export function Range() {
  return (
    <Calendar
      month={JUNE_2021}
      selected={[new Date(2021, 5, 15), new Date(2021, 5, 19)]}
      marked={[new Date(2021, 5, 8)]}
      onPrevMonth={() => {}}
      onNextMonth={() => {}}
      onSelect={() => {}}
      onAction={() => {}}
    />
  );
}

export function SingleDay() {
  return (
    <Calendar
      month={JUNE_2021}
      selected={new Date(2021, 5, 15)}
      onPrevMonth={() => {}}
      onNextMonth={() => {}}
      onSelect={() => {}}
      onAction={() => {}}
    />
  );
}

export function NoSelection() {
  return (
    <Calendar
      month={JUNE_2021}
      onPrevMonth={() => {}}
      onNextMonth={() => {}}
      onSelect={() => {}}
      onAction={() => {}}
    />
  );
}

/** May 2021 starts on a Saturday and has 31 days, so it needs a sixth row. */
export function SixWeekMonth() {
  return (
    <Calendar
      month={MAY_2021}
      selected={new Date(2021, 4, 20)}
      onPrevMonth={() => {}}
      onNextMonth={() => {}}
      onSelect={() => {}}
      onAction={() => {}}
    />
  );
}

/** Without onAction the confirm button is omitted - useful when the calendar is
    embedded rather than shown as a sheet. */
export function Embedded() {
  return (
    <Calendar
      month={JUNE_2021}
      selected={new Date(2021, 5, 8)}
      marked={[new Date(2021, 5, 8), new Date(2021, 5, 22)]}
      onPrevMonth={() => {}}
      onNextMonth={() => {}}
      onSelect={() => {}}
    />
  );
}
