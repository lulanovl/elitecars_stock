"use client";

/* eslint-disable @next/next/no-img-element -- previews of local files / arbitrary URLs */

import Link from "next/link";
import { useActionState, useEffect, useState, type ReactNode } from "react";
import type { StoredCar } from "@/lib/cars-store";
import { saveCar, type FormState } from "../actions";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import { compressImage } from "./compress-image";

const input =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] text-navy-900 placeholder:text-muted/70 outline-none transition focus:border-accent-500 focus:ring-4 focus:ring-accent-500/15";
const textarea = `${input} resize-y`;

const ACCENTS = [
  "from-zinc-600/80 to-neutral-800/80",
  "from-slate-700/80 to-slate-900/80",
  "from-stone-600/80 to-stone-800/80",
  "from-neutral-700/80 to-black/80",
  "from-sky-800/80 to-slate-900/80",
  "from-blue-900/80 to-slate-900/80",
  "from-indigo-900/80 to-slate-950/80",
  "from-red-900/80 to-neutral-900/80",
  "from-rose-900/80 to-neutral-900/80",
  "from-emerald-900/80 to-neutral-900/80",
  "from-gray-700/80 to-gray-900/80",
];

type Preview = { url: string; isNew: boolean };

async function submit(prev: FormState, formData: FormData) {
  const files = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
  formData.delete("images");
  for (const f of files) formData.append("images", await compressImage(f));
  return saveCar(prev, formData);
}

