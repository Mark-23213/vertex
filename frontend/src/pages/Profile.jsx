import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth.jsx";
import { useFavorites } from "../favorites.jsx";
import ExpeditionCard from "../components/ExpeditionCard.jsx";

const EXPERIENCE = ["", "Новичок", "Любитель", "Опытный", "Профи"];

const inputClass =
  "w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-ink dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-glacier transition-colors";

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return iso;
  }
}

function Stat({ value, label }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-frost dark:bg-slate-900 p-5 text-center">
      <div className="font-display font-bold text-3xl text-glacier-deep dark:text-glacier">{value}</div>
      <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{label}</div>
    </div>
  );
}

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const { count: favCount } = useFavorites();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({ name: "", phone: "", city: "", experience: "", about: "" });
  const [saveState, setSaveState] = useState("idle");
  const [profileMsg, setProfileMsg] = useState("");

  const [pw, setPw] = useState({ current_password: "", new_password: "" });
  const [pwState, setPwState] = useState("idle");
  const [pwMsg, setPwMsg] = useState("");

  useEffect(() => {
    Promise.all([
      api.me().catch(() => user),
      api.myBookings().catch(() => []),
      api.favorites().catch(() => []),
    ]).then(([me, bk, fav]) => {
      if (me) {
        setForm({
          name: me.name || "",
          phone: me.phone || "",
          city: me.city || "",
          experience: me.experience || "",
          about: me.about || "",
        });
      }
      setBookings(bk || []);
      setFavorites(fav || []);
      setLoading(false);
    });
  }, []);

  const changeForm = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const changePw = (e) => setPw((p) => ({ ...p, [e.target.name]: e.target.value }));

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaveState("loading");
    setProfileMsg("");
    try {
      const updated = await api.updateProfile(form);
      updateUser(updated);
      setSaveState("done");
      setProfileMsg("Профиль сохранён");
      setTimeout(() => setSaveState("idle"), 2000);
    } catch (err) {
      setSaveState("error");
      setProfileMsg(err.message);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    setPwState("loading");
    setPwMsg("");
    try {
      await api.changePassword(pw);
      setPwState("done");
      setPwMsg("Пароль изменён");
      setPw({ current_password: "", new_password: "" });
      setTimeout(() => setPwState("idle"), 2000);
    } catch (err) {
      setPwState("error");
      setPwMsg(err.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const initials = (form.name || user?.name || user?.email || "U").trim()[0]?.toUpperCase();

  return (
    <div>
      <section className="text-white" style={{ backgroundImage: "linear-gradient(150deg, #0ea5e9 0%, #0b1220 80%)" }}>
        <div className="max-w-5xl mx-auto px-5 lg:px-8 py-14 flex items-center justify-between gap-5">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-white/15 border border-white/25 flex items-center justify-center font-display font-bold text-2xl">
              {initials}
            </div>
            <div>
              <h1 className="font-display font-bold text-3xl uppercase">{form.name || user?.name || "Участник"}</h1>
              <p className="text-white/80">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="hidden sm:inline px-4 py-2 rounded-full border border-white/30 text-white text-sm font-medium hover:bg-white/10 transition-colors">
            Выйти
          </button>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-5 lg:px-8 py-10 space-y-12">
        {/* Дашборд */}
        <div className="grid grid-cols-2 gap-4">
          <Stat value={bookings.length} label="заявок" />
          <Stat value={favCount} label="в избранном" />
        </div>

        {/* Редактирование профиля */}
        <div>
          <h2 className="font-display font-bold text-2xl uppercase text-ink dark:text-white mb-5">Профиль</h2>
          <form onSubmit={saveProfile} className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-sm text-slate-500 dark:text-slate-400 block mb-1">ФИО</label>
              <input name="name" value={form.name} onChange={changeForm} placeholder="Фамилия Имя Отчество" className={inputClass} />
            </div>
            <div>
              <label className="text-sm text-slate-500 dark:text-slate-400 block mb-1">Телефон</label>
              <input name="phone" value={form.phone} onChange={changeForm} placeholder="+7 ___ ___" className={inputClass} />
            </div>
            <div>
              <label className="text-sm text-slate-500 dark:text-slate-400 block mb-1">Город</label>
              <input name="city" value={form.city} onChange={changeForm} placeholder="Город" className={inputClass} />
            </div>
            <div>
              <label className="text-sm text-slate-500 dark:text-slate-400 block mb-1">Опыт восхождений</label>
              <select name="experience" value={form.experience} onChange={changeForm} className={inputClass}>
                {EXPERIENCE.map((x) => (
                  <option key={x} value={x}>{x || "Не указан"}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm text-slate-500 dark:text-slate-400 block mb-1">О себе</label>
              <textarea name="about" value={form.about} onChange={changeForm} rows={3} placeholder="Расскажите о своём опыте и целях" className={inputClass} />
            </div>
            <div className="sm:col-span-2 flex items-center gap-4">
              <button type="submit" disabled={saveState === "loading"} className="px-6 py-2.5 rounded-lg bg-ink dark:bg-glacier text-white font-medium hover:bg-glacier-deep transition-colors disabled:opacity-60">
                {saveState === "loading" ? "Сохраняем…" : "Сохранить"}
              </button>
              {profileMsg && (
                <span className={`text-sm ${saveState === "error" ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                  {profileMsg}
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Смена пароля */}
        <div>
          <h2 className="font-display font-bold text-2xl uppercase text-ink dark:text-white mb-5">Смена пароля</h2>
          <form onSubmit={savePassword} className="grid sm:grid-cols-2 gap-4 max-w-xl">
            <input type="password" name="current_password" value={pw.current_password} onChange={changePw} placeholder="Текущий пароль" required autoComplete="current-password" className={inputClass} />
            <input type="password" name="new_password" value={pw.new_password} onChange={changePw} placeholder="Новый пароль (мин. 8)" required minLength={8} autoComplete="new-password" className={inputClass} />
            <div className="sm:col-span-2 flex items-center gap-4">
              <button type="submit" disabled={pwState === "loading"} className="px-6 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-ink dark:text-white font-medium hover:border-glacier transition-colors disabled:opacity-60">
                {pwState === "loading" ? "Меняем…" : "Изменить пароль"}
              </button>
              {pwMsg && (
                <span className={`text-sm ${pwState === "error" ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                  {pwMsg}
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Мои заявки */}
        <div>
          <h2 className="font-display font-bold text-2xl uppercase text-ink dark:text-white mb-5">Мои заявки</h2>
          {loading ? (
            <div className="h-20 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ) : bookings.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center">
              <p className="text-slate-500 dark:text-slate-400 mb-4">Заявок пока нет.</p>
              <Link to="/expeditions" className="px-6 py-2.5 rounded-full bg-ink dark:bg-glacier text-white font-medium hover:bg-glacier-deep transition-colors">
                Выбрать экспедицию
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((b) => (
                <Link key={b.id} to={`/expeditions/${b.expedition_id}`} className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-4 hover:border-glacier dark:hover:border-glacier transition-colors">
                  <div>
                    <div className="font-semibold text-ink dark:text-white">{b.expedition_name}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">{b.people} чел. · заявка от {formatDate(b.created_at)}</div>
                  </div>
                  <span className="text-glacier-deep dark:text-glacier text-sm font-medium whitespace-nowrap">Открыть →</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Избранное */}
        <div>
          <h2 className="font-display font-bold text-2xl uppercase text-ink dark:text-white mb-5">Избранное</h2>
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[0, 1, 2].map((i) => (<div key={i} className="h-80 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />))}
            </div>
          ) : favorites.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center">
              <p className="text-slate-500 dark:text-slate-400">Нажмите ♥ на карточке экспедиции, чтобы сохранить её здесь.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((exp) => (<ExpeditionCard key={exp.id} exp={exp} />))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
