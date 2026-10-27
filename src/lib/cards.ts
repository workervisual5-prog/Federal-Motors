import { getImage } from 'astro:assets';
import {
  type Vehicle,
  vehicleTitle,
  formatPrice,
  formatPriceShort,
  formatMileage,
  vehicleUrl,
  capitalise,
  bodyTypeLabel,
} from '@/lib/vehicles';

/** Serialisable card data shared by static cards and the inventory filter island. */
export interface CardData {
  id: string;
  url: string;
  stockReference: string;
  make: string;
  model: string;
  title: string;
  variant: string | null;
  year: number;
  condition: 'new' | 'used';
  origin: 'local' | 'imported' | null;
  bodyType: string | null;
  bodyTypeLabel: string | null;
  transmission: string | null;
  fuelType: string | null;
  mileage: string | null;
  pricePKR: number | null;
  price: string;
  priceShort: string | null;
  priceNote: string | null;
  availability: 'available' | 'reserved' | 'sold';
  dateAdded: number;
  image: { src: string; srcset: string; alt: string; focus: string; width: number; height: number };
}

export async function toCardData(v: Vehicle): Promise<CardData> {
  const d = v.data;
  const cover = d.images[0];
  // Crop to the 4:3 card frame at build time so portrait photos don't ship unseen pixels.
  const img = await getImage({ src: cover.src, widths: [360, 540, 720, 900], width: 900, height: 675, fit: 'cover', position: 'centre', format: 'webp', quality: 68 });
  return {
    id: v.id,
    url: vehicleUrl(v),
    stockReference: d.stockReference,
    make: d.make,
    model: d.model,
    title: vehicleTitle(d),
    variant: d.variant,
    year: d.year,
    condition: d.condition,
    origin: d.origin,
    bodyType: d.bodyType,
    bodyTypeLabel: d.bodyType ? bodyTypeLabel[d.bodyType] : null,
    transmission: d.transmission && capitalise(d.transmission),
    fuelType: d.fuelType && capitalise(d.fuelType),
    mileage: formatMileage(d.mileageKm),
    pricePKR: d.priceVisibility === 'show' ? d.pricePKR : null,
    price: formatPrice(d),
    priceShort: formatPriceShort(d),
    priceNote: d.priceNote,
    availability: d.availability,
    dateAdded: d.dateAdded.getTime(),
    image: {
      src: img.src,
      srcset: img.srcSet.attribute,
      alt: cover.alt,
      focus: cover.focus,
      width: 900,
      height: 675,
    },
  };
}
