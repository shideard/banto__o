import { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import ticketService from "../../services/TicketService";

const styles = `
  .mhs-main { padding: 32px 40px; max-width: 1200px; width: 100%; margin: 0 auto; font-family: 'Plus Jakarta Sans', sans-serif; background: #f8fafc; min-height: 100vh; }
  .mhs-breadcrumb { font-size: 13px; color: #64748b; margin-bottom: 16px; }
  .mhs-breadcrumb span { margin: 0 6px; }
  .mhs-breadcrumb a { color: #64748b; text-decoration: none; }
  .mhs-breadcrumb a:hover { color: #2563eb; }
  .mhs-breadcrumb strong { color: #334155; }

  .detail-top-row { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
  .detail-top-row h1 { font-size: 24px; font-weight: 800; color: #0f172a; margin: 0; }

  /* Progress Bar */
  .detail-progress { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; padding: 0 10px; }
  .progress-step { display: flex; flex-direction: column; align-items: center; gap: 8px; flex: 1; position: relative; }
  .progress-step:not(:last-child)::after { content: ''; position: absolute; top: 16px; left: 50%; width: 100%; height: 2px; background: #e2e8f0; z-index: 0; }
  .progress-step.done:not(:last-child)::after { background: #2563eb; }
  .progress-circle { width: 32px; height: 32px; border-radius: 50%; border: 2px solid #e2e8f0; background: #fff; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; color: #94a3b8; z-index: 1; position: relative; }
  .progress-circle.done { background: #2563eb; border-color: #2563eb; color: #fff; }
  .progress-circle.active { border-color: #2563eb; color: #2563eb; background: #feffff; }
  .progress-label { font-size: 12px; font-weight: 700; color: #94a3b8; }
  .progress-label.done { color: #0f172a; }
  .progress-label.active { color: #2563eb; }

  /* Layout */
  .detail-layout { display: grid; grid-template-columns: 1fr 320px; gap: 24px; align-items: start; }

  /* Left Panel - Messages & History */
  .detail-message-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 24px; }
  .detail-msg-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
  .detail-avatar { width: 40px; height: 40px; border-radius: 8px; background: #e0e7ff; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; color: #1e40af; flex-shrink: 0; }
  .detail-msg-name { font-size: 14px; font-weight: 700; color: #0f172a; }
  .detail-msg-meta { font-size: 12px; color: #64748b; margin-top: 2px; }
  .detail-msg-body { font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 16px; }
  
  .attachment-title { font-size: 11px; font-weight: 700; color: #64748b; display: flex; align-items: center; gap: 6px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
  .attachment-img { max-width: 200px; border-radius: 6px; border: 1px solid #e2e8f0; cursor: pointer; }

  .detail-history-title { font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 16px; border-top: 1px solid #e2e8f0; padding-top: 24px; }
  
  .history-system { display: flex; align-items: center; gap: 10px; padding: 12px 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 16px; font-size: 13px; color: #475569; }
  .history-system svg { color: #64748b; width: 16px; height: 16px; }
  
  .history-item { display: flex; gap: 12px; margin-bottom: 16px; border-left: 2px solid #e2e8f0; padding-left: 16px; position: relative; }
  .history-item::before { content: ''; position: absolute; left: -6px; top: 0; width: 10px; height: 10px; border-radius: 50%; background: #e2e8f0; }
  .history-item-content { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; flex: 1; }
  .history-item-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
  .history-item-name { font-size: 14px; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 8px; }
  .history-item-time { font-size: 12px; color: #94a3b8; }
  .history-item-body { font-size: 14px; color: #334155; line-height: 1.6; }
  
  .avatar-sm { width: 24px; height: 24px; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; }
  .avatar-staff { background: #e0f2fe; color: #0369a1; }
  .avatar-mhs { background: #e0e7ff; color: #1e40af; }

  /* Reply Box */
  .reply-box { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; margin-top: 16px; }
  .reply-box-title { padding: 14px 18px; font-size: 14px; font-weight: 700; color: #0f172a; border-bottom: 1px solid #e2e8f0; background: #f8fafc; }
  .reply-toolbar { display: flex; gap: 12px; padding: 10px 16px; border-bottom: 1px solid #e2e8f0; color: #475569; font-size: 14px; }
  .reply-toolbar span { cursor: pointer; display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 4px; }
  .reply-toolbar span:hover { background: #f1f5f9; }
  .reply-toolbar .divider { width: 1px; background: #e2e8f0; height: 20px; margin: 0 4px; }
  
  .reply-textarea { width: 100%; min-height: 120px; border: none; padding: 16px; font-size: 14px; color: #334155; font-family: inherit; resize: none; outline: none; box-sizing: border-box; }
  .reply-textarea::placeholder { color: #94a3b8; }
  
  .reply-attachment { padding: 12px; margin: 0 16px 16px; border: 1px dashed #cbd5e1; border-radius: 6px; text-align: center; font-size: 13px; color: #64748b; cursor: pointer; }
  .reply-attachment:hover { background: #f8fafc; border-color: #94a3b8; }
  .reply-attachment strong { color: #2563eb; font-weight: 600; }

  .reply-footer { padding: 12px 16px; border-top: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between; background: #fcfcfc; }
  .reply-status-note { font-size: 12px; color: #64748b; }
  .reply-actions { display: flex; gap: 10px; }
  
  .btn-batal { padding: 8px 16px; border: none; background: transparent; font-size: 13px; font-weight: 600; color: #64748b; cursor: pointer; font-family: inherit; }
  .btn-batal:hover { color: #334155; }
  .btn-kirim { display: flex; align-items: center; gap: 6px; padding: 8px 20px; border: none; border-radius: 6px; background: #0033a0; font-size: 13px; font-weight: 600; color: #fff; cursor: pointer; font-family: inherit; }
  .btn-kirim:hover { background: #002277; }
  .btn-kirim:disabled { background: #93c5fd; cursor: not-allowed; }

  /* Right Panel - Info Cards */
  .info-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 16px; overflow: hidden; }
  .info-card-title { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; padding: 14px 16px; border-bottom: 1px solid #e2e8f0; background: #f8fafc; }
  .info-card-body { padding: 16px; }
  
  .info-user-row { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
  .info-user-avatar { width: 36px; height: 36px; border-radius: 8px; background: #e0e7ff; color: #1e40af; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; }
  .info-user-name { font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 2px; }
  .info-user-nim { font-size: 12px; color: #64748b; }
  
  .info-meta-group { margin-bottom: 12px; }
  .info-meta-group:last-child { margin-bottom: 0; }
  .info-meta-label { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px; }
  .info-meta-val { font-size: 13px; color: #334155; }

  .detail-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #f1f5f9; }
  .detail-row:last-child { border-bottom: none; padding-bottom: 0; }
  .detail-label { font-size: 13px; color: #64748b; }
  .detail-val { font-size: 13px; font-weight: 600; color: #0f172a; text-align: right; }
  
  .badge-kategori { background: #f1f5f9; color: #475569; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; }
  .badge-prioritas { color: #dc2626; display: flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 700; }

  .state-center { text-align: center; padding: 60px; color: #94a3b8; font-size: 14px; }
  .state-center.error { color: #dc2626; }
`;

const STATUS_STEPS = ["Dibuat", "Diklaim", "Diproses", "Selesai"];

function getStepIcon(tiketStatus, stepStatus) {
  const statusMap = { "DIBUAT": 0, "DIKLAIM": 1, "DIPROSES": 2, "SELESAI": 3 };
  const tiketIdx = statusMap[tiketStatus] ?? 0;
  const stepIdx = STATUS_STEPS.indexOf(stepStatus);

  if (stepIdx < tiketIdx || tiketStatus === "SELESAI") {
    return <span className="progress-circle done">✓</span>;
  }
  if (stepIdx === tiketIdx) {
    if (stepStatus === "Diproses") return <span className="progress-circle active">↻</span>;
    if (stepStatus === "Selesai") return <span className="progress-circle active">⚑</span>;
    return <span className="progress-circle active">✓</span>;
  }
  
  if (stepStatus === "Diproses") return <span className="progress-circle">↻</span>;
  if (stepStatus === "Selesai") return <span className="progress-circle">⚑</span>;
  return <span className="progress-circle">✓</span>;
}

function getStepClass(tiketStatus, stepStatus) {
  const statusMap = { "DIBUAT": 0, "DIKLAIM": 1, "DIPROSES": 2, "SELESAI": 3 };
  const tiketIdx = statusMap[tiketStatus] ?? 0;
  const stepIdx = STATUS_STEPS.indexOf(stepStatus);
  if (stepIdx < tiketIdx || tiketStatus === "SELESAI") return "done";
  if (stepIdx === tiketIdx) return "active";
  return "";
}

function getInitials(nama = "") {
  return nama.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "AN";
}

function formatDateTime(str) {
  if (!str) return "—";
  // Menyesuaikan format sesuai mockup: "12 Okt 2023, 08:30 AM"
  const date = new Date(str);
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  const datePart = date.toLocaleDateString("id-ID", options);
  const timePart = date.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' });
  return `${datePart}, ${timePart}`;
}

export default function DetailTiketPage() {
  const { id } = useParams();
  const { user } = useAuth(); // Mahasiswa yang sedang login

  const [tiket, setTiket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

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

  if (loading) return <main className="mhs-main"><div className="state-center">⏳ Memuat tiket...</div></main>;
  if (error) return <main className="mhs-main"><div className="state-center error">{error}</div></main>;
  if (!tiket) return null;

  return (
    <>
      <style>{styles}</style>
      <main className="mhs-main">
        <div className="mhs-breadcrumb">
          <Link to="/mahasiswa/dashboard">Dashboard</Link><span>›</span>
          <Link to="/mahasiswa/tiket-saya">Antrean Tiket</Link><span>›</span>
          <strong>{tiket.id || "TKT-2023-0891"}</strong>
        </div>

        <div className="detail-top-row">
          <h1>{tiket.subjek || "Masalah Akses Portal Akademik"}</h1>
        </div>

        {/* Progress Bar */}
        <div className="detail-progress">
          {STATUS_STEPS.map((step, i) => {
            const statusClass = getStepClass(tiket.status || "DIPROSES", step);
            return (
              <div key={i} className={`progress-step ${statusClass}`}>
                {getStepIcon(tiket.status || "DIPROSES", step)}
                <div className={`progress-label ${statusClass}`}>{step}</div>
              </div>
            );
          })}
        </div>

        <div className="detail-layout">
          {/* LEFT PANEL */}
          <div>
            {/* Pesan Original */}
            <div className="detail-message-card">
              <div className="detail-msg-header">
                <div className="detail-avatar">{getInitials(user?.nama || "Ahmad Nuruddin")}</div>
                <div>
                  <div className="detail-msg-name">{user?.nama || "Ahmad Nuruddin"}</div>
                  <div className="detail-msg-meta">
                    {user?.nim || "G64190082"} • {formatDateTime(tiket.tanggal_dibuat || "2023-10-12T08:30:00")}
                  </div>
                </div>
              </div>
              <div className="detail-msg-body">
                {tiket.pengajuan?.deskripsi || 
                  "Selamat pagi, saya mengalami kendala saat mencoba login ke Portal Akademik menggunakan SSO. Selalu muncul pesan error \"Authentication Failed\" meskipun password yang saya masukkan sudah benar. Saya sudah mencoba membersihkan cache browser dan menggunakan mode incognito, tetapi hasilnya tetap sama. Mohon bantuannya karena saya perlu mengisi KRS hari ini."}
              </div>
              
              {/* Dummy Lampiran */}
              <div className="attachment-title">
                📎 LAMPIRAN (1)
              </div>
              <img 
                src="https://via.placeholder.com/200x120.png?text=Error+Screenshot" 
                alt="Lampiran Error" 
                className="attachment-img"
              />
            </div>

            {/* Riwayat & Tanggapan */}
            <div className="detail-history-title">Riwayat & Tanggapan</div>

            <div className="history-system">
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
              <span><strong>Sistem</strong> mengalihkan tiket ini ke departemen <strong>IT Support</strong>. <br/><small style={{color: '#94a3b8'}}>12 OKT 2023, 08:45 AM</small></span>
            </div>

            {/* Iterasi Data Komentar Asli jika ada */}
            {(tiket.komentar || [
              {
                id: 1, role: "IT Support", nama: "Wahyu Rista", waktu: "2023-10-12T09:15:00",
                isi: "Halo Ahmad, kami telah menerima laporan Anda. Saat ini tim teknis sedang mengecek status akun SSO Anda di server pusat. Mohon menunggu maksimal 1x24 jam. Terima kasih."
              },
              {
                id: 2, role: "Pelapor", nama: "Ahmad Nuruddin", waktu: "2023-10-12T09:45:00",
                isi: "Terima kasih Pak Wahyu, saya sudah mencoba membersihkan cache tapi hasilnya masih sama. Saya lampirkan screenshot terbaru saat error muncul."
              }
            ]).map((k) => {
              const isMahasiswa = k.role === "Pelapor" || k.role === "Mahasiswa";
              return (
                <div key={k.id} className="history-item">
                  <div className="history-item-content">
                    <div className="history-item-header">
                      <div className="history-item-name">
                        <div className={`avatar-sm ${isMahasiswa ? 'avatar-mhs' : 'avatar-staff'}`}>
                          {getInitials(k.nama)}
                        </div>
                        {k.nama} {isMahasiswa ? "(Pelapor)" : `(${k.role})`}
                      </div>
                      <span className="history-item-time">{formatDateTime(k.waktu)}</span>
                    </div>
                    <div className="history-item-body">{k.isi}</div>
                  </div>
                </div>
              );
            })}

            {/* Kotak Tulis Tanggapan */}
            {tiket.status !== "SELESAI" && (
              <div className="reply-box">
                <div className="reply-box-title">Tulis Tanggapan</div>
                
                {/* Dummy Rich Text Toolbar */}
                <div className="reply-toolbar">
                  <span style={{fontWeight: 'bold'}}>B</span>
                  <span style={{fontStyle: 'italic', fontFamily: 'serif'}}>I</span>
                  <span style={{textDecoration: 'underline'}}>U</span>
                  <div className="divider"></div>
                  <span>☰</span>
                  <span>🔗</span>
                  <span>🖼️</span>
                </div>

                <textarea
                  className="reply-textarea"
                  placeholder="Ketik pesan atau minta informasi tambahan ke mahasiswa..."
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                />
                
                <div className="reply-attachment">
                  ☁️ Lampirkan file atau <strong>pilih berkas</strong>
                </div>

                <div className="reply-footer">
                  <span className="reply-status-note">Tiket akan tetap dalam status 'Diproses'</span>
                  <div className="reply-actions">
                    <button className="btn-batal" onClick={() => setReply("")}>Batal</button>
                    <button className="btn-kirim" disabled={!reply.trim() || sending} onClick={handleKirimBalasan}>
                      {sending ? "Mengirim..." : "Kirim Tanggapan ▷"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT PANEL */}
          <div>
            {/* Informasi Pelapor */}
            <div className="info-card">
              <div className="info-card-title">INFORMASI PELAPOR</div>
              <div className="info-card-body">
                <div className="info-user-row">
                  <div className="info-user-avatar">{getInitials(user?.nama || "Ahmad Nuruddin")}</div>
                  <div>
                    <div className="info-user-name">{user?.nama || "Ahmad Nuruddin"}</div>
                    <div className="info-user-nim">{user?.nim || "G64190082"}</div>
                  </div>
                </div>
                
                <div className="info-meta-group">
                  <div className="info-meta-label">FAKULTAS / DEPARTEMEN</div>
                  <div className="info-meta-val">{user?.fakultas || "Fakultas MIPA / Ilmu Komputer"}</div>
                </div>
                <div className="info-meta-group">
                  <div className="info-meta-label">EMAIL</div>
                  <div className="info-meta-val">{user?.email || "ahmad_nuruddin@apps.ipb.ac.id"}</div>
                </div>
              </div>
            </div>

            {/* Detail Tiket */}
            <div className="info-card">
              <div className="info-card-title">DETAIL TIKET</div>
              <div className="info-card-body" style={{padding: '0 16px'}}>
                <div className="detail-row">
                  <div className="detail-label">Kategori</div>
                  <div className="detail-val">
                    <span className="badge-kategori">{tiket.kategori || "IT Support"}</span>
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Prioritas</div>
                  <div className="detail-val">
                    <span className="badge-prioritas">▲ TINGGI</span>
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Dibuat Pada</div>
                  <div className="detail-val" style={{fontWeight: 400, color: '#334155'}}>
                    {formatDateTime(tiket.tanggal_dibuat || "2023-10-12T08:30:00")}<br/>
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">SLA Target</div>
                  <div className="detail-val">24 Jam</div>
                </div>
              </div>
            </div>

            {/* Petugas */}
            <div className="info-card">
              <div className="info-card-title">PETUGAS</div>
              <div className="info-card-body">
                <div className="info-user-row" style={{marginBottom: 0}}>
                  <div className="info-user-avatar" style={{background: '#e0f2fe', color: '#0369a1'}}>
                    {getInitials(tiket.petugas?.nama || "Wahyu Rista")}
                  </div>
                  <div>
                    <div className="info-user-name">{tiket.petugas?.nama || "Wahyu Rista"}</div>
                    <div className="info-user-nim">{tiket.petugas?.role || "IT Support Level 1"}</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </>
  );
}