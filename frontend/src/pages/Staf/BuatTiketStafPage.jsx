import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import AppIcon from "../../components/ui/AppIcon";

const styles = `
  .staf-main { padding: 32px 40px; max-width: 900px; width: 100%; margin: 0 auto; font-family: var(--font-sans); }
  .staf-breadcrumb { font-size: 13px; color: var(--gray-500); margin-bottom: 16px; }
  .staf-breadcrumb span { margin: 0 6px; }
  .staf-breadcrumb a { color: var(--gray-500); text-decoration: none; }
  .staf-breadcrumb a:hover { color: var(--color-brand); }
  .staf-breadcrumb strong { color: var(--gray-700); }

  .buat-tiket-card { padding: 32px 36px; background: var(--white); border-radius: 16px; border: 1.5px solid var(--gray-200); box-shadow: 0 2px 10px rgba(0,0,0,0.02); }
  .buat-tiket-card h1 { font-family: var(--font-display); font-size: 28px; font-weight: 800; color: var(--gray-900); margin-bottom: 6px; }
  .buat-tiket-card .subtitle { font-size: 14px; color: var(--gray-500); margin-bottom: 28px; line-height: 1.5; }
  .buat-tiket-divider { height: 1.5px; background: var(--gray-100); margin: 24px 0; }

  .form-group { margin-bottom: 22px; }
  .form-label { display: block; font-size: 13px; font-weight: 700; color: var(--gray-700); margin-bottom: 8px; }
  .form-nim-wrap { position: relative; }
  .form-nim-wrap .search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--gray-400); font-size: 15px; }
  .form-input { width: 100%; border: 1.5px solid var(--gray-200); border-radius: 10px; padding: 11px 16px; font-size: 14px; color: var(--gray-700); font-family: var(--font-sans); outline: none; transition: border-color 0.18s; background: var(--gray-50); box-sizing: border-box; }
  .form-input.with-icon { padding-left: 40px; }
  .form-input:focus { border-color: var(--color-brand); background: var(--white); }
  .form-input::placeholder { color: var(--gray-400); }
  .form-input.error-border { border-color: #dc2626; }
  .form-hint { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--gray-500); margin-top: 6px; }
  .form-error { font-size: 12px; color: #dc2626; margin-top: 6px; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .form-select { width: 100%; border: 1.5px solid var(--gray-200); border-radius: 10px; padding: 11px 16px; font-size: 14px; color: var(--gray-700); font-family: var(--font-sans); outline: none; transition: border-color 0.18s; background: var(--gray-50); cursor: pointer; box-sizing: border-box; }
  .form-select:focus { border-color: var(--color-brand); background: var(--white); }
  .form-textarea { width: 100%; border: 1.5px solid var(--gray-200); border-radius: 10px; padding: 12px 16px; font-size: 14px; color: var(--gray-700); font-family: var(--font-sans); outline: none; transition: border-color 0.18s; background: var(--gray-50); resize: vertical; min-height: 120px; box-sizing: border-box; }
  .form-textarea:focus { border-color: var(--color-brand); background: var(--white); }
  .form-textarea::placeholder { color: var(--gray-400); }

  .buat-tiket-actions { display: flex; align-items: center; justify-content: flex-end; gap: 12px; margin-top: 28px; }
  .btn-batal { padding: 10px 20px; border: 1.5px solid var(--gray-200); border-radius: 8px; background: var(--white); font-size: 13px; font-weight: 600; color: var(--gray-700); cursor: pointer; font-family: var(--font-sans); transition: all 0.18s; }
  .btn-batal:hover { background: var(--gray-100); }
  .btn-buat { display: flex; align-items: center; gap: 8px; padding: 10px 22px; border: none; border-radius: 8px; background: var(--color-brand); font-size: 13px; font-weight: 700; color: var(--white); cursor: pointer; font-family: var(--font-sans); transition: all 0.18s; }
  .btn-buat:hover { background: #1d4ed8; }
  .btn-buat:disabled { background: #93c5fd; cursor: not-allowed; }

  .success-banner { background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 12px; padding: 16px 20px; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; font-size: 14px; color: #15803d; font-weight: 600; }
  .error-banner { background: #fef2f2; border: 1.5px solid #fecaca; border-radius: 12px; padding: 16px 20px; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; font-size: 14px; color: #dc2626; }
`;

