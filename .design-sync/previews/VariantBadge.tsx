import { VariantBadge } from '@snacky/ui';

export function FlavorSelected() {
  return <VariantBadge label="Spicy BBQ" />;
}

export function SizeSelected() {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <VariantBadge label="250g" />
      <VariantBadge label="500g" />
    </div>
  );
}
