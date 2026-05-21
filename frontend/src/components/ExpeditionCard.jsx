import { useState } from "react";
import { Link } from "react-router-dom";
import { formatPrice, difficultyClass, pluralize } from "../lib";
import { useFavorites } from "../favorites.jsx";

export default function ExpeditionCard({ exp }) {
  const { isFav, toggle } = useFavorites();
  const fav = isFav(exp.id);
  const [pop, setPop] = useState(false);

  const onHeart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(exp.id);
    setPop(true);
    setTimeout(() => setPop(false), 350);
  };

  return (
    <Link
      to={`/expeditions/${exp.id}`}
      className="group block rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60 dark:hover:shadow-black/40"
    >
      {/* Постер */}
      <div className="relative h-44 overflow-hidden">
        <div
          className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-110"
          style={{
            backgroundImage: exp.image
              ? `linear-gradient(180deg, rgba(11,18,32,.15), rgba(11,18,32,.7)), url(${exp.image})`
              : `linear-gradient(140deg, ${exp.gradient_from}, ${exp.gradient_to})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="absolute inset-0 p-5 flex items-end">
          <button
            onClick={onHeart}
            aria-label={fav ? "Убрать из избранного" : "В избранное"}
            className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              className={`w-5 h-5 transition-colors ${fav ? "text-rose-500" : "text-slate-400"} ${pop ? "animate-pop" : ""}`}
              fill={fav ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <span className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-white/90 text-ink text-xs font-bold tracking-wide">
            {formatPrice(exp.altitude)} м
          </span>
          <h3 className="font-display font-bold text-2xl uppercase tracking-wide text-white drop-shadow">
            {exp.name}
          </h3>
        </div>
      </div>

      {/* Тело */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {exp.region} · {exp.country}
          </span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${difficultyClass(exp.difficulty)}`}>
            {exp.difficulty}
          </span>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5 line-clamp-2 min-h-[40px]">
          {exp.summary}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <div>
            <div className="text-xs text-slate-400 dark:text-slate-500">от</div>
            <div className="font-display font-bold text-xl text-ink dark:text-white">
              {exp.currency}
              {formatPrice(exp.price)}
            </div>
          </div>
          <div className="text-right text-sm text-slate-500 dark:text-slate-400">
            {pluralize(exp.duration_days, ["день", "дня", "дней"])}
            <div className="text-xs text-glacier-deep dark:text-glacier font-medium">{exp.season}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
