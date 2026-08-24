import { useState } from 'react';
import { ProductChip } from '@snacky/ui';

const IMG = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="#FFE8A3"/><text x="50%" y="55%" font-size="64" text-anchor="middle" dominant-baseline="middle">🍪</text></svg>'
);

const Thumb = () => <img src={IMG} alt="" width={24} height={24} style={{ borderRadius: '50%', display: 'block' }} />;

function Controlled(props: { label: string; defaultSelected?: boolean }) {
  const [selected, setSelected] = useState(props.defaultSelected ?? false);
  return (
    <ProductChip
      label={props.label}
      thumbnail={<Thumb />}
      selected={selected}
      onClick={() => setSelected((v) => !v)}
    />
  );
}

export function Unselected() {
  return <Controlled label="250g" defaultSelected={false} />;
}

export function Selected() {
  return <Controlled label="500g" defaultSelected={true} />;
}

export function WeightPicker() {
  const weights = [
    { label: '100g', selected: false },
    { label: '250g', selected: true },
    { label: '500g', selected: false },
    { label: '1kg', selected: false },
  ];
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {weights.map((w) => (
        <Controlled key={w.label} label={w.label} defaultSelected={w.selected} />
      ))}
    </div>
  );
}
