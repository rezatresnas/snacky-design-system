import { useState } from 'react';
import { ProductChip } from '@snacky/ui';

/* Generic "no photo" placeholder - neutral surface + the design system's own
   camera icon, standing in for real product photography. Never an emoji
   glyph (see .design-sync/NOTES.md rule #1). */
function placeholder(width: number, height: number) {
  const s = Math.round(Math.min(width, height) * 0.32);
  const x = (width - s) / 2;
  const y = (height - s) / 2;
  return (
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="${width}" height="${height}" fill="#f3f3f3"/><g transform="translate(${x},${y}) scale(${s / 24})" fill="none" stroke="#a3a3a3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5" fill="#a3a3a3" stroke="none"/><polyline points="21 15 16 10 5 21"/></g></svg>`
    )
  );
}

const IMG = placeholder(200, 200);

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
