import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import ticketService from "../../services/ticketService";

const styles = `
  .staf-main { padding: 32px 40px; max-width: 900px; width: 100%; margin: 0 auto; font-family: 'Plus Jakarta Sans', sans-serif; }
  .staf-breadcrumb { font-size: 13px; color: #64748b; margin-bottom: 16px; }
  .staf-breadcrumb span { margin: 0 6px; }
  .staf-breadcrumb a { color: #64748b; text-decoration: none; }
  .staf-breadcrumb a:hover { color: #2563eb; }
  .staf-breadcrumb strong { color: #334155; }

  .buat-tiket-card { background: #fff; border: 1.5px solid #e2e8f0; border-radius: 16px; padding: 32px 36px; box-shadow: 0 2px 16px rgba(0,0,0,0.04); }
  .buat-tiket-card h1 { font-family: 'Fraunces', serif; font-size: 28px; font-weight: 800; color: #0f172a; margin-bottom: 6px; }
  .buat-tiket-card .subtitle { font-size: 14px; color: #64748b; margin-bottom: 28px; line-height: 1.5; }
  .buat-tiket-divider { height: 1.5px; background: #f1f5f9; margin: 24px 0; }

  .form-group { margin-bottom: 22px; }
  .form-label { display: block; font-size: 13px; font-weight: 700; color: #334155; margin-bottom: 8px; }
  .form-nim-wrap { position: relative; }
  .form-nim-wrap .search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 15px; }
  .form-input { width: 100%; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 11px 16px; font-size: 14px; color: #334155; font-family: 'Plus Jakarta Sans', sans-serif; outline: none; transition: border-color 0.18s; background: #f8fafc; box-sizing: border-box; }
  .form-input.with-icon { padding-left: 40px; }
  .form-input:focus { border-color: #2563eb; background: #fff; }
  .form-input::placeholder { color: #94a3b8; }
  .form-input.error-border { border-color: #dc2626; }
  .form-hint { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #64748b; margin-top: 6px; }
  .form-error { font-size: 12px; color: #dc2626; margin-top: 6px; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .form-select { width: 100%; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 11px 16px; font-size: 14px; color: #334155; font-family: 'Plus Jakarta Sans', sans-serif; outline: none; transition: border-color 0.18s; background: #f8fafc; cursor: pointer; box-sizing: border-box; }
  .form-select:focus { border-color: #2563eb; background: #fff; }
  .form-textarea { width: 100%; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 12px 16px; font-size: 14px; color: #334155; font-family: 'Plus Jakarta Sans', sans-serif; outline: none; transition: border-color 0.18s; background: #f8fafc; resize: vertical; min-height: 120px; box-sizing: border-box; }
  .form-textarea:focus { border-color: #2563eb; background: #fff; }
  .form-textarea::placeholder { color: #94a3b8; }

  .buat-tiket-actions { display: flex; align-items: center; justify-content: flex-end; gap: 12px; margin-top: 28px; }
  .btn-batal { padding: 10px 20px; border: 1.5px solid #e2e8f0; border-radius: 8px; background: #fff; font-size: 13px; font-weight: 600; color: #334155; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.18s; }
  .btn-batal:hover { background: #f1f5f9; }
  .btn-buat { display: flex; align-items: center; gap: 8px; padding: 10px 22px; border: none; border-radius: 8px; background: #2563eb; font-size: 13px; font-weight: 700; color: #fff; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.18s; }
  .btn-buat:hover { background: #1d4ed8; }
  .btn-buat:disabled { background: #93c5fd; cursor: not-allowed; }

  .success-banner { background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 12px; padding: 16px 20px; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; font-size: 14px; color: #15803d; font-weight: 600; }
  .error-banner { background: #fef2f2; border: 1.5px solid #fecaca; border-radius: 12px; padding: 16px 20px; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; font-size: 14px; color: #dc2626; }
`;

