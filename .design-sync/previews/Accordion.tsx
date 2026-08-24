import { useState } from 'react';
import { Accordion, SnackyIcons } from '@snacky/ui';

function FaqDemo() {
  const [openIndex, setOpenIndex] = useState(0);
  const faqs = [
    { q: 'How long does delivery take?', a: 'Most orders arrive within 30 to 45 minutes, depending on your location and current demand.' },
    { q: 'Can I cancel an order?', a: 'You can cancel free of charge any time before the store confirms your order.' },
    { q: 'What payment methods are accepted?', a: 'We accept credit and debit cards, e-wallets, and cash on delivery.' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 320 }}>
      {faqs.map((faq, i) => (
        <Accordion key={faq.q} title={faq.q} defaultOpen={i === openIndex}>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, fontFamily: 'var(--font-small-regular-family)' }}>{faq.a}</p>
        </Accordion>
      ))}
    </div>
  );
}

export function FaqList() {
  return <FaqDemo />;
}

export function PaymentMethodOpen() {
  return (
    <div style={{ width: 320 }}>
      <Accordion
        title="Credit or debit card"
        leadingIcon={<SnackyIcons.outline.creditCard width={20} height={20} />}
        defaultOpen
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14, fontFamily: 'var(--font-small-regular-family)' }}>
          <span>Visa ending in 4242</span>
          <span>Mastercard ending in 8871</span>
        </div>
      </Accordion>
    </div>
  );
}

export function DeliveryDetailsClosed() {
  return (
    <div style={{ width: 320 }}>
      <Accordion title="Delivery time" leadingIcon={<SnackyIcons.outline.truck width={20} height={20} />}>
        <p style={{ margin: 0, fontSize: 14, fontFamily: 'var(--font-small-regular-family)' }}>Estimated 30 to 45 minutes after the store confirms your order.</p>
      </Accordion>
    </div>
  );
}
