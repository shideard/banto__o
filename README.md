# BantO__O — IPB Help Center 🐼

**BantO__O** adalah sebuah Sistem Layanan Tiket Pengaduan dan Bantuan Akademik untuk mahasiswa IPB University. Aplikasi ini dirancang untuk memfasilitasi komunikasi antara mahasiswa dan staf administrasi kampus dalam menyelesaikan permasalahan akademik maupun non-akademik.

## Oleh:
- Mutia Saniya Rahma (G6401231002): Project Manager 2, Frontend Developer, UI/UX Designer
- Tiska Walida Nafisa (G6401231008): Project Manager 1, UI/UX Designer, Frontend Developer
- Deshi Ardiani (G6401231018): Backend Developer, Database

## ✨ Fitur Utama

### 🎓 Untuk Mahasiswa
- **Buat Tiket Baru:** Mengajukan pertanyaan, keluhan, atau permintaan bantuan akademik lengkap dengan lampiran file pendukung.
- **Daftar Tiket Saya:** Memantau status tiket (Menunggu, Diproses, Revisi, Selesai, atau Ditolak).
- **Balas & Diskusi:** Berkomunikasi dua arah dengan staf terkait tiket yang diajukan.
- **Chatbot AI Pintar:** Asisten virtual yang siap membantu menjawab pertanyaan umum seputar akademik IPB.

### 🏢 Untuk Staf Administrasi
- **Antrean Tiket Terpusat:** Melihat seluruh tiket masuk dari mahasiswa yang belum diklaim.
- **Manajemen Tiket (Klaim/Tolak):** Mengambil alih tiket yang relevan dengan tugasnya atau menolak tiket yang tidak sesuai.
- **Penanganan Masalah:** Membalas pesan mahasiswa, meminta revisi, dan menutup tiket jika masalah sudah terselesaikan.

## 🛠️ Tech Stack

**Frontend:**
- React 19 (Vite)
- Tailwind CSS v4
- Axios
- Lucide React (Icons)

**Backend:**
- FastAPI (Python)
- SQLAlchemy (ORM)
- Pydantic
- SQLite (Local Dev) / PostgreSQL (Production)

## 🚀 Panduan Menjalankan Secara Lokal

Pastikan komputer kamu sudah ter-install **Node.js** dan **Python**.

### 1. Menjalankan Backend (FastAPI)
```bash
cd backend
# Buat virtual environment (opsional namun disarankan)
python -m venv venv
# Aktifkan venv (Windows: venv\Scripts\activate, Mac/Linux: source venv/bin/activate)

# Install semua requirements
pip install -r requirements.txt

# Menjalankan server backend
uvicorn app.main:app --reload
```
Backend akan berjalan di `http://localhost:8000`.

### 2. Menjalankan Frontend (React/Vite)
Buka terminal baru:
```bash
cd frontend

# Install dependencies
npm install

# Menjalankan development server
npm run dev
```
Frontend akan berjalan di `http://localhost:5173`.

## 🔗 Deployment Links
- Frontend: https://banto--o.vercel.app
- Backend: https://bantoo-production.up.railway.app

## 🔐 Akun Testing / Demo

Untuk keperluan uji coba, kamu dapat login menggunakan akun berikut:

### 🎓 Akun Mahasiswa
- **E-mail:** `iqbal@apps.ipb.ac.id`
- **Kata Sandi:** `iqbal321`

### 🏢 Akun Staf Admin
- **E-mail:** `iqbal@ipb.ac.id`
- **Kata Sandi:** `iqbalstaf`

---
*Dibuat untuk memudahkan civitas akademika IPB University sekaligus pemenuhan tugas akhir mata kuiah Analisis Desain Sistem, Ilmu Komputer IPB University.*
