# BANTO__O - Frontend

Frontend aplikasi sistem tiket untuk layanan akademik IPB. Aplikasi ini dibangun menggunakan React + Vite + Tailwind CSS.

## Teknologi yang Digunakan

- React 19
- Vite
- Tailwind CSS 4
- React Router DOM 7
- Axios
- Lucide React (Icons)

## Cara Menjalankan Project

### Prasyarat
- Node.js (versi terbaru)
- npm

### Langkah-langkah Instalasi

1. Masuk ke direktori frontend:
```bash
cd frontend
```

2. Install dependensi:
```bash
npm install
```

3. Jalankan server development:
```bash
npm run dev
```

4. Aplikasi akan berjalan di `http://localhost:5173/`

### Build untuk Production

```bash
npm run build
```

### Preview Build Production

```bash
npm run preview
```

## Cara Menjalankan Backend

1. Masuk ke direktori backend:
```bash
cd backend
```

2. Aktifkan virtual environment:
```bash
.venv\Scripts\Activate.ps1
```

3. Jalankan server FastAPI:
```bash
uvicorn app.main:app --reload
```

## Cara Menyimpan Perubahan ke GitHub

```bash
git add (apa yang diubah)
git commit -m "beri komentar"
git push
```

---

## Dokumentasi Fitur Frontend

Aplikasi BANTO__O memiliki dua role utama: **Mahasiswa** dan **Staf**. Berikut adalah dokumentasi fitur untuk masing-masing role.

### 1. Role Mahasiswa

Fitur yang dapat diakses oleh Mahasiswa:

#### 1.1 Autentikasi
- **Login**: Masuk ke akun mahasiswa
  
  ![Login Mahasiswa](public/dokum%20fitur/mhs_login.png)

- **Buat Akun**: Registrasi akun baru
  
  ![Buat Akun Mahasiswa](public/dokum%20fitur/mhs_buat-akun.png)

#### 1.2 Dashboard
- Halaman utama yang menampilkan ringkasan informasi dan akses cepat ke fitur utama
  
  ![Dashboard Mahasiswa](public/dokum%20fitur/dashboard-mahasiswa.png)

#### 1.3 Manajemen Tiket
- **Buat Tiket**: Membuat tiket baru untuk keluhan atau permintaan layanan
  
  ![Buat Tiket Mahasiswa](public/dokum%20fitur/mhs_buat-tiket.png)

- **Tiket Saya**: Melihat daftar semua tiket yang pernah dibuat
  
  ![Tiket Saya Mahasiswa](public/dokum%20fitur/mhs-tiketsaya.png)

- **Detail Tiket**: Melihat detail dan status tiket secara lengkap
  
  ![Detail Tiket Mahasiswa](public/dokum%20fitur/mhs_detail-tiket.png)

#### 1.4 Chatbot
- Fitur chatbot untuk mendapatkan jawaban cepat seputar layanan akademik
  
  ![Chatbot Mahasiswa](public/dokum%20fitur/mhs_chatbot.png)

#### 1.5 Profil
- Melihat dan mengelola profil mahasiswa
  
  ![Profil Mahasiswa](public/dokum%20fitur/mhs_profile.png)

#### 1.6 Notifikasi
- Menerima dan melihat notifikasi terkait tiket dan pengumuman penting
  
  ![Notifikasi Mahasiswa](public/dokum%20fitur/notifikasi-mahasiswa.png)

### 2. Role Staf

Fitur yang dapat diakses oleh Staf:

#### 2.1 Autentikasi
- **Login**: Masuk ke akun staf
  
  ![Login Staf](public/dokum%20fitur/staf_login.png)

- **Buat Akun**: Registrasi akun staf baru
  
  ![Buat Akun Staf](public/dokum%20fitur/staf_buat-akun.png)

#### 2.2 Dashboard
- Halaman utama yang menampilkan ringkasan antrean tiket dan performa layanan
  
  ![Dashboard Staf](public/dokum%20fitur/dashboard-staf.png)

#### 2.3 Manajemen Tiket
- **Antrean Tiket**: Melihat semua tiket yang masuk dan menunggu penanganan
  
  ![Antrean Tiket Staf](public/dokum%20fitur/staf_antrean-tiket.png)

- **Preview Tiket**: Pratinjau tiket sebelum ditangani
  
  ![Preview Tiket Staf](public/dokum%20fitur/staf_preview-tiket.png)

- **Detail Tiket**: Melihat detail tiket dan memberikan tanggapan
  
  ![Detail Tiket Staf](public/dokum%20fitur/staf_detail-tiket.png)

- **Tiket Saya**: Melihat daftar tiket yang sedang ditangani oleh staf tersebut
  
  ![Tiket Saya Staf](public/dokum%20fitur/staf_tiket-saya.png)

#### 2.4 Profil
- Melihat dan mengelola profil staf
  
  ![Profil Staf](public/dokum%20fitur/staf_profile.png)

#### 2.5 Notifikasi
- Menerima dan melihat notifikasi terkait tiket baru dan update penting
  
  ![Notifikasi Staf](public/dokum%20fitur/staf_notification.png)
