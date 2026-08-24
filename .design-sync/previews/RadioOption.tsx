import { useState } from 'react';
import { RadioOption } from '@snacky/ui';

function DeliveryGroup() {
  const [value, setValue] = useState('standard');
  const options = [
    { id: 'standard', label: 'Standard delivery (2-3 days)' },
    { id: 'express', label: 'Express delivery (same day)' },
    { id: 'pickup', label: 'Store pickup' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {options.map((opt) => (
        <RadioOption
          key={opt.id}
          name="delivery"
          label={opt.label}
          selected={value === opt.id}
          onClick={() => setValue(opt.id)}
        />
      ))}
    </div>
  );
}

export function DeliveryMethod() {
  return <DeliveryGroup />;
}

function PaymentGroup() {
  const [value, setValue] = useState('gopay');
  const options = [
    { id: 'gopay', label: 'GoPay' },
    { id: 'ovo', label: 'OVO' },
    { id: 'cod', label: 'Cash on delivery', disabled: true },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {options.map((opt) => (
        <RadioOption
          key={opt.id}
          name="payment"
          label={opt.label}
          selected={value === opt.id}
          onClick={() => setValue(opt.id)}
          disabled={opt.disabled}
        />
      ))}
    </div>
  );
}

export function WithDisabledOption() {
  return <PaymentGroup />;
}
