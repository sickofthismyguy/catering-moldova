import type { ReactNode } from 'react';

/* Feather-style inline SVG icons. No icon library, no network request. */
const P: Record<string, ReactNode> = {
  search: (<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.2-3.2" /></>),
  pin: (<><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="2.8" /></>),
  phone: (<><path d="M21 16.9v2.6a2 2 0 0 1-2.2 2 19.6 19.6 0 0 1-8.5-3 19.3 19.3 0 0 1-6-6A19.6 19.6 0 0 1 1.3 4 2 2 0 0 1 3.3 2h2.6a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L7 9.7a16 16 0 0 0 6 6l1.1-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.9 2.1Z" /></>),
  mail: (<><rect x="2.5" y="4.5" width="19" height="15" rx="2.5" /><path d="m3 7 9 6 9-6" /></>),
  globe: (<><circle cx="12" cy="12" r="9.2" /><path d="M2.8 12h18.4M12 2.8c2.4 2.6 3.6 5.8 3.6 9.2S14.4 18.6 12 21.2C9.6 18.6 8.4 15.4 8.4 12S9.6 5.4 12 2.8Z" /></>),
  star: (<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.5l6.1-.9Z" />),
  check: (<path d="m4.5 12.5 5 5 10-11" />),
  heart: (<path d="M12 20.5S3.5 15 3.5 9.4A4.6 4.6 0 0 1 12 6.6a4.6 4.6 0 0 1 8.5 2.8c0 5.6-8.5 11.1-8.5 11.1Z" />),
  menu: (<><path d="M3.5 6.5h17M3.5 12h17M3.5 17.5h17" /></>),
  chevron: (<path d="m6 9 6 6 6-6" />),
  chevronRight: (<path d="m9 5 7 7-7 7" />),
  chevronLeft: (<path d="m15 5-7 7 7 7" />),
  arrowRight: (<><path d="M4 12h15" /><path d="m13 6 6 6-6 6" /></>),
  arrowLeft: (<><path d="M20 12H5" /><path d="m11 18-6-6 6-6" /></>),
  users: (<><circle cx="9" cy="8" r="3.4" /><path d="M2.8 20a6.2 6.2 0 0 1 12.4 0" /><path d="M16.5 5.2a3.4 3.4 0 0 1 0 6.6M18 14.4a6.2 6.2 0 0 1 3.2 5.6" /></>),
  calendar: (<><rect x="3" y="5" width="18" height="16" rx="2.4" /><path d="M3 10h18M8 3v4M16 3v4" /></>),
  plus: (<path d="M12 5v14M5 12h14" />),
  trash: (<><path d="M4 7h16M9.5 7V4.8h5V7M6.5 7l1 13h9l1-13" /><path d="M10.5 11v5.5M13.5 11v5.5" /></>),
  edit: (<><path d="M4 20h4L20 8l-4-4L4 16v4Z" /><path d="m14.5 5.5 4 4" /></>),
  upload: (<><path d="M12 16V4" /><path d="m7.5 8.5 4.5-4.5 4.5 4.5" /><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" /></>),
  x: (<path d="m6 6 12 12M18 6 6 18" />),
  alert: (<><path d="M12 3.5 22 20H2L12 3.5Z" /><path d="M12 10v4.5M12 17.4v.2" /></>),
  clock: (<><circle cx="12" cy="12" r="9" /><path d="M12 7v5.4l3.4 2" /></>),
  shield: (<><path d="M12 21.5s7.5-3.6 7.5-9.4V5.4L12 2.5 4.5 5.4v6.7c0 5.8 7.5 9.4 7.5 9.4Z" /><path d="m9 12 2.2 2.2L15.4 10" /></>),
  briefcase: (<><rect x="2.8" y="7" width="18.4" height="13" rx="2.2" /><path d="M8.8 7V5.2a2 2 0 0 1 2-2h2.4a2 2 0 0 1 2 2V7M2.8 12.6h18.4" /></>),
  cake: (<><path d="M4 20.5h16M4.8 20.5v-6a2 2 0 0 1 2-2h10.4a2 2 0 0 1 2 2v6" /><path d="M4.8 16.4c1.6 1.3 3-.4 4.6.6 1.2.8 2 .8 3.2 0 1.4-.9 2.4.6 4-.5" /><path d="M12 12.4V9M9.2 12.4V10M14.8 12.4V10" /><path d="M12 6.6a1.4 1.4 0 1 0 0-2.8 1.4 1.4 0 0 0 0 2.8Z" /></>),
  rings: (<><circle cx="8.6" cy="15" r="5" /><circle cx="15.4" cy="15" r="5" /><path d="m12 4.4 2.4 3H9.6l2.4-3Z" /></>),
  dove: (<><path d="M3.5 12.5c3.5.6 6-1 7.4-3.4C12.4 6.5 15 4.6 18.6 5l1.9-2-.4 4.4c.4 6.4-3.6 11.2-9.6 11.6-2.6.2-4.8-.6-6.4-2l4-1.6-3.6-2.9Z" /><circle cx="17.6" cy="8.4" r=".6" fill="currentColor" /></>),
  party: (<><path d="M4 20 9.4 9.2 14.8 14.6 4 20Z" /><path d="m11.6 7.2.6-2.6M16 8.4l2.4-1M17.4 13l2.6.4M14 4.6l1.6-1.4" /><path d="M13.6 11.4a3.6 3.6 0 0 1 3-3" /></>),
  mic: (<><rect x="9" y="2.6" width="6" height="11.4" rx="3" /><path d="M5.4 11.6a6.6 6.6 0 0 0 13.2 0M12 18.2v3.2M8.6 21.4h6.8" /></>),
  glass: (<><path d="M7.4 3h9.2l-1 8.2a3.6 3.6 0 0 1-7.2 0L7.4 3Z" /><path d="M12 15v6M8.6 21h6.8" /></>),
  leaf: (<><path d="M20 4C9.5 4 4 9 4 15.5c0 2 .7 3.6 1.4 4.5C7 15 12 11 19 9.6c-5.4 2.4-9.6 6.2-11.4 11.4" /><path d="M5.4 20c.6.4 1.2.6 1.8.7" /></>),
  home: (<><path d="M3.6 10.4 12 3.4l8.4 7V20a1.4 1.4 0 0 1-1.4 1.4H5A1.4 1.4 0 0 1 3.6 20v-9.6Z" /><path d="M9.4 21.4v-7h5.2v7" /></>),
  filter: (<path d="M3.5 5.5h17l-6.6 7.6v6.2l-3.8-2v-4.2L3.5 5.5Z" />),
  external: (<><path d="M14 4h6v6" /><path d="M20 4 11 13" /><path d="M18.5 14.5V19a1.8 1.8 0 0 1-1.8 1.8H5.2A1.8 1.8 0 0 1 3.4 19V7.5A1.8 1.8 0 0 1 5.2 5.7h4.4" /></>),
  image: (<><rect x="3" y="4.4" width="18" height="15.2" rx="2.4" /><circle cx="8.6" cy="10" r="1.8" /><path d="m4 17.4 4.6-4.2 3.4 3 3-2.6 5 4.4" /></>),
  logout: (<><path d="M14.5 4.5H18a1.8 1.8 0 0 1 1.8 1.8v11.4A1.8 1.8 0 0 1 18 19.5h-3.5" /><path d="M10 8 6 12l4 4M6 12h9" /></>),
  settings: (<><circle cx="12" cy="12" r="3.1" /><path d="M19.6 14.4a1.6 1.6 0 0 0 .3 1.8l.1.1a1.9 1.9 0 1 1-2.7 2.7l-.1-.1a1.6 1.6 0 0 0-2.7 1.1v.3a1.9 1.9 0 1 1-3.8 0v-.2a1.6 1.6 0 0 0-2.8-1.1l-.1.1a1.9 1.9 0 1 1-2.7-2.7l.1-.1A1.6 1.6 0 0 0 4 14.6h-.3a1.9 1.9 0 1 1 0-3.8h.2A1.6 1.6 0 0 0 5 8l-.1-.1A1.9 1.9 0 1 1 7.6 5.2l.1.1a1.6 1.6 0 0 0 1.8.3h.1a1.6 1.6 0 0 0 1-1.5v-.3a1.9 1.9 0 1 1 3.8 0v.2a1.6 1.6 0 0 0 2.7 1.1l.1-.1a1.9 1.9 0 1 1 2.7 2.7l-.1.1a1.6 1.6 0 0 0-.3 1.8v.1a1.6 1.6 0 0 0 1.5 1h.3a1.9 1.9 0 1 1 0 3.8h-.2a1.6 1.6 0 0 0-1.5 1Z" /></>),
  grid: (<><rect x="3.4" y="3.4" width="7.2" height="7.2" rx="1.6" /><rect x="13.4" y="3.4" width="7.2" height="7.2" rx="1.6" /><rect x="3.4" y="13.4" width="7.2" height="7.2" rx="1.6" /><rect x="13.4" y="13.4" width="7.2" height="7.2" rx="1.6" /></>),
  list: (<><path d="M8.5 6h12M8.5 12h12M8.5 18h12" /><circle cx="4.2" cy="6" r="1.3" /><circle cx="4.2" cy="12" r="1.3" /><circle cx="4.2" cy="18" r="1.3" /></>),
  inbox: (<><path d="M3.4 13.4 6 5.2h12l2.6 8.2v5.4a1.8 1.8 0 0 1-1.8 1.8H5.2a1.8 1.8 0 0 1-1.8-1.8v-5.4Z" /><path d="M3.4 13.4h4.4l1.2 2.6h6l1.2-2.6h4.4" /></>),
  chart: (<><path d="M4 20V9M10 20V4M16 20v-7M22 20H2" /></>),
  eye: (<><path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="3" /></>),
  info: (<><circle cx="12" cy="12" r="9.2" /><path d="M12 11v5.4M12 7.6v.2" /></>),
  fire: (<path d="M12 21.5c3.6 0 6.4-2.4 6.4-5.8 0-4.4-4.2-5.7-3.4-12.2C11.4 5.4 6 8.4 6 13.6c0 1.4.5 2.5 1.2 3.2-.2-1.9.7-3.4 2-4.2-.4 3 1.4 4 2.2 5.3.6 1 .4 2.2-.6 2.8-.7.4-1.6.4-2.4.2.7.4 1.6.6 2.6.6Z" />),
  map: (<><path d="m9 4 6 2.4 5.2-2v14.2L15 20.6 9 18.2l-5.2 2V6L9 4Z" /><path d="M9 4v14.2M15 6.4v14.2" /></>),
  tag: (<><path d="M3.6 11.4V4.4a.8.8 0 0 1 .8-.8h7l9.2 9.2a1.6 1.6 0 0 1 0 2.3l-5.9 5.9a1.6 1.6 0 0 1-2.3 0L3.6 11.4Z" /><circle cx="7.8" cy="7.8" r="1.4" /></>),
  sparkle: (<><path d="M12 3.4 13.8 9l5.6 1.8-5.6 1.8L12 18.2l-1.8-5.6L4.6 10.8 10.2 9 12 3.4Z" /><path d="M18.6 3.4v3M20.1 4.9h-3" /></>),
};

/** Filled glyphs (brand marks) */
const FILLED: Record<string, ReactNode> = {
  whatsapp: (<path d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.74.46 3.44 1.32 4.94L2 22l5.36-1.4a9.86 9.86 0 0 0 4.68 1.19h.01c5.43 0 9.84-4.4 9.84-9.84 0-2.63-1.02-5.1-2.88-6.96A9.77 9.77 0 0 0 12.04 2Zm0 1.8a8.03 8.03 0 0 1 5.68 2.35 7.98 7.98 0 0 1 2.35 5.68c0 4.44-3.6 8.04-8.04 8.04a8.1 8.1 0 0 1-4.1-1.12l-.3-.17-3.05.8.81-2.98-.19-.31a8 8 0 0 1-1.23-4.28c0-4.44 3.62-8.04 8.07-8.04Zm-3.6 3.9c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.02s.87 2.34.99 2.5c.12.16 1.7 2.6 4.13 3.64.58.25 1.03.4 1.38.51.58.19 1.11.16 1.53.1.47-.07 1.43-.58 1.63-1.15.2-.57.2-1.05.14-1.15-.06-.1-.22-.16-.46-.28-.24-.12-1.43-.7-1.65-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.02-.37-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.46-.39-.4-.54-.41h-.46Z" />),
};

export type IconName = keyof typeof P | keyof typeof FILLED;

export function Icon({ name, size = 18, className = '', title }: { name: string; size?: number; className?: string; title?: string }) {
  const filled = FILLED[name];
  return (
    <svg
      className={`ico-svg ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={filled ? 0 : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : 'true'}
      role={title ? 'img' : undefined}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {filled ?? P[name] ?? P.info}
    </svg>
  );
}

/** Category icon mapping used on the homepage / category tiles. */
export const CATEGORY_ICON: Record<string, string> = {
  nunti: 'rings', corporate: 'briefcase', aniversari: 'cake', botezuri: 'dove', cumatrii: 'party',
  conferinte: 'mic', banchete: 'glass', 'aer-liber': 'leaf', 'catering-acasa': 'home',
  'meniu-complet': 'list', 'bufet-suedez': 'grid', 'candy-bar': 'sparkle', 'torturi-deserturi': 'cake',
  'grill-bbq': 'fire', 'bar-cocktail': 'glass', 'servire-personal': 'users', inchirieri: 'tag',
  livrare: 'arrowRight', decor: 'sparkle',
};
