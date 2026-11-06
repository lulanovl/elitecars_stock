"use client";

/* eslint-disable @next/next/no-img-element -- previews of local files / arbitrary URLs */

import Link from "next/link";
import { useActionState, useEffect, useState, type ReactNode } from "react";
import type { FeaturedCar } from "@/lib/featured";
import { saveFeatured, type FormState } from "../actions";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";

const input =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] text-navy-900 placeholder:text-muted/70 outline-none transition focus:border-accent-500 focus:ring-4 focus:ring-accent-500/15";

const MAX_SIDE = 1800;

/** Shrinks big photos in the browser so uploads stay fast and under the server limit. */
async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    if (scale === 1 && file.size < 1.5 * 1024 * 1024) return file;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.85));
    if (!blob) return file;
    return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return file;
  }
}

async function submit(prev: FormState, formData: FormData) {
  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    formData.set("image", await compressImage(file));
  }
  return saveFeatured(prev, formData);
}

export function FeaturedForm({ title, car }: { title: string; car?: FeaturedCar }) {
  const [state, action, pending] = useActionState<FormState, FormData>(submit, {});
  const [brand, setBrand] = useState(car?.brand ?? "");
  const [model, setModel] = useState(car?.model ?? "");
  const [segment, setSegment] = useState(car?.segment ?? "");
  const [highlights, setHighlights] = useState(car?.highlights.join(", ") ?? "");
  const [price, setPrice] = useState(car?.priceFrom ? String(car.priceFrom) : "");
  const [preview, setPreview] = useState<string>(car?.image ?? "");
  const [removeImage, setRemoveImage] = useState(false);

  useEffect(() => {
    return () => {
      if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const tags = highlights
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);
  const priceNum = Number(price.replace(/[^\d]/g, "")) || 0;
  const shownImage = removeImage ? "" : preview;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-navy-900">
        <Icon.ArrowRight className="size-4 rotate-180" /> Все автомобили
      </Link>
      <h1 className="font-display mt-3 text-3xl font-bold tracking-tight">{title}</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <form action={action} className="space-y-5 rounded-3xl border border-line bg-white p-6 shadow-soft sm:p-8">
          {car && <input type="hidden" name="id" value={car.id} />}

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

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Тип кузова / плашка на фото">
              <input
                name="segment"
                maxLength={40}
                value={segment}
                onChange={(e) => setSegment(e.target.value)}
                placeholder="Премиальный кроссовер"
                className={input}
              />
            </Field>
            <Field label="Цена от, $" hint="Пусто — «цена по запросу»">
              <input
                name="priceFrom"
                inputMode="numeric"
                value={price}
                onChange={(e) => setPrice(e.target.value.replace(/[^\d\s]/g, ""))}
                placeholder="95000"
                className={input}
              />
            </Field>
          </div>

          <Field label="Особенности" hint="До 3 штук через запятую">
            <input
              name="highlights"
              maxLength={200}
              value={highlights}
              onChange={(e) => setHighlights(e.target.value)}
              placeholder="AMG Line, Пневмоподвеска, 7 мест"
              className={input}
            />
          </Field>

          <Field
            label="Ссылка карточки"
            hint="Например /avtomobili/mercedes-benz-gle. Пусто — кнопка ведёт к форме заявки."
          >
            <input
              name="href"
              maxLength={300}
              defaultValue={car?.href ?? ""}
              placeholder="/avtomobili/…"
              className={input}
            />
          </Field>

          <Field group label="Фото" hint="JPG, PNG или WEBP. Лучше горизонтальное ~16:10 — большие фото уменьшим автоматически.">
            <input
              type="file"
              name="image"
              aria-label="Фото автомобиля"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={(e) => {
                const f = e.target.files?.[0];
                setRemoveImage(false);
                setPreview(f ? URL.createObjectURL(f) : (car?.image ?? ""));
              }}
              className="block w-full text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-navy-900 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:bg-navy-700"
            />
            {car?.image && (
              <label className="mt-3 flex items-center gap-2 text-sm text-muted">
                <input
                  type="checkbox"
                  name="removeImage"
                  value="1"
                  checked={removeImage}
                  onChange={(e) => setRemoveImage(e.target.checked)}
                  className="size-4 accent-red-600"
                />
                Удалить текущее фото
              </label>
            )}
          </Field>

          {state.error && (
            <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
              {state.error}
            </p>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            <Button type="submit" disabled={pending}>
              {pending ? "Сохраняем…" : car ? "Сохранить изменения" : "Добавить на главную"}
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
            <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-neutral-700/80 to-black/80 p-5">
              {shownImage && <img src={shownImage} alt="" className="absolute inset-0 size-full object-cover" />}
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
