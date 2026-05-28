// ============================================================
// AppNavbar.jsx — REFACTORED
// Taruh di: frontend/src/components/layout/AppNavbar.jsx
// ============================================================

import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AppIcon from '../ui/AppIcon';
import Notification from './Notification';

// Semua warna → CSS variables dari design-tokens.css
const styles = `
  .app-nav {
    position: sticky; top: 0; z-index: 100;
    font-family: var(--font-sans);
    background: var(--color-white);
    border-bottom: 1.5px solid var(--color-gray-200);
    box-shadow: var(--shadow-sm);
  }

  .app-nav-inner {
    width: 100%; padding: 0 28px; height: 64px;
    display: flex; align-items: center; justify-content: space-between;
  }

  .nav-left-group { display: flex; align-items: center; gap: 16px; }

  .btn-toggle-sidebar {
    background: transparent; border: none;
    color: var(--color-gray-500); cursor: pointer;
    padding: 6px; border-radius: var(--radius-md);
    display: flex; align-items: center; justify-content: center;
    transition: background 0.15s, color 0.15s;
  }
  .btn-toggle-sidebar:hover { background: var(--color-gray-100); color: var(--color-gray-900); }

  .app-nav-brand { display: flex; align-items: center; gap: 10px; text-decoration: none; flex-shrink: 0; }
  .app-nav-brand-logo {
    width: 36px; height: 36px;
    background: linear-gradient(135deg, var(--color-brand-dark), var(--color-brand-sky));
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    box-shadow: var(--shadow-brand); flex-shrink: 0; color: white;
  }
  .brand-uni {
    font-size: 9px; font-weight: 700; letter-spacing: 1.2px;
    text-transform: uppercase; color: var(--color-gray-500);
    display: block; line-height: 1; margin-bottom: 1px;
  }
  .brand-product {
    font-family: var(--font-display); font-size: 15px; font-weight: 700;
    color: var(--color-gray-900); line-height: 1; letter-spacing: -0.2px;
  }

  .app-nav-actions { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }

  .app-btn-new-ticket {
    display: flex; align-items: center; gap: 6px;
    padding: 7px 14px; border: none; border-radius: var(--radius-md);
    background: linear-gradient(135deg, var(--color-brand-dark), var(--color-brand-sky));
    font-family: var(--font-sans); font-size: 12.5px; font-weight: 700;
    color: var(--color-white); cursor: pointer; transition: all 0.18s;
    box-shadow: var(--shadow-brand); white-space: nowrap; text-decoration: none;
  }
  .app-btn-new-ticket:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(37,99,235,0.38); }



  .app-user-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 5px 10px 5px 5px;
    border: 1.5px solid var(--color-gray-200); border-radius: var(--radius-full);
    background: var(--color-white); cursor: pointer; transition: all 0.18s; margin-left: 8px;
  }
  .app-user-btn:hover { background: var(--color-gray-50); border-color: var(--color-brand-light); }
  .user-avatar {
    width: 28px; height: 28px; border-radius: 50%;
    background: linear-gradient(135deg, var(--color-brand-dark), var(--color-brand-sky));
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: var(--color-white); flex-shrink: 0;
  }
  .user-name { font-size: 12.5px; font-weight: 600; color: var(--color-gray-700); white-space: nowrap; max-width: 120px; overflow: hidden; text-overflow: ellipsis; }
  .user-chevron { color: var(--color-gray-400); }

  .user-dropdown {
    position: absolute; top: calc(100% + 10px); right: 0; width: 220px;
    background: var(--color-white); border: 1.5px solid var(--color-gray-200);
    border-radius: var(--radius-lg); box-shadow: var(--shadow-lg);
    overflow: hidden; animation: dropIn 0.18s ease both;
  }
  .user-dropdown-header { padding: 14px 16px; border-bottom: 1px solid var(--color-gray-200); }
  .user-dropdown-name { font-size: 13px; font-weight: 700; color: var(--color-gray-900); margin-bottom: 4px; }
  .user-dropdown-role { font-size: 11px; color: var(--color-gray-500); font-weight: 500; display: flex; align-items: center; gap: 6px; }
  .role-badge { display: inline-block; padding: 1px 6px; border-radius: 4px; font-size: 10px; font-weight: 700; background: rgba(37,99,235,0.1); color: var(--color-brand); text-transform: uppercase; letter-spacing: 0.3px; }
  .user-dropdown-menu { padding: 6px; }
  .user-menu-item {
    display: flex; align-items: center; gap: 9px; width: 100%;
    padding: 9px 10px; border-radius: var(--radius-md);
    background: none; border: none; font-family: var(--font-sans);
    font-size: 13px; font-weight: 500; color: var(--color-gray-700);
    cursor: pointer; text-align: left; transition: background 0.15s;
  }
  .user-menu-item:hover { background: var(--color-gray-100); }
  .user-menu-item.danger { color: var(--color-danger); }
  .user-menu-item.danger:hover { background: var(--color-danger-bg); }
  .user-menu-divider { height: 1px; background: var(--color-gray-200); margin: 4px 6px; }
  .dropdown-wrap { position: relative; }

  @keyframes dropIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }

  @media (max-width: 900px) {
    .user-name { display: none; }
    .app-btn-new-ticket span.btn-label { display: none; }
    .app-btn-new-ticket { padding: 7px 10px; }
  }
`;



