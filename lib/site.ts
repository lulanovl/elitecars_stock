/**
 * Central site configuration.
 * Everything brand-specific (name, contacts, domain) lives here so it can be
 * changed in one place without touching page content.
 */

export const siteConfig = {
  name: "Elite Cars - Stock",
  legalName: "Elite Cars - Stock — подбор автомобилей из Кыргызстана без посредников",
  tagline: "Подбор автомобилей из Кыргызстана без посредников",
  /** Short English tagline printed under the wordmark */
  logoTagline: "Stock · New cars in Kyrgyzstan",
  description:
    "Подберём автомобиль из Кыргызстана без посредников: сравним предложения дилеров и импортёров, проверим машину перед покупкой, договоримся о цене и оформим документы. Передача в Бишкеке или доставка по ЕАЭС.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://elitecars-stock.vercel.app",
  locale: "ru_RU",
  language: "ru",
  // Regions used in metadata / structured data
  areaServed: ["Кыргызстан", "Казахстан", "Россия"],
  hubCity: "Бишкек",
  foundingYear: 2021,

  contacts: {
    // Displayed number (formatted) and raw for tel: links
    phoneDisplay: "+996 220 000 244",
    phoneRaw: "+996220000244",
    whatsapp: "996220000244",
    telegram: "eliteecars",
    email: "elitecars.co.ltd@gmail.com",
    address: "г. Бишкек, Кыргызстан",
    workingHours: "Ежедневно, 09:00–21:00 (Бишкек)",
  },

  // Leave a field empty to hide the link everywhere on the site.
  social: {
    telegramChannel: "",
    instagram: "",
    youtube: "",
    vk: "",
  },

  // Key numbers shown on the landing page. Update as the business grows.
  stats: [
    { value: "0 км", label: "только новые автомобили" },
    { value: "7–10 дней", label: "от заявки до ключей" },
    { value: "Фикс.", label: "комиссия в договоре" },
    { value: "100%", label: "проверка перед покупкой" },
  ],

  // Verification tokens for webmaster tools (optional)
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "",
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION ?? "",
  },

  analytics: {
    yandexMetrikaId: process.env.NEXT_PUBLIC_YM_ID ?? "",
  },

  /**
   * Feature flags for sections that are temporarily switched off.
   * A disabled section is hidden from the nav/footer/sitemap and its routes return 404.
   */
  features: {
    blog: false,
    faq: false,
  },
} as const;

export const links = {
  whatsapp: (text?: string) =>
    `https://wa.me/${siteConfig.contacts.whatsapp}${
      text ? `?text=${encodeURIComponent(text)}` : ""
    }`,
  telegram: () => `https://t.me/${siteConfig.contacts.telegram}`,
  phone: () => `tel:${siteConfig.contacts.phoneRaw}`,
  email: () => `mailto:${siteConfig.contacts.email}`,
};

/** Default WhatsApp greeting used by buttons across the site. */
export const WA_DEFAULT = "Здравствуйте! Хочу подобрать новый автомобиль в Кыргызстане.";

type NavItem = { href: string; label: string; short: string; highlight?: boolean; enabled?: boolean };

const allNav: NavItem[] = [
  { href: "/kak-eto-rabotaet", label: "Как это работает", short: "Как это работает", highlight: true },
  { href: "/pochemu-kyrgyzstan", label: "Почему в Кыргызстане", short: "Почему КР" },
  { href: "/avtomobili", label: "Автомобили", short: "Автомобили" },
  { href: "/blog", label: "Блог", short: "Блог", enabled: siteConfig.features.blog },
  { href: "/faq", label: "FAQ", short: "FAQ", enabled: siteConfig.features.faq },
  { href: "/kontakty", label: "Контакты", short: "Контакты" },
];

/** Navigation items shown in the header and footer (disabled sections filtered out). */
export const nav = allNav.filter((n) => n.enabled !== false);

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}
