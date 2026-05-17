import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import ticketService from "../../services/TicketService";

const styles = `
  .staf-main { padding: 32px 40px; max-width: 1200px; width: 100%; margin: 0 auto; font-family: 'Plus Jakarta Sans', sans-serif; }
  .staf-breadcrumb { font-size: 13px; color: #64748b; margin-bottom: 16px; }
  .staf-breadcrumb span { margin: 0 6px; }
  .staf-breadcrumb a { color: #64748b; text-decoration: none; }
  .staf-breadcrumb a:hover { color: #2563eb; }
  .staf-breadcrumb strong { color: #334155; }
  .staf-page-header { margin-bottom: 24px; }
  .staf-page-header h1 { font-family: 'Fraunces', serif; font-size: 30px; font-weight: 800; color: #0f172a; margin-bottom: 4px; }
  .staf-page-header p { font-size: 14px; color: #64748b; }
  .staf-alert { background: #fffbeb; border: 1.5px solid #fcd34d; border-radius: 12px; padding: 14px 20px; display: flex; align-items: center; gap: 12px; font-size: 13px; color: #92400e; margin-bottom: 28px; }
  .staf-stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 32px; }
  .staf-stat-card { background: #fff; border: 1.5px solid #e2e8f0; border-radius: 16px; padding: 24px; box-shadow: 0 2px 10px rgba(0,0,0,0.02); position: relative; overflow: hidden; }
  .staf-stat-card.warning { border-color: #fed7aa; background: #fff7ed; }
  .staf-stat-title { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 12px; }
  .staf-stat-title.warning-title { color: #ea580c; }
  .staf-stat-value { font-family: 'Fraunces', serif; font-size: 40px; font-weight: 900; color: #0a1f5c; line-height: 1; margin-bottom: 12px; }
  .staf-stat-value.warning-value { color: #ea580c; }
  .staf-stat-sub { font-size: 12px; color: #64748b; font-weight: 500; }
  .staf-stat-sub a { color: #2563eb; font-weight: 700; text-decoration: none; font-size: 12px; }
  .staf-stat-icon { position: absolute; top: 20px; right: 20px; width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
  .staf-stat-icon.blue { background: #eff6ff; }
  .staf-stat-icon.orange { background: #fff7ed; }
  .staf-table-card { background: #fff; border: 1.5px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.02); }
  .staf-table-header { padding: 20px 24px; border-bottom: 1.5px solid #e2e8f0; display: flex; justify-content: space-between; align-items: flex-start; }
  .staf-table-header h2 { font-size: 17px; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
  .staf-table-header p { font-size: 13px; color: #64748b; }
  .staf-table-search { display: flex; align-items: center; gap: 8px; border: 1.5px solid #e2e8f0; border-radius: 8px; padding: 7px 12px; background: #f8fafc; min-width: 200px; }
  .staf-table-search input { border: none; background: transparent; font-size: 13px; color: #334155; outline: none; font-family: 'Plus Jakarta Sans', sans-serif; width: 100%; }
  .staf-table-search input::placeholder { color: #94a3b8; }
  .staf-table-search-row { display: flex; align-items: center; gap: 8px; }
  table.staf-table { width: 100%; border-collapse: collapse; text-align: left; }
  table.staf-table th { padding: 12px 20px; font-size: 11px; font-weight: 700; color: #64748b; background: #f8fafc; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1.5px solid #e2e8f0; }
  table.staf-table td { padding: 14px 20px; font-size: 13.5px; color: #0f172a; border-bottom: 1.5px solid #f1f5f9; vertical-align: middle; }
  table.staf-table tr:last-child td { border-bottom: none; }
  .td-ticket-id { font-weight: 700; color: #2563eb; font-size: 13px; text-decoration: none; }
  .td-ticket-id:hover { text-decoration: underline; }
  .staf-status-pill { display: inline-flex; align-items: center; gap: 6px; padding: 5px 10px; border-radius: 100px; font-size: 12px; font-weight: 600; }
  .pill-DIBUAT   { background: #f0fdf4; color: #15803d; }
  .pill-DIKLAIM  { background: #fefce8; color: #a16207; }
  .pill-DIPROSES { background: #fff7ed; color: #c2410c; }
  .pill-SELESAI  { background: #eff6ff; color: #1d4ed8; }
  .pill-REVISI   { background: #fef2f2; color: #dc2626; }
  .btn-klaim { background: #2563eb; color: #fff; border: none; border-radius: 8px; padding: 7px 14px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.18s; }
  .btn-klaim:hover { background: #1d4ed8; }
  .btn-klaim:disabled { background: #93c5fd; cursor: not-allowed; }
  .btn-detail { background: #fff; color: #334155; border: 1.5px solid #e2e8f0; border-radius: 8px; padding: 7px 14px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.18s; text-decoration: none; display: inline-block; }
  .btn-detail:hover { background: #f1f5f9; }
  .staf-table-footer { padding: 14px 20px; border-top: 1.5px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between; font-size: 13px; color: #64748b; }
  .state-row td { text-align: center; padding: 40px; font-size: 14px; }
`;

