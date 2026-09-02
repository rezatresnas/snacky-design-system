import { InfoBadge, SnackyIcons } from '@snacky/ui';

export function ProductVariant() {
  return <InfoBadge label="Variant: 75 Grams" />;
}

export function PointsTotal() {
  return <InfoBadge label="Points: 20,000" icon={<SnackyIcons.solid.points />} />;
}

export function WithAndWithoutIcon() {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <InfoBadge label="Variant: 75 Grams" />
      <InfoBadge label="Points: 20,000" icon={<SnackyIcons.solid.points />} />
    </div>
  );
}

export function SizeOptions() {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <InfoBadge label="250g" />
      <InfoBadge label="500g" />
    </div>
  );
}
