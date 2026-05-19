import { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import ticketService from "../../services/TicketService";

const styles = `
  .dt-main { padding: 32px 40px; max-width: 1100px; width: 100%; margin: 0 auto; font-family: 'Plus Jakarta Sans', sans-serif; }
  .dt-breadcrumb { font-size: 13px; color: #64748b; margin-bottom: 16px; }
  .dt-breadcrumb span { margin: 0 6px; }
  .dt-breadcrumb a { color: #64748b; text-decoration: none; }
  .dt-breadcrumb a:hover { color: #2563eb; }
  .dt-breadcrumb strong { color: #334155; }

  .dt-top-row { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 28px; flex-wrap: wrap; gap: 12px; }
  .dt-top-row h1 { font-family: 'Fraunces', serif; font-size: 26px; font-weight: 800; color: #0f172a; }

  /* Status progress */
  .dt-progress { background: #fff; border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 22px 28px; margin-bottom: 24px; display: flex; align-items: center; }
  .progress-step { display: flex; flex-direction: column; align-items: center; gap: 8px; flex: 1; position: relative; }
  .progress-step:not(:last-child)::after { content: ''; position: absolute; top: 18px; left: 50%; width: 100%; height: 2px; background: #e2e8f0; z-index: 0; }
  .progress-step.done:not(:last-child)::after { background: #2563eb; }
  .progress-circle { width: 36px; height: 36px; border-radius: 50%; border: 2px solid #e2e8f0; background: #fff; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; color: #94a3b8; z-index: 1; position: relative; }
  .progress-circle.done { background: #2563eb; border-color: #2563eb; color: #fff; }
  .progress-circle.active { border-color: #2563eb; color: #2563eb; background: #eff6ff; }
  .progress-label { font-size: 12px; font-weight: 600; color: #94a3b8; }
  .progress-label.done, .progress-label.active { color: #2563eb; }

  /* Layout */
  .dt-layout { display: grid; grid-template-columns: 1fr 280px; gap: 24px; align-items: start; }

  /* Deskripsi awal */
  .dt-desc-card { background: #fff; border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 24px; margin-bottom: 20px; }
  .dt-desc-card h3 { font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 12px; }
  .dt-desc-text { font-size: 14px; color: #334155; line-height: 1.7; }

  /* Riwayat */
  .dt-history-title { font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 14px; }
  .dt-history-system { display: flex; align-items: center; gap: 10px; padding: 11px 16px; background: #f8fafc; border-radius: 10px; margin-bottom: 14px; font-size: 13px; color: #64748b; }

  .dt-comment { display: flex; gap: 12px; margin-bottom: 14px; }
  .dt-comment-avatar { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #fff; flex-shrink: 0; }
  .avatar-mahasiswa { background: linear-gradient(135deg, #1a4fad, #0ea5e9); }
  .avatar-staf { background: linear-gradient(135deg, #7c3aed, #a855f7); }
  .dt-comment-bubble { background: #fff; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 14px 18px; flex: 1; }
  .dt-comment-bubble.staf { border-left: 3px solid #7c3aed; }
  .dt-comment-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
  .dt-comment-name { font-size: 13px; font-weight: 700; color: #0f172a; }
  .dt-comment-time { font-size: 11px; color: #94a3b8; }
  .dt-comment-body { font-size: 13.5px; color: #334155; line-height: 1.6; }

  /* Reply box */
  .dt-reply-box { background: #fff; border: 1.5px solid #e2e8f0; border-radius: 14px; overflow: hidden; margin-top: 8px; }
  .dt-reply-title { padding: 12px 18px; font-size: 14px; font-weight: 700; color: #0f172a; border-bottom: 1.5px solid #f1f5f9; }
  .dt-reply-textarea { width: 100%; min-height: 90px; border: none; padding: 14px 18px; font-size: 14px; color: #334155; font-family: 'Plus Jakarta Sans', sans-serif; resize: none; outline: none; background: #fff; box-sizing: border-box; }
  .dt-reply-textarea::placeholder { color: #94a3b8; }
  .dt-reply-footer { padding: 10px 18px; border-top: 1.5px solid #f1f5f9; display: flex; justify-content: flex-end; gap: 10px; }

  .btn-kirim { display: flex; align-items: center; gap: 6px; padding: 8px 18px; border: none; border-radius: 8px; background: #2563eb; font-size: 13px; font-weight: 700; color: #fff; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; }
  .btn-kirim:hover { background: #1d4ed8; }
  .btn-kirim:disabled { background: #93c5fd; cursor: not-allowed; }
  .btn-batal { padding: 8px 16px; border: 1.5px solid #e2e8f0; border-radius: 8px; background: #fff; font-size: 13px; font-weight: 600; color: #334155; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; }
  .btn-batal:hover { background: #f1f5f9; }

  /* Sidebar info */
  .dt-info-card { background: #fff; border: 1.5px solid #e2e8f0; border-radius: 14px; overflow: hidden; margin-bottom: 16px; }
  .dt-info-title { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; padding: 12px 18px 8px; border-bottom: 1px solid #f1f5f9; }
  .dt-info-body { padding: 14px 18px; }
  .dt-info-row { margin-bottom: 10px; }
  .dt-info-row:last-child { margin-bottom: 0; }
  .dt-info-label { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px; }
  .dt-info-val { font-size: 13px; color: #334155; font-weight: 500; }

  .status-pill { display: inline-block; padding: 3px 10px; border-radius: 100px; font-size: 11px; font-weight: 700; }
  .pill-DIBUAT   { background: #f0fdf4; color: #15803d; }
  .pill-DIKLAIM  { background: #fefce8; color: #a16207; }
  .pill-DIPROSES { background: #fff7ed; color: #c2410c; }
  .pill-SELESAI  { background: #eff6ff; color: #1d4ed8; }
  .pill-REVISI   { background: #fef2f2; color: #dc2626; }

  /* Revisi banner */
  .revisi-banner { background: #fef2f2; border: 1.5px solid #fecaca; border-radius: 12px; padding: 14px 18px; margin-bottom: 20px; font-size: 13px; color: #dc2626; }
  .revisi-banner strong { font-weight: 700; }

  .dt-loading { text-align: center; padding: 60px; color: #94a3b8; font-size: 14px; }
  .dt-error { text-align: center; padding: 60px; color: #dc2626; font-size: 14px; }

  @media (max-width: 768px) {
    .dt-main { padding: 20px 16px; }
    .dt-layout { grid-template-columns: 1fr; }
  }
`;

const STATUS_STEPS = ["DIBUAT", "DIKLAIM", "DIPROSES", "SELESAI"];

function getStepStatus(tiketStatus, stepStatus) {
  const tiketIdx = STATUS_STEPS.indexOf(tiketStatus === "REVISI" ? "DIPROSES" : tiketStatus);
  const stepIdx  = STATUS_STEPS.indexOf(stepStatus);
  if (stepIdx < tiketIdx)  return "done";
  if (stepIdx === tiketIdx) return "active";
  return "";
}

function getInitials(nama = "") {
  return nama.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";
}

function formatDateTime(str) {
  if (!str) return "—";
  return new Date(str).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
}

export default function DetailTiketPage() {
  const { id }   = useParams();
  const { user } = useAuth();

  const [tiket,   setTiket]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [reply,   setReply]   = useState("");
  const [sending, setSending] = useState(false);

  const fetchTiket = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ticketService.getTiketById(id);
      setTiket(data);
    } catch {
      setError("Tiket tidak ditemukan atau Anda tidak memiliki akses.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchTiket(); }, [fetchTiket]);

  const handleKirimBalasan = async () => {
    if (!reply.trim()) return;
    try {
      setSending(true);
      await ticketService.addKomentar(id, reply);
      setReply("");
      await fetchTiket();
    } catch (err) {
      alert(err?.response?.data?.detail || "Gagal mengirim balasan.");
    } finally {
      setSending(false);
    }
  };

  if (loading) return <main className="dt-main"><div className="dt-loading">⏳ Memuat detail tiket...</div></main>;
  if (error)   return <main className="dt-main"><div className="dt-error">{error}</div></main>;
  if (!tiket)  return null;

  const isSelesai = tiket.status === "SELESAI";
  const isRevisi  = tiket.status === "REVISI";

  return (
    <>
      <style>{styles}</style>

      <main className="dt-main">
        {/* Breadcrumb */}
        <div className="dt-breadcrumb">
          <Link to="/dashboard">Dashboard</Link>
          <span>›</span>
          <Link to="/tiket/saya">Tiket Saya</Link>
          <span>›</span>
          <strong>#{tiket.id}</strong>
        </div>

        {/* Judul */}
        <div className="dt-top-row">
          <h1>{tiket.subjek}</h1>
          <span className={`status-pill pill-${tiket.status}`}>{tiket.status}</span>
        </div>

        {/* Banner revisi */}
        {isRevisi && (
          <div className="revisi-banner">
            ⚠️ <strong>Staf meminta revisi.</strong> Silakan baca catatan dari staf di bawah, lalu balas dengan informasi yang diperlukan.
          </div>
        )}

        {/* Progress bar */}
        <div className="dt-progress">
          {STATUS_STEPS.map((step, i) => {
            const s = getStepStatus(tiket.status, step);
            return (
              <div key={i} className={`progress-step ${s}`}>
                <div className={`progress-circle ${s}`}>{s === "done" ? "✓" : i + 1}</div>
                <div className={`progress-label ${s}`}>{step.charAt(0) + step.slice(1).toLowerCase()}</div>
              </div>
            );
          })}
        </div>

        <div className="dt-layout">
          {/* Kiri — konten utama */}
          <div>
            {/* Deskripsi asli */}
            <div className="dt-desc-card">
              <h3>📄 Deskripsi Keluhan</h3>
              <div className="dt-desc-text">
                {tiket.pengajuan?.deskripsi || "Tidak ada deskripsi."}
              </div>
            </div>

            {/* Riwayat & Tanggapan */}
            <div className="dt-history-title">Riwayat &amp; Tanggapan</div>

            <div className="dt-history-system">
              <span>📧</span>
              <span><strong>Sistem</strong> — tiket dibuat pada {formatDateTime(tiket.tanggal_dibuat)}</span>
            </div>

            {(tiket.komentar || []).length === 0 && (
              <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 16, padding: "12px 16px", background: "#f8fafc", borderRadius: 10 }}>
                Belum ada tanggapan. Staf akan merespons secepatnya.
              </div>
            )}

            {(tiket.komentar || []).map((k) => {
              const isStaf = k.role === "Staff Administrasi";
              return (
                <div key={k.id} className="dt-comment">
                  <div className={`dt-comment-avatar ${isStaf ? "avatar-staf" : "avatar-mahasiswa"}`}>
                    {isStaf ? "ST" : getInitials(user?.nama || "MH")}
                  </div>
                  <div className={`dt-comment-bubble ${isStaf ? "staf" : ""}`}>
                    <div className="dt-comment-header">
                      <span className="dt-comment-name">
                        {isStaf ? "Staff Administrasi" : (user?.nama || "Mahasiswa")}
                      </span>
                      <span className="dt-comment-time">{formatDateTime(k.waktu)}</span>
                    </div>
                    <div className="dt-comment-body">{k.isi}</div>
                  </div>
                </div>
              );
            })}

            {/* Reply box — muncul selama tiket belum selesai */}
            {!isSelesai && (
              <div className="dt-reply-box">
                <div className="dt-reply-title">Tulis Balasan</div>
                <textarea
                  className="dt-reply-textarea"
                  placeholder={isRevisi
                    ? "Berikan informasi tambahan yang diminta staf..."
                    : "Tambahkan informasi atau pertanyaan untuk staf..."}
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                />
                <div className="dt-reply-footer">
                  <button className="btn-batal" onClick={() => setReply("")}>Batal</button>
                  <button
                    className="btn-kirim"
                    disabled={!reply.trim() || sending}
                    onClick={handleKirimBalasan}
                  >
                    {sending ? "Mengirim..." : "Kirim Balasan ▷"}
                  </button>
                </div>
              </div>
            )}

            {isSelesai && (
              <div style={{ background: "#eff6ff", border: "1.5px solid #bfdbfe", borderRadius: 12, padding: "14px 18px", fontSize: 13, color: "#1d4ed8", marginTop: 8 }}>
                ✅ Tiket ini sudah <strong>diselesaikan</strong>. Jika masih ada kendala, buat tiket baru.
              </div>
            )}
          </div>

          {/* Kanan — info sidebar */}
          <div>
            <div className="dt-info-card">
              <div className="dt-info-title">Detail Tiket</div>
              <div className="dt-info-body">
                <div className="dt-info-row">
                  <div className="dt-info-label">ID Tiket</div>
                  <div className="dt-info-val">#{tiket.id}</div>
                </div>
                <div className="dt-info-row">
                  <div className="dt-info-label">Status</div>
                  <div className="dt-info-val">
                    <span className={`status-pill pill-${tiket.status}`}>{tiket.status}</span>
                  </div>
                </div>
                <div className="dt-info-row">
                  <div className="dt-info-label">Kategori</div>
                  <div className="dt-info-val">{tiket.kategori_id ? `Kategori #${tiket.kategori_id}` : "—"}</div>
                </div>
                <div className="dt-info-row">
                  <div className="dt-info-label">Dibuat Pada</div>
                  <div className="dt-info-val">{formatDateTime(tiket.tanggal_dibuat)}</div>
                </div>
                <div className="dt-info-row">
                  <div className="dt-info-label">Penanganan Staf</div>
                  <div className="dt-info-val">
                    {tiket.staf_id ? "Sudah diklaim ✓" : "Menunggu staf..."}
                  </div>
                </div>
                <div className="dt-info-row">
                  <div className="dt-info-label">Jumlah Balasan</div>
                  <div className="dt-info-val">{(tiket.komentar || []).length} pesan</div>
                </div>
              </div>
            </div>

            <div className="dt-info-card">
              <div className="dt-info-title">Navigasi</div>
              <div className="dt-info-body" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Link to="/tiket/saya" style={{ color: "#2563eb", fontWeight: 600, fontSize: 13, textDecoration: "none" }}>
                  ← Kembali ke Tiket Saya
                </Link>
                <Link to="/tiket/buat" style={{ color: "#2563eb", fontWeight: 600, fontSize: 13, textDecoration: "none" }}>
                  + Buat Tiket Baru
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}