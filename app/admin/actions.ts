"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkPassword, createSessionValue, requireAdmin, SESSION_COOKIE } from "@/lib/admin-auth";
import {
  ALLOWED_IMAGE_TYPES,
  defaultCars,
  deleteImage,
  getCars,
  MAX_CARS,
  MAX_HOME_CARS,
  saveCars,
  uploadImage,
  type CarImage,
  type StoredCar,
} from "@/lib/cars-store";

export type FormState = { error?: string; ok?: boolean };

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

/* ---------- auth ---------- */

export async function login(_: FormState, formData: FormData): Promise<FormState> {
  if (!process.env.ADMIN_PASSWORD) {
    return { error: "Админка не настроена: задайте переменную окружения ADMIN_PASSWORD" };
  }
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) {
    await new Promise((r) => setTimeout(r, 800));
    return { error: "Неверный пароль" };
  }
  const { value, maxAge } = createSessionValue();
  (await cookies()).set(SESSION_COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}

/* ---------- cars CRUD ---------- */

/** Сбрасывает кеш всех публичных страниц, которые зависят от каталога автомобилей. */
function revalidateCars(slugs: (string | null | undefined)[] = []) {
  revalidatePath("/"); // блок «Что мы привозим чаще всего» + футер
  revalidatePath("/avtomobili"); // сетка каталога
  for (const s of new Set(slugs.filter((s): s is string => Boolean(s)))) {
    revalidatePath(`/avtomobili/${s}`);
  }
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin");
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function text(formData: FormData, key: string, max: number) {
  return String(formData.get(key) ?? "").trim().slice(0, max);
}

function lines(formData: FormData, key: string, maxItems: number, maxLen: number) {
  return text(formData, key, maxLen * maxItems)
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, maxItems)
    .map((s) => s.slice(0, maxLen));
}

type ParsedCar = {
  slug: string;
  brand: string;
  model: string;
  segment: string;
  price: [number, number];
  engines: string[];
  drive: string;
  highlights: string[];
  description: string;
  whyPopular: string[];
  accent: string;
  featured: boolean;
};

function parseCarForm(formData: FormData, existingSlugs: string[]): { car: ParsedCar } | { error: string } {
  const brand = text(formData, "brand", 60);
  const model = text(formData, "model", 80);
  const description = text(formData, "description", 1200);
  if (!brand || !model) return { error: "Укажите марку и модель" };
  if (!description) return { error: "Добавьте описание автомобиля" };

  const slugInput = text(formData, "slug", 80);
  const slug = slugify(slugInput || `${brand}-${model}`);
  if (!slug) return { error: "Не удалось определить адрес страницы — укажите slug вручную" };
  if (existingSlugs.includes(slug)) return { error: `Адрес /avtomobili/${slug} уже занят другим автомобилем` };

  const priceFromRaw = text(formData, "priceFrom", 20).replace(/[^\d]/g, "");
  const priceToRaw = text(formData, "priceTo", 20).replace(/[^\d]/g, "");
  const priceFrom = priceFromRaw ? Number(priceFromRaw) : 0;
  const priceTo = priceToRaw ? Number(priceToRaw) : priceFrom;
  const price: [number, number] = priceFrom <= priceTo ? [priceFrom, priceTo] : [priceTo, priceFrom];

  const highlights = text(formData, "highlights", 400)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 6)
    .map((s) => s.slice(0, 40));

  const accent = text(formData, "accent", 60) || "from-neutral-700/80 to-black/80";

  return {
    car: {
      slug,
      brand,
      model,
      segment: text(formData, "segment", 40),
      price,
      engines: lines(formData, "engines", 10, 100),
      drive: text(formData, "drive", 80),
      highlights,
      description,
      whyPopular: lines(formData, "whyPopular", 6, 250),
      accent,
      featured: formData.get("featured") === "on",
    },
  };
}

