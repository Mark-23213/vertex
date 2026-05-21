import { useEffect, useMemo, useState } from "react";
import { api } from "../api";
import ExpeditionCard from "../components/ExpeditionCard.jsx";
import { useFavorites } from "../favorites.jsx";
import Reveal from "../components/Reveal.jsx";

const FILTERS = ["Все", "Начальный", "Средний", "Высокий", "Экстремальный"];
const PER_PAGE = 12;

const SORTS = {
  alt_asc: { label: "Высота ↑", fn: (a, b) => a.altitude - b.altitude },
  alt_desc: { label: "Высота ↓", fn: (a, b) => b.altitude - a.altitude },
  price_asc: { label: "Цена ↑", fn: (a, b) => a.price - b.price },
  price_desc: { label: "Цена ↓", fn: (a, b) => b.price - a.price },
  name: { label: "Название", fn: (a, b) => a.name.localeCompare(b.name, "ru") },
};

const selectClass =
  "px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-glacier";

export default function Expeditions() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { ids: favIds } = useFavorites();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Все");
  const [region, setRegion] = useState("Все регионы");
  const [sort, setSort] = useState("alt_asc");
  const [favOnly, setFavOnly] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    api
      .expeditions()
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const regions = useMemo(
    () => ["Все регионы", ...Array.from(new Set(items.map((e) => e.region))).sort()],
    [items]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = items.filter(
      (e) =>
        (filter === "Все" || e.difficulty === filter) &&
        (region === "Все регионы" || e.region === region) &&
        (!favOnly || favIds.has(e.id)) &&
        (!q || e.name.toLowerCase().includes(q) || (e.country || "").toLowerCase().includes(q))
    );
    return [...list].sort(SORTS[sort].fn);
  }, [items, query, filter, region, sort, favOnly, favIds]);

  // Сброс страницы при смене фильтров
  useEffect(() => setPage(1), [query, filter, region, sort, favOnly]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div>
      {/* Заголовок */}
      <section
        className="text-white"
        style={{ backgroundImage: "linear-gradient(150deg, #0ea5e9 0%, #0b1220 80%)" }}
      >
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
          <span className="text-xs font-semibold tracking-[0.25em] uppercase text-white/70">
            Каталог
          </span>
          <h1 className="font-display font-bold text-5xl uppercase mt-2 mb-3">Экспедиции</h1>
          <p className="text-white/80 max-w-xl">
            100 маршрутов на вершины от 3000 до 8848 метров. Используйте поиск,
            фильтры и сортировку.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-10">
        {/* Панель управления */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <div className="relative flex-1">
              <svg viewBox="0 0 24 24" className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" strokeLinecap="round" />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Поиск по названию или стране…"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-glacier"
              />
            </div>
            <select value={region} onChange={(e) => setRegion(e.target.value)} className={selectClass}>
              {regions.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className={selectClass}>
              {Object.entries(SORTS).map(([k, v]) => (
                <option key={k} value={k}>
                  Сортировка: {v.label}
                </option>
              ))}
            </select>
          </div>

          {/* Чипы сложности */}
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  filter === f
                    ? "bg-ink dark:bg-glacier text-white border-ink dark:border-glacier"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500"
                }`}
              >
                {f}
              </button>
            ))}
            <button
              onClick={() => setFavOnly((v) => !v)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors inline-flex items-center gap-1.5 ${
                favOnly
                  ? "bg-rose-500 text-white border-rose-500"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-rose-300"
              }`}
            >
              <span>♥</span> Избранное
            </button>
          </div>
        </div>

        {/* Счётчик */}
        {!loading && !error && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Найдено: {filtered.length}
          </p>
        )}

        {error && (
          <div className="px-4 py-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-80 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 py-12 text-center">
            Ничего не найдено. Измените параметры поиска.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pageItems.map((exp, i) => (
                <Reveal key={exp.id} delay={(i % 3) * 80}>
                  <ExpeditionCard exp={exp} />
                </Reveal>
              ))}
            </div>

            {/* Пагинация */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:border-slate-400 dark:hover:border-slate-500 transition-colors"
                >
                  Назад
                </button>
                <span className="text-sm text-slate-500 dark:text-slate-400 px-2">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:border-slate-400 dark:hover:border-slate-500 transition-colors"
                >
                  Вперёд
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
