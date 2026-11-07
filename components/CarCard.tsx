import Image from "next/image";
import Link from "next/link";
import { formatUsd } from "@/lib/content/cars";
import type { StoredCar } from "@/lib/cars-store";
import { Icon } from "@/components/ui/Icons";

type CardData = {
  href: string;
  brand: string;
  model: string;
  segment: string;
  highlights: string[];
  priceFrom: number;
  image?: string;
  accent?: string;
};

/** Карточка автомобиля из каталога (редактируется в /admin, lib/cars-store.ts). */
export function CarCard({ car }: { car: StoredCar }) {
  return (
    <CarCardView
      href={`/avtomobili/${car.slug}`}
      brand={car.brand}
      model={car.model}
      segment={car.segment}
      highlights={car.highlights}
      priceFrom={car.price[0]}
      image={car.images[0]?.url}
      accent={car.accent}
    />
  );
}

function CarCardView({ href, brand, model, segment, highlights, priceFrom, image, accent }: CardData) {
  const external = /^https?:\/\//.test(href);
  const content = (
    <>
      <div className={`relative aspect-[16/10] overflow-hidden bg-gradient-to-br ${accent ?? "from-neutral-700/80 to-black/80"} p-5`}>
        {image ? (
          <Image
            src={image}
            alt={`${brand} ${model}`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="grid-bg absolute inset-0 opacity-40" aria-hidden />
        )}
        <div className="relative flex h-full flex-col justify-between">
          {segment ? (
            <span className="inline-flex w-fit rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-navy-900">
              {segment}
            </span>
          ) : (
            <span />
          )}
          {!image && <CarSilhouette className="ml-auto h-16 w-auto text-white/90 transition group-hover:translate-x-1" />}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{brand}</p>
        <h3 className="font-display mt-1 text-xl font-bold text-navy-900">{model}</h3>
        {highlights.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {highlights.slice(0, 3).map((h) => (
              <li key={h} className="rounded-full bg-surface px-2.5 py-1 text-xs text-navy-900/80">
                {h}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto flex items-end justify-between pt-5">
          <div>
            {priceFrom > 0 ? (
              <>
                <p className="text-xs text-muted">Новый в Бишкеке от</p>
                <p className="font-display text-lg font-bold text-navy-900">{formatUsd(priceFrom)}</p>
              </>
            ) : (
              <>
                <p className="text-xs text-muted">Стоимость</p>
                <p className="font-display text-lg font-bold text-navy-900">по запросу</p>
              </>
            )}
          </div>
          <span className="flex size-9 items-center justify-center rounded-full bg-navy-900 text-white transition group-hover:bg-accent-500 group-hover:text-navy-900">
            <Icon.ArrowRight className="size-4" />
          </span>
        </div>
      </div>
    </>
  );

  const className =
    "group flex flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift";

  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {content}
    </a>
  ) : (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}

export function CarSilhouette({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 64" className={className} fill="currentColor" aria-hidden>
      <path d="M14 46c-4 0-7-3-7-7v-5c0-3 2-6 5-7l14-4 16-14c2-2 5-3 8-3h36c4 0 8 2 11 5l12 13 26 5c4 1 7 4 7 8v8c0 3-3 6-7 6h-6a13 13 0 0 1-26 0H52a13 13 0 0 1-26 0H14Zm25 0a7 7 0 1 0 0 0Zm82 0a7 7 0 1 0 0 0ZM52 14 40 25h27V14H52Zm22 0v11h30L94 16c-1-1-3-2-5-2H74Z" />
    </svg>
  );
}
