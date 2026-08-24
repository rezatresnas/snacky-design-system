import { useState } from 'react';
import { SearchField, SnackyIcons } from '@snacky/ui';

function Field(props: Partial<React.ComponentProps<typeof SearchField>> & { initial?: string }) {
  const [value, setValue] = useState(props.initial ?? '');
  return <SearchField {...props} value={props.value ?? value} onChange={props.onChange ?? setValue} />;
}

const searchIcon = <SnackyIcons.outline.search width={18} height={18} />;

export function Default() {
  return <Field placeholder="Search for snacks" initial="" searchIcon={searchIcon} />;
}

export function Filled() {
  return (
    <Field
      initial="Spicy chips"
      searchIcon={searchIcon}
      onClear={() => {}}
    />
  );
}

export function WithoutIcon() {
  return <Field placeholder="Search products..." initial="" />;
}

export function Disabled() {
  return <Field initial="Chocolate bars" searchIcon={searchIcon} disabled />;
}
