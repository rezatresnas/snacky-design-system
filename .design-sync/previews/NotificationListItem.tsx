import { NotificationListItem } from '@snacky/ui';

export function Unread() {
  return (
    <div style={{ width: 320 }}>
      <NotificationListItem
        title="Your order has shipped"
        message="Order #SNK-40213 is on its way, track it for live updates."
        unread
        onClick={() => {}}
      />
    </div>
  );
}

export function Read() {
  return (
    <div style={{ width: 320 }}>
      <NotificationListItem
        title="Payment confirmed"
        message="We received your payment for Order #SNK-40188, thanks for shopping with us."
        unread={false}
        onClick={() => {}}
      />
    </div>
  );
}

export function LongMessage() {
  return (
    <div style={{ width: 320 }}>
      <NotificationListItem
        title="Flash sale: 20% off snack bundles"
        message="Stock up on your favorite chips and wafers this weekend only, discount applies automatically at checkout while supplies last."
        unread
        onClick={() => {}}
      />
    </div>
  );
}

export function Stacked() {
  return (
    <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <NotificationListItem
        title="Your order has shipped"
        message="Order #SNK-40213 is on its way, track it for live updates."
        unread
        onClick={() => {}}
      />
      <NotificationListItem
        title="Payment confirmed"
        message="We received your payment for Order #SNK-40188."
        unread={false}
        onClick={() => {}}
      />
    </div>
  );
}
