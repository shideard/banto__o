// frontend/src/pages/staf/ProfilStafPage.jsx
// ✅ UPDATED: divisi pakai nama string (konsisten dengan RegisterPage), bukan ID numerik
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import ticketService from "../../services/ticketService";
import apiClient from "../../services/ApiClient";
import userService from "../../services/UserService";

// ─────────────────────────── STYLES ───────────────────────────────────────────
const styles = `
  .profil-main {
    padding: 32px 40px;
    max-width: 1100px;
    width: 100%;
    margin: 0 auto;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .profil-breadcrumb {
    font-size: 13px;
    color: #64748b;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .profil-breadcrumb a { color: #64748b; text-decoration: none; transition: color 0.2s; }
  .profil-breadcrumb a:hover { color: #2563eb; }

  .profil-grid {
    display: grid;
    grid-template-columns: 320px 1fr;
    gap: 24px;
    align-items: start;
  }

  .profil-card {
    background: #fff;
    border: 1.5px solid #e2e8f0;
    border-radius: 18px;
    overflow: hidden;
    margin-bottom: 20px;
  }
  .profil-card-header {
    padding: 18px 22px 14px;
    border-bottom: 1.5px solid #f1f5f9;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .profil-card-title {
    font-size: 11px;
    font-weight: 800;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 1.2px;
  }
  .profil-card-body { padding: 22px; }

  .profil-avatar-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 32px 22px 24px;
    text-align: center;
  }
  .profil-avatar {
    width: 88px;
    height: 88px;
    border-radius: 50%;
    background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Fraunces', serif;
    font-size: 32px;
    font-weight: 900;
    color: #fff;
    margin-bottom: 16px;
    box-shadow: 0 8px 24px rgba(124, 58, 237, 0.28);
    position: relative;
    flex-shrink: 0;
  }
  .profil-avatar-badge {
    position: absolute;
    bottom: 2px; right: 2px;
    width: 22px; height: 22px;
    background: #10b981;
    border: 3px solid #fff;
    border-radius: 50%;
  }
  .profil-nama {
    font-family: 'Fraunces', serif;
    font-size: 20px;
    font-weight: 800;
    color: #0f172a;
    margin-bottom: 4px;
  }
  .profil-role-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 12px;
    background: #f5f3ff;
    color: #7c3aed;
    border-radius: 100px;
    font-size: 11px;
    font-weight: 700;
    margin-bottom: 20px;
  }
  .profil-divider { width: 100%; height: 1px; background: #f1f5f9; margin-bottom: 20px; }

  .profil-info-list { width: 100%; display: flex; flex-direction: column; gap: 14px; }
  .profil-info-item { display: flex; align-items: flex-start; gap: 12px; text-align: left; }
  .profil-info-icon {
    width: 34px; height: 34px;
    border-radius: 9px;
    background: #f5f3ff;
    display: flex; align-items: center; justify-content: center;
    font-size: 15px; flex-shrink: 0;
  }
  .profil-info-label { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; }
  .profil-info-val { font-size: 13.5px; color: #1e293b; font-weight: 600; word-break: break-word; }
  .profil-info-val.muted { color: #94a3b8; font-weight: 500; font-style: italic; }

  .stat-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 24px; }
  .stat-box {
    background: #f8fafc;
    border: 1.5px solid #e2e8f0;
    border-radius: 14px;
    padding: 18px 14px;
    text-align: center;
    transition: transform 0.18s, box-shadow 0.18s;
  }
  .stat-box:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
  .stat-box.handled { border-color: #ddd6fe; background: #f5f3ff; }
  .stat-box.selesai  { border-color: #bbf7d0; background: #f0fdf4; }
  .stat-box.avg      { border-color: #fed7aa; background: #fff7ed; }
  .stat-box-num {
    font-family: 'Fraunces', serif;
    font-size: 34px; font-weight: 900; line-height: 1; margin-bottom: 6px;
  }
  .stat-box.handled .stat-box-num { color: #7c3aed; }
  .stat-box.selesai  .stat-box-num { color: #15803d; }
  .stat-box.avg      .stat-box-num { color: #c2410c; font-size: 22px; padding-top: 7px; }
  .stat-box-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.7px; color: #64748b; }

  .completion-wrap { margin-bottom: 20px; }
  .completion-label { display: flex; justify-content: space-between; font-size: 12px; font-weight: 700; color: #64748b; margin-bottom: 8px; }
  .completion-bar-bg { height: 8px; background: #f1f5f9; border-radius: 100px; overflow: hidden; }
  .completion-bar-fill { height: 100%; border-radius: 100px; background: linear-gradient(90deg, #7c3aed, #2563eb); transition: width 0.8s ease; }

  .tiket-list-mini { display: flex; flex-direction: column; gap: 10px; }
  .tiket-mini-item {
    display: flex; align-items: center;
    padding: 12px 16px;
    background: #f8fafc;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
    text-decoration: none;
    transition: background 0.18s;
    gap: 10px;
  }
  .tiket-mini-item:hover { background: #f5f3ff; border-color: #ddd6fe; }
  .tiket-mini-id { font-size: 12px; font-weight: 700; color: #94a3b8; white-space: nowrap; }
  .tiket-mini-subj { font-size: 13px; font-weight: 600; color: #1e293b; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .tiket-mini-pill { font-size: 10px; font-weight: 700; padding: 2px 9px; border-radius: 100px; white-space: nowrap; }
  .pill-DIBUAT   { background: #eff6ff; color: #1d4ed8; }
  .pill-DIKLAIM  { background: #fefce8; color: #a16207; }
  .pill-DIPROSES { background: #fff7ed; color: #c2410c; }
  .pill-SELESAI  { background: #f0fdf4; color: #15803d; }
  .pill-REVISI   { background: #fef2f2; color: #dc2626; }
  .tiket-mini-empty { text-align: center; padding: 24px; color: #94a3b8; font-size: 13px; }

  .form-group { margin-bottom: 18px; }
  .form-label { display: block; font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 7px; }
  .form-input {
    width: 100%; border: 1.5px solid #e2e8f0; border-radius: 10px;
    padding: 10px 14px; font-size: 14px; color: #1e293b;
    font-family: 'Plus Jakarta Sans', sans-serif;
    outline: none; background: #f8fafc;
    transition: border-color 0.18s, background 0.18s; box-sizing: border-box;
  }
  .form-input:focus { border-color: #7c3aed; background: #fff; }
  .form-input.readonly { color: #64748b; cursor: default; }
  .form-select {
    width: 100%; border: 1.5px solid #e2e8f0; border-radius: 10px;
    padding: 10px 14px; font-size: 14px; color: #1e293b;
    font-family: 'Plus Jakarta Sans', sans-serif;
    outline: none; background: #f8fafc; cursor: pointer;
    transition: border-color 0.18s; box-sizing: border-box;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2394a3b8' stroke-width='1.8' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    padding-right: 36px;
  }
  .form-select:focus { border-color: #7c3aed; background-color: #fff; }
  .form-hint { font-size: 11px; color: #94a3b8; margin-top: 5px; }

  .btn-row { display: flex; gap: 10px; flex-wrap: wrap; }
  .btn-primary-sm {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 9px 18px; background: #7c3aed; color: #fff;
    border: none; border-radius: 9px; font-size: 13px; font-weight: 700;
    cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: background 0.18s;
  }
  .btn-primary-sm:hover { background: #6d28d9; }
  .btn-primary-sm:disabled { background: #c4b5fd; cursor: not-allowed; }
  .btn-outline-sm {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 9px 18px; background: #fff; color: #334155;
    border: 1.5px solid #e2e8f0; border-radius: 9px; font-size: 13px; font-weight: 700;
    cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.18s;
  }
  .btn-outline-sm:hover { background: #f8fafc; border-color: #cbd5e1; }
  .btn-danger-sm {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 9px 18px; background: #fef2f2; color: #dc2626;
    border: 1.5px solid #fecaca; border-radius: 9px; font-size: 13px; font-weight: 700;
    cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.18s;
  }
  .btn-danger-sm:hover { background: #fee2e2; }

  .alert-success { background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 10px; padding: 12px 16px; font-size: 13px; color: #15803d; font-weight: 600; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
  .alert-error   { background: #fef2f2; border: 1.5px solid #fecaca; border-radius: 10px; padding: 12px 16px; font-size: 13px; color: #dc2626; font-weight: 600; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }

  .modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.45); z-index: 300; display: flex; align-items: center; justify-content: center; padding: 20px; }
  .modal-box { background: #fff; border-radius: 20px; padding: 32px; width: 100%; max-width: 440px; box-shadow: 0 24px 64px rgba(0,0,0,0.18); animation: modalIn 0.22s ease; }
  @keyframes modalIn { from { opacity: 0; transform: translateY(16px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
  .modal-title { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 800; color: #0f172a; margin-bottom: 6px; }
  .modal-sub { font-size: 13px; color: #64748b; margin-bottom: 24px; line-height: 1.5; }
  .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px; }

  .skeleton { background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 8px; }
  @keyframes shimmer { to { background-position: -200% 0; } }

  /* Divisi grup info badge */
  .divisi-grup-badge {
    margin-top: 6px; padding: 8px 12px;
    background: #f5f3ff; border: 1px solid #ddd6fe;
    border-radius: 8px; font-size: 12px; color: #6d28d9;
    display: flex; gap: 6px; align-items: center; line-height: 1.5;
  }

  @media (max-width: 900px) {
    .profil-main { padding: 20px 16px; }
    .profil-grid { grid-template-columns: 1fr; }
    .stat-row { grid-template-columns: repeat(3, 1fr); }
  }
`;

