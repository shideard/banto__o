// frontend/src/pages/mahasiswa/ProfilPage.jsx
// ✅ UPDATED: menampilkan fakultas, departemen, telepon dari data user
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import ticketService from "../../services/ticketService";
import apiClient from "../../services/ApiClient";
import AppIcon from "../../components/ui/AppIcon";

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
  .profil-breadcrumb span { color: #cbd5e1; }

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
    background: linear-gradient(135deg, #1a4fad 0%, #0ea5e9 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Fraunces', serif;
    font-size: 32px;
    font-weight: 900;
    color: #fff;
    margin-bottom: 16px;
    box-shadow: 0 8px 24px rgba(37, 99, 235, 0.25);
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
    background: #eff6ff;
    color: #2563eb;
    border-radius: 100px;
    font-size: 11px;
    font-weight: 700;
    margin-bottom: 20px;
  }
  .profil-divider {
    width: 100%;
    height: 1px;
    background: #f1f5f9;
    margin-bottom: 20px;
  }

  .profil-info-list {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .profil-info-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    text-align: left;
  }
  .profil-info-icon {
    width: 34px;
    height: 34px;
    border-radius: 9px;
    background: #f1f5f9;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    flex-shrink: 0;
  }
  .profil-info-label {
    font-size: 11px;
    font-weight: 700;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 2px;
  }
  .profil-info-val {
    font-size: 13.5px;
    color: #1e293b;
    font-weight: 600;
    word-break: break-word;
  }
  .profil-info-val.muted { color: #94a3b8; font-weight: 500; font-style: italic; }

  /* ── Statistik tiket ── */
  .stat-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
    margin-bottom: 20px;
  }
  .stat-box {
    background: #f8fafc;
    border: 1.5px solid #e2e8f0;
    border-radius: 14px;
    padding: 18px 16px;
    text-align: center;
    transition: transform 0.18s, box-shadow 0.18s;
  }
  .stat-box:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
  .stat-box.total  { border-color: #bfdbfe; background: #eff6ff; }
  .stat-box.proses { border-color: #fed7aa; background: #fff7ed; }
  .stat-box.selesai{ border-color: #bbf7d0; background: #f0fdf4; }
  .stat-box-num {
    font-family: 'Fraunces', serif;
    font-size: 36px;
    font-weight: 900;
    line-height: 1;
    margin-bottom: 6px;
  }
  .stat-box.total   .stat-box-num { color: #2563eb; }
  .stat-box.proses  .stat-box-num { color: #c2410c; }
  .stat-box.selesai .stat-box-num { color: #15803d; }
  .stat-box-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.7px;
    color: #64748b;
  }

  .tiket-list-mini { display: flex; flex-direction: column; gap: 10px; }
  .tiket-mini-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: #f8fafc;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
    text-decoration: none;
    transition: background 0.18s;
  }
  .tiket-mini-item:hover { background: #eff6ff; border-color: #bfdbfe; }
  .tiket-mini-id { font-size: 12px; font-weight: 700; color: #94a3b8; }
  .tiket-mini-subj {
    font-size: 13px; font-weight: 600; color: #1e293b;
    flex: 1; margin: 0 12px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .tiket-mini-pill { font-size: 10px; font-weight: 700; padding: 2px 9px; border-radius: 100px; white-space: nowrap; }
  .pill-DIBUAT   { background: #eff6ff; color: #1d4ed8; }
  .pill-DIKLAIM  { background: #fefce8; color: #a16207; }
  .pill-DIPROSES { background: #fff7ed; color: #c2410c; }
  .pill-SELESAI  { background: #f0fdf4; color: #15803d; }
  .pill-REVISI   { background: #fef2f2; color: #dc2626; }
  .tiket-mini-empty { text-align: center; padding: 24px; color: #94a3b8; font-size: 13px; }

  /* ── Form edit ── */
  .form-group { margin-bottom: 18px; }
  .form-label {
    display: block;
    font-size: 12px; font-weight: 700; color: #475569;
    text-transform: uppercase; letter-spacing: 0.5px;
    margin-bottom: 7px;
  }
  .form-input {
    width: 100%; border: 1.5px solid #e2e8f0; border-radius: 10px;
    padding: 10px 14px; font-size: 14px; color: #1e293b;
    font-family: 'Plus Jakarta Sans', sans-serif;
    outline: none; background: #f8fafc;
    transition: border-color 0.18s, background 0.18s;
    box-sizing: border-box;
  }
  .form-input:focus { border-color: #2563eb; background: #fff; }
  .form-input:disabled { color: #94a3b8; cursor: not-allowed; }
  .form-input.readonly { color: #64748b; background: #f8fafc; cursor: default; }
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
  .form-select:focus { border-color: #2563eb; background-color: #fff; }
  .form-hint { font-size: 11px; color: #94a3b8; margin-top: 5px; }

  .btn-row { display: flex; gap: 10px; flex-wrap: wrap; }
  .btn-primary-sm {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 9px 18px; background: #2563eb; color: #fff;
    border: none; border-radius: 9px; font-size: 13px; font-weight: 700;
    cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif;
    transition: background 0.18s;
  }
  .btn-primary-sm:hover { background: #1d4ed8; }
  .btn-primary-sm:disabled { background: #93c5fd; cursor: not-allowed; }
  .btn-outline-sm {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 9px 18px; background: #fff; color: #334155;
    border: 1.5px solid #e2e8f0; border-radius: 9px; font-size: 13px; font-weight: 700;
    cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif;
    transition: all 0.18s;
  }
  .btn-outline-sm:hover { background: #f8fafc; border-color: #cbd5e1; }
  .btn-danger-sm {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 9px 18px; background: #fef2f2; color: #dc2626;
    border: 1.5px solid #fecaca; border-radius: 9px; font-size: 13px; font-weight: 700;
    cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif;
    transition: all 0.18s;
  }
  .btn-danger-sm:hover { background: #fee2e2; }

  .alert-success {
    background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 10px;
    padding: 12px 16px; font-size: 13px; color: #15803d; font-weight: 600;
    margin-bottom: 16px; display: flex; align-items: center; gap: 8px;
  }
  .alert-error {
    background: #fef2f2; border: 1.5px solid #fecaca; border-radius: 10px;
    padding: 12px 16px; font-size: 13px; color: #dc2626; font-weight: 600;
    margin-bottom: 16px; display: flex; align-items: center; gap: 8px;
  }

  .modal-overlay {
    position: fixed; inset: 0;
    background: rgba(15, 23, 42, 0.45);
    z-index: 300;
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
  }
  .modal-box {
    background: #fff; border-radius: 20px; padding: 32px;
    width: 100%; max-width: 440px;
    box-shadow: 0 24px 64px rgba(0,0,0,0.18);
    animation: modalIn 0.22s ease;
  }
  @keyframes modalIn {
    from { opacity: 0; transform: translateY(16px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  .modal-title {
    font-family: 'Fraunces', serif;
    font-size: 22px; font-weight: 800; color: #0f172a; margin-bottom: 6px;
  }
  .modal-sub { font-size: 13px; color: #64748b; margin-bottom: 24px; line-height: 1.5; }
  .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px; }

  .skeleton {
    background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
    border-radius: 8px;
  }
  @keyframes shimmer { to { background-position: -200% 0; } }

  @media (max-width: 900px) {
    .profil-main { padding: 20px 16px; }
    .profil-grid { grid-template-columns: 1fr; }
    .stat-row { grid-template-columns: repeat(3, 1fr); }
  }
`;

// ─────────────────────────── DATA FAKULTAS ────────────────────────────────────
// Sama persis dengan RegisterPage agar konsisten
const FAKULTAS = [
  {
    nama: "Fakultas Pertanian (Faperta)",
    departemen: [
      "Manajemen Sumberdaya Lahan",
      "Agronomi dan Hortikultura",
      "Proteksi Tanaman",
      "Arsitektur Lanskap",
    ],
  },
  {
    nama: "Fakultas Kedokteran Hewan (FKH)",
    departemen: [
      "Anatomi, Fisiologi, dan Farmakologi",
      "Penyakit Hewan dan Kesehatan Masyarakat Veteriner",
      "Klinik, Reproduksi, dan Patologi",
    ],
  },
  {
    nama: "Fakultas Perikanan dan Ilmu Kelautan (FPIK)",
    departemen: [
      "Budidaya Perairan",
      "Manajemen Sumberdaya Perairan",
      "Teknologi Hasil Perairan",
      "Pemanfaatan Sumberdaya Perikanan",
      "Ilmu dan Teknologi Kelautan",
    ],
  },
  {
    nama: "Fakultas Peternakan (Fapet)",
    departemen: [
      "Teknologi Produksi Ternak",
      "Nutrisi dan Teknologi Pakan",
      "Teknologi Hasil Ternak",
    ],
  },
  {
    nama: "Fakultas Kehutanan dan Lingkungan (Hutbun)",
    departemen: [
      "Manajemen Hutan",
      "Teknologi Hasil Hutan",
      "Konservasi Sumberdaya Hutan dan Ekowisata",
      "Silvikultur",
    ],
  },
  {
    nama: "Fakultas Teknologi Pertanian (Fateta)",
    departemen: [
      "Teknik Pertanian dan Biosistem",
      "Teknologi Pangan",
      "Teknologi Industri Pertanian",
      "Teknik Sipil dan Lingkungan",
    ],
  },
  {
    nama: "Fakultas Matematika dan Ilmu Pengetahuan Alam (FMIPA)",
    departemen: [
      "Statistika dan Sains Data",
      "Meteorologi Terapan",
      "Biologi",
      "Kimia",
      "Matematika",
      "Ilmu Komputer",
      "Fisika",
      "Biokimia",
    ],
  },
  {
    nama: "Fakultas Ekonomi dan Manajemen (FEM)",
    departemen: [
      "Ilmu Ekonomi",
      "Manajemen",
      "Agribisnis",
      "Ekonomi Sumberdaya dan Lingkungan",
      "Ilmu Ekonomi Syariah",
    ],
  },
  {
    nama: "Fakultas Ekologi Manusia (Fema)",
    departemen: [
      "Ilmu Gizi",
      "Ilmu Keluarga dan Konsumen",
      "Sains Komunikasi dan Pengembangan Masyarakat",
    ],
  },
  {
    nama: "Sekolah Bisnis (SB-IPB)",
    departemen: ["Program Magister dan Doktor Bisnis (S2 & S3)"],
  },
  {
    nama: "Sekolah Vokasi",
    departemen: [
      "Komunikasi Digital dan Media",
      "Ekowisata",
      "Supervisor Jaminan Mutu Pangan",
      "Manajemen Agribisnis",
      "Akuntansi",
      "Analisis Kimia",
      "Lainnya (Sekolah Vokasi)",
    ],
  },
];

// ─────────────────────────── HELPERS ──────────────────────────────────────────
function getInitials(nama = "") {
  return nama.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";
}

// ─────────────────────────── KOMPONEN UTAMA ───────────────────────────────────
export default function ProfilPage() {
  const { user, logout, updateUser } = useAuth();

  const [tickets, setTickets] = useState([]);
  const [loadingTiket, setLoadingTiket] = useState(true);

  // ── State edit profil ──
  const [editMode, setEditMode] = useState(false);
  const [formNama, setFormNama] = useState(user?.nama || "");
  const [formNim, setFormNim] = useState(user?.nim || "");
  const [formTelepon, setFormTelepon] = useState(user?.telepon || "");
  const [formFakultas, setFormFakultas] = useState(user?.fakultas || "");
  const [formDepartemen, setFormDepartemen] = useState(user?.departemen || "");
  const [savingNama, setSavingNama] = useState(false);
  const [namaMsg, setNamaMsg] = useState({ type: "", text: "" });

  // ── State modal ganti password ──
  const [showPwModal, setShowPwModal] = useState(false);
  const [pwForm, setPwForm] = useState({ lama: "", baru: "", konfirmasi: "" });
  const [savingPw, setSavingPw] = useState(false);
  const [pwMsg, setPwMsg] = useState({ type: "", text: "" });

  // Departemen list berdasarkan fakultas yang dipilih
  const departemenList = FAKULTAS.find(f => f.nama === formFakultas)?.departemen || [];

  useEffect(() => {
    ticketService.getMyTickets()
      .then(data => setTickets(Array.isArray(data) ? data : []))
      .catch(() => setTickets([]))
      .finally(() => setLoadingTiket(false));
  }, []);

  const total = tickets.length;
  const proses = tickets.filter(t => ["DIKLAIM", "DIPROSES", "REVISI"].includes(t.status)).length;
  const selesai = tickets.filter(t => t.status === "SELESAI").length;
  const recent = [...tickets]
    .sort((a, b) => new Date(b.tanggal_dibuat) - new Date(a.tanggal_dibuat))
    .slice(0, 4);

  // ── Simpan profil ──
  const handleSaveNama = async () => {
    if (!formNama.trim()) {
      setNamaMsg({ type: "error", text: "Nama tidak boleh kosong." });
      return;
    }
    try {
      setSavingNama(true);
      setNamaMsg({ type: "", text: "" });
      const payload = {
        nama: formNama.trim(),
        nim: formNim.trim() || null,
        telepon: formTelepon.trim() || null,
        fakultas: formFakultas || null,
        departemen: formDepartemen || null,
      };
      const res = await apiClient.patch("/auth/me", payload);
      const resData = res.data;

      updateUser({
        nama: resData.nama,
        nim: resData.nim || formNim.trim() || null,
        telepon: resData.telepon || formTelepon.trim() || null,
        fakultas: resData.fakultas || formFakultas || null,
        departemen: resData.departemen || formDepartemen || null,
      });
      setNamaMsg({ type: "success", text: "Profil berhasil diperbarui!" });
      setEditMode(false);
      setTimeout(() => setNamaMsg({ type: "", text: "" }), 3000);
    } catch {
      setNamaMsg({ type: "error", text: "Gagal memperbarui profil. Coba lagi." });
    } finally {
      setSavingNama(false);
    }
  };

  // ── Buka edit mode: isi form dari data user terkini ──
  const handleOpenEdit = () => {
    setFormNama(user?.nama || "");
    setFormNim(user?.nim || "");
    setFormTelepon(user?.telepon || "");
    setFormFakultas(user?.fakultas || "");
    setFormDepartemen(user?.departemen || "");
    setEditMode(true);
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
            <div className="modal-title" style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <AppIcon name="KeyRound" size={22} color="#2563eb" /> Ganti Password
            </div>
            <div className="modal-sub">
              Masukkan password lama kamu untuk verifikasi, lalu buat password baru.
            </div>

            {pwMsg.text && (
              <div className={pwMsg.type === "success" ? "alert-success" : "alert-error"}>
                {pwMsg.type === "success"
                  ? <AppIcon name="CheckCircle" variant="sm" />
                  : <AppIcon name="AlertTriangle" variant="sm" />}
                {pwMsg.text}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Password Lama</label>
              <input type="password" className="form-input" placeholder="Masukkan password saat ini"
                value={pwForm.lama}
                onChange={e => setPwForm(p => ({ ...p, lama: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Password Baru</label>
              <input type="password" className="form-input" placeholder="Minimal 6 karakter"
                value={pwForm.baru}
                onChange={e => setPwForm(p => ({ ...p, baru: e.target.value }))} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Konfirmasi Password Baru</label>
              <input type="password" className="form-input" placeholder="Ulangi password baru"
                value={pwForm.konfirmasi}
                onChange={e => setPwForm(p => ({ ...p, konfirmasi: e.target.value }))} />
            </div>

            <div className="modal-actions">
              <button className="btn-outline-sm" onClick={() => {
                setShowPwModal(false);
                setPwMsg({ type: "", text: "" });
                setPwForm({ lama: "", baru: "", konfirmasi: "" });
              }}>Batal</button>
              <button className="btn-primary-sm" disabled={savingPw} onClick={handleGantiPassword}>
                {savingPw ? "Menyimpan..." : <><AppIcon name="Save" variant="sm" /> Simpan Password</>}
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="profil-main">
        <div className="profil-breadcrumb">
          <Link to="/dashboard">Dashboard</Link>
          <span>›</span>
          <strong style={{ color: "#334155" }}>Profil Saya</strong>
        </div>

        <div className="profil-grid">

          {/* ── KOLOM KIRI — Kartu identitas ── */}
          <div>
            <div className="profil-card">
              <div className="profil-avatar-wrap">
                <div className="profil-avatar">
                  {getInitials(user?.nama || "MH")}
                  <div className="profil-avatar-badge" />
                </div>
                <div className="profil-nama">{user?.nama || "—"}</div>
                <div className="profil-role-badge">
                  <AppIcon name="GraduationCap" variant="sm" /> Mahasiswa
                </div>
                <div className="profil-divider" />

                {/* ── Info List — semua field dari register ── */}
                <div className="profil-info-list">

                  {/* Email */}
                  <div className="profil-info-item">
                    <div className="profil-info-icon">
                      <AppIcon name="Mail" size={16} color="#64748b" />
                    </div>
                    <div>
                      <div className="profil-info-label">Email</div>
                      <div className="profil-info-val">{user?.email || "—"}</div>
                    </div>
                  </div>

                  {/* NIM */}
                  <div className="profil-info-item">
                    <div className="profil-info-icon">
                      <AppIcon name="CreditCard" size={16} color="#64748b" />
                    </div>
                    <div>
                      <div className="profil-info-label">NIM</div>
                      <div className="profil-info-val">
                        {user?.nim || <span className="muted">Belum tersedia</span>}
                      </div>
                    </div>
                  </div>

                  {/* Telepon — ✅ BARU */}
                  <div className="profil-info-item">
                    <div className="profil-info-icon">
                      <AppIcon name="Phone" size={16} color="#64748b" />
                    </div>
                    <div>
                      <div className="profil-info-label">Telepon</div>
                      <div className="profil-info-val">
                        {user?.telepon || <span className="muted">Belum tersedia</span>}
                      </div>
                    </div>
                  </div>

                  {/* Fakultas — ✅ BARU */}
                  <div className="profil-info-item">
                    <div className="profil-info-icon">
                      <AppIcon name="Building2" size={16} color="#64748b" />
                    </div>
                    <div>
                      <div className="profil-info-label">Fakultas</div>
                      <div className="profil-info-val">
                        {user?.fakultas || <span className="muted">Belum tersedia</span>}
                      </div>
                    </div>
                  </div>

                  {/* Departemen — ✅ BARU */}
                  <div className="profil-info-item">
                    <div className="profil-info-icon">
                      <AppIcon name="BookOpen" size={16} color="#64748b" />
                    </div>
                    <div>
                      <div className="profil-info-label">Departemen</div>
                      <div className="profil-info-val">
                        {user?.departemen || <span className="muted">Belum tersedia</span>}
                      </div>
                    </div>
                  </div>

                  {/* Institusi */}
                  <div className="profil-info-item">
                    <div className="profil-info-icon">
                      <AppIcon name="GraduationCap" size={16} color="#64748b" />
                    </div>
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
                  <AppIcon name="KeyRound" variant="sm" /> Ganti Password
                </button>
                <button
                  className="btn-danger-sm"
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={logout}
                >
                  <AppIcon name="LogOut" variant="sm" /> Keluar dari Akun
                </button>
              </div>
            </div>
          </div>

          {/* ── KOLOM KANAN ── */}
          <div>

            {/* Statistik tiket */}
            <div className="profil-card">
              <div className="profil-card-header">
                <span className="profil-card-title">Statistik Tiket</span>
                <Link to="/tiket/saya" style={{ fontSize: 12, fontWeight: 700, color: "#2563eb", textDecoration: "none" }}>
                  Lihat Semua →
                </Link>
              </div>
              <div className="profil-card-body">
                {loadingTiket ? (
                  <div className="stat-row">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="skeleton" style={{ height: 88, borderRadius: 14 }} />
                    ))}
                  </div>
                ) : (
                  <div className="stat-row">
                    <div className="stat-box total">
                      <div className="stat-box-num">{total}</div>
                      <div className="stat-box-label">Total Dibuat</div>
                    </div>
                    <div className="stat-box proses">
                      <div className="stat-box-num">{proses}</div>
                      <div className="stat-box-label">Sedang Diproses</div>
                    </div>
                    <div className="stat-box selesai">
                      <div className="stat-box-num">{selesai}</div>
                      <div className="stat-box-label">Selesai</div>
                    </div>
                  </div>
                )}

                <div style={{ marginTop: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 12 }}>
                    Tiket Terbaru
                  </div>
                  {loadingTiket ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {[1, 2, 3].map(i => (
                        <div key={i} className="skeleton" style={{ height: 44, borderRadius: 10 }} />
                      ))}
                    </div>
                  ) : recent.length > 0 ? (
                    <div className="tiket-list-mini">
                      {recent.map(t => (
                        <Link key={t.id} to={`/tiket/${t.id}`} className="tiket-mini-item">
                          <span className="tiket-mini-id">#{t.id}</span>
                          <span className="tiket-mini-subj">{t.subjek}</span>
                          <span className={`tiket-mini-pill pill-${t.status}`}>{t.status}</span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="tiket-mini-empty" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                      <AppIcon name="Inbox" size={28} color="#cbd5e1" />
                      Belum ada tiket yang dibuat
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Edit profil — ✅ sekarang termasuk telepon, fakultas, departemen */}
            <div className="profil-card">
              <div className="profil-card-header">
                <span className="profil-card-title">Edit Profil</span>
                {!editMode && (
                  <button
                    className="btn-outline-sm"
                    style={{ padding: "5px 14px", fontSize: 12 }}
                    onClick={handleOpenEdit}
                  >
                    <AppIcon name="Pencil" variant="sm" /> Edit
                  </button>
                )}
              </div>
              <div className="profil-card-body">
                {namaMsg.text && (
                  <div className={namaMsg.type === "success" ? "alert-success" : "alert-error"}>
                    {namaMsg.type === "success"
                      ? <AppIcon name="CheckCircle" variant="sm" />
                      : <AppIcon name="AlertTriangle" variant="sm" />}
                    {namaMsg.text}
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
                    placeholder="Masukkan nama lengkap"
                  />
                </div>

                {/* Email — readonly selalu */}
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-input readonly" value={user?.email || ""} readOnly />
                  <div className="form-hint">Email tidak dapat diubah.</div>
                </div>

                {/* NIM */}
                <div className="form-group">
                  <label className="form-label">NIM</label>
                  <input
                    type="text"
                    className={`form-input ${!editMode ? "readonly" : ""}`}
                    value={editMode ? formNim : (user?.nim || "")}
                    onChange={e => setFormNim(e.target.value)}
                    readOnly={!editMode}
                    placeholder={editMode ? "Masukkan NIM kamu" : "Belum tersedia"}
                  />
                </div>

                {/* Telepon — ✅ BARU */}
                <div className="form-group">
                  <label className="form-label">Nomor Telepon</label>
                  <input
                    type="text"
                    className={`form-input ${!editMode ? "readonly" : ""}`}
                    value={editMode ? formTelepon : (user?.telepon || "")}
                    onChange={e => setFormTelepon(e.target.value)}
                    readOnly={!editMode}
                    placeholder={editMode ? "08xx atau +62xxx" : "Belum tersedia"}
                  />
                </div>

                {/* Fakultas — ✅ BARU */}
                <div className="form-group">
                  <label className="form-label">Fakultas / Sekolah</label>
                  {editMode ? (
                    <select
                      className="form-select"
                      value={formFakultas}
                      onChange={e => { setFormFakultas(e.target.value); setFormDepartemen(""); }}
                    >
                      <option value="">— Pilih Fakultas —</option>
                      {FAKULTAS.map(f => (
                        <option key={f.nama} value={f.nama}>{f.nama}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      className="form-input readonly"
                      value={user?.fakultas || ""}
                      readOnly
                      placeholder="Belum tersedia"
                    />
                  )}
                </div>

                {/* Departemen — ✅ BARU */}
                <div className="form-group" style={{ marginBottom: editMode ? 18 : 0 }}>
                  <label className="form-label">Departemen / Program Studi</label>
                  {editMode ? (
                    <select
                      className="form-select"
                      value={formDepartemen}
                      onChange={e => setFormDepartemen(e.target.value)}
                      disabled={!formFakultas}
                    >
                      <option value="">
                        {formFakultas ? "— Pilih Departemen —" : "Pilih fakultas dahulu"}
                      </option>
                      {departemenList.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      className="form-input readonly"
                      value={user?.departemen || ""}
                      readOnly
                      placeholder="Belum tersedia"
                    />
                  )}
                </div>

                {editMode && (
                  <div className="btn-row">
                    <button
                      className="btn-primary-sm"
                      disabled={savingNama || !formNama.trim()}
                      onClick={handleSaveNama}
                    >
                      {savingNama
                        ? "Menyimpan..."
                        : <><AppIcon name="Save" variant="sm" /> Simpan Perubahan</>}
                    </button>
                    <button
                      className="btn-outline-sm"
                      onClick={() => { setEditMode(false); setNamaMsg({ type: "", text: "" }); }}
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
                    <div style={{ fontSize: 12, color: "#94a3b8" }}>Terakhir diubah: tidak diketahui</div>
                  </div>
                  <button className="btn-outline-sm" onClick={() => setShowPwModal(true)}>
                    <AppIcon name="KeyRound" variant="sm" /> Ganti Password
                  </button>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0 0" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", marginBottom: 3 }}>Status Akun</div>
                    <div style={{ fontSize: 12, color: "#94a3b8" }}>Akun aktif dan terverifikasi</div>
                  </div>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 12px", background: "#f0fdf4", color: "#15803d", borderRadius: 100, fontSize: 11, fontWeight: 700 }}>
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