# Google Analytics 4 setup

Analytics is configured with Measurement ID **`G-1MRKTXTK2G`**. It's built into every **production** build (`src/layouts/BaseLayout.astro`), so Vercel deployments include it with no settings. The dev server (`npm run dev`) never sends hits. Override with the `PUBLIC_GA4_ID` variable, or set it to `off`.

## How it works

- GA4 loads only when `PUBLIC_GA4_ID` is set at build time.
- **Consent first:** Google Consent Mode v2 defaults analytics storage to *denied*. A banner asks visitors to allow or decline. The choice is saved in the browser. Ad storage is always denied.
- Page views: GA4 sends one `page_view` per page load automatically. The site is multi-page (no client-side router), so there are no duplicate page views.
- Click events are captured by **one** delegated listener (`src/scripts/site.ts`) reading `data-track` attributes, so handlers can't double-bind.
- Forms: in the default **WhatsApp mode**, a valid form opens WhatsApp and fires `whatsapp_click` (with `source` = `<form>_form` and `form_name`). That's an intent signal, not a lead, because the site can't see whether the visitor pressed Send. In **email mode** (EmailJS configured), the lead event (`generate_lead`, `financing_inquiry`, …) fires **only after EmailJS confirms the email was sent**. A failed submission sends nothing.
- `src/scripts/analytics.ts` drops any parameter called `name`, or whose name contains phone/email/mobile/cnic/address/message, as a safety net. **No personal data is sent to GA4** (verified: a financing form submission sends only `form_name` and `inquiry_source`).

## Setup steps

1. ✅ Done: GA4 property created. Check Admin → Property details: time zone Pakistan (GMT+5), currency PKR.
2. ✅ Done: web data stream `G-1MRKTXTK2G`. When the domain is live, make sure the stream's URL matches it.
3. ✅ Done: ID built into production builds. (A Vercel environment variable `PUBLIC_GA4_ID` would override it.)
4. In the data stream's **Enhanced measurement**, keep Page views and Scrolls. **Turn off "Form interactions"**: the site sends its own accurate form events and GA4's automatic ones would double-count.
5. Register **custom dimensions** (Admin → Custom definitions → Create, scope *Event*):
   `vehicle_id`, `make`, `model`, `inquiry_source`, `source`, `form_name`, `method`
6. Mark **key events** (Admin → Events → toggle "Mark as key event"):
   `generate_lead`, `test_drive_request`, `financing_inquiry`, `sell_car_inquiry`, `vehicle_inquiry`, `whatsapp_click`, `phone_click`
7. Set data retention to 14 months (Admin → Data retention).

## Event reference

The four form-success events below fire only in **email mode** (EmailJS). In the default WhatsApp mode, forms report `whatsapp_click` instead.


| Event | Type | Fires when | Parameters |
|---|---|---|---|
| `page_view` | GA4 automatic | Every page load (after consent) | — |
| `view_item` | Recommended | A vehicle page loads | `vehicle_id`, `item_name` |
| `search` | Recommended | Homepage search submitted; inventory filters changed (debounced 1.2s) | `search_term`, `source` |
| `vehicle_inquiry` | Custom | "Ask about this car on WhatsApp" clicked | `method`, `vehicle_id`, `make`, `model`, `inquiry_source` |
| `whatsapp_click` | Custom | Any other WhatsApp button; also a valid form submitted in WhatsApp mode | `source`, `form_name` (forms) |
| `phone_click` | Custom | Any click-to-call link | `source`, `vehicle_id` (on vehicle pages) |
| `book_visit_click` | Custom | "Book a Visit" / "Viewing" buttons | `source`, `vehicle_id` (on vehicle pages) |
| `directions_click` | Custom | Google Maps / directions links | `source` |
| `test_drive_request` | Custom | Viewing / test-drive form **successfully** submitted on a vehicle page | `form_name`, `vehicle_id`, `inquiry_source` |
| `generate_lead` | Recommended | Contact, showroom-visit or sourcing form **successfully** submitted | `form_name`, `inquiry_source` |
| `financing_inquiry` | Custom | Financing form **successfully** submitted | `form_name`, `inquiry_source` |
| `sell_car_inquiry` | Custom | Sell / exchange / consignment form **successfully** submitted | `form_name`, `inquiry_source` |

All click events also carry `page_location`.

## Verify with DebugView

1. Install the **Google Analytics Debugger** Chrome extension and switch it on.
2. Open the live site, accept analytics in the banner.
3. GA4 → Admin → **DebugView**. Click WhatsApp, call, open a vehicle and submit a test form; each event should appear **once** with the parameters above.
4. Delete the test emails afterwards.

## Important interpretation note

A `whatsapp_click` or `phone_click` means someone **tapped the button**. It does not mean a conversation happened, and it does not mean a sale. Treat these as *intent*, and compare with the actual number of WhatsApp chats and calls received.
