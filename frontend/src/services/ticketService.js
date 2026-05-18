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

  async getTicketById(tiketId) {
    const res = await apiClient.get(`/tiket/${tiketId}`);
    return res.data;
  }

  async createTicket(payload) {
    const res = await apiClient.post("/tiket", payload);
    return res.data;
  }

  async addKomentar(tiketId, isi) {
    const res = await apiClient.post(`/tiket/${tiketId}/komentar`, { isi });
    return res.data;
  }
}

const ticketService = new TicketService();
export default ticketService;