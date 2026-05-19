// frontend/src/context/AuthContext.jsx
import { useState } from "react";
import { TOKEN_KEY, USER_KEY } from "../utils/constants";
import { AuthContext } from "./AuthContextValue";
import apiClient from "../services/ApiClient";

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

      const response = await apiClient.post("/auth/login", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      // Di AuthContext.jsx — fungsi login()
      const data = {
        access_token: response.data.access_token,
        role: response.data.role,
        nama: response.data.nama,
        email: response.data.email,
        id: response.data.id,      // ← TAMBAHKAN INI
        nim: response.data.nim,    // ← untuk mahasiswa
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
      await apiClient.post("/auth/register", {
        nama: userData.nama,
        email: userData.email,
        password: userData.password,
        role: userData.role || "mahasiswa",
      });
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