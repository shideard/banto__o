import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=Fraunces:opsz,wght@9..144,700;9..144,900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ipb-blue-dark:  #0a1f5c;
    --ipb-blue:       #1a4fad;
    --ipb-blue-mid:   #2563eb;
    --ipb-blue-lite:  #3b82f6;
    --ipb-sky:        #0ea5e9;
    --white:          #ffffff;
    --off-white:      #f7f9fc;
    --gray-200:       #e2e8f0;
    --gray-400:       #94a3b8;
    --gray-500:       #64748b;
    --gray-700:       #334155;
    --gray-900:       #0f172a;
    --error:          #dc2626;
  }

  .lr-root {
    min-height: 100vh;
    display: flex;
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: var(--off-white);
  }

  /* ─── LEFT PANEL (Branding) ─── */
  .lr-left {
    width: 45%;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 48px 56px;
    background: linear-gradient(145deg, #0a1f5c 0%, #1a4fad 50%, #2563eb 100%);
  }

  .lr-left::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    opacity: 0.5;
  }

  .deco-ring {
    position: absolute;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.07);
    pointer-events: none;
  }
  .deco-ring-1 { width: 400px; height: 400px; top: -100px; left: -100px; }

  .lr-brand {
    display: flex;
    align-items: center;
    gap: 14px;
    position: relative;
    z-index: 1;
  }

  .lr-brand-logo {
    width: 52px; height: 52px;
    background: rgba(255,255,255,0.15);
    border: 1.5px solid rgba(255,255,255,0.25);
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 26px;
    backdrop-filter: blur(8px);
  }

  .lr-brand-text { color: var(--white); }
  .lr-brand-text .university {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    opacity: 0.7;
    display: block;
  }
  .lr-brand-text .product {
    font-family: 'Fraunces', serif;
    font-size: 20px;
    font-weight: 700;
  }

  .lr-hero {
    position: relative;
    z-index: 1;
    color: var(--white);
  }

  .lr-hero h1 {
    font-family: 'Fraunces', serif;
    font-size: 38px;
    font-weight: 900;
    line-height: 1.1;
    margin-bottom: 20px;
  }

  .lr-hero p {
    color: rgba(255,255,255,0.7);
    font-size: 15px;
    line-height: 1.7;
    max-width: 340px;
  }

  /* ─── RIGHT PANEL (Form) ─── */
  .lr-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 40px;
    background: var(--white);
  }

  .lr-right-inner { width: 100%; max-width: 440px; }

  .lr-form-header { margin-bottom: 32px; }

  .lr-form-header h2 {
    font-family: 'Fraunces', serif;
    font-size: 28px;
    font-weight: 900;
    color: var(--gray-900);
    margin-bottom: 8px;
  }

  .lr-form-header p {
    font-size: 14px;
    color: var(--gray-500);
  }

  .field { margin-bottom: 18px; }

  .field-label {
    font-size: 13px;
    font-weight: 600;
    color: var(--gray-700);
    margin-bottom: 7px;
    display: block;
  }

  .field-input-wrap { position: relative; }

  .field-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--gray-400);
  }

  .field-input {
    width: 100%;
    height: 48px;
    padding: 0 14px 0 42px;
    border: 1.5px solid var(--gray-200);
    border-radius: 12px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 14px;
    outline: none;
    transition: all 0.2s ease;
  }

  .field-input:focus {
    border-color: var(--ipb-blue-lite);
    box-shadow: 0 0 0 3px rgba(59,130,246,0.12);
  }

  .field-input.has-error {
    border-color: var(--error);
  }

  .field-error {
    margin-top: 6px;
    font-size: 12px;
    color: var(--error);
  }

  .submit-btn {
    width: 100%;
    height: 50px;
    border: none;
    border-radius: 12px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 15px;
    font-weight: 700;
    color: var(--white);
    cursor: pointer;
    background: linear-gradient(135deg, var(--ipb-blue) 0%, var(--ipb-blue-mid) 60%, var(--ipb-sky) 100%);
    box-shadow: 0 4px 20px rgba(37,99,235,0.3);
    transition: all 0.22s ease;
    margin-top: 12px;
  }

  .submit-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(37,99,235,0.4);
  }

  .submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }

  .lr-footer-note {
    margin-top: 28px;
    font-size: 13px;
    color: var(--gray-500);
    text-align: center;
  }

  .lr-footer-note a {
    color: var(--ipb-blue-mid);
    font-weight: 700;
    text-decoration: none;
  }

  .alert-error {
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: var(--error);
    padding: 12px;
    border-radius: 8px;
    font-size: 13px;
    margin-bottom: 20px;
  }

  @media (max-width: 860px) {
    .lr-left { display: none; }
  }
