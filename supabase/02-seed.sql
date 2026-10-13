-- ============================================================================
--  CATERING MOLDOVA — SEED DATA  (run ONCE after 01-schema.sql)
--  Cities of Moldova, event/service categories, cuisines, dietary options,
--  site settings and a few EXAMPLE firms (slugs start with "demo-").
--  Delete examples later with:  delete from public.firms where slug like 'demo-%';
--  Generated automatically from src/lib/demo.ts — do not edit by hand.
-- ============================================================================

insert into public.cities (slug,name_ro,name_ru,name_en,region_ro,region_ru,region_en,lat,lng,population,priority,active) values
  ('chisinau','Chișinău','Кишинёв','Chișinău','Municipiul Chișinău','Муниципий Кишинёв','Chișinău Municipality',47.0105,28.8638,532513,100,true),
  ('balti','Bălți','Бельцы','Bălți','Municipiul Bălți','Муниципий Бельцы','Bălți Municipality',47.9281,27.9284,97930,95,true),
  ('cahul','Cahul','Кагул','Cahul','Raionul Cahul','Кагульский район','Cahul District',45.9017,28.1914,32900,90,true),
  ('orhei','Orhei','Оргеев','Orhei','Raionul Orhei','Оргеевский район','Orhei District',47.3831,28.8231,21800,85,true),
  ('ungheni','Ungheni','Унгены','Ungheni','Raionul Ungheni','Унгенский район','Ungheni District',47.2053,27.7944,30800,82,true),
  ('soroca','Soroca','Сороки','Soroca','Raionul Soroca','Сорокский район','Soroca District',48.1567,28.2856,22800,80,true),
  ('comrat','Comrat','Комрат','Comrat','UTA Găgăuzia','АТО Гагаузия','Gagauzia',46.3006,28.6553,20900,78,true),
  ('hincesti','Hîncești','Гынчешты','Hîncești','Raionul Hîncești','Гынчештский район','Hîncești District',46.8281,28.5839,12600,60,true),
  ('calarasi','Călărași','Калараш','Călărași','Raionul Călărași','Каларашский район','Călărași District',47.2519,28.2831,14500,58,true),
  ('straseni','Strășeni','Страшены','Strășeni','Raionul Strășeni','Страшенский район','Strășeni District',47.145,28.6136,19100,56,true),
  ('ialoveni','Ialoveni','Яловены','Ialoveni','Raionul Ialoveni','Яловенский район','Ialoveni District',46.8667,28.7833,12600,54,true),
  ('anenii-noi','Anenii Noi','Новые Анены','Anenii Noi','Raionul Anenii Noi','Новоаненский район','Anenii Noi District',46.8822,29.2364,8500,52,true),
  ('ceadir-lunga','Ceadîr-Lunga','Чадыр-Лунга','Ceadîr-Lunga','UTA Găgăuzia','АТО Гагаузия','Gagauzia',46.3058,28.8144,17400,50,true),
  ('edinet','Edineț','Единцы','Edineț','Raionul Edineț','Единецкий район','Edineț District',48.1678,27.2994,15500,48,true),
  ('floresti','Florești','Флорешты','Florești','Raionul Florești','Флорештский район','Florești District',47.8917,28.2906,13600,46,true),
  ('cimislia','Cimișlia','Чимишлия','Cimișlia','Raionul Cimișlia','Чимишлийский район','Cimișlia District',46.5256,28.7831,12200,44,true),
  ('rezina','Rezina','Резина','Rezina','Raionul Rezina','Резинский район','Rezina District',47.7456,28.9603,10800,42,true),
  ('criuleni','Criuleni','Криуляны','Criuleni','Raionul Criuleni','Криулянский район','Criuleni District',47.1261,29.0547,7100,40,true),
  ('taraclia','Taraclia','Тараклия','Taraclia','Raionul Taraclia','Тараклийский район','Taraclia District',45.9,28.6667,8300,38,true),
  ('nisporeni','Nisporeni','Ниспорены','Nisporeni','Raionul Nisporeni','Ниспоренский район','Nisporeni District',47.0753,28.1769,12100,36,true),
  ('drochia','Drochia','Дрокиа','Drochia','Raionul Drochia','Дрокиевский район','Drochia District',48.035,27.8161,16600,34,true),
  ('singerei','Sîngerei','Сынжерей','Sîngerei','Raionul Sîngerei','Сынжерейский район','Sîngerei District',47.6389,28.1386,12400,32,true),
  ('telenesti','Telenești','Теленешты','Telenești','Raionul Telenești','Теленештский район','Telenești District',47.4997,28.3656,6600,30,true),
  ('leova','Leova','Леова','Leova','Raionul Leova','Леовский район','Leova District',46.4811,28.2544,9800,28,true),
  ('stefan-voda','Ștefan Vodă','Штефан-Водэ','Ștefan Vodă','Raionul Ștefan Vodă','Штефан-Водский район','Ștefan Vodă District',46.5153,29.6639,7100,26,true),
  ('vulcanesti','Vulcănești','Вулканешты','Vulcănești','UTA Găgăuzia','АТО Гагаузия','Gagauzia',45.6833,28.4,12200,24,true),
  ('falesti','Fălești','Фалешты','Fălești','Raionul Fălești','Фалештский район','Fălești District',47.5742,27.7139,14900,22,true),
  ('glodeni','Glodeni','Глодяны','Glodeni','Raionul Glodeni','Глодянский район','Glodeni District',47.7789,27.5167,9200,20,true),
  ('riscani','Rîșcani','Рышканы','Rîșcani','Raionul Rîșcani','Рышканский район','Rîșcani District',47.9531,27.5639,11400,18,true),
  ('soldanesti','Șoldănești','Шолданешты','Șoldănești','Raionul Șoldănești','Шолданештский район','Șoldănești District',47.8131,28.7903,6300,16,true),
  ('basarabeasca','Basarabeasca','Бессарабка','Basarabeasca','Raionul Basarabeasca','Бессарабский район','Basarabeasca District',46.3333,28.9,10700,14,true),
  ('cantemir','Cantemir','Кантемир','Cantemir','Raionul Cantemir','Кантемирский район','Cantemir District',46.2758,28.2,4300,12,true),
  ('ocnita','Ocnița','Окница','Ocnița','Raionul Ocnița','Окницкий район','Ocnița District',48.4108,27.4639,8300,10,true)
  on conflict (slug) do update set name_ro=excluded.name_ro,name_ru=excluded.name_ru,name_en=excluded.name_en,region_ro=excluded.region_ro,region_ru=excluded.region_ru,region_en=excluded.region_en,lat=excluded.lat,lng=excluded.lng,population=excluded.population,priority=excluded.priority;

