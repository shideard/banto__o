// ============================================================
// StafSidebar.jsx — REFACTORED
// Taruh di: frontend/src/components/layout/StafSidebar.jsx
// ============================================================

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AppIcon from '../ui/AppIcon';

// Sekarang pakai CSS variables yang sama dengan Sidebar.jsx
// — tidak ada lagi duplikasi class .staf-* vs .db-*
const styles = `
  .staf-sidebar {
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

  .staf-sidebar.open  { width: 260px; padding: 24px 16px; opacity: 1; }
  .staf-sidebar.closed { width: 0;    padding: 24px 0;    opacity: 0; border-right: none; }

  /* Re-use class yang SAMA dengan Sidebar.jsx — tidak perlu duplikat */
  .staf-sidebar .sidebar-inner,
  .staf-sidebar .sidebar-section,
  .staf-sidebar .sidebar-title,
  .staf-sidebar .sidebar-link,
  .staf-sidebar .sidebar-link-left,
  .staf-sidebar .sidebar-icon,
  .staf-sidebar .sidebar-badge { /* sudah didefinisikan di Sidebar.jsx */ }

  /* Badge warna orange untuk "Tiket Belum Diklaim" */
  .staf-sidebar .sidebar-badge.orange {
    background: #f97316;
  }

  /* Tombol Keluar */
  .sidebar-btn-danger {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 12px;
    border-radius: var(--radius-md);
    border: none;
    background: none;
    font-family: var(--font-sans);
    font-size: 13.5px;
    font-weight: 600;
    color: var(--color-danger);
    cursor: pointer;
    transition: background 0.15s;
    width: 100%;
    text-align: left;
    white-space: nowrap;
  }
  .sidebar-btn-danger:hover { background: var(--color-danger-bg); }
`;

const STAF_MENU = [
  { to: '/staff/dashboard',     icon: 'LayoutDashboard', label: 'Dashboard' },
  { to: '/staff/tugas-saya',    icon: 'Ticket',          label: 'Tiket Saya',           badge: 1 },
  { to: '/staff/buat-tiket',    icon: 'PlusCircle',      label: 'Buat Tiket' },
  { to: '/staff/antrean-tiket', icon: 'ClipboardList',   label: 'Tiket Belum Diklaim',  badge: null, badgeClass: 'orange' },
];

const STAF_AKUN = [
  { to: '/staff/profil', icon: 'UserCircle', label: 'Profil Saya' },
];

export default function StafSidebar({ isOpen = true }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <>
      <style>{styles}</style>
      <aside className={`staf-sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-inner">

          <div className="sidebar-section">
            <div className="sidebar-title">Menu</div>
            {STAF_MENU.map(({ to, icon, label, badge, badgeClass }) => (
              <Link key={to} to={to} className={`sidebar-link ${pathname === to ? 'active' : ''}`}>
                <div className="sidebar-link-left">
                  <span className="sidebar-icon">
                    <AppIcon name={icon} variant="md" />
                  </span>
                  {label}
                </div>
                {badge != null && (
                  <span className={`sidebar-badge ${badgeClass ?? ''}`}>{badge}</span>
                )}
              </Link>
            ))}
          </div>

          <div className="sidebar-section">
            <div className="sidebar-title">Akun</div>
            {STAF_AKUN.map(({ to, icon, label }) => (
              <Link key={to} to={to} className={`sidebar-link ${pathname === to ? 'active' : ''}`}>
                <div className="sidebar-link-left">
                  <span className="sidebar-icon">
                    <AppIcon name={icon} variant="md" />
                  </span>
                  {label}
                </div>
              </Link>
            ))}

            <button className="sidebar-btn-danger" onClick={handleLogout}>
              <AppIcon name="LogOut" variant="md" />
              Keluar
            </button>
          </div>

        </div>
      </aside>
    </>
  );
}