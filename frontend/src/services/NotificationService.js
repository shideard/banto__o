// frontend/src/services/NotificationService.js
import apiClient from './ApiClient';

const BASE = '/notifikasi';

const NotificationService = {
  /** Ambil semua notifikasi milik user yang sedang login */
  getAll: () => apiClient.get(BASE).then(r => r.data),

  /** Jumlah notifikasi belum dibaca */
  getUnreadCount: () => apiClient.get(`${BASE}/unread-count`).then(r => r.data),

  /** Tandai satu notifikasi sebagai dibaca */
  markRead: (id) => apiClient.patch(`${BASE}/${id}/baca`).then(r => r.data),

  /** Tandai semua notifikasi user sebagai dibaca */
  markAllRead: () => apiClient.patch(`${BASE}/baca-semua`).then(r => r.data),

  /** Hapus satu notifikasi */
  delete: (id) => apiClient.delete(`${BASE}/${id}`).then(r => r.data),
};

export default NotificationService;
