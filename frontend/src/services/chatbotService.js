import apiClient from "./ApiClient";

/**
 * ChatbotService
 * Mengelola komunikasi dengan AI chatbot BantO__O.
 */
class ChatbotService {
  constructor(client) {
    this.client = client;
    this.baseURL = "/chatbot";
  }

  /**
   * Kirim pertanyaan ke chatbot dan dapatkan jawaban.
   * @param {string} tanya - Pertanyaan dari user
   * @returns {Promise} respons dari chatbot
   */
  ask(tanya) {
    return this.client.post(this.baseURL, { tanya });
  }
}

// Export sebagai singleton
const chatbotService = new ChatbotService(apiClient);
export default chatbotService;