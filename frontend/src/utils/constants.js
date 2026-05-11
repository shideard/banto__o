export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/v1";

export const ROLES = {
  MAHASISWA: "mahasiswa",
  STAFF: "staf",
};

export const TICKET_STATUS = {
  DIBUAT: "DIBUAT",
  DIKLAIM: "DIKLAIM",
  DIPROSES: "DIPROSES",
  REVISI: "REVISI",
  SELESAI: "SELESAI",
};

export const TOKEN_KEY = "banto_token";
export const USER_KEY = "banto_user";