import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import ticketService from "../../services/TicketService";
import AppIcon from "../../components/ui/AppIcon";

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

  .antrean-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
  .antrean-stat { background: #fff; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 20px; display: flex; align-items: center; justify-content: space-between; }
  .antrean-stat .label { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.7px; margin-bottom: 6px; }
  .antrean-stat .value { font-family: 'Fraunces', serif; font-size: 30px; font-weight: 900; color: #0f172a; }
  .antrean-stat-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; }

  .antrean-filter-row { background: #fff; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 16px 20px; margin-bottom: 16px; display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
  .antrean-search { display: flex; align-items: center; gap: 8px; border: 1.5px solid #e2e8f0; border-radius: 8px; padding: 8px 14px; background: #f8fafc; flex: 1; min-width: 200px; }
  .antrean-search input { border: none; background: transparent; font-size: 13px; color: #334155; outline: none; font-family: 'Plus Jakarta Sans', sans-serif; width: 100%; }
  .antrean-search input::placeholder { color: #94a3b8; }
  .antrean-select { border: 1.5px solid #e2e8f0; border-radius: 8px; padding: 8px 14px; font-size: 13px; color: #334155; font-family: 'Plus Jakarta Sans', sans-serif; background: #f8fafc; cursor: pointer; outline: none; min-width: 160px; }

  .antrean-table-card { background: #fff; border: 1.5px solid #e2e8f0; border-radius: 14px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.02); }
  table.antrean-table { width: 100%; border-collapse: collapse; text-align: left; }
  table.antrean-table th { padding: 12px 20px; font-size: 11px; font-weight: 700; color: #64748b; background: #f8fafc; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1.5px solid #e2e8f0; }
  table.antrean-table td { padding: 14px 20px; font-size: 13.5px; color: #0f172a; border-bottom: 1.5px solid #f1f5f9; vertical-align: middle; }
  table.antrean-table tr:last-child td { border-bottom: none; }
  .antrean-ticket-id { font-weight: 700; color: #2563eb; font-size: 13px; text-decoration: none; }
  .antrean-ticket-id:hover { text-decoration: underline; }

  .staf-status-pill { display: inline-flex; align-items: center; gap: 6px; padding: 5px 10px; border-radius: 100px; font-size: 12px; font-weight: 600; }
  .pill-DIBUAT   { background: #f0fdf4; color: #15803d; }
  .pill-DIKLAIM  { background: #fefce8; color: #a16207; }
  .pill-DIPROSES { background: #fff7ed; color: #c2410c; }
  .pill-SELESAI  { background: #eff6ff; color: #1d4ed8; }
  .pill-REVISI   { background: #fef2f2; color: #dc2626; }

  .btn-klaim { background: #2563eb; color: #fff; border: none; border-radius: 8px; padding: 7px 16px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.18s; white-space: nowrap; }
  .btn-klaim:hover { background: #1d4ed8; }
  .btn-klaim:disabled { background: #93c5fd; cursor: not-allowed; }
  .btn-detail { background: #fff; color: #334155; border: 1.5px solid #e2e8f0; border-radius: 8px; padding: 7px 14px; font-size: 13px; font-weight: 600; font-family: 'Plus Jakarta Sans', sans-serif; text-decoration: none; display: inline-block; transition: all 0.18s; }
  .btn-detail:hover { background: #f1f5f9; }

  .antrean-table-footer { padding: 14px 20px; border-top: 1.5px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between; font-size: 13px; color: #64748b; }
  .staf-pagination { display: flex; align-items: center; gap: 4px; }
  .staf-page-btn { width: 32px; height: 32px; border-radius: 8px; border: 1.5px solid #e2e8f0; background: #fff; font-size: 13px; font-weight: 600; color: #334155; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.18s; font-family: 'Plus Jakarta Sans', sans-serif; }
  .staf-page-btn:hover { background: #f1f5f9; }
  .staf-page-btn.active { background: #2563eb; border-color: #2563eb; color: #fff; }
  .state-row td { text-align: center; padding: 40px; font-size: 14px; }
`;

const PAGE_SIZE = 10;

export default function AntreanTiketPage() {
  const { user } = useAuth();
  const [tickets, setTickets]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [search, setSearch]         = useState("");
  const [statusFilter, setStatusFilter] = useState("DIBUAT");
  const [page, setPage]             = useState(1);
  const [klaimingId, setKlaimingId] = useState(null);

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await ticketService.getAllTiket();
      setTickets(Array.isArray(res) ? res : []);
    } catch {
      setError("Gagal memuat antrean tiket.");
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

  const filtered = tickets.filter(t => {
    const matchSearch = String(t.id).includes(search) ||
      (t.subjek || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <style>{styles}</style>
      <main className="staf-main">
        <div className="staf-breadcrumb">
          <a href="/staff/dashboard">Dashboard</a><span>›</span>
          <strong>Antrean Tiket</strong>
        </div>
        <div className="staf-page-header">
          <h1>Antrean Tiket</h1>
          <p>Kelola dan klaim tiket yang belum ditugaskan.</p>
        </div>

        {/* Stats */}
        <div className="antrean-stats">
          <div className="antrean-stat">
            <div><div className="label">Total Tiket</div><div className="value">{loading ? "—" : tickets.length}</div></div>
            <div className="antrean-stat-icon" style={{ background: "#eff6ff", color: "var(--color-brand)" }}>
              <AppIcon name="Inbox" variant="lg" />
            </div>
          </div>
          <div className="antrean-stat">
            <div><div className="label">Tiket Saya</div><div className="value">{loading ? "—" : tugasSaya}</div></div>
            <div className="antrean-stat-icon" style={{ background: "#f1f5f9", color: "var(--color-gray-500)" }}>
              <AppIcon name="Ticket" variant="lg" />
            </div>
          </div>
          <div className="antrean-stat">
            <div><div className="label">Belum Diklaim</div><div className="value" style={{ color: "#ea580c" }}>{loading ? "—" : belumDiklaim}</div></div>
            <div className="antrean-stat-icon" style={{ background: "#fff7ed", color: "#f97316" }}>
              <AppIcon name="Hourglass" variant="lg" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="antrean-filter-row">
          <div className="antrean-search">
            <span>🔍</span>
            <input placeholder="ID Tiket, Subjek..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <select className="antrean-select" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
            <option value="">Semua Status</option>
            <option value="DIBUAT">Belum Diklaim (DIBUAT)</option>
            <option value="DIKLAIM">Diklaim</option>
            <option value="DIPROSES">Diproses</option>
            <option value="REVISI">Revisi</option>
            <option value="SELESAI">Selesai</option>
          </select>
        </div>

        {/* Table */}
        <div className="antrean-table-card">
          <table className="antrean-table">
            <thead>
              <tr>
                <th>ID Tiket</th>
                <th>Subjek</th>
                <th>Status</th>
                <th>Dibuat</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr className="state-row"><td colSpan="5" style={{ color: "#94a3b8" }}>⏳ Memuat data...</td></tr>
              ) : error ? (
                <tr className="state-row"><td colSpan="5" style={{ color: "#dc2626" }}>{error}</td></tr>
              ) : paginated.length === 0 ? (
                <tr className="state-row"><td colSpan="5" style={{ color: "#94a3b8" }}>Tidak ada tiket ditemukan.</td></tr>
              ) : paginated.map(t => (
                <tr key={t.id}>
                  <td><Link to={`/staff/tiket/${t.id}`} className="antrean-ticket-id">#{t.id}</Link></td>
                  <td style={{ fontWeight: 600 }}>{t.subjek}</td>
                  <td><span className={`staf-status-pill pill-${t.status}`}>{t.status}</span></td>
                  <td style={{ fontSize: 13, color: "#64748b" }}>
                    {t.tanggal_dibuat ? new Date(t.tanggal_dibuat).toLocaleDateString("id-ID") : "—"}
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

          <div className="antrean-table-footer">
            <span>Menampilkan {paginated.length} dari {filtered.length} tiket</span>
            {totalPages > 1 && (
              <div className="staf-pagination">
                <button className="staf-page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} className={`staf-page-btn ${page === p ? "active" : ""}`} onClick={() => setPage(p)}>{p}</button>
                ))}
                <button className="staf-page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>›</button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}