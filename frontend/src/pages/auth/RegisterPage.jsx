// frontend/src/pages/auth/RegisterPage.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import AppIcon from "../../components/ui/AppIcon";

/* ──────────────────────────────────────────────────────────────
   Data Fakultas & Departemen IPB
   ────────────────────────────────────────────────────────────── */
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

/* ──────────────────────────────────────────────────────────────
   Data Divisi Staf — dikelompokkan
   ────────────────────────────────────────────────────────────── */
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

/* ──────────────────────────────────────────────────────────────
   Styles
   ────────────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .pg {
    min-height: 100vh;
    display: flex;
    font-family: var(--font-sans);
  }

  /* ── LEFT PANEL ── */
  .pg-left {
    width: 44%;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 44px 52px;
    background: var(--color-brand-darkest);
  }

  /* IPB campus photo background */
  .pg-left-img {
    position: absolute;
    inset: 0;
    background-image: url('/ipb-bg.jpg');
    background-size: cover;
    background-position: center 60%;
    opacity: 0.22;
    z-index: 0;
    pointer-events: none;
  }

  /* Gradient overlay — keeps brand colors + readability */
  .pg-left::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(
      150deg,
      rgba(10, 31, 92, 0.92) 0%,
      rgba(26, 58, 138, 0.84) 55%,
      rgba(37, 99, 235, 0.78) 100%
    );
    pointer-events: none;
    z-index: 1;
  }

  /* Decorative circles — z-index 2 above overlay */
  .deco { position: absolute; border-radius: 50%; pointer-events: none; z-index: 2; }
  .deco-c1 { width: 500px; height: 500px; top: -180px; right: -140px; border: 1px solid rgba(255,255,255,0.06); }
  .deco-c2 { width: 280px; height: 280px; bottom: -60px; left: -60px; border: 1px solid rgba(255,255,255,0.06); }
  .deco-blob {
    width: 360px; height: 360px;
    background: radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%);
    bottom: -60px; right: -60px;
  }

  .brand { display: flex; align-items: center; gap: 14px; position: relative; z-index: 3; }
  .brand-icon {
    width: 48px; height: 48px; border-radius: 12px;
    background: rgba(255,255,255,0.14);
    border: 1.5px solid rgba(255,255,255,0.22);
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; backdrop-filter: blur(8px);
  }
  .brand-text { color: var(--white); }
  .brand-text .univ {
    font-size: 10px; font-weight: 600;
    letter-spacing: 2.5px; text-transform: uppercase;
    opacity: 0.65; display: block; margin-bottom: 1px;
  }
  .brand-text .prod { font-size: 18px; font-weight: 700; letter-spacing: -0.3px; }

  .hero { position: relative; z-index: 3; margin: auto 0; }
  .hero-pill {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.18);
    border-radius: 100px; padding: 5px 14px;
    font-size: 11.5px; font-weight: 500;
    color: rgba(255,255,255,0.8); margin-bottom: 20px;
  }
  .hero h1 {
    font-family: var(--font-display);
    font-size: clamp(26px, 2.8vw, 36px); font-weight: 800;
    color: var(--white); line-height: 1.15;
    letter-spacing: -1px; margin-bottom: 16px;
  }
  .hero p {
    color: rgba(255,255,255,0.55);
    font-size: 13.5px; line-height: 1.75; max-width: 300px;
  }

  .left-features { position: relative; z-index: 3; display: flex; flex-direction: column; gap: 10px; }

  .feat-item {
    display: flex; align-items: center; gap: 10px;
    color: rgba(255,255,255,0.65); font-size: 12.5px;
  }
  .feat-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: rgba(255,255,255,0.4); flex-shrink: 0;
  }

  /* ── RIGHT PANEL ── */
  .pg-right {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: flex-start;
    padding: 40px 40px; background: var(--white);
    overflow-y: auto;
  }
  .form-box { width: 100%; max-width: 440px; padding-bottom: 40px; }

  /* ── TAB SWITCHER ── */
  .role-tabs {
    display: flex; gap: 0;
    background: var(--gray-100);
    border-radius: 10px;
    padding: 4px;
    margin-bottom: 24px;
  }
  .role-tab {
    flex: 1; padding: 9px 16px;
    border: none; border-radius: 7px;
    font-family: var(--font-sans);
    font-size: 13px; font-weight: 600;
    cursor: pointer; transition: all 0.18s ease;
    color: var(--gray-500); background: transparent;
    display: flex; align-items: center; justify-content: center; gap: 6px;
  }
  .role-tab.active {
    background: var(--white);
    color: #0a1f5c;
    box-shadow: 0 1px 6px rgba(0,0,0,0.08);
  }

  /* ── FORM HEADER ── */
  .form-head { margin-bottom: 20px; }
  .form-head .badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: #eff6ff; color: var(--color-brand);
    border: 1px solid #bfdbfe; border-radius: 100px;
    padding: 4px 11px; font-size: 11px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.6px;
    margin-bottom: 10px;
  }
  .form-head h2 {
    font-family: var(--font-display);
    font-size: 22px; font-weight: 800;
    color: var(--gray-900); letter-spacing: -0.5px;
    margin-bottom: 5px;
  }
  .form-head p { font-size: 13px; color: var(--gray-500); line-height: 1.55; }

  /* ── FIELD ── */
  .field { margin-bottom: 13px; }
  .field-lbl {
    font-size: 12.5px; font-weight: 600;
    color: var(--gray-700); margin-bottom: 5px; display: block;
  }
  .input-wrap { position: relative; }
  .input-icon {
    position: absolute; left: 13px; top: 50%;
    transform: translateY(-50%);
    color: var(--gray-400); pointer-events: none;
    display: flex; align-items: center; justify-content: center;
  }
  .fi {
    width: 100%; height: 44px;
    padding: 0 13px 0 40px;
    border: 1.5px solid var(--gray-200); border-radius: 10px;
    font-family: var(--font-sans);
    font-size: 13.5px; color: var(--gray-900);
    background: var(--white); outline: none;
    transition: all 0.18s ease;
  }
  .fi::placeholder { color: var(--gray-400); }
  .fi:focus { border-color: #93c5fd; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
  .fi.err { border-color: #dc2626; box-shadow: 0 0 0 3px rgba(220,38,38,0.07); }
  select.fi {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2394a3b8' stroke-width='1.8' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    padding-right: 36px;
    color: var(--gray-900);
  }
  select.fi option[value=""] { color: var(--gray-400); }
  select.fi:disabled { background-color: var(--gray-50); color: var(--gray-400); cursor: not-allowed; }
  .eye {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    color: var(--gray-400); padding: 0; transition: color 0.15s;
    display: flex; align-items: center;
  }
  .eye:hover { color: var(--gray-500); }
  .ferr { margin-top: 4px; font-size: 11.5px; color: #dc2626; }

  /* ── DIVISI GROUP LABEL ── */
  .select-group-label {
    font-size: 10px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.5px;
    color: var(--gray-400); padding: 6px 8px 2px;
    pointer-events: none;
  }

  /* ── ALERT ── */
  .alert-err {
    background: #fef2f2; border: 1px solid #fecaca;
    color: #dc2626; padding: 11px 14px;
    border-radius: 9px; font-size: 13px; margin-bottom: 16px;
    display: flex; gap: 8px; align-items: flex-start;
  }

  /* ── SUBMIT BUTTON ── */
  .btn-submit {
    width: 100%; height: 48px; margin-top: 8px;
    border: none; border-radius: 10px;
    font-family: var(--font-sans);
    font-size: 14px; font-weight: 700;
    color: var(--white); cursor: pointer;
    background: linear-gradient(130deg, #0a1f5c 0%, var(--color-brand) 60%, #0ea5e9 100%);
    box-shadow: 0 4px 18px rgba(37,99,235,0.28);
    transition: all 0.2s ease;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .btn-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(37,99,235,0.38);
  }
  .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  /* ── FOOTER ── */
  .footer-note {
    margin-top: 18px;
    font-size: 13px; color: var(--gray-500);
    text-align: center; line-height: 1.9;
  }
  .footer-note a { color: var(--color-brand); font-weight: 700; text-decoration: none; }
  .footer-note a:hover { text-decoration: underline; }

  /* ── GRUP BADGE di divisi info ── */
  .divisi-info {
    margin-top: 6px; padding: 10px 12px;
    background: #eff6ff; border: 1px solid #bfdbfe;
    border-radius: 8px; font-size: 12px; color: #1d4ed8;
    display: flex; gap: 6px; align-items: flex-start; line-height: 1.5;
  }

  @media (max-width: 860px) {
    .pg-left { display: none; }
    .pg-right { padding: 28px 20px; }
  }
`;

/* ──────────────────────────────────────────────────────────────
   Helper: cari grup divisi
   ────────────────────────────────────────────────────────────── */
function findGrupDivisi(divisiName) {
  for (const g of DIVISI_STAF) {
    if (g.divisi.includes(divisiName)) return g.grup;
  }
  return null;
}

/* ──────────────────────────────────────────────────────────────
   FORM MAHASISWA
   ────────────────────────────────────────────────────────────── */
function FormMahasiswa() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [nim, setNim] = useState("");
  const [telepon, setTelepon] = useState("");
  const [fakultas, setFakultas] = useState("");
  const [departemen, setDepartemen] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const fakultasObj = FAKULTAS.find(f => f.nama === fakultas);
  const departemenList = fakultasObj ? fakultasObj.departemen : [];

  const clearErr = k => setErrors(p => ({ ...p, [k]: "" }));

  const validate = () => {
    const e = {};
    if (!nama.trim()) e.nama = "Nama lengkap wajib diisi";
    if (!email.trim()) e.email = "E-mail wajib diisi";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Format e-mail tidak valid";
    if (!nim.trim()) e.nim = "NIM wajib diisi";
    if (!telepon.trim()) e.telepon = "Nomor telepon wajib diisi";
    else if (!/^(\+62|08)\d{8,12}$/.test(telepon.replace(/\s/g, "")))
      e.telepon = "Format tidak valid (08xx atau +62)";
    if (!fakultas) e.fakultas = "Fakultas wajib dipilih";
    if (!departemen) e.departemen = "Departemen wajib dipilih";
    if (!password) e.password = "Kata sandi wajib diisi";
    else if (password.length < 6) e.password = "Minimal 6 karakter";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    try {
      await register({ nama, email, password, role: "mahasiswa", nim, telepon, fakultas, departemen });
      navigate("/login");
    } catch (err) {
      const msg = err?.detail || err?.message || "Registrasi gagal, silakan coba lagi.";
      setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="form-head">
        <span className="badge">
          <AppIcon name="GraduationCap" size={12} /> Akun Mahasiswa
        </span>
        <h2>Daftar Sebagai Mahasiswa</h2>
        <p>Lengkapi data berikut untuk membuat akun mahasiswa IPB.</p>
      </div>

      {errors.general && (
        <div className="alert-err">
          <AppIcon name="AlertCircle" size={15} /> {errors.general}
        </div>
      )}

      {/* Nama */}
      <div className="field">
        <label className="field-lbl">Nama Lengkap</label>
        <div className="input-wrap">
          <span className="input-icon"><AppIcon name="User" size={15} /></span>
          <input className={`fi ${errors.nama ? "err" : ""}`} placeholder="Nama sesuai KTM"
            value={nama} onChange={e => { setNama(e.target.value); clearErr("nama"); }} />
        </div>
        {errors.nama && <div className="ferr">{errors.nama}</div>}
      </div>

      {/* Email */}
      <div className="field">
        <label className="field-lbl">Email IPB</label>
        <div className="input-wrap">
          <span className="input-icon"><AppIcon name="Mail" size={15} /></span>
          <input type="email" className={`fi ${errors.email ? "err" : ""}`}
            placeholder="username@apps.ipb.ac.id"
            value={email} onChange={e => { setEmail(e.target.value); clearErr("email"); }} />
        </div>
        {errors.email && <div className="ferr">{errors.email}</div>}
      </div>

      {/* NIM */}
      <div className="field">
        <label className="field-lbl">NIM</label>
        <div className="input-wrap">
          <span className="input-icon"><AppIcon name="CreditCard" size={15} /></span>
          <input className={`fi ${errors.nim ? "err" : ""}`} placeholder="Nomor Induk Mahasiswa"
            value={nim} onChange={e => { setNim(e.target.value); clearErr("nim"); }} />
        </div>
        {errors.nim && <div className="ferr">{errors.nim}</div>}
      </div>

      {/* Telepon */}
      <div className="field">
        <label className="field-lbl">Nomor Telepon</label>
        <div className="input-wrap">
          <span className="input-icon"><AppIcon name="Phone" size={15} /></span>
          <input className={`fi ${errors.telepon ? "err" : ""}`} placeholder="08xx atau +62xxx"
            value={telepon} onChange={e => { setTelepon(e.target.value); clearErr("telepon"); }} />
        </div>
        {errors.telepon && <div className="ferr">{errors.telepon}</div>}
      </div>

      {/* Fakultas */}
      <div className="field">
        <label className="field-lbl">Fakultas / Sekolah</label>
        <div className="input-wrap">
          <span className="input-icon"><AppIcon name="Building2" size={15} /></span>
          <select className={`fi ${errors.fakultas ? "err" : ""}`} value={fakultas}
            onChange={e => { setFakultas(e.target.value); setDepartemen(""); clearErr("fakultas"); }}>
            <option value="">— Pilih Fakultas —</option>
            {FAKULTAS.map(f => (
              <option key={f.nama} value={f.nama}>{f.nama}</option>
            ))}
          </select>
        </div>
        {errors.fakultas && <div className="ferr">{errors.fakultas}</div>}
      </div>

      {/* Departemen */}
      <div className="field">
        <label className="field-lbl">Departemen / Program Studi</label>
        <div className="input-wrap">
          <span className="input-icon"><AppIcon name="BookOpen" size={15} /></span>
          <select className={`fi ${errors.departemen ? "err" : ""}`} value={departemen}
            disabled={!fakultas}
            onChange={e => { setDepartemen(e.target.value); clearErr("departemen"); }}>
            <option value="">{fakultas ? "— Pilih Departemen —" : "Pilih fakultas dahulu"}</option>
            {departemenList.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        {errors.departemen && <div className="ferr">{errors.departemen}</div>}
      </div>

      {/* Password */}
      <div className="field">
        <label className="field-lbl">Kata Sandi</label>
        <div className="input-wrap">
          <span className="input-icon"><AppIcon name="Lock" size={15} /></span>
          <input type={showPass ? "text" : "password"}
            className={`fi ${errors.password ? "err" : ""}`}
            placeholder="Minimal 6 karakter"
            value={password} onChange={e => { setPassword(e.target.value); clearErr("password"); }}
            style={{ paddingRight: 42 }} />
          <button type="button" className="eye" onClick={() => setShowPass(!showPass)}>
            <AppIcon name={showPass ? "EyeOff" : "Eye"} size={15} />
          </button>
        </div>
        {errors.password && <div className="ferr">{errors.password}</div>}
      </div>

      <button className="btn-submit" disabled={loading} onClick={handleSubmit}>
        {loading ? "Mendaftarkan..." : "Daftar Sebagai Mahasiswa →"}
      </button>
    </>
  );
}

/* ──────────────────────────────────────────────────────────────
   FORM STAF
   ────────────────────────────────────────────────────────────── */
function FormStaf() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [telepon, setTelepon] = useState("");
  const [divisi, setDivisi] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const clearErr = k => setErrors(p => ({ ...p, [k]: "" }));
  const grupDivisi = divisi ? findGrupDivisi(divisi) : null;

  const validate = () => {
    const e = {};
    if (!nama.trim()) e.nama = "Nama lengkap wajib diisi";
    if (!email.trim()) e.email = "E-mail wajib diisi";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Format e-mail tidak valid";
    if (!telepon.trim()) e.telepon = "Nomor telepon wajib diisi";
    else if (!/^(\+62|08)\d{8,12}$/.test(telepon.replace(/\s/g, "")))
      e.telepon = "Format tidak valid (08xx atau +62)";
    if (!divisi) e.divisi = "Divisi wajib dipilih";
    if (!password) e.password = "Kata sandi wajib diisi";
    else if (password.length < 6) e.password = "Minimal 6 karakter";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    try {
      await register({ nama, email, password, role: "staf", telepon, divisi });
      navigate("/login");
    } catch (err) {
      const msg = err?.detail || err?.message || "Registrasi gagal, silakan coba lagi.";
      setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="form-head">
        <span className="badge" style={{ background: "#fefce8", color: "#a16207", borderColor: "#fde68a" }}>
          <AppIcon name="Shield" size={12} /> Akun Staf
        </span>
        <h2>Daftar Sebagai Staf</h2>
        <p>Lengkapi data berikut untuk membuat akun staf layanan akademik IPB.</p>
      </div>

      {errors.general && (
        <div className="alert-err">
          <AppIcon name="AlertCircle" size={15} /> {errors.general}
        </div>
      )}

      {/* Nama */}
      <div className="field">
        <label className="field-lbl">Nama Lengkap</label>
        <div className="input-wrap">
          <span className="input-icon"><AppIcon name="User" size={15} /></span>
          <input className={`fi ${errors.nama ? "err" : ""}`} placeholder="Nama lengkap staf"
            value={nama} onChange={e => { setNama(e.target.value); clearErr("nama"); }} />
        </div>
        {errors.nama && <div className="ferr">{errors.nama}</div>}
      </div>

      {/* Email */}
      <div className="field">
        <label className="field-lbl">Email</label>
        <div className="input-wrap">
          <span className="input-icon"><AppIcon name="Mail" size={15} /></span>
          <input type="email" className={`fi ${errors.email ? "err" : ""}`}
            placeholder="email@ipb.ac.id"
            value={email} onChange={e => { setEmail(e.target.value); clearErr("email"); }} />
        </div>
        {errors.email && <div className="ferr">{errors.email}</div>}
      </div>

      {/* Telepon */}
      <div className="field">
        <label className="field-lbl">Nomor Telepon</label>
        <div className="input-wrap">
          <span className="input-icon"><AppIcon name="Phone" size={15} /></span>
          <input className={`fi ${errors.telepon ? "err" : ""}`} placeholder="08xx atau +62xxx"
            value={telepon} onChange={e => { setTelepon(e.target.value); clearErr("telepon"); }} />
        </div>
        {errors.telepon && <div className="ferr">{errors.telepon}</div>}
      </div>

      {/* Divisi — grouped optgroup */}
      <div className="field">
        <label className="field-lbl">Nama Divisi</label>
        <div className="input-wrap">
          <span className="input-icon"><AppIcon name="Briefcase" size={15} /></span>
          <select className={`fi ${errors.divisi ? "err" : ""}`} value={divisi}
            onChange={e => { setDivisi(e.target.value); clearErr("divisi"); }}>
            <option value="">— Pilih Divisi —</option>
            {DIVISI_STAF.map(g => (
              <optgroup key={g.grup} label={`── ${g.grup} (${g.divisi.length})`}>
                {g.divisi.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        {errors.divisi && <div className="ferr">{errors.divisi}</div>}
        {divisi && grupDivisi && (
          <div className="divisi-info">
            <AppIcon name="Info" size={13} />
            <span>Kelompok: <strong>{grupDivisi}</strong></span>
          </div>
        )}
      </div>

      {/* Password */}
      <div className="field">
        <label className="field-lbl">Kata Sandi</label>
        <div className="input-wrap">
          <span className="input-icon"><AppIcon name="Lock" size={15} /></span>
          <input type={showPass ? "text" : "password"}
            className={`fi ${errors.password ? "err" : ""}`}
            placeholder="Minimal 6 karakter"
            value={password} onChange={e => { setPassword(e.target.value); clearErr("password"); }}
            style={{ paddingRight: 42 }} />
          <button type="button" className="eye" onClick={() => setShowPass(!showPass)}>
            <AppIcon name={showPass ? "EyeOff" : "Eye"} size={15} />
          </button>
        </div>
        {errors.password && <div className="ferr">{errors.password}</div>}
      </div>

      <button className="btn-submit" disabled={loading} onClick={handleSubmit}
        style={{ background: "linear-gradient(130deg, #92400e 0%, #d97706 60%, #f59e0b 100%)", boxShadow: "0 4px 18px rgba(180,120,0,0.25)" }}>
        {loading ? "Mendaftarkan..." : "Daftar Sebagai Staf →"}
      </button>
    </>
  );
}

/* ──────────────────────────────────────────────────────────────
   MAIN PAGE
   ────────────────────────────────────────────────────────────── */
export default function RegisterPage() {
  const [role, setRole] = useState("mahasiswa"); // "mahasiswa" | "staf"

  const leftContent = {
    mahasiswa: {
      pill: "⊙ Pendaftaran Mahasiswa",
      title: "Mulai layanan akademikmu di sini.",
      desc: "Daftarkan akun mahasiswa untuk mengajukan tiket bantuan, berkonsultasi dengan administrasi, dan memantau status permohonanmu secara real-time.",
      features: [
        "Buat & pantau tiket pengaduan",
        "Chatbot bantuan akademik 24/7",
        "Riwayat komunikasi tersimpan",
      ],
    },
    staf: {
      pill: "⊙ Pendaftaran Staf",
      title: "Kelola layanan akademik mahasiswa.",
      desc: "Daftarkan akun staf untuk menangani tiket bantuan mahasiswa, memproses pengaduan, dan memberikan respons layanan akademik secara efisien.",
      features: [
        "Kelola antrean tiket masuk",
        "Klaim & proses pengaduan",
        "Dashboard monitoring layanan",
      ],
    },
  };

  const c = leftContent[role];

  return (
    <>
      <style>{styles}</style>
      <div className="pg">
        {/* ── LEFT ── */}
        <div className="pg-left">
          {/* IPB campus photo — sits behind everything */}
          <div className="pg-left-img" />

          <div className="deco deco-c1" />
          <div className="deco deco-c2" />
          <div className="deco deco-blob" />

          <div className="brand">
            <div className="brand-icon">
              <AppIcon name="GraduationCap" size={22} color="white" />
            </div>
            <div className="brand-text">
              <span className="univ">IPB University</span>
              <span className="prod">banto__o</span>
            </div>
          </div>

          <div className="hero">
            <span className="hero-pill">{c.pill}</span>
            <h1>{c.title}</h1>
            <p>{c.desc}</p>
          </div>


        </div>

        {/* ── RIGHT ── */}
        <div className="pg-right">
          <div className="form-box">
            {/* Tab switcher */}
            <div className="role-tabs">
              <button
                className={`role-tab ${role === "mahasiswa" ? "active" : ""}`}
                onClick={() => setRole("mahasiswa")}
              >
                <AppIcon name="GraduationCap" size={14} />
                Mahasiswa
              </button>
              <button
                className={`role-tab ${role === "staf" ? "active" : ""}`}
                onClick={() => setRole("staf")}
              >
                <AppIcon name="Shield" size={14} />
                Staf
              </button>
            </div>

            {/* Form sesuai role */}
            {role === "mahasiswa" ? <FormMahasiswa /> : <FormStaf />}

            <div className="footer-note">
              Sudah punya akun? <Link to="/login">Masuk di sini</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}