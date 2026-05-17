import apiClient from "./ApiClient";

/**
 * ChatService
 * Mengelola sesi percakapan dan pesan chat antara user dan sistem.
 */
class ChatService {
  constructor(client) {
    this.client = client;
    this.baseURL = "/chat/sessions";
  }

  /**
   * Ambil semua sesi chat milik user yang sedang login.
   */
  getSessions() {
    return this.client.get(this.baseURL);
  }

  /**
   * Buat sesi chat baru.
   * @param {string} title - Judul sesi, default "Percakapan Baru"
   */
  createSession(title = "Percakapan Baru") {
    return this.client.post(this.baseURL, { title });
  }

  /**
   * Kirim pesan dalam sesi chat tertentu.
   * @param {string|number} sessionId
   * @param {string} text - Isi pesan dari user
   */
  sendMessage(sessionId, text) {
    return this.client.post(`${this.baseURL}/${sessionId}/messages`, {
      text,
      type: "user",
    });
  }

  /**
   * Hapus sesi chat berdasarkan ID.
   * @param {string|number} sessionId
   */
  deleteSession(sessionId) {
    return this.client.delete(`${this.baseURL}/${sessionId}`);
  }
}

// Export sebagai singleton
const chatService = new ChatService(apiClient);
export default chatService;