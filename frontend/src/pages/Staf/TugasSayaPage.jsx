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

  .tugas-toolbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; gap: 12px; flex-wrap: wrap; }
  .tugas-tabs { display: flex; gap: 0; }
  .tugas-tab { padding: 10px 20px; font-size: 14px; font-weight: 600; color: var(--gray-500); cursor: pointer; border-bottom: 2px solid transparent; background: none; border-top: none; border-left: none; border-right: none; font-family: var(--font-sans); transition: all 0.18s; }
  .tugas-tab.active { color: var(--color-brand); border-bottom-color: var(--color-brand); }
  .tugas-tab:hover { color: var(--color-brand); }
  .tugas-search { display: flex; align-items: center; gap: 8px; border: 1.5px solid var(--gray-200); border-radius: 8px; padding: 8px 14px; background: var(--gray-50); min-width: 240px; }
  .tugas-search input { border: none; background: transparent; font-size: 13px; color: var(--gray-700); outline: none; font-family: var(--font-sans); width: 100%; }
  .tugas-search input::placeholder { color: var(--gray-400); }

  .tugas-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
  .tugas-stat-mini { background: var(--white); border: 1.5px solid var(--gray-200); border-radius: 12px; padding: 18px 20px; display: flex; align-items: center; justify-content: space-between; }
  .tugas-stat-mini .label { font-size: 11px; font-weight: 700; color: var(--gray-400); text-transform: uppercase; letter-spacing: 0.7px; margin-bottom: 6px; }
  .tugas-stat-mini .value { font-family: var(--font-display); font-size: 28px; font-weight: 900; color: var(--gray-900); }
  .tugas-stat-mini-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }

  .tugas-list { display: flex; flex-direction: column; gap: 16px; }
  .tugas-card { background: var(--white); border: 1.5px solid var(--gray-200); border-radius: 14px; padding: 20px 24px; transition: box-shadow 0.18s; cursor: default; }
  .tugas-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
  .tugas-card.urgent { border-left: 4px solid #ea580c; }
  .tugas-card-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 10px; }
  .tugas-card-badges { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
  .tugas-ticket-id { font-size: 12px; font-weight: 700; color: var(--gray-400); }
  .tugas-status-pill { font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 100px; text-transform: uppercase; }
  .pill-DIBUAT   { background: #eff6ff; color: #1d4ed8; }
  .pill-DIKLAIM  { background: #fefce8; color: #a16207; }
  .pill-DIPROSES { background: #fff7ed; color: #c2410c; }
  .pill-SELESAI  { background: #f0fdf4; color: #15803d; }
  .pill-REVISI   { background: #fef2f2; color: #dc2626; }
  .pill-DITOLAK  { background: var(--gray-100); color: #475569; }
  .tugas-card-time { font-size: 12px; color: var(--gray-400); white-space: nowrap; }
  .tugas-card-title { font-size: 16px; font-weight: 700; color: var(--gray-900); margin-bottom: 6px; }
  .tugas-card-desc { font-size: 13px; color: var(--gray-500); line-height: 1.5; margin-bottom: 14px; }
  .tugas-card-footer { display: flex; align-items: center; justify-content: space-between; }
  .tugas-card-meta { display: flex; align-items: center; gap: 16px; font-size: 12.5px; color: var(--gray-500); }
  .btn-tugas-action { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: var(--font-sans); text-decoration: none; border: none; transition: all 0.18s; }
  .btn-tugas-action.primary { background: var(--color-brand); color: var(--white); }
  .btn-tugas-action.primary:hover { background: #1d4ed8; }
  .btn-tugas-action.secondary { background: var(--gray-100); color: var(--gray-700); border: 1.5px solid var(--gray-200); }
  .btn-tugas-action.secondary:hover { background: var(--gray-200); }

  .empty-state { text-align: center; padding: 60px 20px; color: var(--gray-400); }
  .empty-state-icon { font-size: 40px; margin-bottom: 12px; }
  .empty-state p { font-size: 14px; }
  .state-center { text-align: center; padding: 60px; color: var(--gray-400); font-size: 14px; }
  .state-center.error { color: #dc2626; }
`;

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export default function TugasSayaPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [tab, setTab]         = useState("aktif");
  const [search, setSearch]   = useState("");

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await ticketService.getMyTasks();
      setTickets(Array.isArray(res) ? res : []);
    } catch {
      setError("Gagal memuat tiket. Coba refresh halaman.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  // Tab aktif: semua tiket milik saya kecuali SELESAI dan DITOLAK
  const aktif   = tickets.filter(t => t.status !== "SELESAI" && t.status !== "DITOLAK");
  const selesai = tickets.filter(t => t.status === "SELESAI");
  const ditolak = tickets.filter(t => t.status === "DITOLAK");

  const getTabList = () => {
    if (tab === "aktif")   return aktif;
    if (tab === "selesai") return selesai;
    return ditolak;
  };

  const displayed = getTabList().filter(t =>
    String(t.id).includes(search) ||
    (t.subjek || "").toLowerCase().includes(search.toLowerCase())
  );

  const getActionLabel = (status) => {
    if (status === "DIKLAIM")  return "Lihat & Putuskan →";
    if (status === "DIPROSES") return "Lanjutkan →";
    if (status === "REVISI")   return "Cek Revisi →";
    if (status === "SELESAI")  return "Lihat Detail";
    if (status === "DITOLAK")  return "Lihat Detail";
    return "Detail →";
  };

  const getActionClass = (status) => {
    if (status === "SELESAI" || status === "DITOLAK") return "secondary";
    return "primary";
  };

  return (
    <>
      <style>{styles}</style>
      <main className="staf-main">
        <div className="staf-breadcrumb">
          <Link to="/staff/dashboard">Portal Bantuan</Link><span>›</span>
          <strong>Tugas Tiket Saya</strong>
        </div>
        <div className="staf-page-header">
          <h1>Tugas Tiket Saya</h1>
          <p>Tiket yang sudah Anda klaim dan sedang Anda tangani.</p>
        </div>

        {/* Stats */}
        <div className="tugas-stats">
          <div className="tugas-stat-mini">
            <div>
              <div className="label">Tiket Aktif</div>
              <div className="value" style={{ color: "var(--color-brand)" }}>{aktif.length}</div>
            </div>
            <div className="tugas-stat-mini-icon" style={{ background: "#eff6ff", color: "var(--color-brand)" }}>
              <AppIcon name="ClipboardList" variant="lg" />
            </div>
          </div>
          <div className="tugas-stat-mini">
            <div>
              <div className="label">Perlu Perhatian</div>
              <div className="value" style={{ color: "#ea580c" }}>{tickets.filter(t => t.status === "REVISI").length}</div>
            </div>
            <div className="tugas-stat-mini-icon" style={{ background: "#fef2f2", color: "#dc2626" }}>
              <AppIcon name="AlertTriangle" variant="lg" />
            </div>
          </div>
          <div className="tugas-stat-mini">
            <div>
              <div className="label">Selesai</div>
              <div className="value" style={{ color: "#16a34a" }}>{selesai.length}</div>
            </div>
            <div className="tugas-stat-mini-icon" style={{ background: "#f0fdf4", color: "#16a34a" }}>
              <AppIcon name="CheckCircle" variant="lg" />
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="tugas-toolbar">
          <div className="tugas-tabs">
            <button
              className={`tugas-tab ${tab === "aktif" ? "active" : ""}`}
              onClick={() => setTab("aktif")}
            >
              Aktif ({aktif.length})
            </button>
            <button
              className={`tugas-tab ${tab === "selesai" ? "active" : ""}`}
              onClick={() => setTab("selesai")}
            >
              Selesai ({selesai.length})
            </button>
            <button
              className={`tugas-tab ${tab === "ditolak" ? "active" : ""}`}
              onClick={() => setTab("ditolak")}
            >
              Ditolak ({ditolak.length})
            </button>
          </div>
          <div className="tugas-search">
            <AppIcon name="Search" variant="sm" style={{ color: "var(--gray-400)", flexShrink: 0 }} />
            <input
              placeholder="Cari ID atau judul..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="state-center">⏳ Memuat tiket...</div>
        ) : error ? (
          <div className="state-center error">{error}</div>
        ) : displayed.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              {tab === "aktif" ? "📋" : tab === "selesai" ? "✅" : "✕"}
            </div>
            <p>
              {tab === "aktif"
                ? "Belum ada tugas tiket aktif. Klaim tiket dari antrean untuk mulai."
                : tab === "selesai"
                ? "Belum ada tiket yang selesai."
                : "Tidak ada tiket yang ditolak."}
            </p>
          </div>
        ) : (
          <div className="tugas-list">
            {displayed.map(t => (
              <div key={t.id} className={`tugas-card ${t.status === "REVISI" ? "urgent" : ""}`}>
                <div className="tugas-card-top">
                  <div className="tugas-card-badges">
                    <span className="tugas-ticket-id">#{t.id}</span>
                    <span className={`tugas-status-pill pill-${t.status}`}>{t.status}</span>
                    {t.status === "DIKLAIM" && (
                      <span style={{ fontSize: 11, color: "#a16207", background: "#fefce8", padding: "2px 8px", borderRadius: 6, fontWeight: 600 }}>
                        ⏳ Menunggu keputusan Anda
                      </span>
                    )}
                  </div>
                  <span className="tugas-card-time">{formatDate(t.tanggal_dibuat)}</span>
                </div>

                <div className="tugas-card-title">{t.subjek}</div>
                <div className="tugas-card-desc">
                  {t.pengajuan?.deskripsi
                    ? t.pengajuan.deskripsi.slice(0, 120) + (t.pengajuan.deskripsi.length > 120 ? "..." : "")
                    : "Tidak ada deskripsi."}
                </div>

                <div className="tugas-card-footer">
                  <div className="tugas-card-meta">
                    <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <AppIcon name="Ticket" variant="xs" /> Tiket #{t.id}
                    </span>
                  </div>
                  <Link
                    to={`/staff/tiket/${t.id}`}
                    className={`btn-tugas-action ${getActionClass(t.status)}`}
                  >
                    {getActionLabel(t.status)}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}