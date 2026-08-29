import { Illustration } from '@snacky/ui';

/* Generic "no artwork" placeholder - neutral surface + the design system's own
   camera icon, standing in for real illustration artwork this package
   deliberately ships none of. Never an emoji glyph (see .design-sync/NOTES.md
   rule #1). */
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

export function Empty() {
  return <Illustration variant="empty" src={placeholder(268, 200)} alt="No products found" />;
}

export function CreateAccount() {
  return (
    <Illustration variant="createAccount" src={placeholder(360, 240)} alt="Create your Snacky account" />
  );
}

export function Welcome() {
  return <Illustration variant="welcome" src={placeholder(200, 200)} alt="Welcome to Snacky" />;
}

export function Success() {
  return <Illustration variant="success" src={placeholder(200, 200)} alt="Order placed successfully" />;
}

export function DiscountReferral() {
  return (
    <Illustration
      variant="discountReferral"
      src={placeholder(268, 200)}
      alt="Invite a friend for a discount"
    />
  );
}
