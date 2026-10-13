import type { Lang } from './types';

/* ============================================================================
 * SEO COPY
 * Hand-written local content for city and category landing pages.
 * The admin panel can override city intro text (cities.seo_intro_ro / _ru);
 * everything below is the built-in default so pages are never thin.
 * ========================================================================== */

export interface SeoCopy {
  title: string;
  meta: string;
  intro: string[];
  faq: { q: string; a: string }[];
}

export interface CityCtx {
  /** city slug, e.g. "chisinau" */
  slugKey: string;
  name: string;
  nameRu: string;
  region: string;
  regionRu: string;
}

const faqRo = (name: string, region: string): { q: string; a: string }[] => [
  {
    q: `Cât costă cateringul în ${name}?`,
    a: `Un meniu complet pornește în medie de la 250–450 MDL de persoană, iar pachetele premium ajung la 700–1.000 MDL de persoană. Prețul final depinde de numărul de invitați, de complexitatea meniului, de personalul de servire și de distanța de livrare din ${name} sau din raionul ${region}. Pe fiecare profil găsești „preț de la” și tipul de tarifare.`,
  },
  {
    q: `Cu cât timp înainte trebuie să rezerv cateringul?`,
    a: 'Pentru nunți și banchete recomandăm 2–3 luni înainte, mai ales pentru weekend-urile din mai–septembrie. Pentru evenimente corporate, coffee break-uri sau aniversări mici, 2–3 săptămâni sunt suficiente, iar unele firme acceptă comenzi și cu 48 de ore înainte.',
  },
  {
    q: `Se deplasează firmele din ${name} în satele din raion?`,
    a: `Da. Majoritatea companiilor listate acoperă ${name} și localitățile din raionul ${region}. Transportul, vesela și mobilierul se taxează separat și se discută în oferta pe care o primești după ce trimiți cererea.`,
  },
  {
    q: 'Există meniuri vegetariene, de post sau fără gluten?',
    a: 'Da. Folosește filtrul „Preferințe alimentare” din pagina de căutare pentru a vedea doar firmele care oferă opțiuni vegetariene, vegane, fără gluten, fără lactoză, halal sau meniu pentru copii.',
  },
];

const faqRu = (name: string, region: string): { q: string; a: string }[] => [
  {
    q: `Сколько стоит кейтеринг — ${name}?`,
    a: `Полное меню в среднем от 250–450 MDL на человека, премиум-пакеты — 700–1.000 MDL. Итоговая цена зависит от числа гостей, сложности меню, персонала и расстояния доставки: город ${name}, район ${region}.`,
  },
  {
    q: 'За сколько времени нужно бронировать?',
    a: 'Для свадеб и банкетов — за 2–3 месяца, особенно на выходные в мае–сентябре. Для корпоративов и небольших юбилеев достаточно 2–3 недель.',
  },
  {
    q: `Выезжают ли компании (${name}) в сёла района?`,
    a: `Да, большинство компаний обслуживают город ${name} и населённые пункты района ${region}. Транспорт, посуда и мебель обсуждаются отдельно в предложении.`,
  },
  {
    q: 'Есть ли вегетарианское, постное или безглютеновое меню?',
    a: 'Да. Используйте фильтр «Особенности питания», чтобы увидеть компании с вегетарианскими, веганскими, безглютеновыми, халяльными и детскими меню.',
  },
];

