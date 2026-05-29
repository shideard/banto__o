// frontend/src/pages/staf/StafDetailTiketPage.jsx
import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import ticketService from "../../services/ticketService";
import AppIcon from "../../components/ui/AppIcon";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

const styles = `
  /* ─── Layout utama ─── */
  .dt-main {
    padding: 32px 40px;
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  /* ─── Breadcrumb ─── */
  .dt-breadcrumb {
    font-size: 13px;
    color: var(--gray-500);
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .dt-breadcrumb a {
    color: var(--gray-500);
    text-decoration: none;
  }
  .dt-breadcrumb a:hover { color: #2563eb; }
  .dt-breadcrumb strong { color: var(--gray-700); }
  .dt-breadcrumb span { color: var(--gray-400); }

  /* ─── Page header ─── */
  .dt-page-header {
    margin-bottom: 24px;
  }
  .dt-page-header h1 {
    font-family: 'Fraunces', serif;
    font-size: 28px;
    font-weight: 800;
    color: var(--gray-900);
    margin: 0;
  }

  /* ─── Body: dua kolom ─── */
  .dt-body {
    display: grid;
    grid-template-columns: 1fr 280px;
    gap: 24px;
    align-items: start;
  }

  /* ─── Kolom kiri ─── */
  .dt-left { display: flex; flex-direction: column; gap: 20px; }

  /* ─── Stepper ─── */
  .dt-stepper-card {
    background: var(--white);
    border: 1.5px solid var(--gray-200);
    border-radius: 16px;
    padding: 20px 28px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.02);
  }
  .dt-stepper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
  }
  .dt-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    flex: 1;
    position: relative;
    z-index: 1;
  }
  .dt-step-circle {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 2px solid var(--gray-200);
    background: var(--white);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
    color: var(--gray-400);
    transition: all 0.2s;
  }
  .dt-step-circle.done {
    background: #2563eb;
    border-color: #2563eb;
    color: white;
  }
  .dt-step-circle.active {
    background: white;
    border-color: #2563eb;
    color: #2563eb;
    box-shadow: 0 0 0 4px #dbeafe;
  }
  .dt-step-label {
    font-size: 12px;
    font-weight: 600;
    color: var(--gray-400);
    text-align: center;
  }
  .dt-step-label.done { color: #2563eb; }
  .dt-step-label.active { color: #2563eb; font-weight: 700; }

  /* Garis penghubung */
  .dt-step-line {
    flex: 1;
    height: 2px;
    background: var(--gray-200);
    margin-bottom: 20px;
    position: relative;
    z-index: 0;
  }
  .dt-step-line.done { background: #2563eb; }

  /* ─── Pesan awal tiket ─── */
  .dt-ticket-card {
    background: var(--white);
    border: 1.5px solid var(--gray-200);
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.02);
  }
  .dt-ticket-meta {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }
  .dt-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #2563eb;
    color: white;
    font-size: 13px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .dt-avatar.staf { background: #0a1f5c; }
  .dt-avatar.sistem {
    background: var(--gray-100);
    color: var(--gray-500);
    border: 1.5px solid var(--gray-200);
  }
  .dt-ticket-author {
    font-size: 14px;
    font-weight: 700;
    color: var(--gray-900);
  }
  .dt-ticket-time {
    font-size: 12px;
    color: var(--gray-400);
    font-weight: 500;
  }
  .dt-ticket-body {
    font-size: 14px;
    color: var(--gray-700);
    line-height: 1.7;
    margin-bottom: 16px;
  }

  /* Lampiran */
  .dt-lampiran-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: var(--gray-500);
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .dt-lampiran-thumb {
    width: 80px;
    height: 60px;
    border-radius: 8px;
    object-fit: cover;
    border: 1.5px solid var(--gray-200);
    cursor: pointer;
    transition: opacity 0.15s;
  }
  .dt-lampiran-thumb:hover { opacity: 0.85; }

  /* ─── Riwayat & Tanggapan ─── */
  .dt-riwayat-section { display: flex; flex-direction: column; gap: 12px; }
  .dt-riwayat-title {
    font-size: 16px;
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: 4px;
  }

  /* Baris sistem */
  .dt-sistem-row {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 10px 14px;
    background: var(--gray-50);
    border: 1.5px solid var(--gray-200);
    border-radius: 10px;
  }
  .dt-sistem-row .dt-avatar { width: 28px; height: 28px; font-size: 11px; }
  .dt-sistem-text {
    font-size: 13px;
    color: var(--gray-500);
    line-height: 1.5;
  }
  .dt-sistem-text strong { color: var(--gray-700); }
  .dt-sistem-time {
    font-size: 11px;
    color: var(--gray-400);
    margin-top: 2px;
  }

  /* Kartu balasan */
  .dt-reply-card {
    background: var(--white);
    border: 1.5px solid var(--gray-200);
    border-radius: 14px;
    padding: 18px 20px;
    box-shadow: 0 1px 6px rgba(0,0,0,0.02);
  }
  .dt-reply-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }
  .dt-reply-author-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .dt-reply-name {
    font-size: 14px;
    font-weight: 700;
    color: var(--gray-900);
  }
  .dt-reply-time {
    font-size: 12px;
    color: var(--gray-400);
  }
  .dt-reply-body {
    font-size: 14px;
    color: var(--gray-700);
    line-height: 1.7;
  }
  .dt-reply-img {
    margin-top: 12px;
    width: 160px;
    border-radius: 8px;
    border: 1.5px solid var(--gray-200);
    display: block;
  }

  /* ─── Form tanggapan ─── */
  .dt-form-card {
    background: var(--white);
    border: 1.5px solid var(--gray-200);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0,0,0,0.02);
  }
  .dt-form-title {
    padding: 16px 20px;
    border-bottom: 1.5px solid var(--gray-200);
    font-size: 14px;
    font-weight: 700;
    color: var(--gray-900);
    background: var(--gray-50);
  }
  .dt-form-toolbar {
    display: flex;
    align-items: center;
    gap: 2px;
    padding: 10px 16px;
    border-bottom: 1.5px solid var(--gray-200);
    background: var(--white);
  }
  .dt-toolbar-btn {
    width: 28px;
    height: 28px;
    border: none;
    background: transparent;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
    color: var(--gray-500);
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: all 0.15s;
  }
  .dt-toolbar-btn:hover {
    background: var(--gray-100);
    color: var(--gray-900);
  }
  .dt-toolbar-divider {
    width: 1px;
    height: 18px;
    background: var(--gray-200);
    margin: 0 4px;
  }
  .dt-form-textarea {
    width: 100%;
    min-height: 120px;
    padding: 16px 20px;
    border: none;
    outline: none;
    resize: none;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 14px;
    color: var(--gray-700);
    line-height: 1.7;
    box-sizing: border-box;
  }
  .dt-form-textarea::placeholder { color: var(--gray-400); }
  .dt-form-upload-row {
    padding: 10px 20px;
    border-top: 1.5px solid var(--gray-200);
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: var(--gray-400);
    cursor: pointer;
    transition: background 0.15s;
  }
  .dt-form-upload-row:hover { background: var(--gray-50); }
  .dt-form-upload-link { color: #2563eb; font-weight: 600; text-decoration: none; }
  .dt-form-footer {
    padding: 14px 20px;
    border-top: 1.5px solid var(--gray-200);
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--gray-50);
  }
  .dt-status-note {
    font-size: 12px;
    color: var(--gray-500);
  }
  .dt-status-note em { font-style: normal; font-weight: 600; color: var(--gray-700); }
  .dt-form-actions { display: flex; align-items: center; gap: 10px; }

  .dt-btn-batal {
    background: transparent;
    border: none;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: var(--gray-500);
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 8px;
    transition: all 0.15s;
  }
  .dt-btn-batal:hover { color: var(--gray-700); background: var(--gray-100); }

  .dt-btn-kirim {
    background: #2563eb;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 8px 18px;
    font-size: 13px;
    font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.18s;
  }
  .dt-btn-kirim:hover { background: #1d4ed8; }
  .dt-btn-kirim:disabled { background: #93c5fd; cursor: not-allowed; }

  /* ─── Kolom kanan (sidebar) ─── */
  .dt-sidebar { display: flex; flex-direction: column; gap: 16px; }

  .dt-sidebar-card {
    background: var(--white);
    border: 1.5px solid var(--gray-200);
    border-radius: 14px;
    padding: 18px 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.02);
  }
  .dt-sidebar-section-title {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.7px;
    color: var(--gray-400);
    margin-bottom: 14px;
  }

  /* Informasi Pelapor */
  .dt-pelapor-top {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 14px;
  }
  .dt-pelapor-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #2563eb;
    color: white;
    font-size: 14px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .dt-pelapor-name {
    font-size: 14px;
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: 2px;
  }
  .dt-pelapor-nim {
    font-size: 12px;
    color: var(--gray-500);
    font-weight: 500;
  }
  .dt-sidebar-meta { display: flex; flex-direction: column; gap: 10px; }
  .dt-meta-row {}
  .dt-meta-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--gray-400);
    margin-bottom: 3px;
  }
  .dt-meta-value {
    font-size: 13px;
    font-weight: 500;
    color: var(--gray-700);
  }
  .dt-meta-divider {
    height: 1px;
    background: var(--gray-100);
    margin: 4px 0;
  }

  /* Detail Tiket sidebar */
  .dt-detail-rows { display: flex; flex-direction: column; }
  .dt-detail-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 9px 0;
    border-bottom: 1px solid var(--gray-100);
    font-size: 13px;
  }
  .dt-detail-row:last-child { border-bottom: none; }
  .dt-detail-key { color: var(--gray-500); font-weight: 500; }
  .dt-detail-val { font-weight: 600; color: var(--gray-900); text-align: right; }

  /* Badge kategori */
  .dt-badge-kategori {
    background: #eff6ff;
    color: #1d4ed8;
    border-radius: 6px;
    padding: 3px 10px;
    font-size: 12px;
    font-weight: 700;
  }

  /* Badge prioritas */
  .dt-badge-tinggi {
    color: #dc2626;
    font-weight: 700;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .dt-badge-normal { color: #16a34a; font-weight: 700; font-size: 13px; }

  /* Petugas */
  .dt-petugas-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .dt-petugas-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #e2e8f0;
    color: var(--gray-700);
    font-size: 12px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .dt-petugas-name {
    font-size: 13px;
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: 2px;
  }
  .dt-petugas-role {
    font-size: 11px;
    color: var(--gray-400);
    font-weight: 500;
  }

  /* ─── Loading & error state ─── */
  .dt-loading {
    text-align: center;
    padding: 80px 40px;
    color: var(--gray-400);
    font-size: 14px;
  }


  /* ── Lampiran chip ── */
  .dt-lampiran-wrap { margin-top: 12px; }
  .dt-lampiran-list { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
  .dt-lampiran-chip {
    display: flex; align-items: center; gap: 8px;
    padding: 8px 12px; border-radius: 10px;
    border: 1.5px solid var(--gray-200); background: var(--gray-50);
    cursor: pointer; transition: all 0.18s; max-width: 240px;
  }
  .dt-lampiran-chip:hover { border-color: #93c5fd; background: #eff6ff; }
  .dt-lampiran-chip-icon {
    width: 32px; height: 32px; border-radius: 7px;
    background: #dbeafe; display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .dt-lampiran-chip-img-icon { background: #dcfce7; }
  .dt-lampiran-chip-info { flex: 1; min-width: 0; }
  .dt-lampiran-label {
    font-size: 11px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.6px; color: var(--gray-500); margin-bottom: 6px;
    display: flex; align-items: center; gap: 6px;
  }
  .dt-lampiran-chip-name {
    font-size: 12px; font-weight: 600; color: var(--gray-800);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .dt-lampiran-chip-type { font-size: 11px; color: var(--gray-400); }
  .dt-lampiran-chip-dl {
    width: 26px; height: 26px; border-radius: 6px;
    background: #2563eb; color: white;
    border: none; cursor: pointer; display: flex;
    align-items: center; justify-content: center;
    flex-shrink: 0; transition: background 0.15s;
  }
  .dt-lampiran-chip-dl:hover { background: #1d4ed8; }

  /* ── Preview modal ── */
  .dt-preview-overlay {
    position: fixed; inset: 0; z-index: 999;
    background: rgba(0,0,0,0.75); backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
  }
  .dt-preview-box {
    background: #fff; border-radius: 16px; overflow: hidden;
    max-width: 90vw; max-height: 90vh;
    display: flex; flex-direction: column;
    box-shadow: 0 24px 80px rgba(0,0,0,0.4);
    animation: dtPreviewIn 0.2s ease;
  }
  @keyframes dtPreviewIn {
    from { opacity: 0; transform: scale(0.95); }
    to   { opacity: 1; transform: scale(1); }
  }
  .dt-preview-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 18px; border-bottom: 1.5px solid var(--gray-200); gap: 12px;
  }
  .dt-preview-filename {
    font-size: 13px; font-weight: 700; color: var(--gray-900);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .dt-preview-actions { display: flex; gap: 8px; flex-shrink: 0; }
  .dt-preview-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 12px; border-radius: 8px; border: 1.5px solid var(--gray-200);
    background: var(--white); font-size: 12px; font-weight: 700;
    color: var(--gray-700); cursor: pointer; transition: all 0.15s; text-decoration: none;
  }
  .dt-preview-btn:hover { background: var(--gray-50); }
  .dt-preview-btn.primary { background: #2563eb; color: white; border-color: #2563eb; }
  .dt-preview-btn.primary:hover { background: #1d4ed8; }
  .dt-preview-btn.close { background: #fef2f2; color: #dc2626; border-color: #fecaca; }
  .dt-preview-btn.close:hover { background: #fee2e2; }
  .dt-preview-body {
    flex: 1; overflow: auto;
    display: flex; align-items: center; justify-content: center;
    padding: 20px; background: #f8fafc; min-height: 200px;
  }
  .dt-preview-body img {
    max-width: 100%; max-height: 70vh;
    border-radius: 8px; box-shadow: 0 4px 24px rgba(0,0,0,0.12);
  }
  /* ★ BARU — iframe PDF di modal */
  .dt-preview-body iframe {
    border-radius: 8px;
  }
  .dt-preview-file-icon {
    display: flex; flex-direction: column; align-items: center; gap: 12px; color: var(--gray-400);
  }
  .dt-preview-file-icon p { font-size: 13px; font-weight: 600; color: var(--gray-500); }

  /* ★ BARU — Preview lampiran sebelum dikirim */
  .dt-form-pending-lampiran {
    padding: 12px 20px;
    border-top: 1.5px solid var(--gray-200);
    background: #f0f7ff;
  }
  .dt-form-pending-label {
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
  .dt-form-pending-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .dt-btn-hapus-lampiran {
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
  .dt-btn-hapus-lampiran:hover { background: #fee2e2; }

  /* ── Responsive ── */
  @media (max-width: 1024px) {
    .dt-body { grid-template-columns: 1fr; }
    .dt-sidebar { order: -1; }
    .dt-main { padding: 24px 20px; }
  }
`;

