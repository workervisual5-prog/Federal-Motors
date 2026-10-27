import { Gauge, Calendar, Fuel, Cog, ArrowUpRight } from 'lucide-react';
import type { CardData } from '@/lib/cards';

const statusDot = { available: 'bg-ok', reserved: 'bg-warn', sold: 'bg-sold' } as const;
const statusLabel = { available: 'Available', reserved: 'Reserved', sold: 'Sold' } as const;

interface Props {
  v: CardData;
  eager?: boolean;
  /** Marks the likely LCP image. */
  priority?: boolean;
  /** Adds the scroll-reveal hook used by static pages. */
  reveal?: boolean;
  delay?: number;
  headingLevel?: 'h2' | 'h3';
}

export default function VehicleCard({ v, eager = false, priority = false, reveal = false, delay = 0, headingLevel = 'h3' }: Props) {
  const Heading = headingLevel;
  const specs = [
    { icon: Calendar, label: 'Model year', value: String(v.year) },
    { icon: Gauge, label: 'Mileage', value: v.mileage },
    { icon: Cog, label: 'Transmission', value: v.transmission },
    { icon: Fuel, label: 'Fuel', value: v.fuelType },
  ].filter((s) => s.value);
  const sold = v.availability === 'sold';

  return (
    <article
      {...(reveal ? { 'data-reveal': '' } : {})}
      style={{ ['--delay' as string]: `${delay}ms` }}
      className="card group relative flex h-full flex-col overflow-hidden transition-[transform,box-shadow,border-color] duration-300 ease-[var(--ease-out)] hover:-translate-y-1 hover:border-line-strong hover:shadow-[var(--shadow-lift)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-raised">
        <img
          src={v.image.src}
          srcSet={v.image.srcset}
          sizes="(min-width: 1280px) 300px, (min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
          alt={v.image.alt}
          width={v.image.width}
          height={v.image.height}
          loading={eager || priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : undefined}
          decoding="async"
          className={`size-full object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.04] ${sold ? 'grayscale-[60%]' : ''}`}
          style={{ objectPosition: v.image.focus }}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-surface/80 to-transparent" />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-ink/80 px-2.5 py-1 text-xs font-bold text-text backdrop-blur">
          <span className={`size-1.5 rounded-full ${statusDot[v.availability]}`} aria-hidden="true" />
          {statusLabel[v.availability]}
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-ink/70 px-2.5 py-1 text-xs font-semibold text-muted backdrop-blur">
          {v.stockReference}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">{v.make}</p>
        <Heading className="mt-1.5 text-lg font-bold">
          <a href={v.url} className="after:absolute after:inset-0 focus-visible:outline-none">
            {v.title}
          </a>
        </Heading>
        {v.variant && <p className="mt-1 text-sm text-muted">{v.variant}</p>}

        <ul className="mb-5 mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted">
          {specs.map(({ icon: Icon, label, value }) => (
            <li key={label} className="inline-flex items-center gap-1.5">
              <Icon size={15} className="text-subtle" aria-hidden="true" />
              <span className="sr-only">{label}:</span>
              {value}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-x-4 gap-y-2 border-t border-line pt-4">
          <div>
            <p className={`whitespace-nowrap text-lg font-bold ${sold ? 'text-muted' : 'text-text'}`}>
              {sold ? 'Sold' : v.price}
            </p>
            {!sold && v.priceShort && (
              <p className="text-xs text-subtle">
                {v.priceShort}
                {v.priceNote && ` · ${v.priceNote}`}
              </p>
            )}
          </div>
          <span className="inline-flex items-center gap-1 whitespace-nowrap text-sm font-semibold text-gold transition-colors group-hover:text-gold-hi" aria-hidden="true">
            View details
            <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </article>
  );
}
