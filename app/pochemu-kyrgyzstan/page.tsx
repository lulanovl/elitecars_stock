import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { PageHero } from "@/components/PageHero";
import { CtaSection } from "@/components/CtaSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icons";

export const metadata: Metadata = buildMetadata({
  title: "Почему новый автомобиль выгодно искать в Кыргызстане",
  description:
    "Новые автомобили в Кыргызстане продают и официальные дилеры, и импортёры: шире выбор, есть конкуренция по цене, машину можно осмотреть до покупки. Разбираем преимущества и как купить авто для Казахстана и России.",
  path: "/pochemu-kyrgyzstan",
  keywords: [
    "новые авто Кыргызстан",
    "купить новый автомобиль в Бишкеке",
    "авто из Кыргызстана в Казахстан",
    "авто из Кыргызстана в Россию",
  ],
});

const reasons = [
  {
    icon: Icon.Globe,
    title: "Дилеры и импортёры",
    text: "Помимо официальных дилеров, новые автомобили продают импортёры. Это шире выбор моделей, комплектаций и цветов.",
  },
  {
    icon: Icon.Wallet,
    title: "Конкуренция по цене",
    text: "Одинаковые автомобили есть у нескольких продавцов — цены можно сравнить, а о скидке и бонусах договориться.",
  },
  {
    icon: Icon.Clock,
    title: "Автомобили в наличии",
    text: "Машина уже в стране — не нужно ждать доставку месяцами и рисковать повреждениями в пути.",
  },
  {
    icon: Icon.Eye,
    title: "Осмотр до покупки",
    text: "Вы или наш специалист видите автомобиль вживую: состояние кузова, комплектацию, документы.",
  },
  {
    icon: Icon.Shield,
    title: "Страна ЕАЭС",
    text: "Кыргызстан входит в ЕАЭС вместе с Казахстаном, Россией, Беларусью и Арменией. Автомобиль можно перевезти и зарегистрировать в другой стране союза.",
  },
  {
    icon: Icon.Handshake,
    title: "Русскоязычная среда",
    text: "Русский — официальный язык Кыргызстана. Договоры, переговоры и документы — без переводчиков.",
  },
];

const comparison: [string, string, string][] = [
  ["Срок", "От 7 до 10 дней до ключей", "От одного до нескольких месяцев"],
  ["Осмотр", "Вживую до оплаты", "По фото и видео продавца"],
  ["Риски в пути", "Нет — машина уже на месте", "Повреждения и задержки при перевозке"],
  ["Цена", "Известна и фиксируется при покупке", "Зависит от курса и логистики"],
  ["Предоплата", "Оплата после проверки автомобиля", "Обычно до отправки"],
];

export default function WhyKyrgyzstanPage() {
  return (
    <>
      <PageHero
        eyebrow="Почему Кыргызстан"
        title="Почему новый автомобиль выгодно искать в Кыргызстане"
        description="Большой выбор, конкуренция продавцов и машины в наличии. Рассказываем, как этим воспользоваться и не переплатить."
        crumbs={[{ name: "Почему в Кыргызстане", path: "/pochemu-kyrgyzstan" }]}
      />

      <section className="py-20 sm:py-24">
        <div className="container-x">
          <SectionHeading eyebrow="Шесть причин" title="Рынок, на котором есть из чего выбрать" />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {reasons.map(({ icon: I, title, text }) => (
              <div key={title} className="rounded-3xl border border-line bg-white p-7 shadow-soft">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-navy-900 text-accent-400">
                  <I className="size-6" />
                </span>
                <h3 className="font-display mt-5 text-lg font-bold text-navy-900">{title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-20 sm:py-24">
        <div className="container-x">
          <SectionHeading
            eyebrow="Для клиентов из ЕАЭС"
            title="Живёте в Казахстане или России?"
            description="Подберём автомобиль в Кыргызстане и доставим его к вам. Три вещи, которые мы делаем в каждой такой сделке."
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {[
              {
                n: "01",
                t: "Расчёт платежей заранее",
                d: "Правила регистрации и обязательные платежи в каждой стране свои — например, утилизационный сбор в России. Считаем их до покупки.",
              },
              {
                n: "02",
                t: "Правильные документы",
                d: "Проверяем, что комплект документов от продавца подходит для постановки на учёт в вашей стране.",
              },
              {
                n: "03",
                t: "Доставка до двери",
                d: "Закрытый автовоз до вашего города или передача в Бишкеке — на ваш выбор.",
              },
            ].map((x) => (
              <div key={x.n} className="rounded-3xl bg-navy-900 p-7 text-white">
                <span className="font-display text-3xl font-extrabold text-accent-400">{x.n}</span>
                <h3 className="font-display mt-4 text-lg font-bold">{x.t}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-white/65">{x.d}</p>
              </div>
            ))}
          </div>
          {siteConfig.features.blog && (
            <p className="mt-8 text-sm text-muted">
              Подробнее —{" "}
              <Link
                href="/blog/novyj-avtomobil-iz-kyrgyzstana-v-eaes"
                className="font-semibold text-navy-900 underline decoration-accent-500 decoration-2 underline-offset-4"
              >
                в статье о покупке для стран ЕАЭС
              </Link>
              .
            </p>
          )}
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="container-x">
          <SectionHeading
            eyebrow="Сравнение"
            title="Автомобиль в наличии или заказ из-за рубежа?"
            description="Оба варианта рабочие. Автомобиль в наличии даёт скорость и предсказуемость."
          />
          {/* Mobile: stacked cards */}
          <div className="mt-12 space-y-4 md:hidden">
            {comparison.map(([c, a, b]) => (
              <div key={c} className="rounded-3xl border border-line bg-white p-5 shadow-soft">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{c}</p>
                <p className="mt-3 flex items-start gap-2 text-[15px] font-semibold text-navy-900">
                  <Icon.Check className="mt-1 size-4 shrink-0 text-emerald-600" />
                  {a}
                </p>
                <p className="mt-2 pl-6 text-[15px] text-muted">{b}</p>
              </div>
            ))}
          </div>

          {/* Desktop: table */}
          <div className="mt-12 hidden overflow-x-auto rounded-3xl border border-line shadow-soft md:block">
            <table className="w-full min-w-[640px] text-left text-[15px]">
              <thead className="bg-navy-900 text-white">
                <tr>
                  <th className="px-6 py-4 font-semibold">Критерий</th>
                  <th className="px-6 py-4 font-semibold">В наличии в Кыргызстане</th>
                  <th className="px-6 py-4 font-semibold">Заказ из-за рубежа</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line bg-white">
                {comparison.map(([c, a, b]) => (
                  <tr key={c}>
                    <td className="px-6 py-4 font-semibold text-navy-900">{c}</td>
                    <td className="px-6 py-4 text-navy-900">
                      <span className="flex items-start gap-2">
                        <Icon.Check className="mt-1 size-4 shrink-0 text-emerald-600" />
                        {a}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <CtaSection
        title="Остались вопросы?"
        description="Расскажем, какие автомобили сейчас есть в наличии, и посчитаем стоимость для вашей страны."
      />
    </>
  );
}
