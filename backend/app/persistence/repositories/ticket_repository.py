# backend/app/persistence/repositories/ticket_repository.py
from sqlalchemy.orm import Session, joinedload, selectinload
from typing import List, Optional
from app.persistence.ticket_orm import TiketORM, PengajuanORM, KomentarORM, KategoriTiketORM, LampiranORM
from app.persistence.user_orm import NotifikasiORM, UserORM

class TicketRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all_kategori(self) -> List[KategoriTiketORM]:
        return self.db.query(KategoriTiketORM).all()

    def create_kategori(self, kategori: KategoriTiketORM) -> KategoriTiketORM:
        self.db.add(kategori)
        self.db.commit()
        self.db.refresh(kategori)
        return kategori

    def create_tiket(self, tiket: TiketORM, pengajuan: PengajuanORM) -> TiketORM:
        self.db.add(tiket)
        self.db.flush()  # dapatkan tiket.id
        pengajuan.tiket_id = tiket.id
        self.db.add(pengajuan)
        self.db.commit()
        self.db.refresh(tiket)
        return tiket

    def _get_ticket_options(self):
        return [
            joinedload(TiketORM.pengajuan).selectinload(PengajuanORM.lampiran),
            selectinload(TiketORM.komentar).joinedload(KomentarORM.penulis),
            joinedload(TiketORM.mahasiswa),
            joinedload(TiketORM.staf),
        ]

    def get_tiket_by_id(self, tiket_id: int) -> Optional[TiketORM]:
        return (
            self.db.query(TiketORM)
            .options(*self._get_ticket_options())
            .filter(TiketORM.id == tiket_id)
            .first()
        )

    def get_all_tiket(self) -> List[TiketORM]:
        return self.db.query(TiketORM).options(*self._get_ticket_options()).order_by(TiketORM.tanggal_dibuat.desc()).all()

    def get_tiket_by_mahasiswa_id(self, mahasiswa_id: int) -> List[TiketORM]:
        return (
            self.db.query(TiketORM)
            .options(*self._get_ticket_options())
            .filter(TiketORM.mahasiswa_id == mahasiswa_id)
            .order_by(TiketORM.tanggal_dibuat.desc())
            .all()
        )

    def get_tiket_by_staf(self, staf_id: int) -> List[TiketORM]:
        """Ambil semua tiket yang diklaim oleh staf tertentu."""
        return (
            self.db.query(TiketORM)
            .options(*self._get_ticket_options())
            .filter(TiketORM.staf_id == staf_id)
            .order_by(TiketORM.tanggal_dibuat.desc())
            .all()
        )

    def get_tiket_unclaimed(self) -> List[TiketORM]:
        """Ambil tiket dengan status DIBUAT dan staf_id NULL."""
        return (
            self.db.query(TiketORM)
            .options(*self._get_ticket_options())
            .filter(
                TiketORM.status == "DIBUAT",
                TiketORM.staf_id.is_(None),
            )
            .order_by(TiketORM.tanggal_dibuat.desc())
            .all()
        )

    def update_tiket(self, tiket: TiketORM) -> TiketORM:
        self.db.commit()
        self.db.refresh(tiket)
        return tiket

    def create_komentar(self, komentar: KomentarORM) -> KomentarORM:
        self.db.add(komentar)
        self.db.commit()
        self.db.refresh(komentar)
        return komentar

    def create_notifikasi(self, notifikasi: NotifikasiORM):
        self.db.add(notifikasi)
        self.db.commit()

    def get_all_staf(self) -> List[UserORM]:
        """Ambil semua user dengan role 'staf' untuk broadcast notifikasi."""
        return self.db.query(UserORM).filter(UserORM.role == "staf").all()
