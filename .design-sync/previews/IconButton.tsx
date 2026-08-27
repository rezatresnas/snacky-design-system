import { IconButton, SnackyIcons } from '@snacky/ui';

export function Primary() {
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <IconButton icon={<SnackyIcons.outline.cartAdd />} ariaLabel="Add to cart" />
      <IconButton icon={<SnackyIcons.outline.back />} ariaLabel="Go back" />
      <IconButton icon={<SnackyIcons.outline.close />} ariaLabel="Close" />
    </div>
  );
}

export function SecondaryFavorite() {
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <IconButton variant="secondary" icon={<SnackyIcons.outline.heart />} ariaLabel="Add to favorites" selected={false} />
      {/* `selected` only tints color; swapping outline -> solid on favorite is the
          consumer's job (the icon is a slot, not owned by the component). */}
      <IconButton variant="secondary" icon={<SnackyIcons.solid.heart />} ariaLabel="Remove from favorites" selected={true} />
    </div>
  );
}

export function Tertiary() {
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <IconButton variant="tertiary" icon={<SnackyIcons.outline.edit />} ariaLabel="Edit address" />
      <IconButton variant="tertiary" icon={<SnackyIcons.outline.trash />} ariaLabel="Remove item" />
    </div>
  );
}

export function Sizes() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <IconButton size="default" icon={<SnackyIcons.outline.plus />} ariaLabel="Increase quantity" />
      <IconButton size="small" icon={<SnackyIcons.outline.plus />} ariaLabel="Increase quantity" />
    </div>
  );
}

export function Disabled() {
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <IconButton icon={<SnackyIcons.outline.cartAdd />} ariaLabel="Add to cart" disabled />
      <IconButton variant="secondary" icon={<SnackyIcons.outline.heart />} ariaLabel="Add to favorites" disabled />
    </div>
  );
}
