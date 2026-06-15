// frontend/src/utils/constants.js

export const TOKEN_KEY = "banto__o_token";
export const USER_KEY = "banto__o_user";

// Root backend (uploads, static files) — tanpa /api/v1
export const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

// Backend base URL
// - Prefer env: VITE_API_BASE_URL
// - Fallback default local dev (sesuaikan jika backend pakai port lain)
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || `${BACKEND_URL}/api/v1`;

