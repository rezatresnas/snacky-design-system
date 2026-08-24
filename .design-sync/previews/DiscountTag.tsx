import { DiscountTag } from '@snacky/ui';

export function Percentage() {
  return <DiscountTag label="50% OFF" />;
}

export function BundleDeal() {
  return <DiscountTag label="Buy 1 Get 1" />;
}

export function Nominal() {
  return <DiscountTag label="Rp 5.000 OFF" />;
}
