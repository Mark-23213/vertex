import { useState } from "react";
import { api } from "../api";
import { useAuth } from "../auth.jsx";

const FAQ = [
  { q: "Нужен ли опыт для участия?", a: "Зависит от вершины. Для маршрутов уровня «Начальный» и «Средний» опыт не обязателен — достаточно хорошей физической формы. Для семитысячников и восьмитысячников требуется высотный опыт." },
  { q: "Что входит в стоимость?", a: "Обычно — работа гидов, проживание и лагеря, питание на маршруте, пермиты и групповое снаряжение. Точный список указан на странице каждой экспедиции в блоках «Включено» и «Не включено»." },
  { q: "Как проходит акклиматизация?", a: "Все программы построены на постепенном наборе высоты: тренировочные выходы, ночёвки в высотных лагерях и штурм в благоприятное погодное окно." },
  { q: "Можно ли отменить заявку?", a: "Да. После отправки заявки с вами свяжется менеджер и обсудит условия, сроки и политику отмены для конкретной экспедиции." },
  { q: "Какое снаряжение нужно?", a: "Личное снаряжение (ботинки, одежда, спальник) — ваше, групповое (верёвки, палатки, кислород) предоставляем мы. Полный список выдаём после бронирования." },
];

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-ink dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-glacier transition-colors";

export default function Support() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      await api.support(form);
      setStatus("done");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  };

  return (
    <div>
      <section className="text-white" style={{ backgroundImage: "linear-gradient(150deg, #0ea5e9 0%, #0b1220 80%)" }}>
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
          <span className="text-xs font-semibold tracking-[0.25em] uppercase text-white/70">Поддержка</span>
          <h1 className="font-display font-bold text-5xl uppercase mt-2 mb-3">Чем помочь?</h1>
          <p className="text-white/80 max-w-xl">Ответим на вопросы по экспедициям, снаряжению и бронированию.</p>
        </div>
      </section>

      {/* Контакты */}
      <section className="border-b border-slate-200 dark:border-white/10 bg-frost dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-8 grid sm:grid-cols-3 gap-6">
          {[
            { label: "Email", value: "support@vertex-expeditions.com" },
            { label: "Телефон", value: "+7 (700) 000-00-00" },
            { label: "Часы работы", value: "Пн–Вс, 9:00–21:00" },
          ].map((c) => (
            <div key={c.label}>
              <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">{c.label}</div>
              <div className="font-medium text-ink dark:text-white">{c.value}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-14 grid lg:grid-cols-2 gap-12">
        {/* FAQ */}
        <div>
          <h2 className="font-display font-bold text-2xl uppercase text-ink dark:text-white mb-6">Частые вопросы</h2>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <details key={i} className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
                <summary className="cursor-pointer list-none px-5 py-4 flex items-center justify-between font-medium text-ink dark:text-white">
                  {item.q}
                  <span className="text-slate-400 group-open:rotate-45 transition-transform text-xl leading-none">+</span>
                </summary>
                <div className="px-5 pb-5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{item.a}</div>
              </details>
            ))}
          </div>
        </div>

        {/* Форма */}
        <div>
          <h2 className="font-display font-bold text-2xl uppercase text-ink dark:text-white mb-6">Написать нам</h2>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            {status === "done" ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
                <h3 className="font-display font-bold text-xl text-ink dark:text-white mb-2">Сообщение отправлено</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Мы ответим на {form.email} в ближайшее время.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-3">
                {error && (
                  <div className="px-3 py-2 rounded-lg bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-300 text-sm">
                    {error}
                  </div>
                )}
                <input name="name" value={form.name} onChange={change} placeholder="Имя" required className={inputClass} />
                <input type="email" name="email" value={form.email} onChange={change} placeholder="Email" required className={inputClass} />
                <input name="subject" value={form.subject} onChange={change} placeholder="Тема" className={inputClass} />
                <textarea name="message" value={form.message} onChange={change} placeholder="Ваш вопрос" rows={5} required className={inputClass} />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-3 rounded-xl bg-summit hover:bg-summit-deep text-white font-medium tracking-wide transition-colors disabled:opacity-60"
                >
                  {status === "loading" ? "Отправляем…" : "Отправить"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
