import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { authService } from "../api/services";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // ignore
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, []);

  useEffect(() => {
    if (token) {
      authService
        .getUser()
        .then((res) => {
          setUser(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
    }
  }, [token, logout]);

  const login = useCallback(async (credentials) => {
    const res = await authService.login(credentials);
    const { access_token, user: userData } = res.data;
    setToken(access_token);
    setUser(userData);
    localStorage.setItem("token", access_token);
    localStorage.setItem("user", JSON.stringify(userData));
    return userData;
  }, []);

  const register = useCallback(async (data) => {
    const res = await authService.register(data);
    const { access_token, user: userData } = res.data;
    setToken(access_token);
    setUser(userData);
    localStorage.setItem("token", access_token);
    localStorage.setItem("user", JSON.stringify(userData));
    return userData;
  }, []);


  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be inside AuthProvider");
  return context;
}
