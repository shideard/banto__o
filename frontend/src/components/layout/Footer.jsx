const styles = `
  :root {
    --ipb-blue-dark:  #0a1f5c;
    --ipb-blue:       #1a4fad;
    --ipb-blue-mid:   #2563eb;
    --ipb-blue-lite:  #3b82f6;
    --ipb-sky:        #0ea5e9;
    --white:          #ffffff;
    --gray-200:       #e2e8f0;
    --gray-400:       #94a3b8;
    --gray-500:       #64748b;
    --gray-700:       #334155;
    --gray-900:       #0f172a;
  }

  .site-footer {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: var(--ipb-blue-dark);
    color: var(--gray-400);
    position: relative;
    overflow: hidden;
  }

  /* Top gradient accent line */
  .site-footer::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--ipb-blue), var(--ipb-blue-mid), var(--ipb-sky));
  }

  /* Subtle blob */
  .site-footer::after {
    content: '';
    position: absolute;
    width: 500px; height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(37,99,235,0.08), transparent 70%);
    bottom: -200px; right: -100px;
    pointer-events: none;
  }

  .footer-top {
    max-width: 1200px; margin: 0 auto;
    padding: 56px 28px 48px;
    display: grid;
    grid-template-columns: 1.6fr 1fr 1fr 1fr;
    gap: 40px;
    position: relative; z-index: 1;
  }

  /* Brand col */
  .footer-brand-logo {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 16px; text-decoration: none;
  }

  .footer-brand-icon {
    width: 40px; height: 40px;
    background: linear-gradient(135deg, var(--ipb-blue), var(--ipb-sky));
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; flex-shrink: 0;
  }

  .footer-brand-text .f-uni {
    font-size: 9px; font-weight: 700; letter-spacing: 1.5px;
    text-transform: uppercase; color: var(--gray-500);
    display: block; line-height: 1; margin-bottom: 2px;
  }
  .footer-brand-text .f-product {
    font-family: 'Fraunces', serif; font-size: 16px;
    font-weight: 700; color: var(--white); line-height: 1;
  }

  .footer-brand-desc {
    font-size: 13px; line-height: 1.7;
    color: rgba(148,163,184,0.8); margin-bottom: 24px; max-width: 260px;
  }

  .footer-socials { display: flex; gap: 8px; }

  .social-btn {
    width: 36px; height: 36px; border-radius: 8px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    display: flex; align-items: center; justify-content: center;
    font-size: 15px; cursor: pointer; transition: all 0.18s; text-decoration: none;
  }
  .social-btn:hover {
    background: rgba(37,99,235,0.2);
    border-color: rgba(59,130,246,0.4);
    transform: translateY(-2px);
  }

  /* Link columns */
  .footer-col-title {
    font-size: 11px; font-weight: 700; letter-spacing: 1.5px;
    text-transform: uppercase; color: var(--white); margin-bottom: 16px;
  }

  .footer-col-links { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }

  .footer-col-link {
    font-size: 13px; color: rgba(148,163,184,0.8); text-decoration: none;
    cursor: pointer; background: none; border: none;
    font-family: 'Plus Jakarta Sans', sans-serif; text-align: left; padding: 0;
    transition: color 0.15s; display: flex; align-items: center; gap: 6px;
  }
  .footer-col-link:hover { color: var(--ipb-blue-lite); }

  /* Contact card */
  .footer-contact-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 12px; padding: 16px; margin-top: 4px;
  }

  .footer-contact-item {
    display: flex; align-items: flex-start; gap: 8px;
    font-size: 12.5px; color: rgba(148,163,184,0.8);
    margin-bottom: 10px; line-height: 1.5;
  }
  .footer-contact-item:last-child { margin-bottom: 0; }
  .footer-contact-icon { font-size: 14px; flex-shrink: 0; margin-top: 1px; }

  /* Divider */
  .footer-divider {
    height: 1px; background: rgba(255,255,255,0.06);
    max-width: 1200px; margin: 0 auto;
    position: relative; z-index: 1;
  }

  /* Bottom bar */
  .footer-bottom {
    max-width: 1200px; margin: 0 auto; padding: 18px 28px;
    display: flex; align-items: center; justify-content: space-between;
    gap: 16px; flex-wrap: wrap;
    position: relative; z-index: 1;
  }

  .footer-copyright { font-size: 12px; color: rgba(100,116,139,0.8); }
  .footer-copyright strong { color: var(--gray-400); }

  .footer-bottom-links { display: flex; align-items: center; gap: 20px; }

  .footer-bottom-link {
    font-size: 12px; color: rgba(100,116,139,0.8); text-decoration: none;
    cursor: pointer; background: none; border: none;
    font-family: 'Plus Jakarta Sans', sans-serif; transition: color 0.15s;
  }
  .footer-bottom-link:hover { color: var(--ipb-blue-lite); }

  .footer-status { display: flex; align-items: center; gap: 6px; font-size: 12px; color: rgba(100,116,139,0.8); }

  .status-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #22c55e; box-shadow: 0 0 6px rgba(34,197,94,0.5);
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  @media (max-width: 900px) {
    .footer-top { grid-template-columns: 1fr 1fr; gap: 32px; }
    .footer-brand { grid-column: 1 / -1; }
  }

  @media (max-width: 560px) {
    .footer-top { grid-template-columns: 1fr; }
    .footer-bottom { flex-direction: column; align-items: flex-start; gap: 12px; }
  }
`;

