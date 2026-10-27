# Quality assurance report

Date: 27 October 2026 · Build: Astro 7.4, production build (`npm run build`) served locally with `astro preview`.
All results below come from tests that were actually run. Limitations are listed at the end.

## Summary

| Area | Result |
|---|---|
| Type check + inventory schema validation | ✅ 0 errors, 0 warnings (42 files) |
| Production build | ✅ 15 HTML pages, sitemap, robots.txt |
| Routes (15 pages + 404) | ✅ all 200; unknown URL → custom 404 |
| Responsive layout at 360 / 390 / 430 / 768 / 1024 / 1440 px | ✅ no horizontal overflow on any page (90 page-width combinations) |
| Broken images | ✅ none |
| Console errors | ✅ none |
| Automated accessibility (axe-core, WCAG 2.0/2.1/2.2 A+AA + best practice) at 390 and 1440 px | ✅ 0 violations on all 15 pages |
| Internal links and `#anchors` | ✅ all resolve |
| WhatsApp links | ✅ 13 unique, all to +92 313 2963858, all properly URL-encoded |
| Unique `<title>` and meta description per page | ✅ (all descriptions ≤ 160 chars) |
| One `<h1>` per page, no skipped heading levels | ✅ |
| JSON-LD parses on every page | ✅ |
| Functional tests (filters, sorting, gallery, forms, schema, no-JS, reduced motion) | ✅ 35 / 35 (plus 2 email-mode checks) |

## Lighthouse (Lighthouse 12, simulated throttling)

Performance · Accessibility · Best Practices · SEO, then LCP / CLS / TBT.

| Page | Mobile | Desktop |
|---|---|---|
| Home | 92 · 100 · 100 · 69* — 3.3 s / 0 / 0 ms | 100 · 100 · 100 · 69* — 0.5 s |
| Inventory | 90 · 100 · 100 · 69* — 3.6 s / 0 / 20 ms | 100 · 100 · 100 · 69* — 0.4 s |
| Vehicle (Tiggo 9 Pro) | 91 · 100 · 100 · 69* — 3.5 s / 0 / 10 ms | 100 · 100 · 100 · 69* — 0.7 s |
| Vehicle (C63 AMG) | 97 · 100 · 100 · 69* — 2.6 s / 0 / 0 ms | 100 · 100 · 100 · 69* — 0.5 s |
| Financing | 100 · 100 · 100 · 69* — 1.4 s | 100 · 100 · 100 · 69* — 0.3 s |
| Services | 100 · 100 · 100 · 69* — 1.4 s | 100 · 100 · 100 · 69* — 0.3 s |
| Sell your car | 100 · 100 · 100 · 69* — 1.4 s | 100 · 100 · 100 · 69* — 0.3 s |
| About | 100 · 100 · 100 · 69* — 1.5 s | 100 · 100 · 100 · 69* — 0.3 s |
| Contact | 100 · 100 · 100 · 69* — 1.4 s | 100 · 100 · 100 · 69* — 0.3 s |

\* **SEO 69 is intentional**: indexing is switched off until launch (`noindex` + `Disallow: /`). With `PUBLIC_ALLOW_INDEXING=true`, SEO measured **100** on all 8 pages tested.

**Known gap:** mobile LCP on the three photo-led pages is 3.3–3.6 s under Lighthouse's simulated slow-4G profile, above Google's 2.5 s "good" threshold. The LCP element is a real vehicle photo. Already done: build-time cropping to the displayed frame, WebP at quality 68–74, `fetchpriority="high"`, font preloads, transform-only entrance animations, idle hydration of the filter. Further gains would come from better-lit, less busy source photos (smaller files at the same quality) or AVIF. Field data from Search Console's Core Web Vitals report after launch is the real measure.

## Functional tests (35 / 35 passed)

