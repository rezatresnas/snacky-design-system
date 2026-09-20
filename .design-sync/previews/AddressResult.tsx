import { AddressResult, SnackyIcons } from '@snacky/ui';

// The map pin is the component's own default now, so Default omits it: that is
// what a caller following the docs actually gets. The story that used to sit
// here was called NoIcon and rendered a bare row, which was the bug, not a state.
export function Default() {
  return <AddressResult title="221B Baker Street" subtitle="Marylebone, London NW1 6XE" />;
}

export function CustomIcon() {
  return (
    <AddressResult
      icon={<SnackyIcons.outline.home width={20} height={20} />}
      title="45 Snack Lane"
      subtitle="Bandung, West Java 40115"
    />
  );
}

export function LongSubtitle() {
  return (
    <AddressResult
      title="Snacky Warehouse HQ"
      subtitle="Jalan Merdeka No. 12, Kelurahan Cihapit, Kecamatan Bandung Wetan, Bandung 40114"
    />
  );
}
