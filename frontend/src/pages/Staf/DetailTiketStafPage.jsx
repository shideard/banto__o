import { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import ticketService from "../../services/TicketService";

const styles = `
  .staf-main { padding: 32px 40px; max-width: 1200px; width: 100%; margin: 0 auto; font-family: 'Plus Jakarta Sans', sans-serif; }
  .staf-breadcrumb { font-size: 13px; color: #64748b; margin-bottom: 16px; }
  .staf-breadcrumb span { margin: 0 6px; }
  .staf-breadcrumb a { color: #64748b; text-decoration: none; }
  .staf-breadcrumb a:hover { color: #2563eb; }
  .staf-breadcrumb strong { color: #334155; }

  .detail-top-row { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 28px; flex-wrap: wrap; gap: 12px; }
  .detail-top-row h1 { font-family: 'Fraunces', serif; font-size: 28px; font-weight: 800; color: #0f172a; }
  .detail-actions { display: flex; align-items: center; gap: 10px; }

  .btn-revisi { display: flex; align-items: center; gap: 6px; padding: 9px 18px; border: 1.5px solid #e2e8f0; border-radius: 8px; background: #fff; font-size: 13px; font-weight: 700; color: #334155; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.18s; }
  .btn-revisi:hover { background: #f1f5f9; }
  .btn-revisi:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-selesai { display: flex; align-items: center; gap: 6px; padding: 9px 18px; border: none; border-radius: 8px; background: #2563eb; font-size: 13px; font-weight: 700; color: #fff; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.18s; }
  .btn-selesai:hover { background: #1d4ed8; }
  .btn-selesai:disabled { background: #93c5fd; cursor: not-allowed; }

  .detail-progress { background: #fff; border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 24px 28px; margin-bottom: 24px; display: flex; align-items: center; }
  .progress-step { display: flex; flex-direction: column; align-items: center; gap: 8px; flex: 1; position: relative; }
  .progress-step:not(:last-child)::after { content: ''; position: absolute; top: 18px; left: 50%; width: 100%; height: 2px; background: #e2e8f0; z-index: 0; }
  .progress-step.done:not(:last-child)::after { background: #2563eb; }
  .progress-circle { width: 36px; height: 36px; border-radius: 50%; border: 2px solid #e2e8f0; background: #fff; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; color: #94a3b8; z-index: 1; position: relative; }
  .progress-circle.done { background: #2563eb; border-color: #2563eb; color: #fff; }
  .progress-circle.active { border-color: #2563eb; color: #2563eb; background: #fff; }
  .progress-label { font-size: 12px; font-weight: 600; color: #94a3b8; }
  .progress-label.done, .progress-label.active { color: #2563eb; }

  .detail-layout { display: grid; grid-template-columns: 1fr 300px; gap: 24px; align-items: start; }

  .detail-message-card { background: #fff; border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 24px; margin-bottom: 20px; }
  .detail-msg-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
  .detail-avatar { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #1a4fad, #0ea5e9); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; color: #fff; flex-shrink: 0; }
  .detail-msg-name { font-size: 14px; font-weight: 700; color: #0f172a; }
  .detail-msg-meta { font-size: 12px; color: #94a3b8; }
  .detail-msg-body { font-size: 14px; color: #334155; line-height: 1.7; }

  .detail-history-title { font-size: 17px; font-weight: 700; color: #0f172a; margin-bottom: 16px; }
  .history-system { display: flex; align-items: center; gap: 10px; padding: 12px 16px; background: #f8fafc; border-radius: 10px; margin-bottom: 16px; font-size: 13px; color: #64748b; }
  .history-item { display: flex; gap: 12px; margin-bottom: 16px; }
  .history-item-content { background: #fff; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 16px 18px; flex: 1; }
  .history-item-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
  .history-item-name { font-size: 14px; font-weight: 700; color: #0f172a; }
  .history-item-time { font-size: 12px; color: #94a3b8; }
  .history-item-body { font-size: 13.5px; color: #334155; line-height: 1.6; }

  .reply-box { background: #fff; border: 1.5px solid #e2e8f0; border-radius: 14px; overflow: hidden; margin-top: 8px; }
  .reply-box-title { padding: 14px 18px; font-size: 14px; font-weight: 700; color: #0f172a; border-bottom: 1.5px solid #e2e8f0; }
  .reply-textarea { width: 100%; min-height: 100px; border: none; padding: 14px 18px; font-size: 14px; color: #334155; font-family: 'Plus Jakarta Sans', sans-serif; resize: none; outline: none; background: #fff; box-sizing: border-box; }
  .reply-textarea::placeholder { color: #94a3b8; }
  .reply-footer { padding: 10px 18px; border-top: 1.5px solid #f1f5f9; display: flex; align-items: center; justify-content: flex-end; gap: 10px; }
  .reply-status-note { font-size: 12px; color: #94a3b8; }
  .btn-batal { padding: 8px 16px; border: 1.5px solid #e2e8f0; border-radius: 8px; background: #fff; font-size: 13px; font-weight: 600; color: #334155; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; }
  .btn-batal:hover { background: #f1f5f9; }
  .btn-kirim { display: flex; align-items: center; gap: 6px; padding: 8px 18px; border: none; border-radius: 8px; background: #2563eb; font-size: 13px; font-weight: 700; color: #fff; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; }
  .btn-kirim:hover { background: #1d4ed8; }
  .btn-kirim:disabled { background: #93c5fd; cursor: not-allowed; }

  .detail-info-card { background: #fff; border: 1.5px solid #e2e8f0; border-radius: 14px; overflow: hidden; margin-bottom: 16px; }
  .detail-info-title { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; padding: 14px 18px 10px; border-bottom: 1px solid #f1f5f9; }
  .detail-info-body { padding: 16px 18px; }
  .detail-info-row { margin-bottom: 10px; }
  .detail-info-row .info-label { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
  .detail-info-row .info-val { font-size: 13px; color: #334155; font-weight: 500; }
  .info-badge { display: inline-block; padding: 3px 10px; border-radius: 6px; font-size: 12px; font-weight: 700; background: #f1f5f9; color: #475569; }
  .info-badge.tinggi { background: #fef2f2; color: #dc2626; }

  .staf-status-pill { display: inline-flex; align-items: center; gap: 6px; padding: 5px 10px; border-radius: 100px; font-size: 12px; font-weight: 600; }
  .pill-DIBUAT   { background: #f0fdf4; color: #15803d; }
  .pill-DIKLAIM  { background: #fefce8; color: #a16207; }
  .pill-DIPROSES { background: #fff7ed; color: #c2410c; }
  .pill-SELESAI  { background: #eff6ff; color: #1d4ed8; }
  .pill-REVISI   { background: #fef2f2; color: #dc2626; }

  .state-center { text-align: center; padding: 60px; color: #94a3b8; font-size: 14px; }
  .state-center.error { color: #dc2626; }

  /* Revisi modal */
  .revisi-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 200; display: flex; align-items: center; justify-content: center; }
  .revisi-modal { background: #fff; border-radius: 16px; padding: 28px; width: 460px; box-shadow: 0 20px 60px rgba(0,0,0,0.18); }
  .revisi-modal h3 { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 8px; }
  .revisi-modal p { font-size: 13px; color: #64748b; margin-bottom: 16px; }
  .revisi-modal textarea { width: 100%; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 12px 14px; font-size: 14px; color: #334155; font-family: 'Plus Jakarta Sans', sans-serif; resize: none; min-height: 100px; outline: none; box-sizing: border-box; }
  .revisi-modal textarea:focus { border-color: #2563eb; }
  .revisi-modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 16px; }
`;

const STATUS_STEPS = ["DIBUAT", "DIKLAIM", "DIPROSES", "SELESAI"];

function getStepStatus(tiketStatus, stepStatus) {
  const tiketIdx = STATUS_STEPS.indexOf(tiketStatus === "REVISI" ? "DIPROSES" : tiketStatus);
  const stepIdx  = STATUS_STEPS.indexOf(stepStatus);
  if (stepIdx < tiketIdx) return "done";
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

export default function DetailTiketStafPage() {
  const { id }       = useParams();
  const { user }     = useAuth();
  // const navigate     = useNavigate(); // tidak dipakai

  const [tiket, setTiket]           = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [reply, setReply]           = useState("");
  const [sending, setSending]       = useState(false);
  const [updating, setUpdating]     = useState(false);
  const [showRevisi, setShowRevisi] = useState(false);
  const [catatanRevisi, setCatatanRevisi] = useState("");

  const fetchTiket = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await ticketService.getTiketById(id);
      setTiket(res.data);
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
      await ticketService.addKomentar(id, { isi: reply });
      setReply("");
      await fetchTiket();
    } catch (err) {
      alert(err?.response?.data?.detail || "Gagal mengirim balasan.");
    } finally {
      setSending(false);
    }
  };

  const handleUpdateStatus = async (newStatus, catatan = null) => {
    try {
      setUpdating(true);
      await ticketService.updateStatus(id, { new_status: newStatus, catatan });
      setShowRevisi(false);
      setCatatanRevisi("");
      await fetchTiket();
    } catch (err) {
      alert(err?.response?.data?.detail || "Gagal mengubah status.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <main className="staf-main"><div className="state-center">⏳ Memuat tiket...</div></main>;
  if (error)   return <main className="staf-main"><div className="state-center error">{error}</div></main>;
  if (!tiket)  return null;

  const isMyTicket = tiket.staf_id === user?.id;
  const isSelesai  = tiket.status === "SELESAI";

  return (
    <>
      <style>{styles}</style>

      {/* Modal Revisi */}
      {showRevisi && (
        <div className="revisi-modal-overlay" onClick={() => setShowRevisi(false)}>
          <div className="revisi-modal" onClick={e => e.stopPropagation()}>
            <h3>Minta Revisi</h3>
            <p>Tulis catatan revisi untuk mahasiswa. Catatan ini wajib diisi.</p>
            <textarea
              placeholder="Jelaskan apa yang perlu direvisi oleh mahasiswa..."
              value={catatanRevisi}
              onChange={e => setCatatanRevisi(e.target.value)}
            />
            <div className="revisi-modal-actions">
              <button className="btn-batal" onClick={() => setShowRevisi(false)}>Batal</button>
              <button
                className="btn-kirim"
                disabled={!catatanRevisi.trim() || updating}
                onClick={() => handleUpdateStatus("REVISI", catatanRevisi)}
              >
                {updating ? "Menyimpan..." : "Kirim Revisi"}
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="staf-main">
        <div className="staf-breadcrumb">
          <a href="/staff/dashboard">Dashboard</a><span>›</span>
          <a href="/staff/antrean-tiket">Antrean Tiket</a><span>›</span>
          <strong>Tiket #{id}</strong>
        </div>

        <div className="detail-top-row">
          <h1>{tiket.subjek}</h1>
          {isMyTicket && !isSelesai && (
            <div className="detail-actions">
              <button className="btn-revisi" disabled={updating} onClick={() => setShowRevisi(true)}>
                ⎋ Minta Revisi
              </button>
              <button className="btn-selesai" disabled={updating} onClick={() => handleUpdateStatus("SELESAI")}>
                {updating ? "Menyimpan..." : "✓ Tandai Selesai"}
              </button>
            </div>
          )}
        </div>

        {/* Progress */}
        <div className="detail-progress">
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

        <div className="detail-layout">
          {/* LEFT */}
          <div>
            {/* Original message */}
            <div className="detail-message-card">
              <div className="detail-msg-header">
                <div className="detail-avatar">{getInitials(user?.nama || "M")}</div>
                <div>
                  <div className="detail-msg-name">Pelapor</div>
                  <div className="detail-msg-meta">
                    {formatDateTime(tiket.tanggal_dibuat)}
                  </div>
                </div>
              </div>
              <div className="detail-msg-body">
                {tiket.pengajuan?.deskripsi || "Tidak ada deskripsi."}
              </div>
            </div>

            {/* Riwayat Komentar */}
            <div className="detail-history-title">Riwayat &amp; Tanggapan</div>

            <div className="history-system">
              <div className="detail-avatar" style={{ width: 28, height: 28, fontSize: 12, background: "#f1f5f9", color: "#64748b" }}>📧</div>
              <span><strong>Sistem</strong> — tiket dibuat pada {formatDateTime(tiket.tanggal_dibuat)}</span>
            </div>

            {(tiket.komentar || []).map((k) => (
              <div key={k.id} className="history-item">
                <div
                  className="detail-avatar"
                  style={{
                    width: 36, height: 36, fontSize: 13, flexShrink: 0,
                    background: k.role === "Staff Administrasi"
                      ? "linear-gradient(135deg, #7c3aed, #a855f7)"
                      : "linear-gradient(135deg, #1a4fad, #0ea5e9)"
                  }}
                >
                  {k.role === "Staff Administrasi" ? "ST" : "MH"}
                </div>
                <div className="history-item-content">
                  <div className="history-item-header">
                    <span className="history-item-name">{k.role}</span>
                    <span className="history-item-time">{formatDateTime(k.waktu)}</span>
                  </div>
                  <div className="history-item-body">{k.isi}</div>
                </div>
              </div>
            ))}

            {/* Reply box — hanya tampil jika staf yang mengklaim dan belum selesai */}
            {isMyTicket && !isSelesai && (
              <div className="reply-box">
                <div className="reply-box-title">Tulis Tanggapan</div>
                <textarea
                  className="reply-textarea"
                  placeholder="Ketik pesan atau minta informasi tambahan ke mahasiswa..."
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                />
                <div className="reply-footer">
                  <span className="reply-status-note">Tiket akan tetap dalam status '{tiket.status}'</span>
                  <button className="btn-batal" onClick={() => setReply("")}>Batal</button>
                  <button className="btn-kirim" disabled={!reply.trim() || sending} onClick={handleKirimBalasan}>
                    {sending ? "Mengirim..." : "Kirim Tanggapan ▷"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT sidebar */}
          <div>
            <div className="detail-info-card">
              <div className="detail-info-title">Detail Tiket</div>
              <div className="detail-info-body">
                <div className="detail-info-row">
                  <div className="info-label">ID Tiket</div>
                  <div className="info-val">#{tiket.id}</div>
                </div>
                <div className="detail-info-row">
                  <div className="info-label">Status</div>
                  <div className="info-val">
                    <span className={`staf-status-pill pill-${tiket.status}`}>{tiket.status}</span>
                  </div>
                </div>
                <div className="detail-info-row">
                  <div className="info-label">Kategori</div>
                  <div className="info-val">{tiket.kategori_id ? `Kategori #${tiket.kategori_id}` : "—"}</div>
                </div>
                <div className="detail-info-row">
                  <div className="info-label">Dibuat Pada</div>
                  <div className="info-val">{formatDateTime(tiket.tanggal_dibuat)}</div>
                </div>
                <div className="detail-info-row">
                  <div className="info-label">Staf Penanganan</div>
                  <div className="info-val">{tiket.staf_id ? `Staf #${tiket.staf_id}` : "Belum diklaim"}</div>
                </div>
              </div>
            </div>

            {!isMyTicket && tiket.status === "DIBUAT" && (
              <div className="detail-info-card">
                <div className="detail-info-body" style={{ padding: "16px" }}>
                  <button
                    className="btn-selesai"
                    style={{ width: "100%", justifyContent: "center" }}
                    disabled={updating}
                    onClick={async () => {
                      try {
                        setUpdating(true);
                        await ticketService.claimTiket(id, { staf_id: user?.id });
                        await fetchTiket();
                      } catch (err) {
                        alert(err?.response?.data?.detail || "Gagal mengklaim.");
                      } finally {
                        setUpdating(false);
                      }
                    }}
                  >
                    {updating ? "Mengklaim..." : "🙋 Klaim Tiket Ini"}
                  </button>
                </div>
              </div>
            )}

            <div className="detail-info-card">
              <div className="detail-info-title">Navigasi</div>
              <div className="detail-info-body" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Link to="/staff/antrean-tiket" style={{ color: "#2563eb", fontWeight: 600, fontSize: 13, textDecoration: "none" }}>← Kembali ke Antrean</Link>
                <Link to="/staff/tugas-saya" style={{ color: "#2563eb", fontWeight: 600, fontSize: 13, textDecoration: "none" }}>← Tugas Saya</Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}