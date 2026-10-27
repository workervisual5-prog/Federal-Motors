import { useCallback, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface GalleryImage {
  src: string;
  srcset: string;
  thumb: string;
  alt: string;
  width: number;
  height: number;
}

export default function Gallery({ images, title }: { images: GalleryImage[]; title: string }) {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const reduce = useReducedMotion();
  const touchX = useRef<number | null>(null);
  const n = images.length;

  const go = useCallback(
    (next: number) => {
      setDir(next > i ? 1 : -1);
      setI((next + n) % n);
    },
    [i, n],
  );

  const img = images[i];
  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={`${title} photos`}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(i + 1);
        if (e.key === 'ArrowLeft') go(i - 1);
      }}
    >
      <div
        className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] border border-line bg-[radial-gradient(ellipse_at_center,#131c2e,#070b13)]"
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 40) go(dx < 0 ? i + 1 : i - 1);
          touchX.current = null;
        }}
      >
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.img
            key={img.src}
            src={img.src}
            srcSet={img.srcset}
            sizes="(min-width: 1024px) 720px, 100vw"
            alt={img.alt}
            width={img.width}
            height={img.height}
            loading={i === 0 ? 'eager' : 'lazy'}
            fetchPriority={i === 0 ? 'high' : undefined}
            decoding="async"
            className="absolute inset-0 size-full object-contain"
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: dir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: dir * -40 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          />
        </AnimatePresence>
        {n > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(i - 1)}
              className="absolute left-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-ink/75 text-text backdrop-blur transition-colors hover:bg-gold hover:text-ink"
              aria-label="Previous photo"
            >
              <ChevronLeft size={22} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => go(i + 1)}
              className="absolute right-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-ink/75 text-text backdrop-blur transition-colors hover:bg-gold hover:text-ink"
              aria-label="Next photo"
            >
              <ChevronRight size={22} aria-hidden="true" />
            </button>
            <p className="absolute bottom-3 right-3 rounded-full bg-ink/75 px-3 py-1 text-xs font-semibold text-muted backdrop-blur" aria-live="polite">
              {i + 1} / {n}
            </p>
          </>
        )}
      </div>

      {n > 1 && (
        <ul className="mt-3 grid grid-cols-5 gap-2 sm:gap-3">
          {images.map((t, k) => (
            <li key={t.src}>
              <button
                type="button"
                onClick={() => go(k)}
                aria-label={`Show photo ${k + 1}: ${t.alt}`}
                aria-current={k === i ? 'true' : undefined}
                className="block aspect-[4/3] w-full overflow-hidden rounded-lg border-2 border-transparent opacity-60 transition-[opacity,border-color] hover:opacity-100 aria-[current=true]:border-gold aria-[current=true]:opacity-100"
              >
                <img src={t.thumb} alt="" width={160} height={120} loading="lazy" decoding="async" className="size-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
