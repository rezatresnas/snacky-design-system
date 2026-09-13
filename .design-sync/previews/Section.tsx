import {
  Section,
  ProductCard,
  ProductChip,
  ProductImage,
  InfoBadge,
  SquareBanner,
  Stepper,
  Avatar,
  Button,
  IconButton,
  SnackyIcons,
} from '@snacky/ui';

/* Generic "no photo" placeholder: neutral surface plus a broken-image glyph,
   standing in for product photography, banner artwork, a payment logo or a
   profile photo. Never an emoji glyph (see .design-sync/NOTES.md rule #1). */
function placeholder(width: number, height: number) {
  const s = Math.round(Math.min(width, height) * 0.32);
  const x = (width - s) / 2;
  const y = (height - s) / 2;
  return (
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="${width}" height="${height}" fill="#f3f3f3"/><g transform="translate(${x},${y}) scale(${s / 24})" fill="none" stroke="#a3a3a3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5" fill="#a3a3a3" stroke="none"/><polyline points="21 15 16 10 5 21"/></g></svg>`
    )
  );
}

const PRODUCT = placeholder(200, 200);
const AVATAR = placeholder(64, 64);
const LOGO = placeholder(24, 24);
const BANNER = placeholder(360, 334);

/* One story per documented Section type, in the order the docs playground lists
   them, each built the same way as that playground (which was measured against
   every Figma variant's height). Only the three Group-Products types use the
   Section shell: those are the Figma variants with an h3 title and a see-more
   chevron. The rest carry a 14px semibold title and their own padding in Figma,
   so the shell's defaults would render them at the wrong size.
   Glue text carries an explicit type token: the package sets no global font
   (NOTES.md rule #2). */

type TypeToken =
  | 'body-semibold'
  | 'body-regular'
  | 'small-bold'
  | 'small-semibold'
  | 'small-regular'
  | 'caption-regular';

function type(token: TypeToken, color = 'var(--text-primary)'): React.CSSProperties {
  return {
    fontFamily: `var(--font-${token}-family)`,
    fontSize: `var(--font-${token}-size)`,
    fontWeight: `var(--font-${token}-weight)` as React.CSSProperties['fontWeight'],
    lineHeight: `var(--font-${token}-line-height)`,
    letterSpacing: `var(--font-${token}-letter-spacing)`,
    color,
  };
}

function Surface({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ width: 360, boxSizing: 'border-box', background: 'var(--bg-surface)', ...style }}>{children}</div>
  );
}

function Divider({ width = 312 }: { width?: number }) {
  return <div style={{ width, height: 1, marginBottom: -1, background: 'var(--border-main)', flexShrink: 0 }} />;
}

const seeAll = (
  <IconButton size="small" ariaLabel="See more" icon={<SnackyIcons.solid.angleSmallRight />} onClick={() => {}} />
);

function Card({ name, price, old }: { name: string; price: string; old: string }) {
  return (
    <ProductCard
      productName={name}
      imageUrl={PRODUCT}
      price={price}
      originalPrice={old}
      discountLabel="-50%"
      rating={4.5}
      onAddToCart={() => {}}
    />
  );
}

/* "See other products": Figma's trailing card in a product row, 145 wide. */
function SeeMore() {
  return (
    <div
      style={{
        flexShrink: 0,
        width: 145,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--spacing-8)',
        borderRadius: 'var(--radius-field)',
        background: 'var(--bg-surface)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
      }}
    >
      {seeAll}
      <span style={{ ...type('small-bold', 'var(--text-link)'), textAlign: 'center' }}>See other products</span>
    </div>
  );
}

type StepRow = ['done' | 'pending' | 'cancelled', string, string?];

function OrderStatus({ steps }: { steps: StepRow[] }) {
  return (
    <Surface
      style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '16px 24px', borderRadius: 'var(--radius-field)' }}
    >
      <div style={type('body-semibold')}>Order Status</div>
      <Stepper steps={steps.map(([state, label, timestamp]) => ({ state, label, timestamp }))} />
    </Surface>
  );
}

export function VariantSelector() {
  const weights = ['100 gram', '75 gram', '50 gram', '20 gram'];
  return (
    <Surface style={{ padding: '16px 0 8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '0 24px' }}>
        <span style={{ ...type('body-semibold'), flex: 1 }}>Varian</span>
        {seeAll}
      </div>
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 24px', marginTop: 16, height: 48, overflowX: 'auto' }}
      >
        {weights.map((w, i) => (
          <ProductChip
            key={w}
            label={w}
            selected={i === 1}
            onClick={() => {}}
            thumbnail={
              <img src={PRODUCT} alt="" width={24} height={24} style={{ objectFit: 'contain', display: 'block' }} />
            }
          />
        ))}
      </div>
    </Surface>
  );
}

export function ProductDescription() {
  return (
    <Surface style={{ padding: '16px 0' }}>
      <div style={{ ...type('body-semibold'), padding: '0 24px' }}>Product Description</div>
      <div style={{ ...type('small-regular'), padding: '0 24px', marginTop: 16 }}>
        <div>Chiki Balls Cheeky Chicken</div>
        <div>Chicken Broth Flavor</div>
        <div>Net Weight 75 g</div>
      </div>
    </Surface>
  );
}

export function BuyerReviews() {
  const grey = 'var(--text-secondary)';
  return (
    <Surface style={{ display: 'flex', flexDirection: 'column', padding: '16px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '0 24px' }}>
        <span style={{ ...type('body-semibold'), flex: 1 }}>Buyer Reviews</span>
        {seeAll}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '0 24px', marginTop: 16 }}>
        <SnackyIcons.solid.star width={16} height={16} color="var(--icon-brand)" />
        <span style={type('small-semibold', grey)}>4.5</span>
        <span style={type('small-regular', grey)}>(471 ratings)</span>
        <span style={{ width: 4, height: 4, borderRadius: 'var(--radius-full)', background: grey }} />
        <span style={type('small-regular', grey)}>189 Reviews</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '0 24px', marginTop: 16 }}>
        <Avatar src={AVATAR} alt="Reviewer" size="sm" />
        <div>
          <div style={type('small-bold')}>Debora Maryanti</div>
          <div style={{ display: 'flex' }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <SnackyIcons.solid.star
                key={i}
                width={16}
                height={16}
                color={i < 4 ? 'var(--icon-brand)' : 'var(--icon-disabled)'}
              />
            ))}
          </div>
        </div>
      </div>
      <div style={{ padding: '0 24px', marginTop: 16 }}>
        <div style={{ ...type('small-regular'), marginBottom: 8 }}>Order was accurate and arrived quickly</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[0, 1, 2].map((i) => (
            <ProductImage key={i} src={PRODUCT} alt="" usage="review" />
          ))}
        </div>
      </div>
    </Surface>
  );
}

export function GroupProductsHorizontal() {
  return (
    <div style={{ width: 360 }}>
      <Section title="Similar Products" onAction={() => {}}>
        <div style={{ display: 'flex', gap: 8, marginRight: -24, overflowX: 'auto' }}>
          <Card name="Lays Seaweed Flavor 14g" price="$5.00" old="$10.00" />
          <Card name="Pota Bee Black Truffle 65g" price="$5.00" old="$5.00" />
          <Card name="Oishi Caramel Popcorn 100g" price="$10.00" old="$20.00" />
          <SeeMore />
        </div>
      </Section>
    </div>
  );
}

/* Figma: a full-bleed 360x334 square discount banner under the header, with the
   product row laid over it from x160. The banner artwork is a placeholder here. */
export function GroupProductsBanner() {
  return (
    <div className="preview-sec-banner" style={{ width: 360 }}>
      <style>
        {
          '.preview-sec-banner .snacky-section{padding:16px 0 0}.preview-sec-banner .snacky-section__header{padding:0 24px}.preview-sec-banner .snacky-banner-square{border-radius:0}'
        }
      </style>
      <Section title="Exciting Promo" onAction={() => {}}>
        <div style={{ position: 'relative', width: 360, height: 334 }}>
          <SquareBanner imageUrl={BANNER} alt="Chiki Discount 50% for all variants" />
          <div style={{ position: 'absolute', left: 160, right: 0, top: 24, display: 'flex', gap: 8, overflowX: 'auto' }}>
            <Card name="Chicki Balls Cheeky Chicken 75 g" price="Rp 5,000" old="Rp 10,000" />
            <Card name="Chicki Twist Roasted Corn 75 g" price="Rp 5,000" old="Rp 10,000" />
            <Card name="Chicki Puffs Cheddar Cheese 75 g" price="Rp 5,000" old="Rp 10,000" />
            <SeeMore />
          </div>
        </div>
      </Section>
    </div>
  );
}

export function GroupProductsVertical() {
  const names = [
    'Chicki Balls Cheeky Chicken 75 g',
    'Chicki Twist Roasted Corn 75 g',
    'Chicki Puffs Cheddar Cheese 75 g',
    'Oishi Caramel Popcorn 100g',
    'Lays Seaweed Flavor 14g',
    'Pota Bee Black Truffle 65g',
    'Chicki Balls Cheeky Chicken 75 g',
    'Chicki Twist Roasted Corn 75 g',
  ];
  return (
    <div style={{ width: 360 }}>
      <Section title="Recommendations for You" onAction={() => {}}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, justifyItems: 'center' }}>
          {names.map((n, i) => (
            <Card key={i} name={n} price="Rp 5,000" old="Rp 10,000" />
          ))}
        </div>
      </Section>
    </div>
  );
}

export function OrderStatusWaiting() {
  return (
    <OrderStatus
      steps={[
        ['done', 'Waiting for payment', 'Pay before Dec 30, 11:00'],
        ['pending', 'Order Processed'],
        ['pending', 'Order Delivered'],
        ['pending', 'Order Received'],
      ]}
    />
  );
}

export function OrderStatusDelivered() {
  return (
    <OrderStatus
      steps={[
        ['done', 'Payment Received', 'Dec 30, 11:00 AM'],
        ['done', 'Order Processing', 'Dec 30, 12:00 PM'],
        ['done', 'Order Delivered', 'Dec 30, 12:00 PM'],
        ['pending', 'Order Received'],
      ]}
    />
  );
}

export function OrderStatusReceived() {
  return (
    <OrderStatus
      steps={[
        ['done', 'Payment Received', 'Dec 30, 11:00 AM'],
        ['done', 'Order Processing', 'Dec 30, 12:00 PM'],
        ['done', 'Order Delivered', 'Dec 30, 12:00 PM'],
        ['done', 'Order Received', 'Dec 30, 12:30 PM'],
      ]}
    />
  );
}

export function OrderStatusCancelled() {
  return (
    <OrderStatus
      steps={[
        ['cancelled', 'Order Cancelled', 'Dec 30, 11:00 AM'],
        ['pending', 'Order Processing'],
        ['pending', 'Order Delivered'],
        ['pending', 'Order Received'],
      ]}
    />
  );
}

export function DestinationDescription() {
  return (
    <Surface
      style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '16px 24px', borderRadius: 'var(--radius-field)' }}
    >
      <div style={type('body-semibold')}>Destination Location</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={type('small-bold')}>Home</div>
        <div style={{ ...type('small-regular'), maxWidth: 312, height: 47, overflow: 'hidden' }}>
          Senopati Street, RT.6/RW.3, Senayan, South Jakarta City, Special Capital Region of Jakarta
        </div>
      </div>
    </Surface>
  );
}

export function OrderSummary() {
  const row = (qty: string, name: string, price: string) => (
    <div style={{ display: 'flex', gap: 8, width: 312, ...type('small-regular') }}>
      <span>{qty}</span>
      <span style={{ flex: 1 }}>{name}</span>
      <span style={type('small-semibold')}>{price}</span>
    </div>
  );
  const line = (label: string, value: React.ReactNode) => (
    <div style={{ display: 'flex', gap: 8 }}>
      <span style={{ flex: 1 }}>{label}</span>
      {value}
    </div>
  );
  return (
    <Surface
      style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '16px 24px', borderRadius: 'var(--radius-field)' }}
    >
      <div>
        <div style={type('body-semibold')}>Order</div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ ...type('small-semibold', 'var(--text-secondary)'), flex: 1 }}>
            INV/KK/20220911/112/846226/2395144
          </span>
          <Button variant="tertiary" size="small">
            Copy
          </Button>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <span style={{ ...type('small-regular'), flex: 1 }}>Payment Method</span>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <img src={LOGO} width={24} height={24} alt="" style={{ objectFit: 'contain' }} />
          <span style={type('small-semibold')}>GOPAY</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
        {row('1x', 'Chicki Balls Cheeky Chicken 75 g', 'Rp 5,000')}
        <Divider />
        {row('1x', 'Chicki Twist Roasted Corn 75 g', 'Rp 5,000')}
        <Divider />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: 312 }}>
          <span style={type('small-regular', 'var(--text-secondary)')}>Notes</span>
          <span style={type('small-regular')}>Lorem ipsum dolor sit amet</span>
        </div>
        <Divider />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 312, ...type('small-regular') }}>
          {line('Subtotal', <span style={type('small-semibold')}>Rp 10,000</span>)}
          {line(
            'Shipping Fee',
            <>
              <span style={{ textDecoration: 'line-through' }}>Rp 5,000</span>
              <span>Free</span>
            </>
          )}
          {line('Referral Promo', <span>- Rp 2,000</span>)}
          <Divider />
          {line('Total', <span style={type('small-semibold')}>Rp 8,000</span>)}
        </div>
      </div>
    </Surface>
  );
}

export function Driver() {
  return (
    <Surface
      style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '16px 24px', borderRadius: 'var(--radius-field)' }}
    >
      <div style={type('body-semibold')}>Driver</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
        <Avatar src={AVATAR} alt="Driver" size="md" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={type('body-semibold')}>Mimbar Al Risyad</div>
          <div style={type('caption-regular', 'var(--text-secondary)')}>B1112ARB</div>
        </div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <IconButton
            variant="tertiary"
            ariaLabel="Call driver"
            icon={<SnackyIcons.outline.phone width={24} height={24} />}
          />
          <IconButton
            variant="tertiary"
            ariaLabel="Chat with driver"
            icon={<SnackyIcons.outline.chat width={24} height={24} />}
          />
        </div>
      </div>
      <Divider />
      <div style={{ width: '100%' }}>
        <div style={type('small-regular')}>Estimated arrival at</div>
        <div style={type('small-bold')}>12:30 - 12:40</div>
      </div>
      <Divider />
      <Button variant="primary" style={{ width: '100%' }}>
        Track Delivery
      </Button>
    </Surface>
  );
}

export function Destination() {
  return (
    <Surface style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '16px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <SnackyIcons.outline.address width={16} height={16} color="var(--icon-brand)" />
          <span style={type('small-regular')}>Sent to</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={type('small-bold')}>Home</span>
          <SnackyIcons.outline.chevronDown width={16} height={16} color="var(--icon-primary)" />
        </div>
      </div>
      <div
        style={{
          ...type('small-regular'),
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: '100%',
        }}
      >
        Senopati Street, RT.6/RW.3, Senayan, South Jakarta City, Special Capital Region of Jakarta
      </div>
    </Surface>
  );
}

export function OrderDetails() {
  const fee = (label: string, value: string, strike?: string) => (
    <div style={{ display: 'flex', gap: 8, width: '100%', ...type('body-regular') }}>
      <span style={{ flex: 1 }}>{label}</span>
      {strike ? <span style={{ ...type('body-semibold'), textDecoration: 'line-through' }}>{strike}</span> : null}
      <span style={type('body-semibold')}>{value}</span>
    </div>
  );
  return (
    <Surface
      style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '16px 24px', borderRadius: 'var(--radius-field)' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: 312 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <div style={{ padding: 4, display: 'inline-flex' }}>
            <img src={PRODUCT} width={48} height={48} alt="" style={{ objectFit: 'contain' }} />
          </div>
          <span style={{ ...type('small-regular'), flex: 1 }}>Chicki Balls Cheeky Chicken 75 g</span>
          <span style={type('body-semibold')}>Rp 5,000</span>
        </div>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center', paddingLeft: 60 }}>
          <InfoBadge label="Variant: 75 Grams" />
          <div style={{ flex: 1, display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-end' }}>
            <IconButton ariaLabel="Decrease quantity" icon={<SnackyIcons.outline.minus width={16} height={16} />} />
            <span style={{ ...type('caption-regular'), fontWeight: 600, minWidth: 10, textAlign: 'center' }}>1</span>
            <IconButton ariaLabel="Increase quantity" icon={<SnackyIcons.outline.plus width={16} height={16} />} />
          </div>
        </div>
      </div>
      <Divider />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <IconButton
          variant="tertiary"
          ariaLabel="Add note"
          icon={<SnackyIcons.outline.edit width={24} height={24} />}
        />
        <Button variant="tertiary" size="small">
          Add Note
        </Button>
      </div>
      <Divider />
      {fee('Subtotal', 'Rp 5,000')}
      {fee('Shipping Fee', 'Free', 'Rp 5,000')}
      {fee('Referral Promo', '- Rp 2,000')}
    </Surface>
  );
}

export function PaymentMethod() {
  return (
    <Surface style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '16px 24px' }}>
      <span style={{ ...type('small-regular'), flex: 1 }}>Payment Method</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src={LOGO} alt="GoPay" width={24} height={24} style={{ objectFit: 'contain' }} />
          <span style={type('small-semibold')}>GOPAY</span>
        </div>
        <SnackyIcons.outline.chevronDown width={16} height={16} color="var(--icon-primary)" />
      </div>
    </Surface>
  );
}
