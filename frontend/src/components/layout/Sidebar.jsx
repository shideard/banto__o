// ============================================================
// Sidebar.jsx — REFACTORED
// Taruh di: frontend/src/components/layout/Sidebar.jsx
// Ganti file lama sepenuhnya.
// ============================================================

import { Link, useLocation } from 'react-router-dom';
import AppIcon from '../ui/AppIcon';

// Semua warna sekarang pakai CSS variables dari design-tokens.css
const styles = `
  .db-sidebar {
    background: var(--color-white);
    border-right: 1.5px solid var(--color-gray-200);
    display: flex;
    flex-direction: column;
    height: calc(100vh - 70px);
    position: sticky;
    top: 70px;
    flex-shrink: 0;
    transition:
      width   0.3s cubic-bezier(0.4, 0, 0.2, 1),
      padding 0.3s cubic-bezier(0.4, 0, 0.2, 1),
      opacity 0.2s ease;
    overflow: hidden;
  }

  .db-sidebar.open  { width: 260px; padding: 24px 16px; opacity: 1; }
  .db-sidebar.closed { width: 0;    padding: 24px 0;    opacity: 0; border-right: none; }

  .sidebar-inner {
    width: 228px;
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  .sidebar-section {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .sidebar-title {
    font-family: var(--font-sans);
    font-size: 11px;
    font-weight: 700;
    color: var(--color-gray-400);
    text-transform: uppercase;
    letter-spacing: 1px;
    padding: 0 12px;
    margin-bottom: 4px;
    white-space: nowrap;
  }

  .sidebar-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 9px 12px;
    border-radius: var(--radius-md);
    text-decoration: none;
    font-family: var(--font-sans);
    font-size: 13.5px;
    font-weight: 600;
    color: var(--color-gray-700);
    transition: background 0.15s, color 0.15s;
    white-space: nowrap;
    gap: 10px;
  }

  .sidebar-link:hover {
    background: var(--color-gray-100);
    color: var(--color-brand);
  }

  .sidebar-link.active {
    background: rgba(37, 99, 235, 0.08);
    color: var(--color-brand);
  }

  .sidebar-link-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  /* Ikon ikut warna teks induknya secara otomatis (currentColor) */
  .sidebar-link .sidebar-icon { color: var(--color-gray-500); transition: color 0.15s; }
  .sidebar-link:hover .sidebar-icon,
  .sidebar-link.active .sidebar-icon { color: var(--color-brand); }

  .sidebar-badge {
    background: var(--color-brand);
    color: var(--color-white);
    font-family: var(--font-sans);
    font-size: 11px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: var(--radius-full);
    flex-shrink: 0;
  }
`;

// ---- Definisi menu di satu tempat agar mudah diubah ----
const MENU_ITEMS = [
  { to: '/dashboard',  icon: 'LayoutDashboard', label: 'Dashboard' },
  { to: '/tiket/saya', icon: 'Ticket',          label: 'Tiket Saya',    badge: 1 },
  { to: '/tiket/buat', icon: 'PlusCircle',       label: 'Buat Tiket' },
  { to: '/chatbot',    icon: 'Bot',              label: 'BantO__O Chat' },
];

const ACCOUNT_ITEMS = [
  { to: '/profil', icon: 'UserCircle', label: 'Profil Saya' },
];

export default function Sidebar({ isOpen = true }) {
  const { pathname } = useLocation();

  return (
    <>
      <style>{styles}</style>
      <aside className={`db-sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-inner">

          <div className="sidebar-section">
            <div className="sidebar-title">Menu Utama</div>
            {MENU_ITEMS.map(({ to, icon, label, badge }) => (
              <Link key={to} to={to} className={`sidebar-link ${pathname === to ? 'active' : ''}`}>
                <div className="sidebar-link-left">
                  <span className="sidebar-icon">
                    <AppIcon name={icon} variant="md" />
                  </span>
                  {label}
                </div>
                {badge != null && <span className="sidebar-badge">{badge}</span>}
              </Link>
            ))}
          </div>

          <div className="sidebar-section">
            <div className="sidebar-title">Akun Pengguna</div>
            {ACCOUNT_ITEMS.map(({ to, icon, label }) => (
              <Link key={to} to={to} className={`sidebar-link ${pathname === to ? 'active' : ''}`}>
                <div className="sidebar-link-left">
                  <span className="sidebar-icon">
                    <AppIcon name={icon} variant="md" />
                  </span>
                  {label}
                </div>
              </Link>
            ))}
          </div>

        </div>
      </aside>
    </>
  );
}