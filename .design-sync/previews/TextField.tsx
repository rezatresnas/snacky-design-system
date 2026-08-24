import { useState } from 'react';
import { TextField, SnackyIcons } from '@snacky/ui';

function Field(props: Partial<React.ComponentProps<typeof TextField>> & { initial?: string }) {
  const [value, setValue] = useState(props.initial ?? '');
  return <TextField {...props} value={props.value ?? value} onChange={props.onChange ?? setValue} />;
}

export function Default() {
  return <Field label="Email" placeholder="you@example.com" initial="" />;
}

export function Filled() {
  return <Field label="Full name" initial="Alex Rivera" />;
}

export function WithLeadingIcon() {
  return (
    <Field
      label="Delivery address"
      leadingIcon={<SnackyIcons.outline.address width={20} height={20} />}
      initial="221B Baker Street"
    />
  );
}

export function Dropdown() {
  return (
    <Field
      label="Payment method"
      trailingIcon={<SnackyIcons.outline.chevronDown width={20} height={20} />}
      readOnly
      initial="Credit card"
    />
  );
}

export function ErrorState() {
  return <Field label="Promo code" initial="SUMMER99" error="This code has expired" />;
}

export function Disabled() {
  return <Field label="Order ID" initial="SNK-40213" disabled />;
}
