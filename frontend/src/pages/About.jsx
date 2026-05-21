import { Link } from "react-router-dom";
import Reveal from "../components/Reveal.jsx";
import Counter from "../components/Counter.jsx";

const values = [
  { title: "Безопасность прежде всего", text: "Сертифицированные гиды, проверенные маршруты, медподдержка и связь на всех этапах." },
  { title: "Полная логистика", text: "Берём на себя пермиты, заброски, лагеря и питание — вы концентрируетесь на восхождении." },
  { title: "Опыт с 2010 года", text: "Сотни успешных экспедиций от Эльбруса до восьмитысячников Гималаев и Каракорума." },
  { title: "Малые группы", text: "Индивидуальный подход и высокое соотношение гид/участник на технических маршрутах." },
];

const numbers = [
  { value: "100", label: "вершин в программе" },
  { value: "15+", label: "лет в горах" },
  { value: "1200+", label: "участников экспедиций" },
  { value: "7", label: "континентов" },
];

export default function About() {
  return (
    <div>
      <section className="text-white" style={{ backgroundImage: "linear-gradient(150deg, #0ea5e9 0%, #0b1220 80%)" }}>
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
          <span className="text-xs font-semibold tracking-[0.25em] uppercase text-white/70">О компании</span>
          <h1 className="font-display font-bold text-5xl uppercase mt-2 mb-3">Vertex Expeditions</h1>
          <p className="text-white/80 max-w-2xl text-lg">
            Мы организуем экспедиции на высочайшие вершины планеты — от учебных
            восхождений до серьёзных гималайских проектов.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="font-display font-bold text-3xl uppercase text-ink dark:text-white mb-5">Наша миссия</h2>
            <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                Vertex Expeditions — команда альпинистов и горных гидов, для которых
                горы стали профессией. Мы делаем высотные восхождения доступными,
                безопасными и хорошо организованными.
              </p>
              <p>
                За годы работы мы провели сотни экспедиций по всему миру и собрали
                каталог из 100 вершин — от Фудзи и Казбека до Эвереста и K2.
                Для каждого маршрута — выверенная программа акклиматизации и
                опытные гиды.
              </p>
            </div>
            <Link
              to="/expeditions"
              className="inline-block mt-8 px-7 py-3 rounded-full bg-ink dark:bg-glacier text-white font-medium hover:bg-glacier-deep transition-colors"
            >
              Выбрать экспедицию
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {numbers.map((n, i) => (
              <Reveal key={n.label} delay={i * 90}>
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-frost dark:bg-slate-900 p-6 text-center">
                  <div className="font-display font-bold text-4xl text-glacier-deep dark:text-glacier mb-1">
                    <Counter to={n.value} />
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{n.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-frost dark:bg-slate-900 border-y border-slate-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
          <h2 className="font-display font-bold text-3xl uppercase text-ink dark:text-white mb-10 text-center">Почему выбирают нас</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 90}>
                <div className="h-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 transition-transform duration-300 hover:-translate-y-1">
                  <div className="text-glacier text-2xl mb-3">▲</div>
                  <h3 className="font-semibold text-ink dark:text-white mb-2">{v.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
