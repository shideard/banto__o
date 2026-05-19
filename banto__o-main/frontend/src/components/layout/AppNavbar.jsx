import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const styles = `
  :root {
    --ipb-blue-dark:  #0a1f5c;
    --ipb-blue:       #1a4fad;
    --ipb-blue-mid:   #2563eb;
    --ipb-blue-lite:  #3b82f6;
    --ipb-sky:        #0ea5e9;
    --white:          #ffffff;
    --gray-50:        #f8fafc;
    --gray-100:       #f1f5f9;
    --gray-200:       #e2e8f0;
    --gray-400:       #94a3b8;
    --gray-500:       #64748b;
    --gray-700:       #334155;
    --gray-900:       #0f172a;
  }

  .app-nav { position: sticky; top: 0; z-index: 100; font-family: 'Plus Jakarta Sans', sans-serif; background: var(--white); border-bottom: 1.5px solid var(--gray-200); box-shadow: 0 1px 12px rgba(0,0,0,0.05); }
  
  /* Diubah menjadi justify-content: space-between agar kiri dan kanan terpisah rApiClient */
  .app-nav-inner { width: 100%; padding: 0 28px; height: 64px; display: flex; align-items: center; justify-content: space-between; }

  .nav-left-group { display: flex; align-items: center; gap: 16px; }

  /* Tombol Hamburger Baru */
  .btn-toggle-sidebar { background: transparent; border: none; font-size: 24px; color: var(--gray-500); cursor: pointer; padding: 4px 8px; border-radius: 6px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
  .btn-toggle-sidebar:hover { background: var(--gray-100); color: var(--gray-900); }

  .app-nav-brand { display: flex; align-items: center; gap: 10px; text-decoration: none; flex-shrink: 0; }
  .app-nav-brand-logo { width: 36px; height: 36px; background: linear-gradient(135deg, var(--ipb-blue), var(--ipb-sky)); border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 17px; box-shadow: 0 2px 8px rgba(37,99,235,0.22); flex-shrink: 0; }
  .app-nav-brand-text .brand-uni { font-size: 9px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: var(--gray-500); display: block; line-height: 1; margin-bottom: 1px; }
  .app-nav-brand-text .brand-product { font-family: 'Fraunces', serif; font-size: 15px; font-weight: 700; color: var(--gray-900); line-height: 1; letter-spacing: -0.2px; }

  .app-nav-actions { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
  
  .app-btn-new-ticket { display: flex; align-items: center; gap: 6px; padding: 7px 14px; border: none; border-radius: 8px; background: linear-gradient(135deg, var(--ipb-blue), var(--ipb-sky)); font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12.5px; font-weight: 700; color: var(--white); cursor: pointer; transition: all 0.18s; box-shadow: 0 2px 8px rgba(37,99,235,0.25); white-space: nowrap; text-decoration: none; }
  .app-btn-new-ticket:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(37,99,235,0.38); }

  .app-notif-btn { position: relative; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; border: 1.5px solid var(--gray-200); border-radius: 9px; background: var(--white); cursor: pointer; transition: all 0.18s; font-size: 17px; }
  .app-notif-btn:hover { background: var(--gray-50); border-color: var(--ipb-blue-lite); }
  .notif-badge { position: absolute; top: -4px; right: -4px; min-width: 18px; height: 18px; background: #ef4444; border: 2px solid var(--white); border-radius: 100px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; color: var(--white); padding: 0 4px; }

  .notif-dropdown { position: absolute; top: calc(100% + 10px); right: 0; width: 340px; background: var(--white); border: 1.5px solid var(--gray-200); border-radius: 14px; box-shadow: 0 12px 36px rgba(0,0,0,0.12); overflow: hidden; animation: dropIn 0.18s ease both; }
  .notif-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px 10px; border-bottom: 1px solid var(--gray-200); }
  .notif-header h4 { font-size: 13px; font-weight: 700; color: var(--gray-900); margin: 0; }
  .notif-mark-all { font-size: 11px; font-weight: 600; color: var(--ipb-blue-mid); background: none; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; }
  .notif-list { max-height: 280px; overflow-y: auto; }
  
  /* Scrollbar custom untuk dropdown notif */
  .notif-list::-webkit-scrollbar { width: 4px; }
  .notif-list::-webkit-scrollbar-track { background: transparent; }
  .notif-list::-webkit-scrollbar-thumb { background: var(--gray-200); border-radius: 4px; }

  .notif-item { display: flex; gap: 10px; padding: 12px 16px; cursor: pointer; transition: background 0.15s; border-bottom: 1px solid var(--gray-200); }
  .notif-item:last-child { border-bottom: none; }
  .notif-item:hover { background: var(--gray-50); }
  .notif-item.unread { background: rgba(37,99,235,0.04); }
  .notif-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--ipb-blue-mid); flex-shrink: 0; margin-top: 5px; }
  .notif-dot.read { background: transparent; }
  .notif-item-title { font-size: 12.5px; font-weight: 600; color: var(--gray-900); margin-bottom: 2px; }
  .notif-item-desc { font-size: 11.5px; color: var(--gray-500); line-height: 1.4; }
  .notif-item-time { font-size: 10.5px; color: var(--gray-400); margin-top: 4px; font-weight: 500; }
  .notif-footer { padding: 10px 16px; border-top: 1px solid var(--gray-200); text-align: center; }
  .notif-footer-btn { font-size: 12px; font-weight: 600; color: var(--ipb-blue-mid); background: none; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; }

  .app-user-btn { display: flex; align-items: center; gap: 8px; padding: 5px 10px 5px 5px; border: 1.5px solid var(--gray-200); border-radius: 100px; background: var(--white); cursor: pointer; transition: all 0.18s; margin-left: 8px; }
  .app-user-btn:hover { background: var(--gray-50); border-color: var(--ipb-blue-lite); }
  .user-avatar { width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, var(--ipb-blue), var(--ipb-sky)); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: var(--white); flex-shrink: 0; }
  .user-name { font-size: 12.5px; font-weight: 600; color: var(--gray-700); white-space: nowrap; max-width: 120px; overflow: hidden; text-overflow: ellipsis; }
  .user-chevron { font-size: 9px; color: var(--gray-400); }

  .user-dropdown { position: absolute; top: calc(100% + 10px); right: 0; width: 220px; background: var(--white); border: 1.5px solid var(--gray-200); border-radius: 14px; box-shadow: 0 12px 36px rgba(0,0,0,0.12); overflow: hidden; animation: dropIn 0.18s ease both; }
  .user-dropdown-header { padding: 14px 16px; border-bottom: 1px solid var(--gray-200); }
  .user-dropdown-name { font-size: 13px; font-weight: 700; color: var(--gray-900); margin-bottom: 4px; }
  .user-dropdown-role { font-size: 11px; color: var(--gray-500); font-weight: 500; display: flex; align-items: center; gap: 6px; }
  .role-badge { display: inline-block; padding: 1px 6px; border-radius: 4px; font-size: 10px; font-weight: 700; background: rgba(37,99,235,0.1); color: var(--ipb-blue-mid); text-transform: uppercase; letter-spacing: 0.3px; }
  .user-dropdown-menu { padding: 6px; }
  .user-menu-item { display: flex; align-items: center; gap: 9px; width: 100%; padding: 9px 10px; border-radius: 8px; background: none; border: none; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 500; color: var(--gray-700); cursor: pointer; text-align: left; transition: background 0.15s; }
  .user-menu-item:hover { background: var(--gray-100); }
  .user-menu-item.danger { color: #dc2626; }
  .user-menu-item.danger:hover { background: #fef2f2; }
  .menu-item-icon { font-size: 15px; }
  .user-menu-divider { height: 1px; background: var(--gray-200); margin: 4px 6px; }
  .dropdown-wrap { position: relative; }

  @keyframes dropIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }

  @media (max-width: 900px) {
    .user-name { display: none; }
    .app-btn-new-ticket span:last-child { display: none; }
    .app-btn-new-ticket { padding: 7px 10px; }
  }
`;