/** Bespoke copy for the seven priority cities. */
const citySpecific: Record<string, Partial<Record<'ro' | 'ru', SeoCopy>>> = {
  chisinau: {
    ro: {
      title: 'Catering Chișinău — firme, meniuri și prețuri | Catering Moldova',
      meta: 'Catering în Chișinău: compară peste 30 de firme pentru nunți, corporate, botezuri și aniversări. Meniuri, prețuri de la 250 MDL/persoană, livrare în toate sectoarele.',
      intro: [
        'Chișinăul concentrează cea mai mare parte a firmelor de catering din Moldova: bucătării proprii, echipe de servire, cofetării și servicii de livrare pentru evenimente de orice mărime. În acest catalog găseți companii active în toate sectoarele — Centru, Botanica, Buiucani, Râșcani și Ciocana — dar și în suburbiile Durlești, Codru, Stăuceni, Trușeni, Vatra și Cricova.',
        'Pentru nunți și cumătrii, prețurile unui meniu complet pornesc de obicei de la 400–550 MDL de persoană și urcă spre 800–1.200 MDL pentru meniuri premium cu servire dedicată, candy bar și bar de cocktailuri. Pentru evenimente corporate, un coffee break costă în medie 120–250 MDL de persoană, iar un prânz livrat la birou 180–320 MDL.',
        'Folosiți filtrele de mai sus pentru a selecta tipul evenimentului, bucătăria preferată, bugetul și numărul de invitați. Fiecare profil afișează meniurile și serviciile cu prețuri, galeria foto, recenziile clienților și butoane directe de telefon, WhatsApp și formular de cerere. Nu percepeți nicio taxă: contactați firma direct și primiți oferta pe e-mail sau la telefon.',
      ],
      faq: faqRo('Chișinău', 'Chișinău'),
    },
    ru: {
      title: 'Кейтеринг в Кишинёве — компании, меню и цены | Catering Moldova',
      meta: 'Кейтеринг в Кишинёве: сравните компании для свадеб, корпоративов, крестин и юбилеев. Меню от 250 MDL на человека, доставка по всем секторам города.',
      intro: [
        'В Кишинёве сосредоточена большая часть кейтеринговых компаний Молдовы: собственные кухни, команды официантов, кондитерские и доставка на события любого масштаба. В каталоге — компании, работающие во всех секторах: Центр, Ботаника, Буюканы, Рышкановка и Чеканы, а также в пригородах Дурлешты, Кодру, Ставчены, Трушены и Крикова.',
        'Свадебное меню в среднем стоит 400–550 MDL на человека, премиум-формат с обслуживанием, кэнди-баром и коктейлями — 800–1.200 MDL. Кофе-брейк для офиса — 120–250 MDL, доставленный обед — 180–320 MDL на человека.',
        'Используйте фильтры: тип события, кухня, бюджет и число гостей. В каждом профиле есть меню с ценами, галерея, отзывы и кнопки звонка, WhatsApp и заявки. Мы не берём комиссию — вы связываетесь с компанией напрямую.',
      ],
      faq: faqRu('Кишинёве', 'Кишинёв'),
    },
  },
  balti: {
    ro: {
      title: 'Catering Bălți — firme și meniuri pentru evenimente | Catering Moldova',
      meta: 'Catering în Bălți: firme pentru nunți, cumătrii, corporate și livrare la domiciliu. Meniuri moldovenești și europene, prețuri de la 300 MDL de persoană.',
      intro: [
        'Bălți este cel mai mare oraș din nordul Moldovei și un centru activ pentru organizarea de evenimente. Firmele de catering de aici deservească nunți și cumătrii în oraș și în localitățile din jur — Elizaveta, Sadovoe, Răuțel — dar și evenimente corporate pentru companiile din Zona Economică Liberă Bălți.',
        'Prețurile pentru un meniu complet pornesc de la aproximativ 300–420 MDL de persoană, cu pachete de banchet între 400 și 600 MDL. Multe firme oferă și livrare de meniuri la domiciliu pentru 10–30 de persoane, precum și grătar și BBQ pentru petreceri în aer liber.',
        'Selectează orașul Bălți în filtrul de căutare pentru a vedea toate companiile disponibile, apoi trimite o cerere cu data evenimentului și numărul de invitați. Vei primi oferta direct de la firmă, fără intermediari și fără costuri suplimentare.',
      ],
      faq: faqRo('Bălți', 'Bălți'),
    },
    ru: {
      title: 'Кейтеринг в Бельцах — компании и меню | Catering Moldova',
      meta: 'Кейтеринг в Бельцах: компании для свадеб, кумэтрий, корпоративов и доставка на дом. Меню от 300 MDL на человека.',
      intro: [
        'Бельцы — крупнейший город севера Молдовы и активный центр событий. Местные кейтеринговые компании обслуживают свадьбы и кумэтрии в городе и окрестностях — Елизаветовка, Садовое, Рауцел, — а также корпоративы для компаний из Свободной экономической зоны Бельцы.',
        'Полное меню стоит в среднем 300–420 MDL на человека, банкетные пакеты — 400–600 MDL. Многие фирмы доставляют меню на дом на 10–30 человек и организуют гриль на праздниках под открытым небом.',
        'Выберите Бельцы в фильтре поиска, отправьте заявку с датой и числом гостей — предложение придёт напрямую от компании, без посредников и дополнительных комиссий.',
      ],
      faq: faqRu('Бельцах', 'Бельцы'),
    },
  },
  cahul: {
    ro: {
      title: 'Catering Cahul — firme pentru nunți și evenimente | Catering Moldova',
      meta: 'Catering în Cahul și raionul Cahul: meniuri pentru nunți, zile de naștere, grătar și evenimente în aer liber. Prețuri de la 280 MDL de persoană.',
      intro: [
        'În Cahul, cateringul este dominat de bucătăria tradițională moldovenească și de evenimentele în aer liber. Firmele locale organizează nunți și cumătrii la case de oaspeți și la baze de odihnă din jurul orașului, dar și grătar, BBQ și bufete pentru petreceri lângă lacurile și pensiunile din raion.',
        'Un meniu de nuntă pornește de obicei de la 280–400 MDL de persoană, iar pachetele cu grătar și servire, de la 320 MDL. Pentru evenimente de 15–40 de persoane, multe firme acceptă comenzi cu livrare directă la locație.',
        'Filtrează după Cahul sau alege „Petreceri în aer liber” și „Aniversări” pentru a vedea ofertele potrivite. Trimite cererea cu data și numărul de invitați — vei primi meniul și prețul final pe WhatsApp sau e-mail.',
      ],
      faq: faqRo('Cahul', 'Cahul'),
    },
    ru: {
      title: 'Кейтеринг в Кагуле — компании для событий | Catering Moldova',
      meta: 'Кейтеринг в Кагуле и районе: меню для свадеб, дней рождения, гриль и праздников на природе. Цены от 280 MDL на человека.',
      intro: [
        'В Кагуле кейтеринг строится вокруг традиционной молдавской кухни и праздников на природе. Местные компании обслуживают свадьбы и кумэтрии в гостевых домах и на базах отдыха рядом с городом, а также организуют гриль, BBQ и буфеты у озёр и пансионатов района.',
        'Свадебное меню стоит в среднем 280–400 MDL на человека, пакеты с грилем и обслуживанием — от 320 MDL. Для событий на 15–40 человек многие фирмы принимают заказы с доставкой на локацию.',
        'Отфильтруйте по Кагулу или выберите «Праздники на природе» и «Юбилеи», отправьте заявку с датой и числом гостей — меню и итоговую цену пришлют в WhatsApp или по e-mail.',
      ],
      faq: faqRu('Кагуле', 'Кагул'),
    },
  },
  orhei: {
    ro: {
      title: 'Catering Orhei — evenimente și meniuri la comandă | Catering Moldova',
      meta: 'Catering în Orhei și raionul Orhei: nunți, banchete, evenimente în aer liber. Meniuri complete, mobilier și servire, prețuri de la 300 MDL de persoană.',
      intro: [
        'Orhei este cunoscut pentru pensiunile și complexele de odihnă din apropiere — Orheiland, Vatici, Ivancea, Brănești —, iar firmele de catering din oraș lucrează frecvent pentru evenimente organizate în aceste locații. Serviciile includ meniuri complete, mobilier, veselă, personal de servire și logistică pentru nunți la cort.',
        'Prețul mediu pentru un meniu de nuntă este de 320–480 MDL de persoană, iar pachetele outdoor cu mobilier și servire ajung la 500–650 MDL. Pentru banchete corporate sau petreceri de absolvire, ofertele se calculează de obicei pe persoană, cu un minim de 25–30 de invitați.',
        'Alege orașul Orhei în filtre pentru a vedea firmele disponibile și trimite o cerere cu detaliile evenimentului: data, locul, numărul de invitați și tipul de meniu dorit.',
      ],
      faq: faqRo('Orhei', 'Orhei'),
    },
    ru: {
      title: 'Кейтеринг в Оргееве — меню и события | Catering Moldova',
      meta: 'Кейтеринг в Оргееве и районе: свадьбы, банкеты, праздники на природе. Полные меню, мебель и обслуживание от 300 MDL на человека.',
      intro: [
        'Оргеев известен базами отдыха рядом с городом — Орхейланд, Ватичь, Иванча, Бранешты, — и местные кейтеринговые компании часто обслуживают события именно там. Услуги включают полные меню, мебель, посуду, персонал и логистику для свадеб под шатром.',
        'Средняя цена свадебного меню — 320–480 MDL на человека, пакеты outdoor с мебелью и обслуживанием — 500–650 MDL. Для корпоративных банкетов расчёт идёт на человека при минимуме 25–30 гостей.',
        'Выберите Оргеев в фильтрах, отправьте заявку с деталями: дата, место, число гостей и тип меню.',
      ],
      faq: faqRu('Оргееве', 'Оргеев'),
    },
  },
  ungheni: {
    ro: {
      title: 'Catering Ungheni — meniuri moldovenești pentru evenimente | Catering Moldova',
      meta: 'Catering în Ungheni și raionul Ungheni: meniuri tradiționale moldovenești, cumătrii, botezuri și evenimente corporate. Prețuri de la 270 MDL de persoană.',
      intro: [
        'Ungheni, la granița cu România, are o ofertă de catering orientată spre evenimente de familie și bucătărie tradițională. Firmele din oraș pregătesc sarmale, plăcinte, răcituri și meniuri de post pentru cumătrii, botezuri și aniversări, dar asigură și coffee break-uri pentru companiile din Zona Economică Liberă Ungheni.',
        'Prețurile pentru meniuri complete pornesc de la 270–390 MDL de persoană, iar meniurile de post sau vegetariene sunt, de regulă, cu 10–20% mai ieftine. Livrarea în localitățile din raion — Cornescu, Hîrcești, Negurenii Vechi — se taxează în funcție de distanță.',
        'Folosește filtrul de oraș Ungheni și bifează preferințele alimentare dacă ai invitați vegetarieni sau copii. Cererea ajunge direct la firmă, care îți răspunde cu meniul propus și prețul final.',
      ],
      faq: faqRo('Ungheni', 'Ungheni'),
    },
    ru: {
      title: 'Кейтеринг в Унгенах — молдавские меню | Catering Moldova',
      meta: 'Кейтеринг в Унгенах и районе: традиционные молдавские меню, кумэтрии, крестины и корпоративы. Цены от 270 MDL на человека.',
      intro: [
        'Унгены, на границе с Румынией, предлагают кейтеринг, ориентированный на семейные события и традиционную кухню. Компании города готовят сармале, плацинды, холодцы и постные меню для кумэтрий, крестин и юбилеев, а также кофе-брейки для резидентов Свободной экономической зоны Унгены.',
        'Полное меню стоит от 270–390 MDL на человека, постные и вегетарианские варианты обычно на 10–20% дешевле. Доставка в сёла района рассчитывается по расстоянию.',
        'Выберите Унгены в фильтре и отметьте особенности питания, если есть вегетарианцы или дети. Заявка уходит напрямую компании, которая пришлёт меню и итоговую цену.',
      ],
      faq: faqRu('Унгенах', 'Унгены'),
    },
  },
  soroca: {
    ro: {
      title: 'Catering Soroca — botezuri, cumătrii și aniversări | Catering Moldova',
      meta: 'Catering în Soroca și raionul Soroca: meniuri pentru botezuri, cumătrii, nunți și evenimente corporate. Prețuri de la 300 MDL de persoană.',
      intro: [
        'Soroca are o scenă activă de evenimente de familie, iar firmele de catering locale sunt specializate în botezuri, cumătrii și aniversări cu meniuri delicate, candy bar și decor. Multe dintre ele lucrează și pentru evenimente organizate lângă cetatea Sorocii sau în casele de oaspeți din raion.',
        'Un meniu pentru botez costă în medie 300–420 MDL de persoană, iar pachetele de nuntă 380–550 MDL. Servirea cu personal, vesela și transportul sunt, de obicei, incluse în ofertele pentru grupuri de peste 60 de invitați.',
        'Selectează Soroca în filtrul de oraș și trimite cererea cu data evenimentului și numărul de invitați. Vei primi câteva variante de meniu, cu prețuri clare, direct de la firmă.',
      ],
      faq: faqRo('Soroca', 'Soroca'),
    },
    ru: {
      title: 'Кейтеринг в Сороках — крестины, кумэтрии, юбилеи | Catering Moldova',
      meta: 'Кейтеринг в Сороках и районе: меню для крестин, кумэтрий, свадеб и корпоративов. Цены от 300 MDL на человека.',
      intro: [
        'В Сороках активно развиваются семейные события, а местные кейтеринговые компании специализируются на крестинах, кумэтриях и юбилеях: деликатные меню, кэнди-бар и декор. Многие работают и на событиях у Сорокской крепости или в гостевых домах района.',
        'Меню на крестины стоит в среднем 300–420 MDL на человека, свадебные пакеты — 380–550 MDL. Обслуживание, посуда и транспорт обычно включены при группе от 60 гостей.',
        'Выберите Сороки в фильтре города и отправьте заявку с датой и числом гостей — компания пришлёт несколько вариантов меню с понятными ценами.',
      ],
      faq: faqRu('Сороках', 'Сороки'),
    },
  },
  comrat: {
    ro: {
      title: 'Catering Comrat — meniuri găgăuze și europene | Catering Moldova',
      meta: 'Catering în Comrat și UTA Găgăuzia: meniuri găgăuze și europene pentru nunți, cumătrii și corporate. Opțiuni halal, prețuri de la 280 MDL de persoană.',
      intro: [
        'Comrat, capitala UTA Găgăuzia, are o ofertă de catering distinctă în Moldova: alături de bucătăria europeană și moldovenească, multe firme pregătesc specialități găgăuze și meniuri halal, fără carne de porc. Este o opțiune frecventă pentru nunți și cumătrii din Comrat, Ceadîr-Lunga, Vulcănești și satele din jur.',
        'Prețurile pornesc de la 280–400 MDL de persoană pentru meniurile tradiționale și ajung la 450–600 MDL pentru pachetele cu servire completă. Opțiunile halal și meniurile pentru copii sunt disponibile la majoritatea firmelor, la cerere.',
        'Alege Comrat sau altă localitate din Găgăuzia în filtre, bifează „Halal” sau „Fără porc” dacă este necesar și trimite cererea. Firma îți răspunde cu meniul propus și prețul final.',
      ],
      faq: faqRo('Comrat', 'Găgăuzia'),
    },
    ru: {
      title: 'Кейтеринг в Комрате — гагаузские и европейские меню | Catering Moldova',
      meta: 'Кейтеринг в Комрате и Гагаузии: гагаузские и европейские меню для свадеб, кумэтрий и корпоративов. Опции халяль, цены от 280 MDL.',
      intro: [
        'Комрат, столица Гагаузии, предлагает уникальный для Молдовы кейтеринг: наряду с европейской и молдавской кухней многие компании готовят гагаузские специалитеты и халяльные меню без свинины. Это частый выбор для свадеб и кумэтрий в Комрате, Чадыр-Лунге, Вулканештах и окрестных сёлах.',
        'Цены стартуют от 280–400 MDL на человека за традиционные меню и доходят до 450–600 MDL за пакеты с полным обслуживанием. Халяльные и детские меню доступны у большинства компаний по запросу.',
        'Выберите Комрат или другой населённый пункт Гагаузии, отметьте «Халяль» или «Без свинины» и отправьте заявку — компания пришлёт меню и итоговую цену.',
      ],
      faq: faqRu('Комрате', 'Гагаузии'),
    },
  },
};