insert into public.categories (slug,kind,name_ro,name_ru,name_en,description_ro,description_ru,icon,priority,active) values
  ('nunti','event','Nunți','Свадьбы','Weddings','Catering pentru nunți: meniuri complete, servire cu personal, candy bar și tort.','Кейтеринг для свадеб: полное меню, обслуживание персоналом, кэнди-бар и торт.','rings',100,true),
  ('corporate','event','Corporate','Корпоратив','Corporate','Coffee break, prânzuri pentru birou, petreceri corporative și team building.','Кофе-брейк, обеды для офиса, корпоративные вечеринки и тимбилдинг.','briefcase',95,true),
  ('aniversari','event','Aniversări și zile de naștere','Юбилеи и дни рождения','Birthdays','Meniuri pentru zile de naștere, aniversări și petreceri private.','Меню для дней рождения, юбилеев и частных вечеринок.','cake',90,true),
  ('botezuri','event','Botezuri','Крестины','Christenings','Catering pentru botez și cumătrie, cu meniuri delicate și aranjamente la masă.','Кейтеринг на крестины и кумэтрию.','dove',85,true),
  ('cumatrii','event','Cumătrii','Кумэтрии','Godparent parties',null,null,'party',80,true),
  ('conferinte','event','Conferințe și traininguri','Конференции и тренинги','Conferences',null,null,'mic',75,true),
  ('banchete','event','Banchete și absolviri','Банкеты и выпускные','Banquets',null,null,'glass',70,true),
  ('aer-liber','event','Petreceri în aer liber','Праздники на природе','Outdoor parties',null,null,'leaf',65,true),
  ('catering-acasa','event','Catering la domiciliu','Кейтеринг на дому','Home catering',null,null,'home',60,true),
  ('meniu-complet','service','Meniu complet','Полное меню','Full menu',null,null,null,100,true),
  ('bufet-suedez','service','Bufet suedez','Шведский стол','Buffet',null,null,null,95,true),
  ('candy-bar','service','Candy bar','Кэнди-бар','Candy bar',null,null,null,90,true),
  ('torturi-deserturi','service','Torturi și deserturi','Торты и десерты','Cakes & desserts',null,null,null,85,true),
  ('grill-bbq','service','Grătar & BBQ','Гриль и BBQ','Grill & BBQ',null,null,null,80,true),
  ('bar-cocktail','service','Bar & cocktailuri','Бар и коктейли','Bar & cocktails',null,null,null,75,true),
  ('servire-personal','service','Servire cu personal','Обслуживание персоналом','Staffed service',null,null,null,70,true),
  ('inchirieri','service','Închirieri mese și scaune','Аренда столов и стульев','Furniture rental',null,null,null,65,true),
  ('livrare','service','Livrare la locație','Доставка на локацию','Delivery',null,null,null,60,true),
  ('decor','service','Decor și aranjamente','Декор и оформление','Decor',null,null,null,55,true)
  on conflict (slug) do update set kind=excluded.kind,name_ro=excluded.name_ro,name_ru=excluded.name_ru,name_en=excluded.name_en,description_ro=excluded.description_ro,description_ru=excluded.description_ru,icon=excluded.icon,priority=excluded.priority;

