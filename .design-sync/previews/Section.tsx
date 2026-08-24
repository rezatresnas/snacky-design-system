import { Section, ProductCard } from '@snacky/ui';

const IMG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="#FFE8A3"/><text x="50%" y="55%" font-size="64" text-anchor="middle" dominant-baseline="middle">🍪</text></svg>'
  );

export function ProductGrid() {
  return (
    <div style={{ width: 360 }}>
      <Section title="Popular snacks" onAction={() => {}}>
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto' }}>
          <div style={{ width: 140 }}>
            <ProductCard
              variant="list"
              productName="Choco Chip Cookies 200g"
              imageUrl={IMG}
              price="Rp 24.000"
              rating={4.8}
              onAddToCart={() => {}}
            />
          </div>
          <div style={{ width: 140 }}>
            <ProductCard
              variant="list"
              productName="Salted Caramel Wafers"
              imageUrl={IMG}
              price="Rp 18.500"
              rating={4.6}
              onAddToCart={() => {}}
            />
          </div>
        </div>
      </Section>
    </div>
  );
}

export function OrderSummary() {
  return (
    <div style={{ width: 320 }}>
      <Section title="Order summary">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14, fontFamily: 'var(--font-small-regular-family)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Subtotal</span>
            <span>Rp 66.500</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Delivery fee</span>
            <span>Rp 8.000</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
            <span>Total</span>
            <span>Rp 74.500</span>
          </div>
        </div>
      </Section>
    </div>
  );
}

export function SettingsList() {
  return (
    <div style={{ width: 320 }}>
      <Section title="Account settings">
        <div style={{ display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-small-regular-family)' }}>
          {['Delivery addresses', 'Payment methods', 'Notification preferences', 'Language'].map((item) => (
            <div
              key={item}
              style={{ padding: '10px 0', borderBottom: '1px solid var(--border-main)', fontSize: 14 }}
            >
              {item}
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
