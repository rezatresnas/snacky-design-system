import { SoldOutBadge } from '@snacky/ui';

const IMG = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240"><rect width="240" height="240" fill="#E8DFF5"/><text x="50%" y="50%" font-size="72" text-anchor="middle" dominant-baseline="middle">🍫</text></svg>'
);

export function OnProductImage() {
  return (
    <div style={{ position: 'relative', width: 240, height: 240 }}>
      <img src={IMG} alt="Choco bar product" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-field)' }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <SoldOutBadge />
      </div>
    </div>
  );
}

export function Standalone() {
  return <SoldOutBadge />;
}
