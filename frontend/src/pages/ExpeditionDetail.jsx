import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth.jsx";
import { useFavorites } from "../favorites.jsx";
import { formatPrice, difficultyClass, pluralize } from "../lib";

const inputClass =
  "w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-ink dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-glacier transition-colors";

function FavButton({ exp }) {
  const { isFav, toggle } = useFavorites();
  const fav = isFav(exp.id);
  return (
    <button
      onClick={() => toggle(exp.id)}
      className={`shrink-0 w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${
        fav
          ? "border-rose-300 bg-rose-50 dark:bg-rose-900/20 text-rose-500"
          : "border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-500 hover:border-rose-300"
      }`}
      aria-label={fav ? "Убрать из избранного" : "В избранное"}
      title={fav ? "В избранном" : "В избранное"}
    >
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill={fav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

function BookingForm({ exp }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    message: "",
  });
  const [people, setPeople] = useState(1);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const setN = (n) => setPeople(Math.min(20, Math.max(1, n)));

  const total = exp.price * people;
  const deposit = Math.round(total * 0.3);

  const submit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      await api.book({
        expedition_id: exp.id,
        name: form.name,
        email: form.email,
        phone: form.phone,
        people,
        message: form.message,
      });
      setStatus("done");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div className="text-center py-6">
        <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
        <h3 className="font-display font-bold text-xl text-ink dark:text-white mb-2">Заявка отправлена</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Мы свяжемся с вами по поводу экспедиции «{exp.name}».
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      {/* Калькулятор */}
      <div className="rounded-xl bg-frost dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-slate-600 dark:text-slate-300">Количество человек</span>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setN(people - 1)} className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-600 text-ink dark:text-white text-lg leading-none hover:border-glacier">−</button>
            <span className="w-8 text-center font-display font-bold text-lg text-ink dark:text-white">{people}</span>
            <button type="button" onClick={() => setN(people + 1)} className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-600 text-ink dark:text-white text-lg leading-none hover:border-glacier">+</button>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm py-1 border-t border-slate-200 dark:border-slate-700 pt-3">
          <span className="text-slate-500 dark:text-slate-400">Итого</span>
          <span className="font-display font-bold text-lg text-ink dark:text-white">{exp.currency}{formatPrice(total)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500 dark:text-slate-400">Предоплата (30%)</span>
          <span className="font-medium text-glacier-deep dark:text-glacier">{exp.currency}{formatPrice(deposit)}</span>
        </div>
      </div>

      {error && (
        <div className="px-3 py-2 rounded-lg bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-300 text-sm">
          {error}
        </div>
      )}
      <input name="name" value={form.name} onChange={change} placeholder="Имя" required className={inputClass} />
      <input type="email" name="email" value={form.email} onChange={change} placeholder="Email" required className={inputClass} />
      <input name="phone" value={form.phone} onChange={change} placeholder="Телефон" className={inputClass} />
      <textarea name="message" value={form.message} onChange={change} placeholder="Комментарий (опыт восхождений, пожелания)" rows={3} className={inputClass} />
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-3 rounded-lg bg-summit hover:bg-summit-deep text-white font-medium tracking-wide transition-colors disabled:opacity-60"
      >
        {status === "loading" ? "Отправляем…" : "Оставить заявку"}
      </button>
      <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
        Нажимая кнопку, вы соглашаетесь на обработку данных.
      </p>
    </form>
  );
}

