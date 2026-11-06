import "server-only";
import { del, get, put } from "@vercel/blob";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { cars } from "@/lib/content/cars";

/**
 * «Что мы привозим чаще всего» — карточки на главной, редактируются в /admin.
 *
 * Хранилище:
 *  - на Vercel — Vercel Blob (переменная BLOB_READ_WRITE_TOKEN появляется после подключения Blob к проекту);
 *  - локально без Blob — файл .data/featured-cars.json и картинки в .data/uploads/ (отдаются через /api/uploads/…).
 * Пока в хранилище ничего не сохранено, показываются 6 автомобилей из каталога (lib/content/cars.ts).
 */

export type FeaturedCar = {
  id: string;
  brand: string;
  model: string;
  /** Плашка на фото: «Бизнес-седан», «Кроссовер»… */
  segment: string;
  /** До 3 тегов под названием */
  highlights: string[];
  /** Цена «от», USD. 0 — «цена по запросу» */
  priceFrom: number;
  /** URL фото (Blob, /api/uploads/… или /cars/…) */
  image: string;
  /** Куда ведёт карточка. Пусто — к форме заявки на главной */
  href: string;
};

const DATA_PATH = "featured-cars/data.json";
const LOCAL_DIR = join(process.cwd(), ".data");
const LOCAL_FILE = join(LOCAL_DIR, "featured-cars.json");
export const LOCAL_UPLOADS = join(LOCAL_DIR, "uploads");

export const MAX_FEATURED = 24;

export function blobConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
}

/** На Vercel без Blob сохранять некуда: файловая система только для чтения. */
export function storageReady() {
  return blobConfigured() || !process.env.VERCEL;
}

export function defaultFeatured(): FeaturedCar[] {
  return cars.slice(0, 6).map((c) => ({
    id: c.slug,
    brand: c.brand,
    model: c.model,
    segment: c.segment,
    highlights: c.highlights.slice(0, 3),
    priceFrom: c.price[0],
    image: c.image ?? "",
    href: `/avtomobili/${c.slug}`,
  }));
}

function normalize(raw: unknown): FeaturedCar[] | null {
  if (!Array.isArray(raw)) return null;
  return raw
    .filter((x): x is Record<string, unknown> => !!x && typeof x === "object")
    .map((x) => ({
      id: String(x.id ?? ""),
      brand: String(x.brand ?? ""),
      model: String(x.model ?? ""),
      segment: String(x.segment ?? ""),
      highlights: Array.isArray(x.highlights) ? x.highlights.map(String).slice(0, 3) : [],
      priceFrom: Number(x.priceFrom) || 0,
      image: String(x.image ?? ""),
      href: String(x.href ?? ""),
    }))
    .filter((x) => x.id && x.model);
}

/** Все карточки в порядке показа. Никогда не бросает исключение — при ошибке отдаёт каталог по умолчанию. */
export async function getFeaturedCars(): Promise<FeaturedCar[]> {
  try {
    if (blobConfigured()) {
      const res = await get(DATA_PATH, { access: "public", useCache: false });
      if (!res || res.statusCode !== 200) return defaultFeatured();
      const json = await new Response(res.stream).json();
      return normalize(json) ?? defaultFeatured();
    }
    const text = await readFile(LOCAL_FILE, "utf8").catch(() => null);
    if (!text) return defaultFeatured();
    return normalize(JSON.parse(text)) ?? defaultFeatured();
  } catch (err) {
    console.error("[featured] read failed", err);
    return defaultFeatured();
  }
}

export async function saveFeaturedCars(list: FeaturedCar[]) {
  const body = JSON.stringify(list, null, 2);
  if (blobConfigured()) {
    await put(DATA_PATH, body, {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 60,
    });
    return;
  }
  if (!storageReady()) throw new Error("Хранилище не подключено: добавьте Vercel Blob к проекту");
  await mkdir(LOCAL_DIR, { recursive: true });
  await writeFile(LOCAL_FILE, body, "utf8");
}

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

export const ALLOWED_IMAGE_TYPES = Object.keys(EXT);

/** Загружает фото и возвращает его публичный URL. */
export async function uploadImage(file: File, baseName: string): Promise<string> {
  const ext = EXT[file.type];
  if (!ext) throw new Error("Поддерживаются JPG, PNG, WEBP и AVIF");
  const safe = baseName.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "") || "car";
  if (blobConfigured()) {
    const blob = await put(`featured-cars/images/${safe}.${ext}`, file, {
      access: "public",
      contentType: file.type,
      addRandomSuffix: true,
    });
    return blob.url;
  }
  if (!storageReady()) throw new Error("Хранилище не подключено: добавьте Vercel Blob к проекту");
  const name = `${safe}-${Date.now().toString(36)}.${ext}`;
  await mkdir(LOCAL_UPLOADS, { recursive: true });
  await writeFile(join(LOCAL_UPLOADS, name), Buffer.from(await file.arrayBuffer()));
  return `/api/uploads/${name}`;
}

/** Удаляет загруженное через админку фото. Фото каталога из /cars/ не трогаем. */
export async function deleteImage(url: string) {
  try {
    if (url.includes(".blob.vercel-storage.com/") && blobConfigured()) {
      await del(url);
    } else if (url.startsWith("/api/uploads/")) {
      await unlink(join(LOCAL_UPLOADS, url.slice("/api/uploads/".length)));
    }
  } catch (err) {
    console.error("[featured] image delete failed", err);
  }
}
