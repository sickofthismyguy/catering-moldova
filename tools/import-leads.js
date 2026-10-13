/* Converts leads/leads.csv into a paste-ready Supabase import (supabase/04-import-leads.sql).
 * Imported firms are PRIVATE LEADS: status='pending', published=false, verified=false,
 * no photos, no descriptions — facts only, with provenance in source_url/source_note.
 * Usage:  node tools/import-leads.js [path/to/leads.csv]
 */
const fs = require('fs');
const path = require('path');

const csvPath = process.argv[2] || path.join(__dirname, '..', 'leads', 'leads.csv');
const raw = fs.readFileSync(csvPath, 'utf8').replace(/^\uFEFF/, '');

/* tiny CSV parser (handles quotes + commas) */
function parseCSV(text) {
  const rows = [];
  let row = [], field = '', inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') inQ = false;
      else field += c;
    } else if (c === '"') inQ = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.some((x) => x.trim() !== '')) rows.push(row);
      row = [];
    } else field += c;
  }
  row.push(field);
  if (row.some((x) => x.trim() !== '')) rows.push(row);
  return rows;
}

const rows = parseCSV(raw);
const header = rows.shift().map((h) => h.trim());
const q = (v) => (!v || !v.trim() ? 'null' : `'${v.trim().replace(/'/g, "''")}'`);
const slugify = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);

const out = [];
out.push(`-- ============================================================================
--  LEAD IMPORT — generated ${new Date().toISOString().slice(0, 10)} from ${path.basename(csvPath)}
--  These are PRIVATE LEADS: status='pending' + published=false means they are
--  INVISIBLE to visitors and to Google until you approve them (Admin -> Firme).
--  Facts only (name/city/phone/email/website + provenance). No photos or texts
--  were copied from anywhere — keep it that way when you complete a profile.
--  Paste into Supabase -> SQL Editor -> Run. Safe to re-run (duplicates skipped).
-- ============================================================================

insert into public.firms (id,name,slug,city,phone,whatsapp,email,website,source_url,source_note,status,published,verified,currency,gallery) values`);

const seen = new Set();
rows.forEach((r, i) => {
  const o = {};
  header.forEach((h, j) => (o[h] = (r[j] || '').trim()));
  if (!o.name) return;
  const slug = slugify(o.name) || `lead-${i + 1}`;
  if (seen.has(slug)) return;
  seen.add(slug);
  const id = `00000000-0000-4003-8000-${String(i + 1).padStart(12, '0')}`;
  out.push(`  (${q(id)},${q(o.name)},${q(slug)},${q(o.city) || 'null'},${q(o.phone)},${q(o.whatsapp)},${q(o.email)},${q(o.website)},${q(o.source_url)},${q(o.note)},'pending',false,false,'MDL','[]'::jsonb)`);
});
out[out.length - 1] = out[out.length - 1];
const body = out.join('\n');
const sql = body.replace(/\)\n(\s*)\(/g, '),\n$1(') + '\n  on conflict (slug) do nothing;\n';

const dest = path.join(__dirname, '..', 'supabase', '04-import-leads.sql');
fs.writeFileSync(dest, sql);
console.log('wrote', dest, '| leads:', rows.length);
