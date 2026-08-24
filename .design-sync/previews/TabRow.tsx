import { useState } from 'react';
import { TabRow } from '@snacky/ui';

function Demo({ tabs, initial }: { tabs: string[]; initial: number }) {
  const [selected, setSelected] = useState(initial);
  return <TabRow tabs={tabs} selected={selected} onSelect={setSelected} />;
}

export function OrderStatus() {
  return <Demo tabs={['All', 'Processing', 'Shipped', 'Delivered']} initial={0} />;
}

export function ProductDetails() {
  return <Demo tabs={['Description', 'Reviews', 'Q&A']} initial={1} />;
}

export function AccountMenu() {
  return <Demo tabs={['Profile', 'Addresses', 'Payment methods']} initial={2} />;
}
