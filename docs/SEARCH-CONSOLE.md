# Google Search Console & Google Business Profile

No verification code has been invented. Choose a method below once the domain is live.

## 1. Verify ownership

**Recommended: Domain property (DNS)**, which covers www, non-www and every subdomain.

1. <https://search.google.com/search-console> → Add property → **Domain** → enter `yourdomain.com`.
2. Google shows a TXT record. Add it in your DNS (Netlify DNS: Domain management → DNS records → Add new record → TXT).
3. Click **Verify** (DNS can take up to a few hours).

**Alternative: URL-prefix property with HTML tag**

1. Add property → **URL prefix** → `https://www.yourdomain.com`.
2. Choose **HTML tag** and copy only the `content` value, e.g. `abc123…`.
3. Netlify → environment variable `PUBLIC_GSC_VERIFICATION=abc123…` → redeploy. The site then outputs `<meta name="google-site-verification">` on every page.
4. Click **Verify**.

## 2. Before submitting: launch settings

- `SITE_URL` = final domain, `PUBLIC_ALLOW_INDEXING=true`, redeployed.
- Check `https://yourdomain.com/robots.txt` shows `Allow: /` and a `Sitemap:` line.
- Check a page's source: `<meta name="robots" content="index, follow…">`.

## 3. Submit the sitemap

Search Console → **Sitemaps** → enter `sitemap-index.xml` → Submit. It lists every public page, including each vehicle. It updates automatically on each deploy, so you don't need to resubmit when stock changes.

Optionally, use **URL Inspection** on the homepage and a vehicle page → **Request indexing**.

## 4. Validate structured data

Run each of these through <https://search.google.com/test/rich-results> and <https://validator.schema.org>:

- Homepage: `AutoDealer` (address, hours, geo, phone)
- A vehicle page: `Car` with `Offer` (price in PKR) and `BreadcrumbList`
- Inventory / Financing / Services: `BreadcrumbList`

Structured data helps Google understand the pages but **does not guarantee** rich results.

## 5. What to monitor (weekly at first, then monthly)

| Report | Where | What to look for |
|---|---|---|
| Clicks, impressions, CTR, average position | Performance → Search results | Trend over 28 days / 3 months |
| Search queries | Performance → Queries | Which searches find you ("car showroom PECHS", "used cars Karachi", model names) |
| Top pages | Performance → Pages | Which vehicles and services attract searches |
| Indexed pages | Indexing → Pages | All public pages should be "Indexed"; investigate "Not indexed" reasons |
| Indexing errors | Indexing → Pages → Why pages aren't indexed | 404s (sold vehicles deleted without redirect), "Crawled – currently not indexed" |
| Mobile usability / Core Web Vitals | Experience | Should show "Good" URLs once traffic accumulates |
| Enhancements | Breadcrumbs, etc. | Structured data errors |

`/inventory?make=…` filter URLs are blocked in robots.txt and canonicalise to `/inventory`, so they won't create duplicates.

## 6. Google Business Profile

**Status (27 Oct 2026):** the client has set up and optimised the Business Profile (Business Profile ID 15801088510167343850; store code the same). The original Maps short link still opens a **dropped pin**, so the website's "Get directions" buttons use a Google Maps directions link to the exact coordinates (24.8653355, 67.0544205) instead.

Remaining steps:
1. In the Business Profile, click **Share profile** and copy the link.
2. Replace `mapsUrl` in `src/data/business.ts` with it, and add the same URL to `sameAs` in `src/lib/schema.ts`.
3. Add the **website URL** to the profile once the domain is live.
4. Check the profile matches the website exactly: name "Federal Motors", address "Plot No. 34/A, 1st Floor, Main Shahrah-e-Quaideen, Block 2, PECHS, near Tariq Road, Karachi", phone 0313-2963858, hours Mon–Sat 12:00–21:00, Sunday closed. Category: **Used car dealer** (secondary: Car dealer).
5. A different business, "Isuzu Federal Motors", exists in Islamabad. Keep "Karachi" and "PECHS" next to the name in posts and citations to avoid confusion.

The Business Profile ID and store code are internal Google identifiers; they are not used on the public website.
