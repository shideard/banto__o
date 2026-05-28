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
    penulis_id: Optional[int] = None
    role: str = "Mahasiswa"

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
    deskripsi: str
    kategori_id: Optional[int] = None
    mahasiswa_id: Optional[int] = None

class TiketUpdateStatus(BaseModel):
    new_status: StatusPengajuan
    catatan: Optional[str] = None

class TiketAssignStaf(BaseModel):
    staf_id: int

class TiketUpdateKategori(BaseModel):
    kategori_id: Optional[int] = None

class TiketResponse(BaseModel):
    id: int
    subjek: str
    tanggal_dibuat: datetime
    status: str
    kategori_id: Optional[int] = None
    kategori_nama: Optional[str] = None
    mahasiswa_id: Optional[int] = None
    mahasiswa_nama: Optional[str] = None
    staf_id: Optional[int] = None
    staf_nama: Optional[str] = None
    pengajuan: Optional[PengajuanResponse] = None
    komentar: List[KomentarResponse] = []
    model_config = ConfigDict(from_attributes=True)


# ── Chat Session ──────────────────────────────────────────────────────────────

class ChatMessageResponse(BaseModel):
    id: int
    session_id: int
    type: str
    text: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class ChatSessionResponse(BaseModel):
    id: int
    user_id: int
    title: str
    created_at: datetime
    updated_at: datetime
    messages: List["ChatMessageResponse"] = []
    model_config = ConfigDict(from_attributes=True)

class ChatSessionCreate(BaseModel):
    title: str = "Percakapan Baru"

class ChatMessageCreate(BaseModel):
    text: str
    type: str = "user"