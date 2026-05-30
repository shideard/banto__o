// frontend/src/pages/mahasiswa/MahasiswaDetailTiketPage.jsx
import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import ticketService from "../../services/ticketService";
import AppIcon from "../../components/ui/AppIcon";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

const styles = `
  .mdt-main {
    padding: 32px 40px;
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .mdt-breadcrumb {
    font-size: 13px;
    color: var(--gray-500);
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .mdt-breadcrumb a { color: var(--gray-500); text-decoration: none; }
  .mdt-breadcrumb a:hover { color: #2563eb; }
  .mdt-breadcrumb strong { color: var(--gray-700); }
  .mdt-breadcrumb span { color: var(--gray-400); }

  .mdt-page-header { margin-bottom: 24px; }
  .mdt-page-header h1 {
    font-family: 'Fraunces', serif;
    font-size: 28px; font-weight: 800;
    color: var(--gray-900); margin: 0 0 8px;
  }
  .mdt-page-header-meta {
    display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
  }
  .mdt-ticket-id { font-size: 13px; font-weight: 700; color: #2563eb; }
  .mdt-header-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--gray-300); }

  .mdt-body {
    display: grid;
    grid-template-columns: 1fr 260px;
    gap: 24px;
    align-items: start;
  }

  .mdt-left { display: flex; flex-direction: column; gap: 20px; }

  /* Stepper */
  .mdt-stepper-card {
    background: var(--white);
    border: 1.5px solid var(--gray-200);
    border-radius: 16px;
    padding: 20px 28px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.02);
  }
  .mdt-stepper { display: flex; align-items: center; justify-content: space-between; }
  .mdt-step { display: flex; flex-direction: column; align-items: center; gap: 8px; flex: 1; z-index: 1; position: relative; }
  .mdt-step-circle {
    width: 36px; height: 36px; border-radius: 50%;
    border: 2px solid var(--gray-200);
    background: var(--white);
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; color: var(--gray-400);
    transition: all 0.2s;
  }
  .mdt-step-circle.done { background: #2563eb; border-color: #2563eb; color: white; }
  .mdt-step-circle.active { background: white; border-color: #2563eb; color: #2563eb; box-shadow: 0 0 0 4px #dbeafe; }
  .mdt-step-label { font-size: 12px; font-weight: 600; color: var(--gray-400); text-align: center; }
  .mdt-step-label.done  { color: #2563eb; }
  .mdt-step-label.active { color: #2563eb; font-weight: 700; }
  .mdt-step-line { flex: 1; height: 2px; background: var(--gray-200); margin-bottom: 20px; z-index: 0; }
  .mdt-step-line.done { background: #2563eb; }

  /* Kartu pesan awal */
  .mdt-ticket-card {
    background: var(--white);
    border: 1.5px solid var(--gray-200);
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.02);
  }
  .mdt-ticket-meta { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
  .mdt-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    background: #2563eb; color: white;
    font-size: 13px; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .mdt-avatar.staf { background: #0a1f5c; }
  .mdt-avatar.sistem {
    background: var(--gray-100); color: var(--gray-500);
    border: 1.5px solid var(--gray-200);
  }
  .mdt-ticket-author { font-size: 14px; font-weight: 700; color: var(--gray-900); }
  .mdt-ticket-time { font-size: 12px; color: var(--gray-400); font-weight: 500; }
  .mdt-ticket-body { font-size: 14px; color: var(--gray-700); line-height: 1.7; margin-bottom: 16px; }
  .mdt-lampiran-label {
    font-size: 11px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.6px; color: var(--gray-500); margin-bottom: 10px;
    display: flex; align-items: center; gap: 6px;
  }
  .mdt-lampiran-thumb {
    width: 80px; height: 60px; border-radius: 8px; object-fit: cover;
    border: 1.5px solid var(--gray-200); cursor: pointer; transition: opacity 0.15s;
  }
  .mdt-lampiran-thumb:hover { opacity: 0.85; }

  /* Riwayat */
  .mdt-riwayat-section { display: flex; flex-direction: column; gap: 12px; }
  .mdt-riwayat-title { font-size: 16px; font-weight: 700; color: var(--gray-900); margin-bottom: 4px; }

  .mdt-sistem-row {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 10px 14px;
    background: var(--gray-50); border: 1.5px solid var(--gray-200); border-radius: 10px;
  }
  .mdt-sistem-row .mdt-avatar { width: 28px; height: 28px; font-size: 11px; }
  .mdt-sistem-text { font-size: 13px; color: var(--gray-500); line-height: 1.5; }
  .mdt-sistem-text strong { color: var(--gray-700); }
  .mdt-sistem-time { font-size: 11px; color: var(--gray-400); margin-top: 2px; }

  .mdt-reply-card {
    background: var(--white); border: 1.5px solid var(--gray-200);
    border-radius: 14px; padding: 18px 20px;
    box-shadow: 0 1px 6px rgba(0,0,0,0.02);
  }
  .mdt-reply-card.from-staf { border-color: #bfdbfe; background: #f8fbff; }
  .mdt-reply-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
  .mdt-reply-author-row { display: flex; align-items: center; gap: 10px; }
  .mdt-reply-name { font-size: 14px; font-weight: 700; color: var(--gray-900); }
  .mdt-reply-time { font-size: 12px; color: var(--gray-400); }
  .mdt-reply-body { font-size: 14px; color: var(--gray-700); line-height: 1.7; }
  .mdt-reply-img { margin-top: 12px; width: 160px; border-radius: 8px; border: 1.5px solid var(--gray-200); display: block; }

  /* Form balasan */
  .mdt-form-card {
    background: var(--white); border: 1.5px solid var(--gray-200);
    border-radius: 16px; overflow: hidden;
    box-shadow: 0 2px 10px rgba(0,0,0,0.02);
  }
  .mdt-form-title { padding: 16px 20px; border-bottom: 1.5px solid var(--gray-200); font-size: 14px; font-weight: 700; color: var(--gray-900); background: var(--gray-50); }
  .mdt-form-toolbar { display: flex; align-items: center; gap: 2px; padding: 10px 16px; border-bottom: 1.5px solid var(--gray-200); }
  .mdt-toolbar-btn {
    width: 28px; height: 28px; border: none; background: transparent; border-radius: 6px;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; color: var(--gray-500);
    font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s;
  }
  .mdt-toolbar-btn:hover { background: var(--gray-100); color: var(--gray-900); }
  .mdt-toolbar-divider { width: 1px; height: 18px; background: var(--gray-200); margin: 0 4px; }
  .mdt-form-textarea {
    width: 100%; min-height: 120px; padding: 16px 20px;
    border: none; outline: none; resize: none;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 14px; color: var(--gray-700); line-height: 1.7; box-sizing: border-box;
  }
  .mdt-form-textarea::placeholder { color: var(--gray-400); }
  .mdt-form-upload-row {
    padding: 10px 20px; border-top: 1.5px solid var(--gray-200);
    display: flex; align-items: center; gap: 8px;
    font-size: 13px; color: var(--gray-400); cursor: pointer; transition: background 0.15s;
  }
  .mdt-form-upload-row:hover { background: var(--gray-50); }
  .mdt-form-upload-link { color: #2563eb; font-weight: 600; }
  .mdt-form-footer {
    padding: 14px 20px; border-top: 1.5px solid var(--gray-200);
    display: flex; align-items: center; justify-content: space-between; background: var(--gray-50);
  }
  .mdt-status-note { font-size: 12px; color: var(--gray-500); }
  .mdt-status-note em { font-style: normal; font-weight: 600; color: var(--gray-700); }
  .mdt-form-actions { display: flex; align-items: center; gap: 10px; }
  .mdt-btn-batal {
    background: transparent; border: none;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 13px; font-weight: 600; color: var(--gray-500);
    cursor: pointer; padding: 8px 12px; border-radius: 8px; transition: all 0.15s;
  }
  .mdt-btn-batal:hover { color: var(--gray-700); background: var(--gray-100); }
  .mdt-btn-kirim {
    background: #2563eb; color: white; border: none; border-radius: 8px;
    padding: 8px 18px; font-size: 13px; font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
    cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.18s;
  }
  .mdt-btn-kirim:hover { background: #1d4ed8; }
  .mdt-btn-kirim:disabled { background: #93c5fd; cursor: not-allowed; }

  .mdt-closed-notice {
    background: var(--gray-50); border: 1.5px solid var(--gray-200); border-radius: 14px;
    padding: 18px 20px; font-size: 13px; color: var(--gray-500); text-align: center;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }

  /* Sidebar */
  .mdt-sidebar { display: flex; flex-direction: column; gap: 16px; }
  .mdt-sidebar-card {
    background: var(--white); border: 1.5px solid var(--gray-200);
    border-radius: 14px; padding: 18px 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.02);
  }
  .mdt-sidebar-section-title {
    font-size: 11px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.7px; color: var(--gray-400); margin-bottom: 14px;
  }
  .mdt-detail-rows { display: flex; flex-direction: column; }
  .mdt-detail-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 9px 0; border-bottom: 1px solid var(--gray-100);
    font-size: 13px; gap: 12px;
  }
  .mdt-detail-row:last-child { border-bottom: none; }
  .mdt-detail-key { color: var(--gray-500); font-weight: 500; flex-shrink: 0; }
  .mdt-detail-val { font-weight: 600; color: var(--gray-900); text-align: right; }

  .mdt-status-pill {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px; border-radius: 100px; font-size: 11px; font-weight: 700;
  }
  .mdt-status-pill::before { content: ''; width: 6px; height: 6px; border-radius: 50%; }
  .pill-DIBUAT   { background: #eff6ff; color: #1d4ed8; }
  .pill-DIBUAT::before   { background: #2563eb; }
  .pill-DIKLAIM  { background: #fefce8; color: #a16207; }
  .pill-DIPROSES { background: #fff7ed; color: #c2410c; }
  .pill-DIPROSES::before { background: #ea580c; }
  .pill-SELESAI  { background: #f0fdf4; color: #15803d; }
  .pill-SELESAI::before  { background: #16a34a; }
  .pill-DITUTUP  { background: #f1f5f9; color: #475569; }
  .pill-DITUTUP::before  { background: #64748b; }

  .mdt-badge-kategori { background: #eff6ff; color: #1d4ed8; border-radius: 6px; padding: 3px 10px; font-size: 12px; font-weight: 700; }
  .mdt-badge-tinggi { color: #dc2626; font-weight: 700; font-size: 13px; }
  .mdt-badge-normal { color: #16a34a; font-weight: 700; font-size: 13px; }

  .mdt-petugas-row { display: flex; align-items: center; gap: 12px; }
  .mdt-petugas-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    background: #e2e8f0; color: var(--gray-700);
    font-size: 12px; font-weight: 700;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .mdt-petugas-name { font-size: 13px; font-weight: 700; color: var(--gray-900); margin-bottom: 2px; }
  .mdt-petugas-role { font-size: 11px; color: var(--gray-400); font-weight: 500; }
  .mdt-no-petugas { font-size: 13px; color: var(--gray-400); font-style: italic; }

  .mdt-loading { text-align: center; padding: 80px 40px; color: var(--gray-400); font-size: 14px; }


  /* ── Lampiran chip ── */
  .mdt-lampiran-wrap { margin-top: 12px; }
  .mdt-lampiran-list { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
  .mdt-lampiran-chip {
    display: flex; align-items: center; gap: 8px;
    padding: 8px 12px; border-radius: 10px;
    border: 1.5px solid var(--gray-200); background: var(--gray-50);
    cursor: pointer; transition: all 0.18s; max-width: 240px;
    text-decoration: none;
  }
  .mdt-lampiran-chip:hover { border-color: #93c5fd; background: #eff6ff; }
  .mdt-lampiran-chip-icon {
    width: 32px; height: 32px; border-radius: 7px;
    background: #dbeafe; display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .mdt-lampiran-chip-img-icon {
    background: #dcfce7;
  }
  .mdt-lampiran-chip-info { flex: 1; min-width: 0; }
  .mdt-lampiran-chip-name {
    font-size: 12px; font-weight: 600; color: var(--gray-800);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .mdt-lampiran-chip-type { font-size: 11px; color: var(--gray-400); }
  .mdt-lampiran-chip-dl {
    width: 26px; height: 26px; border-radius: 6px;
    background: #2563eb; color: white;
    border: none; cursor: pointer; display: flex;
    align-items: center; justify-content: center;
    flex-shrink: 0; transition: background 0.15s;
  }
  .mdt-lampiran-chip-dl:hover { background: #1d4ed8; }

  /* ── Lightbox / Preview modal ── */
  .mdt-preview-overlay {
    position: fixed; inset: 0; z-index: 999;
    background: rgba(0,0,0,0.75); backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
  }
  .mdt-preview-box {
    background: #fff; border-radius: 16px; overflow: hidden;
    max-width: 90vw; max-height: 90vh;
    display: flex; flex-direction: column;
    box-shadow: 0 24px 80px rgba(0,0,0,0.4);
    animation: previewIn 0.2s ease;
  }
  @keyframes previewIn {
    from { opacity: 0; transform: scale(0.95); }
    to   { opacity: 1; transform: scale(1); }
  }
  .mdt-preview-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 18px; border-bottom: 1.5px solid var(--gray-200);
    gap: 12px;
  }
  .mdt-preview-filename {
    font-size: 13px; font-weight: 700; color: var(--gray-900);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .mdt-preview-actions { display: flex; gap: 8px; flex-shrink: 0; }
  .mdt-preview-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 12px; border-radius: 8px; border: 1.5px solid var(--gray-200);
    background: var(--white); font-size: 12px; font-weight: 700;
    color: var(--gray-700); cursor: pointer; transition: all 0.15s;
    text-decoration: none;
  }
  .mdt-preview-btn:hover { background: var(--gray-50); }
  .mdt-preview-btn.primary { background: #2563eb; color: white; border-color: #2563eb; }
  .mdt-preview-btn.primary:hover { background: #1d4ed8; }
  .mdt-preview-btn.close { background: #fef2f2; color: #dc2626; border-color: #fecaca; }
  .mdt-preview-btn.close:hover { background: #fee2e2; }
  .mdt-preview-body {
    flex: 1; overflow: auto;
    display: flex; align-items: center; justify-content: center;
    padding: 20px; background: #f8fafc;
    min-height: 200px;
  }
  .mdt-preview-body img {
    max-width: 100%; max-height: 70vh;
    border-radius: 8px; box-shadow: 0 4px 24px rgba(0,0,0,0.12);
  }
  /* ★ BARU — iframe PDF di modal */
  .mdt-preview-body iframe {
    border-radius: 8px;
  }
  .mdt-preview-file-icon {
    display: flex; flex-direction: column; align-items: center; gap: 12px;
    color: var(--gray-400);
  }
  .mdt-preview-file-icon p { font-size: 13px; font-weight: 600; color: var(--gray-500); }

  /* Gambar inline di riwayat */
  .mdt-lampiran-img {
    max-width: 100%;
    max-height: 400px;
    border-radius: 10px;
    border: 1.5px solid var(--gray-200);
    display: block;
    margin-top: 8px;
    cursor: pointer;
    transition: opacity 0.15s;
  }
  .mdt-lampiran-img:hover { opacity: 0.9; }

  /* Chip untuk file non-gambar di riwayat */
  .mdt-file-chip {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    border-radius: 10px;
    border: 1.5px solid var(--gray-200);
    background: var(--gray-50);
    text-decoration: none;
    color: var(--gray-700);
    font-size: 13px;
    font-weight: 600;
    margin-top: 8px;
    transition: all 0.18s;
    max-width: 300px;
  }
  .mdt-file-chip:hover {
    border-color: #93c5fd;
    background: #eff6ff;
    color: #1d4ed8;
  }
  .mdt-file-chip-icon {
    width: 30px;
    height: 30px;
    border-radius: 7px;
    background: #dbeafe;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .mdt-file-chip-pdf { background: #fee2e2; }
  .mdt-file-chip-name {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .mdt-file-chip-ext {
    font-size: 11px;
    font-weight: 700;
    color: var(--gray-400);
    flex-shrink: 0;
  }

  /* ★ BARU — Preview lampiran sebelum dikirim */
  .mdt-form-pending-lampiran {
    padding: 12px 20px;
    border-top: 1.5px solid var(--gray-200);
    background: #f0f7ff;
  }
  .mdt-form-pending-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: #2563eb;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .mdt-form-pending-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .mdt-btn-hapus-lampiran {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: 1.5px solid #fecaca;
    background: #fef2f2;
    color: #dc2626;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background 0.15s;
  }
  .mdt-btn-hapus-lampiran:hover { background: #fee2e2; }

  @media (max-width: 1024px) {
    .mdt-body { grid-template-columns: 1fr; }
    .mdt-sidebar { order: -1; }
    .mdt-main { padding: 24px 20px; }
  }
`;

