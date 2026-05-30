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

  .site-footer {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: var(--white);
    padding: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px solid var(--gray-200); /* Garis batas tipis di atas footer */
  }

  .footer-copyright { 
    font-size: 14px; 
    color: var(--gray-500); /* Teks jadi abu-abu agar kontras */
  }
  
  .footer-copyright strong { 
    color: var(--ipb-blue-dark); /* Tulisan IPB University pakai biru gelap */
  }
`;

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <>
      <style>{styles}</style>
      <footer className="site-footer">
        <div className="footer-copyright">
          © {year} <strong>Help Center IPB. All rights reserved.</strong> 
        </div>
      </footer>
    </>
  );
}