insert into public.taxonomies (kind,slug,name_ro,name_ru,name_en,active) values
  ('cuisine','moldoveneasca','Moldovenească','Молдавская','Moldovan',true),
  ('cuisine','europeana','Europeană','Европейская','European',true),
  ('cuisine','romaneasca','Românească','Румынская','Romanian',true),
  ('cuisine','italiana','Italiană','Итальянская','Italian',true),
  ('cuisine','franceza','Franceză','Французская','French',true),
  ('cuisine','asiatica','Asiatică','Азиатская','Asian',true),
  ('cuisine','japoneza','Japoneză / sushi','Японская / суши','Japanese / sushi',true),
  ('cuisine','georgiana','Georgiană','Грузинская','Georgian',true),
  ('cuisine','greceasca','Grecească','Греческая','Greek',true),
  ('cuisine','mediteraneana','Mediteraneană','Средиземноморская','Mediterranean',true),
  ('cuisine','ucraineana','Ucraineană','Украинская','Ukrainian',true),
  ('cuisine','ruseasca','Rusească','Русская','Russian',true),
  ('cuisine','bbq','BBQ & grill','BBQ и гриль','BBQ & grill',true),
  ('cuisine','turceasca','Turcească / găgăuză','Турецкая / гагаузская','Turkish / Gagauz',true),
  ('cuisine','fusion','Fusion','Фьюжн','Fusion',true),
  ('dietary','vegetarian','Vegetarian','Вегетарианское','Vegetarian',true),
  ('dietary','vegan','Vegan','Веганское','Vegan',true),
  ('dietary','fara-gluten','Fără gluten','Без глютена','Gluten-free',true),
  ('dietary','fara-lactoza','Fără lactoză','Без лактозы','Dairy-free',true),
  ('dietary','halal','Halal','Халяль','Halal',true),
  ('dietary','kosher','Kosher','Кошер','Kosher',true),
  ('dietary','fara-porc','Fără porc','Без свинины','Pork-free',true),
  ('dietary','meniu-copii','Meniu pentru copii','Детское меню','Kids menu',true),
  ('dietary','fara-nuci','Fără nuci și alune','Без орехов','Nut-free',true)
  on conflict (kind, slug) do update set name_ro=excluded.name_ro,name_ru=excluded.name_ru,name_en=excluded.name_en;

insert into public.settings (key,value) values
  ('seo_title_template','"{firm} – Catering în {city} | {site}"'::jsonb),
  ('seo_description_ro','"Catering Moldova — găsește firme de catering în Chișinău, Bălți, Cahul și toată țara. Meniuri pentru nunți, corporate, botezuri și aniversări, cu prețuri și contacte."'::jsonb),
  ('seo_description_ru','"Кейтеринг в Молдове — компании Кишинёва, Бельц, Кагула и всей страны. Меню для свадеб, корпоративов, крестин и юбилеев: цены и контакты."'::jsonb),
  ('seo_description_en','"Catering in Moldova — compare catering companies in Chișinău, Bălți, Cahul and beyond. Wedding, corporate and party menus with prices and contacts."'::jsonb),
  ('hero_title_ro','"Găsește cateringul potrivit pentru evenimentul tău"'::jsonb),
  ('hero_title_ru','"Найдите подходящий кейтеринг для вашего события"'::jsonb),
  ('hero_subtitle_ro','"Compară firme de catering din Chișinău, Bălți, Cahul și toată Moldova. Meniuri, prețuri și contacte — într-un singur loc."'::jsonb),
  ('hero_subtitle_ru','"Сравните кейтеринговые компании Кишинёва, Бельц, Кагула и всей Молдовы. Меню, цены и контакты — в одном месте."'::jsonb),
  ('reviews_enabled','true'::jsonb),
  ('inquiries_enabled','true'::jsonb),
  ('contact_email','"contact@catering-moldova.example"'::jsonb),
  ('contact_phone','"+373 60 000 000"'::jsonb),
  ('footer_note_ro','""'::jsonb),
  ('footer_note_ru','""'::jsonb),
  ('featured_firm_ids','["demo-firm-2","demo-firm-10","demo-firm-1","demo-firm-12","demo-firm-3","demo-firm-9"]'::jsonb)
  on conflict (key) do nothing;

