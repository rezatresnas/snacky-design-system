import { OrderListItem } from '@snacky/ui';

const IMG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="#FFE8A3"/><text x="50%" y="55%" font-size="64" text-anchor="middle" dominant-baseline="middle">🍫</text></svg>'
  );

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
