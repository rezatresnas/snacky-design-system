import { useState } from 'react';
import { Toggle } from '@snacky/ui';

function Controlled(props: { defaultChecked?: boolean; ariaLabel: string; disabled?: boolean }) {
  const [checked, setChecked] = useState(props.defaultChecked ?? false);
  return <Toggle checked={checked} onChange={setChecked} ariaLabel={props.ariaLabel} disabled={props.disabled} />;
}

export function Off() {
  return <Controlled ariaLabel="Enable order notifications" defaultChecked={false} />;
}

export function On() {
  return <Controlled ariaLabel="Enable dark mode" defaultChecked={true} />;
}

export function SettingsList() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontFamily: 'var(--font-small-regular-family)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
        <span>Promo notifications</span>
        <Controlled ariaLabel="Promo notifications" defaultChecked={true} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
        <span>Order status updates</span>
        <Controlled ariaLabel="Order status updates" defaultChecked={false} />
      </div>
    </div>
  );
}

export function Disabled() {
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <Controlled ariaLabel="Auto reorder favorites" defaultChecked={false} disabled />
      <Controlled ariaLabel="Location tracking" defaultChecked={true} disabled />
    </div>
  );
}
