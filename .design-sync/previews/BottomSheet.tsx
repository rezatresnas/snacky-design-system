import {
  BottomSheet,
  Button,
  Illustration,
  ProductChip,
  ProductImage,
  SnackyIcons,
} from '@snacky/ui';

/* Photo/artwork stand-in only - never an icon substitute (see NOTES.md rule #1).
   Icon props always take a real SnackyIcons glyph. */
function placeholder(width: number, height: number, emoji: string, fill: string) {
  return (
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="${width}" height="${height}" fill="${fill}"/><text x="50%" y="55%" font-size="${Math.round(
        Math.min(width, height) * 0.4
      )}" text-anchor="middle" dominant-baseline="middle">${emoji}</text></svg>`
    )
  );
}

/* BottomSheet is the shell every documented Modal variant composes from - it
   supplies the surface, the top corners and the dismiss behaviour, and the
   variant is whatever gets rendered inside. These previews are the documented
   variants, built from package components wherever one exists. */

const stage: React.CSSProperties = {
  position: 'relative',
  /* Phone width: the sheet is width:100% up to a 480 max, so without an
     explicit stage width it collapses to whatever the host card gives it. */
  width: 360,
  height: 460,
  /* The sheet's overlay is position:fixed, and position:relative does NOT
     create a containing block for that - only transform/filter/contain do.
     Without this the sheet escapes the card and covers the whole host page. */
  transform: 'translateZ(0)',
  overflow: 'hidden',
};
const body: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 32,
  alignItems: 'center',
  padding: '24px 24px 0',
  /* Glue text needs the font token explicitly - the package sets no global
     font-family (NOTES.md rule #2). */
  fontFamily: 'var(--font-body-regular-family)',
};
const centred: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  textAlign: 'center',
  width: 312,
  color: 'var(--text-primary)',
};
const title: React.CSSProperties = {
  fontFamily: 'var(--font-h3-bold-family)',
  fontSize: 'var(--font-h3-bold-size)',
  fontWeight: 'var(--font-h3-bold-weight)' as React.CSSProperties['fontWeight'],
  lineHeight: 'var(--font-h3-bold-line-height)',
};
const bodyText: React.CSSProperties = {
  fontFamily: 'var(--font-small-regular-family)',
  fontSize: 'var(--font-small-regular-size)',
  lineHeight: 'var(--font-small-regular-line-height)',
};

export function Welcome() {
  return (
    <div style={stage}>
      <BottomSheet open onDismiss={() => {}}>
        <div style={body}>
          <Illustration variant="welcome" src={placeholder(200, 200, '👋', '#FFE8A3')} alt="" />
          <div style={centred}>
            <div style={title}>Hi, Welcome to Snacky!</div>
            <div style={bodyText}>
              Let&rsquo;s take a quick tour so you can get to know our features better
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, width: '100%', paddingBottom: 24 }}>
            <Button variant="secondary" style={{ flex: 1 }}>
              Skip
            </Button>
            <Button style={{ flex: 1 }}>Take the Tour</Button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}

export function Success() {
  return (
    <div style={stage}>
      <BottomSheet open onDismiss={() => {}}>
        <div style={body}>
          <Illustration variant="success" src={placeholder(200, 200, '✅', '#E8F5E9')} alt="" />
          <div style={centred}>
            <div style={title}>Password Successfully Changed</div>
            <div style={bodyText}>You can now log in with your new password</div>
          </div>
          <div style={{ display: 'flex', width: '100%', paddingBottom: 24 }}>
            <Button style={{ flex: 1 }}>OK</Button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}

export function Confirmation() {
  return (
    <div style={stage}>
      <BottomSheet open onDismiss={() => {}}>
        <div style={body}>
          <div style={centred}>
            <div style={title}>Are you sure you want to log out?</div>
            <div style={bodyText}>You need to log in again to access your account</div>
          </div>
          <div style={{ display: 'flex', gap: 14, width: '100%', paddingBottom: 24 }}>
            <Button variant="secondary" style={{ flex: 1 }}>
              Cancel
            </Button>
            <Button danger style={{ flex: 1 }}>
              Log Out
            </Button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}

export function VariantSelector() {
  const weights = ['100 grams', '75 grams', '50 grams', '20 grams'];
  return (
    <div style={stage}>
      <BottomSheet open onDismiss={() => {}}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            padding: '16px 24px 24px',
            fontFamily: 'var(--font-body-regular-family)',
          }}
        >
          <div style={{ ...title, fontSize: 16 }}>Variants</div>
          <ProductImage src={placeholder(90, 90, '🍿', '#FFE8A3')} alt="Snack" usage="variant" />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {weights.map((w, i) => (
              <ProductChip
                key={w}
                label={w}
                selected={i === 1}
                onClick={() => {}}
                thumbnail={
                  <img
                    src={placeholder(24, 24, '🍿', '#FFE8A3')}
                    alt=""
                    width={24}
                    height={24}
                    style={{ objectFit: 'contain', display: 'block' }}
                  />
                }
              />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button
              variant="secondary"
              icon={<SnackyIcons.outline.cartAdd width={24} height={24} />}
              style={{ width: 160 }}
            >
              Cart
            </Button>
            <Button style={{ flex: 1 }}>Buy Now</Button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}

export function PaymentMethods() {
  const rows: Array<[React.ReactNode, string, string | null]> = [
    [<SnackyIcons.outline.balance width={24} height={24} />, 'Balance', 'Top Up'],
    [<SnackyIcons.outline.truck width={24} height={24} />, 'COD', null],
    [<SnackyIcons.outline.creditCard width={24} height={24} />, 'Visa/Mastercard', 'Add'],
  ];
  return (
    <div style={stage}>
      <BottomSheet open onDismiss={() => {}}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            padding: '16px 24px 24px',
            fontFamily: 'var(--font-body-regular-family)',
          }}
        >
          <div style={{ ...title, fontSize: 16 }}>Payment Methods</div>
          {rows.map(([icon, name, action]) => (
            <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ display: 'inline-flex', color: 'var(--icon-secondary)' }}>{icon}</span>
              <span style={{ ...bodyText, flex: 1, fontWeight: 600 }}>{name}</span>
              {action && (
                <span
                  style={{
                    ...bodyText,
                    fontWeight: 700,
                    color: 'var(--text-link)',
                    cursor: 'pointer',
                  }}
                >
                  {action}
                </span>
              )}
            </div>
          ))}
        </div>
      </BottomSheet>
    </div>
  );
}

export function WithHandle() {
  return (
    <div style={stage}>
      <BottomSheet open onDismiss={() => {}} showHandle>
        <div style={{ ...body, paddingBottom: 24 }}>
          <div style={centred}>
            <div style={title}>Driver on the way</div>
            <div style={bodyText}>
              The drag handle is opt-in: none of the nine documented Modal variants use one.
            </div>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
