import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileCtaBar } from "@/components/MobileCtaBar";
import { JsonLd } from "@/components/JsonLd";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { YandexMetrika } from "@/components/YandexMetrika";
import { SiteChrome } from "@/components/SiteChrome";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  display: "swap",
  weight: ["600", "700", "800"],
});


export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `Подбор новых автомобилей в Кыргызстане — ${siteConfig.name}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "новые автомобили Кыргызстан",
    "купить новый автомобиль Бишкек",
    "подбор автомобиля Бишкек",
    "автоподбор Кыргызстан",
    "новый Mercedes Бишкек",
    "новый BMW Бишкек",
    "авто в наличии Бишкек",
    "проверка нового автомобиля",
    "авто из Кыргызстана в Казахстан",
    "авто из Кыргызстана в Россию",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "automotive",
  formatDetection: { telephone: true, email: true, address: false },
  alternates: { canonical: siteConfig.url },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `Подбор новых автомобилей в Кыргызстане — ${siteConfig.name}`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `Подбор новых автомобилей в Кыргызстане — ${siteConfig.name}`,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: siteConfig.verification.google || undefined,
    yandex: siteConfig.verification.yandex || undefined,
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <SiteChrome>
          <Header />
        </SiteChrome>
        <main className="flex-1">{children}</main>
        <SiteChrome>
          <Footer />
          <MobileCtaBar />
        </SiteChrome>
        <YandexMetrika />
      </body>
    </html>
  );
}
