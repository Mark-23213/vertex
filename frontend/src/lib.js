export function formatPrice(n) {
  return new Intl.NumberFormat("ru-RU").format(n);
}

const DIFFICULTY = {
  Начальный: "text-emerald-700 bg-emerald-50 border-emerald-200",
  Средний: "text-sky-700 bg-sky-50 border-sky-200",
  Высокий: "text-amber-700 bg-amber-50 border-amber-200",
  Экстремальный: "text-rose-700 bg-rose-50 border-rose-200",
};

export function difficultyClass(d) {
  return DIFFICULTY[d] || "text-slate-700 bg-slate-50 border-slate-200";
}

export function pluralize(n, [one, few, many]) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} ${one}`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return `${n} ${few}`;
  return `${n} ${many}`;
}