export default function BuatTiketStafPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nim: "",
    subjek: "",
    departemen_tujuan: "",
    deskripsi: "",
  });
  const [errors, setErrors]   = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const validate = () => {
    const e = {};
    if (!form.nim.trim())       e.nim = "NIM Mahasiswa wajib diisi.";
    if (!form.subjek.trim())    e.subjek = "Subjek wajib diisi.";
    if (!form.departemen_tujuan) e.departemen_tujuan = "Pilih departemen tujuan.";
    if (!form.deskripsi.trim()) e.deskripsi = "Deskripsi wajib diisi.";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setSubmitting(true);
    setSuccessMsg("");

    // Simulate sending data to another department
    setTimeout(() => {
      setSuccessMsg(`Tiket keluhan/permintaan dari mahasiswa (${form.nim}) berhasil diteruskan ke ${form.departemen_tujuan}.`);
      setSubmitting(false);
      setTimeout(() => navigate("/staff/dashboard"), 2500);
    }, 1200);
  };

  const handleChange = (field, val) => {
    setForm(prev => ({ ...prev, [field]: val }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  return (
    <>
      <style>{styles}</style>
      <main className="staf-main">
        <div className="staf-breadcrumb">
          <Link to="/staff/dashboard">Dashboard</Link><span>›</span>
          <strong>Teruskan Tiket</strong>
        </div>

        <div className="buat-tiket-card">
          <h1>Teruskan Keluhan Mahasiswa</h1>
          <div className="subtitle">
            Form ini digunakan untuk meneruskan keluhan atau permintaan mahasiswa yang membutuhkan tindak lanjut lebih lanjut seperti pembuatan surat, persetujuan dekanat, atau penanganan bagian terkait.
          </div>

          {successMsg && <div className="success-banner"><AppIcon name="CheckCircle" variant="sm" /> {successMsg}</div>}

          {/* NIM */}
          <div className="form-group">
            <label className="form-label">NIM Mahasiswa *</label>
            <div className="form-nim-wrap">
              <span className="search-icon"><AppIcon name="User" variant="sm" color="var(--gray-400)" /></span>
              <input
                className={`form-input with-icon ${errors.nim ? "error-border" : ""}`}
                placeholder="Masukkan NIM Mahasiswa yang mengajukan keluhan"
                value={form.nim}
                onChange={e => handleChange("nim", e.target.value)}
              />
            </div>
            {errors.nim && <div className="form-error">{errors.nim}</div>}
          </div>

          <div className="buat-tiket-divider" />

          <div className="form-row">
            {/* Subjek */}
            <div className="form-group">
              <label className="form-label">Subjek / Topik Utama *</label>
              <input
                className={`form-input ${errors.subjek ? "error-border" : ""}`}
                placeholder="Misal: Permohonan Surat Izin Penelitian"
                value={form.subjek}
                onChange={e => handleChange("subjek", e.target.value)}
              />
              {errors.subjek && <div className="form-error">{errors.subjek}</div>}
            </div>

            {/* Departemen Tujuan */}
            <div className="form-group">
              <label className="form-label">Departemen / Bagian Tujuan *</label>
              <select
                className={`form-select ${errors.departemen_tujuan ? "error-border" : ""}`}
                value={form.departemen_tujuan}
                onChange={e => handleChange("departemen_tujuan", e.target.value)}
              >
                <option value="">Pilih Tujuan</option>
                <option value="Fakultas / Dekanat">Fakultas / Dekanat</option>
                <option value="Departemen Akademik">Departemen Akademik</option>
                <option value="Direktorat Kemahasiswaan">Direktorat Kemahasiswaan</option>
                <option value="Direktorat Keuangan">Direktorat Keuangan</option>
                <option value="Tim IT Support">Tim IT Support</option>
              </select>
              {errors.departemen_tujuan && <div className="form-error">{errors.departemen_tujuan}</div>}
            </div>
          </div>

          {/* Deskripsi */}
          <div className="form-group">
            <label className="form-label">Deskripsi & Catatan Tindak Lanjut *</label>
            <textarea
              className={`form-textarea ${errors.deskripsi ? "error-border" : ""}`}
              placeholder="Jelaskan kebutuhan mahasiswa dan tindak lanjut yang diperlukan oleh bagian tujuan..."
              value={form.deskripsi}
              onChange={e => handleChange("deskripsi", e.target.value)}
            />
            {errors.deskripsi && <div className="form-error">{errors.deskripsi}</div>}
          </div>

          <div className="buat-tiket-actions">
            <button className="btn-batal" onClick={() => navigate(-1)}>Kembali</button>
            <button className="btn-buat" disabled={submitting} onClick={handleSubmit}>
              {submitting ? "Meneruskan..." : "Teruskan Tiket ▷"}
            </button>
          </div>
        </div>
      </main>
    </>
  );
}