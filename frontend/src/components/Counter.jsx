import { useEffect, useRef, useState } from "react";

// Анимированный счётчик. Принимает число или строку вида "100", "15+", "1200+".
export default function Counter({ to, duration = 1500, className = "" }) {
  const ref = useRef(null);
  const started = useRef(false);
  const [val, setVal] = useState(0);

  const num = typeof to === "number" ? to : parseInt(String(to).replace(/[^\d]/g, ""), 10) || 0;
  const suffix = typeof to === "string" ? String(to).replace(/[\d\s]/g, "") : "";

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const step = (now) => {
            const p = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(Math.round(num * eased));
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [num, duration]);

  return (
    <span ref={ref} className={className}>
      {val.toLocaleString("ru-RU")}
      {suffix}
    </span>
  );
}
