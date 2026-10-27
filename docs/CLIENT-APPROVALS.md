# Unverified information and client approvals

Items are grouped by urgency. "Before launch" items must be resolved before `PUBLIC_ALLOW_INDEXING` is set to `true`.

## A. Vehicle data: resolved 27 Oct 2026

| Item | Decision |
|---|---|
| Price unit | **Confirmed by client:** "DEMAND 124" = 124 lakh = PKR 12,400,000 (all vehicles likewise) |
| FM-005 AMG mileage | **Client decision:** use the listed **80,000 km**. Note: the dashboard photo shows an odometer reading of 89,715 km and remains in the gallery; a buyer may ask about it. Replace the photo or the figure if this should be reconciled |
| FM-005 AMG price | Remains "Call for price" |
| Transmission, fuel, engine, colour | Filled from photos and known model specs, as the client authorised: Revo automatic/diesel/2,755 cc/grey (origin local); Tiggo automatic/black; Mira automatic/petrol/658 cc/silver; Vigo diesel/2,982 cc/black; AMG automatic/petrol/6,208 cc/red |
| Left blank by agreement | Vigo transmission (not clear from photos), registration cities, Tiggo origin and engine |
| Stock references FM-001…005; "Biometric verification available"; "Ownership transfer required after purchase" | In use |

## B. Before launch: business claims

| Claim from profile | Status on site | Needed |
|---|---|---|
| Islamic financing ("Ribah as well") | Shown as "Islamic financing assistance" | Confirm this means Shariah-compliant financing through Islamic banks |
| "Works with almost all major banks" | **Not shown**; copy says "banks operating in Karachi" | Confirm, and only then name banks, with their written permission to use their names/logos |
| "Authorized dealers" | **Not shown** | Authorized by whom? Needs a certificate from the manufacturer or bank |
| Warranty: "No warranty on used cars" **and** "engine/transmission assurance" | Terms page says used cars are sold without warranty unless written; no assurance advertised | Resolve the contradiction. If there is an assurance, define it in writing |
| Free inspection, post-sale support, home test drive, delivery service | **Not advertised** (inspection *coordination* is) | Confirm each, plus any cost and area limits |
| Insurance assistance | **Not advertised** | Confirm, and name insurers only with permission |
| Registration transfer: handled physically, or guidance only? | Copy says "we help verify documents and guide you through the transfer" | Confirm, and we'll strengthen the copy if you handle it end to end |
| Import capability: direct importer or via a licensed importer? | Copy says "search the local market or arrange an import" | Confirm wording |
| Service charges / commissions | Not mentioned | Decide whether fees for consignment, sourcing and documentation should be stated |
| Bank-repossessed / auction vehicles; corporate & fleet | Listed as services, kept general | Confirm you actively offer these |
| AOP registration, NTN, sales tax | **Not shown** (as instructed) | Nothing needed unless you want an NTN in the footer |

## C. Before launch: accounts and settings (your action)

| Item | Why |
|---|---|
| Domain name | Set `SITE_URL`, connect in Netlify |
| GitHub repository | **Pending:** create an empty `federal-motors` repo on github.com so the code can be pushed (the environment can't create repos) |
| Netlify account and plan choice | See `DEPLOYMENT.md` §6: Free pauses the site if credits run out |
| Form notification email | `zaeymanofficial@gmail.com` assumed; confirm |
| Confirm +92 313 2963858 is on WhatsApp (or WhatsApp Business) | Every WhatsApp button points to it |
| GA4 property and Measurement ID | ✅ `G-1MRKTXTK2G` configured in `netlify.toml`. Remaining: register custom dimensions and key events (`ANALYTICS-GA4.md`) |
| Search Console verification | See `SEARCH-CONSOLE.md` |
| Google Business Profile | ✅ Listing linked (directions, map, structured data). Add the website URL to the profile at launch |
| Review the Privacy Policy and Terms drafts (`/privacy`, `/terms`) | Drafts only; consider a lawyer's review |

## D. Recommended (not blocking)

| Item | Benefit |
|---|---|
| Reshoot FM-001 (Revo, 1 photo only) and FM-005 (AMG, dim garage) | Better listings and faster pages (see `IMAGE-MANIFEST.md`) |
| Remove the "G Mohiudin" decal from the Tiggo and reshoot | Removes pixelated patches |
| Real showroom photos | About and Contact pages currently use the emblem, not photography |
| Owner portraits of Zain and Ali (only if they're happy to be pictured) | Builds trust. **We will not use AI-generated portraits** |
| Transparent/vector logo files from the designer | Sharper wordmark; we currently use the badge plus live text |
| Complete the OpenAI connection, if AI background clean-up is still wanted | Not done (connection never completed). Every edit would be reviewed side by side against the original |
| Urdu version | Possible without a rebuild: Astro's i18n routing can add `/ur/…` pages and `<html lang dir>` is set in one place (the layout). The work needed: move page copy into translation files, translate it, add an Urdu font (e.g. Noto Nastaliq Urdu), and check the layout right-to-left. Business and vehicle data are already separate from the UI |
