import { Button, SnackyIcons } from '@snacky/ui';

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
