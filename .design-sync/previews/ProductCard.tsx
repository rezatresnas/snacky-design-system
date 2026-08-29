import { useState } from 'react';
import { ProductCard, SnackyIcons } from '@snacky/ui';

/* Generic "no photo" placeholder - neutral surface + the design system's own
   camera icon, standing in for real product photography. Never an emoji
   glyph (see .design-sync/NOTES.md rule #1). */
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

export function ListVariant() {
  return (
    <div style={{ width: 180 }}>
      <ProductCard
        variant="list"
        productName="Choco Chip Cookies 200g"
        imageUrl={IMG}
        price="Rp 24.000"
        originalPrice="Rp 30.000"
        discountLabel="20%"
        rating={4.8}
        onAddToCart={() => {}}
        cartIcon={<SnackyIcons.outline.cartAdd width={16} height={16} />}
      />
    </div>
  );
}

export function DetailsVariant() {
  const [favorited, setFavorited] = useState(true);
  return (
    // Details is a product-detail-page component, not a narrow card - CLAUDE.md's
    // own convention is full-width content with a 16px screen margin, so this
    // uses a realistic 343px (375px mobile screen minus 16px margins) rather than
    // an arbitrary narrow box. At 260px the Figma-accurate 24px padding and 20px
    // price font wrap the price row onto two lines, which is a preview-width
    // artifact, not a real component bug.
    <div style={{ width: 343 }}>
      <ProductCard
        variant="details"
        productName="Choco Chip Cookies 200g"
        imageUrl={IMG}
        price="Rp 24.000"
        originalPrice="Rp 30.000"
        discountLabel="20%"
        rating={4.8}
        ratingCount={312}
        favorited={favorited}
        onFavoriteClick={() => setFavorited((v) => !v)}
        onShareClick={() => {}}
        onChatClick={() => {}}
        // No favoriteIcon override here on purpose - the component's own default
        // already swaps solid/outline heart from `favorited`. Hardcoding outline
        // here defeated that swap and always showed outline even when favorited.
        shareIcon={<SnackyIcons.outline.share width={16} height={16} />}
        chatIcon={<SnackyIcons.outline.chat width={16} height={16} />}
      />
    </div>
  );
}

export function SoldOut() {
  return (
    <div style={{ width: 343 }}>
      <ProductCard
        variant="details"
        productName="Limited Matcha Wafers"
        imageUrl={IMG}
        price="Rp 32.000"
        rating={4.6}
        ratingCount={87}
        favorited={false}
        onFavoriteClick={() => {}}
        onShareClick={() => {}}
        onChatClick={() => {}}
        favoriteIcon={<SnackyIcons.outline.heart width={16} height={16} />}
        shareIcon={<SnackyIcons.outline.share width={16} height={16} />}
        chatIcon={<SnackyIcons.outline.chat width={16} height={16} />}
        sold
      />
    </div>
  );
}