// ─── Helper: inisial nama ─────────────────────────────────────
function getInitials(nama = "") {
  return nama
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || "")
    .join("");
}

// ─── Helper: format tanggal ───────────────────────────────────
function formatTanggal(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }) + ", " + d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";
}

function formatTanggalPendek(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }) + "\n" + d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

// ─── Parse lampiran dari isi komentar ──────────────────────────────
function parseLampiran(isi) {
  if (!isi || !isi.startsWith("[FILE]")) return null;
  const rest = isi.replace(/^\[FILE\]\s*/, "");
  const dashIdx = rest.lastIndexOf(" — ");
  if (dashIdx === -1) {
    const nama = rest.trim();
    return { nama, url: `${BACKEND_URL}/uploads/${nama}` };
  }
  const nama = rest.slice(0, dashIdx).trim();
  const path = rest.slice(dashIdx + 3).trim();
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

// ─── Urutan step ──────────────────────────────────────────────
const STEPS = ["DIBUAT", "DIKLAIM", "DIPROSES", "SELESAI"];

function getStepIndex(status) {
  const s = String(status || "").toUpperCase();
  const idx = STEPS.indexOf(s);
  return idx === -1 ? 0 : idx;
}

// ─── Lampiran chip ─────────────────────────────────────────────────
function LampiranChip({ nama, url, onPreview }) {
  const img = isImage(nama);
  const ext = getFileExt(nama);
  const handleDownload = (e) => {
    e.stopPropagation();
    const a = document.createElement("a");
    a.href = url; a.download = nama;
    a.target = "_blank"; a.rel = "noreferrer";
    a.click();
  };
  return (
    <div className="dt-lampiran-chip" onClick={() => onPreview({ nama, url })} title={`Preview: ${nama}`}>
      <div className={`dt-lampiran-chip-icon ${img ? "dt-lampiran-chip-img-icon" : ""}`}>
        <AppIcon name={img ? "Image" : "FileText"} size={16} color={img ? "#16a34a" : "#2563eb"} />
      </div>
      <div className="dt-lampiran-chip-info">
        <div className="dt-lampiran-chip-name">{nama}</div>
        <div className="dt-lampiran-chip-type">{ext} • Klik untuk preview</div>
      </div>
      <button className="dt-lampiran-chip-dl" onClick={handleDownload} title="Download">
        <AppIcon name="Download" size={13} />
      </button>
    </div>
  );
}

// ─── Preview Modal ────────────────────────────────────────────────
function PreviewModal({ file, onClose }) {
  if (!file) return null;
  const img = isImage(file.nama);
  const pdf = isPDF(file.nama);
  return (
    <div className="dt-preview-overlay" onClick={onClose}>
      <div className="dt-preview-box" onClick={e => e.stopPropagation()}>
        <div className="dt-preview-header">
          <div className="dt-preview-filename">{file.nama}</div>
          <div className="dt-preview-actions">
            <a className="dt-preview-btn primary" href={file.url} download={file.nama} target="_blank" rel="noreferrer">
              <AppIcon name="Download" size={13} /> Download
            </a>
            <button className="dt-preview-btn close" onClick={onClose}>
              <AppIcon name="X" size={13} /> Tutup
            </button>
          </div>
        </div>
        <div className="dt-preview-body">
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
            <div className="dt-preview-file-icon">
              <AppIcon name="FileText" size={56} color="#cbd5e1" />
              <p>{file.nama}</p>
              <a className="dt-preview-btn primary" href={file.url} target="_blank" rel="noreferrer">
                <AppIcon name="ExternalLink" size={13} /> Buka di Tab Baru
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Stepper ─────────────────────────────────────────────────
function Stepper({ status }) {
  const current = getStepIndex(status);
  const labels = ["Dibuat", "Diklaim", "Diproses", "Selesai"];

  return (
    <div className="dt-stepper-card">
      <div className="dt-stepper">
        {labels.map((label, i) => {
          const isDone = i < current;
          const isActive = i === current;
          return (
            <>
              <div className="dt-step" key={label}>
                <div className={`dt-step-circle ${isDone ? "done" : isActive ? "active" : ""}`}>
                  {isDone ? <AppIcon name="Check" variant="sm" /> : i + 1}
                </div>
                <span className={`dt-step-label ${isDone ? "done" : isActive ? "active" : ""}`}>
                  {label}
                </span>
              </div>
              {i < labels.length - 1 && (
                <div className={`dt-step-line ${i < current ? "done" : ""}`} key={`line-${i}`} />
              )}
            </>
          );
        })}
      </div>
    </div>
  );
}

// ─── Satu item riwayat ────────────────────────────────────────
function RiwayatItem({ item, onPreview }) {
  // item.tipe: "sistem" | "staf" | "mahasiswa"
  if (item.tipe === "sistem") {
    return (
      <div className="dt-sistem-row">
        <div className="dt-avatar sistem">
          <AppIcon name="ClipboardCheck" variant="sm" />
        </div>
        <div>
          <div className="dt-sistem-text" dangerouslySetInnerHTML={{ __html: item.teks }} />
          <div className="dt-sistem-time">{formatTanggal(item.waktu)}</div>
        </div>
      </div>
    );
  }

  const isStaf = item.tipe === "staf";
  const lampiran = parseLampiran(item.isi);

  if (lampiran) {
    return (
      <div className="dt-reply-card">
        <div className="dt-reply-header">
          <div className="dt-reply-author-row">
            <div className={`dt-avatar ${isStaf ? "staf" : ""}`}>{getInitials(item.nama)}</div>
            <div><div className="dt-reply-name">{item.nama}</div></div>
          </div>
          <div className="dt-reply-time">{formatTanggal(item.waktu)}</div>
        </div>
        <div className="dt-lampiran-wrap">
          <div className="dt-lampiran-label">
            <AppIcon name="Paperclip" variant="sm" /> LAMPIRAN
          </div>
          <div className="dt-lampiran-list">
            <LampiranChip nama={lampiran.nama} url={lampiran.url} onPreview={onPreview} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dt-reply-card">
      <div className="dt-reply-header">
        <div className="dt-reply-author-row">
          <div className={`dt-avatar ${isStaf ? "staf" : ""}`}>
            {getInitials(item.nama)}
          </div>
          <div>
            <div className="dt-reply-name">{item.nama}</div>
          </div>
        </div>
        <div className="dt-reply-time">{formatTanggal(item.waktu)}</div>
      </div>
      <div className="dt-reply-body">{item.isi}</div>
    </div>
  );
}

// ─── Komponen utama ───────────────────────────────────────────
export default function StafDetailTiketPage() {
  const { id } = useParams();
  // const navigate = useNavigate();
  // const { user } = useAuth();


  const fileInputRef = useRef(null);

  const [tiket, setTiket] = useState(null);
  const [riwayat, setRiwayat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [balasan, setBalasan] = useState("");
  const [file, setFile] = useState(null);
  // ★ BARU — menyimpan { nama, url } untuk preview sebelum kirim
  const [selLmp, setSelLmp] = useState(null);
  const [mengirim, setMengirim] = useState(false);
  const [errKirim, setErrKirim] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);

  // Fetch data tiket + riwayat
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [dataTiket, dataRiwayat] = await Promise.all([
        ticketService.getTiketById(id),
        ticketService.getRiwayat(id),
      ]);
      setTiket(dataTiket);
      setRiwayat(Array.isArray(dataRiwayat) ? dataRiwayat : []);
    } catch {
      setError("Gagal memuat data tiket. Coba muat ulang halaman.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Kirim balasan
  const handleKirim = async () => {
    if (!balasan.trim() && !file) return;
    try {
      setMengirim(true);
      setErrKirim(null);

      // Kirim balasan teks jika ada
      if (balasan.trim()) {
        await ticketService.kirimBalasan(id, {
          isi: balasan,
          role: "Staf"
        });
      }

      // Jika ada file, upload sebagai komentar lampiran
      if (file) {
        await ticketService.uploadFile(id, file);
      }

      setBalasan("");
      clearFile();
      await fetchData();
    } catch {
      setErrKirim("Gagal mengirim balasan. Coba lagi.");
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
        <main className="dt-main">
          <div className="dt-loading">⏳ Memuat tiket...</div>
        </main>
      </>
    );
  }

  if (error || !tiket) {
    return (
      <>
        <style>{styles}</style>
        <main className="dt-main">
          <div className="dt-loading" style={{ color: "#dc2626" }}>
            {error || "Tiket tidak ditemukan."}
          </div>
        </main>
      </>
    );
  }

  // const stepIndex = getStepIndex(tiket.status);

  const statusLabel = tiket.status || "—";
  const isPrioritas = String(tiket.prioritas || "").toLowerCase() === "tinggi";

  return (
    <>
      <style>{styles}</style>
      <PreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />
      <main className="dt-main">

        {/* Breadcrumb */}
        <div className="dt-breadcrumb">
          <Link to="/staff/dashboard">Dashboard</Link>
          <span>›</span>
          <Link to="/staff/antrean-tiket">Antrean Tiket</Link>
          <span>›</span>
          <strong>{tiket.id}</strong>
        </div>

        {/* Page header */}
        <div className="dt-page-header">
          <h1>{tiket.subjek || "Detail Tiket"}</h1>
        </div>

        {/* Body */}
        <div className="dt-body">

          {/* ── Kolom Kiri ── */}
          <div className="dt-left">

            {/* Stepper */}
            <Stepper status={tiket.status} />

            {/* Pesan awal dari mahasiswa */}
            <div className="dt-ticket-card">
              <div className="dt-ticket-meta">
                <div className="dt-avatar">{getInitials(tiket.nama_pelapor || "")}</div>
                <div>
                  <div className="dt-ticket-author">{tiket.nama_pelapor || "Mahasiswa"}</div>
                  <div className="dt-ticket-time">
                    {tiket.nim || "—"} &bull; {formatTanggal(tiket.tanggal_dibuat)}
                  </div>
                </div>
              </div>

              <div className="dt-ticket-body">{tiket.deskripsi || "—"}</div>

              {tiket.lampiran_url && (
                <>
                  <div className="dt-lampiran-label">
                    <AppIcon name="Paperclip" variant="sm" />
                    LAMPIRAN (1)
                  </div>
                  <img
                    src={tiket.lampiran_url}
                    alt="lampiran"
                    className="dt-lampiran-thumb"
                  />
                </>
              )}
            </div>

            {/* Riwayat & Tanggapan */}
            <div className="dt-riwayat-section">
              <div className="dt-riwayat-title">Riwayat &amp; Tanggapan</div>

              {riwayat.length === 0 ? (
                <div style={{ color: "var(--gray-400)", fontSize: 13, padding: "8px 0" }}>
                  Belum ada tanggapan.
                </div>
              ) : (
                riwayat.map((item, idx) => (
                  <RiwayatItem key={idx} item={item} onPreview={setPreviewFile} />
                ))
              )}
            </div>

            {/* Form Tulis Tanggapan */}
            <div className="dt-form-card">
              <div className="dt-form-title">Tulis Tanggapan</div>

              {/* Toolbar rich text (visual only — implementasi rich text bisa dikembangkan) */}
              <div className="dt-form-toolbar">
                <button className="dt-toolbar-btn" title="Bold"><strong>B</strong></button>
                <button className="dt-toolbar-btn" title="Italic"><em>I</em></button>
                <button className="dt-toolbar-btn" title="Underline"><u>U</u></button>
                <div className="dt-toolbar-divider" />
                <button className="dt-toolbar-btn" title="Bullet list">
                  <AppIcon name="List" variant="sm" />
                </button>
                <button className="dt-toolbar-btn" title="Link">
                  <AppIcon name="Link" variant="sm" />
                </button>
                <button className="dt-toolbar-btn" title="Gambar">
                  <AppIcon name="Image" variant="sm" />
                </button>
              </div>

              <textarea
                className="dt-form-textarea"
                placeholder="Ketik pesan atau minta informasi tambahan ke mahasiswa..."
                value={balasan}
                onChange={(e) => setBalasan(e.target.value)}
              />

              {/* Upload */}
              <div className="dt-form-upload-row" onClick={() => fileInputRef.current?.click()}>
                <AppIcon name="Paperclip" variant="sm" />
                <span>
                  Lampirkan file atau{" "}
                  <span className="dt-form-upload-link">pilih berkas</span>
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
                <div className="dt-form-pending-lampiran">
                  <div className="dt-form-pending-label">
                    <AppIcon name="Paperclip" variant="sm" />
                    Lampiran akan dikirim
                  </div>
                  <div className="dt-form-pending-row">
                    <LampiranChip
                      nama={selLmp.nama}
                      url={selLmp.url}
                      onPreview={setPreviewFile}
                    />
                    <button
                      className="dt-btn-hapus-lampiran"
                      onClick={clearFile}
                      title="Hapus lampiran"
                    >
                      <AppIcon name="X" size={14} />
                    </button>
                  </div>
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />

              {errKirim && (
                <div style={{ padding: "8px 20px", fontSize: 13, color: "#dc2626" }}>
                  {errKirim}
                </div>
              )}

              <div className="dt-form-footer">
                <div className="dt-status-note">
                  Tiket akan tetap dalam status <em>'{statusLabel}'</em>
                </div>
                <div className="dt-form-actions">
                  <button
                    className="dt-btn-batal"
                    onClick={() => { setBalasan(""); clearFile(); }}
                  >
                    Batal
                  </button>
                  <button
                    className="dt-btn-kirim"
                    onClick={handleKirim}
                    disabled={(!balasan.trim() && !file) || mengirim}
                  >
                    {mengirim ? "Mengirim..." : "Kirim Tanggapan ›"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Kolom Kanan (Sidebar) ── */}
          <div className="dt-sidebar">

            {/* Informasi Pelapor */}
            <div className="dt-sidebar-card">
              <div className="dt-sidebar-section-title">Informasi Pelapor</div>
              <div className="dt-pelapor-top">
                <div className="dt-pelapor-avatar">
                  {getInitials(tiket.mahasiswa?.nama || tiket.nama_pelapor || "")}
                </div>
                <div>
                  <div className="dt-pelapor-name">
                    {tiket.mahasiswa?.nama || tiket.nama_pelapor || "—"}
                  </div>
                  <div className="dt-pelapor-nim">
                    {tiket.mahasiswa?.nim || tiket.nim || "—"}
                  </div>
                </div>
              </div>
              <div className="dt-sidebar-meta">
                <div className="dt-meta-row">
                  <div className="dt-meta-label">Email</div>
                  <div className="dt-meta-value" style={{ wordBreak: "break-all" }}>
                    {tiket.mahasiswa?.email || tiket.email_pelapor || "—"}
                  </div>
                </div>
                <div className="dt-meta-divider" />
                <div className="dt-meta-row">
                  <div className="dt-meta-label">Fakultas / Departemen</div>
                  <div className="dt-meta-value">
                    {tiket.mahasiswa?.fakultas || tiket.fakultas || "—"}
                    {(tiket.mahasiswa?.departemen || tiket.departemen) && (
                      <div style={{ fontSize: 11, color: "var(--gray-400)", marginTop: 2 }}>
                        {tiket.mahasiswa?.departemen || tiket.departemen}
                      </div>
                    )}
                  </div>
                </div>
                {(tiket.mahasiswa?.telepon) && (
                  <>
                    <div className="dt-meta-divider" />
                    <div className="dt-meta-row">
                      <div className="dt-meta-label">Telepon</div>
                      <div className="dt-meta-value">{tiket.mahasiswa.telepon}</div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Detail Tiket */}
            <div className="dt-sidebar-card">
              <div className="dt-sidebar-section-title">Detail Tiket</div>
              <div className="dt-detail-rows">
                <div className="dt-detail-row">
                  <span className="dt-detail-key">Kategori</span>
                  <span className="dt-badge-kategori">{tiket.kategori || "—"}</span>
                </div>
                <div className="dt-detail-row">
                  <span className="dt-detail-key">Prioritas</span>
                  {isPrioritas ? (
                    <span className="dt-badge-tinggi">
                      ▲ TINGGI
                    </span>
                  ) : (
                    <span className="dt-badge-normal">Normal</span>
                  )}
                </div>
                <div className="dt-detail-row">
                  <span className="dt-detail-key">Dibuat Pada</span>
                  <span className="dt-detail-val" style={{ whiteSpace: "pre-line", textAlign: "right" }}>
                    {formatTanggalPendek(tiket.tanggal_dibuat)}
                  </span>
                </div>
                <div className="dt-detail-row">
                  <span className="dt-detail-key">SLA Target</span>
                  <span className="dt-detail-val">{tiket.sla_target || "24 Jam"}</span>
                </div>
              </div>
            </div>

            {/* Petugas */}
            {tiket.nama_staf && (
              <div className="dt-sidebar-card">
                <div className="dt-sidebar-section-title">Petugas</div>
                <div className="dt-petugas-row">
                  <div className="dt-petugas-avatar">
                    {getInitials(tiket.nama_staf)}
                  </div>
                  <div>
                    <div className="dt-petugas-name">{tiket.nama_staf}</div>
                    <div className="dt-petugas-role">{tiket.jabatan_staf || "Staf Akademik"}</div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </>
  );
}