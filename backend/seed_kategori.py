import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)

# Kategori dikelompokkan berdasarkan divisi staf
KATEGORI_BARU = [
    # -- Kemahasiswaan (Ditmawa) --
    "Admin Kemahasiswaan Ormawa",
    "Peminjaman SarPras Ditmawa-PPKU",
    "Penandatanganan Sertifikat",
    "Pengesahan Laporan Kegiatan",
    "Proposal Sponsorship",
    "Surat Izin Akademik",
    "Surat Pengantar Kegiatan Mahasiswa",
    "Surat Tugas Mahasiswa",
    "Surat Undangan Kegiatan Kemahasiswaan",
    "Kesejahteraan Mahasiswa",
    "Lomba Mahasiswa dan SKPI",
    "Ormawa dan Softskill",
    "KKNT IPB",

    # -- Administrasi & Surat --
    "Admin Surat/Dokumen APPMB",
    "Administrasi Fakultas/Departemen",
    "Arsip",
    "Informasi Publik",
    "Kehumasan",
    "Penerimaan Mahasiswa Baru",

    # -- Akademik --
    "Akademik Pascasarjana",
    "Akademik Sekolah Bisnis",
    "Akademik Sekolah Vokasi",
    "Evaluasi Pendidikan",
    "KRS Multistrata",
    "MBKM Program Studi",
    "PPKU IPB",
    "Perencanaan dan Info Pendidikan",
    "Program Pendidikan Internasional",
    "UKT Multistrata",

    # -- Keuangan & SDM --
    "Bantuan Pendidikan Non Beasiswa",
    "BKD SISTER",
    "Remunerasi dan Kesejahteraan",
    "Update-No Rekening-KBM",
    "Rekrutmen Evaluasi Kinerja",
    "Pengembangan SDM dan PKK",

    # -- Pengaduan & Crisis Center --
    "Crisis Center-Pengaduan",
    "Pengaduan Dugaan Korupsi",
    "Pengaduan Kekerasan Seksual",
    "Pengaduan Melanggar Kode Etik",
    "Pengaduan Melanggar Tata Tertib",

    # -- Teknologi Informasi --
    "Teknologi Informasi",
    "KMMAI-Standar Mutu",

    # -- Fasilitas & Sarana --
    "Sarana Dan Prasarana",
    "Layanan Unit Kesehatan",
    "Museum & Galeri IPB Future",

    # -- Layanan & Perpustakaan --
    "Layanan Pengembangan Karir",
    "Layanan Perpustakaan",
    "Layanan Promosi IPB",
    "Perpustakaan",
    "Riset dan Inovasi",
]


def seed():
    with Session() as db:
        # Tampilkan isi kategori yang ada
        existing = db.execute(
            text("SELECT id, nama_kategori FROM kategori_tiket ORDER BY id")
        ).fetchall()
        print("=== Kategori saat ini di database ===")
        if existing:
            for row in existing:
                print(f"  id={row[0]}  nama='{row[1]}'")
        else:
            print("  (kosong)")

        # Cek apakah ada tiket yang memakai kategori ini
        used = db.execute(
            text("SELECT DISTINCT kategori_id FROM tiket WHERE kategori_id IS NOT NULL")
        ).fetchall()
        used_ids = {row[0] for row in used}
        if used_ids:
            print(f"\n[!] Kategori id {used_ids} sedang dipakai oleh tiket.")
            print("   Set kategori_id tiket tersebut ke NULL sebelum menghapus...")
            db.execute(text("UPDATE tiket SET kategori_id = NULL WHERE kategori_id IS NOT NULL"))
            db.commit()
            print("   [OK] kategori_id pada tiket di-reset ke NULL.")

        # Hapus semua kategori lama
        db.execute(text("DELETE FROM kategori_tiket"))
        db.commit()
        print("\n[DEL] Semua kategori lama dihapus.")

        # Reset sequence (PostgreSQL)
        try:
            db.execute(text("ALTER SEQUENCE kategori_tiket_id_seq RESTART WITH 1"))
            db.commit()
        except Exception:
            pass

        # Insert kategori baru
        for nama in KATEGORI_BARU:
            db.execute(
                text("INSERT INTO kategori_tiket (nama_kategori) VALUES (:nama)"),
                {"nama": nama},
            )
        db.commit()

        # Verifikasi
        result = db.execute(
            text("SELECT id, nama_kategori FROM kategori_tiket ORDER BY id")
        ).fetchall()
        print(f"\n[OK] {len(result)} Kategori berhasil di-seed:")
        for row in result:
            print(f"  id={row[0]}  nama='{row[1]}'")


if __name__ == "__main__":
    seed()