// ─── Helpers ──────────────────────────────────────────────────
function getInitials(nama = "") {
  return nama
    .split(" ").slice(0, 2)
    .map(w => w[0]?.toUpperCase() || "").join("");
}

function formatTanggal(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return (
    d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) +
    ", " + d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB"
  );
}

function formatTanggalPendek(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return (
    d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) +
    "\n" + d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
  );
}

/** Parse komentar isi yg berupa [FILE] menjadi objek lampiran */
function parseLampiran(isi) {
  // Format: [FILE] namafile.ext — uploads/tiket_X/namafile.ext
  if (!isi || !isi.startsWith("[FILE]")) return null;
  const rest = isi.replace(/^\[FILE\]\s*/, "");
  const dashIdx = rest.lastIndexOf(" — ");
  if (dashIdx === -1) {
    const nama = rest.trim();
    return { nama, url: `${BACKEND_URL}/uploads/${nama}` };
  }
  const nama = rest.slice(0, dashIdx).trim();
  const path = rest.slice(dashIdx + 3).trim(); // e.g. "uploads/tiket_5/file.pdf"
  const url = `${BACKEND_URL}/${path.replace(/\\/g, "/")}`;
  return { nama, url };
}

const IMAGE_EXTS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp"];
function isImage(nama = "") {
  return IMAGE_EXTS.some(ext => nama.toLowerCase().endsWith(ext));
}

