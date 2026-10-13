import { Icon } from './Icons';

export function Stars({ value, count, size = 15 }: { value: number; count?: number; size?: number }) {
  const v = Math.max(0, Math.min(5, Math.round(value * 2) / 2));
  return (
    <span className="stars" role="img" aria-label={`${v.toFixed(1).replace('.', ',')} din 5`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = v >= i ? 1 : v >= i - 0.5 ? 0.5 : 0;
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <defs>
              <linearGradient id={`st${i}-${Math.round(v * 10)}`}>
                <stop offset={`${fill * 100}%`} stopColor="currentColor" />
                <stop offset={`${fill * 100}%`} stopColor="transparent" />
              </linearGradient>
            </defs>
            <path
              d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.5l6.1-.9Z"
              fill={`url(#st${i}-${Math.round(v * 10)})`}
              stroke="currentColor"
              strokeWidth={fill === 1 ? 0 : 1.4}
            />
          </svg>
        );
      })}
      {count !== undefined && count > 0 ? <span className="stars-num">{count}</span> : null}
    </span>
  );
}

export function VerifiedBadge({ label }: { label: string }) {
  return (
    <span className="badge badge-ok">
      <Icon name="shield" size={12} /> {label}
    </span>
  );
}
