# backend/app/services/ticket_service.py
from typing import List, Optional

from app.persistence.ticket_orm import (
    TiketORM, PengajuanORM, KomentarORM, KategoriTiketORM
)
from app.persistence.user_orm import NotifikasiORM
from app.schemas.ticket_schema import (
    TiketCreate, TiketUpdateStatus, TiketAssignStaf,
    KomentarCreate, KategoriCreate
)
from app.domain.ticket_entity import TiketDomain, StatusPengajuan
from app.persistence.repositories.ticket_repository import TicketRepository


class TicketService:
    def __init__(self, repo: TicketRepository):
        self.repo = repo

    # ── Kategori ──────────────────────────────────────────────────────────────

    def get_all_kategori(self) -> List[KategoriTiketORM]:
        return self.repo.get_all_kategori()

    def create_kategori(self, payload: KategoriCreate) -> KategoriTiketORM:
        orm = KategoriTiketORM(nama_kategori=payload.nama_kategori)
        return self.repo.create_kategori(orm)

    # ── Tiket ─────────────────────────────────────────────────────────────────

    def buat_tiket(self, payload: TiketCreate) -> TiketORM:
        tiket = TiketORM(
            subjek=payload.subjek,
            kategori_id=payload.kategori_id,
            mahasiswa_id=payload.mahasiswa_id,
            status=StatusPengajuan.DIBUAT.value,
        )
        pengajuan = PengajuanORM(deskripsi=payload.deskripsi)
        return self.repo.create_tiket(tiket, pengajuan)

    def get_all_tiket_for_user(self, user_id: int, role: str) -> List[TiketORM]:
        """
        Mahasiswa → hanya tiket miliknya.
        Staf / Admin → semua tiket.
        """
        if role == "mahasiswa":
            return self.repo.get_tiket_by_mahasiswa_id(user_id)
        # staf & admin lihat semua
        return self.repo.get_all_tiket()

    def get_tiket_for_user(self, tiket_id: int, user_id: int, role: str) -> TiketORM:
        tiket = self.repo.get_tiket_by_id(tiket_id)
        if not tiket:
            raise ValueError(f"Tiket {tiket_id} tidak ditemukan.")
        # Mahasiswa hanya boleh lihat tiketnya sendiri
        if role == "mahasiswa" and tiket.mahasiswa_id != user_id:
            raise ValueError("Kamu tidak punya akses ke tiket ini.")
        return tiket

    def klaim_tiket(self, tiket_id: int, payload: TiketAssignStaf) -> TiketORM:
        tiket = self.repo.get_tiket_by_id(tiket_id)
        if not tiket:
            raise ValueError(f"Tiket {tiket_id} tidak ditemukan.")

        # Pakai domain logic untuk validasi status
        domain = TiketDomain(
            id=tiket.id,
            subjek=tiket.subjek,
            tanggal_dibuat=tiket.tanggal_dibuat,
            status=StatusPengajuan(tiket.status),
            staf_id=tiket.staf_id,
        )
        domain.assign_staf(payload.staf_id)  # raise ValueError jika status bukan DIBUAT

        tiket.staf_id = domain.staf_id
        tiket.status = domain.status.value

        tiket = self.repo.update_tiket(tiket)

        # Kirim notifikasi ke mahasiswa
        if tiket.mahasiswa_id:
            notif = NotifikasiORM(
                user_id=tiket.mahasiswa_id,
                tiket_id=tiket.id,
                pesan=f"Tiket '{tiket.subjek}' kamu sudah diklaim oleh staf.",
            )
            self.repo.create_notifikasi(notif)

        return tiket

    def update_status(
        self,
        tiket_id: int,
        payload: TiketUpdateStatus,
        staf_id: int,
    ) -> TiketORM:
        tiket = self.repo.get_tiket_by_id(tiket_id)
        if not tiket:
            raise ValueError(f"Tiket {tiket_id} tidak ditemukan.")

        # Validasi lewat domain
        domain = TiketDomain(
            id=tiket.id,
            subjek=tiket.subjek,
            tanggal_dibuat=tiket.tanggal_dibuat,
            status=StatusPengajuan(tiket.status),
        )
        domain.validate_revision(payload.new_status, payload.catatan)

        tiket.status = payload.new_status.value
        tiket = self.repo.update_tiket(tiket)

        # Tambah komentar otomatis jika ada catatan (misal saat REVISI)
        if payload.catatan and payload.catatan.strip():
            komentar = KomentarORM(
                tiket_id=tiket.id,
                penulis_id=staf_id,
                role="Staff Administrasi",
                isi=f"[{payload.new_status.value}] {payload.catatan}",
            )
            self.repo.create_komentar(komentar)

        # Notifikasi ke mahasiswa
        if tiket.mahasiswa_id:
            notif = NotifikasiORM(
                user_id=tiket.mahasiswa_id,
                tiket_id=tiket.id,
                pesan=f"Status tiket '{tiket.subjek}' diubah menjadi {payload.new_status.value}.",
            )
            self.repo.create_notifikasi(notif)

        return tiket

    # ── Komentar ──────────────────────────────────────────────────────────────

    def tambah_komentar(self, tiket_id: int, payload: KomentarCreate) -> KomentarORM:
        tiket = self.repo.get_tiket_by_id(tiket_id)
        if not tiket:
            raise ValueError(f"Tiket {tiket_id} tidak ditemukan.")
        if not payload.isi or not payload.isi.strip():
            raise ValueError("Isi komentar tidak boleh kosong.")

        komentar = KomentarORM(
            tiket_id=tiket_id,
            penulis_id=payload.penulis_id,
            role=payload.role,
            isi=payload.isi,
        )
        komentar = self.repo.create_komentar(komentar)

        # Notifikasi ke pihak lain (mahasiswa → staf, staf → mahasiswa)
        notif_target = None
        if payload.role == "Mahasiswa" and tiket.staf_id:
            notif_target = tiket.staf_id
        elif payload.role == "Staff Administrasi" and tiket.mahasiswa_id:
            notif_target = tiket.mahasiswa_id

        if notif_target:
            notif = NotifikasiORM(
                user_id=notif_target,
                tiket_id=tiket_id,
                pesan=f"Komentar baru di tiket '{tiket.subjek}'.",
            )
            self.repo.create_notifikasi(notif)

        return komentar