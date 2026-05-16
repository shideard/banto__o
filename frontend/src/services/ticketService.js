import api from "./api";

export async function listKategori() {
  return api.get("/kategori");
}
export async function listTiket() {
  return api.get("/tiket");
}
export async function getTiketById(tiketId) {
  return api.get(`/tiket/${tiketId}`);
}
export async function createTiket(payload) {
  return api.post("/tiket", payload);
}
export async function claimTiket(tiketId, payload) {
  return api.post(`/tiket/${tiketId}/klaim`, payload);
}
export async function updateTiketStatus(tiketId, payload) {
  return api.patch(`/tiket/${tiketId}/status`, payload);
}
export async function addKomentar(tiketId, payload) {
  return api.post(`/tiket/${tiketId}/komentar`, payload);
}

// ── Chat Session ──────────────────────────────────────────────────────────────
export async function getChatSessions() {
  return api.get("/chat/sessions");
}
export async function createChatSession(title = "Percakapan Baru") {
  return api.post("/chat/sessions", { title });
}
export async function sendChatMessage(sessionId, text) {
  return api.post(`/chat/sessions/${sessionId}/messages`, { text, type: "user" });
}
export async function deleteChatSession(sessionId) {
  return api.delete(`/chat/sessions/${sessionId}`);
}