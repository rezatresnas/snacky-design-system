import { Stepper } from '@snacky/ui';

/* Step height follows the content: 48 with a timestamp, 24 without. That is what
   makes the four documented progress frames land on 288 / 264 / 216 / 216. */

const surface: React.CSSProperties = {
  width: 312,
  background: 'var(--bg-surface)',
  borderRadius: 4,
  padding: 16,
};

export function Waiting() {
  return (
    <div style={surface}>
      <Stepper
        steps={[
          { label: 'Waiting for payment', timestamp: 'Pay before Dec 30, 11:00', state: 'done' },
          { label: 'Order Processed', state: 'pending' },
          { label: 'Order Delivered', state: 'pending' },
          { label: 'Order Received', state: 'pending' },
        ]}
      />
    </div>
  );
}

export function Delivered() {
  return (
    <div style={surface}>
      <Stepper
        steps={[
          { label: 'Payment Received', timestamp: 'Dec 30, 11:00 AM', state: 'done' },
          { label: 'Order Processing', timestamp: 'Dec 30, 12:00 PM', state: 'done' },
          { label: 'Order Delivered', timestamp: 'Dec 30, 12:00 PM', state: 'done' },
          { label: 'Order Received', state: 'pending' },
        ]}
      />
    </div>
  );
}

export function Complete() {
  return (
    <div style={surface}>
      <Stepper
        steps={[
          { label: 'Payment Received', timestamp: 'Dec 30, 11:00 AM', state: 'done' },
          { label: 'Order Processing', timestamp: 'Dec 30, 12:00 PM', state: 'done' },
          { label: 'Order Delivered', timestamp: 'Dec 30, 12:00 PM', state: 'done' },
          { label: 'Order Received', timestamp: 'Dec 30, 12:30 PM', state: 'done' },
        ]}
      />
    </div>
  );
}

export function Cancelled() {
  return (
    <div style={surface}>
      <Stepper
        steps={[
          { label: 'Order Cancelled', timestamp: 'Dec 30, 11:00 AM', state: 'cancelled' },
          { label: 'Order Processing', state: 'pending' },
          { label: 'Order Delivered', state: 'pending' },
          { label: 'Order Received', state: 'pending' },
        ]}
      />
    </div>
  );
}

export function DriverTracking() {
  return (
    <div style={surface}>
      <Stepper
        steps={[
          { label: 'Driver picking up order from seller', timestamp: 'Dec 30, 11:00 AM', state: 'done' },
          { label: 'Driver delivering order to customer', timestamp: 'Dec 30, 12:00 PM', state: 'done' },
          { label: 'Order received by customer', state: 'pending' },
        ]}
      />
    </div>
  );
}
