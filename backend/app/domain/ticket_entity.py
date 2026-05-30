from dataclasses import dataclass, field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class StatusPengajuan(str, Enum):
    DIBUAT   = "DIBUAT"
    DIKLAIM  = "DIKLAIM"
    DIPROSES = "DIPROSES"
    REVISI   = "REVISI"
    SELESAI  = "SELESAI"
    DITOLAK  = "DITOLAK"


@dataclass
class KategoriTiketDomain:
    nama_kategori: str
    id: Optional[int] = None


@dataclass
class LampiranDomain:
    nama_file: str
    tipe_file: str
    id: Optional[int] = None
    pengajuan_id: Optional[int] = None

    def download(self):
        raise NotImplementedError("Membutuhkan storage service untuk download file.")


@dataclass
class PengajuanDomain:
    deskripsi: str
    id: Optional[int] = None
    tiket_id: Optional[int] = None
    lampiran: List[LampiranDomain] = field(default_factory=list)


@dataclass
class KomentarDomain:
    tiket_id: int
    penulis_id: Optional[int]
    role: str
    isi: str
    id: Optional[int] = None
    waktu: datetime = field(default_factory=datetime.now)


@dataclass
class TiketDomain:
    subjek: str
    tanggal_dibuat: datetime
    id: Optional[int] = None
    status: StatusPengajuan = StatusPengajuan.DIBUAT
    kategori_id: Optional[int] = None
    staf_id: Optional[int] = None
    mahasiswa_id: Optional[int] = None
    pengajuan: Optional[PengajuanDomain] = None
    komentar: List[KomentarDomain] = field(default_factory=list)

    def assign_staf(self, staf_id: int) -> None:
        if self.status != StatusPengajuan.DIBUAT:
            raise ValueError(
                f"Tiket tidak bisa diklaim karena statusnya '{self.status.value}', bukan 'DIBUAT'."
            )
        self.staf_id = staf_id
        self.status = StatusPengajuan.DIKLAIM

    def mulai_proses(self) -> None:
        if self.status != StatusPengajuan.DIKLAIM:
            raise ValueError(
                f"Tiket harus berstatus DIKLAIM untuk mulai diproses, bukan '{self.status.value}'."
            )
        self.status = StatusPengajuan.DIPROSES

    def tolak_tiket(self, alasan: str) -> None:
        if self.status != StatusPengajuan.DIKLAIM:
            raise ValueError("Tiket hanya bisa ditolak saat berstatus DIKLAIM.")
        if not alasan or not alasan.strip():
            raise ValueError("Alasan penolakan wajib diisi.")
        self.status = StatusPengajuan.DITOLAK

    def add_comment_logic(self, penulis_id: Optional[int], role: str, isi: str) -> KomentarDomain:
        if not isi or not isi.strip():
            raise ValueError("Isi komentar tidak boleh kosong.")
        return KomentarDomain(
            id=None,
            tiket_id=self.id,
            penulis_id=penulis_id,
            role=role,
            isi=isi,
        )

    def validate_revision(self, new_status: StatusPengajuan, catatan: Optional[str]) -> None:
        if self.status == StatusPengajuan.SELESAI:
            raise ValueError("Status tiket sudah SELESAI dan tidak dapat diubah lagi.")
        if new_status == StatusPengajuan.REVISI and (not catatan or not catatan.strip()):
            raise ValueError("Status 'REVISI' wajib menyertakan catatan penjelasan untuk mahasiswa.")