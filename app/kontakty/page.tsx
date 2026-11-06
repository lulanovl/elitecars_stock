import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { links, siteConfig, WA_DEFAULT } from "@/lib/site";
import { PageHero } from "@/components/PageHero";
import { LeadForm } from "@/components/LeadForm";
import { Icon } from "@/components/ui/Icons";

export const metadata: Metadata = buildMetadata({
  title: "Контакты: подбор нового автомобиля в Бишкеке",
  description: `${siteConfig.name}: телефон, WhatsApp, Telegram, email. Подбор нового автомобиля в Кыргызстане — подборка вариантов в наличии в течение суток.`,
  path: "/kontakty",
});

const channels = [
  {
    icon: Icon.WhatsApp,
    title: "WhatsApp",
    value: siteConfig.contacts.phoneDisplay,
    href: links.whatsapp(WA_DEFAULT),
    color: "bg-emerald-500",
    hint: "Самый быстрый способ",
  },
  {
    icon: Icon.Telegram,
    title: "Telegram",
    value: `@${siteConfig.contacts.telegram}`,
    href: links.telegram(),
    color: "bg-sky-500",
    hint: "Отчёты и фото удобно смотреть здесь",
  },
  {
    icon: Icon.Phone,
    title: "Телефон",
    value: siteConfig.contacts.phoneDisplay,
    href: links.phone(),
    color: "bg-accent-500",
    hint: `Кыргызстан · ${siteConfig.contacts.workingHours}`,
  },
  {
    icon: Icon.Mail,
    title: "Email",
    value: siteConfig.contacts.email,
    href: links.email(),
    color: "bg-navy-700",
    hint: "Для договоров и документов",
  },
  {
    icon: Icon.Telegram,
    title: "Telegram-канал",
    value: "Наш канал",
    href: siteConfig.social.telegramChannel,
    color: "bg-sky-500",
    hint: "Автомобили в наличии",
  },
  {
    icon: Icon.Instagram,
    title: "Instagram",
    value: "Наш Instagram",
    href: siteConfig.social.instagram,
    color: "bg-pink-500",
    hint: "Фото и видео автомобилей",
  },
  {
    icon: Icon.YouTube,
    title: "YouTube",
    value: "Наш канал",
    href: siteConfig.social.youtube,
    color: "bg-red-600",
    hint: "Обзоры и проверки автомобилей",
  },
].filter((c) => c.href);

export default function ContactsPage() {
  return (
    <>
      <PageHero
        eyebrow="Контакты"
        title="Свяжитесь с нами"
        description="Ответим на вопросы, подберём варианты в наличии и назовём итоговую стоимость."
        crumbs={[{ name: "Контакты", path: "/kontakty" }]}
      />

      <section className="py-20 sm:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <div className="grid gap-4 sm:grid-cols-2">
              {channels.map(({ icon: I, title, value, href, color, hint }) => (
                <a
                  key={title}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group rounded-3xl border border-line bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"
                >
                  <span className={`flex size-11 items-center justify-center rounded-2xl text-white ${color}`}>
                    <I className="size-5" />
                  </span>
                  <p className="mt-4 text-sm text-muted">{title}</p>
                  <p className="font-display text-lg font-bold text-navy-900 break-all group-hover:text-accent-600">{value}</p>
                  <p className="mt-1 text-xs text-muted">{hint}</p>
                </a>
              ))}
            </div>

            <div className="mt-6 rounded-3xl bg-navy-900 p-7 text-white">
              <div className="flex items-start gap-4">
                <Icon.Pin className="mt-0.5 size-6 shrink-0 text-accent-400" />
                <div>
                  <p className="font-display text-lg font-bold">Офис</p>
                  <p className="mt-1 text-white/70">{siteConfig.contacts.address}</p>
                  <p className="mt-3 text-sm text-white/55">
                    Работаем в Бишкеке. Передача автомобилей — в Бишкеке или с доставкой в ваш город
                    в Кыргызстане, Казахстане и России.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex items-start gap-4">
                <Icon.Clock className="mt-0.5 size-6 shrink-0 text-accent-400" />
                <div>
                  <p className="font-display text-lg font-bold">Время работы</p>
                  <p className="mt-1 text-white/70">{siteConfig.contacts.workingHours}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-line bg-white p-6 shadow-lift sm:p-8">
            <h2 className="font-display text-2xl font-bold text-navy-900">Оставьте заявку</h2>
            <p className="mt-1 text-[15px] text-muted">
              Опишите желаемый автомобиль — пришлём подборку вариантов в наличии с ценами в течение суток.
            </p>
            <div className="mt-6">
              <LeadForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
