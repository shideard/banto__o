import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import AppNavbar from "../../components/layout/AppNavbar";
import { useAuth } from "../../hooks/useAuth";

const styles = `
  :root {
    --ipb-blue-dark:  #0a1f5c;
    --ipb-blue:       #1a4fad;
    --ipb-blue-mid:   #2563eb;
    --ipb-sky:        #0ea5e9;
    --white:          #ffffff;
    --off-white:      #f9fafb;
    --gray-50:        #f1f5f9;
    --gray-200:       #e2e8f0;
    --gray-300:       #cbd5e1;
    --gray-400:       #94a3b8;
    --gray-500:       #64748b;
    --gray-700:       #334155;
    --gray-900:       #0f172a;
    --warning-bg:     #fffbeb;
    --warning-text:   #92400e;
    --warning-border: #fcd34d;
  }

  .ts-page {
    min-height: 100vh;
    background: var(--off-white);
    font-family: 'Plus Jakarta Sans', sans-serif;
    display: flex;
    flex-direction: column;
  }

  .ts-main {
    flex: 1;
    padding: 32px 40px;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }

  .ts-breadcrumb {
    font-size: 13px;
    color: var(--gray-500);
    margin-bottom: 16px;
  }
  .ts-breadcrumb span { margin: 0 8px; }

  .ts-header-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;
  }

  .ts-header-text h1 {
    font-family: 'Fraunces', serif;
    font-size: 32px;
    font-weight: 800;
    color: var(--gray-900);
    margin-bottom: 8px;
  }
  .ts-header-text p {
    font-size: 14px;
    color: var(--gray-500);
  }

  .btn-primary {
    background: var(--ipb-blue-mid);
    color: var(--white);
    padding: 10px 20px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    font-size: 14px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: background 0.2s;
  }
  .btn-primary:hover { background: var(--ipb-blue); }

  .ts-alert {
    background: var(--warning-bg);
    border: 1.5px solid var(--warning-border);
    border-radius: 12px;
    padding: 14px 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 13px;
    color: var(--warning-text);
    margin-bottom: 24px;
  }

  .ts-controls {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
  }

  .search-wrap {
    position: relative;
  }
  .search-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--gray-400);
  }
  .search-input {
    width: 280px;
    padding: 10px 14px 10px 38px;
    border: 1.5px solid var(--gray-200);
    border-radius: 10px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;
  }
  .search-input:focus { border-color: var(--ipb-blue-lite); }

  .tabs {
    display: flex;
    background: var(--gray-200);
    border-radius: 10px;
    padding: 4px;
    gap: 4px;
  }
  .tab-btn {
    padding: 8px 16px;
    border: none;
    background: transparent;
    border-radius: 6px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: var(--gray-500);
    cursor: pointer;
    transition: all 0.2s;
  }
  .tab-btn.active {
    background: var(--white);
    color: var(--gray-900);
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  /* Table Styles with Scroll */
  .table-container {
    background: var(--white);
    border: 1.5px solid var(--gray-200);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0,0,0,0.02);
  }

  .table-scroll-area {
    max-height: 500px; /* Batas tinggi tabel sebelum scroll */
    overflow-y: auto;
  }

  /* Custom scrollbar untuk tabel */
  .table-scroll-area::-webkit-scrollbar { width: 6px; }
  .table-scroll-area::-webkit-scrollbar-track { background: var(--gray-50); }
  .table-scroll-area::-webkit-scrollbar-thumb { background: var(--gray-300); border-radius: 10px; }

  table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
  }
  
  /* Sticky Header supaya judul kolom tidak ikut ke-scroll */
  thead th {
    position: sticky;
    top: 0;
    z-index: 1;
    padding: 16px 24px;
    font-size: 11px;
    font-weight: 700;
    color: var(--gray-500);
    background: var(--gray-50);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1.5px solid var(--gray-200);
  }

  tbody tr {
    border-bottom: 1px solid var(--gray-200);
    cursor: pointer;
    transition: background 0.2s;
  }
  tbody tr:hover { background: var(--off-white); }
  tbody tr:last-child { border-bottom: none; }

  td {
    padding: 16px 24px;
    font-size: 14px;
    color: var(--gray-900);
    vertical-align: middle;
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
  .status-pill::before { content: ''; width: 6px; height: 6px; border-radius: 50%; }
  
  .pill-diproses { background: #fff7ed; color: #c2410c; }
  .pill-diproses::before { background: #ea580c; }
  .pill-dibuka { background: #eff6ff; color: #1d4ed8; }
  .pill-dibuka::before { background: #2563eb; }
  .pill-selesai { background: #f0fdf4; color: #15803d; }
  .pill-selesai::before { background: #16a34a; }
  .pill-ditutup { background: #f1f5f9; color: #475569; }
  .pill-ditutup::before { background: #64748b; }

  /* Modal Styles */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.6);
    backdrop-filter: blur(4px);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    animation: fadeInModal 0.2s forwards;
  }
  @keyframes fadeInModal { to { opacity: 1; } }

  .modal-content {
    background: var(--white);
    width: 600px;
    max-width: 90vw;
    border-radius: 20px;
    padding: 32px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    transform: translateY(20px);
    animation: slideUpModal 0.3s ease forwards;
  }
  @keyframes slideUpModal { to { transform: translateY(0); } }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--gray-200);
  }
  .modal-title-group h2 { font-size: 20px; color: var(--gray-900); margin-bottom: 8px; }
  .modal-close {
    background: var(--gray-100);
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 16px;
    color: var(--gray-500);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }
  .modal-close:hover { background: var(--gray-200); color: var(--gray-900); }

  .detail-group { margin-bottom: 20px; }
  .detail-label { font-size: 12px; font-weight: 700; color: var(--gray-400); text-transform: uppercase; margin-bottom: 6px; }
  .detail-value { font-size: 14px; color: var(--gray-800); line-height: 1.6; }
  .detail-desc-box {
    background: var(--gray-50);
    padding: 16px;
    border-radius: 12px;
    border: 1px solid var(--gray-200);
    font-size: 14px;
    color: var(--gray-700);
    line-height: 1.6;
    white-space: pre-wrap;
  }
`;

