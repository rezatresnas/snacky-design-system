import { SquareBanner } from '@snacky/ui';

const IMG_DISCOUNT = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="360" height="334"><rect width="360" height="334" fill="#FFD84D"/><text x="50%" y="55%" font-size="40" text-anchor="middle" dominant-baseline="middle">🍪 Discount</text></svg>'
);

const IMG_FAVOURITES = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="360" height="334"><rect width="360" height="334" fill="#FF8FA3"/><text x="50%" y="55%" font-size="40" text-anchor="middle" dominant-baseline="middle">⭐ Favourites</text></svg>'
);

export function Discount() {
  return <SquareBanner imageUrl={IMG_DISCOUNT} alt="Discount snacks category" />;
}

export function Favourites() {
  return <SquareBanner imageUrl={IMG_FAVOURITES} alt="Customer favourites category" />;
}