insert into public.firms (id,owner_id,name,slug,tagline_ro,tagline_ru,description_ro,description_ru,city,region,address,phone,whatsapp,email,website,logo_url,gallery,price_from,currency,min_guests,max_guests,cuisines,event_types,dietary,map_lat,map_lng,verified,published,status,views) values
  ('00000000-0000-4000-8000-000000000001',null,'Casa Bucatelor','demo-casa-bucatelor','Catering pentru nunți și banchete în Chișinău','Кейтеринг свадеб и банкетов в Кишинёве','Catering complet pentru nunți, cumătrii și banchete în Chișinău și împrejurimi. Meniuri moldovenești și europene, servire cu personal și aranjamente de masă incluse.','Полный кейтеринг свадеб, кумэтрий и банкетов в Кишинёве и окрестностях. Молдавское и европейское меню, обслуживание персоналом.','chisinau','Municipiul Chișinău','str. Trandafirilor 12, Chișinău','+373 69 111 222','+37369111222','contact@casabucatelor.example','',null,'["/img/demo/1.jpg","/img/demo/4.jpg","/img/demo/5.jpg"]'::jsonb,450,'MDL',30,400,'{"moldoveneasca","europeana","romaneasca"}','{"nunti","cumatrii","banchete"}','{"vegetarian","meniu-copii","fara-lactoza"}',47.0105,28.8638,true,true,'approved',1240),
  ('00000000-0000-4000-8000-000000000002',null,'Gust & Art','demo-gust-si-art','Catering premium și evenimente de business','Премиум кейтеринг и бизнес-события','Echipă specializată în catering corporate, conferințe și evenimente premium. Meniuri fusion, coffee break-uri, finger food și bar de cocktailuri.','Команда специализируется на корпоративном кейтеринге, конференциях и премиум-событиях. Фьюжн-меню, кофе-брейки, фингер-фуд и коктейль-бар.','chisinau','Municipiul Chișinău','bd. Ștefan cel Mare 128, Chișinău','+373 79 333 444','+37379333444','hello@gustart.example','',null,'["/img/demo/2.jpg","/img/demo/6.jpg","/img/demo/3.jpg"]'::jsonb,620,'MDL',20,800,'{"fusion","europeana","mediteraneana","italiana"}','{"corporate","conferinte","nunti"}','{"vegan","fara-gluten","vegetarian"}',47.0266,28.8416,true,true,'approved',2310),
  ('00000000-0000-4000-8000-000000000003',null,'Nord Catering','demo-nord-catering-balti','Cel mai mare catering din nordul Moldovei','Крупнейший кейтеринг на севере Молдовы','Servicii de catering în Bălți și raioanele din nord: nunți, cumătrii, corporate și livrare de meniuri la domiciliu. Bucătărie proprie și echipă de servire.','Кейтеринг в Бельцах и северных районах: свадьбы, кумэтрии, корпоративы и доставка меню на дом. Собственная кухня и команда обслуживания.','balti','Municipiul Bălți','str. Ștefan cel Mare 45, Bălți','+373 68 555 666','+37368555666','office@nordcatering.example','',null,'["/img/demo/4.jpg","/img/demo/1.jpg","/img/demo/2.jpg"]'::jsonb,380,'MDL',20,350,'{"moldoveneasca","europeana","ucraineana"}','{"nunti","cumatrii","corporate","catering-acasa"}','{"vegetarian","meniu-copii"}',47.9281,27.9284,true,true,'approved',890),
  ('00000000-0000-4000-8000-000000000004',null,'Cahul Fest Catering','demo-cahul-fest-catering','Catering în sudul Moldovei, Cahul și împrejurimi','Кейтеринг на юге Молдовы, Кагул и окрестности','Organizăm catering pentru nunți, zile de naștere și evenimente în aer liber în Cahul. Grătar, bufet suedez și meniuri pentru copii.','Кейтеринг для свадеб, дней рождения и праздников на природе в Кагуле. Гриль, шведский стол и детское меню.','cahul','Raionul Cahul','str. Victoriei 8, Cahul','+373 60 777 888','+37360777888','info@cahulfest.example','',null,'["/img/demo/5.jpg","/img/demo/3.jpg","/img/demo/6.jpg"]'::jsonb,320,'MDL',15,250,'{"moldoveneasca","bbq","europeana"}','{"aniversari","aer-liber","nunti"}','{"vegetarian","meniu-copii","fara-porc"}',45.9017,28.1914,false,true,'approved',430),
  ('00000000-0000-4000-8000-000000000005',null,'Plai Catering','demo-plai-catering-ungheni','Meniuri moldovenești autentice, Ungheni','Аутентичные молдавские меню, Унгены','Catering cu bucătărie moldovenească autentică în Ungheni: sarmale, plăcinte, răcituri, meniuri de post și opțiuni vegetariene.','Кейтеринг с аутентичной молдавской кухней в Унгенах: сармале, плацинды, постные и вегетарианские меню.','ungheni','Raionul Ungheni','str. Națională 21, Ungheni','+373 67 222 333','+37367222333','plai@example.md','',null,'["/img/demo/4.jpg","/img/demo/6.jpg"]'::jsonb,290,'MDL',10,200,'{"moldoveneasca","romaneasca"}','{"cumatrii","botezuri","aniversari","catering-acasa"}','{"vegetarian","vegan","fara-porc","meniu-copii"}',47.2053,27.7944,false,true,'approved',310),
  ('00000000-0000-4000-8000-000000000006',null,'Orhei Garden Catering','demo-orhei-garden-catering','Evenimente în aer liber lângă Orhei','Праздники на природе под Оргеевом','Catering pentru evenimente în aer liber, nunți la cort și petreceri corporate în zona Orhei. Echipamente de grill, mobilier și personal.','Кейтеринг для праздников на природе, свадеб под шатром и корпоративов в районе Оргеева. Гриль, мебель и персонал.','orhei','Raionul Orhei','str. Eminescu 3, Orhei','+373 69 444 555','+37369444555','garden@orheicatering.example','',null,'["/img/demo/5.jpg","/img/demo/1.jpg"]'::jsonb,350,'MDL',25,300,'{"bbq","europeana","moldoveneasca"}','{"aer-liber","nunti","corporate"}','{"fara-gluten","vegetarian"}',47.3831,28.8231,false,true,'approved',260),
  ('00000000-0000-4000-8000-000000000007',null,'Comrat Gastro','demo-comrat-gastro','Catering găgăuz și european în Comrat','Гагаузский и европейский кейтеринг в Комрате','Catering în Comrat și UTA Găgăuzia: meniuri găgăuze și europene, nunți, cumătrii, evenimente corporate și livrare.','Кейтеринг в Комрате и Гагаузии: гагаузские и европейские меню, свадьбы, кумэтрии, корпоративы и доставка.','comrat','UTA Găgăuzia','str. Lenin 15, Comrat','+373 62 888 999','+37362888999','gastro@comrat.example','',null,'["/img/demo/3.jpg","/img/demo/4.jpg"]'::jsonb,300,'MDL',15,250,'{"turceasca","moldoveneasca","europeana"}','{"nunti","cumatrii","corporate"}','{"halal","fara-porc","meniu-copii"}',46.3006,28.6553,false,true,'approved',240),
  ('00000000-0000-4000-8000-000000000008',null,'Soroca Events Catering','demo-soroca-events-catering','Botezuri, cumătrii și aniversări în Soroca','Крестины, кумэтрии и юбилеи в Сороках','Catering pentru evenimente de familie în Soroca și raionul Soroca. Meniuri delicate pentru botez, candy bar și servire cu personal.','Кейтеринг для семейных событий в Сороках и районе. Нежные меню на крестины, кэнди-бар и обслуживание.','soroca','Raionul Soroca','str. Independenței 5, Soroca','+373 68 121 212','+37368121212','events@soroca.example','',null,'["/img/demo/6.jpg","/img/demo/1.jpg"]'::jsonb,340,'MDL',10,180,'{"europeana","moldoveneasca"}','{"botezuri","cumatrii","aniversari"}','{"meniu-copii","fara-nuci","vegetarian"}',48.1567,28.2856,false,true,'approved',180),
  ('00000000-0000-4000-8000-000000000009',null,'Delicii Mobile','demo-delicii-mobile','Food truck și catering stradal','Фудтрак и стрит-кейтеринг','Food truck cu burgeri, wrap-uri și limonade pentru festivaluri, petreceri corporate și evenimente în aer liber în toată Moldova.','Фудтрак с бургерами, роллами и лимонадами для фестивалей, корпоративов и праздников по всей Молдове.','chisinau','Municipiul Chișinău','Chișinău (mobil)','+373 79 909 909','+37379909909','truck@delicii.example','',null,'["/img/demo/5.jpg","/img/demo/2.jpg"]'::jsonb,150,'MDL',40,1000,'{"bbq","fusion","europeana"}','{"aer-liber","corporate","aniversari"}','{"vegetarian","vegan","fara-lactoza"}',46.99,28.83,true,true,'approved',1560),
  ('00000000-0000-4000-8000-000000000010',null,'Sweet Story','demo-sweet-story','Torturi, candy bar și deserturi la comandă','Торты, кэнди-бар и десерты на заказ','Cofetărie și catering de deserturi în Chișinău: torturi personalizate, candy bar, mese de deserturi pentru nunți și evenimente corporate.','Кондитерская и десертный кейтеринг в Кишинёве: торты на заказ, кэнди-бар, десертные столы для свадеб и корпоративов.','chisinau','Municipiul Chișinău','str. București 68, Chișinău','+373 60 313 131','+37360313131','sweet@example.md','',null,'["/img/demo/6.jpg","/img/demo/3.jpg"]'::jsonb,200,'MDL',10,500,'{"europeana","franceza"}','{"nunti","aniversari","corporate","botezuri"}','{"fara-gluten","fara-lactoza","vegan","meniu-copii"}',47.0198,28.8405,true,true,'approved',2980),
  ('00000000-0000-4000-8000-000000000011',null,'Hîncești Banquet','demo-hincesti-banquet','Banchete și nunți în Hîncești','Банкеты и свадьбы в Гынчештах','Organizăm banchete, nunți și evenimente corporate în Hîncești și raion. Sală proprie, catering la locația ta și meniuri la alegere.','Банкеты, свадьбы и корпоративы в Гынчештах и районе. Собственный зал и выездной кейтеринг.','hincesti','Raionul Hîncești','str. Ștefan cel Mare 2, Hîncești','+373 67 707 707','+37367707707','banquet@hincesti.example','',null,'["/img/demo/1.jpg","/img/demo/4.jpg"]'::jsonb,310,'MDL',30,220,'{"moldoveneasca","europeana"}','{"banchete","nunti","corporate"}','{"vegetarian","meniu-copii"}',46.8281,28.5839,false,true,'approved',150),
  ('00000000-0000-4000-8000-000000000012',null,'Vegan Kitchen Catering','demo-vegan-kitchen-catering','Catering vegan și vegetarian în Moldova','Веганский и вегетарианский кейтеринг в Молдове','Meniuri 100% vegetale pentru evenimente private și corporate. Livrăm în Chișinău și în toată Moldova, cu opțiuni fără gluten și fără lactoză.','100% растительные меню для частных и корпоративных событий. Доставка по Кишинёву и всей Молдове, опции без глютена и лактозы.','chisinau','Municipiul Chișinău','str. Armenească 44, Chișinău','+373 60 555 000','+37360555000','vegan@example.md','',null,'["/img/demo/3.jpg","/img/demo/2.jpg"]'::jsonb,280,'MDL',10,300,'{"mediteraneana","asiatica","fusion"}','{"corporate","aer-liber","aniversari"}','{"vegan","vegetarian","fara-gluten","fara-lactoza","fara-nuci"}',47.0146,28.8516,true,true,'approved',720)
  on conflict (slug) do nothing;

