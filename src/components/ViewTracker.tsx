'use client';

import { useEffect } from 'react';

/** Counts one profile view per browser session. Fire-and-forget, never blocks render. */
export function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    try {
      const key = `cm:viewed:${slug}`;
      if (window.sessionStorage.getItem(key)) return;
      window.sessionStorage.setItem(key, '1');
      fetch('/api/view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
        keepalive: true,
      }).catch(() => {});
    } catch {
      /* storage disabled — ignore */
    }
  }, [slug]);

  return null;
}
