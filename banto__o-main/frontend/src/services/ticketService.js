// frontend/src/services/TicketService.js
import apiClient from "./ApiClient";

class TicketService {
  async getKategori() {
    const res = await apiClient.get("/kategori");
    return res.data;
  }

  async getMyTickets() {
    const res = await apiClient.get("/tiket");
    return Array.isArray(res.data) ? res.data : [];
  }

  async getAllTiket() {
    // Backend otomatis return semua tiket jika role = staf/admin
    const res = await apiClient.get("/tiket");
    return Array.isArray(res.data) ? res.data : [];
  }

  async getTiketById(tiketId) {
    const res = await apiClient.get(`/tiket/${tiketId}`);
    return res.data;
  }

  async createTicket(payload) {
    const res = await apiClient.post("/tiket", payload);
    return res.data;
  }

  // Staf membuat tiket (sama endpoint, backend akan handle role staf)
  async createTicketByStaf(payload) {
    const res = await apiClient.post("/tiket", payload);
    return res.data;
  }

  async addKomentar(tiketId, isi) {
    const res = await apiClient.post(`/tiket/${tiketId}/komentar`, { isi });
    return res.data;
  }

  async claimTiket(tiketId, payload) {
    const res = await apiClient.post(`/tiket/${tiketId}/klaim`, payload);
    return res.data;
  }

  async updateStatus(tiketId, payload) {
    const res = await apiClient.patch(`/tiket/${tiketId}/status`, payload);
    return res.data;
  }
}

const ticketService = new TicketService();
export default ticketService;