import type { Category, City, Firm, Review, Service, SiteSettings, Taxonomy } from './types';

/* ============================================================================
 * DEMO DATASET
 * Used only while Supabase is not connected yet, so the site is fully
 * browsable and deployable on day one. Delete this file's usage automatically
 * once NEXT_PUBLIC_SUPABASE_URL is set.
 * ========================================================================== */

export const demoCities: City[] = [
  { slug: 'chisinau', name_ro: 'Chișinău', name_ru: 'Кишинёв', name_en: 'Chișinău', region_ro: 'Municipiul Chișinău', region_ru: 'Муниципий Кишинёв', region_en: 'Chișinău Municipality', lat: 47.0105, lng: 28.8638, population: 532513, priority: 100 },
  { slug: 'balti', name_ro: 'Bălți', name_ru: 'Бельцы', name_en: 'Bălți', region_ro: 'Municipiul Bălți', region_ru: 'Муниципий Бельцы', region_en: 'Bălți Municipality', lat: 47.9281, lng: 27.9284, population: 97930, priority: 95 },
  { slug: 'cahul', name_ro: 'Cahul', name_ru: 'Кагул', name_en: 'Cahul', region_ro: 'Raionul Cahul', region_ru: 'Кагульский район', region_en: 'Cahul District', lat: 45.9017, lng: 28.1914, population: 32900, priority: 90 },
  { slug: 'orhei', name_ro: 'Orhei', name_ru: 'Оргеев', name_en: 'Orhei', region_ro: 'Raionul Orhei', region_ru: 'Оргеевский район', region_en: 'Orhei District', lat: 47.3831, lng: 28.8231, population: 21800, priority: 85 },
  { slug: 'ungheni', name_ro: 'Ungheni', name_ru: 'Унгены', name_en: 'Ungheni', region_ro: 'Raionul Ungheni', region_ru: 'Унгенский район', region_en: 'Ungheni District', lat: 47.2053, lng: 27.7944, population: 30800, priority: 82 },
  { slug: 'soroca', name_ro: 'Soroca', name_ru: 'Сороки', name_en: 'Soroca', region_ro: 'Raionul Soroca', region_ru: 'Сорокский район', region_en: 'Soroca District', lat: 48.1567, lng: 28.2856, population: 22800, priority: 80 },
  { slug: 'comrat', name_ro: 'Comrat', name_ru: 'Комрат', name_en: 'Comrat', region_ro: 'UTA Găgăuzia', region_ru: 'АТО Гагаузия', region_en: 'Gagauzia', lat: 46.3006, lng: 28.6553, population: 20900, priority: 78 },
  { slug: 'hincesti', name_ro: 'Hîncești', name_ru: 'Гынчешты', name_en: 'Hîncești', region_ro: 'Raionul Hîncești', region_ru: 'Гынчештский район', region_en: 'Hîncești District', lat: 46.8281, lng: 28.5839, population: 12600, priority: 60 },
  { slug: 'calarasi', name_ro: 'Călărași', name_ru: 'Калараш', name_en: 'Călărași', region_ro: 'Raionul Călărași', region_ru: 'Каларашский район', region_en: 'Călărași District', lat: 47.2519, lng: 28.2831, population: 14500, priority: 58 },
  { slug: 'straseni', name_ro: 'Strășeni', name_ru: 'Страшены', name_en: 'Strășeni', region_ro: 'Raionul Strășeni', region_ru: 'Страшенский район', region_en: 'Strășeni District', lat: 47.145, lng: 28.6136, population: 19100, priority: 56 },
  { slug: 'ialoveni', name_ro: 'Ialoveni', name_ru: 'Яловены', name_en: 'Ialoveni', region_ro: 'Raionul Ialoveni', region_ru: 'Яловенский район', region_en: 'Ialoveni District', lat: 46.8667, lng: 28.7833, population: 12600, priority: 54 },
  { slug: 'anenii-noi', name_ro: 'Anenii Noi', name_ru: 'Новые Анены', name_en: 'Anenii Noi', region_ro: 'Raionul Anenii Noi', region_ru: 'Новоаненский район', region_en: 'Anenii Noi District', lat: 46.8822, lng: 29.2364, population: 8500, priority: 52 },
  { slug: 'ceadir-lunga', name_ro: 'Ceadîr-Lunga', name_ru: 'Чадыр-Лунга', name_en: 'Ceadîr-Lunga', region_ro: 'UTA Găgăuzia', region_ru: 'АТО Гагаузия', region_en: 'Gagauzia', lat: 46.3058, lng: 28.8144, population: 17400, priority: 50 },
  { slug: 'edinet', name_ro: 'Edineț', name_ru: 'Единцы', name_en: 'Edineț', region_ro: 'Raionul Edineț', region_ru: 'Единецкий район', region_en: 'Edineț District', lat: 48.1678, lng: 27.2994, population: 15500, priority: 48 },
  { slug: 'floresti', name_ro: 'Florești', name_ru: 'Флорешты', name_en: 'Florești', region_ro: 'Raionul Florești', region_ru: 'Флорештский район', region_en: 'Florești District', lat: 47.8917, lng: 28.2906, population: 13600, priority: 46 },
  { slug: 'cimislia', name_ro: 'Cimișlia', name_ru: 'Чимишлия', name_en: 'Cimișlia', region_ro: 'Raionul Cimișlia', region_ru: 'Чимишлийский район', region_en: 'Cimișlia District', lat: 46.5256, lng: 28.7831, population: 12200, priority: 44 },
  { slug: 'rezina', name_ro: 'Rezina', name_ru: 'Резина', name_en: 'Rezina', region_ro: 'Raionul Rezina', region_ru: 'Резинский район', region_en: 'Rezina District', lat: 47.7456, lng: 28.9603, population: 10800, priority: 42 },
  { slug: 'criuleni', name_ro: 'Criuleni', name_ru: 'Криуляны', name_en: 'Criuleni', region_ro: 'Raionul Criuleni', region_ru: 'Криулянский район', region_en: 'Criuleni District', lat: 47.1261, lng: 29.0547, population: 7100, priority: 40 },
  { slug: 'taraclia', name_ro: 'Taraclia', name_ru: 'Тараклия', name_en: 'Taraclia', region_ro: 'Raionul Taraclia', region_ru: 'Тараклийский район', region_en: 'Taraclia District', lat: 45.9, lng: 28.6667, population: 8300, priority: 38 },
  { slug: 'nisporeni', name_ro: 'Nisporeni', name_ru: 'Ниспорены', name_en: 'Nisporeni', region_ro: 'Raionul Nisporeni', region_ru: 'Ниспоренский район', region_en: 'Nisporeni District', lat: 47.0753, lng: 28.1769, population: 12100, priority: 36 },
  { slug: 'drochia', name_ro: 'Drochia', name_ru: 'Дрокиа', name_en: 'Drochia', region_ro: 'Raionul Drochia', region_ru: 'Дрокиевский район', region_en: 'Drochia District', lat: 48.035, lng: 27.8161, population: 16600, priority: 34 },
  { slug: 'singerei', name_ro: 'Sîngerei', name_ru: 'Сынжерей', name_en: 'Sîngerei', region_ro: 'Raionul Sîngerei', region_ru: 'Сынжерейский район', region_en: 'Sîngerei District', lat: 47.6389, lng: 28.1386, population: 12400, priority: 32 },
  { slug: 'telenesti', name_ro: 'Telenești', name_ru: 'Теленешты', name_en: 'Telenești', region_ro: 'Raionul Telenești', region_ru: 'Теленештский район', region_en: 'Telenești District', lat: 47.4997, lng: 28.3656, population: 6600, priority: 30 },
  { slug: 'leova', name_ro: 'Leova', name_ru: 'Леова', name_en: 'Leova', region_ro: 'Raionul Leova', region_ru: 'Леовский район', region_en: 'Leova District', lat: 46.4811, lng: 28.2544, population: 9800, priority: 28 },
  { slug: 'stefan-voda', name_ro: 'Ștefan Vodă', name_ru: 'Штефан-Водэ', name_en: 'Ștefan Vodă', region_ro: 'Raionul Ștefan Vodă', region_ru: 'Штефан-Водский район', region_en: 'Ștefan Vodă District', lat: 46.5153, lng: 29.6639, population: 7100, priority: 26 },
  { slug: 'vulcanesti', name_ro: 'Vulcănești', name_ru: 'Вулканешты', name_en: 'Vulcănești', region_ro: 'UTA Găgăuzia', region_ru: 'АТО Гагаузия', region_en: 'Gagauzia', lat: 45.6833, lng: 28.4, population: 12200, priority: 24 },
  { slug: 'falesti', name_ro: 'Fălești', name_ru: 'Фалешты', name_en: 'Fălești', region_ro: 'Raionul Fălești', region_ru: 'Фалештский район', region_en: 'Fălești District', lat: 47.5742, lng: 27.7139, population: 14900, priority: 22 },
  { slug: 'glodeni', name_ro: 'Glodeni', name_ru: 'Глодяны', name_en: 'Glodeni', region_ro: 'Raionul Glodeni', region_ru: 'Глодянский район', region_en: 'Glodeni District', lat: 47.7789, lng: 27.5167, population: 9200, priority: 20 },
  { slug: 'riscani', name_ro: 'Rîșcani', name_ru: 'Рышканы', name_en: 'Rîșcani', region_ro: 'Raionul Rîșcani', region_ru: 'Рышканский район', region_en: 'Rîșcani District', lat: 47.9531, lng: 27.5639, population: 11400, priority: 18 },
  { slug: 'soldanesti', name_ro: 'Șoldănești', name_ru: 'Шолданешты', name_en: 'Șoldănești', region_ro: 'Raionul Șoldănești', region_ru: 'Шолданештский район', region_en: 'Șoldănești District', lat: 47.8131, lng: 28.7903, population: 6300, priority: 16 },
  { slug: 'basarabeasca', name_ro: 'Basarabeasca', name_ru: 'Бессарабка', name_en: 'Basarabeasca', region_ro: 'Raionul Basarabeasca', region_ru: 'Бессарабский район', region_en: 'Basarabeasca District', lat: 46.3333, lng: 28.9, population: 10700, priority: 14 },
  { slug: 'cantemir', name_ro: 'Cantemir', name_ru: 'Кантемир', name_en: 'Cantemir', region_ro: 'Raionul Cantemir', region_ru: 'Кантемирский район', region_en: 'Cantemir District', lat: 46.2758, lng: 28.2, population: 4300, priority: 12 },
  { slug: 'ocnita', name_ro: 'Ocnița', name_ru: 'Окница', name_en: 'Ocnița', region_ro: 'Raionul Ocnița', region_ru: 'Окницкий район', region_en: 'Ocnița District', lat: 48.4108, lng: 27.4639, population: 8300, priority: 10 },
];

