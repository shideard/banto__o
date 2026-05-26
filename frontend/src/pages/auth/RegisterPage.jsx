// frontend/src/pages/auth/RegisterPage.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import AppIcon from "../../components/ui/AppIcon";

const styles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .pg { min-height: 100vh; display: flex; font-family: var(--font-sans); }

  .pg-left {
    width: 48%;
    position: relative; overflow: hidden;
    display: flex; flex-direction: column;
    justify-content: space-between;
    padding: 44px 52px;
    background: linear-gradient(150deg, var(--color-brand-darkest) 0%, var(--color-brand-dark) 55%, var(--color-brand) 100%);
  }
  .pg-left::before {
    content: '';
    position: absolute; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
    pointer-events: none;
  }

  .deco { position: absolute; border-radius: 50%; pointer-events: none; }
  .deco-c1 { width: 500px; height: 500px; top: -180px; right: -140px; border: 1px solid rgba(255,255,255,0.06); }
  .deco-c2 { width: 280px; height: 280px; bottom: -60px; left: -60px;  border: 1px solid rgba(255,255,255,0.06); }
  .deco-blob {
    width: 360px; height: 360px;
    background: radial-gradient(circle, rgba(59,130,246,0.16) 0%, transparent 70%);
    bottom: -60px; right: -60px;
  }

  .brand {
    display: flex; align-items: center; gap: 14px;
    position: relative; z-index: 1;
  }
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

  .hero { position: relative; z-index: 1; }
  .hero-pill {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.18);
    border-radius: 100px; padding: 5px 14px;
    font-size: 11.5px; font-weight: 500;
    color: rgba(255,255,255,0.8); margin-bottom: 20px;
  }
  .hero h1 {
    font-size: clamp(26px, 2.8vw, 38px); font-weight: 800;
    color: var(--white); line-height: 1.15;
    letter-spacing: -1px; margin-bottom: 16px;
  }
  .hero p {
    color: rgba(255,255,255,0.55);
    font-size: 13.5px; line-height: 1.75; max-width: 300px;
  }

  .pg-right {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 44px 40px; background: var(--white);
    overflow-y: auto;
  }
  .form-box { width: 100%; max-width: 400px; }

  .form-head { margin-bottom: 24px; }
  .form-head h2 {
    font-size: 24px; font-weight: 800;
    color: var(--gray-900); letter-spacing: -0.5px;
    margin-bottom: 5px;
  }
  .form-head p { font-size: 13px; color: var(--gray-500); line-height: 1.55; }

  .role-tabs {
    display: flex; background: var(--gray-100);
    border: 1.5px solid var(--gray-200);
    border-radius: 12px; padding: 4px;
    margin-bottom: 20px; gap: 4px;
  }
  .role-tab {
    flex: 1; padding: 9px 10px; border: none; border-radius: 9px;
    background: transparent;
    font-family: var(--font); font-size: 13px; font-weight: 600;
    color: var(--gray-500); cursor: pointer;
    transition: all 0.18s ease;
    display: flex; align-items: center; justify-content: center; gap: 6px;
  }
  .role-tab.on {
    background: var(--white); color: var(--blue-600);
    box-shadow: 0 1px 6px rgba(0,0,0,0.07), 0 0 0 1px rgba(37,99,235,0.15);
  }

  .field { margin-bottom: 14px; }
  .field-lbl { font-size: 12.5px; font-weight: 600; color: var(--gray-600); margin-bottom: 6px; display: block; }

  .input-wrap { position: relative; }
  .input-icon {
    position: absolute; left: 13px; top: 50%;
    transform: translateY(-50%);
    color: var(--gray-400); font-size: 15px; pointer-events: none;
    display: flex; align-items: center; justify-content: center;
  }
  .fi {
    width: 100%; height: 46px;
    padding: 0 13px 0 40px;
    border: 1.5px solid var(--gray-200); border-radius: 10px;
    font-family: var(--font); font-size: 13.5px; color: var(--gray-900);
    background: var(--white); outline: none;
    transition: all 0.18s ease;
  }
  .fi::placeholder { color: var(--gray-400); }
  .fi:focus { border-color: var(--blue-400); box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
  .fi.err { border-color: var(--error); box-shadow: 0 0 0 3px rgba(220,38,38,0.07); }
  .eye {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    color: var(--gray-400); font-size: 15px; padding: 0;
    transition: color 0.15s;
  }
  .eye:hover { color: var(--gray-600); }
  .ferr { margin-top: 4px; font-size: 11.5px; color: var(--error); }

  .alert-err {
    background: #fef2f2; border: 1px solid #fecaca;
    color: var(--error); padding: 11px 14px;
    border-radius: 9px; font-size: 13px; margin-bottom: 16px;
  }

  .btn-submit {
    width: 100%; height: 48px; margin-top: 8px;
    border: none; border-radius: 10px;
    font-family: var(--font); font-size: 14px; font-weight: 700;
    color: var(--white); cursor: pointer;
    background: linear-gradient(130deg, var(--color-brand-dark) 0%, var(--color-brand) 60%, #0ea5e9 100%);
    box-shadow: 0 4px 18px rgba(37,99,235,0.28);
    transition: all 0.2s ease;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    position: relative; overflow: hidden;
  }
  .btn-submit::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(to right, transparent, rgba(255,255,255,0.09), transparent);
    transform: translateX(-100%); transition: transform 0.5s ease;
  }
  .btn-submit:hover:not(:disabled)::after { transform: translateX(100%); }
  .btn-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(37,99,235,0.38);
  }
  .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

  .divider {
    display: flex; align-items: center; gap: 10px;
    margin: 18px 0 14px; font-size: 11.5px; color: var(--gray-400);
  }
  .divider::before, .divider::after {
    content: ''; flex: 1; height: 1px; background: var(--gray-200);
  }

  .footer-note {
    font-size: 13px; color: var(--gray-500);
    text-align: center; line-height: 1.9;
  }
  .footer-note a {
    color: var(--blue-600); font-weight: 700; text-decoration: none;
    display: block; margin-top: 2px; font-size: 14px;
  }
  .footer-note a:hover { text-decoration: underline; }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  @media (max-width: 820px) {
    .pg-left { display: none; }
    .pg-right { padding: 32px 20px; }
  }
