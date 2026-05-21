import { createContext, useContext, useState, useCallback } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getToken, getStoredUser, setSession, clearSession } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getToken());
  const [user, setUser] = useState(() => getStoredUser());

  const login = useCallback((newToken, newUser) => {
    setSession(newToken, newUser);
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((newUser) => {
    setUser(newUser);
    const t = getToken();
    if (t) setSession(t, newUser);
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, user, isAuthenticated: !!token, login, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return <Outlet />;
}
