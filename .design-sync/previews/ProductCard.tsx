import { useState } from 'react';
import { ProductCard, SnackyIcons } from '@snacky/ui';

const IMG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="#FFE8A3"/><text x="50%" y="55%" font-size="64" text-anchor="middle" dominant-baseline="middle">🍪</text></svg>'
  );

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
        favoriteIcon={<SnackyIcons.outline.heart width={16} height={16} />}
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
