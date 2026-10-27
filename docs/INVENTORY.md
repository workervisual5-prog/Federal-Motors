# Inventory maintenance guide

Each vehicle is one JSON file in `src/content/vehicles/`. The filename becomes the vehicle's web address:

```
src/content/vehicles/toyota-hilux-revo-v-2022.json  →  /inventory/toyota-hilux-revo-v-2022
```

You never need to edit page or component code to manage stock. The build checks every file against a schema, so a missing field, wrong value or missing photo **stops the build with an error** instead of putting a broken card online.

---

## Add a vehicle

1. **Photos.** Create `originals/<slug>/` and copy in the original photos, named `<slug>-<view>.jpg` (e.g. `honda-civic-oriel-2021-front-three-quarter.jpg`). Keep originals untouched.
2. **Process them.** Run:
   ```bash
   python3 -I scripts/process-images.py
   ```
   This writes graded copies to `src/assets/vehicles/<slug>/`. If a photo shows a number plate or a third-party name, add its pixel box to `PRIVACY` in the script first.
3. **Data.** Copy an existing JSON file, rename it to `<slug>.json` and edit it (see the field reference below). Give it the next stock reference (`FM-006`, `FM-007` …).
4. **Check and preview.**
   ```bash
   npm run build      # validates everything
   npm run preview    # http://localhost:4321/inventory
   ```
5. **Publish.** Commit and push. Netlify rebuilds and deploys automatically.

**Slug rules:** lowercase, hyphens only, `make-model-variant-year`, e.g. `suzuki-swift-glx-2024`. Never change a slug once it's live, because that breaks shared links. If you must, add a redirect to `netlify.toml`.

## Update a vehicle

Edit its JSON file, update `lastUpdated`, then commit and push.

## Mark as reserved or sold

Set `"availability": "reserved"` or `"availability": "sold"`.

- **Reserved:** stays listed with an amber badge.
- **Sold:** hidden from the default "In stock" view (visitors can still choose "Sold"), the page stays live so shared links keep working, inquiry buttons are replaced with a "source a similar car" prompt, and the price offer is removed from Google's structured data.

## Remove a vehicle

- **Temporarily hide it:** `"published": false`. The page and card disappear.
- **Delete permanently:** delete the JSON file and its two photo folders. Then add a redirect so old links don't 404:
  ```toml
  [[redirects]]
    from = "/inventory/old-slug"
    to = "/inventory"
    status = 301
  ```

---

## Field reference

**Golden rule: if you don't know it, use `null`. Never guess.** Fields set to `null` are simply not shown.

| Field | Required | Example | Notes |
|---|---|---|---|
| `stockReference` | yes | `"FM-006"` | Format `FM-` + 3+ digits. Shown on cards and in WhatsApp messages |
| `make` | yes | `"Toyota"` | |
| `model` | yes | `"Hilux Revo"` | |
| `variant` | yes / `null` | `"V 2.8"` | |
| `year` | yes | `2022` | Model year |
| `yearNote` | optional | `"2008 donor car converted…"` | Shown under the title. Use for conversions, facelifts |
| `registrationYear` | yes / `null` | `2022` | |
| `registrationNote` | optional | `"Fresh clear 2026"` | Shown when there is no registration year |
| `registrationCity` | yes / `null` | `"Karachi"` | |
| `condition` | yes | `"used"` | `new` or `used` |
| `origin` | yes / `null` | `"imported"` | `local` or `imported` |
| `bodyType` | yes / `null` | `"pickup"` | `sedan`, `hatchback`, `suv`, `pickup`, `van`, `coupe`, `other` |
| `pricePKR` | yes / `null` | `12400000` | Full rupees, no commas. **124 lakh = 12400000** |
| `priceVisibility` | yes | `"show"` | `show` or `call` ("Call for price"). `show` requires a price |
| `priceNote` | optional | `"Best offer invited"` | |
| `mileageKm` | yes / `null` | `71000` | Kilometres, no commas |
| `transmission` | yes / `null` | `"automatic"` | `automatic` or `manual` |
| `fuelType` | yes / `null` | `"diesel"` | `petrol`, `diesel`, `hybrid`, `plug-in hybrid`, `electric` |
| `engineCC` | yes / `null` | `2755` | |
| `exteriorColour` | yes / `null` | `"Grey"` | |
| `owners` | optional | `"Second owner"` | |
| `auctionGrade` | optional | `"3.5"` | |
| `availability` | yes | `"available"` | `available`, `reserved`, `sold` |
| `highlights` | list | `["Parking sensors"]` | Seller-approved selling points. Shown with "as described by the seller" |
| `documentation` | list | `["Biometric verification available"]` | |
| `disclosures` | list | `["Minor paint chips on front bumper"]` | Shown in an amber "Please note" box. Use honestly |
| `description` | yes | text | At least 40 characters, factual |
| `images` | yes (1+) | see below | First image = card thumbnail and social preview |
| `featured` | optional | `true` | Shown on the homepage (max 6) |
| `published` | optional | `true` | `false` hides the vehicle |
| `dateAdded`, `lastUpdated` | yes | `"2026-10-27"` | Used for "Recently added" sorting |
| `pendingConfirmation` | list | `["Transmission"]` | **Internal checklist, never shown on the site.** Track what still needs confirming |

### Images

```json
"images": [
  {
    "src": "../../assets/vehicles/<slug>/<slug>-front.jpg",
    "alt": "Front view of the 2022 Toyota Hilux Revo V 2.8 at Federal Motors",
    "view": "front"
  }
]
```

- `alt` must describe the photo (10+ characters). It's read aloud by screen readers and used by Google Images.
- Order matters: put the best exterior shot (usually front three-quarter) first.
- Cards crop to 4:3 automatically. Galleries show the whole photo.

### Prices

Your listings quote "DEMAND" in lakh. Convert before entering:

| Demand | `pricePKR` |
|---|---|
| 38.50 | `3850000` |
| 62 | `6200000` |
| 124 | `12400000` |
| 135.75 | `13575000` |

The site shows both formats: "PKR 12,400,000" and "124 lakh".

## Accuracy checklist before publishing a vehicle

- [ ] Mileage matches the odometer photo
- [ ] Price confirmed by the owner, in the right unit
- [ ] Model year and registration year are correct (note conversions in `yearNote`)
- [ ] Damage or modifications visible in photos are listed in `disclosures`
- [ ] No number plates, CNICs, registration book pages or owner names visible in photos
- [ ] `pendingConfirmation` is empty, or the remaining items are safe to leave unshown