export default function AppNavbar({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userOpen, setUserOpen] = useState(false);
  const userRef  = useRef(null);

  const role     = user?.role || 'mahasiswa';
  const initials = (user?.nama || 'U').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  useEffect(() => {
    const handler = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <>
      <style>{styles}</style>
      <nav className="app-nav">
        <div className="app-nav-inner">

          {/* KIRI */}
          <div className="nav-left-group">
            <button className="btn-toggle-sidebar" onClick={onToggleSidebar} aria-label="Toggle sidebar">
              <AppIcon name="Menu" variant="lg" />
            </button>

            <Link className="app-nav-brand" to="/dashboard">
              <div className="app-nav-brand-logo">
                <AppIcon name="GraduationCap" variant="lg" />
              </div>
              <div>
                <span className="brand-uni">IPB University</span>
                <span className="brand-product">Help Center</span>
              </div>
            </Link>
          </div>

          {/* KANAN */}
          <div className="app-nav-actions">
            {role === 'mahasiswa' && (
              <Link className="app-btn-new-ticket" to="/tiket/buat">
                <AppIcon name="Plus" variant="sm" />
                <span className="btn-label">Buat Tiket</span>
              </Link>
            )}

            {/* Notifikasi — gunakan komponen Notification.jsx */}
            <Notification />

            {/* User */}
            <div className="dropdown-wrap" ref={userRef}>
              <button className="app-user-btn" onClick={() => { setUserOpen(!userOpen); }}>
                <div className="user-avatar">{initials}</div>
                <span className="user-name">{(user?.name || user?.nama || 'User').split(' ')[0]}</span>
                <span className="user-chevron"><AppIcon name="ChevronDown" variant="xs" /></span>
              </button>
              {userOpen && (
                <div className="user-dropdown">
                  <div className="user-dropdown-header">
                    <div className="user-dropdown-name">{user?.name || user?.nama}</div>
                    <div className="user-dropdown-role">
                      <span className="role-badge">{role}</span>
                      {user?.email}
                    </div>
                  </div>
                  <div className="user-dropdown-menu">
                    <button className="user-menu-item"><AppIcon name="UserCircle" variant="sm" /> Profil Saya</button>
                    <button className="user-menu-item"><AppIcon name="Settings"   variant="sm" /> Pengaturan</button>
                    <button className="user-menu-item"><AppIcon name="HelpCircle" variant="sm" /> Bantuan</button>
                    <div className="user-menu-divider" />
                    <button className="user-menu-item danger" onClick={handleLogout}>
                      <AppIcon name="LogOut" variant="sm" /> Keluar
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </nav>
    </>
  );
}