import {
  BottomSheet,
  Button,
  Calendar,
  Illustration,
  IconButton,
  ProductChip,
  ProductImage,
  FilterChip,
  Avatar,
  Stepper,
  SnackyIcons,
} from '@snacky/ui';

/* Generic "no photo" placeholder: neutral surface plus a broken-image glyph,
   standing in for illustration artwork, product photography, payment logos and
   profile photos. Never an emoji glyph (see .design-sync/NOTES.md rule #1). Icon
   props always take a real SnackyIcons glyph. */
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

const ART = placeholder(200, 200);
const PRODUCT = placeholder(200, 200);
const AVATAR = placeholder(64, 64);
const LOGO = placeholder(24, 24);

/* BottomSheet is the shell every documented Modal variant composes from: it
   supplies the surface, the top corners, the gap and the optional drag handle,
   and the variant is whatever renders inside. One story per variant on the docs
   Modal page, built the way that page's playground builds them (measured against
   each Figma variant's height).

   Each variant spaces its content differently in Figma, so each story scopes a
   padding/gap override onto its own sheet. The overlay is made static so the
   sheet sits in the card at its natural height instead of pinning to the bottom
   of the whole host page. Glue text carries an explicit type token: the package
   sets no global font (NOTES.md rule #2). */

type TypeToken =
  | 'h3-bold'
  | 'body-semibold'
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
    margin: 0,
  };
}

let hostId = 0;

function Sheet({
  children,
  sheetStyle,
  showHandle,
}: {
  children: React.ReactNode;
  sheetStyle: string;
  showHandle?: boolean;
}) {
  const cls = `preview-sheet-${++hostId}`;
  return (
    <div className={cls} style={{ width: 360 }}>
      <style>
        {`.${cls} .snacky-sheet-overlay{position:static;inset:auto;background:none;display:block;z-index:auto}` +
          `.${cls} .snacky-sheet{width:360px;max-width:none;max-height:none;${sheetStyle}}`}
      </style>
      <BottomSheet open onDismiss={() => {}} showHandle={showHandle}>
        {children}
      </BottomSheet>
    </div>
  );
}

function Divider() {
  return <div style={{ width: 312, height: 1, background: 'var(--border-main)', margin: '0 auto -1px' }} />;
}

function CloseRow({ title, gap = 8, padX = 24 }: { title: string; gap?: number; padX?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap, padding: `0 ${padX}px` }}>
      <IconButton
        variant="tertiary"
        ariaLabel="Close"
        onClick={() => {}}
        icon={<SnackyIcons.outline.close width={24} height={24} />}
        style={{ width: 24, height: 24, padding: 0 }}
      />
      <span style={{ ...type('body-semibold'), flex: 1 }}>{title}</span>
    </div>
  );
}

function Stars({ filled }: { filled: number }) {
  return (
    <div style={{ display: 'flex' }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <SnackyIcons.solid.star
          key={i}
          width={16}
          height={16}
          color={i < filled ? 'var(--icon-brand)' : 'var(--color-neutral-200)'}
        />
      ))}
    </div>
  );
}

const centred = 'display:flex;flex-direction:column;gap:32px;align-items:center;padding:24px 24px 0;';

function Message({ heading, body }: { heading: string; body: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, textAlign: 'center', width: 312 }}>
      <div style={type('h3-bold')}>{heading}</div>
      <div style={type('small-regular')}>{body}</div>
    </div>
  );
}

export function Welcome() {
  return (
    <Sheet sheetStyle={centred}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
        <Illustration variant="welcome" src={ART} alt="" />
        <Message
          heading="Hi, Welcome to Snacky!"
          body="Let's take a quick tour so you can get to know our features better"
        />
      </div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', paddingTop: 4, paddingBottom: 24, width: '100%' }}>
        <Button variant="secondary" style={{ flex: 1 }}>
          Skip
        </Button>
        <Button style={{ flex: 1 }}>Take the Tour</Button>
      </div>
    </Sheet>
  );
}

