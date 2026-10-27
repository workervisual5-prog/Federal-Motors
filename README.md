# Federal Motors website

Website for **Federal Motors**, an owner-led car showroom in Block 2, PECHS, near Tariq Road, Karachi. It has 7 main pages, a vehicle catalogue with a page per car, WhatsApp-first lead capture, and SEO built in.

## Stack and why

| Choice | Reason |
|---|---|
| **Astro 7** (static output) | Every page, including each vehicle, is prerendered HTML: fully readable by search engines, fast, cheap to host |
| **React 19 islands** | Only where interaction is needed (inventory filter, photo gallery). Every other page ships ~3 KB of JavaScript |
| **Tailwind CSS 4** | Design tokens in `src/styles/global.css` |
| **Motion** | Filter and gallery transitions; CSS for everything else; `prefers-reduced-motion` respected |
| **Content collections + Zod** | Inventory is validated at build time; bad data fails the build instead of breaking the page |
| **Vercel** | Static hosting and HTTPS. Forms open WhatsApp pre-filled, or post to an optional form service. No backend or database |

## Commands

```bash
npm install
npm run dev        # dev server at http://localhost:4321
npm run build      # type-check + validate inventory + build to dist/
npm run preview    # serve the production build
python3 -I scripts/process-images.py   # (re)process vehicle photos
```

## Project structure

```
src/
  content/vehicles/*.json   ← inventory (one file per vehicle)
  content.config.ts         ← inventory schema / validation
  data/business.ts          ← name, address, phones, hours, WhatsApp, email (single source of truth)
  data/services.ts          ← services copy
  assets/vehicles/<slug>/   ← processed vehicle photos
  assets/brand/             ← badge, social image
  components/               ← Header, Footer, VehicleCard, InventoryBrowser, Gallery, forms/…
  layouts/BaseLayout.astro  ← SEO meta, Open Graph, JSON-LD, GA4 + consent
  lib/                      ← vehicle helpers, schema.org builders, WhatsApp links
  pages/                    ← routes (see below)
  scripts/                  ← analytics, forms, site interactions
  styles/global.css         ← design tokens and components
originals/                  ← untouched photo and logo uploads (backups)
scripts/process-images.py   ← safe photo normalisation
docs/                       ← guides and reports
```

## Routes

`/` · `/inventory` · `/inventory/<slug>` · `/financing` · `/services` · `/sell-your-car` · `/about` · `/contact` · `/privacy` · `/terms` · `/404` · `/sitemap-index.xml` · `/robots.txt`

## Design system

- **Colours:** derived from the badge. Ink `#05080e`, surfaces `#0b111d` / `#121a2a`, navy `#0b2147`, gold `#c9a456` / `#e8d29a`, text `#f3f0e8`, muted `#a6adba`.
- **Type:** Manrope (UI and headings), Cinzel (wordmark only), self-hosted.
- **Components:** `.btn-primary` (gold), `.btn-secondary` (outline), `.btn-whatsapp`, `.card`, `.field`, `.eyebrow`.
- **Motion:** 160 / 280 / 700 ms, `cubic-bezier(0.22, 1, 0.36, 1)`; transform/opacity only. LCP elements use transform-only entrances.
- **Images:** real photos only for vehicles; cards cropped to 4:3, galleries uncropped on a dark backdrop.

## Documentation

| Guide | Contents |
|---|---|
| [docs/INVENTORY.md](docs/INVENTORY.md) | Add, update, mark sold or remove vehicles; field reference |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | GitHub, Vercel, forms, domain, plan choice, launch checklist |
| [docs/ANALYTICS-GA4.md](docs/ANALYTICS-GA4.md) | GA4 setup, consent, event reference, DebugView |
| [docs/SEARCH-CONSOLE.md](docs/SEARCH-CONSOLE.md) | Verification, sitemap, monitoring, Google Business Profile |
| [docs/REPORTING-LOOKER-STUDIO.md](docs/REPORTING-LOOKER-STUDIO.md) | Dashboard plan |
| [docs/IMAGE-MANIFEST.md](docs/IMAGE-MANIFEST.md) | Every photo, its source and edits |
| [docs/QA-REPORT.md](docs/QA-REPORT.md) | Test results and limitations |
| [docs/CLIENT-APPROVALS.md](docs/CLIENT-APPROVALS.md) | Unverified information and open decisions |

## Environment variables

See `.env.example`. Nothing secret is required. All variables are public build settings:
`SITE_URL`, `PUBLIC_ALLOW_INDEXING`, `PUBLIC_GA4_ID` (defaults to `G-1MRKTXTK2G` in production), `PUBLIC_FORM_ENDPOINT` / `PUBLIC_FORM_ACCESS_KEY` (optional email delivery), `PUBLIC_GSC_VERIFICATION`.

## Content rules

No invented reviews, statistics, bank partnerships, rates, guarantees or vehicle specifications. Unknown vehicle facts are `null` and hidden. See `docs/CLIENT-APPROVALS.md`.