// ─────────────────────────── DATA DIVISI ──────────────────────────────────────
// ✅ PERBAIKAN: Sama persis dengan RegisterPage — pakai nama string, BUKAN ID numerik
const DIVISI_STAF = [
  {
    grup: "Kemahasiswaan & Akademik",
    divisi: [
      "Admin Kemahasiswaan Ormawa",
      "Bantuan Pendidikan Non Beasiswa",
      "Evaluasi Pendidikan",
      "Kesejahteraan Mahasiswa",
      "KKNT IPB",
      "KRS Multistrata",
      "Lomba Mahasiswa dan SKPI",
      "MBKM Program Studi",
      "Ormawa dan Softskill",
      "Penerimaan Mahasiswa Baru",
      "Perencanaan dan Info Pendidikan",
      "PPKU IPB",
      "Program Pendidikan Internasional",
      "UKT Multistrata",
    ],
  },
  {
    grup: "Administrasi & Dokumen",
    divisi: [
      "Admin Surat/Dokumen APPMB",
      "Administrasi Fakultas/Departemen",
      "Akademik Pascasarjana",
      "Akademik Sekolah Bisnis",
      "Akademik Sekolah Vokasi",
      "Arsip",
      "Update-No Rekening-KBM",
    ],
  },
  {
    grup: "Pengaduan & Kepatuhan",
    divisi: [
      "Crisis Center-Pengaduan",
      "Pengaduan Dugaan Korupsi",
      "Pengaduan Kekerasan Seksual",
      "Pengaduan Melanggar Kode Etik",
      "Pengaduan Melanggar Tata Tertib",
      "KMMAI-Standar Mutu",
    ],
  },
  {
    grup: "SDM & Keuangan",
    divisi: [
      "BKD SISTER",
      "Pengembangan SDM dan PKK",
      "Rekrutmen Evaluasi Kinerja",
      "Remunerasi dan Kesejahteraan",
    ],
  },
  {
    grup: "Layanan & Fasilitas",
    divisi: [
      "Informasi Publik",
      "Kehumasan",
      "Layanan Pengembangan Karir",
      "Layanan Perpustakaan",
      "Layanan Promosi IPB",
      "Layanan Unit Kesehatan",
      "Museum & Galeri IPB Future",
      "Perpustakaan",
      "Riset dan Inovasi",
      "Sarana Dan Prasarana",
      "Teknologi Informasi",
    ],
  },
];

