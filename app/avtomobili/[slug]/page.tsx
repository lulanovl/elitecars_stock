import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { formatRange, formatUsd } from "@/lib/content/cars";
import { getCar, getCars } from "@/lib/cars-store";
import { buildMetadata, productJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { CarCard, CarSilhouette } from "@/components/CarCard";
import { CtaSection } from "@/components/CtaSection";
import { Icon } from "@/components/ui/Icons";
import { ButtonLink } from "@/components/ui/Button";

// Страницы меняются из админки (revalidatePath на конкретный slug),
// этот интервал — страховка на случай изменений в хранилище напрямую.
export const revalidate = 3600;

export async function generateStaticParams() {
  const cars = await getCars();
  return cars.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/avtomobili/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const car = await getCar(slug);
  if (!car) return {};
  return buildMetadata({
    title: `Новый ${car.brand} ${car.model} в Бишкеке: цена и подбор`,
    description: `Новый ${car.brand} ${car.model} в наличии в Кыргызстане — от ${formatUsd(
      car.price[0],
    )}. Подбор у дилеров и импортёров, проверка перед покупкой, торг и оформление.`,
    path: `/avtomobili/${car.slug}`,
    keywords: [
      `новый ${car.brand} ${car.model} Бишкек`,
      `${car.brand} ${car.model} цена Кыргызстан`,
      `купить ${car.brand} ${car.model} в Бишкеке`,
      `${car.model} в наличии Бишкек`,
    ],
  });
}

export default async function CarPage({ params }: PageProps<"/avtomobili/[slug]">) {
  const { slug } = await params;
  const [car, cars] = await Promise.all([getCar(slug), getCars()]);
  if (!car) notFound();

  const related = cars.filter((c) => c.slug !== car.slug && c.segment === car.segment).slice(0, 3);
  const fallback = cars.filter((c) => c.slug !== car.slug && !related.includes(c)).slice(0, 3 - related.length);
  const others = [...related, ...fallback];

  const [mainImage, ...galleryImages] = car.images;

  return (
    <>
      <JsonLd
        data={productJsonLd({
          brand: car.brand,
          model: car.model,
          description: car.description,
          path: `/avtomobili/${car.slug}`,
          low: car.price[0],
          high: car.price[1],
          image: mainImage?.url,
        })}
      />
      <PageHero
        eyebrow={car.segment}
        title={`Новый ${car.brand} ${car.model} в Кыргызстане`}
        description={car.description}
        crumbs={[
          { name: "Автомобили", path: "/avtomobili" },
          { name: `${car.brand} ${car.model}`, path: `/avtomobili/${car.slug}` },
        ]}
      >
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <Stat label="Пробег" value="0 км · новый автомобиль" />
          <Stat label="Цена в Бишкеке" value={formatRange(car.price)} highlight />
        </div>
      </PageHero>

      <section className="py-20 sm:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-[1.3fr_1fr]">
          <div>
            {car.whyPopular.length > 0 && (
              <>
                <h2 className="font-display text-3xl font-bold tracking-tight text-navy-900">
                  Почему {car.model} выбирают через нас
                </h2>
                <ul className="mt-6 space-y-4">
                  {car.whyPopular.map((w) => (
                    <li key={w} className="flex gap-4 rounded-2xl border border-line bg-white p-5 shadow-soft">
                      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-accent-500 text-navy-900">
                        <Icon.Check className="size-4" />
                      </span>
                      <p className="text-[15.5px] leading-relaxed text-navy-900">{w}</p>
                    </li>
                  ))}
                </ul>
              </>
            )}

            <h2 className="font-display mt-14 text-3xl font-bold tracking-tight text-navy-900">Версии и комплектации</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl border border-line bg-white p-6 shadow-soft">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Двигатели</p>
                <ul className="mt-3 space-y-1.5 text-[15px] text-navy-900">
                  {car.engines.map((e) => (
                    <li key={e}>• {e}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-line bg-white p-6 shadow-soft">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Привод</p>
                <p className="mt-3 text-[15px] text-navy-900">{car.drive}</p>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-muted">Особенности комплектаций</p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {car.highlights.map((h) => (
                    <li key={h} className="rounded-full bg-surface px-2.5 py-1 text-xs text-navy-900/80">
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-10 rounded-2xl bg-surface p-6 text-sm leading-relaxed text-muted">
              Цены ориентировочные и зависят от комплектации, года выпуска, продавца и курса валют на момент покупки.
              Точную стоимость по конкретным автомобилям в наличии мы присылаем вместе с подборкой.
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            {mainImage ? (
              <figure>
                <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-line bg-surface shadow-soft">
                  <Image
                    src={mainImage.url}
                    alt={`${car.brand} ${car.model}`}
                    fill
                    priority
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover"
                  />
                </div>
                {mainImage.credit && (
                  <figcaption className="mt-2 text-right text-[11px] text-muted/70">
                    Фото:{" "}
                    <a href={mainImage.credit.source} target="_blank" rel="noopener noreferrer nofollow" className="hover:underline">
                      {mainImage.credit.author}
                    </a>
                    {mainImage.credit.license && ` · ${mainImage.credit.license}`}
                  </figcaption>
                )}
              </figure>
            ) : (
              <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${car.accent} p-6 text-white`}>
                <div className="grid-bg absolute inset-0 opacity-40" aria-hidden />
                <div className="relative">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/80">{car.brand}</p>
                  <p className="font-display text-3xl font-extrabold">{car.model}</p>
                  <CarSilhouette className="mt-6 h-24 w-auto text-white/90" />
                </div>
              </div>
            )}

            {galleryImages.length > 0 && (
              <div className="scrollbar-none mt-2 flex snap-x snap-mandatory gap-2 overflow-x-auto sm:grid sm:grid-cols-3 sm:overflow-visible">
                {galleryImages.map((img) => (
                  <a
                    key={img.url}
                    href={img.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative aspect-[16/10] w-[78%] shrink-0 snap-start overflow-hidden rounded-xl border border-line bg-surface sm:w-auto"
                  >
                    <Image
                      src={img.url}
                      alt={`${car.brand} ${car.model}`}
                      fill
                      sizes="(min-width: 640px) 150px, 78vw"
                      className="object-cover"
                    />
                  </a>
                ))}
              </div>
            )}

            <div className="mt-4 rounded-3xl border border-line bg-white p-6 shadow-soft">
              <p className="text-sm text-muted">Новый в Бишкеке</p>
              <p className="font-display mt-1 text-2xl font-extrabold text-navy-900">{formatRange(car.price)}</p>
              <p className="mt-1 text-xs text-muted">ориентировочно, зависит от комплектации и продавца</p>
              <ButtonLink href="#zayavka" size="lg" className="mt-6 w-full">
                Подобрать {car.model}
                <Icon.ArrowRight className="size-5" />
              </ButtonLink>
              <ul className="mt-5 space-y-2 text-sm text-navy-900/80">
                {["Сравнение цен по всему рынку", "Живой осмотр и видеоотчёт", "Фиксированная комиссия"].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <Icon.Check className="size-4 text-accent-600" /> {t}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {others.length > 0 && (
        <section className="bg-surface py-20 sm:py-24">
          <div className="container-x">
            <h2 className="font-display text-3xl font-bold tracking-tight text-navy-900">Похожие модели</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((c) => (
                <CarCard key={c.slug} car={c} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaSection
        title={`Подобрать новый ${car.brand} ${car.model}`}
        description="Комплектация, цвет, бюджет — пришлём варианты в наличии с ценами и фото."
        defaultCar={`${car.brand} ${car.model}`}
      />
    </>
  );
}

function Stat({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl p-5 ${highlight ? "bg-accent-500 text-navy-900" : "border border-white/15 bg-white/5"}`}>
      <p className={`text-xs font-semibold uppercase tracking-[0.14em] ${highlight ? "text-navy-900/70" : "text-white/55"}`}>
        {label}
      </p>
      <p className="font-display mt-1.5 text-xl font-extrabold">{value}</p>
    </div>
  );
}
