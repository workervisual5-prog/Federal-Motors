# Image manifest

Every vehicle photo on the site is a real photo supplied by Federal Motors. Nothing has been generated or redrawn.

- **Originals (untouched backups):** `originals/<vehicle-slug>/`
- **Processed masters used by the site:** `src/assets/vehicles/<vehicle-slug>/` (JPEG, max 1800px)
- **Published files:** generated at build time by Astro as responsive WebP (cards 360–900px cropped to 4:3, galleries 480–1400px uncropped, thumbnails 160×120)
- **Processing script:** `scripts/process-images.py`

## Edits applied to every photo (non-generative)

1. Partial grey-world white balance (35% strength) to even out colour casts between phones and locations
2. Auto-levels with 0.4% clipping, tones preserved
3. +5% contrast, +3% saturation, a subtle shared grade (cooler shadows, warmer highlights)
4. Light unsharp mask after resizing

**Not changed:** paint colour, panels, wheels, badges, lights, trim, modifications, damage or condition.

## Photos

| Stock ref | File | Original upload | View | Size | Role on site | Notes |
|---|---|---|---|---|---|---|
| FM-002 | `chery-tiggo-9-pro-phev-2026-dashboard.jpg` | Cherry Tiggo 9 Pro AWD Plugin Hybrid 5.jpeg | dashboard | 1280×960 | Gallery #5 | Standard grade only |
| FM-002 | `chery-tiggo-9-pro-phev-2026-front.jpg` | Cherry Tiggo 9 Pro AWD Plugin Hybrid 1.jpeg | front | 1200×1600 | Cover / thumbnail | Number plate pixelated |
| FM-002 | `chery-tiggo-9-pro-phev-2026-interior.jpg` | Cherry Tiggo 9 Pro AWD Plugin Hybrid 4.jpeg | interior | 1280×960 | Gallery #4 | Standard grade only |
| FM-002 | `chery-tiggo-9-pro-phev-2026-rear-three-quarter.jpg` | Cherry Tiggo 9 Pro AWD Plugin Hybrid 3.jpeg | rear-three-quarter | 960×1280 | Gallery #2 | Third-party 'G Mohiudin' window decal pixelated |
| FM-002 | `chery-tiggo-9-pro-phev-2026-rear.jpg` | Cherry Tiggo 9 Pro AWD Plugin Hybrid 2.jpeg | rear | 960×1280 | Gallery #3 | Third-party 'G Mohiudin' window decal and number plate pixelated |
| FM-003 | `daihatsu-mira-l-sa-iii-2023-front.jpg` | Daihatsu Mira LSA lll 2.jpeg | front | 960×1280 | Gallery #2 | Marker writing on windscreen left as-is |
| FM-003 | `daihatsu-mira-l-sa-iii-2023-interior.jpg` | Daihatsu Mira LSA lll 1.jpeg | interior | 1280×960 | Gallery #5 | Standard grade only |
| FM-003 | `daihatsu-mira-l-sa-iii-2023-rear.jpg` | Daihatsu Mira LSA lll 3.jpeg | rear | 960×1280 | Gallery #3 | Standard grade only |
| FM-003 | `daihatsu-mira-l-sa-iii-2023-side-left.jpg` | Daihatsu Mira LSA lll 4.jpeg | side-left | 1280×960 | Cover / thumbnail | Standard grade only |
| FM-003 | `daihatsu-mira-l-sa-iii-2023-side-right.jpg` | Daihatsu Mira LSA lll 5.jpeg | side-right | 1280×960 | Gallery #4 | Standard grade only |
| FM-005 | `mercedes-benz-c63-amg-2008-dashboard.png` | Mercerdese AMG C63 2.png | dashboard | 1080×1350 | Gallery #4 | Odometer reads 89,715 km — conflicts with listed 80k |
| FM-005 | `mercedes-benz-c63-amg-2008-engine-bay.png` | Mercerdese AMG C63 3.png | engine-bay | 1080×1350 | Gallery #5 | Standard grade only |
| FM-005 | `mercedes-benz-c63-amg-2008-front-three-quarter-left.png` | =Mercerdese AMG C63 5.png | front-three-quarter-left | 1080×1350 | Gallery #2 | Exposure +12% (dim garage). Paint chips on bumper left visible |
| FM-005 | `mercedes-benz-c63-amg-2008-front-three-quarter-right.png` | Mercerdese AMG C63 4.png | front-three-quarter-right | 1080×1350 | Cover / thumbnail | Exposure +12% (dim garage) |
| FM-005 | `mercedes-benz-c63-amg-2008-rear-three-quarter.png` | Mercerdese AMG C63 1.png | rear-three-quarter | 1080×1350 | Gallery #3 | Exposure +12% (dim garage) |
| FM-001 | `toyota-hilux-revo-v-2022-front.jpg` | Toyota Hilux Revo V 2.8.jpeg | front | 960×1280 | Cover / thumbnail | Standard grade only |
| FM-004 | `toyota-hilux-vigo-3-0d-2012-dashboard.jpg` | Toyota Hilux Vigo Thailand 3.0D 2.jpeg | dashboard | 1280×960 | Gallery #5 | Aftermarket wood-grain trim and head unit left as-is (disclosed) |
| FM-004 | `toyota-hilux-vigo-3-0d-2012-front-three-quarter.jpg` | Toyota Hilux Vigo Thailand 3.0D 4.jpeg | front-three-quarter | 960×1280 | Cover / thumbnail | Standard grade only |
| FM-004 | `toyota-hilux-vigo-3-0d-2012-front.jpg` | Toyota Hilux Vigo Thailand 3.0D 3.jpeg | front | 960×1280 | Gallery #3 | Standard grade only |
| FM-004 | `toyota-hilux-vigo-3-0d-2012-rear.jpg` | Toyota Hilux Vigo Thailand 3.0D 1.jpeg | rear | 960×1280 | Gallery #4 | Standard grade only |
| FM-004 | `toyota-hilux-vigo-3-0d-2012-side.jpg` | Toyota Hilux Vigo Thailand 3.0D 5.jpeg | side | 1280×960 | Gallery #2 | Standard grade only |
| FM-006 | `toyota-hilux-revo-v-2021-front-three-quarter.png` | Toyota Hilux Revo V 2.8 ii 1.png | front-three-quarter | 1800×1400 | Cover / thumbnail | Standard grade only |
| FM-006 | `toyota-hilux-revo-v-2021-front.png` | Toyota Hilux Revo V 2.8 ii 5.png | front | 1800×1400 | Gallery #2 | Number plate pixelated |
| FM-006 | `toyota-hilux-revo-v-2021-rear.png` | Toyota Hilux Revo V 2.8 ii 2.png | rear | 1800×1400 | Gallery #3 | Number plate pixelated |
| FM-006 | `toyota-hilux-revo-v-2021-dashboard.png` | Toyota Hilux Revo V 2.8 ii 3.png | dashboard | 1800×1400 | Gallery #4 | Standard grade only |
| FM-006 | `toyota-hilux-revo-v-2021-engine-bay.png` | Toyota Hilux Revo V 2.8 ii 4.png | engine-bay | 1800×1400 | Gallery #5 | Standard grade only |
| FM-007 | `honda-civic-oriel-ug-1-8-2018-front-three-quarter.png` | Honda Civic Oriel UG 1.8 3.png | front-three-quarter | 1800×1400 | Cover / thumbnail | Standard grade only |
| FM-007 | `honda-civic-oriel-ug-1-8-2018-front.png` | Honda Civic Oriel UG 1.8 1.png | front | 1800×1400 | Gallery #2 | Number plate pixelated |
| FM-007 | `honda-civic-oriel-ug-1-8-2018-rear.png` | Honda Civic Oriel UG 1.8 2.png | rear | 1800×1400 | Gallery #3 | Number plate pixelated |
| FM-007 | `honda-civic-oriel-ug-1-8-2018-dashboard.png` | Honda Civic Oriel UG 1.8 5.png | dashboard | 1800×1400 | Gallery #4 | Standard grade only |
| FM-007 | `honda-civic-oriel-ug-1-8-2018-engine-bay.png` | Honda Civic Oriel UG 1.8 4.png | engine-bay | 1800×1400 | Gallery #5 | Instagram carousel arrow visible at left edge (from source), left as-is |
| FM-008 | `toyota-corolla-xli-1-3-2014-front-three-quarter-left.jpg` | Toyota Corolla XLI 1.3 Manual  2.jpeg | front-three-quarter-left | 1280×960 | Cover / thumbnail | Night shot; standard grade |
| FM-008 | `toyota-corolla-xli-1-3-2014-front.jpg` | Toyota Corolla XLI 1.3 Manual 1.jpeg | front | 960×1280 | Gallery #2 | Number plate pixelated |
| FM-008 | `toyota-corolla-xli-1-3-2014-front-three-quarter-right.jpg` | Toyota Corolla XLI 1.3 Manual  3.jpeg | front-three-quarter-right | 1280×960 | Gallery #3 | Night shot; standard grade |
| FM-008 | `toyota-corolla-xli-1-3-2014-rear-three-quarter.jpg` | Toyota Corolla XLI 1.3 Manual  5.jpeg | rear-three-quarter | 1280×960 | Gallery #4 | Night shot; standard grade |
| FM-008 | `toyota-corolla-xli-1-3-2014-rear.jpg` | Toyota Corolla XLI 1.3 Manual  4.jpeg | rear | 960×1280 | Gallery #5 | Number plate pixelated |
| FM-008 | `toyota-corolla-xli-1-3-2014-interior.jpg` | Toyota Corolla XLI 1.3 Manual 7.jpeg | interior | 960×1280 | Gallery #6 | Standard grade only |
| FM-008 | `toyota-corolla-xli-1-3-2014-instrument-cluster.jpg` | Toyota Corolla XLI 1.3 Manual 6.jpeg | instrument-cluster | 1280×960 | Gallery #7 | Odometer reading not visible in photo |

