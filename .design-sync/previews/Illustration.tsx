import { Illustration } from '@snacky/ui';

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

export function Empty() {
  return (
    <Illustration
      variant="empty"
      src={placeholder(268, 200, '📭', '#FFE8A3')}
      alt="No products found"
    />
  );
}

export function CreateAccount() {
  return (
    <Illustration
      variant="createAccount"
      src={placeholder(360, 240, '🧑‍🍳', '#FFD08A')}
      alt="Create your Snacky account"
    />
  );
}

export function Welcome() {
  return (
    <Illustration
      variant="welcome"
      src={placeholder(200, 200, '👋', '#C8F5D0')}
      alt="Welcome to Snacky"
    />
  );
}

export function Success() {
  return (
    <Illustration
      variant="success"
      src={placeholder(200, 200, '✅', '#C8F5D0')}
      alt="Order placed successfully"
    />
  );
}

export function DiscountReferral() {
  return (
    <Illustration
      variant="discountReferral"
      src={placeholder(268, 200, '🎁', '#FFE8A3')}
      alt="Invite a friend for a discount"
    />
  );
}
