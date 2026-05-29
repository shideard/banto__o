// frontend/src/pages/mahasiswa/DashboardPage.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { TOKEN_KEY } from "../../utils/constants";
import ticketService from "../../services/ticketService";
import AppIcon from "../../components/ui/AppIcon";

const styles = `
  .db-main {
    padding: 32px 40px;
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
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

  .bt-alert { max-width: 1200px; margin: -20px auto 0; padding: 0 40px; position: relative; z-index: 2; }
  .bt-alert-inner { background: #fffbeb; border: 1.5px solid #fcd34d; border-radius: 12px; padding: 12px 16px; display: flex; align-items: flex-start; gap: 10px; font-size: 13px; color: #92400e; line-height: 1.6; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }

  .table-card {
    background: var(--white);
    border: 1.5px solid var(--gray-200);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0,0,0,0.02);
  }

  .table-scroll-wrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .table-scroll-wrapper table {
    min-width: 560px;
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
    text-decoration: none;
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

export default function DashboardPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);

  const getStatusClass = (status) => {
    const s = String(status || "").toLowerCase();
    switch (s) {
      case "diproses": return "pill-diproses";
      case "dibuka":   return "pill-dibuka";
      case "selesai":  return "pill-selesai";
      case "ditutup":  return "pill-ditutup";
      default:         return "pill-ditutup";
    }
  };

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;

    ticketService.getMyTickets()
      .then(data => setTickets(data))
      .catch(() => setTickets([]));
  }, []);

  const stats = {
    total:    tickets.length,
    diproses: tickets.filter(t => String(t?.status).toLowerCase() === "diproses").length,
    selesai:  tickets.filter(t => String(t?.status).toLowerCase() === "selesai").length,
  };

  return (
    <>
      <style>{styles}</style>
      <main className="db-main">
        <div className="db-breadcrumb">
          Beranda <span>›</span> Dashboard
        </div>

        <div className="db-header">
          <h1>Halo, {user?.nama || ""}!</h1>
          <p>Selamat datang kembali. Berikut ringkasan tiket kamu.</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-title">Total Tiket</div>
            <div className="stat-value">{stats.total}</div>
            <div className="stat-desc success">—</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Diproses</div>
            <div className="stat-value">{stats.diproses}</div>
            <div className="stat-desc warning">Menunggu balasan</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Selesai</div>
            <div className="stat-value">{stats.selesai}</div>
            <div className="stat-desc" style={{ color: "var(--gray-400)" }}>—</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Avg. Respons</div>
            <div className="stat-value">—</div>
            <div className="stat-desc" style={{ color: "var(--gray-400)" }}>—</div>
          </div>
        </div>

        <div className="bt-alert">
          <div className="bt-alert-inner">
            <span><AppIcon name="AlertTriangle" variant="sm" /></span>
            <span>Tiket yang tidak ada tanggapan dalam <strong>3 hari kerja</strong> akan ditutup otomatis.</span>
          </div>
        </div>

        <div className="table-card">
          <div className="table-header">
            <h2>Tiket Terbaru</h2>
            <Link to="/tiket/saya" className="btn-outline">Lihat Semua</Link>
          </div>
          <div className="table-scroll-wrapper">
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
              {tickets.length > 0 ? (
                tickets.slice(0, 4).map((ticket, idx) => (
                  <tr key={idx}>
                    <td className="td-id">{ticket.id}</td>
                    <td className="td-subjek">
                      <p>{ticket.subjek}</p>
                      <span>{String(ticket.kategori_id || "").split(" & ")[0]}</span>
                    </td>
                    <td style={{ color: "var(--gray-500)", fontSize: "13px" }}>{ticket.kategori_id || "—"}</td>
                    <td>
                      <span className={`status-pill ${getStatusClass(ticket.status)}`}>{ticket.status}</span>
                    </td>
                    <td className="td-date">
                      {ticket.tanggal_dibuat ? new Date(ticket.tanggal_dibuat).toLocaleDateString("id-ID") : "—"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "32px", color: "var(--gray-400)" }}>
                    Belum ada tiket yang dibuat.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>
      </main>
    </>
  );
}