## Homepage hero image

| File | Source | Notes |
|---|---|---|
| `src/assets/hero/hero-lexus-land-cruiser.webp` | `originals/hero-lexus-land-cruiser-original.webp` (supplied by Federal Motors) | Decorative brand visual: black Lexus LX and white Toyota Land Cruiser with "FEDERAL MOTORS" plates in a studio. The file is unedited; its edges are faded into the page by the `.hero-feather` CSS mask in `src/styles/global.css`. Not presented as specific stock vehicles |
| `originals/hero-tiggo-federal-motors-original.webp` | Supplied by Federal Motors | Previous hero (Chery render), kept as a backup; no longer used |

## Brand assets

| File | Source | Notes |
|---|---|---|
| `src/assets/brand/federal-motors-badge.png` | `originals/brand-badge-original.webp` | Circular cut-out with transparent background |
| `public/favicon-32.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png` | Badge | Resized and palette-optimised |
| `src/assets/brand/og-default.jpg` | Badge on navy | Default social-sharing image (1200×630) |
| `originals/brand-logo-wide-original.webp` | Upload | Not used (white background); wordmark is set in live text instead |
| `originals/brand-banner-original.webp` | Upload | Not used: its AI-generated car line-up includes an MG, which Federal Motors does not stock |

## Recommended reshoots

| Vehicle | Why |
|---|---|
| FM-001 Toyota Hilux Revo | Only one photo. Need rear 3/4, side profile, interior, dashboard, odometer |
| FM-005 Mercedes-Benz C63 AMG | Dim indoor garage. Daylight exterior shots, plus a clear odometer photo to settle the mileage |
| FM-002 Chery Tiggo 9 Pro | Remove the third-party window decal and reshoot so no pixelation is needed |
| FM-003 Daihatsu Mira | Clean the windscreen marker writing |

Shooting guide for consistency: daylight but not direct midday sun; same plain wall or open lot each time; phone at waist height; landscape orientation; in this order: front 3/4, side, rear 3/4, rear, interior from the rear door, dashboard and odometer, engine bay.

## Optional AI editing (not yet done)

Federal Motors authorised editing with ChatGPT (OpenAI) through Composio. The OpenAI connection was never completed, so **no AI editing has been applied**. If it is completed later, each edit must be compared side by side with its original and rejected if it changes any detail of the vehicle. AI edits are limited to the background and lighting.