export default function ExpeditionDetail() {
  const { id } = useParams();
  const [exp, setExp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    window.scrollTo(0, 0);
    api
      .expedition(id)
      .then(setExp)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
        <div className="h-64 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse mb-8" />
        <div className="h-8 w-1/3 bg-slate-100 dark:bg-slate-800 animate-pulse rounded mb-4" />
        <div className="h-40 bg-slate-100 dark:bg-slate-800 animate-pulse rounded" />
      </div>
    );
  }

  if (notFound || !exp) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-5">
        <h1 className="font-display font-bold text-3xl text-ink dark:text-white mb-3">Экспедиция не найдена</h1>
        <Link to="/expeditions" className="text-glacier-deep dark:text-glacier font-medium hover:underline">
          ← Ко всем экспедициям
        </Link>
      </div>
    );
  }

  const stats = [
    { label: "Высота", value: `${formatPrice(exp.altitude)} м` },
    { label: "Длительность", value: pluralize(exp.duration_days, ["день", "дня", "дней"]) },
    { label: "Сложность", value: exp.difficulty },
    { label: "Сезон", value: exp.season },
    { label: "Рейтинг", value: `${exp.rating} / 5` },
  ];

  return (
    <div>
      {/* HERO */}
      <section
        className="relative text-white"
        style={{
          backgroundImage: exp.image
            ? `linear-gradient(180deg, rgba(11,18,32,.3), rgba(11,18,32,.8)), url(${exp.image})`
            : `linear-gradient(140deg, ${exp.gradient_from}, ${exp.gradient_to})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-20">
          <Link to="/expeditions" className="text-white/70 hover:text-white text-sm">← Все экспедиции</Link>
          <div className="mt-4 flex items-center gap-3">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border bg-white ${difficultyClass(exp.difficulty)}`}>
              {exp.difficulty}
            </span>
            <span className="text-white/80 text-sm">{exp.region} · {exp.country}</span>
          </div>
          <h1 className="font-display font-bold text-5xl md:text-6xl uppercase mt-4">{exp.name}</h1>
          <p className="text-white/85 max-w-2xl mt-4 text-lg">{exp.summary}</p>
        </div>
      </section>

      {/* СТАТИСТИКА */}
      <section className="border-b border-slate-200 dark:border-white/10 bg-frost dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">{s.label}</div>
              <div className="font-display font-bold text-lg text-ink dark:text-white">{s.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* КОНТЕНТ */}
      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-14 grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <div>
            <h2 className="font-display font-bold text-2xl uppercase text-ink dark:text-white mb-4">Об экспедиции</h2>
            <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed">
              {(exp.description || []).map((p, i) => (<p key={i}>{p}</p>))}
            </div>
          </div>

          {exp.highlights?.length > 0 && (
            <div>
              <h2 className="font-display font-bold text-2xl uppercase text-ink dark:text-white mb-4">Что вас ждёт</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {exp.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-frost dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    <span className="text-glacier mt-0.5">▲</span>
                    <span className="text-sm text-slate-700 dark:text-slate-200">{h}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {exp.itinerary?.length > 0 && (
            <div>
              <h2 className="font-display font-bold text-2xl uppercase text-ink dark:text-white mb-4">Программа</h2>
              <div className="space-y-4">
                {exp.itinerary.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="shrink-0 w-14 text-center">
                      <div className="text-xs text-slate-400 dark:text-slate-500 uppercase">День</div>
                      <div className="font-display font-bold text-xl text-glacier-deep dark:text-glacier">{step.day}</div>
                    </div>
                    <div className="flex-1 pb-4 border-b border-slate-100 dark:border-slate-800">
                      <h3 className="font-semibold text-ink dark:text-white mb-1">{step.title}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-6">
            {exp.included?.length > 0 && (
              <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-900/15 border border-emerald-100 dark:border-emerald-900/30">
                <h3 className="font-display font-bold text-lg uppercase text-emerald-800 dark:text-emerald-300 mb-3">Включено</h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                  {exp.included.map((x, i) => (<li key={i} className="flex gap-2"><span className="text-emerald-600 dark:text-emerald-400">+</span> {x}</li>))}
                </ul>
              </div>
            )}
            {exp.excluded?.length > 0 && (
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <h3 className="font-display font-bold text-lg uppercase text-slate-700 dark:text-slate-200 mb-3">Не включено</h3>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  {exp.excluded.map((x, i) => (<li key={i} className="flex gap-2"><span className="text-slate-400">−</span> {x}</li>))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Сайдбар */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <span className="text-sm text-slate-500 dark:text-slate-400">Стоимость от</span>
                <div className="font-display font-bold text-4xl text-ink dark:text-white">
                  {exp.currency}{formatPrice(exp.price)}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">за участника</p>
              </div>
              <FavButton exp={exp} />
            </div>
            <BookingForm exp={exp} />
          </div>
        </div>
      </section>
    </div>
  );
}
