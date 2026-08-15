import type { IconProps } from './types.js';

/**
 * Starter outline icon set - generic 24x24, 1.5px stroke, matching the
 * documented Outline style. This covers the icons most needed to build a
 * form (eye/eyeOff, chevronDown, calendar, search, close, location, send,
 * check, plus/minus) plus the 5 Navbar icons.
 *
 * This is NOT the full documented 41-icon Outline set - the rest should be
 * exported from the real Figma icon components (via the same
 * download_assets/get_screenshot tooling used to build this design system)
 * and dropped in here, rather than redrawn from memory.
 */
function base(path: React.ReactNode) {
  return function OutlineIcon({ width = 24, height = 24, color = 'currentColor', ...rest }: IconProps) {
    return (
      <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...rest}>
        {path}
      </svg>
    );
  };
}

export const home = base(<path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1v-8.5Z" />);
export const category = base(<><rect x="4" y="4" width="7" height="7" rx="1" /><rect x="13" y="4" width="7" height="7" rx="1" /><rect x="4" y="13" width="7" height="7" rx="1" /><rect x="13" y="13" width="7" height="7" rx="1" /></>);
export const cart = base(<><circle cx="9" cy="20" r="1" /><circle cx="17" cy="20" r="1" /><path d="M3 4h2l2.4 11.6a1.5 1.5 0 0 0 1.47 1.2h8.06a1.5 1.5 0 0 0 1.47-1.2L20 7H6" /></>);
export const cartAdd = base(<><circle cx="9" cy="20" r="1" /><circle cx="17" cy="20" r="1" /><path d="M3 4h2l2.4 11.6a1.5 1.5 0 0 0 1.47 1.2h8.06a1.5 1.5 0 0 0 1.47-1.2L20 7H6" /><path d="M18 2v5M15.5 4.5h5" /></>);
export const history = base(<><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v4h4" /><path d="M12 8v4l3 2" /></>);
export const account = base(<><circle cx="12" cy="8" r="3.5" /><path d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6" /></>);
export const eye = base(<><path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12Z" /><circle cx="12" cy="12" r="2.5" /></>);
export const eyeOff = base(<><path d="M3 3l18 18" /><path d="M10.6 5.6A9.9 9.9 0 0 1 12 5.5c6.5 0 10 6.5 10 6.5a15.9 15.9 0 0 1-3.4 4.2M6.5 6.8A16.4 16.4 0 0 0 2 12s3.5 6.5 10 6.5a10 10 0 0 0 4-.8" /><path d="M9.9 9.9a2.5 2.5 0 0 0 3.5 3.5" /></>);
export const chevronDown = base(<path d="M6 9l6 6 6-6" />);
export const chevronUp = base(<path d="M6 15l6-6 6 6" />);
export const chevronRight = base(<path d="M9 6l6 6-6 6" />);
export const back = base(<path d="M15 6l-6 6 6 6" />);
export const close = base(<path d="M6 6l12 12M18 6L6 18" />);
export const closeCircle = base(<><circle cx="12" cy="12" r="9" /><path d="M9 9l6 6M15 9l-6 6" /></>);
export const calendar = base(<><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v4M16 3v4" /></>);
export const search = base(<><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></>);
export const location = base(<><path d="M12 21s7-7.2 7-12a7 7 0 0 0-14 0c0 4.8 7 12 7 12Z" /><circle cx="12" cy="9" r="2.5" /></>);
export const pin = location;
export const send = base(<path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" />);
export const chat = base(<path d="M21 12a8 8 0 1 1-3.3-6.5L21 4l-1 4.7A7.9 7.9 0 0 1 21 12Z" />);
export const messageSquare = base(<path d="M4 4h16v12H8l-4 4V4Z" />);
export const heart = base(<path d="M12 20s-7-4.4-9.3-9A5 5 0 0 1 12 6a5 5 0 0 1 9.3 5c-2.3 4.6-9.3 9-9.3 9Z" />);
export const bell = base(<><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" /><path d="M10 19a2 2 0 0 0 4 0" /></>);
export const check = base(<path d="M5 13l4 4 10-10" />);
export const plus = base(<path d="M12 5v14M5 12h14" />);
export const minus = base(<path d="M5 12h14" />);
export const trash = base(<><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" /></>);
export const edit = base(<><path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3Z" /></>);
export const share = base(<><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="6" r="2.5" /><circle cx="18" cy="18" r="2.5" /><path d="M8.3 10.7l7.4-4.4M8.3 13.3l7.4 4.4" /></>);
export const camera = base(<><path d="M4 8h3l2-2h6l2 2h3v11H4V8Z" /><circle cx="12" cy="13.5" r="3.5" /></>);
export const phone = base(<path d="M6 3h3l2 5-2.5 1.5a12 12 0 0 0 6 6L16 13l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2Z" />);
export const lock = base(<><rect x="5" y="11" width="14" height="9" rx="1.5" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>);
export const document = base(<><path d="M7 3h7l4 4v14H7V3Z" /><path d="M14 3v4h4" /></>);
export const creditCard = base(<><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M3 10h18" /></>);
export const receipt = base(<><path d="M6 3h12v18l-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5-2 1.5V3Z" /><path d="M9 8h6M9 12h6" /></>);
export const smartphone = base(<><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M11 19h2" /></>);
export const key = base(<><circle cx="8" cy="15" r="4" /><path d="M11 12l9-9M17 6l3 3M14 9l2 2" /></>);
export const help = base(<><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.9.4-1 1-1 1.7" /><path d="M12 17h.01" /></>);
export const logout = base(<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5M21 12H9" /></>);
export const truck = base(<><path d="M2 7h11v10H2V7Z" /><path d="M13 10h4l4 3v4h-8v-7Z" /><circle cx="7" cy="19" r="1.5" /><circle cx="17" cy="19" r="1.5" /></>);
export const cash = base(<><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="3" /></>);
export const clock = base(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></>);
