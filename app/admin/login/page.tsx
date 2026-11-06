import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { adminConfigured, isAdmin } from "@/lib/admin-auth";
import { Logo } from "@/components/Logo";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Вход" };

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <div className="flex min-h-dvh items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center rounded-3xl bg-black py-6">
          <Logo className="h-14 w-auto" />
        </div>
        <div className="rounded-3xl border border-line bg-white p-7 shadow-lift">
          <h1 className="font-display text-2xl font-bold">Вход в админ-панель</h1>
          {adminConfigured() ? (
            <>
              <p className="mt-1 text-sm text-muted">Введите пароль администратора.</p>
              <LoginForm />
            </>
          ) : (
            <p className="mt-3 rounded-xl bg-amber-50 p-4 text-sm leading-relaxed text-navy-900">
              Админка ещё не настроена. Добавьте переменную окружения <code className="font-semibold">ADMIN_PASSWORD</code>{" "}
              в настройках проекта на Vercel (Settings → Environment Variables) и сделайте Redeploy.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
