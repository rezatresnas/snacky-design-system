import { PageIndicator } from '@snacky/ui';

export function FirstPage() {
  return <PageIndicator count={3} activeIndex={0} />;
}

export function MiddlePage() {
  return <PageIndicator count={3} activeIndex={1} />;
}

export function LastPage() {
  return <PageIndicator count={3} activeIndex={2} />;
}

export function FivePages() {
  return <PageIndicator count={5} activeIndex={2} />;
}
