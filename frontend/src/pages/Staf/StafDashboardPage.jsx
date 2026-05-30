import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import ticketService from "../../services/ticketService";
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
  .staf-stat-icon { position: absolute; top: 20px; right: 20px; width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
  .staf-stat-icon.blue { background: #eff6ff; color: var(--color-brand); }
  .staf-stat-icon.orange { background: #fff7ed; color: #f97316; }

  .staf-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }

  .staf-table-card { background: #fff; border: 1.5px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.02); }
  .staf-table-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  .staf-table-scroll table.staf-table { min-width: 480px; }
  .staf-table-header { padding: 20px 24px; border-bottom: 1.5px solid #e2e8f0; display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; flex-wrap: wrap; }
  .staf-table-header h2 { font-size: 17px; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
  .staf-table-header p { font-size: 13px; color: #64748b; }
  .staf-table-search { display: flex; align-items: center; gap: 8px; border: 1.5px solid #e2e8f0; border-radius: 8px; padding: 7px 12px; background: #f8fafc; min-width: 180px; }
  .staf-table-search input { border: none; background: transparent; font-size: 13px; color: #334155; outline: none; font-family: 'Plus Jakarta Sans', sans-serif; width: 100%; }
  .staf-table-search input::placeholder { color: #94a3b8; }

  table.staf-table { width: 100%; border-collapse: collapse; text-align: left; }
  table.staf-table th { padding: 11px 18px; font-size: 11px; font-weight: 700; color: #64748b; background: #f8fafc; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1.5px solid #e2e8f0; }
  table.staf-table td { padding: 13px 18px; font-size: 13px; color: #0f172a; border-bottom: 1.5px solid #f1f5f9; vertical-align: middle; }
  table.staf-table tr:last-child td { border-bottom: none; }
  .td-ticket-id { font-weight: 700; color: #2563eb; font-size: 13px; text-decoration: none; }
  .td-ticket-id:hover { text-decoration: underline; }

  .staf-status-pill { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 100px; font-size: 11px; font-weight: 600; }
  .pill-DIBUAT   { background: #eff6ff; color: #1d4ed8; }
  .pill-DIKLAIM  { background: #fefce8; color: #a16207; }
  .pill-DIPROSES { background: #fff7ed; color: #c2410c; }
  .pill-SELESAI  { background: #f0fdf4; color: #15803d; }
  .pill-REVISI   { background: #fef2f2; color: #dc2626; }
  .pill-DITOLAK  { background: #f1f5f9; color: #475569; }

  .btn-lihat { background: #fff; color: #2563eb; border: 1.5px solid #bfdbfe; border-radius: 8px; padding: 6px 13px; font-size: 12px; font-weight: 700; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.18s; text-decoration: none; display: inline-block; white-space: nowrap; }
  .btn-lihat:hover { background: #eff6ff; }
  .btn-lanjut { background: #2563eb; color: #fff; border: none; border-radius: 8px; padding: 6px 13px; font-size: 12px; font-weight: 700; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.18s; text-decoration: none; display: inline-block; white-space: nowrap; }
  .btn-lanjut:hover { background: #1d4ed8; }

  .staf-table-footer { padding: 13px 18px; border-top: 1.5px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between; font-size: 13px; color: #64748b; }
  .state-row td { text-align: center; padding: 32px; font-size: 13px; }

  .tugas-label { font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 6px; }
  .tugas-label.diklaim { background: #fefce8; color: #a16207; }
  .tugas-label.diproses { background: #fff7ed; color: #c2410c; }
  .tugas-label.revisi { background: #fef2f2; color: #dc2626; }
`;

export default function StafDashboardPage() {
  const { user } = useAuth();
  const [tickets, setTickets]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [searchAntrean, setSearchAntrean] = useState("");
  const [searchTugas, setSearchTugas]     = useState("");

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await ticketService.getAllTiket();
      setTickets(Array.isArray(res) ? res : []);
    } catch {
      setError("Gagal memuat data tiket.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  // Tiket yang belum diklaim siapapun
  const belumDiklaim = tickets.filter(t => t.status === "DIBUAT");

  // Tiket yang sudah diklaim oleh staf ini
  const tugasSaya = tickets.filter(t =>
    t.staf_id === user?.id && t.status !== "SELESAI" && t.status !== "DITOLAK"
  );

  const filteredAntrean = belumDiklaim.filter(t =>
    String(t.id).includes(searchAntrean) ||
    (t.subjek || "").toLowerCase().includes(searchAntrean.toLowerCase())
  );

  const filteredTugas = tugasSaya.filter(t =>
    String(t.id).includes(searchTugas) ||
    (t.subjek || "").toLowerCase().includes(searchTugas.toLowerCase())
  );

  const totalSelesai = tickets.filter(t => t.staf_id === user?.id && t.status === "SELESAI").length;

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

        {belumDiklaim.length > 0 && (
          <div className="staf-alert">
            ⚠️ Terdapat <strong style={{ margin: "0 4px" }}>{belumDiklaim.length} tiket</strong>
            yang belum diklaim. Segera tindak lanjuti untuk menjaga performa layanan.
          </div>
        )}

        {/* Stats */}
        <div className="staf-stats-grid">
          <div className="staf-stat-card">
            <div className="staf-stat-icon blue">
              <AppIcon name="Ticket" variant="xl" />
            </div>
            <div className="staf-stat-title">Tugas Tiket Saya</div>
            <div className="staf-stat-value">{loading ? "—" : tugasSaya.length}</div>
            <div className="staf-stat-sub">
              <Link to="/staff/tugas-saya">Lihat tugas →</Link>
            </div>
          </div>
          <div className="staf-stat-card">
            <div className="staf-stat-icon blue">
              <AppIcon name="CheckCircle" variant="xl" />
            </div>
            <div className="staf-stat-title">Selesai Ditangani</div>
            <div className="staf-stat-value">{loading ? "—" : totalSelesai}</div>
            <div className="staf-stat-sub">Total tiket selesai saya</div>
          </div>
          <div className="staf-stat-card warning">
            <div className="staf-stat-icon orange">
              <AppIcon name="Clock" variant="xl" />
            </div>
            <div className="staf-stat-title warning-title">⚠ Belum Diklaim</div>
            <div className="staf-stat-value warning-value">{loading ? "—" : belumDiklaim.length}</div>
            <div className="staf-stat-sub">
              <Link to="/staff/antrean-tiket">Lihat antrean →</Link>
            </div>
          </div>
        </div>

        {/* Dua tabel berdampingan */}
        <div className="staf-two-col">

          {/* Tabel: Tugas Tiket Saya */}
          <div className="staf-table-card">
            <div className="staf-table-header">
              <div>
                <h2>Tugas Tiket Saya</h2>
                <p>Tiket yang sedang Anda tangani.</p>
              </div>
              <div className="staf-table-search">
                <AppIcon name="Search" variant="sm" style={{ color: "#94a3b8", flexShrink: 0 }} />
                <input
                  placeholder="Cari..."
                  value={searchTugas}
                  onChange={e => setSearchTugas(e.target.value)}
                />
              </div>
            </div>

            <div className="staf-table-scroll">
            <table className="staf-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Subjek</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr className="state-row"><td colSpan="4" style={{ color: "#94a3b8" }}>⏳ Memuat...</td></tr>
                ) : filteredTugas.length === 0 ? (
                  <tr className="state-row">
                    <td colSpan="4" style={{ color: "#94a3b8" }}>
                      Belum ada tugas tiket aktif.
                    </td>
                  </tr>
                ) : filteredTugas.slice(0, 5).map(t => (
                  <tr key={t.id}>
                    <td>
                      <Link to={`/staff/tiket/${t.id}`} className="td-ticket-id">#{t.id}</Link>
                    </td>
                    <td style={{ fontWeight: 600, maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {t.subjek}
                    </td>
                    <td>
                      <span className={`staf-status-pill pill-${t.status}`}>{t.status}</span>
                    </td>
                    <td>
                      <Link to={`/staff/tiket/${t.id}`} className="btn-lanjut">Lanjutkan →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>

            <div className="staf-table-footer">
              <span>{filteredTugas.length} tiket aktif</span>
              <Link to="/staff/tugas-saya" style={{ color: "#2563eb", fontWeight: 600, fontSize: 13, textDecoration: "none" }}>
                Lihat semua →
              </Link>
            </div>
          </div>

          {/* Tabel: Antrean Belum Diklaim */}
          <div className="staf-table-card">
            <div className="staf-table-header">
              <div>
                <h2>Antrean Tiket Terbaru</h2>
                <p>Tiket belum diklaim — klik untuk baca &amp; klaim.</p>
              </div>
              <div className="staf-table-search">
                <AppIcon name="Search" variant="sm" style={{ color: "#94a3b8", flexShrink: 0 }} />
                <input
                  placeholder="Cari..."
                  value={searchAntrean}
                  onChange={e => setSearchAntrean(e.target.value)}
                />
              </div>
            </div>

            <div className="staf-table-scroll">
            <table className="staf-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Subjek</th>
                  <th>Tanggal</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr className="state-row"><td colSpan="4" style={{ color: "#94a3b8" }}>⏳ Memuat...</td></tr>
                ) : error ? (
                  <tr className="state-row"><td colSpan="4" style={{ color: "#dc2626" }}>{error}</td></tr>
                ) : filteredAntrean.length === 0 ? (
                  <tr className="state-row">
                    <td colSpan="4" style={{ color: "#94a3b8" }}>
                      ✅ Tidak ada tiket yang menunggu.
                    </td>
                  </tr>
                ) : filteredAntrean.slice(0, 5).map(t => (
                  <tr key={t.id}>
                    <td>
                      <Link to={`/staff/tiket/${t.id}`} className="td-ticket-id">#{t.id}</Link>
                    </td>
                    <td style={{ fontWeight: 600, maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {t.subjek}
                    </td>
                    <td style={{ fontSize: 12, color: "#64748b" }}>
                      {t.tanggal_dibuat
                        ? new Date(t.tanggal_dibuat).toLocaleDateString("id-ID", { day: "numeric", month: "short" })
                        : "—"}
                    </td>
                    <td>
                      {/* Klik baca dulu, klaim ada di halaman detail */}
                      <Link to={`/staff/tiket/${t.id}`} className="btn-lihat">Baca →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>

            <div className="staf-table-footer">
              <span>{filteredAntrean.length} tiket menunggu</span>
              <Link to="/staff/antrean-tiket" style={{ color: "#2563eb", fontWeight: 600, fontSize: 13, textDecoration: "none" }}>
                Lihat semua →
              </Link>
            </div>
          </div>

        </div>
      </main>
    </>
  );
}