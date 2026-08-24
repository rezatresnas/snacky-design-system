import { AlertBanner } from '@snacky/ui';

export function Message() {
  return <AlertBanner message="Free shipping over Rp 100.000" />;
}

export function WithCountdown() {
  return <AlertBanner message="Flash sale ends in" countdown="02:15:40" />;
}

export function LongMessage() {
  return (
    <AlertBanner
      message="Your snack box is being packed and will ship within 24 hours"
      countdown="Today"
    />
  );
}