export function CarForm({ title, car }: { title: string; car?: StoredCar }) {
  const [state, action, pending] = useActionState<FormState, FormData>(submit, {});
  const [brand, setBrand] = useState(car?.brand ?? "");
  const [model, setModel] = useState(car?.model ?? "");
  const [segment, setSegment] = useState(car?.segment ?? "");
  const [highlights, setHighlights] = useState(car?.highlights.join(", ") ?? "");
  const [priceFrom, setPriceFrom] = useState(car?.price[0] ? String(car.price[0]) : "");
  const [accent, setAccent] = useState(car?.accent ?? ACCENTS[0]);
  const [previews, setPreviews] = useState<Preview[]>(() => (car?.images ?? []).map((i) => ({ url: i.url, isNew: false })));
  const [removed, setRemoved] = useState<Set<string>>(new Set());

  useEffect(() => {
    return () => {
      for (const p of previews) if (p.isNew && p.url.startsWith("blob:")) URL.revokeObjectURL(p.url);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tags = highlights
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);
  const priceNum = Number(priceFrom.replace(/[^\d]/g, "")) || 0;
  const visiblePreviews = previews.filter((p) => !removed.has(p.url));
  const mainPreview = visiblePreviews[0];

  function toggleRemove(url: string) {
    setRemoved((prev) => {
      const next = new Set(prev);
      if (next.has(url)) next.delete(url);
      else next.add(url);
      return next;
    });
  }

  function onFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    setPreviews((prev) => [...prev, ...files.map((f) => ({ url: URL.createObjectURL(f), isNew: true }))]);
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-navy-900">
        <Icon.ArrowRight className="size-4 rotate-180" /> Все автомобили
      </Link>
      <h1 className="font-display mt-3 text-3xl font-bold tracking-tight">{title}</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <form action={action} className="space-y-5 rounded-3xl border border-line bg-white p-6 shadow-soft sm:p-8">
          {car && <input type="hidden" name="prevSlug" value={car.slug} />}

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Марка *">
              <input
                name="brand"
                required
                maxLength={60}
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Mercedes-Benz"
                className={input}
              />
            </Field>
            <Field label="Модель *">
              <input
                name="model"
                required
                maxLength={80}
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="GLE 450 4MATIC"
                className={input}
              />
            </Field>
          </div>

          <Field label="Адрес страницы" hint="/avtomobili/<адрес>. Пусто — сформируем из марки и модели.">
            <input name="slug" maxLength={80} defaultValue={car?.slug ?? ""} placeholder="mercedes-benz-gle" className={input} />
          </Field>

          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="Тип кузова">
              <input
                name="segment"
                maxLength={40}
                value={segment}
                onChange={(e) => setSegment(e.target.value)}
                placeholder="Премиальный кроссовер"
                className={input}
              />
            </Field>
            <Field label="Цена от, $">
              <input
                name="priceFrom"
                inputMode="numeric"
                value={priceFrom}
                onChange={(e) => setPriceFrom(e.target.value.replace(/[^\d\s]/g, ""))}
                placeholder="95000"
                className={input}
              />
            </Field>
            <Field label="Цена до, $" hint="Пусто — равна «от»">
              <input name="priceTo" inputMode="numeric" defaultValue={car?.price[1] ? String(car.price[1]) : ""} placeholder="110000" className={input} />
            </Field>
          </div>

          <Field label="Описание *" hint="Идёт на страницу автомобиля и в метатеги">
            <textarea name="description" required maxLength={1200} rows={4} defaultValue={car?.description ?? ""} className={textarea} />
          </Field>

          <Field label="Почему выбирают через нас" hint="По одному пункту на строку, до 6 пунктов">
            <textarea name="whyPopular" maxLength={1500} rows={4} defaultValue={car?.whyPopular.join("\n") ?? ""} className={textarea} />
          </Field>

          <Field label="Двигатели и версии" hint="По одному на строку, до 10">
            <textarea name="engines" maxLength={1000} rows={3} defaultValue={car?.engines.join("\n") ?? ""} className={textarea} />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Привод">
              <input name="drive" maxLength={80} defaultValue={car?.drive ?? ""} placeholder="Полный привод 4MATIC" className={input} />
            </Field>
            <Field label="Особенности" hint="Через запятую, до 6 (в карточке — первые 3)">
              <input
                name="highlights"
                maxLength={300}
                value={highlights}
                onChange={(e) => setHighlights(e.target.value)}
                placeholder="AMG Line, Пневмоподвеска, 7 мест"
                className={input}
              />
            </Field>
          </div>

          <Field label="Градиент карточки без фото">
            <select name="accent" value={accent} onChange={(e) => setAccent(e.target.value)} className={input}>
              {ACCENTS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </Field>

          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" name="featured" defaultChecked={car?.featured ?? false} className="size-4 accent-accent-500" />
            Показывать на главной
          </label>

          <Field group label="Фото" hint="JPG, PNG, WEBP или AVIF. Первое фото — главное, лучше горизонтальное ~16:10.">
            <input
              type="file"
              name="images"
              multiple
              aria-label="Фото автомобиля"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={onFilesChange}
              className="block w-full text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-navy-900 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:bg-navy-700"
            />
            {previews.length > 0 && (
              <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                {previews.map((p) => (
                  <li key={p.url} className="relative overflow-hidden rounded-xl border border-line">
                    <div className="relative aspect-[16/10]">
                      <img src={p.url} alt="" className="absolute inset-0 size-full object-cover" />
                      {removed.has(p.url) && <div className="absolute inset-0 bg-black/60" />}
                    </div>
                    {!p.isNew && (
                      <label className="absolute bottom-1 left-1 right-1 flex items-center justify-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[11px] font-semibold text-red-600">
                        <input
                          type="checkbox"
                          name="removeImage"
                          value={p.url}
                          checked={removed.has(p.url)}
                          onChange={() => toggleRemove(p.url)}
                          className="size-3 accent-red-600"
                        />
                        Удалить
                      </label>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Field>

          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="Автор фото" hint="Для главного фото">
              <input name="creditAuthor" maxLength={120} defaultValue={car?.images[0]?.credit?.author ?? ""} className={input} />
            </Field>
            <Field label="Лицензия">
              <input name="creditLicense" maxLength={60} defaultValue={car?.images[0]?.credit?.license ?? ""} className={input} />
            </Field>
            <Field label="Ссылка на источник">
              <input name="creditSource" maxLength={300} defaultValue={car?.images[0]?.credit?.source ?? ""} className={input} />
            </Field>
          </div>

          {state.error && (
            <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
              {state.error}
            </p>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            <Button type="submit" disabled={pending}>
              {pending ? "Сохраняем…" : car ? "Сохранить изменения" : "Добавить автомобиль"}
            </Button>
            <Link
              href="/admin"
              className="inline-flex h-12 items-center rounded-full px-5 text-[15px] font-semibold text-muted hover:bg-navy-900/5"
            >
              Отмена
            </Link>
          </div>
        </form>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted">Так будет на главной</p>
          <div className="flex flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-soft">
            <div className={`relative aspect-[16/10] overflow-hidden bg-gradient-to-br ${accent} p-5`}>
              {mainPreview && <img src={mainPreview.url} alt="" className="absolute inset-0 size-full object-cover" />}
              {segment && (
                <span className="relative inline-flex w-fit rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-navy-900">
                  {segment}
                </span>
              )}
            </div>
            <div className="p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{brand || "Марка"}</p>
              <p className="font-display mt-1 text-xl font-bold">{model || "Модель"}</p>
              {tags.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {tags.map((t) => (
                    <li key={t} className="rounded-full bg-surface px-2.5 py-1 text-xs text-navy-900/80">
                      {t}
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-5">
                <p className="text-xs text-muted">{priceNum ? "Новый в Бишкеке от" : "Стоимость"}</p>
                <p className="font-display text-lg font-bold">
                  {priceNum
                    ? new Intl.NumberFormat("ru-RU", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(priceNum)
                    : "по запросу"}
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

function Field({ label, hint, group, children }: { label: string; hint?: string; group?: boolean; children: ReactNode }) {
  const Tag = group ? "div" : "label";
  return (
    <Tag className="block">
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-muted">{hint}</span>}
    </Tag>
  );
}
