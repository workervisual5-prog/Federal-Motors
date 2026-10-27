# Deployment guide (GitHub + Vercel)

> Keep `PUBLIC_ALLOW_INDEXING` unset (or `false`) until the domain is live and the "before launch" items in `docs/CLIENT-APPROVALS.md` are resolved. Until then, search engines are told not to index the site.

## 1. Local commands

Requires Node.js 22+.

```bash
npm install
npm run build      # type-checks, validates inventory, builds to dist/
npm run preview    # serves dist/ at http://localhost:4321
```

## 2. Push to GitHub

Repository: `https://github.com/workervisual5-prog/Federal-Motors`

From the unzipped project folder:

```bash
git init -b main            # skip if the folder already has .git
git add -A
git commit -m "Federal Motors website"
git remote add origin https://github.com/workervisual5-prog/Federal-Motors.git
git push -u origin main
```

Never commit `.env` files (`.gitignore` already excludes them).

## 3. Deploy on Vercel

1. <https://vercel.com> → **Add New… → Project** → import `workervisual5-prog/Federal-Motors`.
2. Vercel detects **Astro**. Settings come from `vercel.json`:
   - Build command `npm run build`, output directory `dist`
   - Clean URLs (`/about` instead of `/about.html`), no trailing slashes
   - Long-term caching for `/_astro/*` assets, basic security headers
3. Node.js version: Project → Settings → General → Node.js Version → **22.x**.
4. Click **Deploy**. Every push to `main` redeploys; other branches get preview URLs.

No environment variables are needed for a working preview. Google Analytics is already built in.

### Environment variables (Project → Settings → Environment Variables)

| Variable | Needed? | Value |
|---|---|---|
| `SITE_URL` | When the domain is live | `https://www.yourdomain.com` (no trailing slash). Until then the Vercel production URL is used automatically |
| `PUBLIC_ALLOW_INDEXING` | At launch | `true` (Production environment only) |
| `PUBLIC_GA4_ID` | No | Defaults to `G-1MRKTXTK2G` on production builds. Set `off` to disable |
| `PUBLIC_FORM_ENDPOINT` | Optional | Form-service URL for email delivery (see §4) |
| `PUBLIC_FORM_ACCESS_KEY` | Optional | Public access key, only for services that need one (e.g. Web3Forms) |
| `PUBLIC_GSC_VERIFICATION` | Optional | Search Console HTML-tag token |

After changing a variable, redeploy (Deployments → ⋯ → Redeploy).

## 4. Forms

Vercel has no built-in form handling, so the forms support two modes.

**WhatsApp mode (default, no setup):** after validating, the form opens WhatsApp with the visitor's request pre-filled (form type, vehicle and stock reference, name, number, preferences) and addressed to **+92 313 2963858**. The visitor presses Send. The page says "press Send in WhatsApp"; it never claims the request was received, because the site can't know.

**Email mode (optional):** to receive submissions by email instead:
1. Create a free account with a form service such as **Formspree** (<https://formspree.io>) or **Web3Forms** (<https://web3forms.com>). Check each one's current free-plan limits and privacy terms.
2. Create a form and point notifications at `zaeymanofficial@gmail.com`.
3. In Vercel set `PUBLIC_FORM_ENDPOINT` to the endpoint URL (Formspree: `https://formspree.io/f/xxxx`; Web3Forms: `https://api.web3forms.com/submit` plus `PUBLIC_FORM_ACCESS_KEY`).
4. Redeploy. Forms now show "Send" buttons and a confirmed success message only when the service returns success. If delivery fails, the visitor is offered WhatsApp.

Every form sends a `form_name` field (`contact`, `viewing-request`, `financing-inquiry`, `sell-car`, `sourcing-request`) so you can tell them apart. A hidden honeypot field filters simple spam bots.

## 5. Custom domain

1. Buy the domain.
2. Vercel → Project → Settings → **Domains** → add `yourdomain.com` and `www.yourdomain.com`, and follow the DNS instructions (A record / CNAME at your registrar, or Vercel nameservers). HTTPS is automatic.
3. Choose the primary domain; Vercel redirects the other.
4. Set `SITE_URL` to the primary domain and redeploy.

## 6. Vercel plan

Vercel's free **Hobby** plan is for **personal, non-commercial use** under Vercel's terms. A business website like this one would normally need the paid **Pro** plan. Read Vercel's current pricing and Terms of Service and decide. We haven't assumed either way.

## 7. Launch checklist

- [ ] "Before launch" items in `docs/CLIENT-APPROVALS.md` resolved
- [ ] Domain connected, HTTPS active, `SITE_URL` set
- [ ] `PUBLIC_ALLOW_INDEXING=true` on Production, redeployed; `/robots.txt` shows `Allow: /`
- [ ] Each form tested on a phone (WhatsApp opens with the details) or, in email mode, a test email arrives
- [ ] GA4 events visible in DebugView (`docs/ANALYTICS-GA4.md`)
- [ ] Search Console verified, sitemap submitted (`docs/SEARCH-CONSOLE.md`)
- [ ] Rich Results Test on the homepage and one vehicle page
- [ ] Website URL added to the Google Business Profile and Instagram bio

## 8. Rollback

Vercel → Deployments → choose an earlier deployment → ⋯ → **Promote to Production**.
