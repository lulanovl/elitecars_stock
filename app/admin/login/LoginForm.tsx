"use client";

import { useActionState } from "react";
import { login, type FormState } from "../actions";
import { Button } from "@/components/ui/Button";

export function LoginForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(login, {});
  return (
    <form action={action} className="mt-6 space-y-4">
      <input
        type="password"
        name="password"
        required
        autoFocus
        autoComplete="current-password"
        placeholder="Пароль"
        className="w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] outline-none transition focus:border-accent-500 focus:ring-4 focus:ring-accent-500/15"
      />
      {state.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Проверяем…" : "Войти"}
      </Button>
    </form>
  );
}
