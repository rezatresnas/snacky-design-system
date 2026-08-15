import type { IconProps } from './types.js';

/**
 * Starter solid icon set - filled counterparts for the active/selected
 * Navbar + Favorite states. Only a handful are provided (matching the
 * highest-traffic use cases); export the remaining documented set (10
 * icons: Home, Category, Cart, Document, Person, Bell, Truck, Cash, Gift,
 * Heart) from Figma the same way as the outline set.
 */
function base(path: React.ReactNode) {
  return function SolidIcon({ width = 24, height = 24, color = 'currentColor', ...rest }: IconProps) {
    return (
      <svg width={width} height={height} viewBox="0 0 24 24" fill={color} {...rest}>
        {path}
      </svg>
    );
  };
}

export const home = base(<path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1v-8.5Z" />);
export const category = base(<><rect x="4" y="4" width="7" height="7" rx="1" /><rect x="13" y="4" width="7" height="7" rx="1" /><rect x="4" y="13" width="7" height="7" rx="1" /><rect x="13" y="13" width="7" height="7" rx="1" /></>);
export const cart = base(<path d="M3 4h2l2.4 11.6a1.5 1.5 0 0 0 1.47 1.2h8.06a1.5 1.5 0 0 0 1.47-1.2L20 7H6l-.4-2H3v-1Zm6 16a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />);
export const heart = base(<path d="M12 20s-7-4.4-9.3-9A5 5 0 0 1 12 6a5 5 0 0 1 9.3 5c-2.3 4.6-9.3 9-9.3 9Z" />);
