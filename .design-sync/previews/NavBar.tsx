import { useState } from 'react';
import { NavBar, SnackyIcons } from '@snacky/ui';

const items = [
  { label: 'Home', icon: <SnackyIcons.outline.home width={20} height={20} />, activeIcon: <SnackyIcons.solid.home width={20} height={20} /> },
  { label: 'Category', icon: <SnackyIcons.outline.category width={20} height={20} />, activeIcon: <SnackyIcons.solid.category width={20} height={20} /> },
  { label: 'Cart', icon: <SnackyIcons.outline.cart width={20} height={20} />, activeIcon: <SnackyIcons.solid.cart width={20} height={20} /> },
  { label: 'Orders', icon: <SnackyIcons.outline.history width={20} height={20} />, activeIcon: <SnackyIcons.solid.history width={20} height={20} /> },
  { label: 'Profile', icon: <SnackyIcons.outline.account width={20} height={20} />, activeIcon: <SnackyIcons.solid.account width={20} height={20} /> },
];

function Demo({ initial }: { initial: number }) {
  const [selected, setSelected] = useState(initial);
  return <NavBar items={items} selected={selected} onSelect={setSelected} />;
}

export function HomeActive() {
  return <Demo initial={0} />;
}

export function CartActive() {
  return <Demo initial={2} />;
}

export function ProfileActive() {
  return <Demo initial={4} />;
}
