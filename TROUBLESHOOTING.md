# 🔧 Troubleshooting - Network Error saat Register

## ❌ Masalah: "Network error" pas membuat akun

### ✅ Solusi Checklist:

#### 1. **Backend Harus Running**
```bash
cd backend
python -m uvicorn app.main:app --reload
```
- Server harus berjalan di `http://127.0.0.1:8000`
- Cek terminal ada pesan `Uvicorn running on http://127.0.0.1:8000`

#### 2. **Pastikan Database Connect**
```bash
# Di backend folder, cek koneksi database
# Lihat di .env file, pastikan DATABASE_URL sudah di-set:
cat .env
```
Database seharusnya menggunakan PostgreSQL:
```
DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[database]
```

#### 3. **Frontend Base URL Benar**
Di `frontend/src/services/api.js`:
```javascript
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1",  // ✅ Harus begini
  headers: {
    "Content-Type": "application/json",
  },
});
```

#### 4. **Check Browser Console**
Buka DevTools (F12) → Console tab:
- Lihat error message yang muncul
- Cari `Error registrasi:` di console
- Screenshot error-nya untuk debugging

#### 5. **Check Network Tab**
DevTools → Network tab → Create Account:
- Lihat request ke `/api/v1/auth/register`
- Check status code: 
  - ✅ 200/201 = Sukses
  - 🔴 400 = Data invalid
  - 🔴 500 = Server error
  - 🔴 0 / No response = Backend tidak running

### 📋 Debugging Steps:

**Step A: Backend Connection**
```bash
# Test backend berjalan
curl http://127.0.0.1:8000/
# Harusnya return: {"message": "Banto__o API is online!"}
```

**Step B: Database Connection**
```bash
# Pastikan database bisa di-access
# Cek file: backend/.env
# Pastikan DATABASE_URL valid
```

**Step C: Cek Error di Backend Terminal**
Saat membuat akun, lihat backend terminal:
- Lihat exception/error message apapun
- Catat full error untuk debugging

### 🐛 Error Messages & Solusinya:

| Error | Penyebab | Solusi |
|-------|---------|--------|
| "🌐 Network error" | Backend tidak running | `python -m uvicorn app.main:app --reload` |
| "⏱️ Server tidak merespons" | Backend timeout | Cek database connection |
| "Email sudah terdaftar" | Email sudah ada | Gunakan email lain |
| "Data tidak valid" | Field kurang/salah | Cek semua field terisi |
| "Server error" | Error di backend | Lihat backend terminal |

### 🚀 Pastikan Semua Berjalan:

1. **Backend running** ✅
   ```bash
   cd backend
   python -m uvicorn app.main:app --reload
   ```

2. **Database connected** ✅
   - Cek `.env` file punya `DATABASE_URL`
   - Database bisa di-akses

3. **Frontend dev server** ✅
   ```bash
   cd frontend
   npm run dev
   ```

4. **Buka browser** → `http://localhost:5173`
   - Register → Test account creation
   - Check browser console (F12) untuk error details

---

**Masih error?** Cek backend terminal log untuk error message!
