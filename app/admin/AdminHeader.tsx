import Link from "next/link";
import { Logo } from "@/components/Logo";

export function AdminHeader({ logoutAction }: { logoutAction: () => Promise<void> }) {
  return (
    <header className="sticky top-0 z-30 bg-black text-white">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/admin" className="flex items-center gap-3">
          <Logo className="h-10 w-auto" />
          <span className="hidden rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-white/70 sm:inline">
            Админ-панель
          </span>
        </Link>
        <div className="flex items-center gap-2 text-sm">
          <Link
            href="/"
            target="_blank"
            className="rounded-full px-3 py-2 font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            Открыть сайт ↗
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-full border border-white/20 px-3 py-2 font-medium transition hover:bg-white/10"
            >
              Выйти
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