// Data dummy yang diperbanyak agar tabel bisa di-scroll
const MOCK_TICKETS = [
  { id: "#0028", subjek: "Kendala Login SSO", kategori: "Administrasi Umum", status: "Dibuka", waktu: "Baru saja", deskripsi: "Saya tidak bisa login menggunakan SSO IPB sejak pagi ini. Keterangannya selalu password salah padahal sudah direset." },
  { id: "#0027", subjek: "Pengajuan Cuti Akademik", kategori: "Akademik & Kurikulum", status: "Diproses", waktu: "2 jam lalu", deskripsi: "Saya ingin mengajukan cuti akademik untuk semester depan karena alasan kesehatan. Dokumen medis sudah saya lampirkan." },
  { id: "#0026", subjek: "Sertifikat Lomba Belum Keluar", kategori: "Kemahasiswaan", status: "Diproses", waktu: "Kemarin", deskripsi: "Sertifikat juara 1 lomba esai nasional bulan lalu belum saya terima di portal kemahasiswaan." },
  { id: "#0025", subjek: "Permintaan Transkrip Nilai", kategori: "Administrasi Umum", status: "Selesai", waktu: "2 hari lalu", deskripsi: "Mohon diterbitkan transkrip nilai resmi untuk keperluan pendaftaran beasiswa." },
  { id: "#0024", subjek: "Jadwal Ujian Bentrok", kategori: "Akademik & Kurikulum", status: "Selesai", waktu: "3 hari lalu", deskripsi: "Jadwal ujian mata kuliah A dan B di KRS saya bentrok pada hari Selasa jam 10 pagi." },
  { id: "#0023", subjek: "Permohonan perbaikan nilai semester 5", kategori: "Akademik & Kurikulum", status: "Diproses", waktu: "4 hari lalu", deskripsi: "Mohon izin melakukan perbaikan nilai untuk mata kuliah Jaringan Komputer karena ada kesalahan rekap nilai tugas akhir." },
  { id: "#0021", subjek: "Informasi beasiswa Peningkatan Prestasi", kategori: "Keuangan & Beasiswa", status: "Dibuka", waktu: "1 minggu lalu", deskripsi: "Saya ingin bertanya apakah beasiswa PPA tahun ini kuotanya ditambah?" },
  { id: "#0019", subjek: "Hujan Gerimis", kategori: "Lainnya", status: "Selesai", waktu: "2 minggu lalu", deskripsi: "Tes fitur tiket saja." },
  { id: "#0017", subjek: "Kicaw", kategori: "Lainnya", status: "Ditutup", waktu: "1 bulan lalu", deskripsi: "Sistem error saat upload Kicaw." },
];