export default function StafDashboardPage() {
  const { user } = useAuth();
  const [tickets, setTickets]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [search, setSearch]         = useState("");
  const [klaimingId, setKlaimingId] = useState(null);

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await ticketService.TicketService.listTiket();
      setTickets(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError("Gagal memuat data tiket. Coba refresh halaman.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  const handleKlaim = async (tiketId) => {
    try {
      setKlaimingId(tiketId);
      await ticketService.claimTiket(tiketId, { staf_id: user?.id });
      await fetchTickets();
    } catch (err) {
      alert(err?.response?.data?.detail || "Gagal mengklaim tiket.");
    } finally {
      setKlaimingId(null);
    }
  };

  const belumDiklaim = tickets.filter(t => t.status === "DIBUAT").length;
  const tugasSaya    = tickets.filter(t => t.staf_id === user?.id).length;
  const filtered     = tickets.filter(t =>
    String(t.id).includes(search) ||
    (t.subjek || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{styles}</style>
      <main className="staf-main">
        <div className="staf-breadcrumb">
          <a href="/staff/dashboard">Beranda</a><span>›</span>
          <strong>Dashboard Staf</strong>
        </div>

        <div className="staf-page-header">
          <h1>Halo, {user?.nama?.split(" ")[0] || "Staf"} Administrasi!</h1>
          <p>Selamat bertugas. Berikut ringkasan antrean tiket saat ini.</p>
        </div>

        {belumDiklaim > 0 && (
          <div className="staf-alert">
            ⚠️ Terdapat <strong style={{ margin: "0 4px" }}>{belumDiklaim} tiket</strong>
            yang belum diklaim. Segera tindak lanjuti untuk menjaga performa layanan.
          </div>
        )}

        <div className="staf-stats-grid">
          <div className="staf-stat-card">
            <div className="staf-stat-icon blue">📋</div>
            <div className="staf-stat-title">Tiket Masuk</div>
            <div className="staf-stat-value">{loading ? "—" : tickets.length}</div>
            <div className="staf-stat-sub">Total semua tiket</div>
          </div>
          <div className="staf-stat-card">
            <div className="staf-stat-icon blue">🎫</div>
            <div className="staf-stat-title">Tugas Saya</div>
            <div className="staf-stat-value">{loading ? "—" : tugasSaya}</div>
            <div className="staf-stat-sub">Sedang diproses</div>
          </div>
          <div className="staf-stat-card warning">
            <div className="staf-stat-icon orange">⏰</div>
            <div className="staf-stat-title warning-title">⚠ Belum Diklaim</div>
            <div className="staf-stat-value warning-value">{loading ? "—" : belumDiklaim}</div>
            <div className="staf-stat-sub"><Link to="/staff/antrean-tiket">Lihat Antrean →</Link></div>
          </div>
        </div>

        <div className="staf-table-card">
          <div className="staf-table-header">
            <div>
              <h2>Antrean Tiket Terbaru</h2>
              <p>Daftar tiket yang menunggu untuk diklaim atau sedang diproses.</p>
            </div>
            <div className="staf-table-search-row">
              <div className="staf-table-search">
                <span>🔍</span>
                <input placeholder="Cari ID, Subjek..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>
          </div>

          <table className="staf-table">
            <thead>
              <tr>
                <th>ID Tiket</th><th>Subjek</th><th>Status</th><th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr className="state-row"><td colSpan="4" style={{ color: "#94a3b8" }}>⏳ Memuat data...</td></tr>
              ) : error ? (
                <tr className="state-row"><td colSpan="4" style={{ color: "#dc2626" }}>{error}</td></tr>
              ) : filtered.length === 0 ? (
                <tr className="state-row"><td colSpan="4" style={{ color: "#94a3b8" }}>Tidak ada tiket ditemukan.</td></tr>
              ) : filtered.slice(0, 10).map((t) => (
                <tr key={t.id}>
                  <td><Link to={`/staff/tiket/${t.id}`} className="td-ticket-id">#{t.id}</Link></td>
                  <td>{t.subjek}</td>
                  <td>
                    <span className={`staf-status-pill pill-${t.status}`}>{t.status}</span>
                  </td>
                  <td>
                    {t.status === "DIBUAT" ? (
                      <button className="btn-klaim" disabled={klaimingId === t.id} onClick={() => handleKlaim(t.id)}>
                        {klaimingId === t.id ? "Mengklaim..." : "Klaim Tiket"}
                      </button>
                    ) : (
                      <Link to={`/staff/tiket/${t.id}`} className="btn-detail">Detail</Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="staf-table-footer">
            <span>Menampilkan {Math.min(filtered.length, 10)} dari {filtered.length} tiket</span>
            <Link to="/staff/antrean-tiket" style={{ color: "#2563eb", fontWeight: 600, fontSize: 13, textDecoration: "none" }}>
              Lihat semua →
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}