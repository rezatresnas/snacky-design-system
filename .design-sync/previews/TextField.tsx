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

/* Stand-in for a payment provider logo (brand artwork is not part of this
   package). A neutral 24px tile, never an emoji (NOTES.md rule #1). */
const PROVIDER_LOGO =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><rect width="24" height="24" rx="4" fill="#e0e0e0"/><circle cx="12" cy="12" r="5" fill="none" stroke="#a3a3a3" stroke-width="2"/></svg>'
  );

/* The rest of the Input page's documented field variants. Focus ("Active") is
   real :focus-within CSS, so it shows when a field is clicked rather than as its
   own story. */

export function Password() {
  return (
    <Field
      placeholder="Password"
      type="password"
      initial="snacky123"
      trailingIcon={<SnackyIcons.outline.eye width={24} height={24} />}
    />
  );
}

export function DropdownWithIcon() {
  return (
    <Field
      initial="GOPAY"
      readOnly
      leadingIcon={<img src={PROVIDER_LOGO} width={24} height={24} alt="GoPay" />}
      trailingIcon={<SnackyIcons.outline.chevronDown width={24} height={24} />}
    />
  );
}

export function DatePicker() {
  return (
    <Field
      placeholder="Date of birth"
      initial=""
      readOnly
      trailingIcon={<SnackyIcons.outline.calendar width={24} height={24} />}
    />
  );
}

export function DatePickerFilled() {
  return (
    <Field initial="June 15, 1993" readOnly trailingIcon={<SnackyIcons.outline.calendar width={24} height={24} />} />
  );
}

export function Address() {
  return (
    <Field
      placeholder="Enter address"
      initial=""
      trailingIcon={<SnackyIcons.outline.address width={24} height={24} />}
    />
  );
}

export function AddressSearch() {
  return (
    <Field
      initial="Senopati Street No.6"
      leadingIcon={<SnackyIcons.outline.address width={24} height={24} />}
      trailingIcon={<SnackyIcons.outline.closeInput width={24} height={24} />}
    />
  );
}
