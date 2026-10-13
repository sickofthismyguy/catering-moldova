import { t } from '@/lib/i18n';
import type { Lang } from '@/lib/types';

/**
 * Free map: OpenStreetMap embed (no API key, no cost, no tracking).
 * Loaded lazily so it never hurts Core Web Vitals.
 */
export function MapEmbed({ lat, lng, lang, label }: { lat: number; lng: number; lang: Lang; label: string }) {
  const d = 0.02;
  const bbox = [lng - d, lat - d * 0.6, lng + d, lat + d * 0.6].join('%2C');
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
  return (
    <div className="map-frame">
      <iframe
        src={src}
        title={`${t(lang, 'firm_map')}: ${label}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        sandbox="allow-scripts allow-same-origin allow-popups"
      />
    </div>
  );
}

export function MapLink({ lat, lng }: { lat: number; lng: number }) {
  return (
    <a href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=15/${lat}/${lng}`} target="_blank" rel="noopener noreferrer nofollow">
      OpenStreetMap
    </a>
  );
}
