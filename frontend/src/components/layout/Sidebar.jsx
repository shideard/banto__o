import { Link, useLocation } from "react-router-dom";

const styles = `
  .db-sidebar {
    background: #ffffff;
    border-right: 1.5px solid #e2e8f0;
    display: flex;
    flex-direction: column;
    gap: 32px;
    height: calc(100vh - 70px);
    position: sticky;
    top: 70px;
    flex-shrink: 0;
    
    /* Animasi Buka-Tutup yang mulus */
    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), 
                padding 0.3s cubic-bezier(0.4, 0, 0.2, 1), 
                opacity 0.2s ease;
    overflow: hidden;
  }

  /* State jika sidebar terbuka */
  .db-sidebar.open {
    width: 260px;
    padding: 24px 16px;
    opacity: 1;
  }

  /* State jika sidebar tertutup */
  .db-sidebar.closed {
    width: 0;
    padding: 24px 0;
    opacity: 0;
    border-right: none;
  }

  /* Inner wrapper ini PENTING agar teks tidak berantakan saat sidebar mengecil */
  .sidebar-inner {
    width: 228px; /* Lebar asli (260) dikurangi padding kiri-kanan (32) */
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  .sidebar-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .sidebar-title {
    font-size: 11px;
    font-weight: 700;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 1px;
    padding-left: 12px;
    margin-bottom: 4px;
    white-space: nowrap; /* Mencegah teks turun ke bawah */
  }

  .sidebar-link {
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
    white-space: nowrap; /* Mencegah teks turun ke bawah */
  }

  .sidebar-link:hover {
    background: #f1f5f9;
    color: #2563eb;
  }

  /* Style untuk menu yang aktif */
  .sidebar-link.active {
    background: rgba(37, 99, 235, 0.08);
    color: #2563eb;
  }

  .sidebar-link-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .sidebar-icon {
    font-size: 18px;
    color: #64748b;
    transition: color 0.2s;
  }

  .sidebar-link.active .sidebar-icon {
    color: #2563eb;
  }

  .sidebar-link:hover .sidebar-icon {
    color: #2563eb;
  }

  .badge {
    background: #2563eb;
    color: #ffffff;
    font-size: 11px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 100px;
  }
`;

// TERIMA PROP isOpen DARI App.jsx
export default function Sidebar({ isOpen = true }) {
  const location = useLocation();

  // Fungsi pembantu untuk mengecek apakah path sedang aktif
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{styles}</style>
      {/* Tambahkan class open atau closed berdasarkan prop isOpen */}
      <aside className={`db-sidebar ${isOpen ? "open" : "closed"}`}>
        
        {/* Bungkus semua konten di dalam sidebar-inner */}
        <div className="sidebar-inner">
          
          {/* SECTION: MENU UTAMA */}
          <div className="sidebar-section">
            <div className="sidebar-title">Menu Utama</div>
            
            <Link to="/dashboard" className={`sidebar-link ${isActive("/dashboard") ? "active" : ""}`}>
              <div className="sidebar-link-left">
                <span className="sidebar-icon">🏠</span>
                Dashboard
              </div>
            </Link>

            <Link to="/tiket/saya" className={`sidebar-link ${isActive("/tiket/saya") ? "active" : ""}`}>
              <div className="sidebar-link-left">
                <span className="sidebar-icon">🎫</span>
                Tiket Saya
              </div>
              <span className="badge">1</span>
            </Link>

            <Link to="/tiket/buat" className={`sidebar-link ${isActive("/tiket/buat") ? "active" : ""}`}>
              <div className="sidebar-link-left">
                <span className="sidebar-icon">➕</span>
                Buat Tiket
              </div>
            </Link>

            <Link to="/chatbot" className={`sidebar-link ${isActive("/chatbot") ? "active" : ""}`}>
              <div className="sidebar-link-left">
                <span className="sidebar-icon">🤖</span>
                BantO__O Chat
              </div>
            </Link>
          </div>

          {/* SECTION: AKUN */}
          <div className="sidebar-section">
            <div className="sidebar-title">Akun Pengguna</div>
            
            <Link to="/profil" className={`sidebar-link ${isActive("/profil") ? "active" : ""}`}>
              <div className="sidebar-link-left">
                <span className="sidebar-icon">👤</span>
                Profil Saya
              </div>
            </Link>

            <Link to="/pengaturan" className={`sidebar-link ${isActive("/pengaturan") ? "active" : ""}`}>
              <div className="sidebar-link-left">
                <span className="sidebar-icon">⚙️</span>
                Pengaturan
              </div>
            </Link>
          </div>

        </div>
      </aside>
    </>
  );
}