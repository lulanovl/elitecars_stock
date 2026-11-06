import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { blobConfigured, getFeaturedCars, MAX_FEATURED, storageReady } from "@/lib/featured";
import { formatUsd } from "@/lib/content/cars";
import { Icon } from "@/components/ui/Icons";
import { ButtonLink } from "@/components/ui/Button";
import { deleteFeatured, logout, moveFeatured, resetFeatured } from "./actions";
import { AdminHeader } from "./AdminHeader";
import { ConfirmButton } from "./ConfirmButton";

export const metadata: Metadata = { title: "Что мы привозим чаще всего" };

export default async function AdminPage({ searchParams }: PageProps<"/admin">) {
  await requireAdmin();
  const { saved } = await searchParams;
  const cars = await getFeaturedCars();

  return (
    <>
      <AdminHeader logoutAction={logout} />

      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-600">Главная страница</p>
            <h1 className="font-display mt-1 text-3xl font-bold tracking-tight">«Что мы привозим чаще всего»</h1>
            <p className="mt-2 max-w-xl text-[15px] text-muted">
              Карточки показываются на главной в этом порядке. Изменения появляются на сайте сразу после сохранения.
            </p>
          </div>
          {cars.length < MAX_FEATURED && (
            <ButtonLink href="/admin/featured/new" className="shrink-0">
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
            <Icon.Check className="size-4" /> Сохранено. Главная страница обновлена.
          </div>
        )}

        {cars.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-line bg-white p-12 text-center text-muted">
            В блоке нет автомобилей — на главной он будет пустым. Добавьте первый автомобиль.
          </div>
        ) : (
          <ol className="mt-8 space-y-3">
            {cars.map((c, i) => (
              <li
                key={c.id}
                className="flex flex-col gap-4 rounded-3xl border border-line bg-white p-4 shadow-soft sm:flex-row sm:items-center"
              >
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <span className="font-display w-6 shrink-0 text-center text-lg font-extrabold text-navy-900/25">
                    {i + 1}
                  </span>
                  <div className="relative aspect-[16/10] w-28 shrink-0 overflow-hidden rounded-xl bg-navy-800">
                    {c.image ? (
                      <Image src={c.image} alt="" fill sizes="112px" className="object-cover" />
                    ) : (
                      <span className="absolute inset-0 flex items-center justify-center text-[11px] text-white/50">
                        без фото
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{c.brand}</p>
                    <p className="font-display truncate text-lg font-bold">{c.model}</p>
                    <p className="truncate text-sm text-muted">
                      {c.priceFrom > 0 ? `от ${formatUsd(c.priceFrom)}` : "цена по запросу"}
                      {c.segment && ` · ${c.segment}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <form action={moveFeatured}>
                    <input type="hidden" name="id" value={c.id} />
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
                  <form action={moveFeatured}>
                    <input type="hidden" name="id" value={c.id} />
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
                    href={`/admin/featured/${encodeURIComponent(c.id)}`}
                    className="inline-flex h-10 items-center rounded-full bg-navy-900 px-4 text-sm font-semibold text-white transition hover:bg-navy-700"
                  >
                    Изменить
                  </Link>
                  <form action={deleteFeatured}>
                    <input type="hidden" name="id" value={c.id} />
                    <ConfirmButton
                      message={`Удалить ${c.brand} ${c.model} из блока?`}
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
            Максимум {MAX_FEATURED} автомобилей. Лучше всего смотрится количество, кратное трём.
          </p>
          <form action={resetFeatured}>
            <ConfirmButton
              message="Вернуть 6 стандартных автомобилей из каталога? Текущие карточки и загруженные фото будут удалены."
              className="font-semibold text-muted underline-offset-4 transition hover:text-red-600 hover:underline"
            >
              Сбросить к стандартным
            </ConfirmButton>
          </form>
        </div>
      </main>
    </>
  );
}
