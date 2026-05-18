import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const styles = `
  .staf-sidebar {
    background: #ffffff;
    border-right: 1.5px solid #e2e8f0;
    display: flex;
    flex-direction: column;
    gap: 32px;
    height: calc(100vh - 70px);
    position: sticky;
    top: 70px;
    flex-shrink: 0;
    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                padding 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                opacity 0.2s ease;
    overflow: hidden;
  }

  .staf-sidebar.open {
    width: 260px;
    padding: 24px 16px;
    opacity: 1;
  }

  .staf-sidebar.closed {
    width: 0;
    padding: 24px 0;
    opacity: 0;
    border-right: none;
  }

  .staf-sidebar-inner {
    width: 228px;
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  .staf-sidebar-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .staf-sidebar-title {
    font-size: 11px;
    font-weight: 700;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 1px;
    padding-left: 12px;
    margin-bottom: 4px;
    white-space: nowrap;
  }

  .staf-sidebar-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px;
    border-radius: 8px;
    text-decoration: none;
    color: #334155;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.2s;
    white-space: nowrap;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .staf-sidebar-link:hover {
    background: #f1f5f9;
    color: #2563eb;
  }

  .staf-sidebar-link.active {
    background: rgba(37, 99, 235, 0.08);
    color: #2563eb;
  }

  .staf-sidebar-link-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .staf-sidebar-icon {
    font-size: 18px;
    color: #64748b;
    transition: color 0.2s;
  }

  .staf-sidebar-link.active .staf-sidebar-icon,
  .staf-sidebar-link:hover .staf-sidebar-icon {
    color: #2563eb;
  }

  .staf-badge {
    background: #2563eb;
    color: #ffffff;
    font-size: 11px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 100px;
  }

  .staf-badge.warning {
    background: #f97316;
  }

  .staf-sidebar-btn {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 8px;
    border: none;
    background: none;
    color: #334155;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
    font-family: 'Plus Jakarta Sans', sans-serif;
    width: 100%;
    text-align: left;
  }

  .staf-sidebar-btn:hover {
    background: #fef2f2;
    color: #dc2626;
  }
`;

export default function StafSidebar({ isOpen = true }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <style>{styles}</style>
      <aside className={`staf-sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="staf-sidebar-inner">

          {/* MENU */}
          <div className="staf-sidebar-section">
            <div className="staf-sidebar-title">Menu</div>

            <Link to="/staff/dashboard" className={`staf-sidebar-link ${isActive("/staff/dashboard") ? "active" : ""}`}>
              <div className="staf-sidebar-link-left">
                <span className="staf-sidebar-icon">🏠</span>
                Dashboard
              </div>
            </Link>

            <Link to="/staff/tugas-saya" className={`staf-sidebar-link ${isActive("/staff/tugas-saya") ? "active" : ""}`}>
              <div className="staf-sidebar-link-left">
                <span className="staf-sidebar-icon">🎫</span>
                Tiket Saya
              </div>
              <span className="staf-badge">1</span>
            </Link>

            <Link to="/staff/buat-tiket" className={`staf-sidebar-link ${isActive("/staff/buat-tiket") ? "active" : ""}`}>
              <div className="staf-sidebar-link-left">
                <span className="staf-sidebar-icon">➕</span>
                Buat Tiket
              </div>
            </Link>

            <Link to="/staff/antrean-tiket" className={`staf-sidebar-link ${isActive("/staff/antrean-tiket") ? "active" : ""}`}>
              <div className="staf-sidebar-link-left">
                <span className="staf-sidebar-icon">📋</span>
                Tiket Belum Diklaim
              </div>
            </Link>

            <Link to="/staff/chatbot" className={`staf-sidebar-link ${isActive("/staff/chatbot") ? "active" : ""}`}>
              <div className="staf-sidebar-link-left">
                <span className="staf-sidebar-icon">🤖</span>
                Chatbot
              </div>
            </Link>
          </div>

          {/* AKUN */}
          <div className="staf-sidebar-section">
            <div className="staf-sidebar-title">Akun</div>

            <Link to="/staff/profil" className={`staf-sidebar-link ${isActive("/staff/profil") ? "active" : ""}`}>
              <div className="staf-sidebar-link-left">
                <span className="staf-sidebar-icon">👤</span>
                Profil Saya
              </div>
            </Link>

            <button className="staf-sidebar-btn" onClick={handleLogout}>
              <span className="staf-sidebar-icon">🚪</span>
              Keluar
            </button>
          </div>

        </div>
      </aside>
    </>
  );
}