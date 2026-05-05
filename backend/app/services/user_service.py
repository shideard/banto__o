import os
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext

from app.persistence.user_orm import UserORM, DivisiStafORM, NotifikasiORM
from app.schemas.user_schema import MahasiswaCreate, StafCreate, DivisiStafCreate, UserCreate


# Konfigurasi Keamanan
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserService:

    # Logika Hashing
    def verify_password(self, plain_password, hashed_password):
        return pwd_context.verify(plain_password, hashed_password)

    def get_password_hash(self, password):
        safe_password = password[:72]
        return pwd_context.hash(safe_password)

    # Pembuatan Token JWT
    def create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None):
        to_encode = data.copy()
        expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    # Registrasi & Database Integration
    def create_user(self, db: Session, user: UserCreate):
        hashed_password = self.get_password_hash(user.password)
        db_user = UserORM(
            email=user.email,
            nama=user.nama,
            password=hashed_password,
            role="Mahasiswa"  # Default role
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

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