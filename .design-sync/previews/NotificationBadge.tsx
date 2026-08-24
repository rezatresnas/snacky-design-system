import { NotificationBadge, SnackyIcons } from '@snacky/ui';

const CartIcon = () => <SnackyIcons.outline.cart width={24} height={24} />;

export function WithCount() {
  return (
    <NotificationBadge count={3}>
      <CartIcon />
    </NotificationBadge>
  );
}

export function OverMax() {
  return (
    <NotificationBadge count={150} max={99}>
      <CartIcon />
    </NotificationBadge>
  );
}

export function ZeroCount() {
  return (
    <NotificationBadge count={0}>
      <CartIcon />
    </NotificationBadge>
  );
}
