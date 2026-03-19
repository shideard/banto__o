import { useState } from "react";

const styles = `
  :root {
    --ipb-blue-dark:  #0a1f5c;
    --ipb-blue:       #1a4fad;
    --ipb-blue-mid:   #2563eb;
    --ipb-blue-lite:  #3b82f6;
    --ipb-sky:        #0ea5e9;
    --white:          #ffffff;
    --gray-50:        #f8fafc;
    --gray-100:       #f1f5f9;
    --gray-200:       #e2e8f0;
    --gray-400:       #94a3b8;
    --gray-500:       #64748b;
    --gray-700:       #334155;
    --gray-900:       #0f172a;
  }

  .pub-nav { position: sticky; top: 0; z-index: 100; width: 100%; font-family: 'Plus Jakarta Sans', sans-serif; }

  /* Top bar */
  .pub-nav-topbar {
    background: linear-gradient(90deg, #0a1f5c, #1a4fad, #0ea5e9);
    padding: 6px 0;
  }

  .pub-nav-topbar-inner {
    max-width: 1200px; margin: 0 auto; padding: 0 28px;
    display: flex; align-items: center; justify-content: space-between;
  }

  .pub-nav-topbar-left {
    font-size: 11.5px; color: rgba(255,255,255,0.7);
    display: flex; align-items: center; gap: 6px;
  }

  .pub-nav-topbar-right { display: flex; align-items: center; gap: 16px; }

  .topbar-link {
    font-size: 11.5px; color: rgba(255,255,255,0.75); text-decoration: none;
    font-weight: 500; transition: color 0.15s; cursor: pointer;
    background: none; border: none; font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .topbar-link:hover { color: #fff; }

  .topbar-divider { width: 1px; height: 12px; background: rgba(255,255,255,0.2); }

  /* Lang switcher */
  .lang-switcher {
    display: flex; align-items: center; gap: 4px;
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.18);
    border-radius: 6px; padding: 3px 8px;
    cursor: pointer; position: relative;
    transition: background 0.15s;
  }
  .lang-switcher:hover { background: rgba(255,255,255,0.18); }

  .lang-flag { font-size: 13px; }
  .lang-label { font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.9); }
  .lang-chevron { font-size: 9px; color: rgba(255,255,255,0.6); margin-left: 2px; }

  .lang-dropdown {
    position: absolute; top: calc(100% + 8px); right: 0;
    background: white; border: 1.5px solid var(--gray-200);
    border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,0.1);
    overflow: hidden; min-width: 130px;
    animation: dropIn 0.18s ease both;
  }

  .lang-option {
    display: flex; align-items: center; gap: 8px;
    padding: 9px 14px; font-size: 13px; font-weight: 600;
    color: var(--gray-700); cursor: pointer; transition: background 0.15s;
    border: none; background: none; width: 100%;
    font-family: 'Plus Jakarta Sans', sans-serif; text-align: left;
  }
  .lang-option:hover { background: var(--gray-50); }
  .lang-option.active { color: var(--ipb-blue-mid); background: rgba(37,99,235,0.05); }

  /* Main bar */
  .pub-nav-main {
    background: var(--white);
    border-bottom: 1.5px solid var(--gray-200);
    box-shadow: 0 1px 12px rgba(0,0,0,0.05);
  }

  .pub-nav-main-inner {
    max-width: 1200px; margin: 0 auto; padding: 0 28px;
    height: 68px; display: flex; align-items: center; justify-content: space-between; gap: 24px;
  }

  /* Brand */
  .pub-nav-brand { display: flex; align-items: center; gap: 12px; text-decoration: none; flex-shrink: 0; }

  .pub-nav-brand-logo {
    width: 42px; height: 42px;
    background: linear-gradient(135deg, var(--ipb-blue), var(--ipb-sky));
    border-radius: 11px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
    box-shadow: 0 2px 10px rgba(37,99,235,0.25);
    flex-shrink: 0;
  }

  .pub-nav-brand-text .brand-uni {
    font-size: 10px; font-weight: 700; letter-spacing: 1.5px;
    text-transform: uppercase; color: var(--gray-500);
    display: block; line-height: 1; margin-bottom: 2px;
  }
  .pub-nav-brand-text .brand-product {
    font-family: 'Fraunces', serif; font-size: 17px;
    font-weight: 700; color: var(--gray-900); line-height: 1; letter-spacing: -0.3px;
  }

  /* Nav links */
  .pub-nav-links { display: flex; align-items: center; gap: 4px; list-style: none; margin: 0; padding: 0; }

  .pub-nav-link {
    display: flex; align-items: center; gap: 6px;
    padding: 7px 13px; border-radius: 8px;
    font-size: 13.5px; font-weight: 600; color: var(--gray-700);
    text-decoration: none; cursor: pointer; background: none; border: none;
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: all 0.18s ease; white-space: nowrap;
  }
  .pub-nav-link:hover { background: var(--gray-100); color: var(--ipb-blue-mid); }
  .pub-nav-link.active { background: rgba(37,99,235,0.08); color: var(--ipb-blue-mid); }

  /* CTA buttons */
  .pub-nav-ctas { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

  .btn-guest {
    padding: 8px 16px; border: 1.5px solid var(--gray-200); border-radius: 9px;
    background: var(--white); font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 13px; font-weight: 600; color: var(--gray-700); cursor: pointer;
    display: flex; align-items: center; gap: 6px; transition: all 0.18s; white-space: nowrap;
  }
  .btn-guest:hover { border-color: var(--ipb-blue-lite); color: var(--ipb-blue-mid); background: rgba(37,99,235,0.04); }

  .btn-login {
    padding: 8px 18px; border: none; border-radius: 9px;
    background: linear-gradient(135deg, var(--ipb-blue), var(--ipb-sky));
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 13px; font-weight: 700; color: var(--white); cursor: pointer;
    display: flex; align-items: center; gap: 6px; transition: all 0.18s;
    box-shadow: 0 2px 10px rgba(37,99,235,0.28); white-space: nowrap;
  }
  .btn-login:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(37,99,235,0.4); }

  /* Mobile hamburger */
  .pub-nav-hamburger {
    display: none; flex-direction: column; gap: 5px;
    background: none; border: none; cursor: pointer; padding: 4px;
  }
  .pub-nav-hamburger span {
    display: block; width: 22px; height: 2px;
    background: var(--gray-700); border-radius: 2px; transition: all 0.2s;
  }

  .pub-nav-drawer {
    display: none; flex-direction: column;
    background: var(--white); border-top: 1px solid var(--gray-200);
    padding: 16px 20px 20px; gap: 4px;
    box-shadow: 0 8px 20px rgba(0,0,0,0.06);
  }
  .pub-nav-drawer .pub-nav-link { justify-content: flex-start; padding: 10px 14px; border-radius: 10px; }
  .pub-nav-drawer .pub-nav-ctas { flex-direction: column; margin-top: 12px; }
  .pub-nav-drawer .btn-guest,
  .pub-nav-drawer .btn-login { width: 100%; justify-content: center; padding: 11px; }

  @keyframes dropIn {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 768px) {
    .pub-nav-links { display: none; }
    .pub-nav-ctas { display: none; }
    .pub-nav-hamburger { display: flex; }
    .pub-nav-drawer.open { display: flex; }
    .pub-nav-topbar-left { display: none; }
  }
`;