export const demoCategories: Category[] = [
  { slug: 'nunti', kind: 'event', name_ro: 'Nunți', name_ru: 'Свадьбы', name_en: 'Weddings', icon: 'rings', priority: 100, description_ro: 'Catering pentru nunți: meniuri complete, servire cu personal, candy bar și tort.', description_ru: 'Кейтеринг для свадеб: полное меню, обслуживание персоналом, кэнди-бар и торт.' },
  { slug: 'corporate', kind: 'event', name_ro: 'Corporate', name_ru: 'Корпоратив', name_en: 'Corporate', icon: 'briefcase', priority: 95, description_ro: 'Coffee break, prânzuri pentru birou, petreceri corporative și team building.', description_ru: 'Кофе-брейк, обеды для офиса, корпоративные вечеринки и тимбилдинг.' },
  { slug: 'aniversari', kind: 'event', name_ro: 'Aniversări și zile de naștere', name_ru: 'Юбилеи и дни рождения', name_en: 'Birthdays', icon: 'cake', priority: 90, description_ro: 'Meniuri pentru zile de naștere, aniversări și petreceri private.', description_ru: 'Меню для дней рождения, юбилеев и частных вечеринок.' },
  { slug: 'botezuri', kind: 'event', name_ro: 'Botezuri', name_ru: 'Крестины', name_en: 'Christenings', icon: 'dove', priority: 85, description_ro: 'Catering pentru botez și cumătrie, cu meniuri delicate și aranjamente la masă.', description_ru: 'Кейтеринг на крестины и кумэтрию.' },
  { slug: 'cumatrii', kind: 'event', name_ro: 'Cumătrii', name_ru: 'Кумэтрии', name_en: 'Godparent parties', icon: 'party', priority: 80 },
  { slug: 'conferinte', kind: 'event', name_ro: 'Conferințe și traininguri', name_ru: 'Конференции и тренинги', name_en: 'Conferences', icon: 'mic', priority: 75 },
  { slug: 'banchete', kind: 'event', name_ro: 'Banchete și absolviri', name_ru: 'Банкеты и выпускные', name_en: 'Banquets', icon: 'glass', priority: 70 },
  { slug: 'aer-liber', kind: 'event', name_ro: 'Petreceri în aer liber', name_ru: 'Праздники на природе', name_en: 'Outdoor parties', icon: 'leaf', priority: 65 },
  { slug: 'catering-acasa', kind: 'event', name_ro: 'Catering la domiciliu', name_ru: 'Кейтеринг на дому', name_en: 'Home catering', icon: 'home', priority: 60 },

  { slug: 'meniu-complet', kind: 'service', name_ro: 'Meniu complet', name_ru: 'Полное меню', name_en: 'Full menu', priority: 100 },
  { slug: 'bufet-suedez', kind: 'service', name_ro: 'Bufet suedez', name_ru: 'Шведский стол', name_en: 'Buffet', priority: 95 },
  { slug: 'candy-bar', kind: 'service', name_ro: 'Candy bar', name_ru: 'Кэнди-бар', name_en: 'Candy bar', priority: 90 },
  { slug: 'torturi-deserturi', kind: 'service', name_ro: 'Torturi și deserturi', name_ru: 'Торты и десерты', name_en: 'Cakes & desserts', priority: 85 },
  { slug: 'grill-bbq', kind: 'service', name_ro: 'Grătar & BBQ', name_ru: 'Гриль и BBQ', name_en: 'Grill & BBQ', priority: 80 },
  { slug: 'bar-cocktail', kind: 'service', name_ro: 'Bar & cocktailuri', name_ru: 'Бар и коктейли', name_en: 'Bar & cocktails', priority: 75 },
  { slug: 'servire-personal', kind: 'service', name_ro: 'Servire cu personal', name_ru: 'Обслуживание персоналом', name_en: 'Staffed service', priority: 70 },
  { slug: 'inchirieri', kind: 'service', name_ro: 'Închirieri mese și scaune', name_ru: 'Аренда столов и стульев', name_en: 'Furniture rental', priority: 65 },
  { slug: 'livrare', kind: 'service', name_ro: 'Livrare la locație', name_ru: 'Доставка на локацию', name_en: 'Delivery', priority: 60 },
  { slug: 'decor', kind: 'service', name_ro: 'Decor și aranjamente', name_ru: 'Декор и оформление', name_en: 'Decor', priority: 55 },
];

