import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import ticketService from "../../services/ticketService";
import AppIcon from "../../components/ui/AppIcon";

const styles = `
  .staf-main { padding: 32px 40px; max-width: 1200px; width: 100%; margin: 0 auto; font-family: var(--font-sans); }
  .staf-breadcrumb { font-size: 13px; color: var(--gray-500); margin-bottom: 16px; }
  .staf-breadcrumb span { margin: 0 6px; }
  .staf-breadcrumb a { color: var(--gray-500); text-decoration: none; }
  .staf-breadcrumb a:hover { color: var(--color-brand); }
  .staf-breadcrumb strong { color: var(--gray-700); }
  .staf-page-header { margin-bottom: 24px; }
  .staf-page-header h1 { font-family: var(--font-display); font-size: 30px; font-weight: 800; color: var(--gray-900); margin-bottom: 4px; }
  .staf-page-header p { font-size: 14px; color: var(--gray-500); }

  .antrean-tabs { display: flex; gap: 0; margin-bottom: 20px; border-bottom: 2px solid var(--gray-200); }
  .antrean-tab { padding: 10px 22px; font-size: 14px; font-weight: 600; color: var(--gray-500); cursor: pointer; border-bottom: 2px solid transparent; background: none; border-top: none; border-left: none; border-right: none; font-family: var(--font-sans); transition: all 0.18s; margin-bottom: -2px; }
  .antrean-tab.active { color: var(--color-brand); border-bottom-color: var(--color-brand); }
  .antrean-tab:hover { color: var(--color-brand); }

  .antrean-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
  .antrean-stat { background: var(--white); border: 1.5px solid var(--gray-200); border-radius: 12px; padding: 20px; display: flex; align-items: center; justify-content: space-between; }
  .antrean-stat .label { font-size: 11px; font-weight: 700; color: var(--gray-400); text-transform: uppercase; letter-spacing: 0.7px; margin-bottom: 6px; }
  .antrean-stat .value { font-family: var(--font-display); font-size: 30px; font-weight: 900; color: var(--gray-900); }
  .antrean-stat-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }

  .antrean-filter-row { background: var(--white); border: 1.5px solid var(--gray-200); border-radius: 12px; padding: 16px 20px; margin-bottom: 16px; display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
  .antrean-search { display: flex; align-items: center; gap: 8px; border: 1.5px solid var(--gray-200); border-radius: 8px; padding: 8px 14px; background: var(--gray-50); flex: 1; min-width: 200px; }
  .antrean-search input { border: none; background: transparent; font-size: 13px; color: var(--gray-700); outline: none; font-family: var(--font-sans); width: 100%; }
  .antrean-search input::placeholder { color: var(--gray-400); }

  .antrean-table-card { background: var(--white); border: 1.5px solid var(--gray-200); border-radius: 14px; overflow: hidden; }
  table.antrean-table { width: 100%; border-collapse: collapse; text-align: left; }
  table.antrean-table th { padding: 12px 20px; font-size: 11px; font-weight: 700; color: var(--gray-500); background: var(--gray-50); text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1.5px solid var(--gray-200); }
  table.antrean-table td { padding: 14px 20px; font-size: 13.5px; color: var(--gray-900); border-bottom: 1.5px solid var(--gray-100); vertical-align: middle; }
  table.antrean-table tr:last-child td { border-bottom: none; }
  .antrean-ticket-id { font-weight: 700; color: var(--color-brand); font-size: 13px; text-decoration: none; }
  .antrean-ticket-id:hover { text-decoration: underline; }

  .staf-status-pill { display: inline-flex; align-items: center; gap: 6px; padding: 5px 10px; border-radius: 100px; font-size: 12px; font-weight: 600; }
  .pill-DIBUAT   { background: #eff6ff; color: #1d4ed8; }
  .pill-DIKLAIM  { background: #fefce8; color: #a16207; }
  .pill-DIPROSES { background: #fff7ed; color: #c2410c; }
  .pill-SELESAI  { background: #f0fdf4; color: #15803d; }
  .pill-REVISI   { background: #fef2f2; color: #dc2626; }
  .pill-DITOLAK  { background: var(--gray-100); color: #475569; }

  .btn-baca { background: #eff6ff; color: var(--color-brand); border: 1.5px solid #bfdbfe; border-radius: 8px; padding: 7px 14px; font-size: 13px; font-weight: 700; text-decoration: none; display: inline-block; transition: all 0.18s; white-space: nowrap; }
  .btn-baca:hover { background: #dbeafe; }
  .btn-detail { background: var(--white); color: var(--gray-700); border: 1.5px solid var(--gray-200); border-radius: 8px; padding: 7px 14px; font-size: 13px; font-weight: 600; font-family: var(--font-sans); text-decoration: none; display: inline-block; transition: all 0.18s; }
  .btn-detail:hover { background: var(--gray-100); }

  .antrean-table-footer { padding: 14px 20px; border-top: 1.5px solid var(--gray-200); display: flex; align-items: center; justify-content: space-between; font-size: 13px; color: var(--gray-500); }
  .staf-pagination { display: flex; align-items: center; gap: 4px; }
  .staf-page-btn { width: 32px; height: 32px; border-radius: 8px; border: 1.5px solid var(--gray-200); background: var(--white); font-size: 13px; font-weight: 600; color: var(--gray-700); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.18s; font-family: var(--font-sans); }
  .staf-page-btn:hover { background: var(--gray-100); }
  .staf-page-btn.active { background: var(--color-brand); border-color: var(--color-brand); color: var(--white); }
  .state-row td { text-align: center; padding: 40px; font-size: 14px; }
`;

