import { useState } from 'react';
import { SearchField, SnackyIcons } from '@snacky/ui';

function Field(props: Partial<React.ComponentProps<typeof SearchField>> & { initial?: string }) {
  const [value, setValue] = useState(props.initial ?? '');
  return <SearchField {...props} value={props.value ?? value} onChange={props.onChange ?? setValue} />;
}

// Both icons default to the real set at 16px, and the clear button follows the
// text rather than an onClear prop, so the plain stories pass neither. The old
// ones passed an 18px magnifier (the set authors it at 16), a no-op onClear
// that made the clear button unable to clear, and a WithoutIcon story whose
// name described the bug.
export function Default() {
  return <Field placeholder="Search for snacks" initial="" />;
}

export function Filled() {
  return <Field initial="Spicy chips" />;
}

export function CustomIcon() {
  return <Field initial="Spicy chips" searchIcon={<SnackyIcons.outline.category width={16} height={16} />} />;
}

export function Disabled() {
  return <Field initial="Chocolate bars" disabled />;
}
