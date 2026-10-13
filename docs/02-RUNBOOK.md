# RUNBOOK — manage everything without writing code

Every task below is clicks only. Pages mentioned are on **your site**
(`https://your-name.vercel.app`) unless I write *Supabase* or *Vercel*.

Sign in first: **Intrare** (top right). Admin tasks need the **Administrare**
tab inside `/ro/cont/admin`.

---

## 1. Approve / reject a new company  *(admin)*

`/ro/cont/admin` → tab **Firme** → filter chip **În așteptare**.
- **Aprobă** – the company becomes public immediately (search, city pages,
  sitemap).
- **Respinge** – you are asked for a short reason; the company sees it in its
  dashboard and can fix + resubmit by editing the profile.
- **shield icon** – toggle "Verificat" (the green badge + higher position in
  "Firme recomandate").
- **eye icon** – hide/show the public page without deleting.
- **bin icon** – delete the company with its services, inquiries and reviews.

## 2. Moderate reviews  *(admin)*

Tab **Recenzii** → chip **pending** → **Aprobă** or set the select to
`rejected` / `spam`. Approved reviews appear on the company page and inside the
Schema.org rating (only when at least one review is approved).

## 3. Handle spam / inquiries  *(admin and company owners)*

- Owners: `/ro/cont/intrebari` – open a request, reply by e-mail button,
  mark `read / replied / archived / spam`, or delete.
- Admin: tab **Toate cererile** – same controls across all companies.
- The public forms already block bots (hidden honeypot field, typing-speed
  check, max 5 inquiries per IP per hour, max 3 reviews per IP per hour).

## 4. Reset a password (yours or help a company)

- **Yourself:** sign-in page → **Ai uitat parola?** → type your e-mail → open
  the reset link (check Spam folder).
- **As admin for someone else:** Supabase → **Authentication → Users** →
  open the user → **Send password recovery e-mail**. You never see their
  password (nobody does – they are stored encrypted).

## 5. Change homepage text, titles, contact e-mail  *(admin)*

`/ro/cont/admin` → tab **Setări SEO și text**:
- Hero title & subtitle (RO / RU),
- site meta descriptions (RO / RU / EN),
- SEO title template for company pages (`{firm} – Catering în {city} | {site}`),
- contact e-mail/phone shown in footer & contact page,
- footer notes, and switches for **reviews** and **inquiry forms**.
Click **Salvează** – the public site updates within ~10 minutes (cache).

## 6. Add / edit a city, category, cuisine  *(admin)*

Tabs **Orașe**, **Categorii**, **Bucătării și diete**:
- **Adaugă** → fill slug (lowercase, no accents: `comrat`), names in RO/RU/EN,
  region, latitude/longitude (for the map), priority (bigger = shown first),
  active.
- Pencil = edit, bin = delete. A city page `/ro/catering-<slug>` exists
  automatically for every city, with SEO text and FAQ.
- To write your own intro paragraph for a city (instead of the built-in text),
  fill **Text SEO (RO/RU)** – it is placed above the default copy.

## 7. Delete the example companies

Supabase → **SQL Editor** → **New query** → paste → **Run**:

```sql
delete from public.firms where slug like 'demo-%';
```

(Their photos, services and reviews disappear with them.)

## 8. Make a company "featured" on the homepage

Featured = **Verificat** + best rating. So: admin → Firme → shield icon on that
company, and encourage real approved reviews.

## 9. Change photos / logo of your company  *(owner)*

`/ro/cont/profil` → section **Logo și galerie** → **Încarcă** (JPG/PNG/WebP,
max 5 MB each, up to 12 photos). First photo = card image everywhere.
× on a thumbnail removes it. Photos are stored in your Supabase Storage bucket
`media` and served as WebP/AVIF automatically.

## 10. Hide your company temporarily  *(owner)*

`/ro/cont` → **Ascunde profilul**. It disappears from search and Google within
days; the dashboard keeps working.

## 11. Export / backup your data

Supabase → **Database → Backups** (automatic daily on free tier).
For a manual export: **Table Editor** → choose table → **Export data** (CSV),
or SQL Editor: `select * from firms;` → download result.

## 12. See traffic & Google indexing

Google Search Console (see `docs/03-SEO-GOOGLE.md`) → **Performance** and
**Pages**. Nothing to install on the site – the sitemap is already at
`/sitemap.xml`.

## 13. Change the site name / language order

Site name: Vercel → Settings → Environment Variables → `NEXT_PUBLIC_SITE_NAME`
→ Redeploy. Languages are RO (default) / RU / EN with the RO-RU-EN switcher in
the header and footer; hreflang tags are generated automatically.

## 14. Something was deleted by mistake

- Company deleted → data cannot be restored from the site; use
  Supabase → **Database → Backups → Restore** (point-in-time, free tier keeps
  7 days).
- Wrong text in Setări → edit again and save.
