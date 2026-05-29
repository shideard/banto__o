// ============================================================
// Notification.jsx — Komponen dropdown notifikasi premium
// Taruh di: frontend/src/components/layout/Notification.jsx
//
// Fitur:
//  • Dropdown animated dengan daftar notifikasi real-time
//  • Badge unread count
//  • Mark satu / semua sebagai dibaca
//  • Hapus individual
//  • Empty state & loading skeleton
//  • Icon warna berbeda per tipe pesan
//  • Relative time ("5 menit lalu", "2 jam lalu", dst.)
// ============================================================

import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppIcon from '../ui/AppIcon';
import { useNotification } from '../../hooks/useNotification';

// ── Relative time helper ────────────────────────────────────
function relativeTime(waktuStr) {
  const now  = new Date();
  const then = new Date(waktuStr);
  const diff = Math.floor((now - then) / 1000); // detik

  if (diff < 60)    return 'Baru saja';
  if (diff < 3600)  return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  if (diff < 604800)return `${Math.floor(diff / 86400)} hari lalu`;
  return then.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

// ── Tipe notif → icon & warna ───────────────────────────────
function getNotifMeta(pesan = '') {
  const p = pesan.toLowerCase();
  if (p.includes('selesai') || p.includes('resolved')) return { icon: 'CheckCircle2', color: '#16a34a', bg: '#dcfce7' };
  if (p.includes('ditolak') || p.includes('tolak'))    return { icon: 'XCircle',      color: '#dc2626', bg: '#fee2e2' };
  if (p.includes('komentar') || p.includes('balasan')) return { icon: 'MessageCircle', color: '#7c3aed', bg: '#ede9fe' };
  if (p.includes('diproses') || p.includes('proses'))  return { icon: 'RefreshCw',    color: '#ea580c', bg: '#ffedd5' };
  if (p.includes('diklaim') || p.includes('klaim'))    return { icon: 'UserCheck',    color: '#0284c7', bg: '#e0f2fe' };
  return { icon: 'Bell', color: '#2563eb', bg: '#eff6ff' };
}

// ── Skeleton loader ─────────────────────────────────────────
function SkeletonItem() {
  return (
    <div className="notif-skeleton-item">
      <div className="sk sk-icon" />
      <div style={{ flex: 1 }}>
        <div className="sk sk-line sk-long"  />
        <div className="sk sk-line sk-short" />
      </div>
    </div>
  );
}

// ── CSS styles ──────────────────────────────────────────────
const css = `
  /* ── Wrapper ── */
  .notif-wrap { position: relative; }

  /* ── Bell button ── */
  .notif-bell-btn {
    position: relative;
    width: 40px; height: 40px;
    display: flex; align-items: center; justify-content: center;
    border: 1.5px solid var(--color-gray-200);
    border-radius: 10px;
    background: var(--color-white);
    cursor: pointer;
    transition: all 0.18s;
    color: var(--color-gray-500);
  }
  .notif-bell-btn:hover {
    background: var(--color-gray-50);
    border-color: var(--color-brand-light);
    color: var(--color-brand);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(37,99,235,0.1);
  }
  .notif-bell-btn.has-unread {
    border-color: rgba(37,99,235,0.35);
    color: var(--color-brand);
  }

  /* ── Badge ── */
  .notif-badge-pill {
    position: absolute; top: -5px; right: -5px;
    min-width: 18px; height: 18px;
    background: linear-gradient(135deg, #ef4444, #dc2626);
    border: 2.5px solid var(--color-white);
    border-radius: 100px;
    display: flex; align-items: center; justify-content: center;
    font-size: 9.5px; font-weight: 800;
    color: white; padding: 0 4px;
    box-shadow: 0 2px 6px rgba(239,68,68,0.45);
    animation: badgePop 0.25s cubic-bezier(.34,1.56,.64,1) both;
  }
  @keyframes badgePop {
    from { transform: scale(0); opacity: 0; }
    to   { transform: scale(1); opacity: 1; }
  }

  /* ── Dropdown panel ── */
  .notif-panel {
    position: absolute; top: calc(100% + 12px); right: 0;
    width: 360px;
    background: var(--color-white);
    border: 1.5px solid var(--color-gray-200);
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.14), 0 4px 16px rgba(0,0,0,0.06);
    overflow: hidden;
    animation: panelIn 0.22s cubic-bezier(.34,1.2,.64,1) both;
    z-index: 200;
  }
  @keyframes panelIn {
    from { opacity: 0; transform: translateY(-10px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0)     scale(1); }
  }

  /* ── Panel header ── */
  .notif-panel-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 18px 12px;
    border-bottom: 1px solid var(--color-gray-100);
    background: linear-gradient(135deg, rgba(37,99,235,0.03), rgba(14,165,233,0.03));
  }
  .notif-panel-title {
    display: flex; align-items: center; gap: 8px;
  }
  .notif-panel-title h4 {
    font-size: 14px; font-weight: 700;
    color: var(--color-gray-900); margin: 0;
  }
  .notif-count-chip {
    padding: 1px 7px; border-radius: 100px;
    background: linear-gradient(135deg, var(--color-brand-dark), var(--color-brand-sky));
    font-size: 10px; font-weight: 800;
    color: white;
  }
  .notif-panel-actions { display: flex; align-items: center; gap: 8px; }
  .notif-action-btn {
    font-size: 11.5px; font-weight: 600;
    color: var(--color-brand);
    background: none; border: none; cursor: pointer;
    font-family: var(--font-sans);
    padding: 3px 8px; border-radius: 6px;
    transition: background 0.15s;
  }
  .notif-action-btn:hover { background: rgba(37,99,235,0.08); }
  .notif-refresh-btn {
    width: 28px; height: 28px;
    display: flex; align-items: center; justify-content: center;
    border: 1px solid var(--color-gray-200); border-radius: 7px;
    background: none; cursor: pointer;
    color: var(--color-gray-400);
    transition: all 0.18s;
  }
  .notif-refresh-btn:hover { background: var(--color-gray-100); color: var(--color-gray-700); }
  .notif-refresh-btn.spinning svg { animation: spin 0.7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── List ── */
  .notif-list {
    max-height: 340px; overflow-y: auto;
  }
  .notif-list::-webkit-scrollbar { width: 4px; }
  .notif-list::-webkit-scrollbar-thumb { background: var(--color-gray-200); border-radius: 4px; }

  /* ── Item ── */
  .notif-item {
    display: flex; align-items: flex-start; gap: 12px;
    padding: 13px 16px;
    cursor: pointer;
    transition: background 0.15s;
    border-bottom: 1px solid var(--color-gray-100);
    position: relative;
  }
  .notif-item:last-child { border-bottom: none; }
  .notif-item:hover { background: var(--color-gray-50); }
  .notif-item.unread { background: rgba(37,99,235,0.03); }
  .notif-item.unread:hover { background: rgba(37,99,235,0.07); }

  /* ── Item icon ── */
  .notif-item-icon {
    width: 36px; height: 36px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; margin-top: 1px;
  }

  /* ── Item body ── */
  .notif-item-body { flex: 1; min-width: 0; }
  .notif-item-msg {
    font-size: 12.5px; font-weight: 500;
    color: var(--color-gray-700); line-height: 1.5;
    margin-bottom: 4px;
  }
  .notif-item.unread .notif-item-msg { font-weight: 600; color: var(--color-gray-900); }
  .notif-item-foot { display: flex; align-items: center; gap: 6px; }
  .notif-item-time { font-size: 10.5px; color: var(--color-gray-400); font-weight: 500; }
  .notif-unread-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--color-brand);
    flex-shrink: 0;
  }

  /* ── Item delete ── */
  .notif-item-del {
    position: absolute; top: 10px; right: 10px;
    width: 22px; height: 22px;
    display: flex; align-items: center; justify-content: center;
    border: none; background: none; cursor: pointer;
    border-radius: 5px; color: var(--color-gray-300);
    transition: all 0.15s; opacity: 0;
  }
  .notif-item:hover .notif-item-del { opacity: 1; }
  .notif-item-del:hover { background: #fee2e2; color: #dc2626; }

  /* ── Empty state ── */
  .notif-empty {
    display: flex; flex-direction: column; align-items: center;
    padding: 36px 20px; gap: 10px;
  }
  .notif-empty-icon {
    width: 52px; height: 52px; border-radius: 14px;
    background: linear-gradient(135deg, rgba(37,99,235,0.08), rgba(14,165,233,0.12));
    display: flex; align-items: center; justify-content: center;
    color: var(--color-brand);
  }
  .notif-empty p { font-size: 13px; color: var(--color-gray-400); font-weight: 500; margin: 0; text-align: center; }

  /* ── Skeleton ── */
  .notif-skeleton-item {
    display: flex; align-items: center; gap: 12px;
    padding: 13px 16px;
    border-bottom: 1px solid var(--color-gray-100);
  }
  .sk { background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
    border-radius: 6px;
  }
  @keyframes shimmer { to { background-position: -200% 0; } }
  .sk-icon { width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0; }
  .sk-line { height: 10px; margin-bottom: 6px; }
  .sk-long  { width: 80%; }
  .sk-short { width: 50%; margin-bottom: 0; }

  /* ── Footer ── */
  .notif-panel-footer {
    padding: 10px 16px;
    border-top: 1px solid var(--color-gray-100);
    text-align: center;
    background: var(--color-gray-50);
  }
  .notif-footer-link {
    font-size: 12px; font-weight: 600;
    color: var(--color-brand);
    background: none; border: none; cursor: pointer;
    font-family: var(--font-sans);
    transition: color 0.15s;
  }
  .notif-footer-link:hover { color: var(--color-brand-dark); text-decoration: underline; }
`;

// ── Komponen utama ──────────────────────────────────────────
export default function Notification() {
  const { notifs, unreadCount, loading, markRead, markAllRead, deleteNotif, refresh } = useNotification();
  const [open, setOpen]           = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const wrapRef                   = useRef(null);
  const navigate                  = useNavigate();

  // Tutup saat klik di luar
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setTimeout(() => setRefreshing(false), 600);
  };

  const handleItemClick = async (notif) => {
    if (!notif.dibaca) await markRead(notif.id);
    if (notif.tiket_id) {
      setOpen(false);
      navigate(`/tiket/${notif.tiket_id}`);
    }
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    deleteNotif(id);
  };

  return (
    <>
      <style>{css}</style>

      <div className="notif-wrap" ref={wrapRef}>
        {/* Bell button */}
        <button
          id="notif-bell-btn"
          className={`notif-bell-btn ${unreadCount > 0 ? 'has-unread' : ''}`}
          onClick={() => setOpen(v => !v)}
          aria-label={`Notifikasi${unreadCount > 0 ? ` (${unreadCount} belum dibaca)` : ''}`}
        >
          <AppIcon name="Bell" variant="lg" />
          {unreadCount > 0 && (
            <span className="notif-badge-pill" key={unreadCount}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        {/* Dropdown panel */}
        {open && (
          <div className="notif-panel" role="dialog" aria-label="Panel Notifikasi">
            {/* Header */}
            <div className="notif-panel-header">
              <div className="notif-panel-title">
                <h4>Notifikasi</h4>
                {unreadCount > 0 && (
                  <span className="notif-count-chip">{unreadCount} baru</span>
                )}
              </div>
              <div className="notif-panel-actions">
                {unreadCount > 0 && (
                  <button className="notif-action-btn" onClick={markAllRead}>
                    Tandai semua dibaca
                  </button>
                )}
                <button
                  className={`notif-refresh-btn ${refreshing ? 'spinning' : ''}`}
                  onClick={handleRefresh}
                  aria-label="Refresh notifikasi"
                >
                  <AppIcon name="RefreshCw" variant="xs" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="notif-list">
              {loading && notifs.length === 0 ? (
                <>
                  <SkeletonItem />
                  <SkeletonItem />
                  <SkeletonItem />
                </>
              ) : notifs.length === 0 ? (
                <div className="notif-empty">
                  <div className="notif-empty-icon">
                    <AppIcon name="BellOff" variant="xl" />
                  </div>
                  <p>Belum ada notifikasi</p>
                  <p style={{ fontSize: 12, color: 'var(--color-gray-300)' }}>
                    Notifikasi terkait tiket kamu akan muncul di sini
                  </p>
                </div>
              ) : (
                notifs.map(notif => {
                  const meta = getNotifMeta(notif.pesan);
                  return (
                    <div
                      key={notif.id}
                      className={`notif-item ${!notif.dibaca ? 'unread' : ''}`}
                      onClick={() => handleItemClick(notif)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={e => e.key === 'Enter' && handleItemClick(notif)}
                    >
                      {/* Icon */}
                      <div
                        className="notif-item-icon"
                        style={{ background: meta.bg, color: meta.color }}
                      >
                        <AppIcon name={meta.icon} variant="sm" />
                      </div>

                      {/* Body */}
                      <div className="notif-item-body">
                        <div className="notif-item-msg">{notif.pesan}</div>
                        <div className="notif-item-foot">
                          {!notif.dibaca && <span className="notif-unread-dot" />}
                          <span className="notif-item-time">{relativeTime(notif.waktu)}</span>
                        </div>
                      </div>

                      {/* Delete button */}
                      <button
                        className="notif-item-del"
                        onClick={e => handleDelete(e, notif.id)}
                        aria-label="Hapus notifikasi"
                      >
                        <AppIcon name="X" variant="xs" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {notifs.length > 0 && (
              <div className="notif-panel-footer">
                <button className="notif-footer-link" onClick={() => setOpen(false)}>
                  Tutup panel ↑
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
