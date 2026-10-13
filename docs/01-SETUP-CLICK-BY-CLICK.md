# SETUP — from zero to a live website (no coding, no card, €0)

You will do **4 parts, all clicking**:
A) put the site on GitHub · B) publish it on Vercel (free subdomain) ·
C) create the free database on Supabase · D) make yourself admin.

Total time: about 45 minutes. You never write code. When I say *copy*, copy the
**whole content** of a file from this folder (open it, select all with Ctrl+A,
Ctrl+C).

---

## Part A — GitHub (where your site's files live)

1. Go to **https://github.com** → **Sign up** (free account, your own e-mail).
2. Confirm your e-mail from the message GitHub sends you.
3. Top-right **"+"** → **New repository**.
4. Repository name: `catering-moldova` → keep **Public** → **do not** tick
   "Add a README" → click **Create repository**.
5. On the new empty page click **uploading an existing file** (the blue link).
6. Open this `catering-moldova` folder on your computer, select **everything
   inside it** (folders `src`, `public`, `supabase`, `docs`, `tools` and all
   loose files), and drag them into the browser window.
   ⚠️ Do **not** drag the folders `node_modules` or `.next` (they don't exist
   yet if you received this as a ZIP — good).
7. Wait for the upload to finish (a few minutes), then scroll down,
   commit message: `first upload`, click **Commit changes**.
   ⚠️ **Never rename any file or folder** to make an upload "easier" — names
   like `[lang]`, `[slug]`, `firma/[slug]` (with square brackets) are part of
   the code. This zip's folder names all upload cleanly on GitHub; if one ever
   refuses, stop and tell me instead of renaming.

✅ Done. Your code is safely stored.

---

## Part B — Vercel (free hosting + free address)

1. Go to **https://vercel.com** → **Sign Up** → **Continue with GitHub**.
2. Authorise Vercel to see your GitHub account.
3. Click **Add New… → Project**.
4. Find `catering-moldova` in the list → click **Import**.
5. Vercel automatically detects **Next.js**. Do not change framework.
6. **Environment Variables** (this box is on the same page, click the arrow to
   open it). Add these 3 rows *now* if you already created Supabase (Part C);
   otherwise skip and come back in Part C step 9:

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SITE_URL` | `https://catering-moldova.vercel.app` (we fix it in step 8 if the address differs) |
   | `NEXT_PUBLIC_SUPABASE_URL` | (from Supabase, Part C step 8) |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (from Supabase, Part C step 8) |
   | `SUPABASE_SERVICE_ROLE_KEY` | (from Supabase, Part C step 8 — **secret**) |

7. Click **Deploy**. Wait ~2 minutes.
8. Vercel shows your live address, something like
   `https://catering-moldova.vercel.app`. **Copy it.**
   - If the address is *not* `catering-moldova.vercel.app`: go to
     **Settings → Environment Variables**, correct
     `NEXT_PUBLIC_SITE_URL` to the real address, then
     **Deployments → ⋯ → Redeploy** (tick "Use existing cache" = **off**).
9. Open your address in a browser. You should see the homepage in Romanian.
   Until Supabase is connected, the site runs in **demo mode** with example
   companies (a small note appears in the footer). That is intentional: your
   site is already live and indexable while you finish Part C.

✅ Your site is on the internet at €0.

---

## Part C — Supabase (free database, logins, photos)

1. Go to **https://supabase.com** → **Start your project** → sign up with
   GitHub (easiest) or e-mail.
2. **New project**:
   - Name: `catering-moldova`
   - Database password: click the dice, then **copy the password into a notes
     file on your computer** (you will rarely need it, but keep it).
   - Region: **Europe (Frankfurt)** `eu-central-1` (closest to Moldova).
   - Free plan → **Create new project**. Wait ~1 minute.
3. Left menu → **SQL Editor** → **New query**.
4. Open the file `supabase/01-schema.sql` on your computer, copy **everything**,
   paste into the editor, click **Run** (bottom right). Wait for "Success".
