import { business } from '@/data/business';
import type { Vehicle } from '@/lib/vehicles';
import { vehicleFullTitle } from '@/lib/vehicles';

// Schema.org AutoDealer. Only verified attributes — no ratings, reviews or price ranges.
export function autoDealerSchema(site: URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    '@id': new URL('/#dealer', site).href,
    name: business.name,
    description: business.description,
    url: site.href,
    logo: new URL('/icon-512.png', site).href,
    image: new URL('/icon-512.png', site).href,
    telephone: business.phones[0].e164,
    email: business.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${business.address.street}, ${business.address.landmark}`,
      addressLocality: business.address.city,
      addressRegion: business.address.region,
      addressCountry: business.address.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: business.geo.lat, longitude: business.geo.lng },
    hasMap: business.mapsUrl,
    openingHoursSpecification: business.hours.schema.map((h) => ({ '@type': 'OpeningHoursSpecification', ...h })),
    founder: business.owners.map((name) => ({ '@type': 'Person', name })),
    sameAs: [business.instagram],
    areaServed: { '@type': 'City', name: 'Karachi' },
    currenciesAccepted: 'PKR',
  };
}


const fuelSchema: Record<string, string> = {
  petrol: 'Gasoline',
  diesel: 'Diesel',
  hybrid: 'Hybrid',
  'plug-in hybrid': 'Plug-in hybrid',
  electric: 'Electric',
};

/** Schema.org Car. An Offer is included only for a published price on an unsold vehicle. */
export function vehicleSchema(site: URL, v: Vehicle, url: string, imageUrls: string[]) {
  const d = v.data;
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: vehicleFullTitle(d),
    url,
    sku: d.stockReference,
    brand: { '@type': 'Brand', name: d.make },
    model: d.model,
    vehicleModelDate: String(d.year),
    itemCondition: d.condition === 'new' ? 'https://schema.org/NewCondition' : 'https://schema.org/UsedCondition',
    image: imageUrls,
    description: d.description,
  };
  if (d.variant) schema.vehicleConfiguration = d.variant;
  if (d.mileageKm !== null) schema.mileageFromOdometer = { '@type': 'QuantitativeValue', value: d.mileageKm, unitCode: 'KMT' };
  if (d.transmission) schema.vehicleTransmission = d.transmission === 'automatic' ? 'Automatic' : 'Manual';
  if (d.fuelType) schema.fuelType = fuelSchema[d.fuelType];
  if (d.exteriorColour) schema.color = d.exteriorColour;
  if (d.bodyType) schema.bodyType = d.bodyType;
  if (d.engineCC) schema.vehicleEngine = { '@type': 'EngineSpecification', engineDisplacement: { '@type': 'QuantitativeValue', value: d.engineCC, unitCode: 'CMQ' } };
  if (d.priceVisibility === 'show' && d.pricePKR !== null && d.availability !== 'sold') {
    schema.offers = {
      '@type': 'Offer',
      price: d.pricePKR,
      priceCurrency: 'PKR',
      availability: d.availability === 'reserved' ? 'https://schema.org/LimitedAvailability' : 'https://schema.org/InStock',
      itemCondition: schema.itemCondition,
      url,
      seller: { '@id': new URL('/#dealer', site).href },
    };
  }
  return schema;
}
