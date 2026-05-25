# backend/app/persistence/repositories/ticket_repository.py
from sqlalchemy.orm import Session
from typing import List, Optional
from app.persistence.ticket_orm import TiketORM, PengajuanORM, KomentarORM, KategoriTiketORM
from app.persistence.user_orm import NotifikasiORM

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

    def get_tiket_by_id(self, tiket_id: int) -> Optional[TiketORM]:
        return self.db.query(TiketORM).filter(TiketORM.id == tiket_id).first()

    def get_all_tiket(self) -> List[TiketORM]:
        return self.db.query(TiketORM).order_by(TiketORM.tanggal_dibuat.desc()).all()

    def get_tiket_by_mahasiswa_id(self, mahasiswa_id: int) -> List[TiketORM]:
        return (
            self.db.query(TiketORM)
            .filter(TiketORM.mahasiswa_id == mahasiswa_id)
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