5. **New query** again → paste the whole content of `supabase/02-seed.sql` →
   **Run**. This loads:
   - 33 Moldovan cities (Chișinău, Bălți, Cahul, Orhei, Ungheni, Soroca,
     Comrat + all districts),
   - 19 categories (nunți, corporate, botezuri, cumătrii, candy bar…),
   - cuisines & dietary options, homepage texts, and
   - 12 example companies whose address starts with `demo-`
     (delete them later — see RUNBOOK, chapter 7).
6. Left menu → **Storage**: you should see a bucket called **media**
   (public). If it is missing, re-run step 4.
7. Left menu → **Authentication → Providers → Email**: keep it **Enabled**.
   - *Recommended for a simple start:* switch **Confirm email** to **OFF**
     (users can sign in immediately; you still approve every company manually
     before it becomes public). If you prefer e-mail confirmation, leave it ON.
8. Left menu → **Project Settings (gear) → API**. Copy these three values:
   - **Project URL** → this is `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key (click "Reveal") → `SUPABASE_SERVICE_ROLE_KEY`
     ⚠️ never share this one, never put it in the browser.
9. Back to **Vercel → your project → Settings → Environment Variables**:
   add the 4 rows from Part B step 6 with the real values → **Save** →
   **Deployments → ⋯ (latest) → Redeploy** (cache off). Wait ~2 minutes.
10. Open your site again: the footer note about demo mode is gone. The site now
    reads and writes your real database.

✅ Database connected.

---

## Part D — create the ADMIN account and a TEST company

**Admin (you):**
1. On your site: top-right **Intrare** → **Creează cont** (or
   `/ro/cont/inregistrare`). Register with **your own e-mail**,
   company name e.g. `Admin Test`, city Chișinău, a strong password.
2. Supabase → **Table Editor** → table **profiles** → find the row with your
   e-mail-id → double-click the cell `role` (value `firm`) → type `admin` →
   press **Enter**. (The id matches: Table Editor → **auth** → **users** shows
   e-mail ↔ id if you need to check.)
3. Reload your site, sign in → you now see the **Administrare** button and the
   tab **Administrare** inside `/ro/cont`.

**Test company (to try the whole flow):**
1. Open your site in a **private/incognito window**.
2. `/ro/cont/inregistrare` → register as `Catering Test SRL`, city Bălți,
   another e-mail you own (e.g. `you+test@gmail.com`).
3. Sign in → **Profilul firmei**: fill description, phone, WhatsApp, price
   from, guests, tick cuisines/events; upload 3–6 photos.
   → **Servicii**: add 2 menus with prices → **Save**.
4. As **admin** (normal window): **Administrare → Firme** → the test company is
   in *În așteptare* → click **Aprobă**. It instantly appears in search,
   on `/ro/catering-balti` and in the sitemap.
5. As the test company: **Cereri** — send an inquiry from the public profile
   page (incognito, visitor side) and watch it arrive in the dashboard.

✅ Everything in the acceptance list now works end-to-end.

---

## Optional but recommended (10 minutes)

- `docs/03-SEO-GOOGLE.md` — connect Google Search Console + submit the sitemap,
  and create the Google Business Profile entries.
- In Vercel: **Settings → Domains** — only if one day you buy a domain.
  Until then the free `*.vercel.app` address is perfectly fine for Google.

## If something looks broken

| Symptom | Fix |
|---|---|
| Footer says "demo mode" | Part C step 9 not done (env vars + Redeploy). |
| Sign-in fails right after registering | Confirmation e-mail pending (Part C step 7) — open the mail, or switch Confirm email OFF and register again. |
| Photos won't upload | File > 5 MB or not JPG/PNG/WebP. |
| Company not visible publicly | Not approved yet (Administrare → Firme) or profile is "Ascuns". |
| Blank page after redeploy | Vercel → Deployments → open the failed deploy → read the red line; usually a missing env var. |
