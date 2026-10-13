'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { Icon } from './Icons';

export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState(0);

  if (!images.length) return null;

  const open = (i: number) => {
    setActive(i);
    if (dialogRef.current && !dialogRef.current.open) dialogRef.current.showModal();
  };
  const move = (delta: number) => setActive((i) => (i + delta + images.length) % images.length);

  return (
    <>
      <div className="gallery">
        {images.slice(0, 7).map((src, i) => (
          <figure key={`${src}-${i}`} className={i === 0 ? 'gallery-hero' : undefined} onClick={() => open(i)} role="button" tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); } }}
            aria-label={`${alt} ${i + 1}`}>
            <Image src={src} alt={`${alt} — ${i + 1}`} fill sizes="(min-width: 700px) 25vw, 46vw"
              loading={i === 0 ? 'eager' : 'lazy'} decoding="async" priority={i === 0} />
          </figure>
        ))}
      </div>

      <dialog ref={dialogRef} className="lightbox" aria-label={alt} onClick={(e) => { if (e.target === dialogRef.current) dialogRef.current?.close(); }}>
        <button className="lightbox-close" onClick={() => dialogRef.current?.close()} aria-label="Close">
          <Icon name="x" size={20} />
        </button>
        {images.length > 1 ? (
          <>
            <button className="btn btn-outline" style={{ position: 'absolute', left: 12, top: '50%', background: 'rgba(255,255,255,.9)' }}
              onClick={() => move(-1)} aria-label="Previous"><Icon name="chevronLeft" size={20} /></button>
            <button className="btn btn-outline" style={{ position: 'absolute', right: 12, top: '50%', background: 'rgba(255,255,255,.9)' }}
              onClick={() => move(1)} aria-label="Next"><Icon name="chevronRight" size={20} /></button>
          </>
        ) : null}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images[active]} alt={`${alt} — ${active + 1}`} />
      </dialog>
    </>
  );
}
