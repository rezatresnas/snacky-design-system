import { PointBalanceBanner, SnackyIcons } from '@snacky/ui';

export function Default() {
  return (
    <PointBalanceBanner
      pointsIcon={<SnackyIcons.solid.points width={20} height={20} />}
      points="1.250"
      balanceIcon={<SnackyIcons.outline.balance width={20} height={20} />}
      balance="Rp 85.000"
    />
  );
}

export function LowBalance() {
  return (
    <PointBalanceBanner
      pointsIcon={<SnackyIcons.solid.points width={20} height={20} />}
      points="0"
      balanceIcon={<SnackyIcons.outline.balance width={20} height={20} />}
      balance="Rp 0"
    />
  );
}