// ★ BARU: cek apakah file adalah PDF
function isPDF(nama = "") {
  return nama.toLowerCase().endsWith(".pdf");
}

function getFileExt(nama = "") {
  const dot = nama.lastIndexOf(".");
  return dot !== -1 ? nama.slice(dot + 1).toUpperCase() : "FILE";
}

// ─── Stepper ──────────────────────────────────────────────────
const STEPS = ["DIBUAT", "DIKLAIM", "DIPROSES", "SELESAI"];
const STEP_LABELS = ["Dibuat", "Diklaim", "Diproses", "Selesai"];

// ─── Helper Prioritas ─────────────────────────────────────────
const PRIORITAS_STYLE = {
  Normal:   { bg: "#f0fdf4", color: "#15803d", dot: "#16a34a" },
  Mendesak: { bg: "#fff7ed", color: "#c2410c", dot: "#ea580c" },
  Penting:  { bg: "#fef2f2", color: "#dc2626", dot: "#dc2626" },
};

function PrioritasPill({ prioritas = "Normal" }) {
  const s = PRIORITAS_STYLE[prioritas] || PRIORITAS_STYLE.Normal;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 100,
      background: s.bg, color: s.color,
      fontSize: 11, fontWeight: 700
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot }} />
      {prioritas}
    </span>
  );
}

