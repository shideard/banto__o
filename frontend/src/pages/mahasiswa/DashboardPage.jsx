import { Link } from "react-router-dom";
import AppNavbar from "../../components/layout/AppNavbar"; // Asumsi kamu punya ini dari kode sebelumnya
import { useAuth } from "../../hooks/useAuth";

const styles = `
  :root {
    --ipb-blue-dark:  #0a1f5c;
    --ipb-blue:       #1a4fad;
    --ipb-blue-mid:   #2563eb;
    --ipb-sky:        #0ea5e9;
    --white:          #ffffff;
    --off-white:      #f8fafc;
    --gray-50:        #f1f5f9;
    --gray-200:       #e2e8f0;
    --gray-400:       #94a3b8;
    --gray-500:       #64748b;
    --gray-700:       #334155;
    --gray-900:       #0f172a;
    --success:        #10b981;
    --warning-bg:     #fffbeb;
    --warning-text:   #92400e;
    --warning-border: #fcd34d;
  }

  .db-page { 
    min-height: 100vh; 
    background: var(--off-white); 
    font-family: 'Plus Jakarta Sans', sans-serif; 
    display: flex;
    flex-direction: column;
  }

  /* Layout Bawah Navbar */
  .db-layout {
    display: flex;
    flex: 1;
  }

  /* --- SIDEBAR --- */
  .db-sidebar {
    width: 260px;
    background: var(--white);
    border-right: 1.5px solid var(--gray-200);
    padding: 24px 16px;
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
    color: var(--gray-400);
    text-transform: uppercase;
    letter-spacing: 1px;
    padding-left: 12px;
    margin-bottom: 4px;
  }

  .sidebar-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px;
    border-radius: 8px;
    text-decoration: none;
    color: var(--gray-700);
    font-size: 14px;
    font-weight: 600;
    transition: all 0.2s;
  }

  .sidebar-link:hover {
    background: var(--gray-50);
  }

  .sidebar-link.active {
    background: rgba(37,99,235,0.08);
    color: var(--ipb-blue-mid);
  }

  .sidebar-link-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .sidebar-icon {
    font-size: 18px;
    color: var(--gray-500);
  }

  .sidebar-link.active .sidebar-icon {
    color: var(--ipb-blue-mid);
  }

  .badge {
    background: var(--ipb-blue-mid);
    color: var(--white);
    font-size: 11px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 100px;
  }

  /* --- MAIN CONTENT --- */
  .db-main {
    flex: 1;
    padding: 32px 40px;
    max-width: 1200px;
  }

  .db-breadcrumb {
    font-size: 13px;
    color: var(--gray-500);
    margin-bottom: 16px;
  }

  .db-breadcrumb span {
    margin: 0 8px;
  }

  .db-header {
    margin-bottom: 32px;
  }

  .db-header h1 {
    font-family: 'Fraunces', serif;
    font-size: 32px;
    font-weight: 800;
    color: var(--gray-900);
    margin-bottom: 8px;
  }

  .db-header p {
    font-size: 14px;
    color: var(--gray-500);
  }

  /* Cards Grid */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    margin-bottom: 32px;
  }

  .stat-card {
    background: var(--white);
    border: 1.5px solid var(--gray-200);
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.02);
  }

  .stat-title {
    font-size: 11px;
    font-weight: 700;
    color: var(--gray-400);
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-bottom: 12px;
  }

  .stat-value {
    font-family: 'Fraunces', serif;
    font-size: 36px;
    font-weight: 900;
    color: var(--ipb-blue-dark);
    line-height: 1;
    margin-bottom: 12px;
  }

  .stat-desc {
    font-size: 12px;
    font-weight: 600;
  }

  .stat-desc.success { color: var(--success); }
  .stat-desc.warning { color: #d97706; }

  /* Alert */
  .db-alert {
    background: var(--warning-bg);
    border: 1.5px solid var(--warning-border);
    border-radius: 12px;
    padding: 14px 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 13px;
    color: var(--warning-text);
    margin-bottom: 32px;
  }

  /* Table Container */
  .table-card {
    background: var(--white);
    border: 1.5px solid var(--gray-200);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0,0,0,0.02);
  }

  .table-header {
    padding: 20px 24px;
    border-bottom: 1.5px solid var(--gray-200);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .table-header h2 {
    font-size: 16px;
    font-weight: 700;
    color: var(--gray-900);
  }

  .btn-outline {
    padding: 8px 16px;
    border: 1.5px solid var(--gray-200);
    border-radius: 8px;
    background: var(--white);
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: var(--gray-700);
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-outline:hover {
    background: var(--gray-50);
    border-color: var(--gray-400);
  }

  table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
  }

  th {
    padding: 16px 24px;
    font-size: 11px;
    font-weight: 700;
    color: var(--gray-500);
    background: var(--gray-50);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  td {
    padding: 16px 24px;
    font-size: 14px;
    color: var(--gray-900);
    border-bottom: 1.5px solid var(--gray-200);
    vertical-align: middle;
  }

  tr:last-child td {
    border-bottom: none;
  }

  .td-id { font-weight: 700; color: var(--ipb-blue-mid); }
  
  .td-subjek p { font-weight: 600; margin-bottom: 4px; }
  .td-subjek span { font-size: 12px; color: var(--gray-400); }

  .td-date { color: var(--gray-500); font-size: 13px; }

  /* Status Pills */
  .status-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 100px;
    font-size: 12px;
    font-weight: 700;
  }

  .status-pill::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }

  .pill-diproses { background: #fff7ed; color: #c2410c; }
  .pill-diproses::before { background: #ea580c; }

  .pill-dibuka { background: #eff6ff; color: #1d4ed8; }
  .pill-dibuka::before { background: #2563eb; }

  .pill-selesai { background: #f0fdf4; color: #15803d; }
  .pill-selesai::before { background: #16a34a; }

  .pill-ditutup { background: #f1f5f9; color: #475569; }
  .pill-ditutup::before { background: #64748b; }

  @media (max-width: 1024px) {
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
  }
`;

