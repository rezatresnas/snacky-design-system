import { HeroBanner } from '@snacky/ui';

const IMG_A = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="720" height="300"><rect width="720" height="300" fill="#FFD84D"/><text x="50%" y="55%" font-size="52" text-anchor="middle" dominant-baseline="middle">🍿 Weekend Snack Fest</text></svg>'
);

const IMG_B = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="720" height="300"><rect width="720" height="300" fill="#FF6B6B"/><text x="50%" y="55%" font-size="52" text-anchor="middle" dominant-baseline="middle">🥤 Buy 2 Get 1 Free</text></svg>'
);

export function Carousel() {
  return <HeroBanner imageUrl={IMG_A} alt="Weekend snack fest, up to 40% off" />;
}

export function SecondSlide() {
  return <HeroBanner imageUrl={IMG_B} alt="Buy two drinks, get one free" />;
}
