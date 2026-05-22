const API_BASE_URL = 'https://vertex-production-a108.up.railway.app';
const TOKEN_KEY = "vertex_token";
const USER_KEY = "vertex_user";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
}

export function setSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 401) {
    clearSession();
    if (!window.location.pathname.startsWith("/login")) {
      window.location.href = "/login";
    }
    throw new Error("Сессия истекла. Войдите снова.");
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.detail || "Произошла ошибка запроса");
  }
  return data;
}

export const api = {
  register: (body) => request("/auth/register", { method: "POST", body, auth: false }),
  login: (body) => request("/auth/login", { method: "POST", body, auth: false }),
  me: () => request("/auth/me"),
  expeditions: () => request("/expeditions"),
  expedition: (id) => request(`/expeditions/${encodeURIComponent(id)}`),
  book: (body) => request("/bookings", { method: "POST", body }),
  myBookings: () => request("/bookings/my"),
  support: (body) => request("/support", { method: "POST", body }),
  updateProfile: (body) => request("/auth/me", { method: "PATCH", body }),
  changePassword: (body) => request("/auth/change-password", { method: "POST", body }),
  favorites: () => request("/favorites"),
  favoriteIds: () => request("/favorites/ids"),
  addFavorite: (id) => request(`/favorites/${encodeURIComponent(id)}`, { method: "POST" }),
  removeFavorite: (id) => request(`/favorites/${encodeURIComponent(id)}`, { method: "DELETE" }),
};