export const demoCuisines: Taxonomy[] = [
  { slug: 'moldoveneasca', kind: 'cuisine', name_ro: 'Moldovenească', name_ru: 'Молдавская', name_en: 'Moldovan' },
  { slug: 'europeana', kind: 'cuisine', name_ro: 'Europeană', name_ru: 'Европейская', name_en: 'European' },
  { slug: 'romaneasca', kind: 'cuisine', name_ro: 'Românească', name_ru: 'Румынская', name_en: 'Romanian' },
  { slug: 'italiana', kind: 'cuisine', name_ro: 'Italiană', name_ru: 'Итальянская', name_en: 'Italian' },
  { slug: 'franceza', kind: 'cuisine', name_ro: 'Franceză', name_ru: 'Французская', name_en: 'French' },
  { slug: 'asiatica', kind: 'cuisine', name_ro: 'Asiatică', name_ru: 'Азиатская', name_en: 'Asian' },
  { slug: 'japoneza', kind: 'cuisine', name_ro: 'Japoneză / sushi', name_ru: 'Японская / суши', name_en: 'Japanese / sushi' },
  { slug: 'georgiana', kind: 'cuisine', name_ro: 'Georgiană', name_ru: 'Грузинская', name_en: 'Georgian' },
  { slug: 'greceasca', kind: 'cuisine', name_ro: 'Grecească', name_ru: 'Греческая', name_en: 'Greek' },
  { slug: 'mediteraneana', kind: 'cuisine', name_ro: 'Mediteraneană', name_ru: 'Средиземноморская', name_en: 'Mediterranean' },
  { slug: 'ucraineana', kind: 'cuisine', name_ro: 'Ucraineană', name_ru: 'Украинская', name_en: 'Ukrainian' },
  { slug: 'ruseasca', kind: 'cuisine', name_ro: 'Rusească', name_ru: 'Русская', name_en: 'Russian' },
  { slug: 'bbq', kind: 'cuisine', name_ro: 'BBQ & grill', name_ru: 'BBQ и гриль', name_en: 'BBQ & grill' },
  { slug: 'turceasca', kind: 'cuisine', name_ro: 'Turcească / găgăuză', name_ru: 'Турецкая / гагаузская', name_en: 'Turkish / Gagauz' },
  { slug: 'fusion', kind: 'cuisine', name_ro: 'Fusion', name_ru: 'Фьюжн', name_en: 'Fusion' },
];

export const demoDietary: Taxonomy[] = [
  { slug: 'vegetarian', kind: 'dietary', name_ro: 'Vegetarian', name_ru: 'Вегетарианское', name_en: 'Vegetarian' },
  { slug: 'vegan', kind: 'dietary', name_ro: 'Vegan', name_ru: 'Веганское', name_en: 'Vegan' },
  { slug: 'fara-gluten', kind: 'dietary', name_ro: 'Fără gluten', name_ru: 'Без глютена', name_en: 'Gluten-free' },
  { slug: 'fara-lactoza', kind: 'dietary', name_ro: 'Fără lactoză', name_ru: 'Без лактозы', name_en: 'Dairy-free' },
  { slug: 'halal', kind: 'dietary', name_ro: 'Halal', name_ru: 'Халяль', name_en: 'Halal' },
  { slug: 'kosher', kind: 'dietary', name_ro: 'Kosher', name_ru: 'Кошер', name_en: 'Kosher' },
  { slug: 'fara-porc', kind: 'dietary', name_ro: 'Fără porc', name_ru: 'Без свинины', name_en: 'Pork-free' },
  { slug: 'meniu-copii', kind: 'dietary', name_ro: 'Meniu pentru copii', name_ru: 'Детское меню', name_en: 'Kids menu' },
  { slug: 'fara-nuci', kind: 'dietary', name_ro: 'Fără nuci și alune', name_ru: 'Без орехов', name_en: 'Nut-free' },
];