const sampleNotifs = [
  {
    id: 1,
    title: "Tiket #0023 Diperbarui",
    desc: "Staff admin telah mengubah status tiket kamu menjadi Diproses.",
    time: "5 menit lalu",
    unread: true,
  },
  {
    id: 2,
    title: "Komentar Baru",
    desc: "Ada balasan baru pada tiket #0021 dari Staf Akademik.",
    time: "1 jam lalu",
    unread: true,
  },
  {
    id: 3,
    title: "Tiket #0019 Selesai",
    desc: "Tiket kamu telah diselesaikan. Beri penilaian layanan.",
    time: "Kemarin",
    unread: false,
  },
];


// TAMBAHKAN onToggleSidebar sebagai prop
export default function AppNavbar({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [notifs, setNotifs] = useState(sampleNotifs);
  const notifRef = useRef(null);
  const userRef  = useRef(null);

  const role = user?.role || "mahasiswa";
  const unreadCount = notifs.filter(n => n.unread).length;
  const initials = (user?.nama || "U").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (userRef.current  && !userRef.current.contains(e.target))  setUserOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markAllRead = () => setNotifs(notifs.map(n => ({ ...n, unread: false })));

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <style>{styles}</style>
      <nav className="app-nav">
        <div className="app-nav-inner">

          {/* BAGIAN KIRI: Tombol Hamburger & Logo */}
          <div className="nav-left-group">
            <button className="btn-toggle-sidebar" onClick={onToggleSidebar}>
              ☰
            </button>

            <Link className="app-nav-brand" to="/dashboard">
              <div className="app-nav-brand-logo">🎓</div>
              <div className="app-nav-brand-text">
                <span className="brand-uni">IPB University</span>
                <span className="brand-product">Help Center</span>
              </div>
            </Link>
          </div>

          {/* BAGIAN TENGAH (app-nav-links) DIHAPUS karena sudah ada Sidebar */}

          {/* BAGIAN KANAN: Tombol Buat Tiket, Notifikasi & Profil */}
          <div className="app-nav-actions">
            {role === "mahasiswa" && (
              <Link className="app-btn-new-ticket" to="/tiket/buat">
                <span>✚</span><span>Buat Tiket</span>
              </Link>
            )}

            <div className="dropdown-wrap" ref={notifRef}>
              <button className="app-notif-btn" onClick={() => { setNotifOpen(!notifOpen); setUserOpen(false); }}>
                🔔
                {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
              </button>
              {notifOpen && (
                <div className="notif-dropdown">
                  <div className="notif-header">
                    <h4>Notifikasi {unreadCount > 0 && `(${unreadCount})`}</h4>
                    {unreadCount > 0 && <button className="notif-mark-all" onClick={markAllRead}>Tandai semua dibaca</button>}
                  </div>
                  <div className="notif-list">
                    {notifs.map(n => (
                      <div key={n.id} className={`notif-item ${n.unread ? "unread" : ""}`}
                        onClick={() => setNotifs(notifs.map(x => x.id === n.id ? {...x, unread: false} : x))}>
                        <div className={`notif-dot ${n.unread ? "" : "read"}`} />
                        <div>
                          <div className="notif-item-title">{n.title}</div>
                          <div className="notif-item-desc">{n.desc}</div>
                          <div className="notif-item-time">{n.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="notif-footer">
                    <button className="notif-footer-btn">Lihat semua notifikasi →</button>
                  </div>
                </div>
              )}
            </div>

            <div className="dropdown-wrap" ref={userRef}>
              <button className="app-user-btn" onClick={() => { setUserOpen(!userOpen); setNotifOpen(false); }}>
                <div className="user-avatar">{initials}</div>
                <span className="user-name">{(user?.name || user?.nama || "User").split(" ")[0]}</span>
                <span className="user-chevron">▾</span>
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
                    <button className="user-menu-item"><span className="menu-item-icon">👤</span> Profil Saya</button>
                    <button className="user-menu-item"><span className="menu-item-icon">⚙️</span> Pengaturan</button>
                    <button className="user-menu-item"><span className="menu-item-icon">❓</span> Bantuan</button>
                    <div className="user-menu-divider" />
                    <button className="user-menu-item danger" onClick={handleLogout}>
                      <span className="menu-item-icon">🚪</span> Keluar
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