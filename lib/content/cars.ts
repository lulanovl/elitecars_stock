export type Car = {
  slug: string;
  brand: string;
  model: string;
  segment: string;
  /** Approximate price range of a new car in stock in Kyrgyzstan, USD */
  price: [number, number];
  engines: string[];
  drive: string;
  highlights: string[];
  description: string;
  whyPopular: string[];
  /** Tailwind gradient classes for the card artwork (used when there is no photo) */
  accent: string;
  /** Photo path under /public, e.g. "/cars/genesis-g90.jpg". Landscape ~16:10 works best. */
  image?: string;
  /** Attribution for the photo (required for CC-licensed images); shown as a caption on the car page. */
  imageCredit?: { author: string; license?: string; source: string };
};

export const cars: Car[] = [
  {
    slug: "mercedes-benz-e-class",
    brand: "Mercedes-Benz",
    model: "E-Class",
    segment: "Бизнес-седан",
    price: [75000, 110000],
    engines: ["E 250 (2.0, 204 л.с.)", "E 300 (2.0, 258 л.с.)", "E 350 4MATIC", "E 450 4MATIC (3.0)"],
    drive: "Задний / 4MATIC",
    highlights: ["AMG Line", "Burmester", "MBUX", "Пневмоподвеска"],
    description:
      "Бизнес-седан нового поколения W214. В Бишкеке регулярно бывают автомобили в наличии у дилеров и импортёров — в версиях AMG Line и Exclusive, с бензиновыми и гибридными моторами.",
    whyPopular: [
      "Самый ходовой премиальный седан — выбор в наличии шире, чем у других моделей",
      "Можно сравнить несколько одинаковых автомобилей и выбрать лучший по цене",
      "Новый автомобиль с нулевым пробегом — без истории и рисков вторичного рынка",
    ],
    accent: "from-zinc-600/80 to-neutral-800/80",
    image: "/cars/mercedes-benz-e-class.jpg",
    imageCredit: { author: "Alexander-93", license: "CC BY-SA 4.0", source: "https://commons.wikimedia.org/wiki/File:Mercedes-AMG_W214_53_Hybrid_IMG_1292.jpg" },
  },
  {
    slug: "mercedes-benz-s-class",
    brand: "Mercedes-Benz",
    model: "S-Class",
    segment: "Представительский седан",
    price: [140000, 230000],
    engines: ["S 400d 4MATIC (3.0 дизель)", "S 450 4MATIC (3.0)", "S 500 4MATIC (3.0)", "S 580 4MATIC (4.0)"],
    drive: "4MATIC",
    highlights: ["W223", "Задняя ось с подруливанием", "Executive-пакет", "Burmester 4D"],
    description:
      "Флагман Mercedes-Benz в поколении W223. Найдём автомобиль нужной версии и цвета у дилеров и импортёров Кыргызстана, проверим комплектацию по VIN и договоримся о цене.",
    whyPopular: [
      "Длиннобазные версии с пакетами Executive и Burmester 4D",
      "Разброс цен между продавцами заметный — на торге экономия ощутимая",
      "Проверяем год выпуска и комплектацию по VIN до оплаты",
    ],
    accent: "from-slate-700/80 to-slate-900/80",
    image: "/cars/mercedes-benz-s-class.jpg",
    imageCredit: { author: "MrWalkr", license: "CC BY-SA 4.0", source: "https://commons.wikimedia.org/wiki/File:W223_Front.jpg" },
  },
  {
    slug: "mercedes-benz-gle",
    brand: "Mercedes-Benz",
    model: "GLE",
    segment: "Премиальный кроссовер",
    price: [95000, 150000],
    engines: ["GLE 300d (2.0 дизель)", "GLE 400d 4MATIC (3.0 дизель)", "GLE 450 4MATIC (3.0)", "GLE 53 AMG"],
    drive: "4MATIC",
    highlights: ["7 мест", "AIRMATIC", "AMG Line", "Дизель 400d"],
    description:
      "Семейный кроссовер премиум-класса с возможностью третьего ряда. Одна из самых востребованных моделей — новые автомобили появляются в наличии регулярно.",
    whyPopular: [
      "Пневмоподвеска и полный пакет ассистентов в популярных комплектациях",
      "Бензин, дизель и гибрид — подберём под ваш сценарий",
      "Высокая ликвидность при последующей продаже",
    ],
    accent: "from-stone-600/80 to-stone-800/80",
    image: "/cars/mercedes-benz-gle.jpg",
    imageCredit: { author: "Charles from Port Chester, New York", license: "CC0", source: "https://commons.wikimedia.org/wiki/File:Mercedes-Benz_GLE_350_de_4MATIC_(V167,_2024)_(54732467967).jpg" },
  },
  {
    slug: "mercedes-benz-g-class",
    brand: "Mercedes-Benz",
    model: "G-Class",
    segment: "Внедорожник",
    price: [190000, 320000],
    engines: ["G 400d (3.0 дизель)", "G 500 (4.0)", "G 63 AMG (4.0)"],
    drive: "Полный с тремя блокировками",
    highlights: ["W465", "AMG G 63", "Manufaktur", "Дизель G 400d"],
    description:
      "Легендарный внедорожник: G 500, G 63 AMG и электрический G 580. Ищем конкретную спецификацию — цвет, пакеты Manufaktur, салон — среди автомобилей в наличии и в ближайших поступлениях.",
    whyPopular: [
      "Редкие спецификации Manufaktur и AMG",
      "Проверяем лакокрасочное покрытие — транспортные повреждения встречаются и у новых машин",
      "Стабильно высокий спрос и ликвидность",
    ],
    accent: "from-neutral-700/80 to-black/80",
    image: "/cars/mercedes-benz-g-class.jpg",
    imageCredit: { author: "Alexander Migl", license: "CC BY-SA 4.0", source: "https://commons.wikimedia.org/wiki/File:Mercedes-Benz_G_580_with_EQ_Technology_DSC_8256.jpg" },
  },
  {
    slug: "bmw-5-series",
    brand: "BMW",
    model: "5 Series",
    segment: "Бизнес-седан",
    price: [70000, 105000],
    engines: ["520i (2.0)", "530i xDrive (2.0)", "523d (2.0 дизель)", "540i xDrive (3.0)"],
    drive: "Задний / xDrive",
    highlights: ["M Sport", "Laserlight", "Harman Kardon", "G60"],
    description:
      "Новое поколение G60 — седан, который чаще других BMW встречается в наличии. Подберём версию M Sport с нужным мотором и пакетами.",
    whyPopular: [
      "Большой выбор новых автомобилей в наличии",
      "Пакет M Sport в большинстве предложений",
      "Сравниваем несколько продавцов и договариваемся о лучшей цене",
    ],
    accent: "from-sky-800/80 to-slate-900/80",
    image: "/cars/bmw-5-series.jpg",
    imageCredit: { author: "Alexander-93", license: "CC BY-SA 4.0", source: "https://commons.wikimedia.org/wiki/File:BMW_G60_550e_1X7A1829.jpg" },
  },
  {
    slug: "bmw-x5",
    brand: "BMW",
    model: "X5",
    segment: "Премиальный кроссовер",
    price: [95000, 145000],
    engines: ["xDrive30d (3.0 дизель)", "xDrive40i (3.0)", "M50i / M60i (4.4)"],
    drive: "xDrive",
    highlights: ["G05", "Пневмоподвеска", "M Sport", "Панорама Sky Lounge"],
    description:
      "Классика сегмента премиальных кроссоверов. Ищем новые xDrive40i и xDrive30d в пакете M Sport с пневмоподвеской и полным набором опций.",
    whyPopular: [
      "Проверенные моторы B57 и B58",
      "Богатые комплектации с пневмоподвеской и Laserlight",
      "Стабильный спрос и высокая ликвидность",
    ],
    accent: "from-blue-900/80 to-slate-900/80",
    image: "/cars/bmw-x5.jpg",
    imageCredit: { author: "M 93", license: "CC BY-SA 3.0 de", source: "https://commons.wikimedia.org/wiki/File:BMW_iX5_60_xDrive_(G65)_–_f_20082026.jpg" },
  },
  {
    slug: "bmw-7-series",
    brand: "BMW",
    model: "7 Series",
    segment: "Представительский седан",
    price: [130000, 200000],
    engines: ["740i (3.0)", "740d xDrive (3.0 дизель)", "760i xDrive (4.4)", "i7 (электро)"],
    drive: "Задний / xDrive",
    highlights: ["G70", "Theatre Screen", "Executive Lounge", "Bowers & Wilkins"],
    description:
      "Поколение G70 с 31-дюймовым экраном для задних пассажиров, включая электрический i7. Найдём автомобиль в наличии и проверим его до покупки.",
    whyPopular: [
      "Технологический флагман в комплектациях Executive Lounge",
      "Электрический i7 — тихий и экономичный в городе",
      "Проверяем комплектацию по VIN, чтобы опции совпадали с обещанными",
    ],
    accent: "from-indigo-900/80 to-slate-950/80",
    image: "/cars/bmw-7-series.jpg",
    imageCredit: { author: "Tokumeigakarinoaoshima", license: "CC BY-SA 4.0", source: "https://commons.wikimedia.org/wiki/File:BMW_740d_xDrive_Excellence_(G70)_front.jpg" },
  },
  {
    slug: "porsche-cayenne",
    brand: "Porsche",
    model: "Cayenne",
    segment: "Спортивный кроссовер",
    price: [120000, 210000],
    engines: ["Cayenne (3.0)", "Cayenne E-Hybrid (3.0)", "Cayenne S (2.9 / 4.0)", "Cayenne Coupé"],
    drive: "Полный",
    highlights: ["Coupé", "E-Hybrid", "Sport Chrono", "Bose / Burmester"],
    description:
      "Porsche Cayenne и Cayenne Coupé часто приходят с длинным списком индивидуальных опций. Подберём автомобиль с нужной конфигурацией и проверим её по заводской спецификации.",
    whyPopular: [
      "Богатые индивидуальные конфигурации",
      "E-Hybrid — комфорт и экономичность",
      "Сверяем опции по заводской спецификации до оплаты",
    ],
    accent: "from-red-900/80 to-neutral-900/80",
    image: "/cars/porsche-cayenne.jpg",
    imageCredit: { author: "M 93", license: "CC BY-SA 3.0 de", source: "https://commons.wikimedia.org/wiki/File:Porsche_Cayenne_S_(III,_Facelift)_–_f_22022025.jpg" },
  },
  {
    slug: "porsche-panamera",
    brand: "Porsche",
    model: "Panamera",
    segment: "Спортивный седан",
    price: [140000, 240000],
    engines: ["Panamera 4 (2.9)", "Panamera 4 E-Hybrid", "Panamera GTS (4.0)", "Sport Turismo"],
    drive: "Полный",
    highlights: ["Sport Turismo", "E-Hybrid", "PASM", "Executive"],
    description:
      "Пятидверный Gran Turismo Porsche нового поколения. Ищем версии 4, 4 E-Hybrid и GTS в наличии у продавцов Кыргызстана.",
    whyPopular: [
      "Новое поколение с обновлённым салоном",
      "Гибридные версии с большим запасом хода",
      "Индивидуальные цвета и отделки салона",
    ],
    accent: "from-rose-900/80 to-neutral-900/80",
    image: "/cars/porsche-panamera.jpg",
    imageCredit: { author: "Alexander-93", license: "CC BY-SA 4.0", source: "https://commons.wikimedia.org/wiki/File:Porsche_972_IMG_9526.jpg" },
  },
  {
    slug: "range-rover-sport",
    brand: "Land Rover",
    model: "Range Rover Sport",
    segment: "Премиальный внедорожник",
    price: [120000, 190000],
    engines: ["D300 (3.0 дизель)", "P400 (3.0)", "P530 (4.4 V8)"],
    drive: "Полный",
    highlights: ["L461", "Dynamic SE / HSE", "Meridian", "Пневмоподвеска"],
    description:
      "Третье поколение Range Rover Sport с фирменным минималистичным дизайном. Найдём новый автомобиль в версиях Dynamic SE / HSE и Autobiography.",
    whyPopular: [
      "Экономичный и тяговитый дизель D300",
      "Комплектации Autobiography с полным пакетом опций",
      "Проверка электроники и комплектации перед покупкой",
    ],
    accent: "from-emerald-900/80 to-neutral-900/80",
    image: "/cars/range-rover-sport.jpg",
    imageCredit: { author: "Alexander-93", license: "CC BY-SA 4.0", source: "https://commons.wikimedia.org/wiki/File:Range_Rover_Sport_Series_III_1X7A7071.jpg" },
  },
  {
    slug: "audi-q8",
    brand: "Audi",
    model: "Q8",
    segment: "Премиальный кроссовер",
    price: [90000, 135000],
    engines: ["45 TDI quattro (3.0 дизель)", "55 TFSI quattro (3.0)", "SQ8 (4.0)"],
    drive: "quattro",
    highlights: ["S line", "Матричные фары", "Bang & Olufsen", "Пневмоподвеска"],
    description:
      "Флагманский кроссовер-купе Audi. Подберём новый Q8 в пакете S line с матричной оптикой и адаптивной пневмоподвеской.",
    whyPopular: [
      "Комплектации с полным набором опций",
      "Дизель 45 TDI — экономичный и ресурсный мотор",
      "Одна из лучших цен в сегменте больших кроссоверов-купе",
    ],
    accent: "from-gray-700/80 to-gray-900/80",
    image: "/cars/audi-q8.jpg",
    imageCredit: { author: "Matti Blume", license: "CC BY-SA 4.0", source: "https://commons.wikimedia.org/wiki/File:Audi,_EMS_2024,_Essen_(P1031581).jpg" },
  },
];

export function getCar(slug: string) {
  return cars.find((c) => c.slug === slug);
}

export const formatUsd = (n: number) =>
  new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

export const formatRange = ([a, b]: [number, number]) =>
  `${formatUsd(a)} – ${formatUsd(b)}`;
