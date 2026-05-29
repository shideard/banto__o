"""
seed_kategori.py
Jalankan dari folder backend:
    python seed_kategori.py

Script ini:
1. Menghapus semua kategori yang ada (termasuk yang salah seperti "1", "2")
2. Mengisi ulang dengan kategori yang benar
"""

import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)

KATEGORI_BARU = [
    "Akademik dan Kurikulum",
    "Keuangan dan Beasiswa",
    "Kemahasiswaan",
    "Administrasi Umum",
    "Fasilitas dan Sarana",
    "Teknologi Informasi",
    "Perpustakaan",
    "Lainnya",
]

def seed():
    with Session() as db:
        # Tampilkan dulu isi yang ada
        existing = db.execute(text("SELECT id, nama_kategori FROM kategori_tiket ORDER BY id")).fetchall()
        print("=== Kategori saat ini di database ===")
        if existing:
            for row in existing:
                print(f"  id={row[0]}  nama='{row[1]}'")
        else:
            print("  (kosong)")

        # Cek apakah ada tiket yang memakai kategori ini
        used = db.execute(text(
            "SELECT DISTINCT kategori_id FROM tiket WHERE kategori_id IS NOT NULL"
        )).fetchall()
        used_ids = {row[0] for row in used}
        if used_ids:
            print(f"\n⚠️  Kategori id {used_ids} sedang dipakai oleh tiket.")
            print("   Set kategori_id tiket tersebut ke NULL sebelum menghapus...")
            db.execute(text("UPDATE tiket SET kategori_id = NULL WHERE kategori_id IS NOT NULL"))
            db.commit()
            print("   ✅ kategori_id pada tiket di-reset ke NULL.")

        # Hapus semua kategori lama
        db.execute(text("DELETE FROM kategori_tiket"))
        db.commit()
        print("\n🗑️  Semua kategori lama dihapus.")

        # Reset sequence (PostgreSQL)
        try:
            db.execute(text("ALTER SEQUENCE kategori_tiket_id_seq RESTART WITH 1"))
            db.commit()
        except Exception:
            pass  # Kalau bukan PostgreSQL atau sequence beda nama, skip

        # Insert kategori baru
        for nama in KATEGORI_BARU:
            db.execute(
                text("INSERT INTO kategori_tiket (nama_kategori) VALUES (:nama)"),
                {"nama": nama}
            )
        db.commit()

        # Verifikasi
        result = db.execute(text("SELECT id, nama_kategori FROM kategori_tiket ORDER BY id")).fetchall()
        print("\n✅ Kategori berhasil di-seed:")
        for row in result:
            print(f"  id={row[0]}  nama='{row[1]}'")

if __name__ == "__main__":
    seed()