export default function BuatTiketStafPage() {
  const navigate = useNavigate();
  // const { user } = useAuth(); // tidak dipakai (sudah disesuaikan oleh backend/JWT)

  const [kategoriList, setKategoriList] = useState([]);
  const [form, setForm] = useState({
    nim: "",
    subjek: "",
    kategori_id: "",
    deskripsi: "",
  });
  const [errors, setErrors]   = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg]     = useState("");

  // Load kategori dari backend
  useEffect(() => {
    ticketService.getKategori()
      .then(res => setKategoriList(Array.isArray(res) ? res : []))
      .catch(() => {});
  }, []);

  const validate = () => {
    const e = {};
    if (!form.subjek.trim())    e.subjek    = "Subjek tiket wajib diisi.";
    if (!form.deskripsi.trim()) e.deskripsi = "Deskripsi wajib diisi.";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    try {
      setSubmitting(true);
      setErrorMsg("");
      setSuccessMsg("");

      const payload = {
        subjek: form.subjek.trim(),
        deskripsi: form.deskripsi.trim(),
        kategori_id: form.kategori_id ? Number(form.kategori_id) : null,
        // mahasiswa_id diisi dari JWT di backend (current_user.id)
        // Jika staf membuat atas nama mahasiswa, perlu endpoint berbeda
        // Untuk sementara, tiket dibuat atas nama staf yang login
      };

      await ticketService.createTicketByStaf(payload);
      setSuccessMsg("Tiket berhasil dibuat! Mengalihkan ke dashboard...");
      setTimeout(() => navigate("/staff/dashboard"), 1500);
    } catch (err) {
      setErrorMsg(err?.response?.data?.detail || "Gagal membuat tiket. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
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
          <a href="/staff/dashboard">Tiket Saya</a><span>›</span>
          <strong>Buat Tiket Baru</strong>
        </div>

        <div className="buat-tiket-card">
          <h1>Buat Tiket</h1>
          <div className="subtitle">
            Buat tiket permintaan layanan atau keluhan.<br />
            Tiket akan diproses oleh tim staf yang tersedia.
          </div>

          {successMsg && <div className="success-banner">✅ {successMsg}</div>}
          {errorMsg   && <div className="error-banner">❌ {errorMsg}</div>}

          {/* NIM (opsional - untuk referensi) */}
          <div className="form-group">
            <label className="form-label">NIM Mahasiswa <span style={{ color: "#94a3b8", fontWeight: 400 }}>(opsional)</span></label>
            <div className="form-nim-wrap">
              <span className="search-icon">🔍</span>
              <input
                className="form-input with-icon"
                placeholder="Masukkan NIM jika mewakili mahasiswa (Misal: G64190...)"
                value={form.nim}
                onChange={e => handleChange("nim", e.target.value)}
              />
            </div>
            <div className="form-hint">ⓘ Kosongkan jika tiket untuk keperluan staf sendiri.</div>
          </div>

          <div className="buat-tiket-divider" />

          {/* Subjek */}
          <div className="form-group">
            <label className="form-label">Subjek Tiket</label>
            <input
              className={`form-input ${errors.subjek ? "error-border" : ""}`}
              placeholder="Tuliskan ringkasan masalah secara singkat"
              value={form.subjek}
              onChange={e => handleChange("subjek", e.target.value)}
            />
            {errors.subjek && <div className="form-error">{errors.subjek}</div>}
          </div>

          {/* Kategori */}
          <div className="form-group">
            <label className="form-label">Kategori</label>
            <select
              className="form-select"
              value={form.kategori_id}
              onChange={e => handleChange("kategori_id", e.target.value)}
            >
              <option value="">Pilih Kategori</option>
              {kategoriList.map(k => (
                <option key={k.id} value={k.id}>{k.nama_kategori}</option>
              ))}
            </select>
          </div>

          {/* Deskripsi */}
          <div className="form-group">
            <label className="form-label">Deskripsi Detail</label>
            <textarea
              className={`form-textarea ${errors.deskripsi ? "error-border" : ""}`}
              placeholder="Jelaskan detail permasalahan secara lengkap..."
              value={form.deskripsi}
              onChange={e => handleChange("deskripsi", e.target.value)}
            />
            {errors.deskripsi && <div className="form-error">{errors.deskripsi}</div>}
          </div>

          <div className="buat-tiket-actions">
            <button className="btn-batal" onClick={() => navigate(-1)}>Batal</button>
            <button className="btn-buat" disabled={submitting} onClick={handleSubmit}>
              {submitting ? "Membuat..." : "▷ Buat Tiket"}
            </button>
          </div>
        </div>
      </main>
    </>
  );
}