/** Generic (template) copy for every other city — still useful, still local. */
function genericCityCopy(ctx: CityCtx, lang: Lang): SeoCopy {
  if (lang === 'ru') {
    return {
      title: `Кейтеринг ${ctx.nameRu} — компании и меню | Catering Moldova`,
      meta: `Кейтеринг ${ctx.nameRu} (${ctx.regionRu}): меню для свадеб, корпоративов, крестин и юбилеев. Сравните цены и свяжитесь с компаниями напрямую.`,
      intro: [
        `Город ${ctx.nameRu} и район ${ctx.regionRu}: кейтеринговые компании обслуживают свадьбы, кумэтрии, юбилеи, корпоративы и праздники на природе. В каталоге собраны профили с меню, ценами, фотографиями и контактами.`,
        `Средняя цена полного меню — 280–450 MDL на человека. В неё обычно входят холодные закуски, горячие блюда, гарниры и десерт; обслуживание персоналом, посуда и транспорт могут оплачиваться отдельно.`,
        `Выберите город ${ctx.nameRu} в фильтре, укажите тип события, бюджет и число гостей, затем отправьте заявку — предложение придёт напрямую от компании, без комиссий.`,
      ],
      faq: faqRu(ctx.nameRu, ctx.regionRu),
    };
  }
  const name = ctx.name;
  const region = ctx.region;
  return {
    title: `Catering ${name} — firme și meniuri pentru evenimente | Catering Moldova`,
    meta: `Catering în ${name}, raionul ${region}: meniuri pentru nunți, corporate, botezuri și aniversări. Compară prețurile și contactează firmele direct.`,
    intro: [
      `În ${name} și în raionul ${region}, firmele de catering acoperă nunți, cumătrii, aniversări, botezuri, evenimente corporate și petreceri în aer liber. În acest catalog găsești profilurile lor complete: meniuri și prețuri, galerie foto, recenzii și date de contact.`,
      `Prețul mediu pentru un meniu complet este de 280–450 MDL de persoană. De regulă include platouri reci, feluri calde, garnituri și desert; servirea cu personal, vesela și transportul pot fi taxate separat.`,
      `Selectează ${name} în filtrul de oraș, alege tipul evenimentului, bugetul și numărul de invitați, apoi trimite o cerere. Oferta ajunge direct de la firmă — fără comision și fără plată online.`,
    ],
    faq: faqRo(name, region),
  };
}

