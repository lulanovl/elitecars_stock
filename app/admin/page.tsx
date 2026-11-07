import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { blobConfigured, getCars, MAX_CARS, MAX_HOME_CARS, storageReady } from "@/lib/cars-store";
import { formatRange } from "@/lib/content/cars";
import { Icon } from "@/components/ui/Icons";
import { ButtonLink } from "@/components/ui/Button";
import { deleteCar, logout, moveCar, seedCarsFromCatalog } from "./actions";
import { AdminHeader } from "./AdminHeader";
import { ConfirmButton } from "./ConfirmButton";

export const metadata: Metadata = { title: "Автомобили" };

export default async function AdminPage({ searchParams }: PageProps<"/admin">) {
  await requireAdmin();
  const { saved } = await searchParams;
  const cars = await getCars();
  const featuredCount = cars.filter((c) => c.featured).length;

  return (
    <>
      <AdminHeader logoutAction={logout} />

      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-600">Каталог</p>
            <h1 className="font-display mt-1 text-3xl font-bold tracking-tight">Автомобили</h1>
            <p className="mt-2 max-w-xl text-[15px] text-muted">
              Каждый автомобиль — это карточка в каталоге, страница с описанием и, по желанию, место в блоке «Что мы
              привозим чаще всего» на главной. На главной сейчас: {featuredCount} из {MAX_HOME_CARS}. Изменения
              появляются на сайте сразу после сохранения.
            </p>
          </div>
          {cars.length < MAX_CARS && (
            <ButtonLink href="/admin/cars/new" className="shrink-0">
              <span className="text-lg leading-none">+</span> Добавить автомобиль
            </ButtonLink>
          )}
        </div>

        {!storageReady() && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm leading-relaxed text-red-900">
            <p className="font-semibold">Хранилище не подключено — сохранить изменения не получится.</p>
            <p className="mt-1">
              В проекте на Vercel откройте вкладку <b>Storage</b> → <b>Create</b> → <b>Blob</b>, подключите хранилище к
              этому проекту и сделайте Redeploy. Переменная <code>BLOB_READ_WRITE_TOKEN</code> добавится автоматически.
            </p>
          </div>
        )}
        {storageReady() && !blobConfigured() && (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-navy-900">
            Локальный режим: данные сохраняются в папку <code>.data/</code>, фото — в <code>.data/uploads/</code>.
          </div>
        )}
        {saved && (
          <div className="mt-6 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-900">
            <Icon.Check className="size-4" /> Сохранено. Сайт обновлён.
          </div>
        )}

        {cars.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-line bg-white p-12 text-center text-muted">
            В каталоге нет автомобилей — добавьте первый.
          </div>
        ) : (
          <ol className="mt-8 space-y-3">
            {cars.map((c, i) => (
              <li
                key={c.slug}
                className="flex flex-col gap-4 rounded-3xl border border-line bg-white p-4 shadow-soft sm:flex-row sm:items-center"
              >
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <span className="font-display w-6 shrink-0 text-center text-lg font-extrabold text-navy-900/25">
                    {i + 1}
                  </span>
                  <div className="relative aspect-[16/10] w-28 shrink-0 overflow-hidden rounded-xl bg-navy-800">
                    {c.images[0] ? (
                      <Image src={c.images[0].url} alt="" fill sizes="112px" className="object-cover" />
                    ) : (
                      <span className="absolute inset-0 flex items-center justify-center text-[11px] text-white/50">
                        без фото
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{c.brand}</p>
                      {c.featured && (
                        <span className="rounded-full bg-accent-500/15 px-2 py-0.5 text-[11px] font-semibold text-accent-700">
                          На главной
                        </span>
                      )}
                    </div>
                    <p className="font-display truncate text-lg font-bold">{c.model}</p>
                    <p className="truncate text-sm text-muted">
                      {c.price[0] > 0 ? formatRange(c.price) : "цена по запросу"}
                      {c.segment && ` · ${c.segment}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <form action={moveCar}>
                    <input type="hidden" name="slug" value={c.slug} />
                    <input type="hidden" name="dir" value="up" />
                    <button
                      type="submit"
                      disabled={i === 0}
                      aria-label="Выше"
                      className="flex size-10 items-center justify-center rounded-full border border-line text-navy-900 transition hover:bg-surface disabled:opacity-30"
                    >
                      <Icon.ChevronDown className="size-4 rotate-180" />
                    </button>
                  </form>
                  <form action={moveCar}>
                    <input type="hidden" name="slug" value={c.slug} />
                    <input type="hidden" name="dir" value="down" />
                    <button
                      type="submit"
                      disabled={i === cars.length - 1}
                      aria-label="Ниже"
                      className="flex size-10 items-center justify-center rounded-full border border-line text-navy-900 transition hover:bg-surface disabled:opacity-30"
                    >
                      <Icon.ChevronDown className="size-4" />
                    </button>
                  </form>
                  <Link
                    href={`/admin/cars/${encodeURIComponent(c.slug)}`}
                    className="inline-flex h-10 items-center rounded-full bg-navy-900 px-4 text-sm font-semibold text-white transition hover:bg-navy-700"
                  >
                    Изменить
                  </Link>
                  <form action={deleteCar}>
                    <input type="hidden" name="slug" value={c.slug} />
                    <ConfirmButton
                      message={`Удалить ${c.brand} ${c.model}? Страница и карточка исчезнут с сайта сразу.`}
                      className="inline-flex h-10 items-center rounded-full border border-red-200 px-4 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      Удалить
                    </ConfirmButton>
                  </form>
                </div>
              </li>
            ))}
          </ol>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6 text-sm text-muted">
          <p>
            Максимум {MAX_CARS} автомобилей в каталоге, {MAX_HOME_CARS} — на главной.
          </p>
          <form action={seedCarsFromCatalog}>
            <ConfirmButton
              message="Загрузить каталог из кода? Все текущие автомобили и загруженные фото будут заменены стандартными 11 машинами."
              className="font-semibold text-muted underline-offset-4 transition hover:text-red-600 hover:underline"
            >
              Загрузить каталог из кода
            </ConfirmButton>
          </form>
        </div>
      </main>
    </>
  );
}