const navLinks = [
  { icon: "🏠", label: "Beranda", href: "/" },
  { icon: "🎫", label: "Buka Tiket Baru", href: "/tiket/buat" },
  { icon: "🔍", label: "Cek Status Tiket", href: "/tiket/status" },
];

const languages = [
  { flag: "🇮🇩", label: "Indonesia", code: "id" },
  { flag: "🇬🇧", label: "English",   code: "en" },
];

export default function PublicNavbar({ activePath = "/" }) {
  const [lang, setLang] = useState("id");
  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentLang = languages.find(l => l.code === lang);

  return (
    <>
      <style>{styles}</style>
      <nav className="pub-nav">

        {/* Top bar */}
        <div className="pub-nav-topbar">
          <div className="pub-nav-topbar-inner">
            <div className="pub-nav-topbar-left">
              <span>📍</span>
              <span>Institut Pertanian Bogor — Layanan Administrasi Akademik</span>
            </div>
            <div className="pub-nav-topbar-right">
              <button className="topbar-link">📞 Hubungi Kami</button>
              <div className="topbar-divider" />
              <button className="topbar-link">❓ FAQ</button>
              <div className="topbar-divider" />
              <div className="lang-switcher" onClick={() => setLangOpen(!langOpen)} style={{ position: "relative" }}>
                <span className="lang-flag">{currentLang.flag}</span>
                <span className="lang-label">{currentLang.code.toUpperCase()}</span>
                <span className="lang-chevron">▾</span>
                {langOpen && (
                  <div className="lang-dropdown">
                    {languages.map(l => (
                      <button key={l.code} className={`lang-option ${lang === l.code ? "active" : ""}`}
                        onClick={(e) => { e.stopPropagation(); setLang(l.code); setLangOpen(false); }}>
                        <span>{l.flag}</span><span>{l.label}</span>
                        {lang === l.code && <span style={{ marginLeft: "auto", fontSize: "11px" }}>✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main bar */}
        <div className="pub-nav-main">
          <div className="pub-nav-main-inner">
            <a className="pub-nav-brand" href="/">
              <div className="pub-nav-brand-logo">🎓</div>
              <div className="pub-nav-brand-text">
                <span className="brand-uni">IPB University</span>
                <span className="brand-product">Help Center</span>
              </div>
            </a>

            <ul className="pub-nav-links">
              {navLinks.map(link => (
                <li key={link.href}>
                  <a className={`pub-nav-link ${activePath === link.href ? "active" : ""}`} href={link.href}>
                    <span>{link.icon}</span>{link.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="pub-nav-ctas">
              <button className="btn-guest">👤 Pengguna Tamu</button>
              <button className="btn-login">🔐 Masuk</button>
            </div>

            <button className="pub-nav-hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
              <span style={{ transform: mobileOpen ? "rotate(45deg) translate(5px,5px)" : "none" }} />
              <span style={{ opacity: mobileOpen ? 0 : 1 }} />
              <span style={{ transform: mobileOpen ? "rotate(-45deg) translate(5px,-5px)" : "none" }} />
            </button>
          </div>

          <div className={`pub-nav-drawer ${mobileOpen ? "open" : ""}`}>
            {navLinks.map(link => (
              <a key={link.href} className={`pub-nav-link ${activePath === link.href ? "active" : ""}`} href={link.href}>
                <span>{link.icon}</span>{link.label}
              </a>
            ))}
            <div className="pub-nav-ctas">
              <button className="btn-guest">👤 Pengguna Tamu</button>
              <button className="btn-login">🔐 Masuk</button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}