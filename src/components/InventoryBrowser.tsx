import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Search, SlidersHorizontal, RotateCcw, X } from 'lucide-react';
import VehicleCard from './VehicleCard';
import type { CardData } from '@/lib/cards';
import { track } from '@/scripts/analytics';

interface Props {
  cards: CardData[];
  sourcingUrl: string;
}

type Filters = {
  q: string;
  make: string;
  model: string;
  min: string;
  max: string;
  year: string;
  transmission: string;
  condition: string;
  origin: string;
  body: string;
  status: string;
  sort: string;
};

const EMPTY: Filters = {
  q: '',
  make: '',
  model: '',
  min: '',
  max: '',
  year: '',
  transmission: '',
  condition: '',
  origin: '',
  body: '',
  status: 'in-stock',
  sort: 'recent',
};

const SORTS = [
  { value: 'recent', label: 'Recently added' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'year-desc', label: 'Model year: newest' },
  { value: 'year-asc', label: 'Model year: oldest' },
];

const STATUSES = [
  { value: 'in-stock', label: 'In stock' },
  { value: 'available', label: 'Available' },
  { value: 'reserved', label: 'Reserved' },
  { value: 'sold', label: 'Sold' },
  { value: 'all', label: 'All vehicles' },
];

const STEP = 2_500_000;
const lakh = (p: number) => `${p / 100_000} lakh`;
const uniq = <T,>(xs: (T | null)[]) => [...new Set(xs.filter((x): x is T => x !== null && x !== ''))].sort();

function readUrl(): Filters {
  const p = new URLSearchParams(window.location.search);
  const f = { ...EMPTY };
  for (const k of Object.keys(EMPTY) as (keyof Filters)[]) {
    const v = p.get(k);
    if (v !== null) f[k] = v;
  }
  return f;
}

function writeUrl(f: Filters) {
  const p = new URLSearchParams();
  for (const k of Object.keys(EMPTY) as (keyof Filters)[]) if (f[k] && f[k] !== EMPTY[k]) p.set(k, f[k]);
  const qs = p.toString();
  history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname);
}

