// ============================================================
// Toast.jsx — Global toast/snackbar notification system
// Taruh di: frontend/src/components/ui/Toast.jsx
//
// Cara pakai:
//   import { useToast } from '../../hooks/useToast';
//   const toast = useToast();
//   toast.success('Tiket berhasil dibuat!');
//   toast.error('Gagal mengirim tiket.');
//   toast.info('...');
//   toast.warning('...');
// ============================================================

import { createContext, useContext, useState, useCallback, useRef } from 'react';
import AppIcon from './AppIcon';

const ToastContext = createContext(null);

const css = `
  .toast-container {
    position: fixed;
    bottom: 28px;
    right: 28px;
    z-index: 9999;
    display: flex;
    flex-direction: column-reverse;
    gap: 10px;
    pointer-events: none;
  }

  .toast-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 14px 18px;
    border-radius: 14px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.16), 0 2px 8px rgba(0,0,0,0.08);
    min-width: 300px;
    max-width: 420px;
    pointer-events: all;
    position: relative;
    overflow: hidden;
    animation: toastIn 0.35s cubic-bezier(.34,1.35,.64,1) both;
    backdrop-filter: blur(8px);
  }
  .toast-item.toast-exit {
    animation: toastOut 0.28s ease forwards;
  }

  @keyframes toastIn {
    from { opacity: 0; transform: translateX(60px) scale(0.92); }
    to   { opacity: 1; transform: translateX(0)     scale(1); }
  }
  @keyframes toastOut {
    from { opacity: 1; transform: translateX(0) scale(1);    max-height: 200px; margin-bottom: 0; }
    to   { opacity: 0; transform: translateX(60px) scale(0.9); max-height: 0;   margin-bottom: -10px; }
  }

  /* Progress bar */
  .toast-progress {
    position: absolute;
    bottom: 0; left: 0;
    height: 3px;
    border-radius: 0 0 0 14px;
    animation: toastProgress linear forwards;
  }
  @keyframes toastProgress {
    from { width: 100%; }
    to   { width: 0%; }
  }

  /* Types */
  .toast-success {
    background: linear-gradient(135deg, #f0fdf4, #dcfce7);
    border: 1.5px solid #bbf7d0;
    color: #14532d;
  }
  .toast-success .toast-icon-wrap { background: #16a34a; color: white; }
  .toast-success .toast-progress { background: #16a34a; }

  .toast-error {
    background: linear-gradient(135deg, #fef2f2, #fee2e2);
    border: 1.5px solid #fecaca;
    color: #7f1d1d;
  }
  .toast-error .toast-icon-wrap { background: #dc2626; color: white; }
  .toast-error .toast-progress { background: #dc2626; }

  .toast-warning {
    background: linear-gradient(135deg, #fffbeb, #fef9c3);
    border: 1.5px solid #fde68a;
    color: #78350f;
  }
  .toast-warning .toast-icon-wrap { background: #d97706; color: white; }
  .toast-warning .toast-progress { background: #d97706; }

  .toast-info {
    background: linear-gradient(135deg, #eff6ff, #dbeafe);
    border: 1.5px solid #bfdbfe;
    color: #1e3a5f;
  }
  .toast-info .toast-icon-wrap { background: #2563eb; color: white; }
  .toast-info .toast-progress { background: #2563eb; }

  .toast-icon-wrap {
    width: 32px; height: 32px;
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  .toast-body { flex: 1; }
  .toast-title {
    font-size: 13.5px; font-weight: 700;
    line-height: 1.4; margin-bottom: 2px;
    font-family: var(--font-sans);
  }
  .toast-desc {
    font-size: 12px; font-weight: 500;
    line-height: 1.5; opacity: 0.8;
    font-family: var(--font-sans);
  }

  .toast-close {
    background: none; border: none;
    cursor: pointer; opacity: 0.4;
    transition: opacity 0.15s;
    padding: 2px; line-height: 1;
    color: currentColor;
    flex-shrink: 0;
  }
  .toast-close:hover { opacity: 0.9; }
`;

const TYPE_MAP = {
  success: { icon: 'CheckCircle2', label: 'Berhasil' },
  error:   { icon: 'XCircle',      label: 'Kesalahan' },
  warning: { icon: 'AlertTriangle', label: 'Peringatan' },
  info:    { icon: 'Info',          label: 'Informasi' },
};

let _id = 0;
const uid = () => ++_id;

// ── Provider ──────────────────────────────────────────────────
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const remove = useCallback((id) => {
    // First add exit class, then remove after animation
    setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }, 280);
  }, []);

  const show = useCallback((type, message, description, duration = 4500) => {
    const id = uid();
    setToasts(prev => [...prev, { id, type, message, description, duration, exiting: false }]);
    timers.current[id] = setTimeout(() => remove(id), duration);
    return id;
  }, [remove]);

  const toast = {
    success: (msg, desc, dur) => show('success', msg, desc, dur),
    error:   (msg, desc, dur) => show('error',   msg, desc, dur),
    warning: (msg, desc, dur) => show('warning', msg, desc, dur),
    info:    (msg, desc, dur) => show('info',    msg, desc, dur),
  };

  return (
    <ToastContext.Provider value={toast}>
      <style>{css}</style>
      {children}
      <div className="toast-container" aria-live="polite" aria-label="Notifikasi sistem">
        {toasts.map(t => {
          const meta = TYPE_MAP[t.type] || TYPE_MAP.info;
          return (
            <div
              key={t.id}
              className={`toast-item toast-${t.type}${t.exiting ? ' toast-exit' : ''}`}
              role="alert"
            >
              <div className="toast-icon-wrap">
                <AppIcon name={meta.icon} variant="sm" />
              </div>
              <div className="toast-body">
                <div className="toast-title">{t.message}</div>
                {t.description && <div className="toast-desc">{t.description}</div>}
              </div>
              <button className="toast-close" onClick={() => remove(t.id)} aria-label="Tutup">
                <AppIcon name="X" variant="xs" />
              </button>
              {/* Progress bar */}
              <div
                className="toast-progress"
                style={{ animationDuration: `${t.duration}ms` }}
              />
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast harus dipakai di dalam ToastProvider');
  return ctx;
}
