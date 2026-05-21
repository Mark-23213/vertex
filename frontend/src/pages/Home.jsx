import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth.jsx";
import ExpeditionCard from "../components/ExpeditionCard.jsx";
import Reveal from "../components/Reveal.jsx";
import Counter from "../components/Counter.jsx";

const stats = [
  { value: "100", label: "вершин в программе" },
  { value: "15+", label: "лет опыта" },
  { value: "8848", label: "максимальная высота, м" },
  { value: "24/7", label: "поддержка на маршруте" },
];

export default function Home() {
  const { user } = useAuth();
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .expeditions()
      .then((data) => setFeatured(data.slice(0, 3)))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* HERO */}
      <section
        className="relative overflow-hidden text-white animate-gradient"
        style={{ backgroundImage: "linear-gradient(150deg, #0ea5e9 0%, #0b1220 60%, #0ea5e9 100%)" }}
      >
        <div className="absolute -top-20 -right-10 w-72 h-72 rounded-full bg-white/10 blur-3xl animate-floaty" />
        <div className="max-w-7xl mx-auto px-5 lg:px-8 pt-20 pb-28 relative z-10 animate-rise">
          {user?.name && (
            <p className="text-white/70 mb-4 tracking-wide">С возвращением, {user.name}</p>
          )}
          <h1 className="font-display font-bold text-5xl md:text-7xl uppercase leading-[1.05] max-w-3xl mb-6">
            Покорите вершины мира
          </h1>
          <p className="text-lg text-white/80 max-w-xl mb-10 leading-relaxed">
            Экспедиции на высочайшие точки континентов и легендарные семитысячники.
            Профессиональные гиды, проверенные маршруты и полная логистика.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/expeditions"
              className="px-8 py-4 rounded-full bg-summit hover:bg-summit-deep text-white font-medium tracking-wide transition-all hover:scale-105"
            >
              Выбрать экспедицию
            </Link>
            <a
              href="#featured"
              className="px-8 py-4 rounded-full border border-white/30 text-white font-medium hover:bg-white/10 transition-colors"
            >
              Популярные маршруты
            </a>
          </div>
        </div>

        <svg viewBox="0 0 1200 200" preserveAspectRatio="none" className="absolute bottom-0 left-0 w-full h-32 opacity-20">
          <path d="M0 200 L200 70 L340 140 L520 40 L680 120 L840 60 L1020 150 L1200 90 L1200 200 Z" fill="#ffffff" />
        </svg>
      </section>

      {/* СТАТИСТИКА */}
      <section className="border-b border-slate-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 90} className="text-center">
              <div className="font-display font-bold text-4xl text-ink dark:text-white mb-1">
                {s.value.includes("/") ? s.value : <Counter to={s.value} />}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ИЗБРАННЫЕ */}
      <section id="featured" className="max-w-7xl mx-auto px-5 lg:px-8 py-20">
        <Reveal className="flex items-end justify-between mb-10">
          <div>
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-glacier-deep dark:text-glacier">
              Маршруты
            </span>
            <h2 className="font-display font-bold text-4xl uppercase text-ink dark:text-white mt-2">
              Популярные экспедиции
            </h2>
          </div>
          <Link to="/expeditions" className="hidden sm:inline text-glacier-deep dark:text-glacier font-medium hover:underline">
            Смотреть все →
          </Link>
        </Reveal>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-80 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map((exp, i) => (
              <Reveal key={exp.id} delay={i * 120}>
                <ExpeditionCard exp={exp} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-ink text-white border-t border-white/10">
        <Reveal className="max-w-7xl mx-auto px-5 lg:px-8 py-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-display font-bold text-3xl uppercase mb-2">Готовы к восхождению?</h2>
            <p className="text-white/70">Выберите вершину и оставьте заявку — мы свяжемся с вами.</p>
          </div>
          <Link
            to="/expeditions"
            className="px-8 py-4 rounded-full bg-summit hover:bg-summit-deep text-white font-medium tracking-wide transition-all hover:scale-105 whitespace-nowrap"
          >
            Все экспедиции
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