export function Success() {
  return (
    <Sheet sheetStyle={centred}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', width: '100%' }}>
        <Illustration variant="success" src={ART} alt="" />
        <Message heading="Password Successfully Changed" body="You can now log in with your new password" />
      </div>
      <div style={{ display: 'flex', paddingTop: 4, paddingBottom: 24, width: '100%' }}>
        <Button style={{ flex: 1 }}>OK</Button>
      </div>
    </Sheet>
  );
}

export function Confirmation() {
  return (
    <Sheet sheetStyle={centred}>
      <Message heading="Are you sure you want to log out?" body="You need to log in again to access your account" />
      <div style={{ display: 'flex', gap: 14, alignItems: 'center', paddingTop: 4, paddingBottom: 24, width: '100%' }}>
        <Button variant="secondary" style={{ flex: 1 }}>
          Cancel
        </Button>
        <Button style={{ flex: 1 }}>Log Out</Button>
      </div>
    </Sheet>
  );
}

/* Figma's Onboarding "modal" is a 325x160 coach-mark card, not a bottom sheet:
   it points at a feature on the screen behind it. No package component covers
   it; it is a Button plus layout glue. */
export function Onboarding() {
  return (
    <div
      style={{
        width: 325,
        boxSizing: 'border-box',
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-field)',
        padding: 'var(--spacing-12)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--gap-layout-block)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
      }}
    >
      <div>
        <div style={type('small-semibold')}>Shipping Address</div>
        <div style={type('small-regular')}>Your delivery destination can be easily accessed here</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ ...type('small-regular', 'var(--text-secondary)'), flex: 1 }}>1 of 5</span>
        <div style={{ flex: 1, display: 'flex' }}>
          <Button style={{ flex: 1 }}>Continue</Button>
        </div>
      </div>
    </div>
  );
}

/* Calendar brings its own 24px padding, so the sheet's own padding and gap go to 0. */
export function CalendarSheet() {
  const day = (n: number) => new Date(2021, 5, n);
  return (
    <Sheet sheetStyle="display:flex;flex-direction:column;gap:0;padding:0;">
      <Calendar
        month={day(1)}
        selected={[day(15), day(19)]}
        marked={[day(8)]}
        onSelect={() => {}}
        onPrevMonth={() => {}}
        onNextMonth={() => {}}
        onAction={() => {}}
      />
    </Sheet>
  );
}

export function VariantsSelector() {
  const weights = ['100 grams', '75 grams', '50 grams', '20 grams'];
  return (
    <Sheet sheetStyle="display:flex;flex-direction:column;gap:16px;padding:16px 24px 0;">
      <CloseRow title="Variants" gap={16} padX={0} />
      <div style={{ display: 'flex' }}>
        <ProductImage src={PRODUCT} alt="" usage="variant" />
      </div>
      <div style={{ padding: '8px 0' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: '8px 0' }}>
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
      </div>
      <div style={{ display: 'flex', gap: 8, padding: '4px 0 24px' }}>
        <Button
          variant="secondary"
          icon={<SnackyIcons.outline.cartAdd width={24} height={24} />}
          style={{ width: 160, gap: 10 }}
        >
          Cart
        </Button>
        <Button style={{ flex: 1 }}>Buy Now</Button>
      </div>
    </Sheet>
  );
}

export function PaymentMethods() {
  const section = (title: string) => <div style={{ ...type('h3-bold'), padding: '0 24px' }}>{title}</div>;
  const icon = (glyph: React.ReactNode) => (
    <span style={{ display: 'inline-flex', color: 'var(--icon-secondary)', flexShrink: 0 }}>{glyph}</span>
  );
  const logo = <img src={LOGO} alt="" width={24} height={24} style={{ objectFit: 'contain', flexShrink: 0 }} />;
  const item = (lead: React.ReactNode, name: string, sub?: string, action?: string) => (
    <>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', width: 312, margin: '0 auto' }}>
        {lead}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <span style={type('small-semibold')}>{name}</span>
          {sub ? <span style={type('small-regular', 'var(--text-secondary)')}>{sub}</span> : null}
        </div>
        {action ? <span style={{ ...type('small-bold', 'var(--text-link)'), cursor: 'pointer' }}>{action}</span> : null}
      </div>
      <Divider />
    </>
  );
  return (
    <Sheet sheetStyle="display:flex;flex-direction:column;gap:16px;padding:16px 0;">
      <CloseRow title="Payment Methods" />
      {section('Balance & COD')}
      {item(icon(<SnackyIcons.outline.balance width={24} height={24} />), 'Balance', '$6.00 (Insufficient Balance)', 'Top Up')}
      {item(icon(<SnackyIcons.outline.truck width={24} height={24} />), 'COD')}
      {section('E-Wallet')}
      {item(logo, 'GOPAY')}
      {item(logo, 'OVO')}
      {item(logo, 'ShopeePay')}
      {item(logo, 'DANA')}
      {item(logo, 'Link AjA')}
      {section('Credit/Debit Card')}
      {item(icon(<SnackyIcons.outline.creditCard width={24} height={24} />), 'Visa/Mastercard', undefined, 'Add')}
      {section('Virtual Account')}
      {item(logo, 'BCA Virtual Account')}
      {item(logo, 'Mandiri Virtual Account')}
      {item(logo, 'BRI Virtual Account')}
    </Sheet>
  );
}