export function cityCopy(ctx: CityCtx, lang: Lang, override?: string | null): SeoCopy {
  const specific = citySpecific[ctx.slugKey]?.[lang === 'en' ? 'ro' : lang];
  const base = specific ?? genericCityCopy(ctx, lang);
  if (override && override.trim()) return { ...base, intro: [override.trim(), ...base.intro] };
  return base;
}

/* ------------------------------------------------------------ categories */
const catSpecific: Record<string, Partial<Record<'ro' | 'ru', SeoCopy>>> = {
  nunti: {
    ro: {
      title: 'Catering nunți Moldova — meniuri și prețuri pentru nuntă | Catering Moldova',
      meta: 'Catering pentru nunți în Chișinău, Bălți, Cahul și toată Moldova. Meniuri de nuntă, candy bar, servire cu personal. Prețuri de la 350 MDL de persoană.',
      intro: [
        'Cateringul de nuntă este cel mai complex serviciu din domeniu: include meniul propriu-zis (platouri reci, trei-patru feluri calde, garnituri, desert), servirea cu personal, vesela și tacâmurile, transportul și, adesea, candy bar-ul și tortul.',
        'În Moldova, prețul unui meniu de nuntă pornește de la 350–450 MDL de persoană pentru variantele clasice și ajunge la 800–1.200 MDL pentru meniuri premium cu servire dedicată, bar de cocktailuri și decor. Pentru nunțile în aer liber, adaugă costul mobilierului, al cortului și al logisticii.',
        'Filtrează după oraș, buget și număr de invitați pentru a vedea doar firmele care pot susține evenimentul tău. Trimite cererea cu data și locația — vei primi două-trei variante de meniu cu prețuri detaliate.',
      ],
      faq: [
        { q: 'Cât costă un meniu de nuntă în Moldova?', a: 'Între 350 și 1.200 MDL de persoană, în funcție de numărul de feluri, de tipul bucătăriei, de personalul de servire și de distanță. Tortul și candy bar-ul se taxează separat, de obicei la kg sau per eveniment.' },
        { q: 'Câte persoane trebuie să aibă un eveniment pentru catering?', a: 'Majoritatea firmelor lucrează de la 30–50 de invitați. Pentru nunți mici, sub 30 de persoane, caută firmele care oferă livrare sau meniuri à la carte.' },
        { q: 'Se poate rezerva doar candy bar-ul sau doar tortul?', a: 'Da. Există cofetării și firme specializate care livrează separat tortul, masa de deserturi sau candy bar-ul, fără meniul complet.' },
        { q: 'Cu cât timp înainte se rezervă cateringul de nuntă?', a: 'Recomandat 3–6 luni pentru weekend-urile din mai–septembrie și 2–3 luni în restul anului. Meniurile se definitivează, de obicei, cu 2 săptămâni înainte.' },
      ],
    },
    ru: {
      title: 'Кейтеринг на свадьбу в Молдове — меню и цены | Catering Moldova',
      meta: 'Свадебный кейтеринг в Кишинёве, Бельцах, Кагуле и по всей Молдове. Меню, кэнди-бар, обслуживание персоналом. Цены от 350 MDL на человека.',
      intro: [
        'Свадебный кейтеринг — самая комплексная услуга: меню (холодные закуски, 3–4 горячих блюда, гарниры, десерт), персонал, посуда, транспорт и часто кэнди-бар с тортом.',
        'В Молдове свадебное меню стоит от 350–450 MDL на человека за классику и до 800–1.200 MDL за премиум-формат с обслуживанием, коктейль-баром и декором.',
        'Отфильтруйте по городу, бюджету и числу гостей, отправьте заявку с датой и локацией — получите 2–3 варианта меню с детальными ценами.',
      ],
      faq: [
        { q: 'Сколько стоит свадебное меню в Молдове?', a: 'От 350 до 1.200 MDL на человека в зависимости от числа подач, кухни, персонала и расстояния. Торт и кэнди-бар считаются отдельно.' },
        { q: 'Минимальное число гостей для заказа?', a: 'Обычно 30–50 человек. Для небольших свадеб ищите компании с доставкой и меню à la carte.' },
        { q: 'Можно заказать только торт или кэнди-бар?', a: 'Да, кондитерские и специализированные компании доставляют их отдельно, без полного меню.' },
        { q: 'За сколько бронировать свадебный кейтеринг?', a: 'За 3–6 месяцев на выходные мая–сентября и за 2–3 месяца в остальное время.' },
      ],
    },
  },
  corporate: {
    ro: {
      title: 'Catering corporate Moldova — coffee break și prânz la birou | Catering Moldova',
      meta: 'Catering corporate în Moldova: coffee break, prânzuri pentru birou, petreceri de companie și conferințe. Livrare în Chișinău, Bălți și toată țara.',
      intro: [
        'Cateringul corporate acoperă coffee break-uri, prânzuri livrate la birou, petreceri de companie, team building-uri, lansări de produs și servirea participanților la conferințe și traininguri.',
        'Un coffee break costă în medie 120–250 MDL de persoană, iar un prânz complet livrat la birou 180–320 MDL. Pentru petreceri de companie cu bufet suedez și bar, bugetele urcă spre 400–700 MDL de persoană.',
        'Alege orașul și numărul de participanți în filtre pentru a vedea firmele care pot livra la ora cerută. Cererile pentru evenimente corporate se confirmă, de regulă, cu 3–7 zile înainte.',
      ],
      faq: [
        { q: 'Care este numărul minim pentru un coffee break?', a: 'De obicei 15–20 de persoane. Sub acest prag, multe firme oferă pachete fixe cu preț per eveniment.' },
        { q: 'Se poate livra zilnic la birou?', a: 'Da, există firme care oferă abonamente de prânz pentru echipe, cu livrare la aceeași oră în fiecare zi lucrătoare.' },
        { q: 'Există factură pentru persoane juridice?', a: 'Majoritatea firmelor lucrează cu contract și factură pentru companii. Specifică în mesajul cererii că ai nevoie de documente fiscale.' },
      ],
    },
    ru: {
      title: 'Корпоративный кейтеринг в Молдове — кофе-брейк и обеды | Catering Moldova',
      meta: 'Корпоративный кейтеринг в Молдове: кофе-брейк, обеды в офис, корпоративы и конференции. Доставка по Кишинёву, Бельцам и всей стране.',
      intro: [
        'Корпоративный кейтеринг включает кофе-брейки, доставленные обеды, корпоративы, тимбилдинги, презентации и обслуживание конференций.',
        'Кофе-брейк стоит в среднем 120–250 MDL на человека, доставленный обед — 180–320 MDL. Корпоратив с буфетом и баром — 400–700 MDL на человека.',
        'Выберите город и число участников, отправьте заявку — корпоративные события обычно подтверждаются за 3–7 дней.',
      ],
      faq: [
        { q: 'Минимальное число участников для кофе-брейка?', a: 'Обычно 15–20 человек. Ниже этого порога компании предлагают фиксированные пакеты за событие.' },
        { q: 'Возможна ежедневная доставка в офис?', a: 'Да, есть компании с абонементами на обеды и доставкой в одно и то же время каждый рабочий день.' },
        { q: 'Выдаются ли документы для юрлиц?', a: 'Большинство компаний работают по договору и выставляют счёт. Укажите это в сообщении заявки.' },
      ],
    },
  },
  aniversari: {
    ro: {
      title: 'Catering zile de naștere și aniversări în Moldova | Catering Moldova',
      meta: 'Catering pentru zile de naștere, aniversări și petreceri private în Moldova. Meniuri pentru adulți și copii, candy bar, livrare la domiciliu.',
      intro: [
        'Pentru zile de naștere și aniversări, firmele de catering propun meniuri flexibile: platouri reci și aperitive, grătar, meniuri pentru copii, mese de deserturi și candy bar.',
        'Bugetul mediu este de 200–350 MDL de persoană pentru petreceri acasă sau la o locație închiriată, și 300–500 MDL când includem servirea cu personal și decor.',
        'Filtrează după oraș și bifează „Meniu pentru copii” dacă ai invitați mici. Multe firme acceptă comenzi și cu 48–72 de ore înainte pentru grupuri de până la 40 de persoane.',
      ],
      faq: [
        { q: 'Se poate comanda catering acasă, pentru o petrecere mică?', a: 'Da. Există pachete de livrare pentru 6–30 de persoane, cu mâncare gata de servit și veselă de unică folosință inclusă.' },
        { q: 'Ce includ meniurile pentru copii?', a: 'De obicei nuggets, paste, pizza mini, legume, fructe și deserturi fără coloranți. Se pot cere și variante fără nuci sau fără lactoză.' },
        { q: 'Cât costă un candy bar pentru aniversare?', a: 'Între 3.500 și 9.000 MDL per eveniment, în funcție de numărul de invitați, de tipul deserturilor și de decor.' },
      ],
    },
    ru: {
      title: 'Кейтеринг на день рождения и юбилей в Молдове | Catering Moldova',
      meta: 'Кейтеринг для дней рождения, юбилеев и частных вечеринок в Молдове. Взрослые и детские меню, кэнди-бар, доставка на дом.',
      intro: [
        'Для дней рождения компании предлагают гибкие меню: холодные закуски, гриль, детские меню, десертные столы и кэнди-бар.',
        'Средний бюджет — 200–350 MDL на человека для домашней вечеринки и 300–500 MDL с обслуживанием и декором.',
        'Отфильтруйте по городу и отметьте «Детское меню». Многие компании принимают заказы за 48–72 часа для групп до 40 человек.',
      ],
      faq: [
        { q: 'Можно заказать кейтеринг домой на небольшую вечеринку?', a: 'Да, есть пакеты доставки на 6–30 человек с готовыми блюдами и одноразовой посудой.' },
        { q: 'Что входит в детское меню?', a: 'Наггетсы, паста, мини-пицца, овощи, фрукты и десерты без красителей. Возможны варианты без орехов и лактозы.' },
        { q: 'Сколько стоит кэнди-бар на юбилей?', a: 'От 3.500 до 9.000 MDL за событие, в зависимости от числа гостей, десертов и декора.' },
      ],
    },
  },
  botezuri: {
    ro: {
      title: 'Catering botezuri în Moldova — meniuri și aranjamente | Catering Moldova',
      meta: 'Catering pentru botez în Chișinău, Bălți și toată Moldova. Meniuri delicate, candy bar, decor pastel și servire cu personal.',
      intro: [
        'Botezul este un eveniment de familie cu un meniu mai delicat decât cel de nuntă: aperitive ușoare, un-două feluri calde, deserturi și, adesea, un candy bar în culori pastel.',
        'Prețul mediu este de 300–450 MDL de persoană, iar pentru grupurile de 20–60 de invitați multe firme includ servirea și vesela în ofertă.',
        'Filtrează după oraș și după numărul de invitați pentru a găsi firma potrivită. Dacă ai nevoie de meniu fără nuci, fără lactoză sau pentru copii, bifează opțiunile respective.',
      ],
      faq: [
        { q: 'Care este numărul minim de invitați pentru catering la botez?', a: 'De regulă 15–20 de persoane. Sub acest prag se comandă, de obicei, pachete de livrare.' },
        { q: 'Se poate comanda doar candy bar-ul?', a: 'Da, multe cofetării livrează separat masa de deserturi și decorul pentru botez.' },
        { q: 'Ce se servește de obicei la un botez?', a: 'Aperitive reci, o supă sau un fel cald principal, platou de fructe și deserturi ușoare.' },
      ],
    },
    ru: {
      title: 'Кейтеринг на крестины в Молдове — меню и декор | Catering Moldova',
      meta: 'Кейтеринг на крестины в Кишинёве, Бельцах и по всей Молдове. Деликатные меню, кэнди-бар, пастельный декор и персонал.',
      intro: [
        'Крестины — семейное событие с более деликатным меню: лёгкие закуски, одно-два горячих блюда, десерты и часто кэнди-бар в пастельных тонах.',
        'Средняя цена — 300–450 MDL на человека; для групп 20–60 гостей обслуживание и посуда часто включены.',
        'Отфильтруйте по городу и числу гостей. Если нужно меню без орехов, без лактозы или детское — отметьте соответствующие опции.',
      ],
      faq: [
        { q: 'Минимальное число гостей?', a: 'Обычно 15–20 человек; ниже — заказываются пакеты доставки.' },
        { q: 'Можно заказать только кэнди-бар?', a: 'Да, кондитерские доставляют десертный стол и декор отдельно.' },
        { q: 'Что обычно подают на крестинах?', a: 'Холодные закуски, суп или одно горячее блюдо, фруктовая тарелка и лёгкие десерты.' },
      ],
    },
  },
};

