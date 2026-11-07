import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { LOCAL_UPLOADS } from "@/lib/cars-store";

/** Serves admin photo uploads in local mode (without Vercel Blob). */
const TYPES: Record<string, string> = { jpg: "image/jpeg", png: "image/png", webp: "image/webp", avif: "image/avif" };

export async function GET(_: Request, { params }: RouteContext<"/api/uploads/[name]">) {
  const { name } = await params;
  const ext = name.split(".").pop() ?? "";
  if (!/^[a-z0-9-]+\.[a-z0-9]+$/.test(name) || !TYPES[ext]) return new Response("Not found", { status: 404 });
  try {
    const data = await readFile(join(LOCAL_UPLOADS, name));
    return new Response(new Uint8Array(data), {
      headers: { "Content-Type": TYPES[ext], "Cache-Control": "public, max-age=31536000, immutable" },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