`;

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    nama: "",
    identifier: "", // Username atau Email
    password: "",
    confirmPassword: "",
    role: "mahasiswa" // Default role
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.nama.trim()) errs.nama = "Nama lengkap wajib diisi";
    if (!formData.identifier.trim()) errs.identifier = "Username / Email wajib diisi";
    if (formData.password.length < 6) errs.password = "Minimal 6 karakter";
    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = "Konfirmasi kata sandi tidak cocok";
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    
    setErrors({});
    setLoading(true);

    try {
      // Mengirim data ke backend melalui AuthContext
      const data = await register(formData); 
      
      // Jika berhasil, data user/token akan dikembalikan dan kita redirect
      if (data) {
        navigate("/dashboard"); 
      }
    } catch (err) {
      // 1. Munculkan pesan error di console agar kita bisa cek di Inspect Element
      console.error("Detail Error Registrasi:", err);
      
      // 2. Ambil pesan error dari backend (asumsi kamu pakai Axios/Fetch standar FastAPI)
      // Kalau backend mengirimkan {"detail": "Email sudah digunakan"}
      const errorMessage = err.response?.data?.detail || err.message || "Registrasi gagal, silakan periksa data kamu.";
      
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <style>{styles}</style>
      <div className="lr-root">
        <div className="lr-left">
          <div className="deco-ring deco-ring-1" />
          <div className="lr-brand">
            <div className="lr-brand-logo">🎓</div>
            <div className="lr-brand-text">
              <span className="university">IPB University</span>
              <span className="product">Help Center</span>
            </div>
          </div>

          <div className="lr-hero">
            <h1>Mulai perjalanan akademikmu dengan mudah.</h1>
            <p>Satu akun untuk mengakses seluruh layanan bantuan dan administrasi kampus secara terpadu.</p>
          </div>
          <div />
        </div>

        <div className="lr-right">
          <div className="lr-right-inner">
            <div className="lr-form-header">
              <h2>Buat Akun</h2>
              <p>Daftarkan diri kamu untuk mulai menggunakan layanan **banto__o**.</p>
            </div>

            {errors.general && <div className="alert-error">⚠️ {errors.general}</div>}

            <form onSubmit={handleSubmit} noValidate>
              <div className="field">
                <label className="field-label">Nama Lengkap</label>
                <div className="field-input-wrap">
                  <span className="field-icon">👤</span>
                  <input type="text" name="nama" className={`field-input ${errors.nama ? "has-error" : ""}`}
                    placeholder="Masukkan nama lengkap kamu" value={formData.nama} onChange={handleChange} />
                </div>
                {errors.nama && <div className="field-error">{errors.nama}</div>}
              </div>

              <div className="field">
                <label className="field-label">IPB Username / E-mail</label>
                <div className="field-input-wrap">
                  <span className="field-icon">✉</span>
                  <input type="text" name="identifier" className={`field-input ${errors.identifier ? "has-error" : ""}`}
                    placeholder="nim atau email@apps.ipb.ac.id" value={formData.identifier} onChange={handleChange} />
                </div>
                {errors.identifier && <div className="field-error">{errors.identifier}</div>}
              </div>

              <div className="field">
                <label className="field-label">Kata Sandi</label>
                <div className="field-input-wrap">
                  <span className="field-icon">🔑</span>
                  <input type="password" name="password" className={`field-input ${errors.password ? "has-error" : ""}`}
                    placeholder="Minimal 6 karakter" value={formData.password} onChange={handleChange} />
                </div>
                {errors.password && <div className="field-error">{errors.password}</div>}
              </div>

              <div className="field">
                <label className="field-label">Konfirmasi Kata Sandi</label>
                <div className="field-input-wrap">
                  <span className="field-icon">🛡️</span>
                  <input type="password" name="confirmPassword" className={`field-input ${errors.confirmPassword ? "has-error" : ""}`}
                    placeholder="Ulangi kata sandi" value={formData.confirmPassword} onChange={handleChange} />
                </div>
                {errors.confirmPassword && <div className="field-error">{errors.confirmPassword}</div>}
              </div>

              <button className="submit-btn" type="submit" disabled={loading}>
                {loading ? "Mendaftarkan..." : "Daftar Akun →"}
              </button>
            </form>

            <div className="lr-footer-note">
              Sudah punya akun? <Link to="/login">Masuk di sini</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}