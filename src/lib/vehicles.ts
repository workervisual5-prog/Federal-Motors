import { getCollection, type CollectionEntry } from 'astro:content';

export type Vehicle = CollectionEntry<'vehicles'>;

export async function getVehicles() {
  const all = await getCollection('vehicles', ({ data }) => data.published);
  const order = { available: 0, reserved: 1, sold: 2 } as const;
  return all.sort(
    (a, b) =>
      order[a.data.availability] - order[b.data.availability] ||
      b.data.dateAdded.getTime() - a.data.dateAdded.getTime() ||
      a.data.stockReference.localeCompare(b.data.stockReference),
  );
}

export function vehicleTitle(v: Vehicle['data']) {
  return `${v.year} ${v.make} ${v.model}`;
}

export function vehicleFullTitle(v: Vehicle['data']) {
  return [vehicleTitle(v), v.variant].filter(Boolean).join(' ');
}

const pkr = new Intl.NumberFormat('en-PK', { maximumFractionDigits: 0 });

export function formatPrice(v: Vehicle['data']) {
  if (v.priceVisibility === 'call' || v.pricePKR === null) return 'Call for price';
  return `PKR ${pkr.format(v.pricePKR)}`;
}

/** Local shorthand buyers use in Karachi, e.g. "124 lakh" — matches how the showroom quotes prices. */
export function formatPriceShort(v: Vehicle['data']) {
  if (v.priceVisibility === 'call' || v.pricePKR === null) return null;
  return `${+(v.pricePKR / 100_000).toFixed(2)} lakh`;
}

export function formatMileage(km: number | null) {
  return km === null ? null : `${pkr.format(km)} km`;
}

export const availabilityLabel = { available: 'Available', reserved: 'Reserved', sold: 'Sold' } as const;

export const bodyTypeLabel: Record<string, string> = {
  sedan: 'Sedan',
  hatchback: 'Hatchback',
  suv: 'SUV',
  pickup: 'Pickup',
  van: 'Van',
  coupe: 'Coupe',
  other: 'Other',
};

export function capitalise(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function vehicleUrl(v: Vehicle) {
  return `/inventory/${v.id}`;
}

/** Search-panel options built only from real stock. */
export function filterOptions(vehicles: Vehicle[]) {
  const uniq = <T,>(xs: T[]) => [...new Set(xs)].sort();
  const data = vehicles.filter((v) => v.data.availability !== 'sold').map((v) => v.data);
  const priced = data.map((d) => d.pricePKR).filter((p): p is number => p !== null);
  return {
    makes: uniq(data.map((d) => d.make)),
    models: data.map((d) => ({ make: d.make, model: d.model })).filter(
      (m, i, arr) => arr.findIndex((x) => x.make === m.make && x.model === m.model) === i,
    ),
    years: uniq(data.map((d) => d.year)).reverse(),
    conditions: uniq(data.map((d) => d.condition)),
    priceMin: priced.length ? Math.min(...priced) : 0,
    priceMax: priced.length ? Math.max(...priced) : 0,
  };
}
