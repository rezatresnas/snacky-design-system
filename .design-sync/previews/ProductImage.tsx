import { ProductImage } from '@snacky/ui';

const IMG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="#FFE8A3"/><text x="50%" y="55%" font-size="64" text-anchor="middle" dominant-baseline="middle">🍪</text></svg>'
  );

const CARD_LOGO =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><rect width="48" height="48" rx="8" fill="#3A6EA5"/><text x="50%" y="58%" font-size="22" text-anchor="middle" dominant-baseline="middle" fill="white">🏦</text></svg>'
  );

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
