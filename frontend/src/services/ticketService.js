import apiClient from "./ApiClient";

class TicketService {
  constructor() {
    this._allTiketRequest = null;
  }

  async getKategori() {
    const res = await apiClient.get("/kategori");
    return res.data;
  }

  async getMyTickets() {
    const all = await this.getAllTiket();
    return all;
  }

  async getAllTiket() {
    if (this._allTiketRequest) {
      return this._allTiketRequest;
    }

    this._allTiketRequest = apiClient.get("/tiket").then((res) => {
      return Array.isArray(res.data) ? res.data : [];
    }).finally(() => {
      this._allTiketRequest = null;
    });

    return this._allTiketRequest;
  }

  async getUnclaimedTickets() {
    const res = await apiClient.get("/tiket");
    const all = Array.isArray(res.data) ? res.data : [];
    return all.filter(t => !t.staf_id);
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

  async uploadFile(tiketId, file) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await apiClient.post(`/tiket/${tiketId}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  }

  async getRiwayat(tiketId) {
    const res = await apiClient.get(`/tiket/${tiketId}`);
    const tiket = res.data;
    return Array.isArray(tiket.komentar) ? tiket.komentar : [];
  }

  async kirimBalasan(tiketId, payload) {
    const res = await apiClient.post(`/tiket/${tiketId}/komentar`, payload);
    return res.data;
  }
}

const ticketService = new TicketService();
export default ticketService;