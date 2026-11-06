import type { Metadata } from "next";
import { siteConfig, links, WA_DEFAULT } from "@/lib/site";
import { steps } from "@/lib/content/steps";
import { faq } from "@/lib/content/faq";
import { getFeaturedCars } from "@/lib/featured";
import { faqJsonLd, howToJsonLd, serviceJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { Icon } from "@/components/ui/Icons";
import { ButtonAnchor, ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StockPanel } from "@/components/StockPanel";
import { FeaturedCarCard } from "@/components/CarCard";
import { Faq } from "@/components/Faq";
import { CtaSection } from "@/components/CtaSection";

export const metadata: Metadata = {
  alternates: { canonical: siteConfig.url },
};

// Блок «Что мы привозим чаще всего» меняется из админки (revalidatePath("/")),
// этот интервал — страховка на случай изменений в хранилище напрямую.
export const revalidate = 3600;

const brands = ["Mercedes-Benz", "BMW", "Porsche", "Land Rover", "Audi", "Lexus"];

const benefits = [
  {
    icon: Icon.Globe,
    title: "Весь рынок в одном запросе",
    text: "Официальные дилеры, импортёры, склады и ближайшие поступления. Вам не нужно объезжать салоны и обзванивать продавцов.",
  },
  {
    icon: Icon.Wallet,
    title: "Лучшая цена — не на витрине",
    text: "Одинаковые автомобили у разных продавцов стоят по-разному. Сравниваем предложения и торгуемся за вас.",
  },
  {
    icon: Icon.Eye,
    title: "Проверка перед оплатой",
    text: "Толщиномер по всему кузову, сверка комплектации и года выпуска по VIN, электроника и документы.",
  },
  {
    icon: Icon.Sparkles,
    title: "Только новые автомобили",
    text: "Нулевой пробег, без истории и рисков вторичного рынка. С гарантией — уточняем её условия у каждого продавца.",
  },
  {
    icon: Icon.Clock,
    title: "Быстро — машины в наличии",
    text: "Автомобиль уже в Кыргызстане: от заявки до ключей — от 1 до 7 дней, без месяцев ожидания доставки.",
  },
  {
    icon: Icon.Document,
    title: "Без переплат и навязанных услуг",
    text: "Фиксированная комиссия в договоре. За автомобиль вы платите напрямую продавцу.",
  },
];

const trust = [
  {
    icon: Icon.Document,
    title: "Договор и фиксированная комиссия",
    text: "Комиссия не зависит от цены автомобиля и прописана в договоре.",
  },
  {
    icon: Icon.Camera,
    title: "Фото- и видеоотчёт по каждому варианту",
    text: "Вы видите автомобиль, его состояние и документы до того, как принять решение.",
  },
  {
    icon: Icon.Shield,
    title: "Деньги — напрямую продавцу",
    text: "Оплата автомобиля по договору купли-продажи. Мы контролируем сделку, но не держим ваши деньги.",
  },
  {
    icon: Icon.Handshake,
    title: "Сопровождение до ключей",
    text: "Оформление, регистрация, страховка и доставка по ЕАЭС — по вашему запросу.",
  },
];

export default async function HomePage() {
  const featured = await getFeaturedCars();
  return (
    <>
      <JsonLd data={[serviceJsonLd(), howToJsonLd(steps), faqJsonLd(faq.slice(0, 6))]} />

      {/* HERO */}
      <section className="relative overflow-hidden bg-navy-900 text-white">
        <div className="grid-bg absolute inset-0 opacity-60" aria-hidden />

        <div className="container-x relative grid items-center gap-12 pt-14 pb-20 lg:grid-cols-[1.05fr_1fr] lg:pt-20 lg:pb-28">
          <div className="animate-fade-up min-w-0">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-white/80">
              <span className="size-1.5 rounded-full bg-accent-400" />
              Новые автомобили в наличии · Бишкек
            </span>
            <h1 className="font-display mt-6 text-balance text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.4rem]">
              Подбор новых автомобилей{" "}
              <span className="bg-gradient-to-r from-accent-300 to-accent-500 bg-clip-text text-transparent">
                в Кыргызстане
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70 sm:text-xl">
              Найдём нужный автомобиль среди предложений дилеров и импортёров, проверим его перед покупкой,
              договоримся о лучшей цене и оформим документы. Передача в Бишкеке или доставка по ЕАЭС.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/kak-eto-rabotaet" size="lg">
                Как это работает
                <Icon.ArrowRight className="size-5" />
              </ButtonLink>
              <ButtonAnchor
                href={links.whatsapp(WA_DEFAULT)}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline-light"
                size="lg"
              >
                <Icon.WhatsApp className="size-5" />
                Подобрать авто
              </ButtonAnchor>
            </div>

            <ul className="mt-10 grid gap-3 text-[15px] text-white/80 sm:grid-cols-2">
              {[
                "Только новые автомобили, 0 км",
                "Сравниваем цены по всему рынку",
                "Ключи — от 1 до 7 дней",
                "Личный менеджер и видеоотчёты",
              ].map((t) => (
                <li key={t} className="flex items-center gap-2.5">
                  <span className="flex size-5 items-center justify-center rounded-full bg-accent-500/20 text-accent-400">
                    <Icon.Check className="size-3" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="animate-fade-up delay-150 min-w-0">
            <StockPanel />
          </div>
        </div>

        {/* brands + stats */}
        <div className="relative border-t border-white/10">
          <div className="container-x flex flex-wrap items-center justify-center gap-x-10 gap-y-3 py-6 text-sm font-semibold tracking-[0.14em] text-white/45 uppercase">
            {brands.map((b) => (
              <span key={b}>{b}</span>
            ))}
          </div>
          <div className="container-x grid grid-cols-2 divide-white/10 border-t border-white/10 py-8 lg:grid-cols-4 lg:divide-x">
            {siteConfig.stats.map((s) => (
              <div key={s.label} className="px-2 py-3 text-center lg:px-6">
                <p className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{s.value}</p>
                <p className="mt-1 text-sm text-white/60">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading
            eyebrow="Зачем нужен подбор"
            title="Новый автомобиль — по лучшей цене и без сюрпризов"
            description="На рынке Кыргызстана десятки продавцов новых автомобилей. Мы знаем, где искать, что проверять и как торговаться."
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map(({ icon: I, title, text }) => (
              <div
                key={title}
                className="group rounded-3xl border border-line bg-white p-7 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <span className="flex size-12 items-center justify-center rounded-2xl bg-navy-900 text-accent-400 transition group-hover:bg-accent-500 group-hover:text-navy-900">
                  <I className="size-6" />
                </span>
                <h3 className="font-display mt-5 text-xl font-bold text-navy-900">{title}</h3>
                <p className="mt-2.5 text-[15.5px] leading-relaxed text-muted">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CARS */}
      <section className="bg-surface py-20 sm:py-28">
        <div className="container-x">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Автомобили"
              title="Что мы привозим чаще всего"
              description="Ориентировочные цены на новые автомобили в Бишкеке. Точная стоимость — по конкретному автомобилю."
            />
            <ButtonLink href="/avtomobili" variant="ghost" className="shrink-0 border border-line bg-white">
              Все модели
              <Icon.ArrowRight className="size-4" />
            </ButtonLink>
          </div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((c) => (
              <FeaturedCarCard key={c.id} car={c} />
            ))}
          </div>
        </div>
      </section>

      {/* WHY KYRGYZSTAN */}
      <section className="py-20 sm:py-28">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Почему Кыргызстан"
              title="Большой выбор новых автомобилей — уже на месте"
              description="В Кыргызстане новые автомобили продают и официальные дилеры, и импортёры. Выбор моделей и комплектаций шире, а машину можно увидеть до покупки."
            />
            <ul className="mt-8 space-y-4">
              {[
                ["Автомобили в наличии", "Не нужно ждать доставку месяцами — машина уже в стране."],
                ["Конкуренция продавцов", "Есть с чем сравнить и о чём торговаться."],
                ["Осмотр до покупки", "Вы или наш специалист видите автомобиль вживую до оплаты."],
                ["Страна ЕАЭС", "Подготовим документы и доставим автомобиль в Казахстан или Россию."],
              ].map(([t, d]) => (
                <li key={t} className="flex gap-4">
                  <span className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-accent-500 text-navy-900">
                    <Icon.Check className="size-4" />
                  </span>
                  <div>
                    <p className="font-semibold text-navy-900">{t}</p>
                    <p className="text-[15px] text-muted">{d}</p>
                  </div>
                </li>
              ))}
            </ul>
            <ButtonLink href="/pochemu-kyrgyzstan" variant="secondary" className="mt-9">
              Подробнее
              <Icon.ArrowRight className="size-4" />
            </ButtonLink>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: Icon.Handshake, step: "Где ищем", title: "Официальные дилеры", text: "Автомобили со склада дилера с заводской гарантией." },
              { icon: Icon.Globe, step: "Где ищем", title: "Импортёры", text: "Шире выбор комплектаций и цветов, часто ниже цена." },
              { icon: Icon.Truck, step: "Где ищем", title: "Ближайшие поступления", text: "Автомобили в пути — можно забронировать нужную конфигурацию." },
              { icon: Icon.Pin, step: "Передача", title: "Бишкек или ваш город", text: "Выдача в Бишкеке или автовоз по Кыргызстану и ЕАЭС." },
            ].map(({ icon: I, step, title, text }, i) => (
              <div
                key={title}
                className={`rounded-3xl p-6 ${i % 3 === 0 ? "bg-navy-900 text-white" : "border border-line bg-white text-navy-900 shadow-soft"}`}
              >
                <div className="flex items-center justify-between">
                  <I className={`size-7 ${i % 3 === 0 ? "text-accent-400" : "text-accent-600"}`} />
                  <span className={`text-xs font-semibold uppercase tracking-[0.16em] ${i % 3 === 0 ? "text-white/50" : "text-muted"}`}>
                    {step}
                  </span>
                </div>
                <h3 className="font-display mt-5 text-lg font-bold">{title}</h3>
                <p className={`mt-1.5 text-sm leading-relaxed ${i % 3 === 0 ? "text-white/65" : "text-muted"}`}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-surface py-20 sm:py-28">
        <div className="container-x">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Как это работает"
              title="Шесть этапов до передачи ключей"
              description="Мы берём на себя поиск, проверку, торг и оформление. Вы участвуете только в выборе."
            />
            <ButtonLink href="/kak-eto-rabotaet" variant="ghost" className="shrink-0 border border-line bg-white">
              Подробнее
              <Icon.ArrowRight className="size-4" />
            </ButtonLink>
          </div>

          <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.title} className="relative rounded-3xl border border-line bg-white p-7 shadow-soft">
                <div className="flex items-center justify-between">
                  <span className="font-display text-4xl font-extrabold text-navy-900/10">{String(i + 1).padStart(2, "0")}</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-xs font-semibold text-navy-900">
                    <Icon.Clock className="size-3.5" />
                    {s.duration}
                  </span>
                </div>
                <h3 className="font-display mt-3 text-xl font-bold text-navy-900">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{s.short}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* TRUST */}
      <section className="relative overflow-hidden bg-navy-900 py-20 text-white sm:py-28">
        <div className="grid-bg absolute inset-0 opacity-60" aria-hidden />
        <div className="container-x relative">
          <SectionHeading
            eyebrow="Гарантии"
            title="Покупка нового автомобиля — под полным контролем"
            tone="dark"
          />
          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {trust.map(({ icon: I, title, text }) => (
              <div key={title} className="flex gap-5 rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-accent-500 text-navy-900">
                  <I className="size-6" />
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold">{title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-white/65">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 sm:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <SectionHeading
              eyebrow="FAQ"
              title="Частые вопросы"
              description="Не нашли ответ — напишите, ответим лично."
            />
            {siteConfig.features.faq && (
              <ButtonLink href="/faq" variant="secondary" className="mt-8">
                Все вопросы
                <Icon.ArrowRight className="size-4" />
              </ButtonLink>
            )}
          </div>
          <Faq items={faq.slice(0, 6)} />
        </div>
      </section>

      <CtaSection />
    </>
  );
}
