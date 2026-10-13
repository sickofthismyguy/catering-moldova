/* Generates supabase/02-seed.sql from the single source of truth: src/lib/demo.ts */
const { demoCities, demoCategories, demoCuisines, demoDietary, demoFirms, demoServices, demoReviews, demoSettings } = require('/tmp/genseed/demo.js');
const fs = require('fs');

const q = (v) => {
  if (v === null || v === undefined) return 'null';
  if (typeof v === 'number') return String(v);
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  return `'${String(v).replace(/'/g, "''")}'`;
};
const arr = (v) => (v && v.length ? `'{"${v.join('","')}"}'` : `'{}'`);
const jsonb = (v) => `'${JSON.stringify(v ?? []).replace(/'/g, "''")}'::jsonb`;
const num = (v) => (v === null || v === undefined || v === '' ? 'null' : String(v));

const out = [];
out.push(`-- ============================================================================
--  CATERING MOLDOVA — SEED DATA  (run ONCE after 01-schema.sql)
--  Cities of Moldova, event/service categories, cuisines, dietary options,
--  site settings and a few EXAMPLE firms (slugs start with "demo-").
--  Delete examples later with:  delete from public.firms where slug like 'demo-%';
--  Generated automatically from src/lib/demo.ts — do not edit by hand.
-- ============================================================================
`);

// cities
out.push('insert into public.cities (slug,name_ro,name_ru,name_en,region_ro,region_ru,region_en,lat,lng,population,priority,active) values');
out.push(demoCities.map((c) => `  (${q(c.slug)},${q(c.name_ro)},${q(c.name_ru)},${q(c.name_en)},${q(c.region_ro)},${q(c.region_ru)},${q(c.region_en)},${num(c.lat)},${num(c.lng)},${num(c.population)},${num(c.priority)},true)`).join(',\n') + '\n  on conflict (slug) do update set name_ro=excluded.name_ro,name_ru=excluded.name_ru,name_en=excluded.name_en,region_ro=excluded.region_ro,region_ru=excluded.region_ru,region_en=excluded.region_en,lat=excluded.lat,lng=excluded.lng,population=excluded.population,priority=excluded.priority;');

// categories
out.push('\ninsert into public.categories (slug,kind,name_ro,name_ru,name_en,description_ro,description_ru,icon,priority,active) values');
out.push(demoCategories.map((c) => `  (${q(c.slug)},${q(c.kind)},${q(c.name_ro)},${q(c.name_ru)},${q(c.name_en)},${q(c.description_ro)},${q(c.description_ru)},${q(c.icon)},${num(c.priority)},true)`).join(',\n') + '\n  on conflict (slug) do update set kind=excluded.kind,name_ro=excluded.name_ro,name_ru=excluded.name_ru,name_en=excluded.name_en,description_ro=excluded.description_ro,description_ru=excluded.description_ru,icon=excluded.icon,priority=excluded.priority;');

// taxonomies
out.push('\ninsert into public.taxonomies (kind,slug,name_ro,name_ru,name_en,active) values');
out.push([...demoCuisines, ...demoDietary].map((t) => `  (${q(t.kind)},${q(t.slug)},${q(t.name_ro)},${q(t.name_ru)},${q(t.name_en)},true)`).join(',\n') + '\n  on conflict (kind, slug) do update set name_ro=excluded.name_ro,name_ru=excluded.name_ru,name_en=excluded.name_en;');

// settings (do not overwrite admin edits)
out.push('\ninsert into public.settings (key,value) values');
out.push(Object.entries(demoSettings).map(([k, v]) => `  (${q(k)},'${JSON.stringify(v).replace(/'/g, "''")}'::jsonb)`).join(',\n') + '\n  on conflict (key) do nothing;');

// firms (deterministic ids)
const firmId = (i) => `00000000-0000-4000-8000-${String(i).padStart(12, '0')}`;
out.push('\ninsert into public.firms (id,owner_id,name,slug,tagline_ro,tagline_ru,description_ro,description_ru,city,region,address,phone,whatsapp,email,website,logo_url,gallery,price_from,currency,min_guests,max_guests,cuisines,event_types,dietary,map_lat,map_lng,verified,published,status,views) values');
out.push(demoFirms.map((f, i) => `  (${q(firmId(i + 1))},null,${q(f.name)},${q(f.slug)},${q(f.tagline_ro)},${q(f.tagline_ru)},${q(f.description_ro)},${q(f.description_ru)},${q(f.city)},${q(f.region)},${q(f.address)},${q(f.phone)},${q(f.whatsapp)},${q(f.email)},${q(f.website)},null,${jsonb(f.gallery)},${num(f.price_from)},${q(f.currency)},${num(f.min_guests)},${num(f.max_guests)},${arr(f.cuisines)},${arr(f.event_types)},${arr(f.dietary)},${num(f.map_lat)},${num(f.map_lng)},${f.verified ? 'true' : 'false'},true,'approved',${num(f.views)})`).join(',\n') + '\n  on conflict (slug) do nothing;');

// services
out.push('\ninsert into public.services (id,firm_id,title_ro,title_ru,description_ro,description_ru,category,price,price_type,unit,image_url,active,sort) values');
const svcRows = [];
demoServices.forEach((s) => {
  const firmIndex = demoFirms.findIndex((f) => f.id === s.firm_id);
  svcRows.push(`  (${q('00000000-0000-4001-8000-' + String(svcRows.length + 1).padStart(12, '0'))},${q(firmId(firmIndex + 1))},${q(s.title_ro)},${q(s.title_ru)},${q(s.description_ro)},${q(s.description_ru)},${q(s.category)},${num(s.price)},${q(s.price_type)},${q(s.unit)},${q(s.image_url)},true,${num(s.sort)})`);
});
out.push(svcRows.join(',\n') + '\n  on conflict (id) do nothing;');

// reviews (approved examples)
out.push('\ninsert into public.reviews (id,firm_id,author_name,rating,title,body,status,created_at) values');
out.push(demoReviews.map((r, i) => {
  const firmIndex = demoFirms.findIndex((f) => f.id === r.firm_id);
  return `  (${q(`00000000-0000-4002-8000-${String(i + 1).padStart(12, '0')}`)},${q(firmId(firmIndex + 1))},${q(r.author_name)},${r.rating},${q(r.title)},${q(r.body)},'approved',${q(r.created_at)})`;
}).join(',\n') + '\n  on conflict (id) do nothing;');

// restore the curated rating numbers (the review trigger recalculates from rows above)
out.push('\nupdate public.firms f set rating_avg = v.avg, rating_count = v.cnt from (values');
out.push(demoFirms.map((f, i) => `  (${q(firmId(i + 1))},${num(f.rating_avg)},${num(f.rating_count)})`).join(',\n') + `\n) as v(id, avg, cnt) where f.id = v.id::uuid;`);

fs.writeFileSync(__dirname + '/../supabase/02-seed.sql', out.join('\n') + '\n');
console.log('seed written', fs.statSync(__dirname + '/../supabase/02-seed.sql').size, 'bytes');
