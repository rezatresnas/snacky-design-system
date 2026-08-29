import { OrderListItem } from '@snacky/ui';

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

export function Waiting() {
  return (
    <div style={{ width: 320 }}>
      <OrderListItem
        productImage={IMG}
        productName="Choco Chip Cookies 200g"
        status="waiting"
        itemsSummary="2 products"
        total="Rp 48.000"
        paymentDeadline="Dec 30, 11:00"
        onAction={() => {}}
      />
    </div>
  );
}

export function Processing() {
  return (
    <div style={{ width: 320 }}>
      <OrderListItem
        productImage={IMG}
        productName="Salted Caramel Wafers 150g"
        status="process"
        itemsSummary="1 product"
        total="Rp 22.000"
        onAction={() => {}}
      />
    </div>
  );
}

export function ProcessingCOD() {
  return (
    <div style={{ width: 320 }}>
      <OrderListItem
        productImage={IMG}
        productName="Matcha Wafers Bundle"
        status="processCod"
        itemsSummary="3 products"
        total="Rp 65.000"
        onAction={() => {}}
      />
    </div>
  );
}

export function Shipped() {
  return (
    <div style={{ width: 320 }}>
      <OrderListItem
        productImage={IMG}
        productName="Spicy Cassava Chips 100g"
        status="shipped"
        itemsSummary="Order #SNK-40213"
        total="Rp 18.500"
        onAction={() => {}}
      />
    </div>
  );
}

export function Received() {
  return (
    <div style={{ width: 320 }}>
      <OrderListItem
        productImage={IMG}
        productName="Honey Roasted Almonds 80g"
        status="received"
        itemsSummary="Order #SNK-40188, Delivered"
        total="Rp 35.000"
        onAction={() => {}}
      />
    </div>
  );
}

export function Cancelled() {
  return (
    <div style={{ width: 320 }}>
      <OrderListItem
        productImage={IMG}
        productName="Green Tea Rice Crackers 90g"
        status="cancelled"
        itemsSummary="1 product"
        total="Rp 15.000"
        onAction={() => {}}
      />
    </div>
  );
}
