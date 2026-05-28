import { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import ticketService from "../../services/ticketService";
import { useToast } from "../../components/ui/Toast";

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

  .btn-tolak { display: flex; align-items: center; gap: 6px; padding: 9px 18px; border: 1.5px solid #fecaca; border-radius: 8px; background: #fff; font-size: 13px; font-weight: 700; color: #dc2626; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.18s; }
  .btn-tolak:hover { background: #fef2f2; }
  .btn-tolak:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-revisi { display: flex; align-items: center; gap: 6px; padding: 9px 18px; border: 1.5px solid #e2e8f0; border-radius: 8px; background: #fff; font-size: 13px; font-weight: 700; color: #334155; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.18s; }
  .btn-revisi:hover { background: #f1f5f9; }
  .btn-revisi:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-proses { display: flex; align-items: center; gap: 6px; padding: 9px 18px; border: none; border-radius: 8px; background: #2563eb; font-size: 13px; font-weight: 700; color: #fff; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.18s; }
  .btn-proses:hover { background: #1d4ed8; }
  .btn-proses:disabled { background: #93c5fd; cursor: not-allowed; }
  .btn-selesai { display: flex; align-items: center; gap: 6px; padding: 9px 18px; border: none; border-radius: 8px; background: #16a34a; font-size: 13px; font-weight: 700; color: #fff; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.18s; }
  .btn-selesai:hover { background: #15803d; }
  .btn-selesai:disabled { background: #86efac; cursor: not-allowed; }

  .detail-progress { background: #fff; border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 24px 28px; margin-bottom: 24px; display: flex; align-items: center; }
  .progress-step { display: flex; flex-direction: column; align-items: center; gap: 8px; flex: 1; position: relative; }
  .progress-step:not(:last-child)::after { content: ''; position: absolute; top: 18px; left: 50%; width: 100%; height: 2px; background: #e2e8f0; z-index: 0; }
  .progress-step.done:not(:last-child)::after { background: #2563eb; }
  .progress-circle { width: 36px; height: 36px; border-radius: 50%; border: 2px solid #e2e8f0; background: #fff; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; color: #94a3b8; z-index: 1; position: relative; }
  .progress-circle.done { background: #2563eb; border-color: #2563eb; color: #fff; }
  .progress-circle.active { border-color: #2563eb; color: #2563eb; background: #fff; }
  .progress-circle.rejected { background: #dc2626; border-color: #dc2626; color: #fff; }
  .progress-label { font-size: 12px; font-weight: 600; color: #94a3b8; }
  .progress-label.done, .progress-label.active { color: #2563eb; }
  .progress-label.rejected { color: #dc2626; }

  .ditolak-banner { background: #fef2f2; border: 1.5px solid #fecaca; border-radius: 12px; padding: 16px 20px; margin-bottom: 24px; display: flex; align-items: center; gap: 10px; font-size: 14px; color: #dc2626; font-weight: 600; }

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
  .history-item-content.file-item { background: #f8fafc; border-style: dashed; }
  .history-item-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
  .history-item-name { font-size: 14px; font-weight: 700; color: #0f172a; }
  .history-item-time { font-size: 12px; color: #94a3b8; }
  .history-item-body { font-size: 13.5px; color: #334155; line-height: 1.6; }

  .pending-action-banner { background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 12px; padding: 20px 24px; margin-bottom: 20px; }
  .pending-action-banner h3 { font-size: 15px; font-weight: 700; color: #92400e; margin-bottom: 6px; }
  .pending-action-banner p { font-size: 13px; color: #a16207; margin-bottom: 16px; line-height: 1.5; }
  .pending-action-btns { display: flex; gap: 10px; }

  .reply-box { background: #fff; border: 1.5px solid #e2e8f0; border-radius: 14px; overflow: hidden; margin-top: 8px; }
  .reply-box-title { padding: 14px 18px; font-size: 14px; font-weight: 700; color: #0f172a; border-bottom: 1.5px solid #e2e8f0; }
  .reply-textarea { width: 100%; min-height: 100px; border: none; padding: 14px 18px; font-size: 14px; color: #334155; font-family: 'Plus Jakarta Sans', sans-serif; resize: none; outline: none; background: #fff; box-sizing: border-box; }
  .reply-textarea::placeholder { color: #94a3b8; }
  .reply-file-row { padding: 8px 18px; border-top: 1px solid #f1f5f9; display: flex; align-items: center; gap: 10px; }
  .reply-file-label { font-size: 13px; color: #64748b; cursor: pointer; display: flex; align-items: center; gap: 6px; padding: 6px 12px; border: 1.5px dashed #e2e8f0; border-radius: 8px; transition: all 0.15s; }
  .reply-file-label:hover { border-color: #2563eb; color: #2563eb; }
  .reply-file-name { font-size: 12px; color: #2563eb; font-weight: 600; }
  .btn-upload { padding: 6px 14px; border: none; border-radius: 8px; background: #f1f5f9; font-size: 13px; font-weight: 600; color: #334155; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; }
  .btn-upload:hover { background: #e2e8f0; }
  .btn-upload:disabled { opacity: 0.5; cursor: not-allowed; }
  .reply-footer { padding: 10px 18px; border-top: 1.5px solid #f1f5f9; display: flex; align-items: center; justify-content: flex-end; gap: 10px; }
  .reply-status-note { font-size: 12px; color: #94a3b8; flex: 1; }
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

  .staf-status-pill { display: inline-flex; align-items: center; gap: 6px; padding: 5px 10px; border-radius: 100px; font-size: 12px; font-weight: 600; }
  .pill-DIBUAT   { background: #f0fdf4; color: #15803d; }
  .pill-DIKLAIM  { background: #fefce8; color: #a16207; }
  .pill-DIPROSES { background: #fff7ed; color: #c2410c; }
  .pill-SELESAI  { background: #eff6ff; color: #1d4ed8; }
  .pill-REVISI   { background: #fef2f2; color: #dc2626; }
  .pill-DITOLAK  { background: #fef2f2; color: #991b1b; }

  .state-center { text-align: center; padding: 60px; color: #94a3b8; font-size: 14px; }
  .state-center.error { color: #dc2626; }

  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 200; display: flex; align-items: center; justify-content: center; }
  .modal-box { background: #fff; border-radius: 16px; padding: 28px; width: 460px; box-shadow: 0 20px 60px rgba(0,0,0,0.18); }
  .modal-box h3 { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 8px; }
  .modal-box p { font-size: 13px; color: #64748b; margin-bottom: 16px; }
  .modal-box textarea { width: 100%; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 12px 14px; font-size: 14px; color: #334155; font-family: 'Plus Jakarta Sans', sans-serif; resize: none; min-height: 100px; outline: none; box-sizing: border-box; }
  .modal-box textarea:focus { border-color: #2563eb; }
  .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 16px; }
`;

const STATUS_STEPS = ["DIBUAT", "DIKLAIM", "DIPROSES", "SELESAI"];

function getStepStatus(tiketStatus, stepStatus) {
  if (tiketStatus === "DITOLAK") {
    if (stepStatus === "DIBUAT" || stepStatus === "DIKLAIM") return "done";
    return "";
  }
  const tiketIdx = STATUS_STEPS.indexOf(tiketStatus === "REVISI" ? "DIPROSES" : tiketStatus);
  const stepIdx  = STATUS_STEPS.indexOf(stepStatus);
  if (stepIdx < tiketIdx) return "done";
  if (stepIdx === tiketIdx) return "active";
  return "";
}

function formatDateTime(str) {
  if (!str) return "—";
  return new Date(str).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
}

function isFileKomentar(isi = "") {
  return isi.startsWith("[FILE]");
}

function getFileName(isi = "") {
  return isi.replace("[FILE]", "").split("—")[0].trim();
}

export default function DetailTiketStafPage() {
  const { id }   = useParams();
  const { user } = useAuth();
  const toast    = useToast();

  const [tiket, setTiket]                 = useState(null);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [reply, setReply]                 = useState("");
  const [sending, setSending]             = useState(false);
  const [updating, setUpdating]           = useState(false);
  const [showRevisi, setShowRevisi]       = useState(false);
  const [showTolak, setShowTolak]         = useState(false);
  const [catatanRevisi, setCatatanRevisi] = useState("");
  const [alasanTolak, setAlasanTolak]     = useState("");
  const [fileUpload, setFileUpload]       = useState(null);
  const [uploading, setUploading]         = useState(false);

  const fetchTiket = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await ticketService.getTiketById(id);
      setTiket(res);
    } catch {
      setError("Tiket tidak ditemukan atau Anda tidak memiliki akses.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchTiket(); }, [fetchTiket]);

  const handleMulaiProses = async () => {
    try {
      setUpdating(true);
      await ticketService.mulaiProses(id);
      await fetchTiket();
      toast.success('Tiket sedang diproses', 'Status berhasil diubah ke DIPROSES.');
    } catch (err) {
      toast.error('Gagal memproses tiket', err?.response?.data?.detail || 'Terjadi kesalahan.');
    } finally {
      setUpdating(false);
    }
  };

  const handleTolak = async () => {
    if (!alasanTolak.trim()) return;
    try {
      setUpdating(true);
      await ticketService.tolakTiket(id, alasanTolak);
      setShowTolak(false);
      setAlasanTolak("");
      await fetchTiket();
      toast.warning('Tiket ditolak', 'Mahasiswa akan menerima notifikasi penolakan.');
    } catch (err) {
      toast.error('Gagal menolak tiket', err?.response?.data?.detail || 'Terjadi kesalahan.');
    } finally {
      setUpdating(false);
    }
  };

  const handleKirimBalasan = async () => {
    if (!reply.trim()) return;
    try {
      setSending(true);
      await ticketService.addKomentar(id, reply);
      setReply("");
      await fetchTiket();
      toast.success('Balasan terkirim', 'Mahasiswa akan mendapat notifikasi.');
    } catch (err) {
      toast.error('Gagal mengirim balasan', err?.response?.data?.detail || 'Terjadi kesalahan.');
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
      if (newStatus === 'SELESAI') toast.success('Tiket selesai! ✅', 'Mahasiswa telah diberitahu.');
      else toast.info(`Status diubah ke ${newStatus}`, 'Mahasiswa akan mendapat notifikasi.');
    } catch (err) {
      toast.error('Gagal mengubah status', err?.response?.data?.detail || 'Terjadi kesalahan.');
    } finally {
      setUpdating(false);
    }
  };

  const handleUploadFile = async () => {
    if (!fileUpload) return;
    try {
      setUploading(true);
      await ticketService.uploadFile(id, fileUpload);
      setFileUpload(null);
      await fetchTiket();
      toast.success('File berhasil diupload');
    } catch (err) {
      toast.error('Gagal upload file', err?.response?.data?.detail || 'Terjadi kesalahan.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <main className="staf-main"><div className="state-center">⏳ Memuat tiket...</div></main>;
  if (error)   return <main className="staf-main"><div className="state-center error">{error}</div></main>;
  if (!tiket)  return null;

  const isMyTicket = tiket.staf_id === user?.id;
  const isSelesai  = tiket.status === "SELESAI";
  const isDitolak  = tiket.status === "DITOLAK";
  const isDiklaim  = tiket.status === "DIKLAIM";
  const isDiproses = tiket.status === "DIPROSES" || tiket.status === "REVISI";
  const canComment = isMyTicket && isDiproses;

  return (
    <>
      <style>{styles}</style>

      {/* Modal Revisi */}
      {showRevisi && (
        <div className="modal-overlay" onClick={() => setShowRevisi(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3>Minta Revisi</h3>
            <p>Tulis catatan revisi untuk mahasiswa. Catatan ini wajib diisi.</p>
            <textarea
              placeholder="Jelaskan apa yang perlu direvisi oleh mahasiswa..."
              value={catatanRevisi}
              onChange={e => setCatatanRevisi(e.target.value)}
            />
            <div className="modal-actions">
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

      {/* Modal Tolak */}
      {showTolak && (
        <div className="modal-overlay" onClick={() => setShowTolak(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3>Tolak Tiket</h3>
            <p>Tulis alasan penolakan. Mahasiswa akan menerima notifikasi beserta alasan ini.</p>
            <textarea
              placeholder="Jelaskan alasan penolakan tiket ini..."
              value={alasanTolak}
              onChange={e => setAlasanTolak(e.target.value)}
            />
            <div className="modal-actions">
              <button className="btn-batal" onClick={() => setShowTolak(false)}>Batal</button>
              <button
                className="btn-kirim"
                style={{ background: "#dc2626" }}
                disabled={!alasanTolak.trim() || updating}
                onClick={handleTolak}
              >
                {updating ? "Menolak..." : "Tolak Tiket"}
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="staf-main">
        <div className="staf-breadcrumb">
          <Link to="/staff/dashboard">Dashboard</Link><span>›</span>
          <Link to="/staff/antrean-tiket">Antrean Tiket</Link><span>›</span>
          <strong>Tiket #{id}</strong>
        </div>

        {/* Header */}
        <div className="detail-top-row">
          <h1>{tiket.subjek}</h1>
          {isMyTicket && !isSelesai && !isDitolak && (
            <div className="detail-actions">
              {isDiklaim && (
                <>
                  <button className="btn-tolak" disabled={updating} onClick={() => setShowTolak(true)}>
                    ✕ Tolak Tiket
                  </button>
                  <button className="btn-proses" disabled={updating} onClick={handleMulaiProses}>
                    {updating ? "Memproses..." : "▷ Proses Tiket"}
                  </button>
                </>
              )}
              {isDiproses && (
                <>
                  <button className="btn-revisi" disabled={updating} onClick={() => setShowRevisi(true)}>
                    ⎋ Minta Revisi
                  </button>
                  <button className="btn-selesai" disabled={updating} onClick={() => handleUpdateStatus("SELESAI")}>
                    {updating ? "Menyimpan..." : "✓ Tandai Selesai"}
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Banner ditolak */}
        {isDitolak && (
          <div className="ditolak-banner">
            ✕ Tiket ini telah ditolak oleh staf. Lihat riwayat komentar untuk alasan penolakan.
          </div>
        )}

        {/* Progress */}
        <div className="detail-progress">
          {STATUS_STEPS.map((step, i) => {
            const s = getStepStatus(tiket.status, step);
            const isRejectedStep = isDitolak && step === "DIKLAIM";
            return (
              <div key={i} className={`progress-step ${s}`}>
                <div className={`progress-circle ${isRejectedStep ? "rejected" : s}`}>
                  {isRejectedStep ? "✕" : s === "done" ? "✓" : i + 1}
                </div>
                <div className={`progress-label ${isRejectedStep ? "rejected" : s}`}>
                  {step.charAt(0) + step.slice(1).toLowerCase()}
                </div>
              </div>
            );
          })}
        </div>

        {/* Banner pending action */}
        {isMyTicket && isDiklaim && (
          <div className="pending-action-banner">
            <h3>⏳ Menunggu Keputusan Anda</h3>
            <p>
              Tinjau detail tiket ini. Jika siap ditangani, klik <strong>Proses Tiket</strong>.
              Jika tidak bisa ditangani, klik <strong>Tolak Tiket</strong> dan berikan alasan.
            </p>
            <div className="pending-action-btns">
              <button className="btn-tolak" disabled={updating} onClick={() => setShowTolak(true)}>
                ✕ Tolak Tiket
              </button>
              <button className="btn-proses" disabled={updating} onClick={handleMulaiProses}>
                {updating ? "Memproses..." : "▷ Proses Tiket"}
              </button>
            </div>
          </div>
        )}

        <div className="detail-layout">
          {/* LEFT */}
          <div>
            {/* Pesan awal mahasiswa */}
            <div className="detail-message-card">
              <div className="detail-msg-header">
                <div className="detail-avatar">
                  {tiket.mahasiswa_nama ? tiket.mahasiswa_nama.slice(0, 2).toUpperCase() : "MH"}
                </div>
                <div>
                  <div className="detail-msg-name">{tiket.mahasiswa_nama || "Pelapor (Mahasiswa)"}</div>
                  <div className="detail-msg-meta">{formatDateTime(tiket.tanggal_dibuat)}</div>
                </div>
              </div>
              <div className="detail-msg-body">
                {tiket.pengajuan?.deskripsi || "Tidak ada deskripsi."}
              </div>
            </div>

            {/* Riwayat */}
            <div className="detail-history-title">Riwayat &amp; Tanggapan</div>
            <div className="history-system">
              <span>📧</span>
              <span><strong>Sistem</strong> — tiket dibuat pada {formatDateTime(tiket.tanggal_dibuat)}</span>
            </div>

            {(tiket.komentar || []).map((k) => {
              const isFile  = isFileKomentar(k.isi);
              const isStaf  = k.role === "Staff Administrasi";
              const displayName = isStaf
                ? (tiket.staf_nama || k.role)
                : (tiket.mahasiswa_nama || k.role);
              const initials = displayName.slice(0, 2).toUpperCase();
              return (
                <div key={k.id} className="history-item">
                  <div
                    className="detail-avatar"
                    style={{
                      width: 36, height: 36, fontSize: 13, flexShrink: 0,
                      background: isStaf
                        ? "linear-gradient(135deg, #7c3aed, #a855f7)"
                        : "linear-gradient(135deg, #1a4fad, #0ea5e9)"
                    }}
                  >
                    {initials}
                  </div>
                  <div className={`history-item-content ${isFile ? "file-item" : ""}`}>
                    <div className="history-item-header">
                      <span className="history-item-name">{displayName}</span>
                      <span className="history-item-time">{formatDateTime(k.waktu)}</span>
                    </div>
                    <div className="history-item-body">
                      {isFile ? (
                        <span>📎 <strong>{getFileName(k.isi)}</strong></span>
                      ) : k.isi}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Reply box */}
            {canComment && (
              <div className="reply-box">
                <div className="reply-box-title">Tulis Tanggapan</div>
                <textarea
                  className="reply-textarea"
                  placeholder="Ketik pesan atau minta informasi tambahan ke mahasiswa..."
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                />
                <div className="reply-file-row">
                  <label className="reply-file-label">
                    📎 Lampirkan file (opsional)
                    <input
                      type="file"
                      style={{ display: "none" }}
                      onChange={e => setFileUpload(e.target.files[0] || null)}
                    />
                  </label>
                  {fileUpload && (
                    <>
                      <span className="reply-file-name">{fileUpload.name}</span>
                      <button className="btn-upload" disabled={uploading} onClick={handleUploadFile}>
                        {uploading ? "Mengupload..." : "Upload"}
                      </button>
                      <button className="btn-batal" onClick={() => setFileUpload(null)}>✕</button>
                    </>
                  )}
                </div>
                <div className="reply-footer">
                  <span className="reply-status-note">Status tiket: <strong>{tiket.status}</strong></span>
                  <button className="btn-batal" onClick={() => setReply("")}>Batal</button>
                  <button
                    className="btn-kirim"
                    disabled={!reply.trim() || sending}
                    onClick={handleKirimBalasan}
                  >
                    {sending ? "Mengirim..." : "Kirim Tanggapan ▷"}
                  </button>
                </div>
              </div>
            )}

            {isMyTicket && isDiklaim && (
              <div style={{ textAlign: "center", padding: "24px", color: "#94a3b8", fontSize: 13, background: "#f8fafc", borderRadius: 12, border: "1.5px dashed #e2e8f0" }}>
                💬 Kolom pesan akan tersedia setelah Anda memilih untuk memproses tiket ini.
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
                  <div className="info-val">{tiket.kategori_nama || "—"}</div>
                </div>
                <div className="detail-info-row">
                  <div className="info-label">Dibuat Pada</div>
                  <div className="info-val">{formatDateTime(tiket.tanggal_dibuat)}</div>
                </div>
                <div className="detail-info-row">
                  <div className="info-label">Pelapor (Mahasiswa)</div>
                  <div className="info-val">
                    {tiket.mahasiswa_nama || (tiket.mahasiswa_id ? `Mahasiswa #${tiket.mahasiswa_id}` : "—")}
                  </div>
                </div>
                <div className="detail-info-row">
                  <div className="info-label">Staf Penanganan</div>
                  <div className="info-val">
                    {tiket.staf_nama || (tiket.staf_id ? `Staf #${tiket.staf_id}` : "Belum diklaim")}
                  </div>
                </div>
              </div>
            </div>

            {/* Tombol klaim */}
            {!isMyTicket && tiket.status === "DIBUAT" && (
              <div className="detail-info-card">
                <div className="detail-info-body">
                  <button
                    className="btn-proses"
                    style={{ width: "100%", justifyContent: "center" }}
                    disabled={updating}
                    onClick={async () => {
                      try {
                        setUpdating(true);
                        await ticketService.claimTiket(id, { staf_id: user?.id });
                        await fetchTiket();
                        toast.success('Tiket berhasil diklaim! 🙋', 'Silakan proses tiket ini sekarang.');
                      } catch (err) {
                        toast.error('Gagal mengklaim tiket', err?.response?.data?.detail || 'Terjadi kesalahan.');
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