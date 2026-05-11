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

  const login = async (identifier, password, role) => {
    try {
      const formData = new URLSearchParams();
      formData.append("username", identifier);
      formData.append("password", password);

      const response = await api.post("/auth/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      const user = response?.data?.user || {};
      const normalizedRole = user.role || role || "mahasiswa";
      const data = {
        access_token: response.data.access_token,
        role: normalizedRole,
        identifier: user.email || identifier,
        id: user.id,
        nama: user.nama,
        email: user.email,
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

  // --- FUNGSI REGISTER BARU ---
  const register = async (userData) => {
    try {
      // 1. Kirim data registrasi ke API backend
      // Sesuaikan key (nama, username/email, password) dengan yang diminta backend FastAPI kamu
      await api.post("/auth/register", {
        nama: userData.nama,
        email: userData.identifier,
        password: userData.password,
      });

      // 2. AUTO-LOGIN: Jika register sukses, langsung panggil fungsi login di atas
      // Agar state `user` dan `token` langsung terisi
      const loginData = await login(userData.identifier, userData.password, userData.role || "mahasiswa");
      
      // 3. Kembalikan data login agar if (data) di RegisterPage terpenuhi
      return loginData;
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
    // --- JANGAN LUPA TAMBAHKAN `register` DI PROVIDER VALUE ---
    <AuthContext.Provider value={{ user, token, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}