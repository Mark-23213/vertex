import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth.jsx";
import ThemeToggle from "./ThemeToggle.jsx";

function MountainMark({ className = "" }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path d="M3 26 L13 7 L18 16 L21 11 L29 26 Z" fill="currentColor" />
      <path d="M13 7 L10 12.5 L16 12.5 Z" fill="#0ea5e9" />
    </svg>
  );
}

const NAV = [
  { to: "/", label: "Главная", end: true },
  { to: "/expeditions", label: "Экспедиции" },
  { to: "/about", label: "О нас" },
  { to: "/support", label: "Поддержка" },
];

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (menu && menuRef.current && !menuRef.current.contains(e.target)) setMenu(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menu]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const navClass = ({ isActive }) =>
    `text-sm font-medium tracking-wide transition-colors ${
      isActive
        ? "text-glacier-deep dark:text-glacier"
        : "text-slate-600 dark:text-slate-300 hover:text-ink dark:hover:text-white"
    }`;

  const initials = (user?.name || user?.email || "U").trim()[0]?.toUpperCase();

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-ink/90 backdrop-blur-md border-b border-slate-200 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <MountainMark className="w-8 h-8 text-ink dark:text-white group-hover:text-glacier-deep dark:group-hover:text-glacier transition-colors" />
          <span className="font-display font-bold text-xl tracking-[0.18em] text-ink dark:text-white">
            VERTEX
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={navClass}>
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />

          {/* Меню пользователя */}
          <div className="relative hidden sm:block" ref={menuRef}>
            <button
              onClick={() => setMenu((v) => !v)}
              className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 hover:border-glacier dark:hover:border-glacier transition-colors"
            >
              <span className="w-7 h-7 rounded-full bg-ink dark:bg-glacier text-white text-xs font-semibold flex items-center justify-center">
                {initials}
              </span>
              <span className="text-sm text-slate-700 dark:text-slate-200 max-w-[110px] truncate">
                {user?.name || user?.email}
              </span>
              <svg viewBox="0 0 24 24" className={`w-3.5 h-3.5 text-slate-400 transition-transform ${menu ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {menu && (
              <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg dark:shadow-black/40 overflow-hidden">
                <Link to="/profile" onClick={() => setMenu(false)} className="block px-4 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
                  Личный кабинет
                </Link>
                <Link to="/profile" onClick={() => setMenu(false)} className="block px-4 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
                  Мои заявки
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 border-t border-slate-100 dark:border-slate-800"
                >
                  Выйти
                </button>
              </div>
            )}
          </div>

          <button
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 text-ink dark:text-white"
            onClick={() => setOpen((v) => !v)}
            aria-label="Меню"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d={open ? "M6 6 L18 18 M6 18 L18 6" : "M4 7h16 M4 12h16 M4 17h16"} strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden border-t border-slate-200 dark:border-white/10 bg-white dark:bg-ink px-5 py-3 flex flex-col gap-1">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className="py-2 text-slate-700 dark:text-slate-200 font-medium"
              onClick={() => setOpen(false)}
            >
              {n.label}
            </NavLink>
          ))}
          <Link to="/profile" className="py-2 text-slate-700 dark:text-slate-200 font-medium" onClick={() => setOpen(false)}>
            Личный кабинет
          </Link>
          <button onClick={handleLogout} className="py-2 text-left text-rose-600 dark:text-rose-400 font-medium">
            Выйти
          </button>
        </nav>
      )}
    </header>
  );
}
