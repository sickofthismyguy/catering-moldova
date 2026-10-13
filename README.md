# Catering Moldova — catering marketplace & directory for Moldova

A minimalistic, mobile-first, SEO-ready marketplace where **catering companies
register and list their services**, and **visitors search, compare and contact
them without an account**. Built for the Republic of Moldova:
Romanian (default) · Russian · English, MDL prices, 33 cities seeded.

€0 to run: free Supabase (auth + Postgres + storage + RLS) and free Vercel
hosting on a `*.vercel.app` subdomain. No domain purchase, no paid services,
no online payments in v1 — only inquiries, phone and WhatsApp.

## Documentation (start here)

| File | What it is |
|---|---|
| `docs/01-SETUP-CLICK-BY-CLICK.md` | Go live in ~45 minutes with clicks only (GitHub → Vercel → Supabase → admin account). |
| `docs/02-RUNBOOK.md` | Day-to-day management without code: approve firms, moderate reviews, reset passwords, edit homepage text, delete demo data. |
| `docs/03-SEO-GOOGLE.md` | Search Console, sitemap, rich results, Google Business Profile. |
| `supabase/01-schema.sql` | Database: tables, triggers, Row Level Security, storage policies. Paste into Supabase SQL Editor. |
| `supabase/02-seed.sql` | Seed: 33 cities, 19 categories, cuisines/diets, settings, 12 example companies (`demo-*`). |

## Roles

- **Visitor** – search & filter (keyword, city, event, cuisine, dietary,
  price, guests), city pages `/ro/catering-chisinau`, category pages
  `/ro/catering-nunti`, company profiles with gallery, services & prices,
  map (OpenStreetMap), phone / WhatsApp / e-mail, inquiry form, reviews,
  favourites saved locally (no account).
- **Company** – e-mail register/login, profile editor (bilingual RO/RU, logo,
  12 photos, contacts, price from, guests, cuisines, events, dietary, SEO
  fields), services CRUD with prices, inquiries inbox with statuses,
  publish/unpublish, completeness meter.
- **Admin** – approve/reject/verify/delete companies, moderate reviews &
  inquiries, CRUD for cities/categories/taxonomies, edit homepage & SEO texts,
  toggles for reviews and inquiry forms.

## Security model

- Supabase **Row Level Security** everywhere: companies can only read/write
  their own rows; visitors see only `approved + published` companies.
- Database **triggers** enforce what policies can't: a company can never set
  its own `status`, `verified`, ratings or view counter; reviews submitted by
  the public always start as `pending`; slugs are auto-slugified and unique;
  only an administrator (or the SQL editor) can grant the `admin` role.
- Public forms go through server routes with honeypot + typing-speed check +
  length limits + per-IP hourly rate limits; inserts use the service-role key
  which never reaches the browser.
- Uploads: 5 MB max, JPG/PNG/WebP only, stored under `media/firms/{user-id}/…`
  with storage policies scoped to the owner.

## SEO

- Title template `{Firm} – Catering în {City} | Catering Moldova`, meta
  descriptions RO+RU, canonical + `hreflang` (ro-MD, ru-MD, en, x-default),
  Open Graph & Twitter cards, `sitemap.xml` (~600 URLs, 3 languages),
  `robots.txt`, Web App Manifest.
- Schema.org: `LocalBusiness`/`CateringService`/`FoodService`, `OfferCatalog`,
  `AggregateRating` (only with approved reviews), `FAQPage`, `BreadcrumbList`,
  `WebSite` + `SearchAction`.
- Hand-written local SEO copy + FAQ for Chișinău, Bălți, Cahul, Orhei, Ungheni,
  Soroca, Comrat and generated (still local, still useful) copy for all other
  cities; admin can override any city intro.
- Performance: ISR/static pages, lazy images, WebP/AVIF, zero CSS frameworks,
  system fonts, ~103 kB shared JS.

## Stack

Next.js 15 (App Router, TypeScript) · Supabase (Postgres, Auth, Storage) ·
hand-written CSS design system (white, warm amber accent, WCAG-AA contrast,
keyboard friendly) · OpenStreetMap embeds · no UI libraries.

## Local development (only if you want to tinker)

```bash
npm install
cp .env.example .env.local     # optional: without it the site runs in demo mode
npm run dev                    # http://localhost:3000
npm run build && npm start
```

Without Supabase keys the whole site renders with a built-in example dataset
(demo mode), so you can deploy first and connect the database later.

### Repository map

```
src/app/            pages: home, /cauta (search), /catering-[slug] via [slug],
                    /firma/[slug], static pages, /cont/* dashboard & admin, API routes
src/components/     UI (server + a few small client islands)
src/lib/            data layer (Supabase + demo fallback), i18n dictionaries,
                    SEO helpers, spam protection, content/SEO copy
supabase/           schema + seed SQL (validated on PostgreSQL 15)
docs/               the three guides above
tools/gen-seed.js   regenerates supabase/02-seed.sql from src/lib/demo.ts
```

## License note

Content you create (company data, photos, texts) belongs to you and to the
companies that submit it. The code is provided as-is for your project.