insert into public.services (id,firm_id,title_ro,title_ru,description_ro,description_ru,category,price,price_type,unit,image_url,active,sort) values
  ('00000000-0000-4001-8000-000000000001','00000000-0000-4000-8000-000000000001','Meniu de nuntă clasic','Свадебное классическое меню','Trei feluri calde, platouri reci, gustări și desert. Include servire cu chelneri și aranjamente de bază.','Три горячих блюда, холодные закуски, десерт. Обслуживание официантами включено.','meniu-complet',450,'per_person','MDL / persoană','/img/demo/1.jpg',true,1),
  ('00000000-0000-4001-8000-000000000002','00000000-0000-4000-8000-000000000001','Candy bar personalizat','Кэнди-бар на заказ','Masă cu deserturi, decor tematic și aranjament floral, pentru 50–300 de invitați.','Стол с десертами, тематический декор, 50–300 гостей.','candy-bar',6500,'per_event','MDL / eveniment','/img/demo/6.jpg',true,2),
  ('00000000-0000-4001-8000-000000000003','00000000-0000-4000-8000-000000000001','Bufet suedez corporate','Шведский стол для компаний','Prânz sau cină în format bufet, livrare și aranjare la birou.','Обед или ужин в формате буфета с доставкой в офис.','bufet-suedez',320,'per_person','MDL / persoană','/img/demo/2.jpg',true,3),
  ('00000000-0000-4001-8000-000000000004','00000000-0000-4000-8000-000000000002','Coffee break business','Бизнес кофе-брейк','Cafea de specialitate, patiserie, fructe și sandvișuri. Montare și servire incluse.','Спешелти-кофе, выпечка, фрукты и сэндвичи. Сервировка включена.','bufet-suedez',180,'per_person','MDL / persoană','/img/demo/2.jpg',true,1),
  ('00000000-0000-4001-8000-000000000005','00000000-0000-4000-8000-000000000002','Meniu premium fusion','Премиум фьюжн-меню','Cinci feluri, plating modern, somelier și personal de servire dedicat.','Пять подач, современный пейтинг, сомелье и выделенный персонал.','meniu-complet',980,'per_person','MDL / persoană','/img/demo/3.jpg',true,2),
  ('00000000-0000-4001-8000-000000000006','00000000-0000-4000-8000-000000000002','Bar de cocktailuri mobil','Мобильный коктейль-бар','Stație de bar cu doi barmeni, meniul de cocktailuri și gheață.','Барная станция, два бармена, коктейльное меню и лёд.','bar-cocktail',8500,'per_event','MDL / eveniment','/img/demo/6.jpg',true,3),
  ('00000000-0000-4001-8000-000000000007','00000000-0000-4000-8000-000000000003','Meniu de nuntă tradițional','Традиционное свадебное меню','Sarmale, friptură, platouri reci, plăcinte și tort inclus.','Сармале, жаркое, холодные закуски, плацинды и торт.','meniu-complet',380,'per_person','MDL / persoană','/img/demo/4.jpg',true,1),
  ('00000000-0000-4001-8000-000000000008','00000000-0000-4000-8000-000000000003','Livrare meniuri la domiciliu','Доставка меню на дом','Pachete pentru 6–20 de persoane, livrare în Bălți și raioanele vecine.','Пакеты на 6–20 человек, доставка по Бельцам и соседним районам.','livrare',250,'per_person','MDL / persoană','/img/demo/2.jpg',true,2),
  ('00000000-0000-4001-8000-000000000009','00000000-0000-4000-8000-000000000004','Grătar & BBQ la locația ta','Гриль и BBQ на вашей локации','Stație de grill cu bucătar, garnituri și sosuri. Minim 15 persoane.','Гриль-станция с поваром, гарниры и соусы. Минимум 15 человек.','grill-bbq',320,'per_person','MDL / persoană','/img/demo/5.jpg',true,1),
  ('00000000-0000-4001-8000-000000000010','00000000-0000-4000-8000-000000000004','Pachet aniversare copii','Детский пакет на день рождения','Meniu pentru copii, deserturi și decor colorat.','Детское меню, десерты и яркий декор.','meniu-complet',220,'per_person','MDL / copil','/img/demo/6.jpg',true,2),
  ('00000000-0000-4001-8000-000000000011','00000000-0000-4000-8000-000000000005','Meniu tradițional moldovenesc','Традиционное молдавское меню','Sarmale în foi de viță, mămăligă cu brânză, plăcinte coapte pe loc și răcituri.','Сармале в виноградных листьях, мамалыга с брынзой, плацинды и холодцы.','meniu-complet',290,'per_person','MDL / persoană','/img/demo/4.jpg',true,1),
  ('00000000-0000-4001-8000-000000000012','00000000-0000-4000-8000-000000000005','Meniu de post (vegan)','Постное (веганское) меню','Preparate fără produse de origine animală, ideale pentru petreceri de post.','Блюда без продуктов животного происхождения.','meniu-complet',240,'per_person','MDL / persoană','/img/demo/3.jpg',true,2),
  ('00000000-0000-4001-8000-000000000013','00000000-0000-4000-8000-000000000006','Pachet nuntă la cort','Пакет «свадьба под шатром»','Meniu complet, mobilier, veselă, servire și logistică pentru evenimente outdoor.','Полное меню, мебель, посуда, обслуживание и логистика для outdoor-событий.','meniu-complet',520,'per_person','MDL / persoană','/img/demo/5.jpg',true,1),
  ('00000000-0000-4001-8000-000000000014','00000000-0000-4000-8000-000000000006','Închiriere mobilier și veselă','Аренда мебели и посуды','Mese rotunde, scaune cu huse, veselă completă și tacâmuri.','Круглые столы, стулья с чехлами, полный набор посуды.','inchirieri',90,'per_person','MDL / persoană','/img/demo/1.jpg',true,2),
  ('00000000-0000-4001-8000-000000000015','00000000-0000-4000-8000-000000000007','Meniu găgăuz tradițional','Традиционное гагаузское меню','Specialități locale, plăcinte, carne la grătar și deserturi de casă.','Местные специалитеты, плацинды, мясо на гриле и домашние десерты.','meniu-complet',300,'per_person','MDL / persoană','/img/demo/3.jpg',true,1),
  ('00000000-0000-4001-8000-000000000016','00000000-0000-4000-8000-000000000007','Meniu halal','Халяльное меню','Preparate halal, fără carne de porc, pentru evenimente de familie.','Халяльные блюда без свинины для семейных событий.','meniu-complet',330,'per_person','MDL / persoană','/img/demo/4.jpg',true,2),
  ('00000000-0000-4001-8000-000000000017','00000000-0000-4000-8000-000000000008','Pachet botez','Пакет «крестины»','Meniu ușor, deserturi, decor în culori pastel și servire pentru 10–80 de invitați.','Лёгкое меню, десерты, пастельный декор, 10–80 гостей.','meniu-complet',340,'per_person','MDL / persoană','/img/demo/6.jpg',true,1),
  ('00000000-0000-4001-8000-000000000018','00000000-0000-4000-8000-000000000009','Food truck la eveniment','Фудтрак на событии','Stație mobilă cu doi bucătari, meniu street food și băuturi. Minim 40 de porții.','Мобильная станция, два повара, стрит-фуд меню и напитки. От 40 порций.','grill-bbq',150,'per_person','MDL / porție','/img/demo/5.jpg',true,1),
  ('00000000-0000-4001-8000-000000000019','00000000-0000-4000-8000-000000000010','Tort personalizat','Торт на заказ','Tort la alegere, 2–4 etaje, cu decor tematic și degustare înainte de comandă.','Торт 2–4 яруса с тематическим декором и дегустацией.','torturi-deserturi',650,'per_person','MDL / kg','/img/demo/6.jpg',true,1),
  ('00000000-0000-4001-8000-000000000020','00000000-0000-4000-8000-000000000010','Masă de deserturi','Десертный стол','Peste 12 tipuri de deserturi, decor și aranjament inclus.','Более 12 видов десертов, декор и сервировка включены.','candy-bar',200,'per_person','MDL / persoană','/img/demo/3.jpg',true,2),
  ('00000000-0000-4001-8000-000000000021','00000000-0000-4000-8000-000000000011','Meniu banchet','Банкетное меню','Meniu complet cu trei feluri calde, platouri și desert, servire inclusă.','Полное меню с тремя горячими блюдами, закуски и десерт.','meniu-complet',310,'per_person','MDL / persoană','/img/demo/1.jpg',true,1),
  ('00000000-0000-4001-8000-000000000022','00000000-0000-4000-8000-000000000012','Bufet vegan corporate','Веганский буфет для офиса','Buddha bowls, humus, salate, deserturi fără zahăr rafinat. Livrare și montare incluse.','Боулы, хумус, салаты, десерты без рафинированного сахара. Доставка и сервировка.','bufet-suedez',280,'per_person','MDL / persoană','/img/demo/3.jpg',true,1),
  ('00000000-0000-4001-8000-000000000023','00000000-0000-4000-8000-000000000012','Meniu eveniment vegan','Веганское меню для события','Trei feluri calde, aperitive și desert, pentru evenimente de la 20 de persoane.','Три горячих блюда, закуски и десерт, от 20 человек.','meniu-complet',340,'per_person','MDL / persoană','/img/demo/2.jpg',true,2)
  on conflict (id) do nothing;

