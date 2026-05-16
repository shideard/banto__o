import { useState } from "react";
import { TOKEN_KEY, USER_KEY } from "../utils/constants";
import { AuthContext } from "./AuthContextValue";
import api from "../services/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(USER_KEY);
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem(TOKEN_KEY) || null;
  });

  const login = async (identifier, password) => {
    try {
      const formData = new URLSearchParams();
      formData.append("username", identifier);
      formData.append("password", password);

      const response = await api.post("/auth/login", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      const data = {
        access_token: response.data.access_token,
        role: response.data.role,
        nama: response.data.nama,
        email: response.data.email,  // ← dari backend, bukan dari input user
      };
      localStorage.setItem(TOKEN_KEY, data.access_token);
      localStorage.setItem(USER_KEY, JSON.stringify(data));
      setToken(data.access_token);
      setUser(data);
      return data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  };

  const register = async (userData) => {
    try {
      await api.post("/auth/register", {
        nama: userData.nama,
        email: userData.email,
        password: userData.password,
        role: userData.role || "mahasiswa",
      });
      // Tidak auto-login, kembalikan signal sukses saja
      return { success: true };
    } catch (error) {
      throw error.response?.data || error.message;
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}