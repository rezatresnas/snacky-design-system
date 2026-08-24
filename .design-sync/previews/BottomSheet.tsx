import { BottomSheet } from '@snacky/ui';

export function Default() {
  return (
    <div style={{ position: 'relative', height: 400 }}>
      <BottomSheet open onDismiss={() => {}}>
        <div style={{ padding: 24, fontFamily: 'var(--font-body-regular-family)' }}>
          <h3 style={{ margin: '0 0 8px', fontFamily: 'var(--font-h3-bold-family)' }}>Order confirmed</h3>
          <p style={{ margin: 0 }}>Your snacks are on the way, thanks for ordering with Snacky.</p>
        </div>
      </BottomSheet>
    </div>
  );
}

export function WithHandle() {
  return (
    <div style={{ position: 'relative', height: 400 }}>
      <BottomSheet open onDismiss={() => {}} showHandle>
        <div style={{ padding: 24, fontFamily: 'var(--font-body-regular-family)' }}>
          <h3 style={{ margin: '0 0 8px', fontFamily: 'var(--font-h3-bold-family)' }}>Select variant</h3>
          <p style={{ margin: 0 }}>Choose the size and flavor before adding to cart.</p>
        </div>
      </BottomSheet>
    </div>
  );
}
