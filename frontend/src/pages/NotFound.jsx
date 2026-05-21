import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-5">
      <span className="text-xs font-semibold tracking-[0.25em] uppercase text-glacier-deep dark:text-glacier mb-4">
        Ошибка 404
      </span>
      <h1 className="font-display font-bold text-7xl md:text-8xl text-ink dark:text-white mb-4">
        404
      </h1>
      <p className="text-slate-600 dark:text-slate-300 max-w-sm mb-8">
        Похоже, этот маршрут не существует. Вернёмся к экспедициям?
      </p>
      <Link
        to="/expeditions"
        className="px-7 py-3 rounded-full bg-ink dark:bg-glacier text-white font-medium hover:bg-glacier-deep dark:hover:bg-glacier-deep transition-colors"
      >
        К экспедициям
      </Link>
    </div>
  );
}
