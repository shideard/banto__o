from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional, List

from app.domain.ticket_entity import StatusPengajuan


# ── Kategori ──────────────────────────────────────────────────────────────────

class KategoriCreate(BaseModel):
    nama_kategori: str

class KategoriResponse(BaseModel):
    id: int
    nama_kategori: str
    model_config = ConfigDict(from_attributes=True)


# ── Komentar ──────────────────────────────────────────────────────────────────

class KomentarCreate(BaseModel):
    isi: str
    penulis_id: Optional[int] = None  # TODO: akan otomatis dari JWT auth
    role: str = "Mahasiswa"           # TODO: akan otomatis dari JWT auth

class KomentarResponse(BaseModel):
    id: int
    tiket_id: int
    penulis_id: Optional[int] = None
    role: str
    isi: str
    waktu: datetime
    model_config = ConfigDict(from_attributes=True)


# ── Pengajuan ─────────────────────────────────────────────────────────────────

class PengajuanResponse(BaseModel):
    id: int
    tiket_id: int
    deskripsi: str
    model_config = ConfigDict(from_attributes=True)


# ── Tiket ─────────────────────────────────────────────────────────────────────

class TiketCreate(BaseModel):
    subjek: str
    deskripsi: str                     # Tersimpan di PengajuanORM
    kategori_id: Optional[int] = None
    mahasiswa_id: Optional[int] = None  # TODO: akan dari JWT auth

class TiketUpdateStatus(BaseModel):
    new_status: StatusPengajuan
    catatan: Optional[str] = None      # Wajib diisi jika new_status == REVISI

class TiketAssignStaf(BaseModel):
    staf_id: int

class TiketResponse(BaseModel):
    id: int
    subjek: str
    tanggal_dibuat: datetime
    status: str
    kategori_id: Optional[int] = None
    mahasiswa_id: Optional[int] = None
    staf_id: Optional[int] = None
    pengajuan: Optional[PengajuanResponse] = None
    komentar: List[KomentarResponse] = []
    model_config = ConfigDict(from_attributes=True)