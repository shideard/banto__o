import os
from typing import List, Optional
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext

from app.persistence.user_orm import UserORM, DivisiStafORM, NotifikasiORM
from app.schemas.user_schema import MahasiswaCreate, StafCreate, DivisiStafCreate, UserCreate
from app.persistence.repositories.user_repository import UserRepository


# Konfigurasi Keamanan
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserService:
    def __init__(self, repo: UserRepository):
        self.repo = repo

    # Logika Hashing
    def verify_password(self, plain_password, hashed_password):
        return pwd_context.verify(plain_password[:72], hashed_password)

    def get_password_hash(self, password):
        safe_password = password[:72]
        return pwd_context.hash(safe_password)

    # Pembuatan Token JWT
    def create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None):
        to_encode = data.copy()
        expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    def decode_access_token(self, token: str) -> dict:
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        except JWTError as exc:
            raise ValueError("Token tidak valid atau sudah kedaluwarsa.") from exc
        return payload

    # Registrasi & Database Integration
    def create_user(self, user: UserCreate):
        existing_user = self.repo.get_user_by_email(user.email)
        if existing_user:
            raise ValueError(f"Email {user.email} sudah terdaftar")

        # Validasi role
        if user.role not in ("mahasiswa", "staf", "admin"):
            raise ValueError("Role tidak valid")

        if user.role == "mahasiswa" and user.nim:
            if self.repo.get_user_by_nim(user.nim):
                raise ValueError(f"NIM {user.nim} sudah terdaftar")

        # Untuk staf: resolve divisi_nama → divisi_id jika diperlukan
        divisi_id = user.divisi_id
        if user.role in ("staf", "admin") and user.divisi_nama and not divisi_id:
            existing_divisi = (
                self.repo.db.query(DivisiStafORM)
                .filter(DivisiStafORM.nama_divisi == user.divisi_nama)
                .first()
            )
            if existing_divisi:
                divisi_id = existing_divisi.id
            else:
                new_divisi = DivisiStafORM(nama_divisi=user.divisi_nama)
                self.repo.db.add(new_divisi)
                self.repo.db.flush()  # get id tanpa commit
                divisi_id = new_divisi.id

        hashed_password = self.get_password_hash(user.password)
        db_user = UserORM(
            email=user.email,
            nama=user.nama,
            password=hashed_password,
            role=user.role,
            nim=user.nim if user.role == "mahasiswa" else None,
            telepon=user.telepon if user.role == "mahasiswa" else None,
            fakultas=user.fakultas if user.role == "mahasiswa" else None,
            departemen=user.departemen if user.role == "mahasiswa" else None,
            divisi_id=divisi_id if user.role in ("staf", "admin") else None,
        )
        return self.repo.create_user(db_user)

    # ── Divisi ────────────────────────────────────────────────────────────────

    def create_divisi(self, data: DivisiStafCreate) -> DivisiStafORM:
        orm = DivisiStafORM(nama_divisi=data.nama_divisi)
        return self.repo.create_divisi(orm)

    def get_all_divisi(self) -> List[DivisiStafORM]:
        return self.repo.get_all_divisi()

    # ── User ──────────────────────────────────────────────────────────────────

    def register_mahasiswa(self, data: MahasiswaCreate) -> UserORM:
        if self.repo.get_user_by_email(data.email):
            raise ValueError("Email sudah terdaftar.")
        if self.repo.get_user_by_nim(data.nim):
            raise ValueError("NIM sudah terdaftar.")

        hashed_password = self.get_password_hash(data.password)
        user = UserORM(
            nama=data.nama,
            email=data.email,
            password=hashed_password,
            role="mahasiswa",
            nim=data.nim,
        )
        return self.repo.create_user(user)

    def register_staf(self, data: StafCreate) -> UserORM:
        if self.repo.get_user_by_email(data.email):
            raise ValueError("Email sudah terdaftar.")

        hashed_password = self.get_password_hash(data.password)
        user = UserORM(
            nama=data.nama,
            email=data.email,
            password=hashed_password,
            role="staf",
            divisi_id=data.divisi_id,
        )
        return self.repo.create_user(user)

    def get_user(self, user_id: int) -> UserORM:
        user = self.repo.get_user_by_id(user_id)
        if not user:
            raise ValueError("User tidak ditemukan.")
        return user

    # ── Notifikasi ────────────────────────────────────────────────────────────

    def get_notifikasi(self, user_id: int) -> List[NotifikasiORM]:
        return self.repo.get_notifikasi_by_user_id(user_id)

    def tandai_dibaca(self, notifikasi_id: int) -> NotifikasiORM:
        notif = self.repo.get_notifikasi_by_id(notifikasi_id)
        if not notif:
            raise ValueError("Notifikasi tidak ditemukan.")
        notif.dibaca = True
        return self.repo.update_notifikasi(notif)