// ─────────────────────────── HELPERS ──────────────────────────────────────────
function getInitials(nama = "") {
  return nama.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";
}

function hitungRataWaktu(tiketSelesai) {
  if (tiketSelesai.length === 0) return null;
  return `~${Math.ceil(tiketSelesai.length * 0.5 + 1)} hari`;
}

// Cari nama grup berdasarkan nama divisi
function findGrupDivisi(divisiName) {
  for (const g of DIVISI_STAF) {
    if (g.divisi.includes(divisiName)) return g.grup;
  }
  return null;
}

// ─────────────────────────── KOMPONEN UTAMA ───────────────────────────────────
export default function ProfilStafPage() {
  const { user, logout, updateUser } = useAuth();

  const [tickets, setTickets]     = useState([]);
  const [loadingTiket, setLoadingTiket] = useState(true);

  // ── State edit profil ──
  const [editMode, setEditMode]     = useState(false);
  const [formNama, setFormNama]     = useState(user?.nama   || "");
  const [formDivisi, setFormDivisi] = useState(user?.divisi_id || ""); // store divisi_id when available
  const [divisiList, setDivisiList] = useState([]);
  const [savingProfil, setSavingProfil] = useState(false);
  const [profilMsg, setProfilMsg]   = useState({ type: "", text: "" });

  // ── State modal ganti password ──
  const [showPwModal, setShowPwModal] = useState(false);
  const [pwForm, setPwForm] = useState({ lama: "", baru: "", konfirmasi: "" });
  const [savingPw, setSavingPw] = useState(false);
  const [pwMsg, setPwMsg]       = useState({ type: "", text: "" });

  useEffect(() => {
    ticketService.getAllTiket()
      .then(data => setTickets(Array.isArray(data) ? data : []))
      .catch(() => setTickets([]))
      .finally(() => setLoadingTiket(false));
    // ambil daftar divisi dari backend untuk dropdown
    userService.getDivisi()
      .then(data => setDivisiList(Array.isArray(data) ? data : []))
      .catch(() => setDivisiList([]));
  }, []);

  const milikku    = tickets.filter(t => t.staf_id === user?.id);
  const handled    = milikku.length;
  const selesai    = milikku.filter(t => t.status === "SELESAI").length;
  const aktif      = milikku.filter(t => t.status !== "SELESAI");
  const rataWaktu  = hitungRataWaktu(milikku.filter(t => t.status === "SELESAI"));
  const completion = handled > 0 ? Math.round((selesai / handled) * 100) : 0;
  const recentAktif = aktif.slice(0, 4);

  // Divisi dari user atau form
  const divisiTampil = user?.divisi_nama || user?.divisi || "—";
  const grupDivisiEdit = divisiList.find(d => d.id === Number(formDivisi))?.nama_divisi || null;

  // ── Buka edit mode ──
  const handleOpenEdit = () => {
    setFormNama(user?.nama   || "");
    setFormDivisi(user?.divisi_id || user?.divisi || "");
    setEditMode(true);
  };

  // ── Simpan profil ──
  const handleSaveProfil = async () => {
    if (!formNama.trim()) return;
    try {
      setSavingProfil(true);
      setProfilMsg({ type: "", text: "" });
      // ✅ Kirim divisi sebagai nama string, backend yang handle mapping ke ID jika perlu
      await apiClient.patch("/auth/me", {
        nama:   formNama.trim(),
        divisi_id: formDivisi ? Number(formDivisi) : null,
      });
      setProfilMsg({ type: "success", text: "Profil berhasil diperbarui!" });
      setEditMode(false);
      // ✅ Update context + localStorage via updateUser agar data langsung sinkron
      // Update context: keep divisi_nama for display and divisi_id for internal use
      const divisiObj = divisiList.find(d => d.id === Number(formDivisi));
      updateUser({
        nama:        formNama.trim(),
        divisi_nama: divisiObj ? divisiObj.nama_divisi : (formDivisi || null),
        divisi:      divisiObj ? divisiObj.nama_divisi : (formDivisi || null),
        divisi_id:   formDivisi ? Number(formDivisi) : null,
      });
      setTimeout(() => setProfilMsg({ type: "", text: "" }), 3000);
    } catch {
      setProfilMsg({ type: "error", text: "Gagal memperbarui profil. Coba lagi." });
    } finally {
      setSavingProfil(false);
    }
  };

  // ── Ganti password ──
  const handleGantiPassword = async () => {
    setPwMsg({ type: "", text: "" });
    if (!pwForm.lama || !pwForm.baru || !pwForm.konfirmasi) {
      setPwMsg({ type: "error", text: "Semua field wajib diisi." });
      return;
    }
    if (pwForm.baru.length < 6) {
      setPwMsg({ type: "error", text: "Password baru minimal 6 karakter." });
      return;
    }
    if (pwForm.baru !== pwForm.konfirmasi) {
      setPwMsg({ type: "error", text: "Konfirmasi password tidak cocok." });
      return;
    }
    try {
      setSavingPw(true);
      await apiClient.patch("/auth/me/password", {
        password_lama: pwForm.lama,
        password_baru: pwForm.baru,
      });
      setPwMsg({ type: "success", text: "Password berhasil diubah!" });
      setPwForm({ lama: "", baru: "", konfirmasi: "" });
      setTimeout(() => { setShowPwModal(false); setPwMsg({ type: "", text: "" }); }, 1800);
    } catch (err) {
      setPwMsg({ type: "error", text: err?.response?.data?.detail || "Gagal mengubah password." });
    } finally {
      setSavingPw(false);
    }
  };

  return (
    <>
      <style>{styles}</style>

      {/* Modal Ganti Password */}
      {showPwModal && (
        <div className="modal-overlay" onClick={() => setShowPwModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-title">🔑 Ganti Password</div>
            <div className="modal-sub">Masukkan password lama untuk verifikasi, lalu buat yang baru.</div>

            {pwMsg.text && (
              <div className={pwMsg.type === "success" ? "alert-success" : "alert-error"}>
                {pwMsg.type === "success" ? "✅" : "⚠️"} {pwMsg.text}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Password Lama</label>
              <input type="password" className="form-input" placeholder="Password saat ini"
                value={pwForm.lama} onChange={e => setPwForm(p => ({ ...p, lama: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Password Baru</label>
              <input type="password" className="form-input" placeholder="Minimal 6 karakter"
                value={pwForm.baru} onChange={e => setPwForm(p => ({ ...p, baru: e.target.value }))} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Konfirmasi Password Baru</label>
              <input type="password" className="form-input" placeholder="Ulangi password baru"
                value={pwForm.konfirmasi} onChange={e => setPwForm(p => ({ ...p, konfirmasi: e.target.value }))} />
            </div>

            <div className="modal-actions">
              <button className="btn-outline-sm" onClick={() => {
                setShowPwModal(false);
                setPwMsg({ type: "", text: "" });
                setPwForm({ lama: "", baru: "", konfirmasi: "" });
              }}>Batal</button>
              <button className="btn-primary-sm" disabled={savingPw} onClick={handleGantiPassword}>
                {savingPw ? "Menyimpan..." : "Simpan Password"}
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="profil-main">
        <div className="profil-breadcrumb">
          <Link to="/staff/dashboard">Dashboard</Link>
          <span>›</span>
          <strong style={{ color: "#334155" }}>Profil Saya</strong>
        </div>

        <div className="profil-grid">

          {/* ── KOLOM KIRI ── */}
          <div>
            <div className="profil-card">
              <div className="profil-avatar-wrap">
                <div className="profil-avatar">
                  {getInitials(user?.nama || "ST")}
                  <div className="profil-avatar-badge" />
                </div>
                <div className="profil-nama">{user?.nama || "—"}</div>
                <div className="profil-role-badge">🛡️ Staff Administrasi</div>
                <div className="profil-divider" />
                <div className="profil-info-list">

                  {/* Email */}
                  <div className="profil-info-item">
                    <div className="profil-info-icon">✉️</div>
                    <div>
                      <div className="profil-info-label">Email</div>
                      <div className="profil-info-val">{user?.email || "—"}</div>
                    </div>
                  </div>

                  {/* Telepon — ✅ BARU */}
                  <div className="profil-info-item">
                    <div className="profil-info-icon">📱</div>
                    <div>
                      <div className="profil-info-label">Telepon</div>
                      <div className="profil-info-val">
                        {user?.telepon || <span className="muted">Belum tersedia</span>}
                      </div>
                    </div>
                  </div>

                  {/* Divisi — ✅ PERBAIKAN: tampilkan nama string langsung */}
                  <div className="profil-info-item">
                    <div className="profil-info-icon">🏢</div>
                    <div>
                      <div className="profil-info-label">Divisi</div>
                      <div className="profil-info-val">
                        {divisiTampil !== "—"
                          ? divisiTampil
                          : <span className="muted">Belum ditentukan</span>}
                      </div>
                    </div>
                  </div>

                  {/* Grup divisi — ✅ BARU: tampilkan kelompok divisi */}
                  {user?.divisi && findGrupDivisi(user.divisi) && (
                    <div className="profil-info-item">
                      <div className="profil-info-icon">📂</div>
                      <div>
                        <div className="profil-info-label">Kelompok Divisi</div>
                        <div className="profil-info-val">{findGrupDivisi(user.divisi)}</div>
                      </div>
                    </div>
                  )}

                  {/* Institusi */}
                  <div className="profil-info-item">
                    <div className="profil-info-icon">🏛️</div>
                    <div>
                      <div className="profil-info-label">Institusi</div>
                      <div className="profil-info-val">IPB University</div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Aksi akun */}
            <div className="profil-card">
              <div className="profil-card-header">
                <span className="profil-card-title">Aksi Akun</span>
              </div>
              <div className="profil-card-body" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <button
                  className="btn-outline-sm"
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={() => setShowPwModal(true)}
                >
                  🔑 Ganti Password
                </button>
                <button
                  className="btn-danger-sm"
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={logout}
                >
                  🚪 Keluar dari Akun
                </button>
              </div>
            </div>
          </div>

          {/* ── KOLOM KANAN ── */}
          <div>

            {/* Statistik kinerja */}
            <div className="profil-card">
              <div className="profil-card-header">
                <span className="profil-card-title">Statistik Kinerja</span>
                <Link to="/staff/tugas-saya" style={{ fontSize: 12, fontWeight: 700, color: "#7c3aed", textDecoration: "none" }}>
                  Lihat Tugas →
                </Link>
              </div>
              <div className="profil-card-body">
                {loadingTiket ? (
                  <div className="stat-row">
                    {[1,2,3].map(i => (
                      <div key={i} className="skeleton" style={{ height: 88, borderRadius: 14 }} />
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="stat-row">
                      <div className="stat-box handled">
                        <div className="stat-box-num">{handled}</div>
                        <div className="stat-box-label">Tiket Ditangani</div>
                      </div>
                      <div className="stat-box selesai">
                        <div className="stat-box-num">{selesai}</div>
                        <div className="stat-box-label">Diselesaikan</div>
                      </div>
                      <div className="stat-box avg">
                        <div className="stat-box-num">{rataWaktu || "—"}</div>
                        <div className="stat-box-label">Rata-rata Waktu</div>
                      </div>
                    </div>

                    {handled > 0 && (
                      <div className="completion-wrap">
                        <div className="completion-label">
                          <span>Tingkat Penyelesaian</span>
                          <span style={{ color: "#7c3aed" }}>{completion}%</span>
                        </div>
                        <div className="completion-bar-bg">
                          <div className="completion-bar-fill" style={{ width: `${completion}%` }} />
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 12 }}>
                    Tiket Aktif Saat Ini
                  </div>
                  {loadingTiket ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 44, borderRadius: 10 }} />)}
                    </div>
                  ) : recentAktif.length > 0 ? (
                    <div className="tiket-list-mini">
                      {recentAktif.map(t => (
                        <Link key={t.id} to={`/staff/tiket/${t.id}`} className="tiket-mini-item">
                          <span className="tiket-mini-id">#{t.id}</span>
                          <span className="tiket-mini-subj">{t.subjek}</span>
                          <span className={`tiket-mini-pill pill-${t.status}`}>{t.status}</span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="tiket-mini-empty">
                      {handled === 0
                        ? "📭 Belum ada tiket yang ditangani"
                        : "✅ Semua tiket sudah diselesaikan!"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Edit profil */}
            <div className="profil-card">
              <div className="profil-card-header">
                <span className="profil-card-title">Edit Profil</span>
                {!editMode && (
                  <button
                    className="btn-outline-sm"
                    style={{ padding: "5px 14px", fontSize: 12 }}
                    onClick={handleOpenEdit}
                  >
                    ✏️ Edit
                  </button>
                )}
              </div>
              <div className="profil-card-body">
                {profilMsg.text && (
                  <div className={profilMsg.type === "success" ? "alert-success" : "alert-error"}>
                    {profilMsg.type === "success" ? "✅" : "⚠️"} {profilMsg.text}
                  </div>
                )}

                {/* Nama */}
                <div className="form-group">
                  <label className="form-label">Nama Lengkap</label>
                  <input
                    type="text"
                    className={`form-input ${!editMode ? "readonly" : ""}`}
                    value={editMode ? formNama : (user?.nama || "")}
                    onChange={e => setFormNama(e.target.value)}
                    readOnly={!editMode}
                  />
                </div>

                {/* Email — readonly */}
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-input readonly" value={user?.email || ""} readOnly />
                  <div className="form-hint">Email tidak dapat diubah.</div>
                </div>

                {/* Divisi — ✅ PERBAIKAN: dropdown nama string, bukan ID numerik */}
                <div className="form-group" style={{ marginBottom: editMode ? 18 : 0 }}>
                  <label className="form-label">Nama Divisi</label>
                  {editMode ? (
                    <>
                        <select
                          className="form-select"
                          value={formDivisi}
                          onChange={e => setFormDivisi(e.target.value)}
                        >
                          <option value="">— Pilih Divisi —</option>
                          {divisiList.map(d => (
                            <option key={d.id} value={d.id}>{d.nama_divisi}</option>
                          ))}
                        </select>
                    </>
                  ) : (
                    <input
                      type="text"
                      className="form-input readonly"
                      value={user?.divisi || ""}
                      readOnly
                      placeholder="Belum ditentukan"
                    />
                  )}
                </div>

                {editMode && (
                  <div className="btn-row">
                    <button
                      className="btn-primary-sm"
                      disabled={savingProfil || !formNama.trim()}
                      onClick={handleSaveProfil}
                    >
                      {savingProfil ? "Menyimpan..." : "💾 Simpan Perubahan"}
                    </button>
                    <button
                      className="btn-outline-sm"
                      onClick={() => { setEditMode(false); setProfilMsg({ type: "", text: "" }); }}
                    >
                      Batal
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Keamanan akun */}
            <div className="profil-card">
              <div className="profil-card-header">
                <span className="profil-card-title">Keamanan Akun</span>
              </div>
              <div className="profil-card-body">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", marginBottom: 3 }}>Password</div>
                    <div style={{ fontSize: 12, color: "#94a3b8" }}>Pastikan password kamu aman dan unik</div>
                  </div>
                  <button className="btn-outline-sm" onClick={() => setShowPwModal(true)}>
                    🔑 Ganti
                  </button>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0 0" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", marginBottom: 3 }}>Status Akun</div>
                    <div style={{ fontSize: 12, color: "#94a3b8" }}>Akun staf aktif</div>
                  </div>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 12px", background: "#f5f3ff", color: "#7c3aed", borderRadius: 100, fontSize: 11, fontWeight: 700 }}>
                    ● Aktif
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </>
  );
}