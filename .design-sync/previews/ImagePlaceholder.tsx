import { ImagePlaceholder } from '@snacky/ui';

export function ProductThumbnail() {
  return <ImagePlaceholder width={152} height={128} />;
}

export function AvatarSlot() {
  return (
    <div style={{ borderRadius: '50%', overflow: 'hidden' }}>
      <ImagePlaceholder width={56} height={56} />
    </div>
  );
}

export function BannerSlot() {
  return <ImagePlaceholder width={312} height={128} />;
}

export function AllSizes() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
      <ImagePlaceholder width={24} height={24} />
      <ImagePlaceholder width={56} height={56} />
      <ImagePlaceholder width={90} height={90} />
      <ImagePlaceholder width={152} height={128} />
    </div>
  );
}
