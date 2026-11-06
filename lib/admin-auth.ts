import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Простая авторизация для админки: один пароль из переменной ADMIN_PASSWORD.
 * После входа ставится httpOnly-cookie с подписанным сроком действия.
 */

export const SESSION_COOKIE = "ec_admin";
const SESSION_DAYS = 14;

function secret() {
  const s = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD;
  if (!s) throw new Error("ADMIN_PASSWORD is not set");
  return s;
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export function adminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function checkPassword(input: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  // Сравниваем подписи, чтобы длина пароля не влияла на время сравнения.
  return safeEqual(sign(`pw:${input}`), sign(`pw:${expected}`));
}

export function createSessionValue() {
  const exp = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  return { value: `${exp}.${sign(`session:${exp}`)}`, maxAge: SESSION_DAYS * 24 * 60 * 60 };
}

export async function isAdmin() {
  const raw = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!adminConfigured()) return false;
  if (!raw) return false;
  const [exp, sig] = raw.split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  return safeEqual(sig, sign(`session:${exp}`));
}

/** Для страниц и server actions админки: без сессии — на страницу входа. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
