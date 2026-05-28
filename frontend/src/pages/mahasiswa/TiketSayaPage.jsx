import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import ticketService from "../../services/ticketService";
import AppIcon from "../../components/ui/AppIcon";

const styles = `
  /* --- HANYA MENYIMPAN CSS UNTUK KONTEN UTAMA --- */
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
  .ts-breadcrumb a { color: var(--gray-500); text-decoration: none; transition: color 0.2s; }
  .ts-breadcrumb a:hover { color: var(--gray-900); }
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

  .bt-alert { max-width: 1200px; margin: -20px auto 0; padding: 0 40px; position: relative; z-index: 2; }
  .bt-alert-inner { background: #fffbeb; border: 1.5px solid #fcd34d; border-radius: 12px; padding: 12px 16px; display: flex; align-items: flex-start; gap: 10px; font-size: 13px; color: #92400e; line-height: 1.6; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }

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
    max-height: 500px;
    overflow-y: auto;
  }

  .table-scroll-area::-webkit-scrollbar { width: 6px; }
  .table-scroll-area::-webkit-scrollbar-track { background: var(--gray-50); }
  .table-scroll-area::-webkit-scrollbar-thumb { background: var(--gray-300); border-radius: 10px; }

  table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
  }
  
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
  tbody tr:hover { background: var(--gray-50); }
  tbody tr:last-child { border-bottom: none; }

  td {
    padding: 16px 24px;
    font-size: 14px;
    color: var(--gray-900);
    vertical-align: middle;
  }

  .td-id { font-weight: 700; color: var(--ipb-blue-mid); }
  .td-subjek p { font-weight: 600; margin-bottom: 4px; }
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
    z-index: 1000;
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

export default function TiketSayaPage() {
  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Semua");
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Perbaikan error warning: Cek token di awal sebelum render, lalu set nilai awal state loading
  const hasToken = Boolean(localStorage.getItem("banto_token"));
  const [loading, setLoading] = useState(hasToken);

  useEffect(() => {
    if (!hasToken) return;

    ticketService.getMyTickets()
      .then(data => setTickets(data))
      .catch(() => setTickets([]))
      .finally(() => setLoading(false));
  }, [hasToken]);

  const getStatusClass = (status) => {
    if (!status) return "pill-ditutup";
    switch (status.toLowerCase()) {
      case "diproses": return "pill-diproses";
      case "dibuka": return "pill-dibuka";
      case "selesai": return "pill-selesai";
      case "ditutup": return "pill-ditutup";
      default: return "pill-ditutup";
    }
  };

  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      const matchSearch =
        String(ticket.subjek || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(ticket.id).includes(searchTerm.replace("#", ""));
      const matchTab = activeTab === "Semua" ||
        String(ticket.status).toUpperCase() === activeTab.toUpperCase();
      return matchSearch && matchTab;
    });
  }, [tickets, searchTerm, activeTab]);

  return (
    <>
      <style>{styles}</style>
      
      {/* KONTEN UTAMA - Tanpa Navbar/Footer/Sidebar */}
      <main className="ts-main">
        <div className="ts-breadcrumb">
          <Link to="/dashboard">Dashboard</Link> <span>›</span> Tiket Saya
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

        <div className="bt-alert">
          <div className="bt-alert-inner">
            <span><AppIcon name="AlertTriangle" variant="sm" /></span>
            <span>Pastikan kamu mengecek kembali tiket secara rutin untuk melihat tanggapan dari staff. Tiket yang tidak ada tanggapan dalam <strong>3 hari kerja</strong> akan ditutup otomatis.</span>
          </div>
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
                {tab === "Semua" ? `Semua (${tickets.length})` : tab}
              </button>
            ))}
          </div>
        </div>

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
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center", padding: 40, color: "var(--gray-400)" }}>
                      Memuat tiket...
                    </td>
                  </tr>
                ) : filteredTickets.length > 0 ? (
                  filteredTickets.map((ticket) => (
                    <tr key={ticket.id} onClick={() => setSelectedTicket(ticket)}>
                      <td className="td-id">#{ticket.id}</td>
                      <td className="td-subjek">
                        <p>{ticket.subjek}</p>
                      </td>
                      <td style={{ color: "var(--gray-500)", fontSize: 13 }}>
                        {ticket.kategori_id || "—"}
                      </td>
                      <td>
                        <span className={`status-pill ${getStatusClass(ticket.status)}`}>
                          {ticket.status}
                        </span>
                      </td>
                      <td className="td-date">
                        {ticket.tanggal_dibuat ? new Date(ticket.tanggal_dibuat).toLocaleDateString("id-ID") : "—"}
                      </td>
                      <td onClick={e => e.stopPropagation()}>
                        <Link
                          to={`/tiket/${ticket.id}`}
                          style={{
                            display: "inline-block",
                            padding: "5px 12px",
                            background: "#eff6ff",
                            color: "#2563eb",
                            borderRadius: 6,
                            fontSize: 12,
                            fontWeight: 700,
                            textDecoration: "none",
                            whiteSpace: "nowrap"
                          }}
                        >
                          Lihat Detail →
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center", padding: 40, color: "var(--gray-400)" }}>
                      Tidak ada tiket ditemukan.
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
                <h2>Detail Tiket #{selectedTicket.id}</h2>
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
                <div className="detail-value">{selectedTicket.kategori_id || "—"}</div>
              </div>
              <div className="detail-group">
                <div className="detail-label">Waktu Dibuat</div>
                <div className="detail-value">
                  {selectedTicket.tanggal_dibuat ? new Date(selectedTicket.tanggal_dibuat).toLocaleDateString("id-ID") : "—"}
                </div>
              </div>
            </div>

            <div className="detail-group">
              <div className="detail-label">Deskripsi Masalah</div>
              <div className="detail-desc-box">
                {selectedTicket.deskripsi || "Tidak ada deskripsi yang dilampirkan."}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}