insert into public.reviews (id,firm_id,author_name,rating,title,body,status,created_at) values
  ('00000000-0000-4002-8000-000000000001','00000000-0000-4000-8000-000000000001','Marina C.',5,'Nuntă reușită','Meniul a fost delicios, iar echipa foarte atentă. Toți invitații au lăudat sarmalele și candy bar-ul.','approved','2025-05-12T10:00:00Z'),
  ('00000000-0000-4002-8000-000000000002','00000000-0000-4000-8000-000000000001','Andrei P.',4,'Bun, dar puțin întârziat','Mâncarea excelentă, servirea a început cu 20 de minute mai târziu decât am stabilit.','approved','2025-04-02T10:00:00Z'),
  ('00000000-0000-4002-8000-000000000003','00000000-0000-4000-8000-000000000002','Elena D.',5,'Conferință impecabilă','Coffee break pentru 180 de persoane, totul la timp și foarte gustos. Recomand pentru evenimente de business.','approved','2025-06-20T10:00:00Z'),
  ('00000000-0000-4002-8000-000000000004','00000000-0000-4000-8000-000000000003','Igor V.',5,'Cel mai bun din Bălți','Am comandat pentru cumătrie, 120 de invitați. Porții mari, mâncare caldă, preț corect.','approved','2025-03-18T10:00:00Z'),
  ('00000000-0000-4002-8000-000000000005','00000000-0000-4000-8000-000000000004','Ana M.',4,'Grătar reușit','BBQ la ziua de naștere a tatălui, totul organizat bine. Ar fi ajutat mai multe opțiuni vegetariene.','approved','2025-07-01T10:00:00Z'),
  ('00000000-0000-4002-8000-000000000006','00000000-0000-4000-8000-000000000010','Victoria S.',5,'Tort de vis','Tortul pentru nuntă a fost exact ca în schiță, iar candy bar-ul a fost vedeta serii.','approved','2025-08-09T10:00:00Z'),
  ('00000000-0000-4002-8000-000000000007','00000000-0000-4000-8000-000000000012','Dumitru R.',5,'Opțiuni vegane serioase','Prima dată când colegii mei vegani au mâncat la fel de bine ca toată lumea. Felicitări!','approved','2025-07-22T10:00:00Z'),
  ('00000000-0000-4002-8000-000000000008','00000000-0000-4000-8000-000000000009','Sergiu T.',5,'Festival reușit','Food truck-ul a servit peste 600 de porții fără cozi mari. Recomand pentru evenimente mari.','approved','2025-06-05T10:00:00Z')
  on conflict (id) do nothing;

update public.firms f set rating_avg = v.avg, rating_count = v.cnt from (values
  ('00000000-0000-4000-8000-000000000001',4.8,23),
  ('00000000-0000-4000-8000-000000000002',4.9,41),
  ('00000000-0000-4000-8000-000000000003',4.6,17),
  ('00000000-0000-4000-8000-000000000004',4.7,12),
  ('00000000-0000-4000-8000-000000000005',4.5,9),
  ('00000000-0000-4000-8000-000000000006',4.4,7),
  ('00000000-0000-4000-8000-000000000007',4.6,11),
  ('00000000-0000-4000-8000-000000000008',4.3,6),
  ('00000000-0000-4000-8000-000000000009',4.7,28),
  ('00000000-0000-4000-8000-000000000010',4.9,52),
  ('00000000-0000-4000-8000-000000000011',4.2,5),
  ('00000000-0000-4000-8000-000000000012',4.8,19)
) as v(id, avg, cnt) where f.id = v.id::uuid;
