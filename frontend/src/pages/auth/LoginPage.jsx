import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

// Add to your index.html <head>:
// <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=Fraunces:opsz,wght@9..144,700;9..144,900&display=swap" rel="stylesheet">

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
    --gray-50:        #f0f4f8;
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

  /* ─── LEFT PANEL ─── */
  .lr-left {
    width: 52%;
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

  /* sky accent blob */
  .lr-left::after {
    content: '';
    position: absolute;
    width: 400px; height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(14,165,233,0.2), transparent 70%);
    bottom: -100px; right: -100px;
    pointer-events: none;
  }

  .deco-ring {
    position: absolute;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.07);
    pointer-events: none;
  }
  .deco-ring-1 { width: 560px; height: 560px; top: -180px; right: -180px; }
  .deco-ring-2 { width: 340px; height: 340px; bottom: -100px; left: -100px; }
  .deco-ring-3 { width: 200px; height: 200px; bottom: 80px; left: 40px; }
  .deco-ring-4 { width: 120px; height: 120px; top: 30%; right: 60px; border-color: rgba(255,255,255,0.12); }

  .deco-dot {
    position: absolute;
    border-radius: 50%;
    background: rgba(255,255,255,0.12);
    pointer-events: none;
  }
  .deco-dot-1 { width: 10px; height: 10px; top: 22%; right: 18%; }
  .deco-dot-2 { width: 6px;  height: 6px;  top: 55%; right: 30%; background: rgba(255,255,255,0.2); }
  .deco-dot-3 { width: 14px; height: 14px; bottom: 28%; left: 42%; }

  .lr-brand {
    display: flex;
    align-items: center;
    gap: 14px;
    position: relative;
    z-index: 1;
    animation: fadeSlideDown 0.6s ease both;
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
    margin-bottom: 2px;
  }
  .lr-brand-text .product {
    font-family: 'Fraunces', serif;
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.3px;
    line-height: 1;
  }

  .lr-hero {
    position: relative;
    z-index: 1;
    animation: fadeSlideUp 0.7s 0.1s ease both;
  }

  .lr-hero-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 100px;
    padding: 5px 14px;
    font-size: 12px;
    font-weight: 600;
    color: rgba(255,255,255,0.85);
    letter-spacing: 0.3px;
    margin-bottom: 24px;
  }

  .lr-hero h1 {
    font-family: 'Fraunces', serif;
    font-size: clamp(32px, 3.5vw, 48px);
    font-weight: 900;
    color: var(--white);
    line-height: 1.1;
    letter-spacing: -1px;
    margin-bottom: 20px;
  }

  .lr-hero h1 em {
    font-style: italic;
    color: rgba(255,255,255,0.65);
  }

  .lr-hero p {
    color: rgba(255,255,255,0.6);
    font-size: 15px;
    line-height: 1.7;
    max-width: 340px;
    margin-bottom: 40px;
  }

  .lr-stats { display: flex; gap: 32px; }

  .lr-stat { animation: fadeSlideUp 0.6s ease both; }
  .lr-stat:nth-child(1) { animation-delay: 0.35s; }
  .lr-stat:nth-child(2) { animation-delay: 0.45s; }
  .lr-stat:nth-child(3) { animation-delay: 0.55s; }

  .lr-stat-num {
    font-family: 'Fraunces', serif;
    font-size: 28px;
    font-weight: 900;
    color: var(--white);
    letter-spacing: -1px;
    line-height: 1;
    margin-bottom: 4px;
  }

  .lr-stat-label {
    font-size: 11px;
    font-weight: 600;
    color: rgba(255,255,255,0.5);
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }

  /* ─── RIGHT PANEL ─── */
  .lr-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 40px;
    position: relative;
    background: var(--white);
    animation: fadeIn 0.5s ease both;
  }

  .lr-right-inner { width: 100%; max-width: 400px; }

  .lr-form-header { margin-bottom: 32px; }

  .lr-form-header h2 {
    font-family: 'Fraunces', serif;
    font-size: 28px;
    font-weight: 900;
    color: var(--gray-900);
    letter-spacing: -0.8px;
    margin-bottom: 6px;
  }

  .lr-form-header p {
    font-size: 14px;
    color: var(--gray-500);
    line-height: 1.6;
  }

  /* Role selector */
  .role-selector {
    display: flex;
    background: var(--gray-50);
    border: 1.5px solid var(--gray-200);
    border-radius: 14px;
    padding: 5px;
    margin-bottom: 28px;
    gap: 4px;
  }

  .role-btn {
    flex: 1;
    padding: 10px 12px;
    border: none;
    border-radius: 10px;
    background: transparent;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: var(--gray-500);
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  .role-btn.active {
    background: var(--white);
    color: var(--ipb-blue-mid);
    box-shadow: 0 1px 8px rgba(0,0,0,0.08), 0 0 0 1px rgba(37,99,235,0.2);
  }

  /* Fields */
  .field { margin-bottom: 18px; }

  .field-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 7px;
  }

  .field-label span {
    font-size: 13px;
    font-weight: 600;
    color: var(--gray-700);
  }

  .field-input-wrap { position: relative; }

  .field-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--gray-400);
    font-size: 15px;
    pointer-events: none;
    line-height: 1;
  }

  .field-input {
    width: 100%;
    height: 48px;
    padding: 0 14px 0 42px;
    border: 1.5px solid var(--gray-200);
    border-radius: 12px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 14px;
    color: var(--gray-900);
    background: var(--white);
    outline: none;
    transition: all 0.2s ease;
  }

  .field-input::placeholder { color: var(--gray-400); }

  .field-input:focus {
    border-color: var(--ipb-blue-lite);
    box-shadow: 0 0 0 3px rgba(59,130,246,0.12);
  }

  .field-input.has-error {
    border-color: var(--error);
    box-shadow: 0 0 0 3px rgba(220,38,38,0.08);
  }

  .toggle-pass {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: var(--gray-400);
    font-size: 15px;
    padding: 0;
    line-height: 1;
    transition: color 0.15s;
  }
  .toggle-pass:hover { color: var(--gray-700); }

  .field-error {
    margin-top: 6px;
    font-size: 12px;
    color: var(--error);
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .forgot-btn {
    background: none;
    border: none;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: var(--ipb-blue-mid);
    cursor: pointer;
    padding: 0;
    transition: color 0.15s;
  }
  .forgot-btn:hover { color: var(--ipb-blue-lite); }

  /* Submit */
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
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 8px;
    position: relative;
    overflow: hidden;
  }

  .submit-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent);
    transform: translateX(-100%);
    transition: transform 0.5s ease;
  }

  .submit-btn:hover:not(:disabled)::before { transform: translateX(100%); }
  .submit-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(37,99,235,0.4);
  }
  .submit-btn:active:not(:disabled) { transform: translateY(0); }
  .submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }

  .spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.65s linear infinite;
  }

  .or-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 22px 0 18px;
    font-size: 12px;
    color: var(--gray-400);
    font-weight: 500;
  }
  .or-divider::before, .or-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--gray-200);
  }

  .sso-btn {
    width: 100%;
    height: 46px;
    border: 1.5px solid var(--gray-200);
    border-radius: 12px;
    background: var(--white);
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--gray-700);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: all 0.2s ease;
  }
  .sso-btn:hover {
    border-color: var(--ipb-blue-mid);
    color: var(--ipb-blue-mid);
    background: rgba(37,99,235,0.03);
  }

  .sso-logo {
    width: 22px; height: 22px;
    background: linear-gradient(135deg, var(--ipb-blue), var(--ipb-sky));
    border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    font-size: 10px;
    color: white;
    font-weight: 800;
    letter-spacing: -0.5px;
  }

  .lr-footer-note {
    margin-top: 28px;
    font-size: 12px;
    color: var(--gray-400);
    text-align: center;
    line-height: 1.8;
  }

  .lr-footer-note a {
    color: var(--ipb-blue-mid);
    font-weight: 600;
    text-decoration: none;
  }
  .lr-footer-note a:hover { text-decoration: underline; }

  .lr-top-actions {
    position: absolute;
    top: 28px;
    right: 32px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .top-action-btn {
    background: var(--gray-50);
    border: 1.5px solid var(--gray-200);
    border-radius: 8px;
    padding: 6px 13px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: var(--gray-500);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
    transition: all 0.15s;
  }
  .top-action-btn:hover { border-color: var(--gray-400); color: var(--gray-700); }

  @keyframes fadeSlideDown {
    from { opacity: 0; transform: translateY(-16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  @media (max-width: 860px) {
    .lr-left { display: none; }
    .lr-right { padding: 32px 24px; }
  }
`;

export default function LoginPage() {
  const [role, setRole] = useState("mahasiswa");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!identifier.trim()) errs.identifier = "Username / Email wajib diisi";
    if (!password) errs.password = "Kata sandi wajib diisi";
    else if (password.length < 6) errs.password = "Minimal 6 karakter";
    return errs;
  };

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      // Call backend API: POST /api/v1/auth/login
      // Backend returns: { access_token, token_type }
      // AuthContext handles token storage & redirect setup
      const data = await login(identifier, password, role);

      if (data.access_token) {
        if (role === "mahasiswa") {
          navigate("/dashboard");
        } else {
          navigate("/staff/dashboard");
        }
      }
    } catch (error) {
      setErrors({
        identifier: error?.detail || "Login gagal, periksa kembali data kamu"
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <style>{styles}</style>
      <div className="lr-root">
        <div className="lr-left">
          <div className="deco-ring deco-ring-1" /><div className="deco-ring deco-ring-2" />
          <div className="deco-ring deco-ring-3" /><div className="deco-ring deco-ring-4" />
          <div className="deco-dot deco-dot-1" /><div className="deco-dot deco-dot-2" /><div className="deco-dot deco-dot-3" />

          <div className="lr-brand">
            <div className="lr-brand-logo">🎓</div>
            <div className="lr-brand-text">
              <span className="university">IPB University</span>
              <span className="product">Help Center</span>
            </div>
          </div>

          <div className="lr-hero">
            <div className="lr-hero-tag">✦ Layanan Akademik Terpadu</div>
            <h1>Satu tempat<br />untuk semua<br /><em>bantuan</em> akademik.</h1>
            <p>Ajukan tiket, pantau status, dan dapatkan respons cepat dari tim administrasi IPB — kapan saja, di mana saja.</p>
            <div className="lr-stats">
              <div className="lr-stat"><div className="lr-stat-num">98%</div><div className="lr-stat-label">Resolved</div></div>
              <div className="lr-stat"><div className="lr-stat-num">&lt;24j</div><div className="lr-stat-label">Respons</div></div>
              <div className="lr-stat"><div className="lr-stat-num">12+</div><div className="lr-stat-label">Layanan</div></div>
            </div>
          </div>
        </div>

        <div className="lr-right">
          <div className="lr-top-actions">
            <button className="top-action-btn" type="button">🇮🇩 ID</button>
            <button className="top-action-btn" type="button">👤 Pengguna Tamu</button>
          </div>

          <div className="lr-right-inner">
            <div className="lr-form-header">
              <h2>Masuk ke akun IPB</h2>
              <p>Gunakan username atau e-mail IPB kamu untuk melanjutkan.</p>
            </div>

            <div className="role-selector">
              <button type="button" className={`role-btn ${role === "mahasiswa" ? "active" : ""}`} onClick={() => setRole("mahasiswa")}>🎓 Mahasiswa</button>
              <button type="button" className={`role-btn ${role === "staff" ? "active" : ""}`} onClick={() => setRole("staff")}>🏛️ Staff Admin</button>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="field">
                <div className="field-label"><span>IPB Username / E-mail</span></div>
                <div className="field-input-wrap">
                  <span className="field-icon">✉</span>
                  <input type="text" className={`field-input ${errors.identifier ? "has-error" : ""}`}
                    placeholder={role === "mahasiswa" ? "nim atau email@apps.ipb.ac.id" : "username atau email@ipb.ac.id"}
                    value={identifier} onChange={(e) => { setIdentifier(e.target.value); setErrors(p => ({...p, identifier: ""})); }} autoComplete="username" />
                </div>
                {errors.identifier && <div className="field-error">⚠ {errors.identifier}</div>}
              </div>

              <div className="field">
                <div className="field-label">
                  <span>Kata Sandi</span>
                  <button type="button" className="forgot-btn">Lupa kata sandi?</button>
                </div>
                <div className="field-input-wrap">
                  <span className="field-icon">🔑</span>
                  <input type={showPass ? "text" : "password"} className={`field-input ${errors.password ? "has-error" : ""}`}
                    placeholder="Masukkan kata sandi" value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrors(p => ({...p, password: ""})); }}
                    autoComplete="current-password" style={{ paddingRight: "44px" }} />
                  <button type="button" className="toggle-pass" onClick={() => setShowPass(!showPass)}>{showPass ? "🙈" : "👁️"}</button>
                </div>
                {errors.password && <div className="field-error">⚠ {errors.password}</div>}
              </div>

              <button className="submit-btn" type="submit" disabled={loading}>
                {loading ? <><div className="spinner" /> Memverifikasi...</> : <>Masuk →</>}
              </button>
            </form>

            <div className="or-divider">atau lanjutkan dengan</div>
            <button className="sso-btn" type="button">
              <div className="sso-logo">IP</div>
              Masuk dengan SSO IPB University
            </button>

            <div className="lr-footer-note">
              Belum punya akun? <a href="/register">Buat akun baru</a><br />
              Butuh bantuan? <a href="#">Hubungi administrator</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}