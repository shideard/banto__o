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
    const res = await apiClient.get("/tiket");
    return Array.isArray(res.data) ? res.data : [];
  }

  async getUnclaimedTickets() {
    const res = await apiClient.get("/tiket/antrean");
    return Array.isArray(res.data) ? res.data : [];
  }

  async getMyTasks() {
    const res = await apiClient.get("/tiket/tugas-saya");
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

  async mulaiProses(tiketId) {
    const res = await apiClient.post(`/tiket/${tiketId}/proses`);
    return res.data;
  }

  async tolakTiket(tiketId, alasan) {
    const res = await apiClient.post(`/tiket/${tiketId}/tolak`, { alasan });
    return res.data;
  }

  async updateStatus(tiketId, payload) {
    const res = await apiClient.patch(`/tiket/${tiketId}/status`, payload);
    return res.data;
  }

   async updateKategori(tiketId, kategoriId) {
    const res = await apiClient.patch(`/tiket/${tiketId}/kategori`, { kategori_id: kategoriId });
    return res.data;
  }

  async uploadFile(tiketId, file, waktu) {
    const formData = new FormData();
    formData.append("file", file);
    if (waktu) {
      formData.append("waktu", waktu);
    }
    const res = await apiClient.post(`/tiket/${tiketId}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  }

  async getRiwayat(tiketId) {
    const tiket = await this.getTiketById(tiketId);
    return tiket.komentar || [];
  }

  async kirimBalasan(tiketId, payload) {
    const res = await apiClient.post(`/tiket/${tiketId}/komentar`, payload);
    return res.data;
  }

  async askChatbot(tanya) {
    const res = await apiClient.post("/chatbot", { tanya });
    return res.data;
  }
}

const ticketService = new TicketService();
export default ticketService;