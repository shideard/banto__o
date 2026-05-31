// frontend/src/pages/staf/StafDetailTiketPage.jsx
import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import ticketService from "../../services/ticketService";
import AppIcon from "../../components/ui/AppIcon";
import { BACKEND_URL } from "../../utils/constants";
import { useAuth } from "../../hooks/useAuth";

const styles = `
  /* ─── Layout utama ─── */
  .dt-main {
    padding: 32px 40px;
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    font-family: var(--font-sans);
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
  .dt-breadcrumb a:hover { color: var(--color-brand); }
  .dt-breadcrumb strong { color: var(--gray-700); }
  .dt-breadcrumb span { color: var(--gray-400); }

  /* ─── Page header ─── */
  .dt-page-header {
    margin-bottom: 24px;
  }
  .dt-page-header h1 {
    font-family: var(--font-display);
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
    background: var(--color-brand);
    border-color: var(--color-brand);
    color: white;
  }
  .dt-step-circle.active {
    background: white;
    border-color: var(--color-brand);
    color: var(--color-brand);
    box-shadow: 0 0 0 4px #dbeafe;
  }
  .dt-step-label {
    font-size: 12px;
    font-weight: 600;
    color: var(--gray-400);
    text-align: center;
  }
  .dt-step-label.done { color: var(--color-brand); }
  .dt-step-label.active { color: var(--color-brand); font-weight: 700; }

  /* Garis penghubung */
  .dt-step-line {
    flex: 1;
    height: 2px;
    background: var(--gray-200);
    margin-bottom: 20px;
    position: relative;
    z-index: 0;
  }
  .dt-step-line.done { background: var(--color-brand); }

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
    background: var(--color-brand);
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
    font-family: var(--font-sans);
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
    font-family: var(--font-sans);
    font-size: 14px;
    color: var(--gray-700);
    line-height: 1.7;
    box-sizing: border-box;
  }
  .dt-form-textarea ul, .dt-reply-body ul { list-style-type: disc; padding-left: 20px; margin: 8px 0; }
  .dt-form-textarea ol, .dt-reply-body ol { list-style-type: decimal; padding-left: 20px; margin: 8px 0; }
  .dt-form-textarea li, .dt-reply-body li { margin-bottom: 4px; display: list-item; }
  .dt-form-textarea[contenteditable]:empty:before { content: attr(placeholder); color: var(--gray-400); cursor: text; }
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
  .dt-form-upload-link { color: var(--color-brand); font-weight: 600; text-decoration: none; }
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
    font-family: var(--font-sans);
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
    background: var(--color-brand);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 8px 18px;
    font-size: 13px;
    font-weight: 700;
    font-family: var(--font-sans);
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
    background: var(--color-brand);
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
    background: var(--gray-200);
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
    background: var(--color-brand); color: white;
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
    background: var(--white); border-radius: 16px; overflow: hidden;
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
  .dt-preview-btn.primary { background: var(--color-brand); color: white; border-color: var(--color-brand); }
  .dt-preview-btn.primary:hover { background: #1d4ed8; }
  .dt-preview-btn.close { background: #fef2f2; color: #dc2626; border-color: #fecaca; }
  .dt-preview-btn.close:hover { background: #fee2e2; }
  .dt-preview-body {
    flex: 1; overflow: auto;
    display: flex; align-items: center; justify-content: center;
    padding: 20px; background: var(--gray-50); min-height: 200px;
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
    color: var(--color-brand);
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

  /* Gambar inline di riwayat */
  .dt-lampiran-img {
    max-width: 100%;
    max-height: 400px;
    border-radius: 10px;
    border: 1.5px solid var(--gray-200);
    display: block;
    margin-top: 8px;
    cursor: pointer;
    transition: opacity 0.15s;
  }
  .dt-lampiran-img:hover { opacity: 0.9; }

  /* Chip untuk file non-gambar di riwayat */
  .dt-file-chip {
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
  .dt-file-chip:hover {
    border-color: #93c5fd;
    background: #eff6ff;
    color: #1d4ed8;
  }
  .dt-file-chip-icon {
    width: 30px;
    height: 30px;
    border-radius: 7px;
    background: #dbeafe;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .dt-file-chip-pdf { background: #fee2e2; }
  .dt-file-chip-name {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .dt-file-chip-ext {
    font-size: 11px;
    font-weight: 700;
    color: var(--gray-400);
    flex-shrink: 0;
  }

  /* ── Responsive ── */
  @media (max-width: 1024px) {
    .dt-body { grid-template-columns: 1fr; }
    .dt-sidebar { order: -1; }
    .dt-main { padding: 24px 20px; }
  }

  /* ── Panel Konfirmasi Klaim ── */
  .dt-klaim-panel {
    background: var(--white);
    border: 1.5px solid var(--gray-200);
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.02);
  }
  .dt-klaim-panel-title {
    font-size: 15px;
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .dt-klaim-panel-desc {
    font-size: 13px;
    color: var(--gray-500);
    line-height: 1.6;
    margin-bottom: 20px;
  }
  .dt-klaim-panel-desc strong { color: var(--gray-700); font-weight: 600; }
  .dt-klaim-actions {
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
  }
  .dt-btn-klaim {
    background: var(--color-brand);
    color: var(--white);
    border: none;
    border-radius: 8px;
    padding: 9px 20px;
    font-size: 13px;
    font-weight: 700;
    font-family: var(--font-sans);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    transition: all 0.18s;
  }
  .dt-btn-klaim:hover:not(:disabled) { background: #1d4ed8; }
  .dt-btn-klaim:disabled { opacity: 0.65; cursor: not-allowed; }

  .dt-btn-tolak {
    background: var(--white);
    color: #dc2626;
    border: 1.5px solid #fecaca;
    border-radius: 8px;
    padding: 9px 20px;
    font-size: 13px;
    font-weight: 700;
    font-family: var(--font-sans);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    transition: all 0.18s;
  }
  .dt-btn-tolak:hover:not(:disabled) { background: #fef2f2; }
  .dt-btn-tolak:disabled { opacity: 0.65; cursor: not-allowed; }

  /* ── Form Alasan Tolak ── */
  .dt-tolak-form {
    margin-top: 16px;
    padding: 16px;
    background: #fef2f2;
    border: 1.5px solid #fecaca;
    border-radius: 12px;
  }
  .dt-tolak-form-label {
    font-size: 12px;
    font-weight: 700;
    color: #991b1b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
  }
  .dt-tolak-textarea {
    width: 100%;
    min-height: 90px;
    border: 1.5px solid #fecaca;
    border-radius: 8px;
    padding: 10px 14px;
    font-family: var(--font-sans);
    font-size: 13px;
    color: var(--gray-700);
    line-height: 1.6;
    resize: vertical;
    box-sizing: border-box;
    background: var(--white);
    outline: none;
    transition: border-color 0.2s;
  }
  .dt-tolak-textarea:focus { border-color: #dc2626; }
  .dt-tolak-textarea::placeholder { color: var(--gray-400); }
  .dt-tolak-actions {
    display: flex;
    gap: 8px;
    margin-top: 10px;
    justify-content: flex-end;
  }
  .dt-btn-kirim-tolak {
    background: #dc2626;
    color: var(--white);
    border: none;
    border-radius: 8px;
    padding: 8px 16px;
    font-size: 13px;
    font-weight: 700;
    font-family: var(--font-sans);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: all 0.18s;
  }
  .dt-btn-kirim-tolak:hover:not(:disabled) { background: #b91c1c; }
  .dt-btn-kirim-tolak:disabled { opacity: 0.65; cursor: not-allowed; }
  .dt-btn-batal-tolak {
    background: transparent;
    color: var(--gray-500);
    border: 1.5px solid var(--gray-200);
    border-radius: 8px;
    padding: 8px 14px;
    font-size: 13px;
    font-weight: 600;
    font-family: var(--font-sans);
    cursor: pointer;
    transition: all 0.18s;
  }
  .dt-btn-batal-tolak:hover { background: var(--gray-50); color: var(--gray-700); }

  /* ── Panel Mulai Proses ── */
  .dt-proses-panel {
    background: #fefce8;
    border: 1.5px solid #fde68a;
    border-radius: 14px;
    padding: 18px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }
  .dt-proses-panel-info {
    font-size: 13px;
    color: #92400e;
    line-height: 1.5;
  }
  .dt-proses-panel-info strong {
    display: block;
    font-size: 14px;
    font-weight: 700;
    color: #78350f;
    margin-bottom: 2px;
  }
  .dt-btn-mulai-proses {
    background: #d97706;
    color: var(--white);
    border: none;
    border-radius: 8px;
    padding: 9px 18px;
    font-size: 13px;
    font-weight: 700;
    font-family: var(--font-sans);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    white-space: nowrap;
    transition: all 0.18s;
    flex-shrink: 0;
  }
  .dt-btn-mulai-proses:hover:not(:disabled) { background: #b45309; }
  .dt-btn-mulai-proses:disabled { opacity: 0.65; cursor: not-allowed; }

  /* ── Input Waktu (datetime-local) ── */
  .dt-waktu-row {
    padding: 10px 20px;
    border-top: 1.5px solid var(--gray-200);
    display: flex;
    align-items: center;
    gap: 10px;
    background: var(--gray-50);
    flex-wrap: wrap;
  }
  .dt-waktu-label {
    font-size: 12px;
    font-weight: 700;
    color: var(--gray-500);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .dt-waktu-input {
    border: 1.5px solid var(--gray-200);
    border-radius: 8px;
    padding: 6px 12px;
    font-family: var(--font-sans);
    font-size: 13px;
    color: var(--gray-700);
    background: var(--white);
    outline: none;
    transition: border-color 0.2s;
    cursor: pointer;
  }
  .dt-waktu-input:focus { border-color: var(--color-brand); }
  .dt-waktu-hint {
    font-size: 11px;
    color: var(--gray-400);
    flex: 1;
  }

  /* ── Tombol Tandai Selesai ── */
  .dt-btn-selesai {
    background: #16a34a;
    color: var(--white);
    border: none;
    border-radius: 8px;
    padding: 8px 16px;
    font-size: 13px;
    font-weight: 700;
    font-family: var(--font-sans);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: all 0.18s;
  }
  .dt-btn-selesai:hover:not(:disabled) { background: #15803d; }
  .dt-btn-selesai:disabled { opacity: 0.65; cursor: not-allowed; }

  /* ── Notice tiket tertutup ── */
  .dt-closed-notice {
    padding: 16px 20px;
    border-radius: 14px;
    font-size: 13px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* ── Error aksi ── */
  .dt-err-aksi {
    padding: 10px 16px;
    background: #fef2f2;
    border: 1.5px solid #fecaca;
    border-radius: 10px;
    font-size: 13px;
    color: #dc2626;
    display: flex;
    align-items: center;
    gap: 8px;
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
  let dateStr = iso;
  if (!dateStr.endsWith('Z') && !dateStr.includes('+')) dateStr += 'Z';
  const d = new Date(dateStr);
  return (
    d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) +
    ", " + d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB"
  );
}

function formatTanggalPendek(iso) {
  if (!iso) return "—";
  let dateStr = iso;
  if (!dateStr.endsWith('Z') && !dateStr.includes('+')) dateStr += 'Z';
  const d = new Date(dateStr);
  return (
    d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) +
    "\n" + d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
  );
}

// ─── Helper Prioritas ───────────────────────────────────────────
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
        <AppIcon name={img ? "Image" : "FileText"} size={16} color={img ? "#16a34a" : "var(--color-brand)"} />
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

function formatMarkdownLike(text) {
  if (!text) return { __html: "" };
  let res = text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/__(.*?)__/g, "<u>$1</u>")
    .replace(/\[(.*?)\]\((.*?)\)/g, "<a href='$2' target='_blank' rel='noreferrer'>$1</a>");
    
  res = res.replace(/^[*-]\s+(.*)$/gm, "<ul style='padding-left:20px;margin:0'><li>$1</li></ul>");
  res = res.replace(/\n/g, "<br />");
  return { __html: res };
}

// ─── Satu item riwayat ──────────────────────────────────────────────
function RiwayatItem({ item }) {
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
  const isiTeks = lampiran ? null : item.isi;

  return (
    <div className="dt-reply-card">
      <div className="dt-reply-header">
        <div className="dt-reply-author-row">
          <div className={`dt-avatar ${isStaf ? "staf" : ""}`}>
            {getInitials(item.nama_penulis || item.role)}
          </div>
          <div>
            <div className="dt-reply-name">
            {item.nama_penulis || item.role} <span style={{ fontSize: 12, fontWeight: "normal", color: "var(--gray-500)" }}>({item.role === "Staff Administrasi" ? "Staf" : "Mahasiswa"})</span>
          </div>
          </div>
        </div>
        <div className="dt-reply-time">{formatTanggal(item.waktu)}</div>
      </div>

      {/* Teks balasan (jika bukan komentar file) */}
      {isiTeks && (
        <div className="dt-reply-body" dangerouslySetInnerHTML={formatMarkdownLike(isiTeks)} />
      )}

      {/* Lampiran — gambar inline atau chip file */}
      {lampiran && (
        <div className="dt-lampiran-wrap">
          <div className="dt-lampiran-label">
            <AppIcon name="Paperclip" variant="sm" /> LAMPIRAN
          </div>
          {isImage(lampiran.nama) ? (
            <img
              src={lampiran.url}
              alt={lampiran.nama}
              className="dt-lampiran-img"
              onError={(e) => { e.target.style.display = "none"; }}
            />
          ) : (
            <a
              href={lampiran.url}
              target="_blank"
              rel="noreferrer"
              className="dt-file-chip"
              title={`Buka ${lampiran.nama} di tab baru`}
            >
              <div className={`dt-file-chip-icon ${lampiran.nama.toLowerCase().endsWith(".pdf") ? "dt-file-chip-pdf" : ""}`}>
                <AppIcon
                  name={lampiran.nama.toLowerCase().endsWith(".pdf") ? "FileText" : "File"}
                  size={15}
                  color={lampiran.nama.toLowerCase().endsWith(".pdf") ? "#dc2626" : "var(--color-brand)"}
                />
              </div>
              <span className="dt-file-chip-name">{lampiran.nama}</span>
              <span className="dt-file-chip-ext">{getFileExt(lampiran.nama)}</span>
              <AppIcon name="ExternalLink" size={13} color="var(--gray-400)" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}


// ─── Komponen utama ───────────────────────────────────────────
export default function StafDetailTiketPage() {
  const { id } = useParams();
  const { user } = useAuth(); // UNCOMMENTED

  const fileInputRef = useRef(null);
  const editorRef = useRef(null);

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

  const handleFormat = (type) => {
    if (type === "Gambar") {
      fileInputRef.current?.click();
      return;
    }
    
    editorRef.current?.focus();
    
    if (type === "Link") {
      const url = prompt("Masukkan URL link:", "https://");
      if (url) {
        document.execCommand("createLink", false, url);
        setBalasan(editorRef.current?.innerHTML || "");
      }
      return;
    }
    
    const cmdMap = { B: "bold", I: "italic", U: "underline", List: "insertUnorderedList" };
    if (cmdMap[type]) {
      document.execCommand(cmdMap[type], false, null);
      setBalasan(editorRef.current?.innerHTML || "");
    }
  };

  // ── State baru untuk alur klaim/tolak/proses/selesai ──
  const [showTolakForm, setShowTolakForm] = useState(false);
  const [alasanTolak, setAlasanTolak]     = useState("");
  const [prosesKlaim, setProsesKlaim]     = useState(false);
  const [prosesTolak, setProsesTolak]     = useState(false);
  const [prosesProses, setProsesProses]   = useState(false);
  const [prosesSelesai, setProsesSelesai] = useState(false);
  const [errAksi, setErrAksi]             = useState(null);

  // Waktu komentar — input datetime-local dari user
  const [waktuKomentar, setWaktuKomentar] = useState("");

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
      if (Array.isArray(dataRiwayat)) {
         dataRiwayat.sort((a, b) => new Date(a.waktu) - new Date(b.waktu));
         setRiwayat(dataRiwayat);
      } else {
         setRiwayat([]);
      }
    } catch {
      setError("Gagal memuat data tiket. Coba muat ulang halaman.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Handler: Klaim Tiket ──
  const handleKlaim = async () => {
    try {
      setProsesKlaim(true);
      setErrAksi(null);
      await ticketService.claimTiket(tiket.id, { staf_id: user.id });
      // Otomatis lanjut ke DIPROSES agar staf tidak perlu klik dua kali
      await ticketService.mulaiProses(tiket.id);
      await fetchData();
    } catch (err) {
      setErrAksi(err?.response?.data?.detail || "Gagal mengklaim tiket. Coba lagi.");
    } finally {
      setProsesKlaim(false);
    }
  };

  // ── Handler: Tolak Tiket ──
  const handleTolak = async () => {
    if (!alasanTolak.trim()) {
      setErrAksi("Alasan penolakan wajib diisi.");
      return;
    }
    try {
      setProsesTolak(true);
      setErrAksi(null);
      await ticketService.tolakTiket(tiket.id, alasanTolak.trim());
      await fetchData();
      setShowTolakForm(false);
      setAlasanTolak("");
    } catch (err) {
      setErrAksi(err?.response?.data?.detail || "Gagal menolak tiket. Coba lagi.");
    } finally {
      setProsesTolak(false);
    }
  };

  // ── Handler: Mulai Proses ──
  const handleMulaiProses = async () => {
    try {
      setProsesProses(true);
      setErrAksi(null);
      await ticketService.mulaiProses(tiket.id);
      await fetchData();
    } catch (err) {
      setErrAksi(err?.response?.data?.detail || "Gagal memproses tiket. Coba lagi.");
    } finally {
      setProsesProses(false);
    }
  };

  // ── Handler: Tandai Selesai ──
  const handleSelesai = async () => {
    try {
      setProsesSelesai(true);
      setErrAksi(null);
      await ticketService.updateStatus(tiket.id, {
        new_status: "SELESAI",
        catatan: "Tiket telah diselesaikan oleh staf.",
      });
      await fetchData();
    } catch (err) {
      setErrAksi(err?.response?.data?.detail || "Gagal menandai selesai. Coba lagi.");
    } finally {
      setProsesSelesai(false);
    }
  };

  // ── Handler: Kirim Balasan (termasuk waktu komentar) ──
  const handleKirim = async () => {
    if (!balasan.trim() && !file) return;
    try {
      setMengirim(true);
      setErrKirim(null);

      // Sematkan prefix waktu jika staf mengisi datetime
      const isiDenganWaktu = waktuKomentar
        ? `[${new Date(waktuKomentar).toLocaleString("id-ID", {
            day: "2-digit", month: "short", year: "numeric",
            hour: "2-digit", minute: "2-digit"
          })} WIB]\n${balasan.trim()}`
        : balasan.trim();

      if (isiDenganWaktu) {
        await ticketService.kirimBalasan(id, {
          isi: isiDenganWaktu,
          role: "Staf"
        });
      }

      if (file) {
        await ticketService.uploadFile(id, file);
      }

      setBalasan("");
      if (editorRef.current) editorRef.current.innerHTML = "";
      setWaktuKomentar("");
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

            {/* ── Panel Konfirmasi Klaim (tampil saat status DIBUAT) ── */}
            {tiket.status === "DIBUAT" && (
              <div className="dt-klaim-panel">
                <div className="dt-klaim-panel-title">
                  <AppIcon name="ClipboardCheck" variant="sm" />
                  Konfirmasi Pengambilan Tiket
                </div>
                <div className="dt-klaim-panel-desc">
                  Anda sudah membaca detail tiket ini. Apakah Anda ingin mengklaim dan menangani tiket ini?
                  Jika diklaim, tiket akan masuk ke <strong>Tugas Saya</strong> dan tidak ada di antrean lagi.
                </div>

                {errAksi && (
                  <div className="dt-err-aksi" style={{ marginBottom: 14 }}>
                    <AppIcon name="AlertCircle" variant="sm" /> {errAksi}
                  </div>
                )}

                <div className="dt-klaim-actions">
                  <button
                    className="dt-btn-klaim"
                    onClick={handleKlaim}
                    disabled={prosesKlaim}
                  >
                    <AppIcon name="CheckCircle" variant="sm" />
                    {prosesKlaim ? "Mengklaim..." : "Ya, Klaim Tiket Ini"}
                  </button>
                  <button
                    className="dt-btn-tolak"
                    onClick={() => { setShowTolakForm(v => !v); setErrAksi(null); }}
                    disabled={prosesKlaim || prosesTolak}
                  >
                    <AppIcon name="XCircle" variant="sm" />
                    Tolak Tiket
                  </button>
                </div>

                {/* Form alasan penolakan */}
                {showTolakForm && (
                  <div className="dt-tolak-form">
                    <div className="dt-tolak-form-label">Alasan Penolakan *</div>
                    <textarea
                      className="dt-tolak-textarea"
                      placeholder="Jelaskan alasan penolakan tiket ini kepada mahasiswa..."
                      value={alasanTolak}
                      onChange={e => { setAlasanTolak(e.target.value); setErrAksi(null); }}
                      rows={3}
                    />
                    {errAksi && (
                      <div style={{ fontSize: 12, color: "#dc2626", marginTop: 6 }}>
                        {errAksi}
                      </div>
                    )}
                    <div className="dt-tolak-actions">
                      <button
                        className="dt-btn-batal-tolak"
                        onClick={() => { setShowTolakForm(false); setAlasanTolak(""); setErrAksi(null); }}
                        disabled={prosesTolak}
                      >
                        Batal
                      </button>
                      <button
                        className="dt-btn-kirim-tolak"
                        onClick={handleTolak}
                        disabled={!alasanTolak.trim() || prosesTolak}
                      >
                        <AppIcon name="Send" variant="sm" />
                        {prosesTolak ? "Mengirim..." : "Kirim Penolakan"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Panel Mulai Proses (tampil saat status DIKLAIM) ── */}
            {tiket.status === "DIKLAIM" && (
              <div className="dt-proses-panel">
                <div className="dt-proses-panel-info">
                  <strong>Tiket sudah Anda klaim</strong>
                  Siap untuk mulai ditangani? Klik tombol di samping untuk mengubah status menjadi DIPROSES
                  dan mengaktifkan form tanggapan.
                </div>
                {errAksi && (
                  <div style={{ width: "100%", fontSize: 12, color: "#dc2626" }}>{errAksi}</div>
                )}
                <button
                  className="dt-btn-mulai-proses"
                  onClick={handleMulaiProses}
                  disabled={prosesProses}
                >
                  <AppIcon name="Play" variant="sm" />
                  {prosesProses ? "Memproses..." : "Mulai Proses →"}
                </button>
              </div>
            )}

            {/* Pesan awal dari mahasiswa */}
            <div className="dt-ticket-card">
              <div className="dt-ticket-meta">
                <div className="dt-avatar">{getInitials(tiket.mahasiswa?.nama || tiket.nama_pelapor || "")}</div>
                <div>
                  <div className="dt-ticket-author">Pengirim: {tiket.mahasiswa?.nama || tiket.nama_pelapor || "Mahasiswa"}</div>
                  <div className="dt-ticket-time">
                    {tiket.mahasiswa?.nim || tiket.nim || "—"} &bull; {formatTanggal(tiket.tanggal_dibuat)}
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

              <div className="dt-ticket-body">{tiket.pengajuan?.deskripsi || tiket.deskripsi || "—"}</div>

              {/* Lampiran dari pengajuan awal */}
              {tiket.pengajuan?.lampiran?.length > 0 && (
                <div className="dt-lampiran-wrap" style={{ marginTop: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", margin: "24px 0 16px" }}>
                    <div style={{ flex: 1, height: "1px", background: "var(--gray-200)" }} />
                    <div style={{ padding: "0 16px", fontSize: 11, fontWeight: 700, color: "var(--gray-400)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Lampiran dari {tiket.mahasiswa?.nama || tiket.nama_pelapor || "Mahasiswa"}
                    </div>
                    <div style={{ flex: 1, height: "1px", background: "var(--gray-200)" }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {tiket.pengajuan.lampiran.map((lmp, idx) => {
                      const url = `${BACKEND_URL}/${lmp.url_file?.replace(/\\/g, "/")}`;
                      return isImage(lmp.nama_file) ? (
                        <img
                          key={idx}
                          src={url}
                          alt={lmp.nama_file}
                          className="dt-lampiran-img"
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                      ) : (
                        <a
                          key={idx}
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="dt-file-chip"
                        >
                          <div className={`dt-file-chip-icon ${lmp.nama_file?.toLowerCase().endsWith(".pdf") ? "dt-file-chip-pdf" : ""}`}>
                            <AppIcon name="FileText" size={15} color={lmp.nama_file?.toLowerCase().endsWith(".pdf") ? "#dc2626" : "var(--color-brand)"} />
                          </div>
                          <span className="dt-file-chip-name">{lmp.nama_file}</span>
                          <span className="dt-file-chip-ext">{getFileExt(lmp.nama_file)}</span>
                          <AppIcon name="ExternalLink" size={13} color="var(--gray-400)" />
                        </a>
                      );
                    })}
                  </div>
                </div>
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
                  <RiwayatItem key={idx} item={item} />
                ))
              )}
            </div>

            {/* Form Tulis Tanggapan — hanya tampil saat status membolehkan komentar */}
            {(tiket.status === "DIPROSES" || tiket.status === "REVISI") ? (
              <div className="dt-form-card">
                <div className="dt-form-title">Tulis Tanggapan</div>

                {/* Toolbar rich text (visual only) */}
                <div className="dt-form-toolbar">
                  <button className="dt-toolbar-btn" title="Bold" onClick={() => handleFormat("B")}><strong>B</strong></button>
                  <button className="dt-toolbar-btn" title="Italic" onClick={() => handleFormat("I")}><em>I</em></button>
                  <button className="dt-toolbar-btn" title="Underline" onClick={() => handleFormat("U")}><u>U</u></button>
                  <div className="dt-toolbar-divider" />
                  <button className="dt-toolbar-btn" title="Bullet list" onClick={() => handleFormat("List")}>
                    <AppIcon name="List" variant="sm" />
                  </button>
                  <button className="dt-toolbar-btn" title="Link" onClick={() => handleFormat("Link")}>
                    <AppIcon name="Link" variant="sm" />
                  </button>
                  <button className="dt-toolbar-btn" title="Gambar" onClick={() => handleFormat("Gambar")}>
                    <AppIcon name="Image" variant="sm" />
                  </button>
                </div>

                <div
                  ref={editorRef}
                  className="dt-form-textarea"
                  contentEditable
                  suppressContentEditableWarning
                  placeholder="Ketik pesan atau minta informasi tambahan ke mahasiswa..."
                  onInput={e => setBalasan(e.currentTarget.innerHTML)}
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
                      color: "var(--color-brand)", fontWeight: 600,
                      maxWidth: 160, overflow: "hidden",
                      textOverflow: "ellipsis", whiteSpace: "nowrap"
                    }}>
                      📎 {file.name}
                    </span>
                  )}
                </div>

                {/* Preview lampiran sebelum dikirim */}
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

                {/* Input waktu komentar */}
                <div className="dt-waktu-row">
                  <span className="dt-waktu-label">
                    <AppIcon name="Clock" variant="sm" /> Waktu Respons
                  </span>
                  <input
                    type="datetime-local"
                    className="dt-waktu-input"
                    value={waktuKomentar}
                    max={new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
                    onChange={e => setWaktuKomentar(e.target.value)}
                  />
                  <span className="dt-waktu-hint">Opsional — kosongkan untuk waktu sekarang</span>
                </div>

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
                      onClick={() => { 
                        setBalasan(""); 
                        if (editorRef.current) editorRef.current.innerHTML = "";
                        clearFile(); 
                        setWaktuKomentar(""); 
                      }}
                    >
                      Batal
                    </button>

                    {/* Tombol Tandai Selesai — hanya saat DIPROSES */}
                    {tiket.status === "DIPROSES" && (
                      <button
                        className="dt-btn-selesai"
                        onClick={handleSelesai}
                        disabled={prosesSelesai || mengirim}
                      >
                        <AppIcon name="CheckCircle" variant="sm" />
                        {prosesSelesai ? "Menyimpan..." : "Tandai Selesai"}
                      </button>
                    )}

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
            ) : tiket.status === "SELESAI" ? (
              <div className="dt-closed-notice" style={{ background: "#f0fdf4", border: "1.5px solid #bbf7d0", color: "#15803d", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <AppIcon name="CheckCircle" variant="sm" />
                  Tiket ini sudah selesai ditangani.
                </div>
                <Link to="/staff/dashboard" style={{ fontSize: 13, fontWeight: 600, color: "#15803d", textDecoration: "underline" }}>Kembali ke Dashboard</Link>
              </div>
            ) : tiket.status === "DITOLAK" ? (
              <div className="dt-closed-notice" style={{ background: "#fef2f2", border: "1.5px solid #fecaca", color: "#dc2626", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <AppIcon name="XCircle" variant="sm" />
                  Tiket ini telah ditolak.
                </div>
                <Link to="/staff/dashboard" style={{ fontSize: 13, fontWeight: 600, color: "#dc2626", textDecoration: "underline" }}>Kembali ke Dashboard</Link>
              </div>
            ) : null /* DIBUAT dan DIKLAIM — panel klaim/proses yang ditampilkan */ }
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
                  <span className="dt-detail-key">Topik</span>
                  {tiket.kategori_nama
                    ? <span style={{ background: "#eff6ff", color: "#1d4ed8", borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 700 }}>
                        {tiket.kategori_nama}
                      </span>
                    : <span style={{ color: "var(--gray-400)" }}>—</span>
                  }
                </div>
                {tiket.waktu_kejadian && (
                  <div className="dt-detail-row">
                    <span className="dt-detail-key">Waktu Kejadian</span>
                    <span style={{ fontWeight: 600, color: "var(--gray-900)", fontSize: 12, textAlign: "right", display: "block" }}>
                      {new Date(tiket.waktu_kejadian).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}<br/>
                      {new Date(tiket.waktu_kejadian).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                )}
                <div className="dt-detail-row">
                  <span className="dt-detail-key">Prioritas</span>
                  <PrioritasPill prioritas={tiket.prioritas || "Normal"} />
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
            {(tiket.staf_nama || tiket.staf?.nama) && (
              <div className="dt-sidebar-card">
                <div className="dt-sidebar-section-title">Petugas</div>
                <div className="dt-petugas-row">
                  <div className="dt-petugas-avatar">
                    {getInitials(tiket.staf_nama || tiket.staf?.nama)}
                  </div>
                  <div>
                    <div className="dt-petugas-name">{tiket.staf_nama || tiket.staf?.nama}</div>
                    <div className="dt-petugas-role">{tiket.jabatan_staf || "Staf Administrasi"}</div>
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