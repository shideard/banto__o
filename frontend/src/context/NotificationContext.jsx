// frontend/src/context/NotificationContext.jsx
// Global context untuk state notifikasi — polling otomatis setiap 30 detik

import { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import NotificationService from '../services/NotificationService';

export const NotificationContext = createContext(null);

const POLL_INTERVAL = 30_000; // 30 detik

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [notifs, setNotifs]     = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const timerRef                = useRef(null);

  // ── Fetch ──────────────────────────────────────────────────
  const fetchNotifs = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await NotificationService.getAll();
      setNotifs(data);
      setError(null);
    } catch (err) {
      setError(err?.response?.data?.detail || 'Gagal memuat notifikasi');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // ── Polling ────────────────────────────────────────────────
  useEffect(() => {
    if (!user) { setNotifs([]); return; }
    fetchNotifs();
    timerRef.current = setInterval(fetchNotifs, POLL_INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [user, fetchNotifs]);

  // ── Actions ────────────────────────────────────────────────
  const markRead = useCallback(async (id) => {
    try {
      const updated = await NotificationService.markRead(id);
      setNotifs(prev => prev.map(n => n.id === id ? { ...n, dibaca: true } : n));
      return updated;
    } catch { /* silent */ }
  }, []);

  const markAllRead = useCallback(async () => {
    try {
      await NotificationService.markAllRead();
      setNotifs(prev => prev.map(n => ({ ...n, dibaca: true })));
    } catch { /* silent */ }
  }, []);

  const deleteNotif = useCallback(async (id) => {
    try {
      await NotificationService.delete(id);
      setNotifs(prev => prev.filter(n => n.id !== id));
    } catch { /* silent */ }
  }, []);

  const refresh = fetchNotifs;

  // ── Derived ────────────────────────────────────────────────
  const unreadCount = notifs.filter(n => !n.dibaca).length;

  return (
    <NotificationContext.Provider value={{
      notifs,
      unreadCount,
      loading,
      error,
      markRead,
      markAllRead,
      deleteNotif,
      refresh,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}