function getStepIndex(status) {
  const s = String(status || "").toUpperCase();
  const idx = STEPS.indexOf(s);
  return idx === -1 ? 0 : idx;
}

function Stepper({ status }) {
  const current = getStepIndex(status);
  return (
    <div className="mdt-stepper-card">
      <div className="mdt-stepper">
        {STEP_LABELS.map((label, i) => {
          const isDone   = i < current;
          const isActive = i === current;
          return (
            <>
              <div className="mdt-step" key={label}>
                <div className={`mdt-step-circle ${isDone ? "done" : isActive ? "active" : ""}`}>
                  {isDone ? <AppIcon name="Check" variant="sm" /> : i + 1}
                </div>
                <span className={`mdt-step-label ${isDone ? "done" : isActive ? "active" : ""}`}>
                  {label}
                </span>
              </div>
              {i < STEP_LABELS.length - 1 && (
                <div className={`mdt-step-line ${i < current ? "done" : ""}`} key={`line-${i}`} />
              )}
            </>
          );
        })}
      </div>
    </div>
  );
}

// ─── Komponen Lampiran Chip ────────────────────────────────────
function LampiranChip({ nama, url, onPreview }) {
  const img = isImage(nama);
  const ext = getFileExt(nama);

  const handleDownload = (e) => {
    e.stopPropagation();
    const a = document.createElement("a");
    a.href = url;
    a.download = nama;
    a.target = "_blank";
    a.rel = "noreferrer";
    a.click();
  };

  return (
    <div
      className="mdt-lampiran-chip"
      onClick={() => onPreview({ nama, url })}
      title={`Klik untuk preview: ${nama}`}
    >
      <div className={`mdt-lampiran-chip-icon ${img ? "mdt-lampiran-chip-img-icon" : ""}`}>
        <AppIcon name={img ? "Image" : "FileText"} size={16} color={img ? "#16a34a" : "#2563eb"} />
      </div>
      <div className="mdt-lampiran-chip-info">
        <div className="mdt-lampiran-chip-name">{nama}</div>
        <div className="mdt-lampiran-chip-type">{ext} • Klik untuk preview</div>
      </div>
      <button className="mdt-lampiran-chip-dl" onClick={handleDownload} title="Download">
        <AppIcon name="Download" size={13} />
      </button>
    </div>
  );
}

