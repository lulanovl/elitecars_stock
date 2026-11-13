import type { Metadata } from "next";
import { buildMetadata, howToJsonLd } from "@/lib/seo";
import { steps } from "@/lib/content/steps";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { StepsTimeline } from "@/components/StepsTimeline";
import { CtaSection } from "@/components/CtaSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icons";

export const metadata: Metadata = buildMetadata({
  title: "Как мы подбираем новый автомобиль в Кыргызстане: 6 этапов",
  description:
    "Как проходит подбор нового автомобиля в Кыргызстане: поиск по дилерам и импортёрам, договор, проверка автомобиля, торг и покупка, оформление и передача ключей.",
  path: "/kak-eto-rabotaet",
  keywords: ["как купить новый автомобиль в Бишкеке", "автоподбор Бишкек", "подбор нового автомобиля Кыргызстан"],
});

const payments = [
  { title: "Аванс за подбор", pct: "Договор", text: "Часть фиксированной комиссии — при подписании договора на подбор." },
  { title: "Оплата автомобиля", pct: "Продавцу", text: "Стоимость автомобиля — напрямую дилеру или импортёру по договору купли-продажи, после проверки и вашего решения." },
  { title: "Остаток комиссии", pct: "Передача", text: "Оставшаяся часть комиссии — при передаче автомобиля и документов." },
];

export default function HowItWorksPage() {
  return (
    <>
      <JsonLd data={howToJsonLd(steps)} />
      <PageHero
        eyebrow="Процесс"
        title="От запроса до ключей — от 7 до 10 дней"
        description="Одна проверенная схема для каждого автомобиля. Вы видите каждый шаг и принимаете решение только после проверки."
        crumbs={[{ name: "Как это работает", path: "/kak-eto-rabotaet" }]}
      >
        <div className="mt-10 flex flex-wrap gap-3 text-sm">
          {["Подбор", "Договор", "Проверка", "Покупка", "Оформление", "Передача"].map((t, i) => (
            <span key={t} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5">
              <span className="font-display text-accent-400">{i + 1}</span> {t}
            </span>
          ))}
        </div>
      </PageHero>

      <section className="py-20 sm:py-24">
        <div className="container-x">
          <StepsTimeline steps={steps} detailed />
        </div>
      </section>

      <section className="bg-surface py-20 sm:py-24">
        <div className="container-x">
          <SectionHeading
            eyebrow="Оплата"
            title="Прозрачная оплата"
            description="Деньги за автомобиль идут напрямую продавцу. Наша комиссия фиксирована и прописана в договоре."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {payments.map((p, i) => (
              <div key={p.title} className="rounded-3xl border border-line bg-white p-7 shadow-soft">
                <div className="flex items-center justify-between">
                  <span className="font-display text-4xl font-extrabold text-navy-900/10">{i + 1}</span>
                  <span className="rounded-full bg-navy-900 px-3 py-1 text-xs font-semibold text-accent-400">{p.pct}</span>
                </div>
                <h3 className="font-display mt-3 text-xl font-bold text-navy-900">{p.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{p.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-start gap-4 rounded-3xl border border-accent-500/30 bg-amber-50 p-6">
            <Icon.Shield className="size-7 shrink-0 text-accent-600" />
            <p className="text-[15px] leading-relaxed text-navy-900">
              <span className="font-semibold">Документы при передаче:</span> договор купли-продажи, счёт и документы
              на автомобиль от продавца, гарантийная и сервисная книжка (если предусмотрены), акт приёма-передачи. Для
              регистрации в Казахстане или России заранее проверяем, что комплект документов подходит.
            </p>
          </div>
        </div>
      </section>

      <CtaSection
        title="Начнём с подбора"
        description="Модель, комплектация, бюджет — пришлём варианты в наличии с ценами в течение суток."
      />
    </>
  );
}
