import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteConfig } from "@/lib/site";
import { buildMetadata, faqJsonLd } from "@/lib/seo";
import { faq } from "@/lib/content/faq";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { Faq } from "@/components/Faq";
import { CtaSection } from "@/components/CtaSection";

export const metadata: Metadata = buildMetadata({
  title: "Вопросы и ответы о подборе нового автомобиля в Кыргызстане",
  description:
    "Ответы на частые вопросы: зачем нужен подбор нового автомобиля, что мы проверяем, сроки, стоимость услуг, покупка для Казахстана и России, гарантия и контроль сделки.",
  path: "/faq",
  keywords: ["автоподбор Бишкек вопросы", "новый автомобиль Кыргызстан", "проверка нового автомобиля"],
});

export default function FaqPage() {
  if (!siteConfig.features.faq) notFound();
  return (
    <>
      <JsonLd data={faqJsonLd(faq)} />
      <PageHero
        eyebrow="FAQ"
        title="Вопросы и ответы"
        description="Что спрашивают перед первым заказом. Не нашли ответ — напишите, ответим лично."
        crumbs={[{ name: "FAQ", path: "/faq" }]}
      />
      <section className="py-20 sm:py-24">
        <div className="container-x max-w-4xl">
          <Faq items={faq} />
        </div>
      </section>
      <CtaSection title="Не нашли ответ?" description="Задайте вопрос менеджеру — ответим в рабочее время." />
    </>
  );
}
