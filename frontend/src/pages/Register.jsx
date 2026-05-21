import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth.jsx";
import AuthShell from "../components/AuthShell.jsx";

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-ink dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-glacier focus:bg-white dark:focus:bg-slate-800 transition-colors";

export default function Register() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 8) {
      setError("Пароль должен быть не короче 8 символов");
      return;
    }

    setLoading(true);
    try {
      const data = await api.register(form);
      login(data.access_token, data.user);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Регистрация"
      subtitle="Создайте аккаунт, чтобы получить доступ к маршрутам."
      footer={
        <>
          Уже есть аккаунт?{" "}
          <Link to="/login" className="text-glacier-deep dark:text-glacier font-medium hover:underline">
            Войти
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        {error && (
          <div className="px-4 py-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-300 text-sm">
            {error}
          </div>
        )}
        <input type="text" name="name" value={form.name} onChange={change} placeholder="Имя" autoComplete="name" className={inputClass} />
        <input type="email" name="email" value={form.email} onChange={change} placeholder="Email" required autoComplete="email" className={inputClass} />
        <input type="password" name="password" value={form.password} onChange={change} placeholder="Пароль (минимум 8 символов)" required autoComplete="new-password" minLength={8} className={inputClass} />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-ink dark:bg-glacier text-white font-medium tracking-wide hover:bg-glacier-deep transition-colors disabled:opacity-60"
        >
          {loading ? "Создаём…" : "Зарегистрироваться"}
        </button>
      </form>
    </AuthShell>
  );
}
