# SEO & GOOGLE — make the site findable in Moldova (clicks only)

Your site already ships the technical part:

- clean URLs: `/ro/catering-chisinau`, `/ru/catering-chisinau`, `/ro/firma/{slug}`
- `hreflang` ro-MD / ru-MD / en + `x-default` on every page
- canonical tags, Open Graph, Twitter cards
- Schema.org: `LocalBusiness`+`CateringService`+`FoodService` per company,
  `OfferCatalog` for services, `AggregateRating` **only** when approved reviews
  exist, `FAQPage` on city/category pages, `BreadcrumbList`, `WebSite` +
  `SearchAction` on the homepage
- `/sitemap.xml` (all languages, ~600 URLs) and `/robots.txt`
- fast: static pages, lazy images, WebP/AVIF, no heavy JS, system fonts

Now connect the tools.

---

## 1. Google Search Console (10 min)

1. https://search.google.com/search-console → sign in with your Google account.
2. Choose **URL prefix** (left tab) → paste your Vercel address
   `https://catering-moldova.vercel.app` → **Continue**.
3. Verification: pick **HTML tag** → copy the meta tag? **No code needed:**
   choose instead **Google Analytics** or, simplest, **Domain/URL prefix via
   Google Tag Manager**? The truly zero-code way on Vercel:
   - pick **HTML file** verification, download the file
     `googleXXXXXXXX.html`,
   - put that file inside the `public/` folder of your GitHub repository
     (GitHub → your repo → `public` folder → **Add file → Upload files**),
   - commit; Vercel redeploys automatically in ~1 minute,
   - back in Search Console click **Verify**. ✅
4. Left menu → **Sitemaps** → paste `sitemap.xml` → **Submit**.
   Within hours Google lists "Success" and starts crawling the city pages.
5. Optional but useful: **Settings → Site settings** – check the domain.
   And **URL Inspection** → paste `/ro/catering-chisinau` → **Request indexing**
   for your 5 most important pages.

## 2. Bing Webmaster Tools (5 min, free bonus traffic)

1. https://www.bing.com/webmasters → **Sign in** → **Import from Google Search
   Console** (one click, uses your GSC data) → submit the same sitemap.

## 3. Google Business Profile (for your OWN company, if you have one)

This is separate from the directory: it puts *your* catering firm on Google
Maps.
1. https://business.google.com → **Manage now** → type your company name →
   **Add your business to Google**.
2. Category: `Caterer` (Moldova: `Servicii de catering`).
3. Add your website = your Vercel address (or the company page
   `/ro/firma/{slug}` — even better, it is already structured data rich).
4. Verify by postcard/phone/video as offered.
5. Repeat for each city office you really have. One profile per real location.

> The directory itself (the marketplace) does **not** need a Business Profile;
> encourage every listed company to create its own and link to its profile page
> on your site — those backlinks help the whole project.

## 4. What to publish for rankings (weekly, 15 min)

The strongest free levers for a directory:
1. **Approve companies fast** – every approved profile adds a page with
   structured data and local keywords.
2. **Ask each company for 4–6 real photos and 2–3 services with prices** –
   complete profiles rank and convert better (the dashboard shows a
   completeness meter).
3. **Collect approved reviews** – they enable the star rating in Google results
   (`AggregateRating`).
4. Keep city pages fresh: admin → Orașe → **Text SEO** to add a local paragraph
   (e.g. mention a well-known venue in Orhei) – unique local text beats copies.

## 5. Check your work (free tools)

- https://validator.schema.org – paste a company URL → no errors.
- https://search.google.com/test/rich-results – company URL → sees
  LocalBusiness + FAQ.
- https://pagespeed.web.dev – your homepage should score 90+ on mobile.
  If images slow it: use smaller photos (under 300 KB) when uploading.

## 6. Language strategy

Romanian is the default and the canonical language (`x-default` → `/ro`).
Russian pages are full translations with their own URLs (`/ru/...`) – Google
shows the right one to the right searcher. English exists for completeness.
Do not mix languages inside one page; the switcher keeps visitors on the same
page in the other language.
