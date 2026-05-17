// frontend/src/services/AuthService.js
import apiClient from "./ApiClient";

class AuthService {
  async login(email, password) {
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    const res = await apiClient.post("/auth/login", formData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    return res.data;
  }

  async registerMahasiswa({ nama, email, password, nim }) {
    const res = await apiClient.post("/auth/register", {
      nama,
      email,
      password,
      nim,
      role: "mahasiswa",
    });
    return res.data;
  }
}

const authService = new AuthService();
export default authService;