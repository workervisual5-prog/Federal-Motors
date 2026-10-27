# Deployment guide (GitHub + Netlify)

> **Do not launch publicly until the items in `docs/CLIENT-APPROVALS.md` marked "before launch" are resolved.** Until then, keep `PUBLIC_ALLOW_INDEXING=false` so search engines ignore the site.

## 1. Requirements

- Node.js 22+ and npm
- A GitHub account (for the code)
- A Netlify account (for hosting and forms)

```bash
npm install
npm run build      # type-checks, validates inventory, builds to dist/
npm run preview    # serves dist/ at http://localhost:4321
```

## 2. Put the code on GitHub

```bash
git remote add origin https://github.com/<account>/federal-motors.git
git push -u origin main
```

Never commit `.env` files. `.gitignore` already excludes them.

## 3. Create the Netlify site

1. Netlify → **Add new project → Import an existing project → GitHub** → choose the repo.
2. Build settings are read from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 22
3. **Environment variables** (Project configuration → Environment variables):

| Variable | Value | When |
|---|---|---|
| `SITE_URL` | `https://federal-motors.netlify.app` now; your domain later | Always |
| `PUBLIC_ALLOW_INDEXING` | `false` now, `true` at launch | Always |
| `PUBLIC_GA4_ID` | Already set to `G-1MRKTXTK2G` in `netlify.toml` (no action needed) | — |
| `PUBLIC_GSC_VERIFICATION` | Search Console HTML-tag token | Only if using HTML-tag verification |

Changing a variable needs a redeploy (Deploys → Trigger deploy).

## 4. Forms

Forms are detected automatically from the built HTML (`data-netlify="true"`). Five forms will appear under **Forms** after the first deploy:

| Form name | Where |
|---|---|
| `contact` | /contact |
| `viewing-request` | Every vehicle page and /contact |
| `financing-inquiry` | /financing |
| `sell-car` | /sell-your-car |
| `sourcing-request` | /services |

Set up notifications: **Project configuration → Notifications → Emails and webhooks → Form submission notifications → Add notification → Email** to `zaeymanofficial@gmail.com`. Do this for "Any form".

Spam protection: hidden honeypot field plus Netlify's built-in spam filtering. Submissions flagged as spam appear under Forms → Spam. If spam becomes a problem, enable Netlify's reCAPTCHA option.

**Form test after first deploy:** submit each form once with test data, confirm it appears in Netlify and the email arrives, then delete the test submissions.

## 5. Custom domain and HTTPS

1. Buy the domain (e.g. a `.pk` from PKNIC resellers or a `.com`).
2. Netlify → **Domain management → Add a domain** → follow the DNS instructions (Netlify DNS or a CNAME/A record at your registrar).
3. HTTPS is issued automatically by Let's Encrypt once DNS resolves.
4. Set `SITE_URL` to the final domain (`https://www.yourdomain.com`, no trailing slash) and redeploy, so canonicals, the sitemap and social previews use it.
5. In Domain management, set the primary domain and let Netlify redirect the other variants (www / non-www, `netlify.app`) to it.

## 6. Netlify plan: read before choosing

Checked October 2026 (confirm on <https://www.netlify.com/pricing/> before deciding; terms change):

- **Free:** $0, **300 credits per month, hard cap**. If credits run out, **the site is paused** until the next month. Each successful production deploy uses ~15 credits; bandwidth ~20 credits per GB. Form submissions are free on credit-based plans.
- **Personal:** ~$9/month, 1,000 credits.

What this means for Federal Motors: each inventory update is a deploy (15 credits), so the Free plan allows roughly a dozen updates a month alongside normal traffic. **For a business site that must not go offline, the Personal plan is the safer choice.** Free is fine for the preview period. Netlify notifies you at 50%, 75% and 100% usage. Review Netlify's Terms of Use for commercial use yourself; it's not a legal question we can answer for you.

## 7. Launch checklist

- [ ] All "before launch" items in `docs/CLIENT-APPROVALS.md` resolved
- [ ] Domain connected, HTTPS active, `SITE_URL` updated
- [ ] `PUBLIC_ALLOW_INDEXING=true`, redeployed; `/robots.txt` now allows crawling
- [ ] Each form tested end to end
- [ ] WhatsApp buttons open a chat with +92 313 2963858
- [ ] GA4 events visible in DebugView (see `docs/ANALYTICS-GA4.md`)
- [ ] Search Console verified, sitemap submitted (see `docs/SEARCH-CONSOLE.md`)
- [ ] Rich Results Test run on one vehicle page and the homepage
- [ ] Website URL added to Google Business Profile and Instagram bio

## 8. Rollback

Netlify → Deploys → pick a previous successful deploy → **Publish deploy**.