export default function InventoryBrowser({ cards, sourcingUrl }: Props) {
  const [f, setF] = useState<Filters>(EMPTY);
  const [panelOpen, setPanelOpen] = useState(false);
  const reduce = useReducedMotion();
  const hydrated = useRef(false);
  const interacted = useRef(false);

  useEffect(() => {
    setF(readUrl());
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    writeUrl(f);
    if (!interacted.current) return;
    const t = setTimeout(() => {
      const term = [f.q, f.make, f.model, f.year, f.condition, f.body].filter(Boolean).join(' ');
      track('search', { search_term: term || 'all', source: 'inventory_filters' });
    }, 1200);
    return () => clearTimeout(t);
  }, [f]);

  const set = (k: keyof Filters, v: string) => {
    interacted.current = true;
    setF((prev) => {
      const next = { ...prev, [k]: v };
      if (k === 'make' && prev.model && !cards.some((c) => c.make === v && c.model === prev.model)) next.model = '';
      return next;
    });
  };

  const opts = useMemo(() => {
    const priced = cards.map((c) => c.pricePKR).filter((p): p is number => p !== null);
    const lo = priced.length ? Math.floor(Math.min(...priced) / STEP) * STEP : 0;
    const hi = priced.length ? Math.ceil(Math.max(...priced) / STEP) * STEP : 0;
    const steps: number[] = [];
    for (let p = lo; p <= hi && priced.length; p += STEP) steps.push(p);
    return {
      makes: uniq(cards.map((c) => c.make)),
      models: uniq(cards.filter((c) => !f.make || c.make === f.make).map((c) => c.model)),
      years: uniq(cards.map((c) => c.year)).reverse(),
      transmissions: uniq(cards.map((c) => c.transmission)),
      conditions: uniq(cards.map((c) => c.condition)),
      origins: uniq(cards.map((c) => c.origin)),
      bodies: [...new Map(cards.filter((c) => c.bodyType).map((c) => [c.bodyType!, c.bodyTypeLabel!])).entries()].sort(),
      steps,
    };
  }, [cards, f.make]);

  const results = useMemo(() => {
    const q = f.q.trim().toLowerCase();
    const min = f.min ? Number(f.min) : null;
    const max = f.max ? Number(f.max) : null;
    const list = cards.filter((c) => {
      if (f.status === 'in-stock' && c.availability === 'sold') return false;
      if (!['in-stock', 'all'].includes(f.status) && c.availability !== f.status) return false;
      if (q && ![c.title, c.variant, c.stockReference, c.bodyTypeLabel].join(' ').toLowerCase().includes(q)) return false;
      if (f.make && c.make !== f.make) return false;
      if (f.model && c.model !== f.model) return false;
      if (f.year && String(c.year) !== f.year) return false;
      if (f.transmission && c.transmission !== f.transmission) return false;
      if (f.condition && c.condition !== f.condition) return false;
      if (f.origin && c.origin !== f.origin) return false;
      if (f.body && c.bodyType !== f.body) return false;
      // "Call for price" vehicles are kept out only when a price range is set.
      if ((min !== null || max !== null) && c.pricePKR === null) return false;
      if (min !== null && c.pricePKR! < min) return false;
      if (max !== null && c.pricePKR! > max) return false;
      return true;
    });
    const price = (c: CardData, dir: 1 | -1) => (c.pricePKR === null ? Infinity : c.pricePKR * dir);
    const sorters: Record<string, (a: CardData, b: CardData) => number> = {
      recent: (a, b) => b.dateAdded - a.dateAdded || a.stockReference.localeCompare(b.stockReference),
      'price-asc': (a, b) => price(a, 1) - price(b, 1),
      'price-desc': (a, b) => price(a, -1) - price(b, -1),
      'year-desc': (a, b) => b.year - a.year,
      'year-asc': (a, b) => a.year - b.year,
    };
    return [...list].sort(sorters[f.sort] ?? sorters.recent);
  }, [cards, f]);

  const activeCount = (Object.keys(EMPTY) as (keyof Filters)[]).filter(
    (k) => k !== 'sort' && k !== 'q' && f[k] !== EMPTY[k],
  ).length;
  const reset = () => {
    interacted.current = true;
    setF({ ...EMPTY, sort: f.sort });
  };

  const select = (p: string, k: keyof Filters, label: string, options: { value: string; label: string }[], anyLabel: string) => (
    <div>
      <label htmlFor={`${p}-${k}`} className="field-label">
        {label}
      </label>
      <select id={`${p}-${k}`} className="field" value={f[k]} onChange={(e) => set(k, e.target.value)}>
        {anyLabel && <option value="">{anyLabel}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );

  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  const renderFilters = (p: string) => (
    <div className="grid gap-4">
      {select(p, 'status', 'Availability', STATUSES, '')}
      {select(p, 'make', 'Make', opts.makes.map((m) => ({ value: m, label: m })), 'Any make')}
      {select(p, 'model', 'Model', opts.models.map((m) => ({ value: m, label: m })), 'Any model')}
      <div className="grid grid-cols-2 gap-3">
        {select(p, 'min', 'Min price', opts.steps.slice(0, -1).map((p) => ({ value: String(p), label: lakh(p) })), 'No min')}
        {select(p, 'max', 'Max price', opts.steps.slice(1).map((p) => ({ value: String(p), label: lakh(p) })), 'No max')}
      </div>
      {select(p, 'year', 'Model year', opts.years.map((y) => ({ value: String(y), label: String(y) })), 'Any year')}
      {opts.bodies.length > 1 && select(p, 'body', 'Body type', opts.bodies.map(([value, label]) => ({ value, label })), 'Any body type')}
      {opts.conditions.length > 0 && select(p, 'condition', 'Condition', opts.conditions.map((c) => ({ value: c, label: cap(c) })), 'Any condition')}
      {opts.origins.length > 0 && select(p, 'origin', 'Origin', opts.origins.map((o) => ({ value: o, label: o === 'local' ? 'Local' : 'Imported' })), 'Any origin')}
      {opts.transmissions.length > 0 && select(p, 'transmission', 'Transmission', opts.transmissions.map((t) => ({ value: t, label: t })), 'Any transmission')}
      <button type="button" onClick={reset} className="btn btn-secondary mt-1" disabled={activeCount === 0}>
        <RotateCcw size={16} aria-hidden="true" /> Reset filters
      </button>
    </div>
  );

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[17rem_1fr] lg:gap-10">
      {/* Desktop sidebar */}
      <aside aria-label="Filters" className="hidden lg:block">
        <div className="card sticky top-24 p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em]">
            <SlidersHorizontal size={16} className="text-gold" aria-hidden="true" /> Filters
          </h2>
          {renderFilters('fd')}
        </div>
      </aside>

      <div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="relative flex-1">
            <label htmlFor="f-q" className="field-label">
              Search by name or stock reference
            </label>
            <Search size={18} className="pointer-events-none absolute bottom-3.5 left-3.5 text-subtle" aria-hidden="true" />
            <input
              id="f-q"
              type="search"
              className="field pl-10"
              placeholder="e.g. Revo, Tiggo, FM-003"
              value={f.q}
              onChange={(e) => set('q', e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className="grid grid-cols-[1fr_auto] gap-3 sm:w-auto">
            <div>
              <label htmlFor="f-sort" className="field-label">
                Sort by
              </label>
              <select id="f-sort" className="field" value={f.sort} onChange={(e) => set('sort', e.target.value)}>
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              className="btn btn-secondary self-end lg:hidden"
              aria-expanded={panelOpen}
              aria-controls="mobile-filters"
              onClick={() => setPanelOpen((o) => !o)}
            >
              <SlidersHorizontal size={18} aria-hidden="true" />
              Filters{activeCount > 0 && <span className="rounded-full bg-gold px-1.5 text-xs text-ink">{activeCount}</span>}
            </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {panelOpen && (
            <motion.div
              id="mobile-filters"
              key="mobile-filters"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="card mt-4 p-5 lg:hidden"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-[0.16em]">Filters</h2>
                <button type="button" onClick={() => setPanelOpen(false)} className="grid size-10 place-items-center rounded-lg hover:bg-raised" aria-label="Close filters">
                  <X size={20} aria-hidden="true" />
                </button>
              </div>
              {renderFilters('fm')}
            </motion.div>
          )}
        </AnimatePresence>

        <p className="mt-6 text-sm text-muted" role="status" aria-live="polite">
          <span className="font-bold text-text">{results.length}</span> {results.length === 1 ? 'vehicle' : 'vehicles'} found
        </p>

        {results.length > 0 ? (
          <motion.ul layout={!reduce} className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout" initial={false}>
              {results.map((c, i) => (
                <motion.li
                  key={c.id}
                  layout={!reduce}
                  initial={reduce ? false : { opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                  <VehicleCard v={c} eager={i < 3} priority={i === 0} headingLevel="h2" />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        ) : (
          <div className="card mt-5 flex flex-col items-start gap-4 p-8 sm:p-10">
            <h2 className="text-2xl font-bold">No vehicles match these filters</h2>
            <p className="max-w-lg text-muted">
              Try widening the price range or clearing a filter. If you have a specific car in mind, we can source it for you.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={reset} className="btn btn-primary">
                <RotateCcw size={16} aria-hidden="true" /> Clear filters
              </button>
              <a href={sourcingUrl} target="_blank" rel="noopener" className="btn btn-secondary" data-track="whatsapp_click" data-track-source="inventory_empty">
                Ask us to source it
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