const P = (n: number) => `/img/demo/${n}.jpg`;

type DemoFirmSeed = Omit<Firm, 'id'> & { services: Omit<Service, 'id' | 'firm_id'>[] };

const seeds: DemoFirmSeed[] = [
  {
    name: 'Casa Bucatelor', slug: 'demo-casa-bucatelor', owner_id: null,
    tagline_ro: 'Catering pentru nunți și banchete în Chișinău', tagline_ru: 'Кейтеринг свадеб и банкетов в Кишинёве',
    description_ro: 'Catering complet pentru nunți, cumătrii și banchete în Chișinău și împrejurimi. Meniuri moldovenești și europene, servire cu personal și aranjamente de masă incluse.',
    description_ru: 'Полный кейтеринг свадеб, кумэтрий и банкетов в Кишинёве и окрестностях. Молдавское и европейское меню, обслуживание персоналом.',
    city: 'chisinau', region: 'Municipiul Chișinău', address: 'str. Trandafirilor 12, Chișinău',
    phone: '+373 69 111 222', whatsapp: '+37369111222', email: 'contact@casabucatelor.example', website: '',
    logo_url: null, gallery: [P(1), P(4), P(5)], price_from: 450, currency: 'MDL', min_guests: 30, max_guests: 400,
    cuisines: ['moldoveneasca', 'europeana', 'romaneasca'], event_types: ['nunti', 'cumatrii', 'banchete'],
    dietary: ['vegetarian', 'meniu-copii', 'fara-lactoza'], map_lat: 47.0105, map_lng: 28.8638,
    rating_avg: 4.8, rating_count: 23, verified: true, published: true, status: 'approved', views: 1240,
    services: [
      { title_ro: 'Meniu de nuntă clasic', title_ru: 'Свадебное классическое меню', description_ro: 'Trei feluri calde, platouri reci, gustări și desert. Include servire cu chelneri și aranjamente de bază.', description_ru: 'Три горячих блюда, холодные закуски, десерт. Обслуживание официантами включено.', category: 'meniu-complet', price: 450, price_type: 'per_person', unit: 'MDL / persoană', image_url: P(1), active: true, sort: 1 },
      { title_ro: 'Candy bar personalizat', title_ru: 'Кэнди-бар на заказ', description_ro: 'Masă cu deserturi, decor tematic și aranjament floral, pentru 50–300 de invitați.', description_ru: 'Стол с десертами, тематический декор, 50–300 гостей.', category: 'candy-bar', price: 6500, price_type: 'per_event', unit: 'MDL / eveniment', image_url: P(6), active: true, sort: 2 },
      { title_ro: 'Bufet suedez corporate', title_ru: 'Шведский стол для компаний', description_ro: 'Prânz sau cină în format bufet, livrare și aranjare la birou.', description_ru: 'Обед или ужин в формате буфета с доставкой в офис.', category: 'bufet-suedez', price: 320, price_type: 'per_person', unit: 'MDL / persoană', image_url: P(2), active: true, sort: 3 },
    ],
  },
  {
    name: 'Gust & Art', slug: 'demo-gust-si-art', owner_id: null,
    tagline_ro: 'Catering premium și evenimente de business', tagline_ru: 'Премиум кейтеринг и бизнес-события',
    description_ro: 'Echipă specializată în catering corporate, conferințe și evenimente premium. Meniuri fusion, coffee break-uri, finger food și bar de cocktailuri.',
    description_ru: 'Команда специализируется на корпоративном кейтеринге, конференциях и премиум-событиях. Фьюжн-меню, кофе-брейки, фингер-фуд и коктейль-бар.',
    city: 'chisinau', region: 'Municipiul Chișinău', address: 'bd. Ștefan cel Mare 128, Chișinău',
    phone: '+373 79 333 444', whatsapp: '+37379333444', email: 'hello@gustart.example', website: '',
    logo_url: null, gallery: [P(2), P(6), P(3)], price_from: 620, currency: 'MDL', min_guests: 20, max_guests: 800,
    cuisines: ['fusion', 'europeana', 'mediteraneana', 'italiana'], event_types: ['corporate', 'conferinte', 'nunti'],
    dietary: ['vegan', 'fara-gluten', 'vegetarian'], map_lat: 47.0266, map_lng: 28.8416,
    rating_avg: 4.9, rating_count: 41, verified: true, published: true, status: 'approved', views: 2310,
    services: [
      { title_ro: 'Coffee break business', title_ru: 'Бизнес кофе-брейк', description_ro: 'Cafea de specialitate, patiserie, fructe și sandvișuri. Montare și servire incluse.', description_ru: 'Спешелти-кофе, выпечка, фрукты и сэндвичи. Сервировка включена.', category: 'bufet-suedez', price: 180, price_type: 'per_person', unit: 'MDL / persoană', image_url: P(2), active: true, sort: 1 },
      { title_ro: 'Meniu premium fusion', title_ru: 'Премиум фьюжн-меню', description_ro: 'Cinci feluri, plating modern, somelier și personal de servire dedicat.', description_ru: 'Пять подач, современный пейтинг, сомелье и выделенный персонал.', category: 'meniu-complet', price: 980, price_type: 'per_person', unit: 'MDL / persoană', image_url: P(3), active: true, sort: 2 },
      { title_ro: 'Bar de cocktailuri mobil', title_ru: 'Мобильный коктейль-бар', description_ro: 'Stație de bar cu doi barmeni, meniul de cocktailuri și gheață.', description_ru: 'Барная станция, два бармена, коктейльное меню и лёд.', category: 'bar-cocktail', price: 8500, price_type: 'per_event', unit: 'MDL / eveniment', image_url: P(6), active: true, sort: 3 },
    ],
  },
  {
    name: 'Nord Catering', slug: 'demo-nord-catering-balti', owner_id: null,
    tagline_ro: 'Cel mai mare catering din nordul Moldovei', tagline_ru: 'Крупнейший кейтеринг на севере Молдовы',
    description_ro: 'Servicii de catering în Bălți și raioanele din nord: nunți, cumătrii, corporate și livrare de meniuri la domiciliu. Bucătărie proprie și echipă de servire.',
    description_ru: 'Кейтеринг в Бельцах и северных районах: свадьбы, кумэтрии, корпоративы и доставка меню на дом. Собственная кухня и команда обслуживания.',
    city: 'balti', region: 'Municipiul Bălți', address: 'str. Ștefan cel Mare 45, Bălți',
    phone: '+373 68 555 666', whatsapp: '+37368555666', email: 'office@nordcatering.example', website: '',
    logo_url: null, gallery: [P(4), P(1), P(2)], price_from: 380, currency: 'MDL', min_guests: 20, max_guests: 350,
    cuisines: ['moldoveneasca', 'europeana', 'ucraineana'], event_types: ['nunti', 'cumatrii', 'corporate', 'catering-acasa'],
    dietary: ['vegetarian', 'meniu-copii'], map_lat: 47.9281, map_lng: 27.9284,
    rating_avg: 4.6, rating_count: 17, verified: true, published: true, status: 'approved', views: 890,
    services: [
      { title_ro: 'Meniu de nuntă tradițional', title_ru: 'Традиционное свадебное меню', description_ro: 'Sarmale, friptură, platouri reci, plăcinte și tort inclus.', description_ru: 'Сармале, жаркое, холодные закуски, плацинды и торт.', category: 'meniu-complet', price: 380, price_type: 'per_person', unit: 'MDL / persoană', image_url: P(4), active: true, sort: 1 },
      { title_ro: 'Livrare meniuri la domiciliu', title_ru: 'Доставка меню на дом', description_ro: 'Pachete pentru 6–20 de persoane, livrare în Bălți și raioanele vecine.', description_ru: 'Пакеты на 6–20 человек, доставка по Бельцам и соседним районам.', category: 'livrare', price: 250, price_type: 'per_person', unit: 'MDL / persoană', image_url: P(2), active: true, sort: 2 },
    ],
  },
  {
    name: 'Cahul Fest Catering', slug: 'demo-cahul-fest-catering', owner_id: null,
    tagline_ro: 'Catering în sudul Moldovei, Cahul și împrejurimi', tagline_ru: 'Кейтеринг на юге Молдовы, Кагул и окрестности',
    description_ro: 'Organizăm catering pentru nunți, zile de naștere și evenimente în aer liber în Cahul. Grătar, bufet suedez și meniuri pentru copii.',
    description_ru: 'Кейтеринг для свадеб, дней рождения и праздников на природе в Кагуле. Гриль, шведский стол и детское меню.',
    city: 'cahul', region: 'Raionul Cahul', address: 'str. Victoriei 8, Cahul',
    phone: '+373 60 777 888', whatsapp: '+37360777888', email: 'info@cahulfest.example', website: '',
    logo_url: null, gallery: [P(5), P(3), P(6)], price_from: 320, currency: 'MDL', min_guests: 15, max_guests: 250,
    cuisines: ['moldoveneasca', 'bbq', 'europeana'], event_types: ['aniversari', 'aer-liber', 'nunti'],
    dietary: ['vegetarian', 'meniu-copii', 'fara-porc'], map_lat: 45.9017, map_lng: 28.1914,
    rating_avg: 4.7, rating_count: 12, verified: false, published: true, status: 'approved', views: 430,
    services: [
      { title_ro: 'Grătar & BBQ la locația ta', title_ru: 'Гриль и BBQ на вашей локации', description_ro: 'Stație de grill cu bucătar, garnituri și sosuri. Minim 15 persoane.', description_ru: 'Гриль-станция с поваром, гарниры и соусы. Минимум 15 человек.', category: 'grill-bbq', price: 320, price_type: 'per_person', unit: 'MDL / persoană', image_url: P(5), active: true, sort: 1 },
      { title_ro: 'Pachet aniversare copii', title_ru: 'Детский пакет на день рождения', description_ro: 'Meniu pentru copii, deserturi și decor colorat.', description_ru: 'Детское меню, десерты и яркий декор.', category: 'meniu-complet', price: 220, price_type: 'per_person', unit: 'MDL / copil', image_url: P(6), active: true, sort: 2 },
    ],
  },
  {
    name: 'Plai Catering', slug: 'demo-plai-catering-ungheni', owner_id: null,
    tagline_ro: 'Meniuri moldovenești autentice, Ungheni', tagline_ru: 'Аутентичные молдавские меню, Унгены',
    description_ro: 'Catering cu bucătărie moldovenească autentică în Ungheni: sarmale, plăcinte, răcituri, meniuri de post și opțiuni vegetariene.',
    description_ru: 'Кейтеринг с аутентичной молдавской кухней в Унгенах: сармале, плацинды, постные и вегетарианские меню.',
    city: 'ungheni', region: 'Raionul Ungheni', address: 'str. Națională 21, Ungheni',
    phone: '+373 67 222 333', whatsapp: '+37367222333', email: 'plai@example.md', website: '',
    logo_url: null, gallery: [P(4), P(6)], price_from: 290, currency: 'MDL', min_guests: 10, max_guests: 200,
    cuisines: ['moldoveneasca', 'romaneasca'], event_types: ['cumatrii', 'botezuri', 'aniversari', 'catering-acasa'],
    dietary: ['vegetarian', 'vegan', 'fara-porc', 'meniu-copii'], map_lat: 47.2053, map_lng: 27.7944,
    rating_avg: 4.5, rating_count: 9, verified: false, published: true, status: 'approved', views: 310,
    services: [
      { title_ro: 'Meniu tradițional moldovenesc', title_ru: 'Традиционное молдавское меню', description_ro: 'Sarmale în foi de viță, mămăligă cu brânză, plăcinte coapte pe loc și răcituri.', description_ru: 'Сармале в виноградных листьях, мамалыга с брынзой, плацинды и холодцы.', category: 'meniu-complet', price: 290, price_type: 'per_person', unit: 'MDL / persoană', image_url: P(4), active: true, sort: 1 },
      { title_ro: 'Meniu de post (vegan)', title_ru: 'Постное (веганское) меню', description_ro: 'Preparate fără produse de origine animală, ideale pentru petreceri de post.', description_ru: 'Блюда без продуктов животного происхождения.', category: 'meniu-complet', price: 240, price_type: 'per_person', unit: 'MDL / persoană', image_url: P(3), active: true, sort: 2 },
    ],
  },
  {
    name: 'Orhei Garden Catering', slug: 'demo-orhei-garden-catering', owner_id: null,
    tagline_ro: 'Evenimente în aer liber lângă Orhei', tagline_ru: 'Праздники на природе под Оргеевом',
    description_ro: 'Catering pentru evenimente în aer liber, nunți la cort și petreceri corporate în zona Orhei. Echipamente de grill, mobilier și personal.',
    description_ru: 'Кейтеринг для праздников на природе, свадеб под шатром и корпоративов в районе Оргеева. Гриль, мебель и персонал.',
    city: 'orhei', region: 'Raionul Orhei', address: 'str. Eminescu 3, Orhei',
    phone: '+373 69 444 555', whatsapp: '+37369444555', email: 'garden@orheicatering.example', website: '',
    logo_url: null, gallery: [P(5), P(1)], price_from: 350, currency: 'MDL', min_guests: 25, max_guests: 300,
    cuisines: ['bbq', 'europeana', 'moldoveneasca'], event_types: ['aer-liber', 'nunti', 'corporate'],
    dietary: ['fara-gluten', 'vegetarian'], map_lat: 47.3831, map_lng: 28.8231,
    rating_avg: 4.4, rating_count: 7, verified: false, published: true, status: 'approved', views: 260,
    services: [
      { title_ro: 'Pachet nuntă la cort', title_ru: 'Пакет «свадьба под шатром»', description_ro: 'Meniu complet, mobilier, veselă, servire și logistică pentru evenimente outdoor.', description_ru: 'Полное меню, мебель, посуда, обслуживание и логистика для outdoor-событий.', category: 'meniu-complet', price: 520, price_type: 'per_person', unit: 'MDL / persoană', image_url: P(5), active: true, sort: 1 },
      { title_ro: 'Închiriere mobilier și veselă', title_ru: 'Аренда мебели и посуды', description_ro: 'Mese rotunde, scaune cu huse, veselă completă și tacâmuri.', description_ru: 'Круглые столы, стулья с чехлами, полный набор посуды.', category: 'inchirieri', price: 90, price_type: 'per_person', unit: 'MDL / persoană', image_url: P(1), active: true, sort: 2 },
    ],
  },
  {
    name: 'Comrat Gastro', slug: 'demo-comrat-gastro', owner_id: null,
    tagline_ro: 'Catering găgăuz și european în Comrat', tagline_ru: 'Гагаузский и европейский кейтеринг в Комрате',
    description_ro: 'Catering în Comrat și UTA Găgăuzia: meniuri găgăuze și europene, nunți, cumătrii, evenimente corporate și livrare.',
    description_ru: 'Кейтеринг в Комрате и Гагаузии: гагаузские и европейские меню, свадьбы, кумэтрии, корпоративы и доставка.',
    city: 'comrat', region: 'UTA Găgăuzia', address: 'str. Lenin 15, Comrat',
    phone: '+373 62 888 999', whatsapp: '+37362888999', email: 'gastro@comrat.example', website: '',
    logo_url: null, gallery: [P(3), P(4)], price_from: 300, currency: 'MDL', min_guests: 15, max_guests: 250,
    cuisines: ['turceasca', 'moldoveneasca', 'europeana'], event_types: ['nunti', 'cumatrii', 'corporate'],
    dietary: ['halal', 'fara-porc', 'meniu-copii'], map_lat: 46.3006, map_lng: 28.6553,
    rating_avg: 4.6, rating_count: 11, verified: false, published: true, status: 'approved', views: 240,
    services: [
      { title_ro: 'Meniu găgăuz tradițional', title_ru: 'Традиционное гагаузское меню', description_ro: 'Specialități locale, plăcinte, carne la grătar și deserturi de casă.', description_ru: 'Местные специалитеты, плацинды, мясо на гриле и домашние десерты.', category: 'meniu-complet', price: 300, price_type: 'per_person', unit: 'MDL / persoană', image_url: P(3), active: true, sort: 1 },
      { title_ro: 'Meniu halal', title_ru: 'Халяльное меню', description_ro: 'Preparate halal, fără carne de porc, pentru evenimente de familie.', description_ru: 'Халяльные блюда без свинины для семейных событий.', category: 'meniu-complet', price: 330, price_type: 'per_person', unit: 'MDL / persoană', image_url: P(4), active: true, sort: 2 },
    ],
  },
  {
    name: 'Soroca Events Catering', slug: 'demo-soroca-events-catering', owner_id: null,
    tagline_ro: 'Botezuri, cumătrii și aniversări în Soroca', tagline_ru: 'Крестины, кумэтрии и юбилеи в Сороках',
    description_ro: 'Catering pentru evenimente de familie în Soroca și raionul Soroca. Meniuri delicate pentru botez, candy bar și servire cu personal.',
    description_ru: 'Кейтеринг для семейных событий в Сороках и районе. Нежные меню на крестины, кэнди-бар и обслуживание.',
    city: 'soroca', region: 'Raionul Soroca', address: 'str. Independenței 5, Soroca',
    phone: '+373 68 121 212', whatsapp: '+37368121212', email: 'events@soroca.example', website: '',
    logo_url: null, gallery: [P(6), P(1)], price_from: 340, currency: 'MDL', min_guests: 10, max_guests: 180,
    cuisines: ['europeana', 'moldoveneasca'], event_types: ['botezuri', 'cumatrii', 'aniversari'],
    dietary: ['meniu-copii', 'fara-nuci', 'vegetarian'], map_lat: 48.1567, map_lng: 28.2856,
    rating_avg: 4.3, rating_count: 6, verified: false, published: true, status: 'approved', views: 180,
    services: [
      { title_ro: 'Pachet botez', title_ru: 'Пакет «крестины»', description_ro: 'Meniu ușor, deserturi, decor în culori pastel și servire pentru 10–80 de invitați.', description_ru: 'Лёгкое меню, десерты, пастельный декор, 10–80 гостей.', category: 'meniu-complet', price: 340, price_type: 'per_person', unit: 'MDL / persoană', image_url: P(6), active: true, sort: 1 },
    ],
  },
  {
    name: 'Delicii Mobile', slug: 'demo-delicii-mobile', owner_id: null,
    tagline_ro: 'Food truck și catering stradal', tagline_ru: 'Фудтрак и стрит-кейтеринг',
    description_ro: 'Food truck cu burgeri, wrap-uri și limonade pentru festivaluri, petreceri corporate și evenimente în aer liber în toată Moldova.',
    description_ru: 'Фудтрак с бургерами, роллами и лимонадами для фестивалей, корпоративов и праздников по всей Молдове.',
    city: 'chisinau', region: 'Municipiul Chișinău', address: 'Chișinău (mobil)',
    phone: '+373 79 909 909', whatsapp: '+37379909909', email: 'truck@delicii.example', website: '',
    logo_url: null, gallery: [P(5), P(2)], price_from: 150, currency: 'MDL', min_guests: 40, max_guests: 1000,
    cuisines: ['bbq', 'fusion', 'europeana'], event_types: ['aer-liber', 'corporate', 'aniversari'],
    dietary: ['vegetarian', 'vegan', 'fara-lactoza'], map_lat: 46.99, map_lng: 28.83,
    rating_avg: 4.7, rating_count: 28, verified: true, published: true, status: 'approved', views: 1560,
    services: [
      { title_ro: 'Food truck la eveniment', title_ru: 'Фудтрак на событии', description_ro: 'Stație mobilă cu doi bucătari, meniu street food și băuturi. Minim 40 de porții.', description_ru: 'Мобильная станция, два повара, стрит-фуд меню и напитки. От 40 порций.', category: 'grill-bbq', price: 150, price_type: 'per_person', unit: 'MDL / porție', image_url: P(5), active: true, sort: 1 },
    ],
  },
  {
    name: 'Sweet Story', slug: 'demo-sweet-story', owner_id: null,
    tagline_ro: 'Torturi, candy bar și deserturi la comandă', tagline_ru: 'Торты, кэнди-бар и десерты на заказ',
    description_ro: 'Cofetărie și catering de deserturi în Chișinău: torturi personalizate, candy bar, mese de deserturi pentru nunți și evenimente corporate.',
    description_ru: 'Кондитерская и десертный кейтеринг в Кишинёве: торты на заказ, кэнди-бар, десертные столы для свадеб и корпоративов.',
    city: 'chisinau', region: 'Municipiul Chișinău', address: 'str. București 68, Chișinău',
    phone: '+373 60 313 131', whatsapp: '+37360313131', email: 'sweet@example.md', website: '',
    logo_url: null, gallery: [P(6), P(3)], price_from: 200, currency: 'MDL', min_guests: 10, max_guests: 500,
    cuisines: ['europeana', 'franceza'], event_types: ['nunti', 'aniversari', 'corporate', 'botezuri'],
    dietary: ['fara-gluten', 'fara-lactoza', 'vegan', 'meniu-copii'], map_lat: 47.0198, map_lng: 28.8405,
    rating_avg: 4.9, rating_count: 52, verified: true, published: true, status: 'approved', views: 2980,
    services: [
      { title_ro: 'Tort personalizat', title_ru: 'Торт на заказ', description_ro: 'Tort la alegere, 2–4 etaje, cu decor tematic și degustare înainte de comandă.', description_ru: 'Торт 2–4 яруса с тематическим декором и дегустацией.', category: 'torturi-deserturi', price: 650, price_type: 'per_person', unit: 'MDL / kg', image_url: P(6), active: true, sort: 1 },
      { title_ro: 'Masă de deserturi', title_ru: 'Десертный стол', description_ro: 'Peste 12 tipuri de deserturi, decor și aranjament inclus.', description_ru: 'Более 12 видов десертов, декор и сервировка включены.', category: 'candy-bar', price: 200, price_type: 'per_person', unit: 'MDL / persoană', image_url: P(3), active: true, sort: 2 },
    ],
  },
  {
    name: 'Hîncești Banquet', slug: 'demo-hincesti-banquet', owner_id: null,
    tagline_ro: 'Banchete și nunți în Hîncești', tagline_ru: 'Банкеты и свадьбы в Гынчештах',
    description_ro: 'Organizăm banchete, nunți și evenimente corporate în Hîncești și raion. Sală proprie, catering la locația ta și meniuri la alegere.',
    description_ru: 'Банкеты, свадьбы и корпоративы в Гынчештах и районе. Собственный зал и выездной кейтеринг.',
    city: 'hincesti', region: 'Raionul Hîncești', address: 'str. Ștefan cel Mare 2, Hîncești',
    phone: '+373 67 707 707', whatsapp: '+37367707707', email: 'banquet@hincesti.example', website: '',
    logo_url: null, gallery: [P(1), P(4)], price_from: 310, currency: 'MDL', min_guests: 30, max_guests: 220,
    cuisines: ['moldoveneasca', 'europeana'], event_types: ['banchete', 'nunti', 'corporate'],
    dietary: ['vegetarian', 'meniu-copii'], map_lat: 46.8281, map_lng: 28.5839,
    rating_avg: 4.2, rating_count: 5, verified: false, published: true, status: 'approved', views: 150,
    services: [
      { title_ro: 'Meniu banchet', title_ru: 'Банкетное меню', description_ro: 'Meniu complet cu trei feluri calde, platouri și desert, servire inclusă.', description_ru: 'Полное меню с тремя горячими блюдами, закуски и десерт.', category: 'meniu-complet', price: 310, price_type: 'per_person', unit: 'MDL / persoană', image_url: P(1), active: true, sort: 1 },
    ],
  },
  {
    name: 'Vegan Kitchen Catering', slug: 'demo-vegan-kitchen-catering', owner_id: null,
    tagline_ro: 'Catering vegan și vegetarian în Moldova', tagline_ru: 'Веганский и вегетарианский кейтеринг в Молдове',
    description_ro: 'Meniuri 100% vegetale pentru evenimente private și corporate. Livrăm în Chișinău și în toată Moldova, cu opțiuni fără gluten și fără lactoză.',
    description_ru: '100% растительные меню для частных и корпоративных событий. Доставка по Кишинёву и всей Молдове, опции без глютена и лактозы.',
    city: 'chisinau', region: 'Municipiul Chișinău', address: 'str. Armenească 44, Chișinău',
    phone: '+373 60 555 000', whatsapp: '+37360555000', email: 'vegan@example.md', website: '',
    logo_url: null, gallery: [P(3), P(2)], price_from: 280, currency: 'MDL', min_guests: 10, max_guests: 300,
    cuisines: ['mediteraneana', 'asiatica', 'fusion'], event_types: ['corporate', 'aer-liber', 'aniversari'],
    dietary: ['vegan', 'vegetarian', 'fara-gluten', 'fara-lactoza', 'fara-nuci'], map_lat: 47.0146, map_lng: 28.8516,
    rating_avg: 4.8, rating_count: 19, verified: true, published: true, status: 'approved', views: 720,
    services: [
      { title_ro: 'Bufet vegan corporate', title_ru: 'Веганский буфет для офиса', description_ro: 'Buddha bowls, humus, salate, deserturi fără zahăr rafinat. Livrare și montare incluse.', description_ru: 'Боулы, хумус, салаты, десерты без рафинированного сахара. Доставка и сервировка.', category: 'bufet-suedez', price: 280, price_type: 'per_person', unit: 'MDL / persoană', image_url: P(3), active: true, sort: 1 },
      { title_ro: 'Meniu eveniment vegan', title_ru: 'Веганское меню для события', description_ro: 'Trei feluri calde, aperitive și desert, pentru evenimente de la 20 de persoane.', description_ru: 'Три горячих блюда, закуски и десерт, от 20 человек.', category: 'meniu-complet', price: 340, price_type: 'per_person', unit: 'MDL / persoană', image_url: P(2), active: true, sort: 2 },
    ],
  },
];

