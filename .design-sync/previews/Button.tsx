import { Button, SnackyIcons } from '@snacky/ui';

/* Stand-in for a sign-in provider logo (brand artwork is not part of this
   package). A neutral 24px tile, never an emoji (NOTES.md rule #1). */
const PROVIDER_LOGO =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><rect width="24" height="24" rx="12" fill="#e0e0e0"/><circle cx="12" cy="12" r="5" fill="none" stroke="#a3a3a3" stroke-width="2"/></svg>'
  );

export function Hierarchy() {
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <Button variant="primary">Add to cart</Button>
      <Button variant="secondary">View details</Button>
      <Button variant="tertiary">Cancel</Button>
    </div>
  );
}

export function Danger() {
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <Button variant="primary" danger>Delete account</Button>
      <Button variant="secondary" danger>Remove item</Button>
      <Button variant="tertiary" danger>Discard changes</Button>
    </div>
  );
}

export function Sizes() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Button size="default">Checkout</Button>
      <Button size="small">Apply</Button>
    </div>
  );
}

export function WithIcon() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Button size="default" icon={<SnackyIcons.outline.cartAdd width={24} height={24} />}>
        Add to cart
      </Button>
      <Button size="small" icon={<SnackyIcons.outline.cartAdd width={20} height={20} />}>
        Add to cart
      </Button>
    </div>
  );
}

export function Disabled() {
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <Button variant="primary" disabled>Add to cart</Button>
      <Button variant="secondary" disabled>View details</Button>
    </div>
  );
}

export function WithSocial() {
  return (
    <Button variant="secondary" icon={<img src={PROVIDER_LOGO} width={24} height={24} alt="" />}>
      Login with Google
    </Button>
  );
}
