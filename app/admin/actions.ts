"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkPassword, createSessionValue, requireAdmin, SESSION_COOKIE } from "@/lib/admin-auth";
import {
  ALLOWED_IMAGE_TYPES,
  defaultFeatured,
  deleteImage,
  getFeaturedCars,
  MAX_FEATURED,
  saveFeaturedCars,
  uploadImage,
  type FeaturedCar,
} from "@/lib/featured";

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

/* ---------- featured cars CRUD ---------- */

function refresh() {
  revalidatePath("/");
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

export async function saveFeatured(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const id = text(formData, "id", 80);
  const brand = text(formData, "brand", 60);
  const model = text(formData, "model", 80);
  const segment = text(formData, "segment", 40);
  const highlights = text(formData, "highlights", 200)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);
  const priceRaw = text(formData, "priceFrom", 20).replace(/[^\d]/g, "");
  const priceFrom = priceRaw ? Number(priceRaw) : 0;
  const href = text(formData, "href", 300);
  const file = formData.get("image");

  if (!brand || !model) return { error: "Укажите марку и модель" };
  if (href && !/^(\/|https?:\/\/|#)/.test(href)) {
    return { error: "Ссылка должна начинаться с /, # или https://" };
  }

  const list = await getFeaturedCars();
  const index = id ? list.findIndex((c) => c.id === id) : -1;
  if (id && index === -1) return { error: "Автомобиль не найден — возможно, его уже удалили" };
  if (!id && list.length >= MAX_FEATURED) return { error: `Максимум ${MAX_FEATURED} автомобилей в блоке` };

  const prev = index >= 0 ? list[index] : null;
  let image = prev?.image ?? "";
  let oldImage: string | null = null;

  try {
    if (file instanceof File && file.size > 0) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return { error: "Фото должно быть в формате JPG, PNG, WEBP или AVIF" };
      if (file.size > MAX_IMAGE_BYTES) return { error: "Фото больше 4 МБ — уменьшите его" };
      const url = await uploadImage(file, `${brand}-${model}`);
      if (prev?.image && prev.image !== url) oldImage = prev.image;
      image = url;
    } else if (formData.get("removeImage") === "1") {
      if (prev?.image) oldImage = prev.image;
      image = "";
    }

    const baseId = slugify(`${brand}-${model}`) || "car";
    const newId =
      prev?.id ?? (list.some((c) => c.id === baseId) ? `${baseId}-${Date.now().toString(36)}` : baseId);

    const car: FeaturedCar = { id: newId, brand, model, segment, highlights, priceFrom, image, href };
    const next = [...list];
    if (index >= 0) next[index] = car;
    else next.push(car);

    await saveFeaturedCars(next);
    if (oldImage) await deleteImage(oldImage);
  } catch (err) {
    console.error("[admin] save failed", err);
    return { error: err instanceof Error ? err.message : "Не удалось сохранить" };
  }

  refresh();
  redirect("/admin?saved=1");
}

export async function deleteFeatured(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const list = await getFeaturedCars();
  const car = list.find((c) => c.id === id);
  if (!car) return;
  await saveFeaturedCars(list.filter((c) => c.id !== id));
  if (car.image) await deleteImage(car.image);
  refresh();
}

export async function moveFeatured(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const dir = formData.get("dir") === "up" ? -1 : 1;
  const list = await getFeaturedCars();
  const i = list.findIndex((c) => c.id === id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= list.length) return;
  [list[i], list[j]] = [list[j], list[i]];
  await saveFeaturedCars(list);
  refresh();
}

export async function resetFeatured() {
  await requireAdmin();
  const current = await getFeaturedCars();
  await saveFeaturedCars(defaultFeatured());
  await Promise.all(current.map((c) => (c.image ? deleteImage(c.image) : null)));
  refresh();
}