export default function TiketSayaPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Semua");
  const [selectedTicket, setSelectedTicket] = useState(null); // State untuk modal

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "diproses": return "pill-diproses";
      case "dibuka": return "pill-dibuka";
      case "selesai": return "pill-selesai";
      case "ditutup": return "pill-ditutup";
      default: return "pill-ditutup";
    }
  };

  // Filter Data Tiket
  const filteredTickets = useMemo(() => {
    return MOCK_TICKETS.filter(ticket => {
      const matchSearch = ticket.subjek.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchTab = activeTab === "Semua" || ticket.status === activeTab;
      return matchSearch && matchTab;
    });
  }, [searchTerm, activeTab]);

  return (
    <>
      <style>{styles}</style>
      <div className="ts-page">
        <AppNavbar activePath="/tiket/saya" user={user || { name: "Mut" }} />

        <main className="ts-main">
          <div className="ts-breadcrumb">
            <Link to="/dashboard" style={{color: 'inherit', textDecoration: 'none'}}>Dashboard</Link> 
            <span>›</span> Tiket Saya
          </div>

          <div className="ts-header-row">
            <div className="ts-header-text">
              <h1>Tiket Saya</h1>
              <p>Kelola dan pantau semua tiket yang pernah kamu buat.</p>
            </div>
            <Link to="/tiket/buat" className="btn-primary">
              + Buat Tiket
            </Link>
          </div>

          <div className="ts-alert">
            <span>⚠️</span>
            <span>Pastikan kamu mengecek kembali tiket secara rutin untuk melihat tanggapan dari staff. Tiket yang tidak ada tanggapan dalam <strong>3 hari kerja</strong> akan ditutup otomatis.</span>
          </div>

          <div className="ts-controls">
            <div className="search-wrap">
              <span className="search-icon">🔍</span>
              <input 
                type="text" 
                className="search-input" 
                placeholder="Cari ID atau subjek tiket..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="tabs">
              {["Semua", "Dibuka", "Diproses", "Selesai", "Ditutup"].map(tab => (
                <button 
                  key={tab}
                  className={`tab-btn ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "Semua" ? `Semua (${MOCK_TICKETS.length})` : tab}
                </button>
              ))}
            </div>
          </div>

          {/* Area Tabel dengan Scroll */}
          <div className="table-container">
            <div className="table-scroll-area">
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
                  {filteredTickets.length > 0 ? (
                    filteredTickets.map((ticket, idx) => (
                      <tr key={idx} onClick={() => setSelectedTicket(ticket)}>
                        <td className="td-id">{ticket.id}</td>
                        <td className="td-subjek">
                          <p>{ticket.subjek}</p>
                        </td>
                        <td style={{ color: "var(--gray-500)", fontSize: "13px" }}>{ticket.kategori}</td>
                        <td>
                          <span className={`status-pill ${getStatusClass(ticket.status)}`}>
                            {ticket.status}
                          </span>
                        </td>
                        <td className="td-date">{ticket.waktu}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center", padding: "40px", color: "var(--gray-400)" }}>
                        Tidak ada tiket yang ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        {/* MODAL DETAIL TIKET */}
        {selectedTicket && (
          <div className="modal-overlay" onClick={() => setSelectedTicket(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-title-group">
                  <h2>Detail Tiket {selectedTicket.id}</h2>
                  <span className={`status-pill ${getStatusClass(selectedTicket.status)}`}>
                    {selectedTicket.status}
                  </span>
                </div>
                <button className="modal-close" onClick={() => setSelectedTicket(null)}>✕</button>
              </div>

              <div className="detail-group">
                <div className="detail-label">Subjek</div>
                <div className="detail-value" style={{ fontWeight: 600, fontSize: "16px" }}>
                  {selectedTicket.subjek}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div className="detail-group">
                  <div className="detail-label">Kategori</div>
                  <div className="detail-value">{selectedTicket.kategori}</div>
                </div>
                <div className="detail-group">
                  <div className="detail-label">Waktu Dibuat</div>
                  <div className="detail-value">{selectedTicket.waktu}</div>
                </div>
              </div>

              <div className="detail-group">
                <div className="detail-label">Deskripsi Masalah</div>
                <div className="detail-desc-box">
                  {selectedTicket.deskripsi}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}