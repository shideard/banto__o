from pydantic import BaseModel, ConfigDict, EmailStr
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    nama: str

class UserCreate(UserBase):
    password: str
    role: str = "mahasiswa"   # 'mahasiswa' | 'staf'
    nim: Optional[str] = None          # PERBAIKAN: ditambahkan untuk mahasiswa
    divisi_id: Optional[int] = None   # PERBAIKAN: ditambahkan untuk staf

class DivisiStafCreate(BaseModel):
    nama_divisi: str

class DivisiStafResponse(BaseModel):
    id: int
    nama_divisi: str
    model_config = ConfigDict(from_attributes=True)


class MahasiswaCreate(BaseModel):
    nama: str
    email: str
    password: str
    nim: str

class StafCreate(BaseModel):
    nama: str
    email: str
    password: str
    divisi_id: Optional[int] = None

class UserResponse(BaseModel):
    id: int
    nama: str
    email: str
    role: str
    nim: Optional[str] = None
    divisi_id: Optional[int] = None
    model_config = ConfigDict(from_attributes=True)


class NotifikasiResponse(BaseModel):
    id: int
    pesan: str
    waktu: datetime
    dibaca: bool
    tiket_id: Optional[int] = None
    model_config = ConfigDict(from_attributes=True)

class PasswordUpdate(BaseModel):
    password_lama: str
    password_baru: str

class UserUpdate(BaseModel):
    nama: Optional[str] = None
    nim: Optional[str] = None
    divisi_id: Optional[int] = None