const PAGE_SIZE = 10;

export default function AntreanTiketPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [search, setSearch]   = useState("");
  const [tab, setTab]         = useState("belum");  // "belum" | "semua"
  const [page, setPage]       = useState(1);

  const [allTickets, setAllTickets] = useState([]);

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [antrean, semua] = await Promise.all([
        ticketService.getUnclaimedTickets(),
        ticketService.getAllTiket(),
      ]);
      setTickets(Array.isArray(antrean) ? antrean : []);
      setAllTickets(Array.isArray(semua) ? semua : []);
    } catch {
      setError("Gagal memuat antrean tiket.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  const belumDiklaim = tickets;
  const semuaTiket = allTickets;

  const sourceList = tab === "belum" ? belumDiklaim : semuaTiket;

  const filtered = sourceList.filter(t =>
    String(t.id).includes(search) ||
    (t.subjek || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const tugasSayaCount = allTickets.filter(t => t.staf_id === user?.id).length;

  return (
    <>
      <style>{styles}</style>
      <main className="staf-main">
        <div className="staf-breadcrumb">
          <Link to="/staff/dashboard">Dashboard</Link><span>›</span>
          <strong>Antrean Tiket</strong>
        </div>
        <div className="staf-page-header">
          <h1>Antrean Tiket</h1>
          <p>Tiket yang belum diklaim dan daftar semua tiket yang masuk.</p>
        </div>

        {/* Stats */}
        <div className="antrean-stats">
          <div className="antrean-stat">
            <div><div className="label">Total Tiket</div><div className="value">{loading ? "—" : semuaTiket.length}</div></div>
            <div className="antrean-stat-icon" style={{ background: "#eff6ff", color: "var(--color-brand)" }}>
              <AppIcon name="Inbox" variant="lg" />
            </div>
          </div>
          <div className="antrean-stat">
            <div><div className="label">Tugas Saya</div><div className="value">{loading ? "—" : tugasSayaCount}</div></div>
            <div className="antrean-stat-icon" style={{ background: "var(--gray-100)", color: "var(--gray-500)" }}>
              <AppIcon name="Ticket" variant="lg" />
            </div>
          </div>
          <div className="antrean-stat">
            <div>
              <div className="label">Belum Diklaim</div>
              <div className="value" style={{ color: "#ea580c" }}>{loading ? "—" : belumDiklaim.length}</div>
            </div>
            <div className="antrean-stat-icon" style={{ background: "#fff7ed", color: "#f97316" }}>
              <AppIcon name="Hourglass" variant="lg" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="antrean-tabs">
          <button
            className={`antrean-tab ${tab === "belum" ? "active" : ""}`}
            onClick={() => { setTab("belum"); setPage(1); }}
          >
            Belum Diklaim ({belumDiklaim.length})
          </button>
          <button
            className={`antrean-tab ${tab === "semua" ? "active" : ""}`}
            onClick={() => { setTab("semua"); setPage(1); }}
          >
            Semua Tiket ({semuaTiket.length})
          </button>
        </div>

        {/* Search */}
        <div className="antrean-filter-row">
          <div className="antrean-search">
            <AppIcon name="Search" variant="sm" style={{ color: "var(--gray-400)", flexShrink: 0 }} />
            <input
              placeholder="Cari ID Tiket atau Subjek..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
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
                <tr className="state-row"><td colSpan="5" style={{ color: "var(--gray-400)" }}>⏳ Memuat data...</td></tr>
              ) : error ? (
                <tr className="state-row"><td colSpan="5" style={{ color: "#dc2626" }}>{error}</td></tr>
              ) : paginated.length === 0 ? (
                <tr className="state-row">
                  <td colSpan="5" style={{ color: "var(--gray-400)" }}>
                    {tab === "belum" ? "✅ Semua tiket sudah diklaim." : "Tidak ada tiket ditemukan."}
                  </td>
                </tr>
              ) : paginated.map(t => (
                <tr key={t.id}>
                  <td>
                    <Link to={`/staff/tiket/${t.id}`} className="antrean-ticket-id">#{t.id}</Link>
                  </td>
                  <td style={{ fontWeight: 600 }}>{t.subjek}</td>
                  <td>
                    <span className={`staf-status-pill pill-${t.status}`}>{t.status}</span>
                  </td>
                  <td style={{ fontSize: 13, color: "var(--gray-500)" }}>
                    {t.tanggal_dibuat
                      ? new Date(t.tanggal_dibuat).toLocaleDateString("id-ID")
                      : "—"}
                  </td>
                  <td>
                    {t.status === "DIBUAT" ? (
                      // Belum diklaim — arahkan ke detail untuk baca dulu lalu klaim
                      <Link to={`/staff/tiket/${t.id}`} className="btn-baca">
                        Baca &amp; Klaim →
                      </Link>
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
                  <button
                    key={p}
                    className={`staf-page-btn ${page === p ? "active" : ""}`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
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