function genericCatCopy(name: string, nameRu: string, lang: Lang): SeoCopy {
  if (lang === 'ru') {
    return {
      title: `Кейтеринг ${nameRu} в Молдове — компании и цены | Catering Moldova`,
      meta: `Кейтеринг для событий «${nameRu}» в Кишинёве, Бельцах, Кагуле и по всей Молдове. Меню, цены, отзывы и прямые контакты компаний.`,
      intro: [
        `Компании из каталога обслуживают события формата «${nameRu}» по всей Молдове: меню под ваш бюджет, персонал, посуда и доставка на локацию.`,
        'Средняя цена — 250–450 MDL на человека за полное меню. Точная стоимость зависит от числа гостей, сложности блюд и расстояния.',
        'Выберите город и отправьте заявку — компании пришлют предложение напрямую, без комиссий и предоплаты на сайте.',
      ],
      faq: faqRu('вашем городе', 'районе'),
    };
  }
  return {
    title: `Catering ${name} în Moldova — firme și prețuri | Catering Moldova`,
    meta: `Catering pentru ${name} în Chișinău, Bălți, Cahul și toată Moldova. Meniuri, prețuri, recenzii și contacte directe ale firmelor.`,
    intro: [
      `Firmele din catalog organizează catering pentru ${name.toLowerCase()} în toată Moldova: meniu adaptat bugetului, personal de servire, veselă și transport la locație.`,
      'Prețul mediu pentru un meniu complet este de 250–450 MDL de persoană, iar costul final depinde de numărul de invitați, de complexitatea meniului și de distanță.',
      'Alege orașul, setează bugetul și trimite cererea. Vei primi oferta direct de la firmă, fără comision și fără plată online.',
    ],
    faq: faqRo('orașul tău', 'raion'),
  };
}