// Mock Data Tiket (Bisa diganti dari API nanti)
const RECENT_TICKETS = [
  { id: "#0023", subjek: "Permohonan perbaikan nilai semester 5", kategori: "Akademik & Kurikulum", status: "Diproses", waktu: "5 menit lalu" },
  { id: "#0021", subjek: "Informasi beasiswa Peningkatan Prestasi Akademik", kategori: "Keuangan & Beasiswa", status: "Dibuka", waktu: "1 jam lalu" },
  { id: "#0019", subjek: "Hujan Gerimis", kategori: "eaaaa", status: "Selesai", waktu: "Kemarin" },
  { id: "#0017", subjek: "Kicaw", kategori: "eaa", status: "Ditutup", waktu: "3 hari lalu" },
];

export default function DashboardPage() {
  const { user } = useAuth();
  
  // Fungsi kecil untuk menentukan style pill status
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "diproses": return "pill-diproses";
      case "dibuka": return "pill-dibuka";
      case "selesai": return "pill-selesai";
      case "ditutup": return "pill-ditutup";
      default: return "pill-ditutup";
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="db-page">
        {/* Asumsi AppNavbar sudah handle header bagian atas seperti di desain */}
        <AppNavbar activePath="/dashboard" user={user || { name: "X" }} />

        <div className="db-layout">
          {/* SIDEBAR */}
          <aside className="db-sidebar">
            <div className="sidebar-section">
              <div className="sidebar-title">Menu</div>
              <Link to="/dashboard" className="sidebar-link active">
                <div className="sidebar-link-left"><span className="sidebar-icon">🏠</span> Dashboard</div>
              </Link>
              <Link to="/tiket/saya" className="sidebar-link">
                <div className="sidebar-link-left"><span className="sidebar-icon">🎫</span> Tiket Saya</div>
                <span className="badge">1</span>
              </Link>
              <Link to="/tiket/buat" className="sidebar-link">
                <div className="sidebar-link-left"><span className="sidebar-icon">➕</span> Buat Tiket</div>
              </Link>
              <Link to="/chatbot" className="sidebar-link">
                <div className="sidebar-link-left"><span className="sidebar-icon">🤖</span> Chatbot</div>
              </Link>
            </div>

            <div className="sidebar-section">
              <div className="sidebar-title">Akun</div>
              <Link to="/profil" className="sidebar-link">
                <div className="sidebar-link-left"><span className="sidebar-icon">👤</span> Profil Saya</div>
              </Link>
              <Link to="/pengaturan" className="sidebar-link">
                <div className="sidebar-link-left"><span className="sidebar-icon">⚙️</span> Pengaturan</div>
              </Link>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main className="db-main">
            <div className="db-breadcrumb">
              Beranda <span>›</span> Dashboard
            </div>

            <div className="db-header">
              {/* Ambil nama user dari context, fallback ke "X" jika kosong */}
              <h1>Halo, {user?.nama || "X"}!</h1>
              <p>Selamat datang kembali. Berikut ringkasan tiket kamu.</p>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-title">Total Tiket</div>
                <div className="stat-value">10</div>
                <div className="stat-desc success">↑ 3 bulan ini</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">Diproses</div>
                <div className="stat-value">1</div>
                <div className="stat-desc warning">Menunggu balasan</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">Selesai</div>
                <div className="stat-value">5</div>
                <div className="stat-desc" style={{ color: "var(--gray-400)" }}>—</div>
              </div>
              <div className="stat-card">
                <div className="stat-title">Avg. Respons</div>
                <div className="stat-value">6j</div>
                <div className="stat-desc" style={{ color: "var(--gray-400)" }}>—</div>
              </div>
            </div>

            <div className="db-alert">
              <span>⚠️</span>
              <span>Pastikan kamu mengecek kembali tiket secara rutin untuk melihat tanggapan dari staff. Tiket yang tidak ada tanggapan dalam <strong>3 hari kerja</strong> akan ditutup otomatis.</span>
            </div>

            <div className="table-card">
              <div className="table-header">
                <h2>Tiket Terbaru</h2>
                <button className="btn-outline">Lihat Semua</button>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Subjek</th>
                    <th>Kategori</th>
                    <th>Status</th>
                    <th>Dibuat</th>
                  </tr>
                </thead>
                <tbody>
                  {RECENT_TICKETS.map((ticket, idx) => (
                    <tr key={idx}>
                      <td className="td-id">{ticket.id}</td>
                      <td className="td-subjek">
                        <p>{ticket.subjek}</p>
                        <span>{ticket.kategori.split(' & ')[0]}</span>
                      </td>
                      <td style={{ color: "var(--gray-500)", fontSize: "13px" }}>{ticket.kategori}</td>
                      <td>
                        <span className={`status-pill ${getStatusClass(ticket.status)}`}>
                          {ticket.status}
                        </span>
                      </td>
                      <td className="td-date">{ticket.waktu}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}