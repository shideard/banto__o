"""
Migration: Add telepon, fakultas, departemen columns to users table.
Run this ONCE to update an existing database.
"""
import os
import sys
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

# Load .env dari folder backend
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("ERROR: DATABASE_URL tidak ditemukan di .env")
    sys.exit(1)

engine = create_engine(DATABASE_URL)

MIGRATIONS = [
    # Tambah kolom baru ke tabel users
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS telepon VARCHAR(20)",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS fakultas VARCHAR(150)",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS departemen VARCHAR(150)",
]

with engine.connect() as conn:
    for sql in MIGRATIONS:
        try:
            conn.execute(text(sql))
            print(f"[OK] {sql}")
        except Exception as e:
            print(f"[SKIP] Mungkin sudah ada: {e}")
    conn.commit()

print("\n[DONE] Migrasi selesai. Kolom telepon, fakultas, departemen sudah ditambahkan ke tabel users.")