export function categoryCopy(name: string, nameRu: string, slug: string, lang: Lang, override?: string | null): SeoCopy {
  const specific = catSpecific[slug]?.[lang === 'en' ? 'ro' : lang];
  const base = specific ?? genericCatCopy(name, nameRu, lang);
  if (override && override.trim()) return { ...base, intro: [override.trim(), ...base.intro] };
  return base;
}

/* ------------------------------------------------------------------ static */
export const staticPages: Record<'about' | 'privacy' | 'terms', Record<Lang, { title: string; blocks: { h?: string; p?: string[]; list?: string[] }[] }>> = {
  about: {
    ro: {
      title: 'Despre proiect',
      blocks: [
        { p: ['Catering Moldova este un catalog independent al firmelor de catering din Republica Moldova. Scopul nostru este simplu: să te ajutăm să găsești rapid compania potrivită pentru evenimentul tău și să le oferim firmelor locale un canal gratuit de promovare.'] },
        { h: 'Ce facem', p: ['Adunăm într-un singur loc profilele firmelor de catering din Chișinău, Bălți, Cahul, Orhei, Ungheni, Soroca, Comrat și din alte localități, împreună cu meniurile, prețurile, galeriile foto și recenziile clienților.'] },
        { h: 'Ce nu facem', list: ['Nu intermediem plata — nu există plată online pe site.', 'Nu luăm comision din contractele dintre tine și firmă.', 'Nu publicăm profiluri neverificate: fiecare firmă este aprobată manual de un administrator.', 'Nu vindem datele tale de contact.'] },
        { h: 'Pentru firme', p: ['Înscrierea este gratuită. Îți creezi contul, completezi profilul, adaugi meniurile și serviciile cu prețuri, apoi primești cereri direct de la clienți, pe e-mail sau în panoul de control.'] },
        { h: 'Cum ne finanțăm', p: ['Proiectul este susținut din servicii opționale de promovare pentru firme. Conținutul public și înscrierea de bază rămân gratuite.'] },
      ],
    },
    ru: {
      title: 'О проекте',
      blocks: [
        { p: ['Catering Moldova — независимый каталог кейтеринговых компаний Республики Молдова. Наша цель проста: помочь вам быстро найти подходящую компанию и дать местному бизнесу бесплатный канал продвижения.'] },
        { h: 'Что мы делаем', p: ['Собираем в одном месте профили компаний из Кишинёва, Бельц, Кагула, Оргеева, Унген, Сорок, Комрата и других населённых пунктов: меню, цены, фотогалереи и отзывы клиентов.'] },
        { h: 'Чего мы не делаем', list: ['Не принимаем оплату — онлайн-платежей на сайте нет.', 'Не берём комиссию с договоров между вами и компанией.', 'Не публикуем непроверенные профили: каждая компания одобряется администратором вручную.', 'Не продаём ваши контактные данные.'] },
        { h: 'Компаниям', p: ['Регистрация бесплатна. Создайте аккаунт, заполните профиль, добавьте меню и услуги с ценами — и получайте заявки напрямую на почту или в личном кабинете.'] },
        { h: 'Как мы существуем', p: ['Проект поддерживается за счёт необязательных услуг продвижения для компаний. Публичный контент и базовая регистрация остаются бесплатными.'] },
      ],
    },
    en: {
      title: 'About this project',
      blocks: [
        { p: ['Catering Moldova is an independent directory of catering companies in the Republic of Moldova. The goal is simple: help you find the right company for your event and give local businesses a free promotion channel.'] },
        { h: 'What we do', p: ['We bring together profiles of catering companies from Chișinău, Bălți, Cahul, Orhei, Ungheni, Soroca, Comrat and other towns, with their menus, prices, photo galleries and client reviews.'] },
        { h: 'What we do not do', list: ['We do not process payments — there is no online payment on the site.', 'We take no commission from your contract with the company.', 'We do not publish unverified profiles: every company is approved manually by an administrator.', 'We do not sell your contact data.'] },
        { h: 'For businesses', p: ['Listing is free. Create an account, complete your profile, add menus and services with prices, then receive inquiries directly by email or in your dashboard.'] },
      ],
    },
  },
  privacy: {
    ro: {
      title: 'Politica de confidențialitate',
      blocks: [
        { p: ['Această politică explică ce date colectăm, de ce le colectăm și ce drepturi ai. Ultima actualizare: 2026.'] },
        { h: '1. Operatorul datelor', p: ['Operatorul datelor cu caracter personal este administratorul acestui site. Pentru orice solicitare legată de datele tale, scrie la adresa de e-mail afișată în pagina de Contact.'] },
        { h: '2. Datele pe care le colectăm', list: ['Pentru vizitatori: adresa IP (transformată în cod ireversibil), pagina accesată și tipul dispozitivului — doar pentru statistici și prevenirea spamului.', 'Pentru utilizatorii care trimit o cerere: nume, e-mail, telefon, data evenimentului, numărul de invitați și mesajul.', 'Pentru firmele înscrise: datele de autentificare (e-mail și parolă stocate criptat de furnizorul de autentificare), datele de contact publicate voluntar în profil și conținutul încărcat (logo, fotografii, descrieri).'] },
        { h: '3. Scopul prelucrării', p: ['Folosim datele pentru a funcționa site-ul, pentru a transmite cererile tale firmelor selectate, pentru a modera recenziile și conținutul, pentru a preveni abuzurile și pentru statistici agregate de trafic.'] },
        { h: '4. Temeiul legal', p: ['Prelucrăm datele în baza consimțământului tău (formularele trimise), a interesului nostru legitim (securitatea și prevenirea spamului) și, pentru firmele înscrise, în baza relației contractuale de utilizare a platformei.'] },
        { h: '5. Divulgarea datelor', p: ['Mesajul și datele de contact dintr-o cerere sunt transmise doar firmei căreia îi adresezi cererea. Nu vindem datele și nu le transmitem terților în scop de marketing.'] },
        { h: '6. Stocarea', p: ['Datele sunt stocate pe serverele furnizorilor noștri de găzduire și baze de date din Uniunea Europeană. Parolele sunt stocate doar sub formă criptată (hash). Cererile sunt păstrate 24 de luni, apoi pot fi șterse.'] },
        { h: '7. Cookie-uri', p: ['Folosim cookie-uri strict necesare pentru autentificare și pentru salvarea preferințelor de limbă și a listei de favorite. Nu folosim module de publicitate sau tracking terț fără consimțământ.'] },
        { h: '8. Drepturile tale', list: ['Accesul la datele tale.', 'Rectificarea datelor inexacte.', 'Ștergerea datelor („dreptul de a fi uitat”).', 'Restrângerea sau opoziția față de prelucrare.', 'Portabilitatea datelor.', 'Depunerea unei plângeri la Autoritatea Națională pentru Protecția Datelor cu Caracter Personal.'] },
        { h: '9. Securitatea', p: ['Aplicăm măsuri tehnice și organizatorice rezonabile: conexiuni criptate (HTTPS), control al accesului pe bază de roluri și limitarea ratei de trimitere a formularelor.'] },
        { h: '10. Contact', p: ['Pentru exercitarea drepturilor tale sau pentru orice întrebare, scrie-ne la adresa de e-mail din pagina de Contact. Răspundem în maximum 30 de zile.'] },
      ],
    },
    ru: {
      title: 'Политика конфиденциальности',
      blocks: [
        { p: ['Эта политика объясняет, какие данные мы собираем, зачем и какие у вас есть права. Последнее обновление: 2026 год.'] },
        { h: '1. Оператор данных', p: ['Оператором персональных данных является администратор сайта. По любым вопросам пишите на e-mail, указанный на странице «Контакты».'] },
        { h: '2. Какие данные мы собираем', list: ['У посетителей: IP-адрес (преобразуется в необратимый код), посещённая страница и тип устройства — только для статистики и защиты от спама.', 'У отправителей заявок: имя, e-mail, телефон, дата события, число гостей и текст сообщения.', 'У зарегистрированных компаний: данные для входа (e-mail и пароль хранятся в зашифрованном виде у провайдера аутентификации), добровольно опубликованные контакты и загруженный контент.'] },
        { h: '3. Цели обработки', p: ['Работа сайта, передача ваших заявок выбранным компаниям, модерация отзывов и контента, предотвращение злоупотреблений и агрегированная статистика.'] },
        { h: '4. Правовое основание', p: ['Ваше согласие (отправленные формы), наш законный интерес (безопасность и защита от спама) и договорные отношения с зарегистрированными компаниями.'] },
        { h: '5. Передача данных', p: ['Сообщение и контакты из заявки передаются только той компании, которой вы её адресовали. Мы не продаём данные и не передаём их третьим лицам для маркетинга.'] },
        { h: '6. Хранение', p: ['Данные хранятся на серверах наших провайдеров в Европейском союзе. Пароли — только в виде хэша. Заявки хранятся 24 месяца, затем могут быть удалены.'] },
        { h: '7. Cookie', p: ['Мы используем строго необходимые cookie для авторизации, сохранения языка и списка избранного. Рекламные и сторонние трекеры без согласия не применяются.'] },
        { h: '8. Ваши права', list: ['Доступ к данным.', 'Исправление неточных данных.', 'Удаление данных.', 'Ограничение или возражение против обработки.', 'Переносимость данных.', 'Жалоба в национальный орган по защите персональных данных.'] },
        { h: '9. Безопасность', p: ['Мы применяем разумные технические меры: HTTPS, ролевой контроль доступа и ограничение частоты отправки форм.'] },
        { h: '10. Контакты', p: ['Для реализации прав или по любым вопросам напишите на e-mail со страницы «Контакты». Ответим в течение 30 дней.'] },
      ],
    },
    en: {
      title: 'Privacy Policy',
      blocks: [
        { p: ['This policy explains what data we collect, why we collect it and what rights you have. Last updated: 2026.'] },
        { h: '1. Data controller', p: ['The data controller is the administrator of this website. For any privacy request, write to the email shown on the Contact page.'] },
        { h: '2. Data we collect', list: ['Visitors: IP address (irreversibly hashed), page visited and device type — for statistics and spam prevention only.', 'Inquiry senders: name, email, phone, event date, guest count and message.', 'Listed businesses: sign-in data (email and password stored hashed by the authentication provider), contact details you choose to publish and uploaded content.'] },
        { h: '3. Purpose', p: ['Running the site, delivering your inquiries to the companies you select, moderating reviews, preventing abuse and aggregated traffic statistics.'] },
        { h: '4. Legal basis', p: ['Your consent (submitted forms), our legitimate interest (security and spam prevention) and the contractual relationship with listed companies.'] },
        { h: '5. Disclosure', p: ['Inquiry details are sent only to the company you address. We do not sell data or share it for third-party marketing.'] },
        { h: '6. Storage', p: ['Data is stored on our providers’ servers in the European Union. Passwords are stored hashed only. Inquiries are kept for 24 months.'] },
        { h: '7. Cookies', p: ['We use strictly necessary cookies for authentication, language preference and your saved favourites. No advertising trackers are used without consent.'] },
        { h: '8. Your rights', list: ['Access.', 'Rectification.', 'Erasure.', 'Restriction or objection.', 'Portability.', 'Lodging a complaint with the national data protection authority.'] },
        { h: '9. Contact', p: ['To exercise your rights, write to the email on the Contact page. We reply within 30 days.'] },
      ],
    },
  },
  terms: {
    ro: {
      title: 'Termeni și condiții',
      blocks: [
        { p: ['Folosind acest site, accepți termenii de mai jos. Te rugăm să îi citești înainte de a crea un cont sau de a trimite o cerere.'] },
        { h: '1. Rolul site-ului', p: ['Site-ul este un catalog de prezentare. Nu suntem parte în contractele dintre clienți și firmele de catering, nu intermediem plăți și nu garantăm executarea serviciilor.'] },
        { h: '2. Conturi de firmă', list: ['Fiecare cont aparține unei singure entități și trebuie să corespundă unei afaceri reale.', 'Informațiile publicate trebuie să fie exacte: denumire, contacte, prețuri și fotografii proprii sau pentru care ai drept de utilizare.', 'Esti responsabil pentru conținutul încărcat și pentru respectarea drepturilor de proprietate intelectuală.', 'Profilurile devin publice doar după aprobarea administratorului.'] },
        { h: '3. Cereri și recenzii', p: ['Cererile trimise prin formular ajung la firma aleasă. Recenziile trebuie să reflecte o experiență reală; nu sunt acceptate recenzii false, ofensatoare sau cu conținut comercial nesolicitat. Administratorul poate modera sau șterge conținutul care încalcă aceste reguli.'] },
        { h: '4. Utilizare interzisă', list: ['Colectarea automată a datelor (scraping) fără acord scris.', 'Încărcarea de conținut ilegal, discriminatoriu sau care încalcă drepturile terților.', 'Abuzarea formularelor (spam, mesaje automate, tentative de fraudă).', 'Încercarea de a accesa conturile altor utilizatori sau zonele administrative.'] },
        { h: '5. Disponibilitate și răspundere', p: ['Site-ul este oferit „așa cum este”. Nu răspundem pentru daune indirecte rezultate din utilizarea catalogului sau din relația cu firmele listate. Prețurile afișate sunt informative și se confirmă de fiecare firmă în parte.'] },
        { h: '6. Date cu caracter personal', p: ['Prelucrarea datelor este descrisă în Politica de confidențialitate, care face parte din acești termeni.'] },
        { h: '7. Modificări', p: ['Putem actualiza termenii oricând. Varianta în vigoare este cea publicată pe site la data utilizării.'] },
        { h: '8. Contact și litigii', p: ['Pentru întrebări scrie-ne la adresa din pagina de Contact. Eventualele litigii se soluționează pe cale amiabilă, iar în caz contrar de instanțele competente din Republica Moldova.'] },
      ],
    },
    ru: {
      title: 'Условия использования',
      blocks: [
        { p: ['Используя сайт, вы принимаете условия ниже. Пожалуйста, прочитайте их перед созданием аккаунта или отправкой заявки.'] },
        { h: '1. Роль сайта', p: ['Сайт является каталогом. Мы не участвуем в договорах между клиентами и компаниями, не принимаем платежи и не гарантируем исполнение услуг.'] },
        { h: '2. Аккаунты компаний', list: ['Один аккаунт — одна организация, соответствующая реальному бизнесу.', 'Публикуемые данные должны быть точными: название, контакты, цены и собственные фотографии либо те, на которые у вас есть права.', 'Вы отвечаете за загруженный контент и соблюдение прав интеллектуальной собственности.', 'Профили становятся публичными только после одобрения администратором.'] },
        { h: '3. Заявки и отзывы', p: ['Заявки отправляются выбранной компании. Отзывы должны отражать реальный опыт; запрещены ложные, оскорбительные и рекламные отзывы. Администратор может модерировать или удалять контент, нарушающий правила.'] },
        { h: '4. Запрещённое использование', list: ['Автоматический сбор данных (скрейпинг) без письменного согласия.', 'Загрузка незаконного, дискриминационного контента или нарушающего права третьих лиц.', 'Злоупотребление формами (спам, автоматические сообщения, попытки мошенничества).', 'Попытки доступа к чужим аккаунтам и админ-разделам.'] },
        { h: '5. Доступность и ответственность', p: ['Сайт предоставляется «как есть». Мы не несём ответственности за косвенные убытки. Цены носят информационный характер и подтверждаются компанией.'] },
        { h: '6. Персональные данные', p: ['Обработка данных описана в Политике конфиденциальности, являющейся частью этих условий.'] },
        { h: '7. Изменения', p: ['Мы можем обновлять условия в любое время. Действует версия, опубликованная на сайте.'] },
        { h: '8. Контакты', p: ['По вопросам пишите на e-mail со страницы «Контакты». Споры решаются мирным путём, а при невозможности — в судах Республики Молдова.'] },
      ],
    },
    en: {
      title: 'Terms and conditions',
      blocks: [
        { p: ['By using this website you accept the terms below. Please read them before creating an account or sending an inquiry.'] },
        { h: '1. Role of the site', p: ['This site is a directory. We are not a party to contracts between clients and catering companies, we do not process payments and we do not guarantee service delivery.'] },
        { h: '2. Business accounts', list: ['One account belongs to a single entity and must correspond to a real business.', 'Published information must be accurate: name, contacts, prices and photos you own or are licensed to use.', 'You are responsible for uploaded content and for respecting intellectual property rights.', 'Profiles become public only after administrator approval.'] },
        { h: '3. Inquiries and reviews', p: ['Inquiries go to the company you select. Reviews must reflect real experience; fake, offensive or unsolicited commercial content is not allowed and may be removed.'] },
        { h: '4. Prohibited use', list: ['Automated scraping without written consent.', 'Uploading illegal or discriminatory content or content infringing third-party rights.', 'Abusing forms (spam, automated messages, fraud attempts).', 'Attempting to access other users’ accounts or admin areas.'] },
        { h: '5. Liability', p: ['The site is provided "as is". We are not liable for indirect damages. Displayed prices are indicative and confirmed by each company.'] },
        { h: '6. Changes', p: ['We may update these terms at any time; the version published on the site applies.'] },
      ],
    },
  },
};
