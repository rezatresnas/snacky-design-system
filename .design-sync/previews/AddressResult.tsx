import { AddressResult, SnackyIcons } from '@snacky/ui';

export function Default() {
  return (
    <AddressResult
      icon={<SnackyIcons.outline.address width={20} height={20} />}
      title="221B Baker Street"
      subtitle="Marylebone, London NW1 6XE"
    />
  );
}

export function NoIcon() {
  return <AddressResult title="45 Snack Lane" subtitle="Bandung, West Java 40115" />;
}

export function LongSubtitle() {
  return (
    <AddressResult
      icon={<SnackyIcons.outline.home width={20} height={20} />}
      title="Snacky Warehouse HQ"
      subtitle="Jalan Merdeka No. 12, Kelurahan Cihapit, Kecamatan Bandung Wetan, Bandung 40114"
    />
  );
}