`;

export default function RegisterPage() {
  const navigate     = useNavigate();
  const { register } = useAuth();

  const [role,     setRole]     = useState("mahasiswa");
  const [nama,     setNama]     = useState("");
  const [email,    setEmail]    = useState("");
  const [nim,      setNim]      = useState("");
  const [telepon,  setTelepon]  = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [errors,   setErrors]   = useState({});

  const validate = () => {
    const e = {};
    if (!nama.trim())     e.nama     = "Nama lengkap wajib diisi";
    if (!email.trim())    e.email    = "E-mail wajib diisi";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
                          e.email    = "Format e-mail tidak valid";
    if (role === "mahasiswa") {
      if (!nim.trim())    e.nim      = "NIM wajib diisi";
    }
    if (!telepon.trim())  e.telepon  = "Nomor telepon wajib diisi";
    else if (!/^(\+62|08)\d{8,12}$/.test(telepon.replace(/\s/g, "")))
                          e.telepon  = "Format tidak valid (08xx atau +62)";
    if (!password)        e.password = "Kata sandi wajib diisi";
    else if (password.length < 6) e.password = "Minimal 6 karakter";
    return e;
  };

  const clearErr = k => setErrors(p => ({ ...p, [k]: "" }));

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    try {
      await register({ nama, email, password, role, nim: role === "mahasiswa" ? nim : undefined });
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
      <style>{styles}</style>
      <div className="pg">

        {/* ── LEFT ── */}
        <div className="pg-left">
          <div className="deco deco-c1" />
          <div className="deco deco-c2" />
          <div className="deco deco-blob" />

          <div className="brand">
            <div className="brand-icon">🎓</div>
            <div className="brand-text">
              <span className="univ">IPB University</span>
              <span className="prod">Help Center</span>
            </div>
          </div>

          <div className="hero">
            <div className="hero-pill">⊙ Layanan Akademik Terpadu</div>
            <h1>Satu tempat untuk semua bantuan akademik.</h1>
            <p>Ajukan tiket, pantau status, dan dapatkan respons cepat dari tim administrasi IPB — kapan saja, di mana saja.</p>
          </div>

          <div />
        </div>

        {/* ── RIGHT ── */}
        <div className="pg-right">
          <div className="form-box">
            <div className="form-head">
              <h2>Buat Akun Baru</h2>
              <p>Daftarkan diri Anda untuk mengakses layanan bantuan IPB.</p>
            </div>

            <div className="role-tabs">
              <button type="button"
                className={`role-tab ${role === "mahasiswa" ? "on" : ""}`}
                onClick={() => setRole("mahasiswa")}>
                <AppIcon name="GraduationCap" variant="sm" /> Mahasiswa
              </button>
              <button type="button"
                className={`role-tab ${role === "staf" ? "on" : ""}`}
                onClick={() => setRole("staf")}>
                <AppIcon name="Building2" variant="sm" /> Staf Admin
              </button>
            </div>

            {errors.general && <div className="alert-err"><AppIcon name="AlertCircle" variant="sm" /> {errors.general}</div>}

            <form onSubmit={handleSubmit} noValidate>

              {/* Nama Lengkap */}
              <div className="field">
                <label className="field-lbl">Nama Lengkap</label>
                <div className="input-wrap">
                  <span className="input-icon"><AppIcon name="User" variant="sm" /></span>
                  <input type="text" className={`fi ${errors.nama ? "err" : ""}`}
                    placeholder="Masukkan nama lengkap"
                    value={nama}
                    onChange={e => { setNama(e.target.value); clearErr("nama"); }} />
                </div>
                {errors.nama && <div className="ferr">{errors.nama}</div>}
              </div>

              {/* Email */}
              <div className="field">
                <label className="field-lbl">Email IPB</label>
                <div className="input-wrap">
                  <span className="input-icon"><AppIcon name="Mail" variant="sm" /></span>
                  <input type="email" className={`fi ${errors.email ? "err" : ""}`}
                    placeholder={role === "mahasiswa" ? "username@apps.ipb.ac.id" : "username@ipb.ac.id"}
                    value={email}
                    onChange={e => { setEmail(e.target.value); clearErr("email"); }} />
                </div>
                {errors.email && <div className="ferr">{errors.email}</div>}
              </div>

              {/* NIM — hanya muncul jika role mahasiswa */}
              {role === "mahasiswa" && (
                <div className="field">
                  <label className="field-lbl">NIM</label>
                  <div className="input-wrap">
                    <span className="input-icon"><AppIcon name="Hash" variant="sm" /></span>
                    <input type="text" className={`fi ${errors.nim ? "err" : ""}`}
                      placeholder="Contoh: G6401231001"
                      value={nim}
                      onChange={e => { setNim(e.target.value); clearErr("nim"); }} />
                  </div>
                  {errors.nim && <div className="ferr">{errors.nim}</div>}
                </div>
              )}

              {/* Nomor Telepon */}
              <div className="field">
                <label className="field-lbl">Nomor Telepon</label>
                <div className="input-wrap">
                  <span className="input-icon"><AppIcon name="Phone" variant="sm" /></span>
                  <input type="tel" className={`fi ${errors.telepon ? "err" : ""}`}
                    placeholder="08xxxxxxxxxx"
                    value={telepon}
                    onChange={e => { setTelepon(e.target.value); clearErr("telepon"); }} />
                </div>
                {errors.telepon && <div className="ferr">{errors.telepon}</div>}
              </div>

              {/* Kata Sandi */}
              <div className="field">
                <label className="field-lbl">Kata Sandi</label>
                <div className="input-wrap">
                  <span className="input-icon"><AppIcon name="Lock" variant="sm" /></span>
                  <input
                    type={showPass ? "text" : "password"}
                    className={`fi ${errors.password ? "err" : ""}`}
                    placeholder="Buat kata sandi"
                    value={password}
                    onChange={e => { setPassword(e.target.value); clearErr("password"); }}
                    style={{ paddingRight: 42 }}
                  />
                  <button type="button" className="eye" onClick={() => setShowPass(!showPass)}>
                    {showPass ? <AppIcon name="EyeOff" variant="sm" /> : <AppIcon name="Eye" variant="sm" />}
                  </button>
                </div>
                {errors.password && <div className="ferr">{errors.password}</div>}
              </div>

              <button className="btn-submit" type="submit" disabled={loading}>
                {loading ? "Mendaftarkan..." : "Daftar Sekarang →"}
              </button>
            </form>

            <div className="divider">Sudah punya akun?</div>
            <div className="footer-note">
              <Link to="/login">Masuk di sini</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}