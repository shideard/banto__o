from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.persistence.ticket_orm import TiketORM, PengajuanORM, KomentarORM, KategoriTiketORM
from app.persistence.user_orm import NotifikasiORM
from app.domain.ticket_entity import TiketDomain, StatusPengajuan
from app.schemas.ticket_schema import (
    TiketCreate, TiketUpdateStatus, TiketAssignStaf,
    KomentarCreate, KategoriCreate,
)


class TicketService:

    # ── Kategori ──────────────────────────────────────────────────────────────

    def create_kategori(self, db: Session, data: KategoriCreate) -> KategoriTiketORM:
        orm = KategoriTiketORM(nama_kategori=data.nama_kategori)
        db.add(orm)
        db.commit()
        db.refresh(orm)
        return orm

    def get_all_kategori(self, db: Session) -> List[KategoriTiketORM]:
        return db.query(KategoriTiketORM).all()

    # ── Tiket ─────────────────────────────────────────────────────────────────

    def buat_tiket(self, db: Session, data: TiketCreate) -> TiketORM:
        tiket = TiketORM(
            subjek=data.subjek,
            tanggal_dibuat=datetime.utcnow(),
            status=StatusPengajuan.DIBUAT.value,
            kategori_id=data.kategori_id,
            mahasiswa_id=data.mahasiswa_id,
        )
        db.add(tiket)
        db.flush()  # dapatkan tiket.id sebelum commit

        pengajuan = PengajuanORM(tiket_id=tiket.id, deskripsi=data.deskripsi)
        db.add(pengajuan)

        if data.mahasiswa_id:
            db.add(NotifikasiORM(
                user_id=data.mahasiswa_id,
                tiket_id=tiket.id,
                pesan=f"Tiket '{data.subjek}' berhasil dibuat dan menunggu diproses.",
            ))

        db.commit()
        db.refresh(tiket)
        return tiket

    def get_tiket(self, db: Session, tiket_id: int) -> TiketORM:
        tiket = db.query(TiketORM).filter(TiketORM.id == tiket_id).first()
        if not tiket:
            raise ValueError("Tiket tidak ditemukan.")
        return tiket

    def get_all_tiket(self, db: Session) -> List[TiketORM]:
        return db.query(TiketORM).order_by(TiketORM.tanggal_dibuat.desc()).all()

    def get_tiket_for_user(self, db: Session, tiket_id: int, user_id: int, role: str) -> TiketORM:
        tiket = self.get_tiket(db, tiket_id)

        if role == "mahasiswa" and tiket.mahasiswa_id != user_id:
            raise ValueError("Anda tidak memiliki akses ke tiket ini.")
        if role == "staf" and tiket.staf_id not in (None, user_id):
            raise ValueError("Tiket ini sudah dikelola oleh staf lain.")
        return tiket

    def get_all_tiket_for_user(self, db: Session, user_id: int, role: str) -> List[TiketORM]:
        query = db.query(TiketORM)
        if role == "mahasiswa":
            query = query.filter(TiketORM.mahasiswa_id == user_id)
        elif role == "staf":
            query = query.filter(
                (TiketORM.staf_id == user_id) | (TiketORM.staf_id.is_(None))
            )
        return query.order_by(TiketORM.tanggal_dibuat.desc()).all()

    def klaim_tiket(self, db: Session, tiket_id: int, data: TiketAssignStaf) -> dict:
        tiket_orm = db.query(TiketORM).filter(TiketORM.id == tiket_id).first()
        if not tiket_orm:
            raise ValueError("Tiket tidak ditemukan.")

        # Domain logic — validasi status dan assign staf
        domain = TiketDomain(
            id=tiket_orm.id,
            subjek=tiket_orm.subjek,
            tanggal_dibuat=tiket_orm.tanggal_dibuat,
            status=StatusPengajuan(tiket_orm.status),
        )
        domain.assign_staf(data.staf_id)

        tiket_orm.staf_id = domain.staf_id
        tiket_orm.status  = domain.status.value

        if tiket_orm.mahasiswa_id:
            db.add(NotifikasiORM(
                user_id=tiket_orm.mahasiswa_id,
                tiket_id=tiket_id,
                pesan=f"Tiket '{tiket_orm.subjek}' telah diklaim dan sedang diproses oleh staf.",
            ))

        db.commit()
        db.refresh(tiket_orm)
        return {"message": "Tiket berhasil diklaim.", "status": tiket_orm.status}

    def update_status(
        self,
        db: Session,
        tiket_id: int,
        data: TiketUpdateStatus,
        staf_id: Optional[int] = None,
    ) -> dict:
        tiket_orm = db.query(TiketORM).filter(TiketORM.id == tiket_id).first()
        if not tiket_orm:
            raise ValueError("Tiket tidak ditemukan.")

        # Domain logic — validasi REVISI wajib catatan
        domain = TiketDomain(
            id=tiket_orm.id,
            subjek=tiket_orm.subjek,
            tanggal_dibuat=tiket_orm.tanggal_dibuat,
            status=StatusPengajuan(tiket_orm.status),
        )
        domain.validate_revision(data.new_status, data.catatan)

        tiket_orm.status = data.new_status.value

        if data.catatan:
            db.add(KomentarORM(
                tiket_id=tiket_id,
                penulis_id=staf_id,
                role="Staff Administrasi",
                isi=data.catatan,
            ))

        if tiket_orm.mahasiswa_id:
            db.add(NotifikasiORM(
                user_id=tiket_orm.mahasiswa_id,
                tiket_id=tiket_id,
                pesan=f"Status tiket '{tiket_orm.subjek}' diubah menjadi {data.new_status.value}.",
            ))

        db.commit()
        db.refresh(tiket_orm)
        return {"message": "Status berhasil diperbarui.", "status": tiket_orm.status}

    # ── Komentar ──────────────────────────────────────────────────────────────

    def tambah_komentar(
        self, db: Session, tiket_id: int, data: KomentarCreate
    ) -> KomentarORM:
        tiket_orm = db.query(TiketORM).filter(TiketORM.id == tiket_id).first()
        if not tiket_orm:
            raise ValueError("Tiket tidak ditemukan, tidak bisa mengirim komentar.")

        # Domain logic — validasi isi tidak kosong
        domain = TiketDomain(
            id=tiket_orm.id,
            subjek=tiket_orm.subjek,
            tanggal_dibuat=tiket_orm.tanggal_dibuat,
            status=StatusPengajuan(tiket_orm.status),
        )
        domain.add_comment_logic(data.penulis_id, data.role, data.isi)

        komentar = KomentarORM(
            tiket_id=tiket_id,
            penulis_id=data.penulis_id,
            role=data.role,
            isi=data.isi,
        )
        db.add(komentar)
        db.commit()
        db.refresh(komentar)
        return komentar