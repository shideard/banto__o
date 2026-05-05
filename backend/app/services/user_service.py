from sqlalchemy.orm import Session
from typing import List

from app.persistence.user_orm import UserORM, DivisiStafORM, NotifikasiORM
from app.schemas.user_schema import MahasiswaCreate, StafCreate, DivisiStafCreate


class UserService:

    # ── Divisi ────────────────────────────────────────────────────────────────

    def create_divisi(self, db: Session, data: DivisiStafCreate) -> DivisiStafORM:
        orm = DivisiStafORM(nama_divisi=data.nama_divisi)
        db.add(orm)
        db.commit()
        db.refresh(orm)
        return orm

    def get_all_divisi(self, db: Session) -> List[DivisiStafORM]:
        return db.query(DivisiStafORM).all()

    # ── User ──────────────────────────────────────────────────────────────────

    def register_mahasiswa(self, db: Session, data: MahasiswaCreate) -> UserORM:
        if db.query(UserORM).filter(UserORM.email == data.email).first():
            raise ValueError("Email sudah terdaftar.")
        if db.query(UserORM).filter(UserORM.nim == data.nim).first():
            raise ValueError("NIM sudah terdaftar.")

        user = UserORM(
            nama=data.nama,
            email=data.email,
            password=data.password,  # TODO: hash dengan bcrypt saat auth diimplementasi
            role="mahasiswa",
            nim=data.nim,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    def register_staf(self, db: Session, data: StafCreate) -> UserORM:
        if db.query(UserORM).filter(UserORM.email == data.email).first():
            raise ValueError("Email sudah terdaftar.")

        user = UserORM(
            nama=data.nama,
            email=data.email,
            password=data.password,  # TODO: hash dengan bcrypt saat auth diimplementasi
            role="staf",
            divisi_id=data.divisi_id,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    def get_user(self, db: Session, user_id: int) -> UserORM:
        user = db.query(UserORM).filter(UserORM.id == user_id).first()
        if not user:
            raise ValueError("User tidak ditemukan.")
        return user

    # ── Notifikasi ────────────────────────────────────────────────────────────

    def get_notifikasi(self, db: Session, user_id: int) -> List[NotifikasiORM]:
        return (
            db.query(NotifikasiORM)
            .filter(NotifikasiORM.user_id == user_id)
            .order_by(NotifikasiORM.waktu.desc())
            .all()
        )

    def tandai_dibaca(self, db: Session, notifikasi_id: int) -> NotifikasiORM:
        notif = db.query(NotifikasiORM).filter(NotifikasiORM.id == notifikasi_id).first()
        if not notif:
            raise ValueError("Notifikasi tidak ditemukan.")
        notif.dibaca = True
        db.commit()
        db.refresh(notif)
        return notif