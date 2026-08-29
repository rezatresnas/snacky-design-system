import { ProductImage } from '@snacky/ui';

/* Generic "no photo" placeholder - neutral surface + the design system's own
   camera icon, standing in for real product photography (or, for
   AccordionModalUsage below, a payment-provider logo). Never an emoji glyph
   (see .design-sync/NOTES.md rule #1). */
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

const IMG = placeholder(200, 200);
const CARD_LOGO = placeholder(48, 48);

export function ProductCardUsage() {
  return <ProductImage src={IMG} alt="Choco Chip Cookies 200g" usage="product-card" />;
}

export function ProductDetailsUsage() {
  return <ProductImage src={IMG} alt="Choco Chip Cookies 200g" usage="product-details" />;
}

export function ListUsage() {
  return <ProductImage src={IMG} alt="Salted Caramel Wafers 150g" usage="list" />;
}

export function ReviewUsage() {
  return <ProductImage src={IMG} alt="Matcha Wafers Bundle" usage="review" />;
}

export function VariantUsage() {
  return <ProductImage src={IMG} alt="Spicy Cassava Chips, red packaging" usage="variant" />;
}

export function AccordionModalUsage() {
  return <ProductImage src={CARD_LOGO} alt="Pay with Bank Transfer" usage="accordion-modal" />;
}

export function SoldOut() {
  return <ProductImage src={IMG} alt="Limited Matcha Wafers, sold out" usage="product-card" sold />;
}
