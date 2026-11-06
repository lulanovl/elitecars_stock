import { Icon } from "@/components/ui/Icons";

/**
 * Hero illustration: a mock "подборка" — how a client sees offers we found
 * across the Kyrgyz market. Pure markup, no external assets.
 */
const rows = [
  { car: "GLE 450 4MATIC", spec: "AMG Line · 2026 · 0 км", seller: "Дилер", tag: "Лучшая цена", best: true },
  { car: "GLE 450 4MATIC", spec: "AMG Line · 2026 · 8 км", seller: "Импортёр", tag: "В наличии" },
  { car: "GLE 450 4MATIC", spec: "Exclusive · 2025 · 12 км", seller: "Импортёр", tag: "Поступление" },
];

export function StockPanel() {
  return (
    <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
      <div className="rounded-[2rem] bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-5 ring-1 ring-white/10 sm:p-7">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">Ваша подборка</p>
            <p className="font-display mt-1 text-lg font-bold text-white">GLE · бюджет до $130 000</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-500/15 px-3 py-1 text-xs font-semibold text-accent-300">
            <Icon.Eye className="size-3.5" />
            Весь рынок КР
          </span>
        </div>

        <ul className="mt-6 space-y-3">
          {rows.map((r) => (
            <li
              key={r.spec}
              className={`flex items-center gap-4 rounded-2xl p-4 ${
                r.best ? "bg-white text-navy-900 shadow-lift" : "border border-white/10 bg-white/[0.03] text-white"
              }`}
            >
              <span
                className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${
                  r.best ? "bg-navy-900 text-accent-400" : "bg-white/10 text-white/70"
                }`}
              >
                <Icon.Steering className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-semibold">{r.car}</p>
                <p className={`truncate text-xs ${r.best ? "text-muted" : "text-white/55"}`}>
                  {r.spec} · {r.seller}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                  r.best ? "bg-accent-500 text-navy-900" : "bg-white/10 text-white/75"
                }`}
              >
                {r.tag}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-6 grid grid-cols-3 gap-2 text-center text-[11px] text-white/60 sm:text-xs">
          {[
            { icon: Icon.Shield, t: "Проверка ЛКП" },
            { icon: Icon.Document, t: "Сверка по VIN" },
            { icon: Icon.Wallet, t: "Торг за вас" },
          ].map(({ icon: I, t }) => (
            <div key={t} className="rounded-xl border border-white/10 px-2 py-3">
              <I className="mx-auto mb-1.5 size-4 text-accent-400" />
              {t}
            </div>
          ))}
        </div>
      </div>

      <div className="animate-float pointer-events-none absolute -top-4 -right-2 hidden rounded-2xl bg-white/95 px-4 py-3 text-navy-900 shadow-lift sm:block">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-full bg-amber-100 text-accent-600">
            <Icon.Clock className="size-4" />
          </span>
          <div>
            <p className="text-[11px] text-muted">До ключей</p>
            <p className="text-sm font-semibold">от 1 дня</p>
          </div>
        </div>
      </div>
    </div>
  );
}