export function BuyerReviews() {
  const grey = 'var(--text-secondary)';
  const review = (k: number) => (
    <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '0 24px' }}>
        <Avatar src={AVATAR} alt="" size="sm" />
        <div>
          <div style={type('small-bold')}>Debora Maryanti</div>
          <Stars filled={4} />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '0 24px' }}>
        <div style={type('small-regular')}>Order was accurate and arrived quickly</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[0, 1, 2].map((i) => (
            <ProductImage key={i} src={PRODUCT} alt="" usage="review" />
          ))}
        </div>
      </div>
      <Divider />
    </div>
  );
  return (
    <Sheet sheetStyle="display:flex;flex-direction:column;gap:16px;padding:16px 0;">
      <CloseRow title="Buyer Reviews" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '0 24px' }}>
        <SnackyIcons.solid.star width={16} height={16} color="var(--icon-brand)" />
        <span style={type('small-semibold', grey)}>4.5</span>
        <span style={type('small-regular', grey)}>(471 ratings)</span>
        <span style={{ width: 4, height: 4, borderRadius: 'var(--radius-full)', background: grey }} />
        <span style={type('small-regular', grey)}>189 Reviews</span>
      </div>
      <div style={{ display: 'flex', gap: 8, padding: '0 24px' }}>
        <FilterChip label="Latest" selected onClick={() => {}} />
        <FilterChip label="Highest Rating" selected={false} onClick={() => {}} />
        <FilterChip label="Lowest Rating" selected={false} onClick={() => {}} />
      </div>
      {[1, 2, 3].map(review)}
    </Sheet>
  );
}

/* The one Modal variant with a drag handle in Figma (`Driver Slider`). */
export function DriverTracking() {
  return (
    <Sheet
      showHandle
      sheetStyle="display:flex;flex-direction:column;gap:16px;padding:8px 24px 24px;box-shadow:0 -4px 12px rgba(0,0,0,0.08);"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: 312, margin: '0 auto', padding: '16px 0' }}>
        <Avatar src={AVATAR} alt="" size="md" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={type('body-semibold')}>Mimbar Al Risyad</div>
          <div style={type('caption-regular', 'var(--text-secondary)')}>B1112ARB</div>
        </div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <IconButton variant="tertiary" ariaLabel="Call driver" icon={<SnackyIcons.outline.phone width={24} height={24} />} />
          <IconButton
            variant="tertiary"
            ariaLabel="Chat with driver"
            icon={<SnackyIcons.outline.chat width={24} height={24} />}
          />
        </div>
      </div>
      <Divider />
      <div style={{ width: 312, margin: '0 auto' }}>
        <div style={type('small-regular')}>Estimated arrival at</div>
        <div style={type('small-bold')}>12:30 - 12:40</div>
      </div>
      <Divider />
      <div style={{ width: 312, margin: '0 auto' }}>
        <Stepper
          steps={[
            { label: 'Driver picking up order from seller', timestamp: 'Dec 30, 11:00 AM', state: 'done' },
            { label: 'Driver delivering order to customer', timestamp: 'Dec 30, 12:00 PM', state: 'done' },
            { label: 'Order received by customer', state: 'pending' },
          ]}
        />
      </div>
      <Divider />
    </Sheet>
  );
}
