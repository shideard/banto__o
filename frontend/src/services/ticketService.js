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

// Buat tiket: backend mengharapkan tipe skema TiketCreate.
// Jika backend belum support multipart upload, maka kirim hanya field JSON.
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

