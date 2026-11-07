import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getCars } from "@/lib/cars-store";
import { PageHero } from "@/components/PageHero";
import { CarCard } from "@/components/CarCard";
import { CtaSection } from "@/components/CtaSection";

export const metadata: Metadata = buildMetadata({
  title: "Новые автомобили в Кыргызстане: модели и цены в Бишкеке",
  description:
    "Новые Mercedes-Benz, BMW, Porsche, Land Rover и Audi в наличии в Кыргызстане — ориентировочные цены в Бишкеке, двигатели и комплектации. Подбор и проверка перед покупкой.",
  path: "/avtomobili",
  keywords: ["новый Mercedes Бишкек цена", "новый BMW Бишкек", "Porsche Бишкек", "новые авто в наличии Кыргызстан"],
});

// Каталог меняется из админки (revalidatePath("/avtomobili")),
// этот интервал — страховка на случай изменений в хранилище напрямую.
export const revalidate = 3600;

export default async function CarsPage() {
  const cars = await getCars();
  const brands = Array.from(new Set(cars.map((c) => c.brand)));
  return (
    <>
      <PageHero
        eyebrow="Каталог"
        title="Новые автомобили, которые подбирают чаще всего"
        description="Подбираем любую модель и конфигурацию, которая продаётся в Кыргызстане. Ниже — частые запросы с ориентировочными ценами на новые автомобили в Бишкеке."
        crumbs={[{ name: "Автомобили", path: "/avtomobili" }]}
      >
        <div className="mt-10 flex flex-wrap gap-2">
          {brands.map((b) => (
            <a
              key={b}
              href={`#${b.toLowerCase().replace(/\s+/g, "-")}`}
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold transition hover:bg-white/10"
            >
              {b}
            </a>
          ))}
        </div>
      </PageHero>

      {brands.map((brand) => (
        <section key={brand} id={brand.toLowerCase().replace(/\s+/g, "-")} className="py-16 first-of-type:pt-20 sm:py-20">
          <div className="container-x">
            <h2 className="font-display text-3xl font-bold tracking-tight text-navy-900">Новые {brand}</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {cars
                .filter((c) => c.brand === brand)
                .map((c) => (
                  <CarCard key={c.slug} car={c} />
                ))}
            </div>
          </div>
        </section>
      ))}

      <CtaSection
        title="Нужна другая модель?"
        description="Подберём любой новый автомобиль, который продаётся в Кыргызстане — от Toyota и Lexus до китайских марок, Bentley и Rolls-Royce."
      />
    </>
  );
}
