import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One JSON file per vehicle in src/content/vehicles/. The filename is the URL slug.
// Unknown facts must be null — never guessed. See docs/INVENTORY.md.
const vehicles = defineCollection({
  loader: glob({ base: './src/content/vehicles', pattern: '*.json' }),
  schema: ({ image }) =>
    z
      .object({
        stockReference: z.string().regex(/^FM-\d{3,}$/),
        make: z.string().min(1),
        model: z.string().min(1),
        variant: z.string().nullable(),
        year: z.number().int().min(1950).max(2100),
        yearNote: z.string().nullable().default(null),
        registrationYear: z.number().int().nullable(),
        registrationNote: z.string().nullable().default(null),
        registrationCity: z.string().nullable(),
        condition: z.enum(['new', 'used']),
        origin: z.enum(['local', 'imported']).nullable(),
        bodyType: z.enum(['sedan', 'hatchback', 'suv', 'pickup', 'van', 'coupe', 'other']).nullable(),
        pricePKR: z.number().int().positive().nullable(),
        priceVisibility: z.enum(['show', 'call']),
        priceNote: z.string().nullable().default(null),
        mileageKm: z.number().int().nonnegative().nullable(),
        transmission: z.enum(['automatic', 'manual']).nullable(),
        fuelType: z.enum(['petrol', 'diesel', 'hybrid', 'plug-in hybrid', 'electric']).nullable(),
        engineCC: z.number().int().positive().nullable(),
        exteriorColour: z.string().nullable(),
        owners: z.string().nullable().default(null),
        auctionGrade: z.string().nullable().default(null),
        availability: z.enum(['available', 'reserved', 'sold']),
        highlights: z.array(z.string()).default([]),
        documentation: z.array(z.string()).default([]),
        disclosures: z.array(z.string()).default([]),
        description: z.string().min(40),
        images: z
          .array(
            z.object({
              src: image(),
              alt: z.string().min(10),
              view: z.string(),
              focus: z.string().default('50% 55%'),
            }),
          )
          .min(1),
        featured: z.boolean().default(false),
        published: z.boolean().default(true),
        dateAdded: z.coerce.date(),
        lastUpdated: z.coerce.date(),
        // Internal checklist; never rendered on the public site.
        pendingConfirmation: z.array(z.string()).default([]),
      })
      .refine((v) => v.priceVisibility === 'call' || v.pricePKR !== null, {
        message: 'priceVisibility "show" requires pricePKR',
      }),
});

export const collections = { vehicles };
