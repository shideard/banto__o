/**
 * Design system CSS-in-JS — banto__o
 * Import dan inject: <style>{pageStyles}</style>
 * Semua warna memakai CSS custom properties dari index.css
 */

export const pageStyles = `
  /* ── Layout halaman ─────────────────────────────────────────── */
  .page-main {
    padding: 32px 40px;
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    font-family: var(--font-sans);
  }

  .page-breadcrumb {
    font-size: 13px;
    color: var(--gray-500);
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .page-breadcrumb a {
    color: var(--gray-500);
    text-decoration: none;
    transition: color 0.2s;
  }
  .page-breadcrumb a:hover { color: var(--color-brand); }
  .page-breadcrumb strong { color: var(--gray-700); font-weight: 600; }
  .page-breadcrumb span { margin: 0 6px; }

  .page-header { margin-bottom: 28px; }
  .page-header h1 {
    font-family: var(--font-display);
    font-size: 30px;
    font-weight: 800;
    color: var(--gray-900);
    margin-bottom: 6px;
  }
  .page-header p {
    font-size: 14px;
    color: var(--gray-500);
    line-height: 1.5;
  }

  /* Alias kompatibilitas */
  .staf-main, .db-main, .profil-main { padding: 32px 40px; max-width: 1200px; width: 100%; margin: 0 auto; font-family: var(--font-sans); }
  .staf-breadcrumb, .db-breadcrumb, .profil-breadcrumb { font-size: 13px; color: var(--gray-500); margin-bottom: 16px; }
  .staf-breadcrumb a, .db-breadcrumb a, .profil-breadcrumb a { color: var(--gray-500); text-decoration: none; }
  .staf-breadcrumb a:hover, .db-breadcrumb a:hover, .profil-breadcrumb a:hover { color: var(--color-brand); }
  .staf-page-header h1, .db-header h1 { font-family: var(--font-display); font-size: 30px; font-weight: 800; color: var(--gray-900); margin-bottom: 4px; }
  .staf-page-header p, .db-header p { font-size: 14px; color: var(--gray-500); }

  /* ── Stats grid ─────────────────────────────────────────────── */
  .stats-grid-4 {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    margin-bottom: 32px;
  }
  .stats-grid-3, .staf-stats-grid, .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 32px;
  }

  .stat-card, .staf-stat-card, .antrean-stat, .tugas-stat-mini {
    background: var(--white);
    border: 1.5px solid var(--gray-200);
    border-radius: var(--radius-xl);
    padding: 24px;
    box-shadow: var(--shadow-md);
    position: relative;
  }
  .stat-card.warning, .staf-stat-card.warning {
    border-color: #fed7aa;
    background: #fff7ed;
  }

  .stat-title, .staf-stat-title, .antrean-stat .label, .tugas-stat-mini .label {
    font-size: 11px;
    font-weight: 700;
    color: var(--gray-400);
    text-transform: uppercase;
    letter-spacing: 0.7px;
    margin-bottom: 12px;
  }
  .stat-value, .staf-stat-value, .antrean-stat .value, .tugas-stat-mini .value {
    font-family: var(--font-display);
    font-size: 36px;
    font-weight: 900;
    color: var(--ipb-blue-dark);
    line-height: 1;
    margin-bottom: 8px;
  }
  .stat-desc { font-size: 12px; font-weight: 600; color: var(--gray-500); }
  .stat-desc.success { color: var(--success); }

  .staf-stat-icon, .antrean-stat-icon, .tugas-stat-mini-icon {
    width: 44px;
    height: 44px;
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* ── Card ───────────────────────────────────────────────────── */
  .card, .table-card, .staf-table-card, .antrean-table-card, .profil-card, .buat-tiket-card {
    background: var(--white);
    border: 1.5px solid var(--gray-200);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-md);
  }
  .table-card, .staf-table-card, .antrean-table-card { overflow: hidden; }
  .card-padded, .buat-tiket-card { padding: 24px; }

  /* ── Alert / Banner ─────────────────────────────────────────── */
  .alert-warning, .staf-alert, .bt-alert-inner {
    background: #fffbeb;
    border: 1.5px solid #fcd34d;
    border-radius: var(--radius-lg);
    padding: 14px 20px;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    font-size: 13px;
    color: #92400e;
    line-height: 1.6;
    box-shadow: 0 4px 16px rgba(0,0,0,0.06);
  }
  .alert-success, .success-banner {
    background: var(--success-bg);
    border: 1.5px solid #bbf7d0;
    border-radius: var(--radius-lg);
    padding: 14px 20px;
    font-size: 13px;
    color: var(--success);
    font-weight: 600;
  }
  .alert-error, .error-banner {
    background: var(--danger-bg);
    border: 1.5px solid #fecaca;
    border-radius: var(--radius-lg);
    padding: 14px 20px;
    font-size: 13px;
    color: var(--danger);
  }

  /* ── Tabel ──────────────────────────────────────────────────── */
  .table-card-header, .staf-table-header {
    padding: 20px 24px;
    border-bottom: 1.5px solid var(--gray-200);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
  }
  .table-card-header h2, .staf-table-header h2 {
    font-size: 17px;
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: 4px;
  }

  table.data-table, table.staf-table, table.antrean-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
  }
  table.data-table th, table.staf-table th, table.antrean-table th {
    padding: 12px 20px;
    font-size: 11px;
    font-weight: 700;
    color: var(--gray-500);
    background: var(--gray-50);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1.5px solid var(--gray-200);
  }
  table.data-table td, table.staf-table td, table.antrean-table td {
    padding: 14px 20px;
    font-size: 13px;
    color: var(--gray-900);
    border-bottom: 1.5px solid var(--gray-100);
    vertical-align: middle;
  }
  table.data-table tr:last-child td,
  table.staf-table tr:last-child td,
  table.antrean-table tr:last-child td { border-bottom: none; }

  .ticket-id-link, .td-ticket-id, .antrean-ticket-id {
    font-weight: 700;
    color: var(--color-brand);
    font-size: 13px;
    text-decoration: none;
  }
  .ticket-id-link:hover, .td-ticket-id:hover, .antrean-ticket-id:hover { text-decoration: underline; }

  /* ── Status pill ──────────────────────────────────────────────── */
  .status-pill, .staf-status-pill, .tugas-status-pill, .tiket-mini-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: var(--radius-full);
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
  }
  .status-pill::before, .staf-status-pill::before {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .pill-DIBUAT, .status-pill--DIBUAT { background: #eff6ff; color: #1d4ed8; }
  .pill-DIBUAT::before, .status-pill--DIBUAT::before { background: var(--color-brand); }
  .pill-DIKLAIM, .status-pill--DIKLAIM { background: #fefce8; color: #a16207; }
  .pill-DIPROSES, .status-pill--DIPROSES { background: #fff7ed; color: #c2410c; }
  .pill-DIPROSES::before, .status-pill--DIPROSES::before { background: #ea580c; }
  .pill-SELESAI, .status-pill--SELESAI { background: var(--success-bg); color: var(--success); }
  .pill-SELESAI::before, .status-pill--SELESAI::before { background: #16a34a; }
  .pill-REVISI, .status-pill--REVISI { background: var(--danger-bg); color: var(--danger); }
  .pill-DITOLAK, .pill-DITUTUP, .status-pill--DITOLAK { background: var(--gray-100); color: #475569; }
  .pill-DITOLAK::before, .status-pill--DITOLAK::before { background: var(--gray-400); }

  /* ── Tombol ─────────────────────────────────────────────────── */
  .btn-lanjut, .btn-primary-sm, .btn-buat, .btn-tugas-action.primary {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    background: var(--color-brand);
    color: var(--white);
    border: none;
    border-radius: var(--radius-md);
    font-size: 13px;
    font-weight: 700;
    font-family: var(--font-sans);
    cursor: pointer;
    text-decoration: none;
    transition: all 0.18s;
  }
  .btn-lanjut:hover, .btn-primary-sm:hover, .btn-buat:hover, .btn-tugas-action.primary:hover {
    background: #1d4ed8;
  }
  .btn-lanjut:disabled, .btn-buat:disabled { background: #93c5fd; cursor: not-allowed; }

  .btn-lihat, .btn-outline, .btn-outline-sm, .btn-baca, .btn-detail, .btn-batal {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 14px;
    background: var(--white);
    color: var(--color-brand);
    border: 1.5px solid #bfdbfe;
    border-radius: var(--radius-md);
    font-size: 13px;
    font-weight: 700;
    font-family: var(--font-sans);
    cursor: pointer;
    text-decoration: none;
    transition: all 0.18s;
  }
  .btn-lihat:hover, .btn-outline:hover, .btn-baca:hover { background: #eff6ff; }
  .btn-batal { color: var(--gray-700); border-color: var(--gray-200); }
  .btn-batal:hover { background: var(--gray-50); }

  /* ── Input / Search ─────────────────────────────────────────── */
  .input-search, .staf-table-search, .antrean-search, .tugas-search {
    display: flex;
    align-items: center;
    gap: 8px;
    border: 1.5px solid var(--gray-200);
    border-radius: var(--radius-md);
    padding: 8px 12px;
    background: var(--gray-50);
    min-width: 180px;
  }
  .input-search input, .staf-table-search input, .antrean-search input, .tugas-search input {
    border: none;
    background: transparent;
    font-size: 13px;
    color: var(--gray-700);
    outline: none;
    font-family: var(--font-sans);
    width: 100%;
  }
  .input-search input::placeholder, .antrean-search input::placeholder { color: var(--gray-400); }

  .form-group { margin-bottom: 18px; }
  .form-label, .form-lbl {
    display: block;
    font-size: 12px;
    font-weight: 700;
    color: var(--gray-700);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 7px;
  }
  .form-input, .form-select, .form-textarea {
    width: 100%;
    border: 1.5px solid var(--gray-200);
    border-radius: var(--radius-md);
    padding: 10px 14px;
    font-size: 14px;
    color: var(--gray-700);
    font-family: var(--font-sans);
    outline: none;
    background: var(--gray-50);
    box-sizing: border-box;
    transition: border-color 0.18s, background 0.18s;
  }
  .form-input:focus, .form-select:focus, .form-textarea:focus {
    border-color: var(--color-brand);
    background: var(--white);
  }
  .form-input::placeholder, .form-textarea::placeholder { color: var(--gray-400); }
  .form-textarea { resize: vertical; min-height: 120px; }
  .form-error { font-size: 12px; color: var(--danger); margin-top: 6px; }
  .form-hint { font-size: 11px; color: var(--gray-400); margin-top: 5px; }

  /* ── Empty / loading / error state ────────────────────────────── */
  .state-row td, .state-center, .state-empty, .empty-state {
    text-align: center;
    padding: 32px 20px;
    font-size: 14px;
    color: var(--gray-400);
  }
  .state-row td.state-loading, .state-center { color: var(--gray-400); }
  .state-row td.state-error, .state-center.error { color: var(--danger); }

  /* ── Layout dua kolom staf dashboard ──────────────────────────── */
  .staf-two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-bottom: 24px;
  }

  /* ── Responsive ─────────────────────────────────────────────── */
  @media (max-width: 1024px) {
    .stats-grid-4, .stats-grid { grid-template-columns: repeat(2, 1fr); }
    .staf-two-col { grid-template-columns: 1fr; }
  }
  @media (max-width: 768px) {
    .page-main, .staf-main, .db-main, .profil-main { padding: 20px 16px; }
    .stats-grid-4, .stats-grid-3, .staf-stats-grid { grid-template-columns: 1fr; }
    .page-header h1, .staf-page-header h1 { font-size: 26px; }
  }
`;

export default pageStyles;
