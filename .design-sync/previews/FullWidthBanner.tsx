import { FullWidthBanner } from '@snacky/ui';

const IMG = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="720" height="352"><rect width="720" height="352" fill="#FFD84D"/><text x="50%" y="55%" font-size="56" text-anchor="middle" dominant-baseline="middle">🍿 Snack Sale</text></svg>'
);

const IMG_WIDE = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="720" height="352"><rect width="720" height="352" fill="#4D9DFF"/><text x="50%" y="55%" font-size="48" text-anchor="middle" dominant-baseline="middle">🍫 New Flavor Drop</text></svg>'
);

export function Promo() {
  return <FullWidthBanner imageUrl={IMG} alt="50% off snack boxes, today only" />;
}

export function NewArrival() {
  return <FullWidthBanner imageUrl={IMG_WIDE} alt="New chocolate flavor now available" />;
}
