import { useState } from "react";
import { TOKEN_KEY, USER_KEY } from "../utils/constants";
import { AuthContext } from "./AuthContextValue";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(USER_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem(TOKEN_KEY) || null;
  });

  const login = async (identifier, password, role) => {
    // MOCK — nanti ganti dengan API call sungguhan
    const data = {
      access_token: "mock-token-123",
      role,
      nama: role === "mahasiswa" ? "Mutia Saniya" : "Staff Admin",
      identifier,
    };
    localStorage.setItem(TOKEN_KEY, data.access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(data));
    setToken(data.access_token);
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}