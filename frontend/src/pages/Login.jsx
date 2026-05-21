import { useState } from "react";
import { Link, Navigate, useNavigate, useLocation } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth.jsx";
import AuthShell from "../components/AuthShell.jsx";

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-ink dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-glacier focus:bg-white dark:focus:bg-slate-800 transition-colors";

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api.login(form);
      login(data.access_token, data.user);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Вход"
      subtitle="Войдите, чтобы открыть доступ к экспедициям."
      footer={
        <>
          Нет аккаунта?{" "}
          <Link to="/register" className="text-glacier-deep dark:text-glacier font-medium hover:underline">
            Зарегистрироваться
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
        <input type="email" name="email" value={form.email} onChange={change} placeholder="Email" required autoComplete="email" className={inputClass} />
        <input type="password" name="password" value={form.password} onChange={change} placeholder="Пароль" required autoComplete="current-password" className={inputClass} />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-ink dark:bg-glacier text-white font-medium tracking-wide hover:bg-glacier-deep transition-colors disabled:opacity-60"
        >
          {loading ? "Входим…" : "Войти"}
        </button>
      </form>
    </AuthShell>
  );
}