Inventory: default shows all 5 in-stock; make filter (Toyota → 2) and URL sync; model list narrows to the chosen make; model filter; reset; max-price filter (≤ 50 lakh → Mira only); sort by price descending (call-for-price last); sort by year; search by stock reference; empty state; "Sold" filter (0).
Homepage search → `/inventory?make=Daihatsu` → 1 result.
Vehicle page: WhatsApp message includes the full title and stock reference; gallery next button and keyboard arrows; `Car` JSON-LD with a PKR `Offer`; AMG (call for price) has **no** `Offer`; AMG disclosure shown; AMG mileage shows the listed 80,000 km.
Forms: empty submit shows field errors, moves focus to the first invalid field and sends nothing; invalid phone message; error clears when corrected; **WhatsApp mode (default):** a valid form opens WhatsApp addressed to 923132963858 with the form title, vehicle and stock reference, name, number and chosen options; no network request is sent; a "press Send in WhatsApp" note is shown, not a success claim. **EmailJS mode** (build with test IDs, EmailJS API intercepted): the request goes to `api.emailjs.com/api/v1.0/email/send` with public key `Mxg4xyKr6kadST5vs`, the service and template IDs, and template params (`form_title`, `fields`, `from_name`, `phone`, `vehicle`, `page_url`, `submitted_at`, …); a 200 response shows success and fires exactly one lead event (`test_drive_request` with `vehicle_id`); a 400 response shows the error and WhatsApp fallback and fires nothing.
Sell page `?type=exchange` preselects the inquiry type. Contact map loads only after a click.
Reduced motion: animations ~instant, reveal content visible. JavaScript disabled: inventory still lists all vehicles (server-rendered), reveal content visible.

## Keyboard and screen-reader checks

- Skip link to main content; visible gold focus ring on all controls.
- Mobile menu: `aria-expanded`, focus moves into the menu, Tab is trapped, Escape closes and returns focus (tested).
- Gallery: labelled previous/next buttons, thumbnails with `aria-current`, arrow-key support, live "n / total" counter.
- Forms: visible labels, required markers, `aria-invalid` + `aria-describedby` error text, `role="alert"` error box, focusable `role="status"` success box.
- Filter result count is a polite live region.

## Limitations: not tested here

| Item | Why | Do this after deploy |
|---|---|---|
| Real EmailJS delivery; public key validity; WhatsApp opening on phones | api.emailjs.com and wa.me are blocked from this environment | After adding the Service and Template IDs, submit each form once on the live site |
| GA4 events reaching Google | Google's servers are blocked from this environment. **Tested locally:** consent banner shown, default consent denied, `update` to granted on accept, choice remembered, `view_item` / `vehicle_inquiry` / `financing_inquiry` pushed once with correct parameters and no personal data | Follow `ANALYTICS-GA4.md` → Verify |
| Google Rich Results Test / Schema validator | Needs a public URL | Follow `SEARCH-CONSOLE.md` → step 4 |
| Real devices (iOS Safari, Android Chrome) | Only Chromium available here | Check on a mid-range Android and an iPhone |
| WhatsApp deep link on phones | wa.me redirects need a real device | Tap a vehicle's WhatsApp button on a phone |
| Embedded map pin | Map renders Google's tile for the supplied coordinates; not visually verified | Click "Show map" on /contact |
| Screen reader with NVDA / VoiceOver | Automated checks only | Quick pass recommended |

One axe note: when a page is scrolled so a footer link sits exactly under the sticky header or the mobile contact bar, axe flags that link as partly obscured. This depends on scroll position, not on a layout defect. `scroll-padding` keeps keyboard focus clear of both bars.

## Accuracy audit

- No invented reviews, ratings, statistics, awards, partner banks, rates, down payments or guarantees anywhere on the site.
- The homepage's only numbers are the live stock count (from data) and the owners' stated five years of experience.
- Unconfirmed vehicle details are `null` and not shown; see `CLIENT-APPROVALS.md`.
- Insurance assistance, warranty/assurance, home test drives and delivery are **not** advertised until confirmed.
