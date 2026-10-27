// Single source of truth for business details (NAP must stay identical everywhere for local SEO).
// Anything not yet confirmed by Federal Motors is kept out of the rendered copy.

export const business = {
  name: 'Federal Motors',
  tagline: 'Your trusted car partner in Karachi',
  description:
    'Owner-led car showroom in PECHS, Karachi offering new, used and imported vehicles with financing, exchange, consignment, inspection and documentation assistance.',
  owners: ['Zain Ahmed', 'Ali Osama'],
  experienceYears: 5,
  address: {
    street: 'Plot No. 34/A, 1st Floor, Main Shahrah-e-Quaideen, Block 2, PECHS',
    landmark: 'Near Tariq Road',
    city: 'Karachi',
    region: 'Sindh',
    country: 'PK',
    countryName: 'Pakistan',
  },
  // Google Business Profile listing ("Share profile" link) and its permanent CID form.
  mapsUrl: 'https://maps.app.goo.gl/iykk3DNTyjrUhYkL7',
  mapsCidUrl: 'https://maps.google.com/?cid=6426781252052442860',
  // Directions to the listing (place ID keeps the business name in Google Maps).
  directionsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=Federal+Motors+PECHS+Karachi&destination_place_id=ChIJpRg_kFY_sz4R7N65iX-DMFk',
  geo: { lat: 24.8653787, lng: 67.0544209 },
  // Internal Google identifiers (not shown on the site): Business Profile ID and store code.
  googleBusinessProfileId: '15801088510167343850',
  instagram: 'https://www.instagram.com/federalmotors110/',
  email: 'zaeymanofficial@gmail.com',
  phones: [
    { display: '0313-2963858', e164: '+923132963858' },
    { display: '0332-2848766', e164: '+923322848766' },
    { display: '0322-7382525', e164: '+923227382525' },
  ],
  whatsapp: { display: '+92 313 2963858', number: '923132963858' },
  hours: {
    summary: 'Mon–Sat, 12 PM – 9 PM',
    rows: [
      { days: 'Monday – Saturday', time: '12:00 PM – 9:00 PM' },
      { days: 'Sunday', time: 'Closed' },
    ],
    schema: [
      {
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '12:00',
        closes: '21:00',
      },
    ],
  },
} as const;

export const fullAddress = `${business.address.street}, ${business.address.landmark}, ${business.address.city}, ${business.address.countryName}`;

export const primaryPhone = business.phones[0];

export const nav = [
  { label: 'Home', href: '/' },
  { label: 'Inventory', href: '/inventory' },
  { label: 'Financing', href: '/financing' },
  { label: 'Services', href: '/services' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const;
