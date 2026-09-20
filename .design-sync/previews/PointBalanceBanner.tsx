import { PointBalanceBanner } from '@snacky/ui';

// Both glyphs are the component's own (solid points and solid balance at 16px,
// tinted icon-brand by the CSS), so neither story passes them. These used to
// pass the outline balance icon at 20px, which is neither the documented style
// nor the documented size.
export function Default() {
  return <PointBalanceBanner points="1,250" balance="Rp 85,000" />;
}

export function LowBalance() {
  return <PointBalanceBanner points="0" balance="Rp 0" />;
}