// ─── Preview Modal ─────────────────────────────────────────────
function PreviewModal({ file, onClose }) {
  if (!file) return null;
  const img = isImage(file.nama);
  const pdf = isPDF(file.nama);
  return (
    <div className="mdt-preview-overlay" onClick={onClose}>
      <div className="mdt-preview-box" onClick={e => e.stopPropagation()}>
        <div className="mdt-preview-header">
          <div className="mdt-preview-filename">{file.nama}</div>
          <div className="mdt-preview-actions">
            <a
              className="mdt-preview-btn primary"
              href={file.url}
              download={file.nama}
              target="_blank"
              rel="noreferrer"
            >
              <AppIcon name="Download" size={13} /> Download
            </a>
            <button className="mdt-preview-btn close" onClick={onClose}>
              <AppIcon name="X" size={13} /> Tutup
            </button>
          </div>
        </div>
        <div className="mdt-preview-body">
          {img ? (
            /* ── Gambar ── */
            <img src={file.url} alt={file.nama} />
          ) : pdf ? (
            /* ── PDF: embed iframe ── */
            <iframe
              src={file.url}
              title={file.nama}
              style={{
                width: "75vw",
                height: "68vh",
                border: "none",
                borderRadius: 8,
              }}
            />
          ) : (
            /* ── File lain: icon + link ── */
            <div className="mdt-preview-file-icon">
              <AppIcon name="FileText" size={56} color="#cbd5e1" />
              <p>{file.nama}</p>
              <a className="mdt-preview-btn primary" href={file.url} target="_blank" rel="noreferrer">
                <AppIcon name="ExternalLink" size={13} /> Buka di Tab Baru
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Item riwayat ──────────────────────────────────────────────
function RiwayatItem({ item }) {
  if (item.tipe === "sistem") {
    return (
      <div className="mdt-sistem-row">
        <div className="mdt-avatar sistem">
          <AppIcon name="ClipboardCheck" variant="sm" />
        </div>
        <div>
          <div className="mdt-sistem-text" dangerouslySetInnerHTML={{ __html: item.teks }} />
          <div className="mdt-sistem-time">{formatTanggal(item.waktu)}</div>
        </div>
      </div>
    );
  }

  const isStaf = item.tipe === "staf";
  const lampiran = parseLampiran(item.isi);
  const isiTeks = lampiran ? null : item.isi;

  return (
    <div className={`mdt-reply-card ${isStaf ? "from-staf" : ""}`}>
      <div className="mdt-reply-header">
        <div className="mdt-reply-author-row">
          <div className={`mdt-avatar ${isStaf ? "staf" : ""}`}>{getInitials(item.nama)}</div>
          <div className="mdt-reply-name">{item.nama}</div>
        </div>
        <div className="mdt-reply-time">{formatTanggal(item.waktu)}</div>
      </div>

      {/* Teks balasan (jika bukan komentar file) */}
      {isiTeks && (
        <div className="mdt-reply-body">{isiTeks}</div>
      )}

      {/* Lampiran — gambar inline atau chip file */}
      {lampiran && (
        <div className="mdt-lampiran-wrap">
          <div className="mdt-lampiran-label">
            <AppIcon name="Paperclip" variant="sm" /> LAMPIRAN
          </div>
          {isImage(lampiran.nama) ? (
            <img
              src={lampiran.url}
              alt={lampiran.nama}
              className="mdt-lampiran-img"
              onError={(e) => { e.target.style.display = "none"; }}
            />
          ) : (
            <a
              href={lampiran.url}
              target="_blank"
              rel="noreferrer"
              className="mdt-file-chip"
              title={`Buka ${lampiran.nama} di tab baru`}
            >
              <div className={`mdt-file-chip-icon ${lampiran.nama.toLowerCase().endsWith(".pdf") ? "mdt-file-chip-pdf" : ""}`}>
                <AppIcon
                  name={lampiran.nama.toLowerCase().endsWith(".pdf") ? "FileText" : "File"}
                  size={15}
                  color={lampiran.nama.toLowerCase().endsWith(".pdf") ? "#dc2626" : "#2563eb"}
                />
              </div>
              <span className="mdt-file-chip-name">{lampiran.nama}</span>
              <span className="mdt-file-chip-ext">{getFileExt(lampiran.nama)}</span>
              <AppIcon name="ExternalLink" size={13} color="#94a3b8" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Komponen utama ───────────────────────────────────────────
export default function MahasiswaDetailTiketPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [tiket, setTiket]       = useState(null);
  const [riwayat, setRiwayat]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const [balasan, setBalasan]   = useState("");
  const [file, setFile]         = useState(null);
  // ★ BARU — menyimpan { nama, url } untuk preview sebelum kirim
  const [selLmp, setSelLmp]     = useState(null);
  const [mengirim, setMengirim] = useState(false);
  const [errKirim, setErrKirim] = useState(null);

  // State untuk preview modal
  const [previewFile, setPreviewFile] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const dataTiket = await ticketService.getTiketById(id);
      setTiket(dataTiket);
      setRiwayat(Array.isArray(dataTiket.komentar) ? dataTiket.komentar : []);
    } catch {
      setError("Gagal memuat data tiket. Coba muat ulang halaman.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleKirim = async () => {
    if (!balasan.trim() && !file) return;
    try {
      setMengirim(true);
      setErrKirim(null);

      // Pisahkan: kirim teks dulu (jika ada), lalu upload file (jika ada)
      if (balasan.trim()) {
        await ticketService.kirimBalasan(id, { isi: balasan });
      }

      if (file) {
        await ticketService.uploadFile(id, file);
      }

      setBalasan("");
      clearFile();
      await fetchData();
    } catch (err) {
      const msg = err?.response?.data?.detail || "Gagal mengirim balasan. Coba lagi.";
      setErrKirim(msg);
    } finally {
      setMengirim(false);
    }
  };

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    // Buat object URL untuk preview lokal sebelum upload
    const url = URL.createObjectURL(f);
    setSelLmp({ nama: f.name, url, isImg: isImage(f.name) });
  };

  // ★ BARU — reset file + lampiran pending sekaligus
  const clearFile = () => {
    setFile(null);
    setSelLmp(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <main className="mdt-main">
          <div className="mdt-loading">⏳ Memuat tiket...</div>
        </main>
      </>
    );
  }

  if (error || !tiket) {
    return (
      <>
        <style>{styles}</style>
        <main className="mdt-main">
          <div className="mdt-loading" style={{ color: "#dc2626" }}>
            {error || "Tiket tidak ditemukan."}
          </div>
        </main>
      </>
    );
  }

  const statusUpper = String(tiket.status || "").toUpperCase();
  const isClosed    = statusUpper === "SELESAI" || statusUpper === "DITUTUP";
  const pillClass   = `pill-${statusUpper}`;

  // ✅ PERBAIKAN: Ambil nama & NIM dari data tiket jika tersedia,
  //    fallback ke useAuth hanya jika backend belum mengembalikan nama_pelapor
  const namaPelapor = tiket.nama_pelapor || user?.nama || "Saya";
  const nimPelapor  = tiket.nim          || user?.nim  || "—";

  return (
    <>
      <style>{styles}</style>
      <PreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />
      <main className="mdt-main">

        {/* Breadcrumb */}
        <div className="mdt-breadcrumb">
          <Link to="/">Beranda</Link>
          <span>›</span>
          <Link to="/tiket/saya">Tiket Saya</Link>
          <span>›</span>
          <strong>{tiket.id}</strong>
        </div>

        {/* Page header */}
        <div className="mdt-page-header">
          <h1>{tiket.subjek || "Detail Tiket"}</h1>
          <div className="mdt-page-header-meta">
            <span className="mdt-ticket-id">{tiket.id}</span>
            <span className="mdt-header-dot" />
            <span className={`mdt-status-pill ${pillClass}`}>{tiket.status}</span>
          </div>
        </div>

        {/* Body */}
        <div className="mdt-body">

          {/* ── Kolom Kiri ── */}
          <div className="mdt-left">

            <Stepper status={tiket.status} />

            {/* Pesan awal — ✅ nama & NIM dari data tiket */}
            <div className="mdt-ticket-card">
              <div className="mdt-ticket-meta">
                <div className="mdt-avatar">{getInitials(namaPelapor)}</div>
                <div>
                  <div className="mdt-ticket-author">{namaPelapor}</div>
                  <div className="mdt-ticket-time">
                    {nimPelapor} &bull; {formatTanggal(tiket.tanggal_dibuat)}
                  </div>
                </div>
              </div>

              {/* ── Badge Topik + Waktu Kejadian ── */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "14px" }}>
                {tiket.kategori_nama && (
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    background: "#eff6ff", color: "#1d4ed8",
                    border: "1px solid #bfdbfe",
                    borderRadius: 6, padding: "3px 10px",
                    fontSize: 12, fontWeight: 700
                  }}>
                    <AppIcon name="Tag" variant="xs" />
                    {tiket.kategori_nama}
                  </span>
                )}
                {tiket.waktu_kejadian && (
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    background: "var(--gray-50)", color: "var(--gray-500)",
                    border: "1px solid var(--gray-200)",
                    borderRadius: 6, padding: "3px 10px",
                    fontSize: 12, fontWeight: 600
                  }}>
                    <AppIcon name="Clock" variant="xs" />
                    Kejadian: {new Date(tiket.waktu_kejadian).toLocaleString("id-ID", {
                      day: "2-digit", month: "short", year: "numeric",
                      hour: "2-digit", minute: "2-digit"
                    })} WIB
                  </span>
                )}
              </div>

              <div className="mdt-ticket-body">{tiket.pengajuan?.deskripsi || tiket.deskripsi || "—"}</div>

              {/* Lampiran dari pengajuan awal */}
              {tiket.pengajuan?.lampiran?.length > 0 && (
                <div className="mdt-lampiran-wrap" style={{ marginTop: 16 }}>
                  <div className="mdt-lampiran-label">
                    <AppIcon name="Paperclip" variant="sm" />
                    LAMPIRAN ({tiket.pengajuan.lampiran.length})
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {tiket.pengajuan.lampiran.map((lmp, idx) => {
                      const url = `${BACKEND_URL}/${lmp.url_file?.replace(/\\/g, "/")}`;
                      return isImage(lmp.nama_file) ? (
                        <img
                          key={idx}
                          src={url}
                          alt={lmp.nama_file}
                          className="mdt-lampiran-img"
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                      ) : (
                        <a
                          key={idx}
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="mdt-file-chip"
                        >
                          <div className={`mdt-file-chip-icon ${lmp.nama_file?.toLowerCase().endsWith(".pdf") ? "mdt-file-chip-pdf" : ""}`}>
                            <AppIcon name="FileText" size={15} color={lmp.nama_file?.toLowerCase().endsWith(".pdf") ? "#dc2626" : "#2563eb"} />
                          </div>
                          <span className="mdt-file-chip-name">{lmp.nama_file}</span>
                          <span className="mdt-file-chip-ext">{getFileExt(lmp.nama_file)}</span>
                          <AppIcon name="ExternalLink" size={13} color="#94a3b8" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Riwayat */}
            <div className="mdt-riwayat-section">
              <div className="mdt-riwayat-title">Riwayat &amp; Tanggapan</div>
              {riwayat.length === 0 ? (
                <div style={{ color: "var(--gray-400)", fontSize: 13, padding: "8px 0" }}>
                  Belum ada tanggapan dari staf.
                </div>
              ) : (
                riwayat.map((item, idx) => <RiwayatItem key={idx} item={item} />)
              )}
            </div>

            {/* Form balasan */}
            {isClosed ? (
              <div className="mdt-closed-notice">
                <AppIcon name="CheckCircle" variant="sm" />
                Tiket ini sudah ditutup. Kamu tidak dapat menambah balasan.
              </div>
            ) : (
              <div className="mdt-form-card">
                <div className="mdt-form-title">Tulis Balasan</div>

                <div className="mdt-form-toolbar">
                  <button className="mdt-toolbar-btn" title="Bold"><strong>B</strong></button>
                  <button className="mdt-toolbar-btn" title="Italic"><em>I</em></button>
                  <button className="mdt-toolbar-btn" title="Underline"><u>U</u></button>
                  <div className="mdt-toolbar-divider" />
                  <button className="mdt-toolbar-btn" title="Bullet list">
                    <AppIcon name="List" variant="sm" />
                  </button>
                  <button className="mdt-toolbar-btn" title="Link">
                    <AppIcon name="Link" variant="sm" />
                  </button>
                  <button className="mdt-toolbar-btn" title="Gambar">
                    <AppIcon name="Image" variant="sm" />
                  </button>
                </div>

                <textarea
                  className="mdt-form-textarea"
                  placeholder="Tambahkan informasi atau lampiran tambahan untuk staf..."
                  value={balasan}
                  onChange={e => setBalasan(e.target.value)}
                />

                <div className="mdt-form-upload-row" onClick={() => fileInputRef.current?.click()}>
                  <AppIcon name="Paperclip" variant="sm" />
                  <span>
                    Lampirkan file atau{" "}
                    <span className="mdt-form-upload-link">pilih berkas</span>
                  </span>
                  {file && (
                    <span style={{
                      marginLeft: "auto", fontSize: 12,
                      color: "#2563eb", fontWeight: 600,
                      maxWidth: 160, overflow: "hidden",
                      textOverflow: "ellipsis", whiteSpace: "nowrap"
                    }}>
                      📎 {file.name}
                    </span>
                  )}
                </div>

                {/* ★ BARU — area preview lampiran sebelum dikirim */}
                {selLmp && (
                  <div className="mdt-form-pending-lampiran">
                    <div className="mdt-form-pending-label">
                      <AppIcon name="Paperclip" variant="sm" />
                      Lampiran akan dikirim
                    </div>
                    <div className="mdt-form-pending-row">
                      <LampiranChip
                        nama={selLmp.nama}
                        url={selLmp.url}
                        onPreview={setPreviewFile}
                      />
                      <button
                        className="mdt-btn-hapus-lampiran"
                        onClick={clearFile}
                        title="Hapus lampiran"
                      >
                        <AppIcon name="X" size={14} />
                      </button>
                    </div>
                  </div>
                )}

                <input
                  type="file" ref={fileInputRef}
                  style={{ display: "none" }} onChange={handleFileChange}
                />

                {errKirim && (
                  <div style={{ padding: "8px 20px", fontSize: 13, color: "#dc2626" }}>
                    {errKirim}
                  </div>
                )}

                <div className="mdt-form-footer">
                  <div className="mdt-status-note">
                    Tiket akan tetap dalam status <em>'{tiket.status}'</em>
                  </div>
                  <div className="mdt-form-actions">
                    <button
                      className="mdt-btn-batal"
                      onClick={() => { setBalasan(""); clearFile(); }}
                    >
                      Batal
                    </button>
                    <button
                      className="mdt-btn-kirim"
                      onClick={handleKirim}
                      disabled={(!balasan.trim() && !file) || mengirim}
                    >
                      {mengirim ? "Mengirim..." : "Kirim Balasan ›"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="mdt-sidebar">

            <div className="mdt-sidebar-card">
              <div className="mdt-sidebar-section-title">Informasi Pemohon</div>
              {tiket.mahasiswa ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
                    <div className="mdt-avatar" style={{ flexShrink: 0 }}>
                      {getInitials(tiket.mahasiswa.nama)}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "var(--gray-900)" }}>
                        {tiket.mahasiswa.nama || "—"}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--gray-400)", fontWeight: 500 }}>
                        {tiket.mahasiswa.nim || "—"}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 8, borderTop: "1px solid var(--gray-100)" }}>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--gray-400)", marginBottom: 2 }}>Email</div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: "var(--gray-700)", wordBreak: "break-all" }}>{tiket.mahasiswa.email || "—"}</div>
                    </div>
                    {tiket.mahasiswa.fakultas && (
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--gray-400)", marginBottom: 2 }}>Fakultas</div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: "var(--gray-700)" }}>{tiket.mahasiswa.fakultas}</div>
                      </div>
                    )}
                    {tiket.mahasiswa.departemen && (
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--gray-400)", marginBottom: 2 }}>Departemen</div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: "var(--gray-700)" }}>{tiket.mahasiswa.departemen}</div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: 13, color: "var(--gray-400)", fontStyle: "italic" }}>
                  Data pemohon tidak tersedia.
                </div>
              )}
            </div>

            <div className="mdt-sidebar-card">
              <div className="mdt-sidebar-section-title">Detail Tiket</div>
              <div className="mdt-detail-rows">
                <div className="mdt-detail-row">
                  <span className="mdt-detail-key">Status</span>
                  <span className={`mdt-status-pill ${pillClass}`}>{tiket.status}</span>
                </div>
                <div className="mdt-detail-row">
                  <span className="mdt-detail-key">Kategori</span>
                  <span className="mdt-badge-kategori">{tiket.kategori_nama || tiket.kategori || "—"}</span>
                </div>
                {tiket.prioritas && tiket.prioritas !== "Normal" && (
                  <div className="mdt-detail-row">
                    <span className="mdt-detail-key">Prioritas</span>
                    <PrioritasPill prioritas={tiket.prioritas} />
                  </div>
                )}
                <div className="mdt-detail-row">
                  <span className="mdt-detail-key">Dibuat</span>
                  <span className="mdt-detail-val" style={{ whiteSpace: "pre-line", textAlign: "right" }}>
                    {formatTanggalPendek(tiket.tanggal_dibuat)}
                  </span>
                </div>
                <div className="mdt-detail-row">
                  <span className="mdt-detail-key">SLA Target</span>
                  <span className="mdt-detail-val">{tiket.sla_target || "24 Jam"}</span>
                </div>
              </div>
            </div>

            <div className="mdt-sidebar-card">
              <div className="mdt-sidebar-section-title">Petugas</div>
              {tiket.nama_staf ? (
                <div className="mdt-petugas-row">
                  <div className="mdt-petugas-avatar">{getInitials(tiket.nama_staf)}</div>
                  <div>
                    <div className="mdt-petugas-name">{tiket.nama_staf}</div>
                    <div className="mdt-petugas-role">
                      {tiket.jabatan_staf || "Staf Akademik"}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mdt-no-petugas">
                  Belum ada petugas yang menangani tiket ini.
                </div>
              )}
            </div>

          </div>
        </div>
      </main>
    </>
  );
}