export async function saveCar(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const prevSlug = text(formData, "prevSlug", 80) || null;
  const list = await getCars();
  const prevIndex = prevSlug ? list.findIndex((c) => c.slug === prevSlug) : -1;
  if (prevSlug && prevIndex === -1) return { error: "Автомобиль не найден — возможно, его уже удалили" };

  const prev = prevIndex >= 0 ? list[prevIndex] : null;
  const otherSlugs = list.filter((_, i) => i !== prevIndex).map((c) => c.slug);
  const parsed = parseCarForm(formData, otherSlugs);
  if ("error" in parsed) return parsed;

  if (!prev && list.length >= MAX_CARS) return { error: `Максимум ${MAX_CARS} автомобилей в каталоге` };
  const featuredCount = list.filter((c) => c.featured && c.slug !== prevSlug).length;
  if (parsed.car.featured && featuredCount >= MAX_HOME_CARS) {
    return { error: `Максимум ${MAX_HOME_CARS} автомобилей на главной — снимите галочку у другого` };
  }

  // Фото: оставляем существующие, кроме отмеченных на удаление, добавляем новые в конец.
  const removeUrls = new Set(formData.getAll("removeImage").map(String));
  const kept = (prev?.images ?? []).filter((img) => !removeUrls.has(img.url));
  const toDelete = (prev?.images ?? []).filter((img) => removeUrls.has(img.url));

  const newFiles = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
  const uploaded: CarImage[] = [];

  try {
    for (const file of newFiles) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return { error: "Фото должно быть в формате JPG, PNG, WEBP или AVIF" };
      if (file.size > MAX_IMAGE_BYTES) return { error: "Одно из фото больше 4 МБ — уменьшите его" };
      const url = await uploadImage(file, `${parsed.car.brand}-${parsed.car.model}-${kept.length + uploaded.length}`);
      uploaded.push({ url });
    }

    const images = [...kept, ...uploaded];
    const author = text(formData, "creditAuthor", 120);
    const source = text(formData, "creditSource", 300);
    if (images[0] && author && source) {
      images[0] = {
        url: images[0].url,
        credit: { author, source, license: text(formData, "creditLicense", 60) || undefined },
      };
    } else if (images[0]) {
      images[0] = { url: images[0].url };
    }

    const car: StoredCar = {
      ...parsed.car,
      images,
      order: prev?.order ?? list.length,
    };

    const next = [...list];
    if (prevIndex >= 0) next[prevIndex] = car;
    else next.push(car);

    await saveCars(next);
    await Promise.all(toDelete.map((img) => deleteImage(img.url)));
  } catch (err) {
    console.error("[admin] save car failed", err);
    return { error: err instanceof Error ? err.message : "Не удалось сохранить" };
  }

  revalidateCars([prevSlug, parsed.car.slug]);
  redirect("/admin?saved=1");
}

export async function deleteCar(formData: FormData): Promise<void> {
  await requireAdmin();
  const slug = String(formData.get("slug") ?? "");
  const list = await getCars();
  const car = list.find((c) => c.slug === slug);
  if (!car) {
    console.error("[admin] delete car: not found", slug);
    return;
  }

  try {
    await saveCars(list.filter((c) => c.slug !== slug));
    await Promise.all(car.images.map((img) => deleteImage(img.url)));
  } catch (err) {
    console.error("[admin] delete car failed", err);
    return;
  }

  revalidateCars([slug]);
}

export async function moveCar(formData: FormData): Promise<void> {
  await requireAdmin();
  const slug = String(formData.get("slug") ?? "");
  const dir = formData.get("dir") === "up" ? -1 : 1;
  const list = await getCars();
  const i = list.findIndex((c) => c.slug === slug);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= list.length) return;

  const a = list[i];
  const b = list[j];
  try {
    const next = [...list];
    next[i] = { ...b, order: a.order };
    next[j] = { ...a, order: b.order };
    await saveCars(next);
  } catch (err) {
    console.error("[admin] move car failed", err);
    return;
  }

  revalidateCars();
}

export async function seedCarsFromCatalog(): Promise<void> {
  await requireAdmin();
  const current = await getCars();
  const next = defaultCars();
  try {
    await saveCars(next);
    const orphaned = current.filter((c) => !next.some((n) => n.slug === c.slug));
    await Promise.all(orphaned.flatMap((c) => c.images.map((img) => deleteImage(img.url))));
  } catch (err) {
    console.error("[admin] seed cars failed", err);
    return;
  }

  revalidateCars([...current.map((c) => c.slug), ...next.map((c) => c.slug)]);
}
