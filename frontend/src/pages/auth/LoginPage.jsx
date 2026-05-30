import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import AppIcon from "../../components/ui/AppIcon";

const styles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .pg { min-height: 100vh; display: flex; font-family: var(--font-sans); }

  /* ── LEFT ── */
  .pg-left {
    width: 48%;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 44px 52px;
    background: linear-gradient(150deg, var(--color-brand-darkest) 0%, var(--color-brand-dark) 55%, var(--color-brand) 100%);
  }

  /* noise texture */
  .pg-left::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
    pointer-events: none;
  }

  /* decorative circles */
  .deco { position: absolute; border-radius: 50%; pointer-events: none; }
  .deco-c1 { width: 520px; height: 520px; top: -200px; right: -160px; border: 1px solid rgba(255,255,255,0.06); }
  .deco-c2 { width: 300px; height: 300px; bottom: -80px; left: -80px;  border: 1px solid rgba(255,255,255,0.06); }
  .deco-c3 { width: 160px; height: 160px; bottom: 100px; left: 60px;   border: 1px solid rgba(255,255,255,0.09); }
  .deco-blob {
    width: 380px; height: 380px;
    background: radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%);
    bottom: -80px; right: -80px;
  }

  .brand {
    display: flex; align-items: center; gap: 14px;
    position: relative; z-index: 1;
    animation: fadeDown 0.5s ease both;
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
  .brand-text .prod {
    font-size: 18px; font-weight: 700; letter-spacing: -0.3px;
  }

  .hero { position: relative; z-index: 1; animation: fadeUp 0.6s 0.08s ease both; }
  .hero-pill {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.18);
    border-radius: 100px; padding: 5px 14px;
    font-size: 11.5px; font-weight: 500;
    color: rgba(255,255,255,0.8); margin-bottom: 22px;
  }
  .hero h1 {
    font-size: clamp(30px, 3.2vw, 44px);
    font-weight: 800; color: var(--white);
    line-height: 1.12; letter-spacing: -1.2px;
    margin-bottom: 18px;
  }
  .hero h1 em { font-style: italic; font-weight: 300; opacity: 0.7; }
  .hero p {
    color: rgba(255,255,255,0.55);
    font-size: 14px; line-height: 1.75; max-width: 320px;
    margin-bottom: 38px;
  }

  .stats { display: flex; gap: 28px; }
  .stat { animation: fadeUp 0.5s ease both; }
  .stat:nth-child(1) { animation-delay: 0.28s; }
  .stat:nth-child(2) { animation-delay: 0.36s; }
  .stat:nth-child(3) { animation-delay: 0.44s; }
  .stat-num {
    font-size: 26px; font-weight: 800; color: var(--white);
    letter-spacing: -1px; line-height: 1; margin-bottom: 3px;
  }
  .stat-lbl {
    font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.45);
    text-transform: uppercase; letter-spacing: 1px;
  }

  /* ── RIGHT ── */
  .pg-right {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 48px 40px; background: var(--white);
    animation: fadeIn 0.4s ease both;
  }
  .form-box { width: 100%; max-width: 388px; }

  .form-head { margin-bottom: 28px; }
  .form-head h2 {
    font-size: 26px; font-weight: 800;
    color: var(--gray-900); letter-spacing: -0.6px;
    margin-bottom: 5px;
  }
  .form-head p { font-size: 13.5px; color: var(--gray-500); line-height: 1.55; }

  /* role tabs */
  .role-tabs {
    display: flex; background: var(--gray-100);
    border: 1.5px solid var(--gray-200);
    border-radius: 12px; padding: 4px;
    margin-bottom: 24px; gap: 4px;
  }
  .role-tab {
    flex: 1; padding: 9px 10px;
    border: none; border-radius: 9px;
    background: transparent;
    font-family: var(--font); font-size: 13px; font-weight: 600;
    color: var(--gray-500); cursor: pointer;
    transition: all 0.18s ease;
    display: flex; align-items: center; justify-content: center; gap: 6px;
  }
  .role-tab.on {
    background: var(--color-white); color: var(--color-brand);
    box-shadow: 0 1px 6px rgba(0,0,0,0.07), 0 0 0 1px rgba(37,99,235,0.15);
  }

  /* fields */
  .field { margin-bottom: 15px; }
  .field-lbl {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 6px;
  }
  .field-lbl span { font-size: 12.5px; font-weight: 600; color: var(--gray-600); }
  .forgot {
    background: none; border: none; cursor: pointer;
    font-family: var(--font); font-size: 12px; font-weight: 600;
    color: var(--blue-600); padding: 0;
    transition: color 0.15s;
  }
  .forgot:hover { color: var(--blue-400); }

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

  /* submit */
  .btn-submit {
    width: 100%; height: 48px; margin-top: 6px;
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
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(to right, transparent, rgba(255,255,255,0.09), transparent);
    transform: translateX(-100%);
    transition: transform 0.5s ease;
  }
  .btn-submit:hover:not(:disabled)::after { transform: translateX(100%); }
  .btn-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(37,99,235,0.38);
  }
  .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

  .spin {
    width: 15px; height: 15px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: white; border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  .divider {
    display: flex; align-items: center; gap: 10px;
    margin: 20px 0 16px; font-size: 11.5px; color: var(--gray-400);
  }
  .divider::before, .divider::after {
    content: ''; flex: 1; height: 1px; background: var(--gray-200);
  }

  .footer-note {
    margin-top: 24px; font-size: 12.5px;
    color: var(--gray-500); text-align: center; line-height: 1.9;
  }
  .footer-note a {
    color: var(--blue-600); font-weight: 700; text-decoration: none;
  }
  .footer-note a:hover { text-decoration: underline; }

  @keyframes fadeDown {
    from { opacity: 0; transform: translateY(-14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes spin   { to { transform: rotate(360deg); } }

  @media (max-width: 820px) {
    .pg-left { display: none; }
    .pg-right { padding: 32px 20px; }
  }
`;

export default function LoginPage() {
  const navigate   = useNavigate();
  const { login }  = useAuth();

  const [role,       setRole]       = useState("mahasiswa");
  const [email,      setEmail]      = useState("");
  const [password,   setPassword]   = useState("");
  const [showPass,   setShowPass]   = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [errors,     setErrors]     = useState({});

  const validate = () => {
    const e = {};
    if (!email.trim())    e.email    = "E-mail wajib diisi";
    if (!password)        e.password = "Kata sandi wajib diisi";
    else if (password.length < 6) e.password = "Minimal 6 karakter";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev?.preventDefault?.();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    try {
      const data = await login(email, password);
      if (data.role === "mahasiswa") navigate("/dashboard");
      else if (data.role === "staf") navigate("/staff/dashboard");
      else navigate("/login");
    } catch (err) {
      setErrors({ email: err?.detail || "Login gagal, periksa kembali data kamu" });
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
          <div className="deco deco-c3" />
          <div className="deco deco-blob" />

          <div className="brand">
            <div className="brand-icon">
              <AppIcon name="GraduationCap" size={22} color="white" />
            </div>
            <div className="brand-text">
              <span className="univ">IPB University</span>
              <span className="prod">Help Center</span>
            </div>
          </div>

          <div className="hero">
            <div className="hero-pill">⊙ Layanan Akademik Terpadu</div>
            <h1>Satu tempat<br />untuk semua<br /><em>bantuan</em> akademik.</h1>
            <p>Ajukan tiket, pantau status, dan dapatkan respons cepat dari tim administrasi IPB - kapan saja, di mana saja.</p>
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div className="pg-right">
          <div className="form-box">
            <div className="form-head">
              <h2>Masuk ke akun IPB</h2>
              <p>Gunakan e-mail IPB kamu untuk melanjutkan.</p>
            </div>

            {/* Role selector — hanya UI, role asli dari backend */}
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

            <div className="login-fields">
              {/* E-mail */}
              <div className="field">
                <div className="field-lbl"><span>E-mail</span></div>
                <div className="input-wrap">
                  <span className="input-icon"><AppIcon name="Mail" variant="sm" /></span>
                  <input
                    type="email"
                    className={`fi ${errors.email ? "err" : ""}`}
                    placeholder={role === "mahasiswa" ? "username@apps.ipb.ac.id" : "username@ipb.ac.id"}
                    value={email}
                    onChange={e => { setEmail(e.target.value); setErrors(p => ({...p, email: ""})); }}
                    autoComplete="email"
                  />
                </div>
                {errors.email && <div className="ferr"><AppIcon name="AlertCircle" variant="xs" /> {errors.email}</div>}
              </div>

              {/* Kata Sandi */}
              <div className="field">
                <div className="field-lbl">
                  <span>Kata Sandi</span>
                  <button type="button" className="forgot">Lupa kata sandi?</button>
                </div>
                <div className="input-wrap">
                  <span className="input-icon"><AppIcon name="Lock" variant="sm" /></span>
                  <input
                    type={showPass ? "text" : "password"}
                    className={`fi ${errors.password ? "err" : ""}`}
                    placeholder="Masukkan kata sandi"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setErrors(p => ({...p, password: ""})); }}
                    autoComplete="current-password"
                    style={{ paddingRight: 42 }}
                  />
                  <button type="button" className="eye" onClick={() => setShowPass(!showPass)}>
                    {showPass ? <AppIcon name="EyeOff" variant="sm" /> : <AppIcon name="Eye" variant="sm" />}
                  </button>
                </div>
                {errors.password && <div className="ferr"><AppIcon name="AlertCircle" variant="xs" /> {errors.password}</div>}
              </div>

              <button className="btn-submit" type="button" disabled={loading} onClick={handleSubmit}>
                {loading ? <><div className="spin" /> Memverifikasi...</> : "Masuk →"}
              </button>
            </div>

            <div className="divider">atau</div>

            <div className="footer-note">
              Belum punya akun? <Link to="/register">Buat akun baru</Link><br />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}