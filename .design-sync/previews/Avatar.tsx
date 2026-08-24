import { Avatar } from '@snacky/ui';

const IMG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="#FFD08A"/><text x="50%" y="55%" font-size="90" text-anchor="middle" dominant-baseline="middle">👩</text></svg>'
  );

export function Small() {
  return <Avatar src={IMG} alt="Alex Rivera" size="sm" />;
}

export function Medium() {
  return <Avatar src={IMG} alt="Alex Rivera" size="md" />;
}

export function Large() {
  return <Avatar src={IMG} alt="Alex Rivera" size="lg" />;
}

export function AllSizes() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
      <Avatar src={IMG} alt="Alex Rivera" size="sm" />
      <Avatar src={IMG} alt="Alex Rivera" size="md" />
      <Avatar src={IMG} alt="Alex Rivera" size="lg" />
    </div>
  );
}
