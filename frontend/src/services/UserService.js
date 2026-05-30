import apiClient from "./ApiClient";

class UserService {
  async getProfile() {
    const res = await apiClient.get("/auth/me");
    return res.data;
  }

  async updateProfile(payload) {
    const res = await apiClient.patch("/auth/me", payload);
    return res.data;
  }

  async getNotifikasi() {
    const res = await apiClient.get("/auth/notifikasi");
    return res.data;
  }

  async markNotifRead(notifId) {
    const res = await apiClient.patch(`/auth/notifikasi/${notifId}/baca`);
    return res.data;
  }

  async getDivisi() {
    const res = await apiClient.get("/auth/divisi");
    return res.data;
  }
}

const userService = new UserService();
export default userService;