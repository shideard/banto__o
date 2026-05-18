# backend/app/services/ticket_service.py

from sqlalchemy.orm import Session
from typing import List, Optional

from app.persistence.ticket_orm import (
    TiketORM, PengajuanORM, KomentarORM, KategoriTiketORM
)
from app.persistence.user_orm import NotifikasiORM
from app.schemas.ticket_schema import (
    TiketCreate, TiketUpdateStatus, TiketAssignStaf,
    KomentarCreate, KategoriCreate
)
from app.domain.ticket_entity import TiketDomain, StatusPengajuan


class TicketService:
    # PERBAIKAN: hapus `db` dari __init__ supaya bisa dibuat tanpa argumen
    # di ticket_router.py (svc = TicketService()).
    # db diterima per-method lewat dependency injection FastAPI.

    # ── Kategori ──────────────────────────────────────────────────────────────

    def get_all_kategori(self, db: Session) -> List[KategoriTiketORM]:
        return db.query(KategoriTiketORM).all()

    def create_kategori(self, db: Session, payload: KategoriCreate) -> KategoriTiketORM:
        orm = KategoriTiketORM(nama_kategori=payload.nama_kategori)
        db.add(orm)
        db.commit()
        db.refresh(orm)
        return orm

    # ── Tiket ─────────────────────────────────────────────────────────────────

    def buat_tiket(self, db: Session, payload: TiketCreate) -> TiketORM:
        tiket = TiketORM(
            subjek=payload.subjek,
            kategori_id=payload.kategori_id,
            mahasiswa_id=payload.mahasiswa_id,
            status=StatusPengajuan.DIBUAT.value,
        )
        db.add(tiket)
        db.flush()  # dapatkan tiket.id sebelum commit

        pengajuan = PengajuanORM(tiket_id=tiket.id, deskripsi=payload.deskripsi)
        db.add(pengajuan)
        db.commit()
        db.refresh(tiket)
        return tiket

    def get_all_tiket_for_user(
        self, db: Session, user_id: int, role: str
    ) -> List[TiketORM]:
        """
        Mahasiswa → hanya tiket miliknya.
        Staf / Admin → semua tiket.
        """
        if role == "mahasiswa":
            return (
                db.query(TiketORM)
                .filter(TiketORM.mahasiswa_id == user_id)
                .order_by(TiketORM.tanggal_dibuat.desc())
                .all()
            )
        # staf & admin lihat semua
        return db.query(TiketORM).order_by(TiketORM.tanggal_dibuat.desc()).all()

    def get_tiket_for_user(
        self, db: Session, tiket_id: int, user_id: int, role: str
    ) -> TiketORM:
        tiket = db.query(TiketORM).filter(TiketORM.id == tiket_id).first()
        if not tiket:
            raise ValueError(f"Tiket {tiket_id} tidak ditemukan.")
        # Mahasiswa hanya boleh lihat tiketnya sendiri
        if role == "mahasiswa" and tiket.mahasiswa_id != user_id:
            raise ValueError("Kamu tidak punya akses ke tiket ini.")
        return tiket

    def klaim_tiket(
        self, db: Session, tiket_id: int, payload: TiketAssignStaf
    ) -> TiketORM:
        tiket = db.query(TiketORM).filter(TiketORM.id == tiket_id).first()
        if not tiket:
            raise ValueError(f"Tiket {tiket_id} tidak ditemukan.")

        # Pakai domain logic untuk validasi status
        domain = TiketDomain(
            id=tiket.id,
            subjek=tiket.subjek,
            tanggal_dibuat=tiket.tanggal_dibuat,
            status=StatusPengajuan(tiket.status),
            staf_id=tiket.staf_id,
        )
        domain.assign_staf(payload.staf_id)  # raise ValueError jika status bukan DIBUAT

        tiket.staf_id = domain.staf_id
        tiket.status = domain.status.value

        # Kirim notifikasi ke mahasiswa
        if tiket.mahasiswa_id:
            notif = NotifikasiORM(
                user_id=tiket.mahasiswa_id,
                tiket_id=tiket.id,
                pesan=f"Tiket '{tiket.subjek}' kamu sudah diklaim oleh staf.",
            )
            db.add(notif)

        db.commit()
        db.refresh(tiket)
        return tiket

    def update_status(
        self,
        db: Session,
        tiket_id: int,
        payload: TiketUpdateStatus,
        staf_id: int,
    ) -> TiketORM:
        tiket = db.query(TiketORM).filter(TiketORM.id == tiket_id).first()
        if not tiket:
            raise ValueError(f"Tiket {tiket_id} tidak ditemukan.")

        # Validasi lewat domain
        domain = TiketDomain(
            id=tiket.id,
            subjek=tiket.subjek,
            tanggal_dibuat=tiket.tanggal_dibuat,
            status=StatusPengajuan(tiket.status),
        )
        domain.validate_revision(payload.new_status, payload.catatan)

        tiket.status = payload.new_status.value

        # Tambah komentar otomatis jika ada catatan (misal saat REVISI)
        if payload.catatan and payload.catatan.strip():
            komentar = KomentarORM(
                tiket_id=tiket.id,
                penulis_id=staf_id,
                role="Staff Administrasi",
                isi=f"[{payload.new_status.value}] {payload.catatan}",
            )
            db.add(komentar)

        # Notifikasi ke mahasiswa
        if tiket.mahasiswa_id:
            notif = NotifikasiORM(
                user_id=tiket.mahasiswa_id,
                tiket_id=tiket.id,
                pesan=f"Status tiket '{tiket.subjek}' diubah menjadi {payload.new_status.value}.",
            )
            db.add(notif)

        db.commit()
        db.refresh(tiket)
        return tiket

    # ── Komentar ──────────────────────────────────────────────────────────────

    def tambah_komentar(
        self, db: Session, tiket_id: int, payload: KomentarCreate
    ) -> KomentarORM:
        tiket = db.query(TiketORM).filter(TiketORM.id == tiket_id).first()
        if not tiket:
            raise ValueError(f"Tiket {tiket_id} tidak ditemukan.")
        if not payload.isi or not payload.isi.strip():
            raise ValueError("Isi komentar tidak boleh kosong.")

        komentar = KomentarORM(
            tiket_id=tiket_id,
            penulis_id=payload.penulis_id,
            role=payload.role,
            isi=payload.isi,
        )
        db.add(komentar)

        # Notifikasi ke pihak lain (mahasiswa → staf, staf → mahasiswa)
        notif_target = None
        if payload.role == "Mahasiswa" and tiket.staf_id:
            notif_target = tiket.staf_id
        elif payload.role == "Staff Administrasi" and tiket.mahasiswa_id:
            notif_target = tiket.mahasiswa_id

        if notif_target:
            notif = NotifikasiORM(
                user_id=notif_target,
                tiket_id=tiket_id,
                pesan=f"Komentar baru di tiket '{tiket.subjek}'.",
            )
            db.add(notif)

        db.commit()
        db.refresh(komentar)
        return komentar