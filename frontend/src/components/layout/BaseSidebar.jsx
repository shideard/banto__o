import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import AppIcon from "../ui/AppIcon";

const styles = `
  .app-sidebar {
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

  .app-sidebar.open   { width: 260px; padding: 24px 16px; opacity: 1; }
  .app-sidebar.closed { width: 0;     padding: 24px 0;    opacity: 0; border-right: none; }

  .app-sidebar .sidebar-inner {
    width: 228px;
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  .app-sidebar .sidebar-section {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .app-sidebar .sidebar-title {
    font-size: 11px;
    font-weight: 700;
    color: var(--color-gray-400);
    text-transform: uppercase;
    letter-spacing: 1px;
    padding: 0 12px;
    margin-bottom: 4px;
    white-space: nowrap;
  }

  .app-sidebar .sidebar-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 9px 12px;
    border-radius: var(--radius-md);
    text-decoration: none;
    font-size: 13.5px;
    font-weight: 600;
    color: var(--color-gray-700);
    transition: background 0.15s, color 0.15s;
    white-space: nowrap;
    gap: 10px;
  }

  .app-sidebar .sidebar-link:hover  { background: var(--color-gray-100); color: var(--color-brand); }
  .app-sidebar .sidebar-link.active { background: rgba(37, 99, 235, 0.08); color: var(--color-brand); }

  .app-sidebar .sidebar-link-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .app-sidebar .sidebar-icon { color: var(--color-gray-500); transition: color 0.15s; }
  .app-sidebar .sidebar-link:hover .sidebar-icon,
  .app-sidebar .sidebar-link.active .sidebar-icon { color: var(--color-brand); }

  .app-sidebar .sidebar-badge {
    background: var(--color-brand);
    color: var(--color-white);
    font-size: 11px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: var(--radius-full);
    flex-shrink: 0;
  }

  .app-sidebar .sidebar-badge.orange { background: #f97316; }

  .app-sidebar .sidebar-btn-danger {
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
  .app-sidebar .sidebar-btn-danger:hover { background: var(--color-danger-bg); }
`;

export default function BaseSidebar({ isOpen = true, menuItems = [], accountItems = [] }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <style>{styles}</style>
      <aside className={`app-sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="sidebar-inner">
          {/* Menu Section */}
          {menuItems.length > 0 && (
            <div className="sidebar-section">
              <div className="sidebar-title">Menu</div>
              {menuItems.map(({ to, icon, label, badge, badgeClass }) => (
                <Link
                  key={to}
                  to={to}
                  className={`sidebar-link ${pathname === to ? "active" : ""}`}
                >
                  <div className="sidebar-link-left">
                    <span className="sidebar-icon">
                      <AppIcon name={icon} variant="md" />
                    </span>
                    {label}
                  </div>
                  {(badge != null || badgeClass) && (
                    <span className={`sidebar-badge ${badgeClass ?? ""}`}>
                      {badge ?? ""}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}

          {/* Account Section */}
          <div className="sidebar-section">
            <div className="sidebar-title">Akun</div>
            {accountItems.map(({ to, icon, label }) => (
              <Link
                key={to}
                to={to}
                className={`sidebar-link ${pathname === to ? "active" : ""}`}
              >
                <div className="sidebar-link-left">
                  <span className="sidebar-icon">
                    <AppIcon name={icon} variant="md" />
                  </span>
                  {label}
                </div>
              </Link>
            ))}

            <button className="sidebar-btn-danger" onClick={handleLogout}>
              <span className="sidebar-icon" style={{ color: "inherit" }}>
                <AppIcon name="LogOut" variant="md" />
              </span>
              Keluar
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
