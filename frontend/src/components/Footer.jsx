import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-ink text-slate-300">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <svg viewBox="0 0 32 32" className="w-8 h-8" aria-hidden="true">
                <path d="M3 26 L13 7 L18 16 L21 11 L29 26 Z" fill="#f6f8fb" />
                <path d="M13 7 L10 12.5 L16 12.5 Z" fill="#0ea5e9" />
              </svg>
              <span className="font-display font-bold text-xl tracking-[0.18em] text-white">
                VERTEX
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400 max-w-xs">
              Экспедиции на высотные вершины мира. Профессиональные гиды,
              проверенные маршруты, полная логистика.
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-4 font-semibold">
              Навигация
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Главная</Link>
              </li>
              <li>
                <Link to="/expeditions" className="hover:text-white transition-colors">Все экспедиции</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">О нас</Link>
              </li>
              <li>
                <Link to="/support" className="hover:text-white transition-colors">Поддержка</Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-white transition-colors">Личный кабинет</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-4 font-semibold">
              Контакты
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>info@vertex-expeditions.com</li>
              <li>+7 (700) 000-00-00</li>
              <li>Алматы, Казахстан</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-slate-500">
          <p>© 2026 Vertex Expeditions. Все права защищены.</p>
          <p>Восхождения связаны с риском для жизни.</p>
        </div>
      </div>
    </footer>
  );
}