/** Flatten demo seeds into firms + services with stable fake ids. */
export const demoFirms: Firm[] = seeds.map((s, i) => {
  const { services: _services, ...rest } = s;
  return { ...rest, id: `demo-firm-${i + 1}`, created_at: '2025-01-01T09:00:00Z', updated_at: '2025-06-01T09:00:00Z' } as Firm;
});

export const demoServices: Service[] = seeds.flatMap((s, i) =>
  s.services.map((svc, j) => ({
    ...svc,
    id: `demo-svc-${i + 1}-${j + 1}`,
    firm_id: `demo-firm-${i + 1}`,
    created_at: '2025-01-01T09:00:00Z',
  })) as Service[],
);

export const demoReviews: Review[] = [
  { id: 'demo-r1', firm_id: 'demo-firm-1', author_name: 'Marina C.', rating: 5, title: 'Nuntă reușită', body: 'Meniul a fost delicios, iar echipa foarte atentă. Toți invitații au lăudat sarmalele și candy bar-ul.', status: 'approved', created_at: '2025-05-12T10:00:00Z' },
  { id: 'demo-r2', firm_id: 'demo-firm-1', author_name: 'Andrei P.', rating: 4, title: 'Bun, dar puțin întârziat', body: 'Mâncarea excelentă, servirea a început cu 20 de minute mai târziu decât am stabilit.', status: 'approved', created_at: '2025-04-02T10:00:00Z' },
  { id: 'demo-r3', firm_id: 'demo-firm-2', author_name: 'Elena D.', rating: 5, title: 'Conferință impecabilă', body: 'Coffee break pentru 180 de persoane, totul la timp și foarte gustos. Recomand pentru evenimente de business.', status: 'approved', created_at: '2025-06-20T10:00:00Z' },
  { id: 'demo-r4', firm_id: 'demo-firm-3', author_name: 'Igor V.', rating: 5, title: 'Cel mai bun din Bălți', body: 'Am comandat pentru cumătrie, 120 de invitați. Porții mari, mâncare caldă, preț corect.', status: 'approved', created_at: '2025-03-18T10:00:00Z' },
  { id: 'demo-r5', firm_id: 'demo-firm-4', author_name: 'Ana M.', rating: 4, title: 'Grătar reușit', body: 'BBQ la ziua de naștere a tatălui, totul organizat bine. Ar fi ajutat mai multe opțiuni vegetariene.', status: 'approved', created_at: '2025-07-01T10:00:00Z' },
  { id: 'demo-r6', firm_id: 'demo-firm-10', author_name: 'Victoria S.', rating: 5, title: 'Tort de vis', body: 'Tortul pentru nuntă a fost exact ca în schiță, iar candy bar-ul a fost vedeta serii.', status: 'approved', created_at: '2025-08-09T10:00:00Z' },
  { id: 'demo-r7', firm_id: 'demo-firm-12', author_name: 'Dumitru R.', rating: 5, title: 'Opțiuni vegane serioase', body: 'Prima dată când colegii mei vegani au mâncat la fel de bine ca toată lumea. Felicitări!', status: 'approved', created_at: '2025-07-22T10:00:00Z' },
  { id: 'demo-r8', firm_id: 'demo-firm-9', author_name: 'Sergiu T.', rating: 5, title: 'Festival reușit', body: 'Food truck-ul a servit peste 600 de porții fără cozi mari. Recomand pentru evenimente mari.', status: 'approved', created_at: '2025-06-05T10:00:00Z' },
];

