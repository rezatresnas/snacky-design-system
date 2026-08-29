import { HeroBanner } from '@snacky/ui';

/* Generic "no photo" placeholder - neutral surface + the design system's own
   camera icon, standing in for real promotional artwork. Never an emoji
   glyph (see .design-sync/NOTES.md rule #1); the real copy lives in `alt`. */
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

const IMG_A = placeholder(720, 300);
const IMG_B = placeholder(720, 300);

export function Carousel() {
  return <HeroBanner imageUrl={IMG_A} alt="Weekend snack fest, up to 40% off" />;
}

export function SecondSlide() {
  return <HeroBanner imageUrl={IMG_B} alt="Buy two drinks, get one free" />;
}