const layananLinks = [
  { icon: "🎫", label: "Buka Tiket Baru" },
  { icon: "🔍", label: "Cek Status Tiket" },
  { icon: "🤖", label: "Chatbot BantO__O" },
  { icon: "📚", label: "Panduan Layanan" },
  { icon: "❓", label: "FAQ" },
];

const akademikLinks = [
  { icon: "📝", label: "Akademik & Kurikulum" },
  { icon: "💰", label: "Keuangan & Beasiswa" },
  { icon: "🏠", label: "Kemahasiswaan" },
  { icon: "📋", label: "Administrasi Umum" },
  { icon: "🔬", label: "Penelitian" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <>
      <style>{styles}</style>
      <footer className="site-footer">
        <div className="footer-top">

          {/* Brand */}
          <div className="footer-brand">
            <a className="footer-brand-logo" href="/">
              <div className="footer-brand-icon">🎓</div>
              <div className="footer-brand-text">
                <span className="f-uni">IPB University</span>
                <span className="f-product">Help Center</span>
              </div>
            </a>
            <p className="footer-brand-desc">
              Platform layanan administrasi akademik terpadu Institut Pertanian Bogor. Sampaikan kebutuhanmu, kami siap membantu.
            </p>
            <div className="footer-socials">
              <a className="social-btn" href="#" title="Instagram">📸</a>
              <a className="social-btn" href="#" title="Twitter/X">🐦</a>
              <a className="social-btn" href="#" title="YouTube">▶️</a>
              <a className="social-btn" href="#" title="Email">✉️</a>
            </div>
          </div>

          {/* Layanan */}
          <div className="footer-col">
            <div className="footer-col-title">Layanan</div>
            <ul className="footer-col-links">
              {layananLinks.map((l, i) => (
                <li key={i}><a className="footer-col-link" href="#"><span>{l.icon}</span>{l.label}</a></li>
              ))}
            </ul>
          </div>

          {/* Kategori */}
          <div className="footer-col">
            <div className="footer-col-title">Kategori</div>
            <ul className="footer-col-links">
              {akademikLinks.map((l, i) => (
                <li key={i}><a className="footer-col-link" href="#"><span>{l.icon}</span>{l.label}</a></li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div className="footer-col">
            <div className="footer-col-title">Kontak</div>
            <div className="footer-contact-card">
              <div className="footer-contact-item"><span className="footer-contact-icon">📍</span><span>Gedung Rektorat Lt. 1, Kampus IPB Dramaga, Bogor 16680</span></div>
              <div className="footer-contact-item"><span className="footer-contact-icon">📞</span><span>(0251) 8622642</span></div>
              <div className="footer-contact-item"><span className="footer-contact-icon">✉️</span><span>helpdesk@apps.ipb.ac.id</span></div>
              <div className="footer-contact-item"><span className="footer-contact-icon">🕐</span><span>Senin – Jumat, 08.00 – 16.00 WIB</span></div>
            </div>
          </div>

        </div>

        <div className="footer-divider" />

        <div className="footer-bottom">
          <div className="footer-copyright">
            © {year} <strong>IPB University</strong> — Help Center. All rights reserved.
          </div>
          <div className="footer-status">
            <div className="status-dot" />
            Semua sistem berjalan normal
          </div>
          <div className="footer-bottom-links">
            <a className="footer-bottom-link" href="#">Kebijakan Privasi</a>
            <a className="footer-bottom-link" href="#">Syarat Layanan</a>
            <a className="footer-bottom-link" href="#">Aksesibilitas</a>
          </div>
        </div>
      </footer>
    </>
  );
}