import { Section, ProductCard, ProductChip, FilterChip, Avatar, SnackyIcons } from '@snacky/ui';

/* Photo stand-in only - never an icon substitute (see NOTES.md rule #1). */
const IMG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="#FFE8A3"/><text x="50%" y="55%" font-size="64" text-anchor="middle" dominant-baseline="middle">🍪</text></svg>'
  );

const AVATAR =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="#D7CCC8"/><text x="50%" y="55%" font-size="28" text-anchor="middle" dominant-baseline="middle">🙂</text></svg>'
  );

/* Section is the shell every documented variant composes from - title, optional
   see-more action, and whatever content sits underneath. These previews are the
   documented variants, built from package components wherever one exists.
   Glue text carries an explicit font token: the package sets no global
   font-family (NOTES.md rule #2). */

const small: React.CSSProperties = {
  fontFamily: 'var(--font-small-regular-family)',
  fontSize: 'var(--font-small-regular-size)',
  lineHeight: 'var(--font-small-regular-line-height)',
  color: 'var(--text-primary)',
};

export function ProductGrid() {
  return (
    <div style={{ width: 360 }}>
      <Section title="Popular snacks" onAction={() => {}}>
        {/* No fixed-width wrapper here: the list card is a spec 152px wide and
            sizes itself. Wrapping it in a narrower box made the cards overlap. */}
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto' }}>
          <ProductCard
            variant="list"
            productName="Choco Chip Cookies 200g"
            imageUrl={IMG}
            price="Rp 24.000"
            rating={4.8}
            onAddToCart={() => {}}
          />
          <ProductCard
            variant="list"
            productName="Salted Caramel Wafers"
            imageUrl={IMG}
            price="Rp 18.500"
            rating={4.6}
            onAddToCart={() => {}}
          />
        </div>
      </Section>
    </div>
  );
}

export function VariantSelector() {
  const weights = ['100 gram', '75 gram', '50 gram', '20 gram'];
  return (
    <div style={{ width: 360 }}>
      <Section title="Varian" onAction={() => {}}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {weights.map((w, i) => (
            <ProductChip
              key={w}
              label={w}
              selected={i === 1}
              onClick={() => {}}
              thumbnail={
                <img
                  src={IMG}
                  alt=""
                  width={24}
                  height={24}
                  style={{ objectFit: 'contain', display: 'block' }}
                />
              }
            />
          ))}
        </div>
      </Section>
    </div>
  );
}

export function ProductDescription() {
  return (
    <div style={{ width: 360 }}>
      <Section title="Product Description">
        <div style={small}>
          Chiki Balls Cheeky Chicken is a crunchy corn snack with a savoury chicken coating,
          made for sharing and portioned for one.
        </div>
      </Section>
    </div>
  );
}

export function BuyerReviews() {
  const filters = ['Latest', 'Highest Rating', 'Lowest Rating'];
  return (
    <div style={{ width: 360 }}>
      <Section title="Buyer Reviews" onAction={() => {}}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, ...small }}>
            <SnackyIcons.solid.star width={16} height={16} color="var(--icon-brand)" />
            <span style={{ fontWeight: 600 }}>4.5</span>
            <span style={{ color: 'var(--text-secondary)' }}>(471 ratings) &middot; 189 Reviews</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {filters.map((f, i) => (
              <FilterChip key={f} label={f} selected={i === 0} onClick={() => {}} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <Avatar src={AVATAR} alt="Reviewer" size="sm" />
            <div>
              <div style={{ ...small, fontWeight: 700 }}>Debora Maryanti</div>
              <div style={{ display: 'flex' }}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <SnackyIcons.solid.star
                    key={i}
                    width={16}
                    height={16}
                    color={i < 4 ? 'var(--icon-brand)' : 'var(--border-main)'}
                  />
                ))}
              </div>
            </div>
          </div>
          <div style={small}>Order was accurate and arrived quickly</div>
        </div>
      </Section>
    </div>
  );
}

export function OrderSummary() {
  return (
    <div style={{ width: 320 }}>
      <Section title="Order summary">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, ...small }}>
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

export function DeliveryDestination() {
  return (
    <div style={{ width: 360 }}>
      <Section title="Destination Location" onAction={() => {}}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <span style={{ display: 'inline-flex', color: 'var(--icon-secondary)', flexShrink: 0 }}>
            <SnackyIcons.outline.address width={20} height={20} />
          </span>
          <div style={small}>
            <div style={{ fontWeight: 600 }}>Senopati Street No.64</div>
            <div style={{ color: 'var(--text-secondary)' }}>
              Senopati Street, RT.6/RW.3, Selong, Kebayoran Baru, South Jakarta 12110
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

export function PaymentMethod() {
  return (
    <div style={{ width: 360 }}>
      <Section title="Payment" onAction={() => {}}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, ...small }}>
          <span style={{ display: 'inline-flex', color: 'var(--icon-secondary)' }}>
            <SnackyIcons.outline.balance width={24} height={24} />
          </span>
          <span style={{ flex: 1, fontWeight: 600 }}>Balance</span>
          <span style={{ color: 'var(--text-secondary)' }}>Rp 1,500,000</span>
        </div>
      </Section>
    </div>
  );
}

export function SettingsList() {
  return (
    <div style={{ width: 320 }}>
      <Section title="Account settings">
        <div style={{ display: 'flex', flexDirection: 'column', ...small }}>
          {['Delivery addresses', 'Payment methods', 'Notification preferences', 'Language'].map(
            (item) => (
              <div key={item} style={{ padding: '10px 0', borderBottom: '1px solid var(--border-main)' }}>
                {item}
              </div>
            )
          )}
        </div>
      </Section>
    </div>
  );
}
