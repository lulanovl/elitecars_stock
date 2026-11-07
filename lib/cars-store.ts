import "server-only";
import { del, get, put } from "@vercel/blob";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { cars as seedCars } from "@/lib/content/cars";

/**
 * Единый каталог автомобилей: карточки на /avtomobili, страница каждой машины
 * /avtomobili/[slug] и блок «Что мы привозим чаще всего» на главной — всё из
 * одного списка, редактируется в /admin.
 *
 * Хранилище:
 *  - на Vercel — Vercel Blob (переменная BLOB_READ_WRITE_TOKEN появляется после подключения Blob к проекту);
 *  - локально без Blob — файл .data/cars.json и картинки в .data/uploads/ (отдаются через /api/uploads/…).
 * Пока в хранилище ничего не сохранено, показывается каталог по умолчанию из lib/content/cars.ts.
 */

export type CarImage = {
  url: string;
  /** Атрибуция для CC-лицензированных фото; показывается подписью под главным фото на странице машины */
  credit?: { author: string; license?: string; source: string };
};

export type StoredCar = {
  /** Первичный ключ и адрес страницы: /avtomobili/<slug> */
  slug: string;
  brand: string;
  model: string;
  segment: string;
  /** Цена «от»–«до» нового автомобиля в наличии в Кыргызстане, USD */
  price: [number, number];
  engines: string[];
  drive: string;
  highlights: string[];
  description: string;
  whyPopular: string[];
  /** Tailwind-градиент для карточки/страницы без фото */
  accent: string;
  /** Галерея; images[0] — главное фото (карточка, OG-картинка, страница) */
  images: CarImage[];
  /** Показывать в блоке «Что мы привозим чаще всего» на главной */
  featured: boolean;
  /** Порядок показа (по возрастанию) — общий и для каталога, и для блока на главной */
  order: number;
};

const DATA_PATH = "cars/data.json";
const LOCAL_DIR = join(process.cwd(), ".data");
const LOCAL_FILE = join(LOCAL_DIR, "cars.json");
export const LOCAL_UPLOADS = join(LOCAL_DIR, "uploads");

export const MAX_CARS = 200;
export const MAX_HOME_CARS = 24;

export function blobConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
}

/** На Vercel без Blob сохранять некуда: файловая система только для чтения. */
export function storageReady() {
  return blobConfigured() || !process.env.VERCEL;
}

export function defaultCars(): StoredCar[] {
  return seedCars.map((c, i) => ({
    slug: c.slug,
    brand: c.brand,
    model: c.model,
    segment: c.segment,
    price: c.price,
    engines: c.engines,
    drive: c.drive,
    highlights: c.highlights,
    description: c.description,
    whyPopular: c.whyPopular,
    accent: c.accent,
    images: c.image ? [{ url: c.image, credit: c.imageCredit }] : [],
    featured: i < 6,
    order: i,
  }));
}

function normalizeImage(raw: unknown): CarImage | null {
  if (typeof raw === "string") return raw ? { url: raw } : null;
  if (!raw || typeof raw !== "object") return null;
  const x = raw as Record<string, unknown>;
  const url = String(x.url ?? "");
  if (!url) return null;
  const creditRaw = x.credit;
  let credit: CarImage["credit"];
  if (creditRaw && typeof creditRaw === "object") {
    const c = creditRaw as Record<string, unknown>;
    const author = String(c.author ?? "");
    const source = String(c.source ?? "");
    if (author && source) {
      credit = { author, source, license: c.license ? String(c.license) : undefined };
    }
  }
  return { url, credit };
}

function normalizePrice(raw: unknown): [number, number] {
  if (Array.isArray(raw) && raw.length === 2) {
    const a = Number(raw[0]) || 0;
    const b = Number(raw[1]) || 0;
    return a <= b ? [a, b] : [b, a];
  }
  return [0, 0];
}

function normalize(raw: unknown): StoredCar[] | null {
  if (!Array.isArray(raw)) return null;
  return raw
    .filter((x): x is Record<string, unknown> => !!x && typeof x === "object")
    .map((x, i) => ({
      slug: String(x.slug ?? ""),
      brand: String(x.brand ?? ""),
      model: String(x.model ?? ""),
      segment: String(x.segment ?? ""),
      price: normalizePrice(x.price),
      engines: Array.isArray(x.engines) ? x.engines.map(String) : [],
      drive: String(x.drive ?? ""),
      highlights: Array.isArray(x.highlights) ? x.highlights.map(String) : [],
      description: String(x.description ?? ""),
      whyPopular: Array.isArray(x.whyPopular) ? x.whyPopular.map(String) : [],
      accent: String(x.accent ?? "from-neutral-700/80 to-black/80"),
      images: Array.isArray(x.images)
        ? x.images.map(normalizeImage).filter((img): img is CarImage => img !== null)
        : [],
      featured: Boolean(x.featured),
      order: Number.isFinite(Number(x.order)) ? Number(x.order) : i,
    }))
    .filter((x) => x.slug && x.model)
    .sort((a, b) => a.order - b.order);
}

/** Весь каталог в порядке показа. Никогда не бросает исключение — при ошибке отдаёт каталог по умолчанию. */
export async function getCars(): Promise<StoredCar[]> {
  try {
    if (blobConfigured()) {
      const res = await get(DATA_PATH, { access: "public", useCache: false });
      if (!res || res.statusCode !== 200) return defaultCars();
      const json = await new Response(res.stream).json();
      return normalize(json) ?? defaultCars();
    }
    const text = await readFile(LOCAL_FILE, "utf8").catch(() => null);
    if (!text) return defaultCars();
    return normalize(JSON.parse(text)) ?? defaultCars();
  } catch (err) {
    console.error("[cars-store] read failed", err);
    return defaultCars();
  }
}

export async function getCar(slug: string): Promise<StoredCar | undefined> {
  return (await getCars()).find((c) => c.slug === slug);
}

export async function getFeaturedCars(): Promise<StoredCar[]> {
  return (await getCars()).filter((c) => c.featured);
}

export async function saveCars(list: StoredCar[]) {
  const body = JSON.stringify(list, null, 2);
  if (blobConfigured()) {
    await put(DATA_PATH, body, {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
      // Без задержки CDN-кеша: созданная/удалённая машина должна быть видна сразу после сохранения.
      cacheControlMaxAge: 0,
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
    const blob = await put(`cars/images/${safe}.${ext}`, file, {
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
    console.error("[cars-store] image delete failed", err);
  }
}