export const demoSettings: SiteSettings = {
  seo_title_template: '{firm} – Catering în {city} | {site}',
  seo_description_ro: 'Catering Moldova — găsește firme de catering în Chișinău, Bălți, Cahul și toată țara. Meniuri pentru nunți, corporate, botezuri și aniversări, cu prețuri și contacte.',
  seo_description_ru: 'Кейтеринг в Молдове — компании Кишинёва, Бельц, Кагула и всей страны. Меню для свадеб, корпоративов, крестин и юбилеев: цены и контакты.',
  seo_description_en: 'Catering in Moldova — compare catering companies in Chișinău, Bălți, Cahul and beyond. Wedding, corporate and party menus with prices and contacts.',
  hero_title_ro: 'Găsește cateringul potrivit pentru evenimentul tău',
  hero_title_ru: 'Найдите подходящий кейтеринг для вашего события',
  hero_subtitle_ro: 'Compară firme de catering din Chișinău, Bălți, Cahul și toată Moldova. Meniuri, prețuri și contacte — într-un singur loc.',
  hero_subtitle_ru: 'Сравните кейтеринговые компании Кишинёва, Бельц, Кагула и всей Молдовы. Меню, цены и контакты — в одном месте.',
  reviews_enabled: true,
  inquiries_enabled: true,
  contact_email: 'contact@catering-moldova.example',
  contact_phone: '+373 60 000 000',
  footer_note_ro: '',
  footer_note_ru: '',
  featured_firm_ids: ['demo-firm-2', 'demo-firm-10', 'demo-firm-1', 'demo-firm-12', 'demo-firm-3', 'demo-firm-9'],
};
