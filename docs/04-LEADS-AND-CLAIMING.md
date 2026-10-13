# LEADS & CLAIMING — grow the directory without cold-cold emails

You chose: **imported firms stay private** (`status = pending`) until the owner
claims them. This document is the whole growth loop.

---

## 0. The three rules that keep this legal and classy

1. **Facts only.** Name, city, phone, e-mail, website — the data a business
   publishes about itself. Never copy photos, menus text or descriptions from
   their site or from social media; those are copyrighted. Photos come only
   from the owner (or your own shoot, with permission).
2. **Provenance on every row.** The `source_url` column stores where the fact
   came from; Admin → Firme shows it as "sursă lead". If anyone asks, you can
   show and delete it in one click.
3. **Opt-out is instant.** If a firm says "remove us": Admin → Firme → bin.
   No debate, same day. Your Privacy Policy + Contact page already promise this.

Automated scraping of directories that forbid it in `robots.txt` (e.g. 999.md's
`/api/`) is OFF the table — we checked and walked away. Browsing a site as a
human and typing what you see into the sheet is always fine.

---

## 1. Where leads live

- File: `leads/leads.csv` (columns: `name,city,phone,whatsapp,email,website,source_url,note`).
  Empty template: `leads/leads-template.csv`.
- `city` = a slug from your cities table (`chisinau`, `balti`, `cahul`, …).
  Leave empty if unknown — you confirm it on the claim call.
- Turn the CSV into database rows: `node tools/import-leads.js`
  → produces `supabase/04-import-leads.sql` → paste it in Supabase SQL Editor → Run.
  Re-running is safe (duplicates are skipped).
- Imported rows are **invisible**: visitors and Google see nothing until you
  approve. In Admin → Firme they appear under **În așteptare** with the source
  link and your note.

**No-code way to add leads:** open `leads/leads.csv` in Excel/Sheets, add rows,
save, send the file to me (or run the node command above if you ever have Node).
Even simpler: paste messy text ("Kulinarium, Chișinău, 060 175 577, site…")
into our chat and I return the finished SQL.

## 2. The claim campaign (this is your real sales funnel)

Per lead, in order:

1. **Day 0 — e-mail** (template below). Subject mentions their city so it
   doesn't look like spam.
2. **Day 3–4 — WhatsApp / phone** (template below). One sentence + link.
3. **Day 10 — last e-mail**: "we keep only the public facts (name, phone) or
   remove the row entirely — your choice". Both outcomes are fine for you:
   a facts-only approved page with a working phone button still helps users
   and earns you goodwill; a removal is a 5-second click.
4. Owner registers on the site → their account auto-creates an empty company
   profile (pending). They complete it: photos, menus, prices.
5. You: Admin → Firme → approve **their** row, copy any useful facts from the
   lead note (phone/WhatsApp/city), then **delete the lead row**.

Track state in the CSV `note` column: `contactat 12.05`, `whatsapp 15.05`,
`a claimat ✔`, `refuz → șters`.

## 3. Templates

**E-mail RO (day 0)**

> Subiect: Profilul {FIRM} pe Catering Moldova — gratuit
>
> Bună ziua!
> Am adăugat {FIRM} în lista noastră internă de firme de catering din {CITY},
> pe baza datelor publice de pe {SOURCE}. Încă nu am publicat nimic despre
> dumneavoastră.
> Dacă doriți, vă creați gratuit profilul complet (meniu, poze, prețuri,
> WhatsApp) în 10 minute: {REGISTER_LINK} — iar noi îl aprobăm în aceași zi.
> Dacă preferați să nu apăreți deloc, răspundeți cu "excludeți" și ștergem
> rândul imediat, fără alte întrebări.
> Cu respect, {YOUR_NAME} — Catering Moldova, {CONTACT_EMAIL}

**E-mail RU (day 0)**

> Тема: Профиль {FIRM} на Catering Moldova — бесплатно
>
> Здравствуйте!
> Мы добавили {FIRM} во внутренний список кейтеринговых компаний ({CITY}) на
> основе публичных данных с {SOURCE}. Пока мы ничего о вас не публиковали.
> Хотите — создайте бесплатный профиль (меню, фото, цены, WhatsApp) за 10
> минут: {REGISTER_LINK}, и мы одобрим его в тот же день.
> Если не хотите присутствовать — ответьте «исключите», и мы удалим запись
> сразу, без вопросов.
> С уважением, {YOUR_NAME} — Catering Moldova, {CONTACT_EMAIL}

**WhatsApp (day 3–4)**

> RO: Bună ziua! Sunt {YOUR_NAME} de la Catering Moldova (catalog gratuit de
> catering din MD). V-am rezervat locul pentru {FIRM} — încă nepublicat. Îl
> activați gratuit? {REGISTER_LINK} Sau scrieți "nu" și îl ștergem. Mulțumesc!
>
> RU: Здравствуйте! Я {YOUR_NAME}, Catering Moldova (бесплатный каталог
> кейтеринга). Мы придержали место для {FIRM} — пока не публиковали.
> Активируете бесплатно? {REGISTER_LINK} Или напишите «нет» — удалим. Спасибо!

## 4. Why this beats pure scraping long-term

- Claimed profiles get photos, prices and **answers to inquiries** — the thing
  a scraped ghost directory can never have.
- Owners link back to their profile from their own sites/Facebook → your SEO
  grows with real backlinks.
- Every row on your site is either owner-confirmed or clearly minimal facts
  with an opt-out — which is exactly the posture that keeps a directory
  trustworthy (and lawyer-free).

## 5. Batch ideas that stay inside the rules

- Your own browsing: Google Maps / Facebook / Instagram / TikTok — copy facts
  by hand into the CSV (human browsing = fine).
- Firms' own websites: their contact page is the safest source there is.
- Event-industry partners: wedding venues, photo studios, florists — they
  exchange recommendations daily; ask them for their catering shortlist.
- Public registers (company name + address only) to *verify* a lead exists,
  never as a mass-import source.
