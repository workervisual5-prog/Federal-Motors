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
| `PUBLIC_EMAILJS_SERVICE_ID` / `PUBLIC_EMAILJS_TEMPLATE_ID` | Unless set in `src/data/emailjs.ts` | EmailJS IDs (see §4) |
| `PUBLIC_GSC_VERIFICATION` | Optional | Search Console HTML-tag token |

After changing a variable, redeploy (Deployments → ⋯ → Redeploy).

## 4. Forms (EmailJS)

All five forms (contact, viewing / test drive, showroom visit, financing, sell / exchange, vehicle sourcing) send email through **EmailJS**, straight from the browser. No server is needed.

**Public key:** `Mxg4xyKr6kadST5vs` (already in `src/data/emailjs.ts`).
**Still needed:** the **Service ID** and **Template ID**. Until both are set, the forms automatically use WhatsApp mode (they open WhatsApp with the request pre-filled to +92 313 2963858), so the site never shows a broken form.

### One-time EmailJS setup

1. <https://dashboard.emailjs.com> → **Email Services → Add New Service** → Gmail → connect `zaeymanofficial@gmail.com`. Copy the **Service ID** (e.g. `service_abc123`).
2. **Email Templates → Create New Template**:
   - **Subject:** `Website: {{form_title}} — {{from_name}}`
   - **To Email:** `zaeymanofficial@gmail.com`
   - **Reply To:** `{{reply_to}}` (filled only when the visitor gives an email address)
   - **Content:**
     ```
     New {{form_title}} from the Federal Motors website

     {{fields}}

     Page: {{page_url}}
     Sent: {{submitted_at}} (Karachi time)
     ```
   Save, and copy the **Template ID** (e.g. `template_xyz789`).
3. **Account → Security:** add your website domain(s) under allowed origins (e.g. your Vercel URL, and later the real domain) so the key can't be used from other sites. Optionally enable reCAPTCHA or rate limits there.
4. Put the two IDs in the site, either way:
   - edit `src/data/emailjs.ts` (`serviceId`, `templateId`) and push, **or**
   - set `PUBLIC_EMAILJS_SERVICE_ID` and `PUBLIC_EMAILJS_TEMPLATE_ID` in Vercel → Settings → Environment Variables and redeploy.
5. Submit each form once from the live site and confirm the emails arrive.

### What the email contains

`{{fields}}` lists exactly what the visitor saw and filled in, for example:

```
Vehicle: 2022 Toyota Hilux Revo V 2.8 (FM-001)
Your name: Ali Khan
Mobile number: 0300-1234567
I’d like to: View and test drive
```

Individual variables are also available for custom templates: `{{form_name}}`, `{{from_name}}`, `{{name}}`, `{{phone}}`, `{{email}}`, `{{vehicle}}`, `{{message}}`, `{{details}}`, `{{make}}`, `{{model}}`, `{{year}}`, `{{financing_type}}`, `{{inquiry_type}}`, `{{preferred_date}}`, `{{preferred_time}}`, and others.

### Behaviour

- Success message and analytics lead event appear **only** when EmailJS confirms the email was sent.
- If sending fails (network, EmailJS limit reached, wrong ID), the visitor sees an error with a **Continue on WhatsApp** button. Nothing is lost.
- A hidden honeypot field silently drops simple spam bots.
- EmailJS's free plan has a monthly email limit. Check your plan in the EmailJS dashboard.

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
- [ ] EmailJS IDs set; each form sends a test email that arrives
- [ ] GA4 events visible in DebugView (`docs/ANALYTICS-GA4.md`)
- [ ] Search Console verified, sitemap submitted (`docs/SEARCH-CONSOLE.md`)
- [ ] Rich Results Test on the homepage and one vehicle page
- [ ] Website URL added to the Google Business Profile and Instagram bio

## 8. Rollback

Vercel → Deployments → choose an earlier deployment → ⋯ → **Promote to Production**.
