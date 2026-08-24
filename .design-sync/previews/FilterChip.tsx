import { useState } from 'react';
import { FilterChip } from '@snacky/ui';

function Controlled(props: { label: string; defaultSelected?: boolean }) {
  const [selected, setSelected] = useState(props.defaultSelected ?? false);
  return <FilterChip label={props.label} selected={selected} onClick={() => setSelected((v) => !v)} />;
}

export function Unselected() {
  return <Controlled label="Spicy" defaultSelected={false} />;
}

export function Selected() {
  return <Controlled label="Vegan" defaultSelected={true} />;
}

export function FilterRow() {
  const labels = ['All', 'Spicy', 'Sweet', 'Under 15 min', 'Best sellers'];
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {labels.map((label, i) => (
        <Controlled key={label} label={label} defaultSelected={i === 0} />
      ))}
    </div>
  );
}
