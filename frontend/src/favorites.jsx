import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "./api";
import { useAuth } from "./auth.jsx";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const { token } = useAuth();
  const [ids, setIds] = useState(() => new Set());

  useEffect(() => {
    if (!token) {
      setIds(new Set());
      return;
    }
    api
      .favoriteIds()
      .then((arr) => setIds(new Set(arr)))
      .catch(() => {});
  }, [token]);

  const isFav = useCallback((id) => ids.has(id), [ids]);

  const toggle = useCallback(
    async (id) => {
      const has = ids.has(id);
      setIds((prev) => {
        const next = new Set(prev);
        if (has) next.delete(id);
        else next.add(id);
        return next;
      });
      try {
        if (has) await api.removeFavorite(id);
        else await api.addFavorite(id);
      } catch {
        // откат при ошибке
        setIds((prev) => {
          const next = new Set(prev);
          if (has) next.add(id);
          else next.delete(id);
          return next;
        });
      }
    },
    [ids]
  );

  return (
    <FavoritesContext.Provider value={{ ids, isFav, toggle, count: ids.size }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
