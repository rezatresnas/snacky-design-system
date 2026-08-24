import { useState } from 'react';
import { Checkbox } from '@snacky/ui';

function Controlled(props: { label: string; defaultChecked?: boolean; disabled?: boolean }) {
  const [checked, setChecked] = useState(props.defaultChecked ?? false);
  return <Checkbox label={props.label} checked={checked} onChange={setChecked} disabled={props.disabled} />;
}

export function Unchecked() {
  return <Controlled label="Notify me by email" defaultChecked={false} />;
}

export function Checked() {
  return <Controlled label="Extra spicy" defaultChecked={true} />;
}

export function Group() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Controlled label="Gluten free" defaultChecked={true} />
      <Controlled label="Nut free" defaultChecked={false} />
      <Controlled label="Vegan" defaultChecked={true} />
    </div>
  );
}

export function Disabled() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Controlled label="Save card for next order" defaultChecked={false} disabled />
      <Controlled label="Auto-apply loyalty points" defaultChecked={true} disabled />
    </div>
  );
}
