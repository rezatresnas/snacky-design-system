import { cx } from '../../utils/cx.js';
import './Avatar.css';

export type AvatarSize = 'sm' | 'md' | 'lg';

export interface AvatarProps {
  src: string;
  alt: string;
  size?: AvatarSize;
  className?: string;
}

/** Snacky Avatar - circular profile photo in three fixed sizes (32 / 56 / 72px). */
export function Avatar({ src, alt, size = 'md', className }: AvatarProps) {
  return <img src={src} alt={alt} className={cx('snacky-avatar', `snacky-avatar--${size}`, className)} />;
}
