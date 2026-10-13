-- ============================================================================
--  LEAD IMPORT — generated 2026-09-26 from leads.csv
--  These are PRIVATE LEADS: status='pending' + published=false means they are
--  INVISIBLE to visitors and to Google until you approve them (Admin -> Firme).
--  Facts only (name/city/phone/email/website + provenance). No photos or texts
--  were copied from anywhere — keep it that way when you complete a profile.
--  Paste into Supabase -> SQL Editor -> Run. Safe to re-run (duplicates skipped).
-- ============================================================================

insert into public.firms (id,name,slug,city,phone,whatsapp,email,website,source_url,source_note,status,published,verified,currency,gallery) values
  ('00000000-0000-4003-8000-000000000001','Kulinarium','kulinarium','chisinau','+37360175577',null,null,'https://www.kulinarium.md','https://www.kulinarium.md/catering-nunta','Catering nunți/cumetrii Chișinău; banchet de la 500 MDL/pers. (info public de pe site, de confirmat la claim)','pending',false,false,'MDL','[]'::jsonb),
  ('00000000-0000-4003-8000-000000000002','Odelle','odelle','chisinau','+37361223333',null,null,'https://odelle.md','https://odelle.md/catering','Catering cu livrare la domiciliu; adresa publicată: str. Mihai Eminescu 70, Chișinău','pending',false,false,'MDL','[]'::jsonb),
  ('00000000-0000-4003-8000-000000000003','Camelot','camelot','chisinau','+37379373866',null,'camelot.restaurant@proton.me','https://www.camelot.restaurant','https://www.camelot.restaurant/contact','Meniu tradițional & catering premium; program 8:00-21:00','pending',false,false,'MDL','[]'::jsonb),
  ('00000000-0000-4003-8000-000000000004','UAU Catering','uau-catering','anenii-noi','+37360534300',null,'uaucatering@gmail.com','https://uaucatering.md','https://uaucatering.md','s. Puhăceni, r-nul Anenii Noi','pending',false,false,'MDL','[]'::jsonb),
  ('00000000-0000-4003-8000-000000000005','Credem Eco','credem-eco',null,'+37360300099',null,'manager.credemeco@gmail.com','https://credem.md','https://credem.md/ro/','Catering pentru sărbători de orice format; orașul de confirmat la claim','pending',false,false,'MDL','[]'::jsonb),
  ('00000000-0000-4003-8000-000000000006','Catering și Logistică Evenimente (Civic)','catering-si-logistica-evenimente-civic',null,'+37379528276',null,'support@portal.civic.md','https://civic.md','https://civic.md/catering-si-logistica-evenimente.html','Catering pentru organizații și companii; telefon fix alternativ 026092211','pending',false,false,'MDL','[]'::jsonb),
  ('00000000-0000-4003-8000-000000000007','Grand Gurmand','grand-gurmand','orhei','+37369066654',null,null,null,'https://www.tiktok.com/@grand.gurmand.rest','Restaurant Orhei, catering evenimente; contact din postare publică','pending',false,false,'MDL','[]'::jsonb),
  ('00000000-0000-4003-8000-000000000008','Personal Chef Team','personal-chef-team',null,null,null,null,'https://www.facebook.com/personalchefteam/','https://www.facebook.com/personalchefteam/','Deservește evenimente pe tot teritoriul RM; telefon de completat la claim','pending',false,false,'MDL','[]'::jsonb)
  on conflict (slug) do nothing;
