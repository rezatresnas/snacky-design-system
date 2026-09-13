import { ProductGroupSection, ProductCard, SquareBanner } from '@snacky/ui';

/* Generic "no photo" placeholder: neutral surface plus a broken-image glyph,
   standing in for product photography and banner artwork. Never an emoji glyph
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

const PRODUCT = placeholder(200, 200);
const BANNER = placeholder(360, 334);

/* ProductGroupSection packages the three product layouts from Figma's Section set,
   so a design uses them by name: the header, the trailing "See other products"
   card and the scrolling all come with the component. Children are list
   ProductCards. The scrolling rows can be dragged with a mouse. */

type Row = [name: string, price: string, originalPrice: string];

function cards(rows: Row[]) {
  return rows.map(([name, price, originalPrice], i) => (
    <ProductCard
      key={i}
      productName={name}
      imageUrl={PRODUCT}
      price={price}
      originalPrice={originalPrice}
      discountLabel="-50%"
      rating={4.5}
      onAddToCart={() => {}}
    />
  ));
}

const chiki: Row[] = [
  ['Chicki Balls Cheeky Chicken 75 g', 'Rp 5,000', 'Rp 10,000'],
  ['Chicki Twist Roasted Corn 75 g', 'Rp 5,000', 'Rp 10,000'],
  ['Chicki Puffs Cheddar Cheese 75 g', 'Rp 5,000', 'Rp 10,000'],
];

export function Horizontal() {
  return (
    <div style={{ width: 360 }}>
      <ProductGroupSection title="Similar Products" layout="horizontal" onSeeMore={() => {}}>
        {cards([
          ['Lays Seaweed Flavor 14g', 'Rp 15,000', 'Rp 20,000'],
          ['Pota Bee Black Truffle 65g', 'Rp 15,000', 'Rp 15,000'],
          ['Oishi Caramel Popcorn 100g', 'Rp 20,000', 'Rp 30,000'],
        ])}
      </ProductGroupSection>
    </div>
  );
}

/* The cards start at x160 and slide over the banner as the row scrolls. */
export function Banner() {
  return (
    <div style={{ width: 360 }}>
      <ProductGroupSection
        title="Exciting Promo"
        layout="banner"
        onSeeMore={() => {}}
        banner={<SquareBanner imageUrl={BANNER} alt="Chiki Discount 50% for all variants" />}
      >
        {cards(chiki)}
      </ProductGroupSection>
    </div>
  );
}

export function Grid() {
  return (
    <div style={{ width: 360 }}>
      <ProductGroupSection title="Recommendations for You" layout="grid" onSeeMore={() => {}}>
        {cards([
          ...chiki,
          ['Oishi Caramel Popcorn 100g', 'Rp 5,000', 'Rp 10,000'],
          ['Lays Seaweed Flavor 14g', 'Rp 5,000', 'Rp 10,000'],
          ['Pota Bee Black Truffle 65g', 'Rp 5,000', 'Rp 10,000'],
          ['Chicki Balls Cheeky Chicken 75 g', 'Rp 5,000', 'Rp 10,000'],
          ['Chicki Twist Roasted Corn 75 g', 'Rp 5,000', 'Rp 10,000'],
        ])}
      </ProductGroupSection>
    </div>
  );
}

/* Without onSeeMore there is no header chevron and no trailing card. */
export function WithoutSeeMore() {
  return (
    <div style={{ width: 360 }}>
      <ProductGroupSection title="Similar Products" layout="horizontal">
        {cards(chiki)}
      </ProductGroupSection>
    </div>
  );
}
