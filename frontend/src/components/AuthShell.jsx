export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white dark:bg-ink">
      {/* Брендовая панель */}
      <div
        className="relative hidden lg:flex flex-col justify-between p-12 text-white overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(150deg, #0ea5e9 0%, #0b1220 70%)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <svg viewBox="0 0 32 32" className="w-9 h-9" aria-hidden="true">
            <path d="M3 26 L13 7 L18 16 L21 11 L29 26 Z" fill="#ffffff" />
            <path d="M13 7 L10 12.5 L16 12.5 Z" fill="#0ea5e9" />
          </svg>
          <span className="font-display font-bold text-2xl tracking-[0.18em]">
            VERTEX
          </span>
        </div>

        <div>
          <h2 className="font-display font-bold text-4xl xl:text-5xl uppercase leading-tight mb-4">
            Выше облаков
          </h2>
          <p className="text-white/80 max-w-sm leading-relaxed">
            Закрытый клуб экспедиций на высочайшие вершины планеты — от Эльбруса
            до Эвереста. Доступ к маршрутам только для участников.
          </p>
        </div>

        <p className="text-white/50 text-sm">
          © 2026 Vertex Expeditions
        </p>

        {/* силуэт гор */}
        <svg
          viewBox="0 0 600 160"
          preserveAspectRatio="none"
          className="absolute bottom-0 left-0 w-full h-40 opacity-20"
        >
          <path
            d="M0 160 L120 60 L200 110 L300 30 L380 90 L470 50 L600 130 L600 160 Z"
            fill="#ffffff"
          />
        </svg>
      </div>

      {/* Форма */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2.5 mb-8 text-ink dark:text-white">
            <svg viewBox="0 0 32 32" className="w-8 h-8" aria-hidden="true">
              <path d="M3 26 L13 7 L18 16 L21 11 L29 26 Z" fill="currentColor" />
              <path d="M13 7 L10 12.5 L16 12.5 Z" fill="#0ea5e9" />
            </svg>
            <span className="font-display font-bold text-xl tracking-[0.18em]">
              VERTEX
            </span>
          </div>

          <h1 className="font-display font-bold text-3xl uppercase tracking-wide text-ink dark:text-white mb-2">
            {title}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">{subtitle}</p>

          {children}

          <div className="mt-6 text-sm text-slate-500 dark:text-slate-400 text-center">{footer}</div>
        </div>
      </div>
    </div>
  );
}
