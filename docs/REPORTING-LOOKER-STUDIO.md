# Reporting plan: Looker Studio dashboard

A free Looker Studio dashboard combining GA4 and Search Console. No reporting data exists yet; everything below fills in once the site is live with GA4 configured.

## Connections

1. <https://lookerstudio.google.com> → **Create → Data source**:
   - **Google Analytics** connector → Federal Motors GA4 property
   - **Search Console** connector → the domain property → *Site Impression* table (for queries) and *URL Impression* table (for pages)
2. Use a Google account that has Viewer access to both.
3. Register the GA4 custom dimensions listed in `ANALYTICS-GA4.md` **before** building the report, or the vehicle breakdowns will be empty.

## Report layout (4 pages)

### Page 1: Website traffic
| Chart | Metric / dimension |
|---|---|
| Scorecards | Active users, Sessions, Engaged sessions (with % change vs previous period) |
| Time series | Active users by **Date** (switchable daily / weekly / monthly) |
| Pie / bar | Sessions by **Session default channel group** (Organic Search, Direct, Organic Social, Referral) |
| Bar | Sessions by **Device category** |
| Table | **Page path** × Views, Average engagement time |

### Page 2: Search performance (Search Console)
| Chart | Metric / dimension |
|---|---|
| Scorecards | Clicks, Impressions, Average CTR, Average position |
| Time series | Clicks and Impressions by Date |
| Table | **Query** × Clicks, Impressions, CTR, Position (top 50) |
| Table | **Landing page** × Clicks, Impressions |

### Page 3: Lead generation
| Chart | Metric / dimension |
|---|---|
| Scorecards | Event count for `whatsapp_click` + `vehicle_inquiry`, `phone_click`, `generate_lead`, `financing_inquiry`, `test_drive_request`, `sell_car_inquiry`, `book_visit_click` |
| Time series | Key events by Date |
| Bar | `whatsapp_click` by **source** (which button people use) |
| Table | Key events by **Session default channel group** (which channels bring leads) |

Label the WhatsApp and phone scorecards **"Taps (intent)"**, not "Leads". A tap is not a confirmed conversation or sale.

### Page 4: Inventory interest
| Chart | Metric / dimension |
|---|---|
| Table | `view_item` events by **vehicle_id** + **item_name** (most-viewed vehicles) |
| Table | `vehicle_inquiry` + `test_drive_request` by **vehicle_id** (vehicles generating inquiries) |
| Calculated field | Inquiries ÷ views per vehicle (interest rate) |
| Table | `search` events by **search_term** (what visitors look for) |

## Filters and controls

- Date range control on every page (default: last 28 days)
- Device category filter
- Exclude internal traffic: in GA4 Admin → Data streams → Configure tag settings → Define internal traffic, add the showroom's IP, then activate the "Internal traffic" data filter

## Suggested monthly review (15 minutes)

1. Are visits and organic clicks trending up?
2. Which vehicles get views but no inquiries? (Price, photos or description may need work.)
3. Which search queries show impressions but low CTR? (Improve page titles.)
4. Compare WhatsApp taps against chats actually received, and record real enquiries and sales separately (e.g. in a simple sheet) to judge true conversion.
