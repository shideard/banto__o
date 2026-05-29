from typing import List, Optional
import os, shutil

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
        tiket = self.repo.create_tiket(tiket, pengajuan)

        # Kirim notifikasi ke semua staf bahwa ada tiket baru masuk
        semua_staf = self.repo.get_all_staf()
        for staf in semua_staf:
            self.repo.create_notifikasi(NotifikasiORM(
                user_id=staf.id,
                tiket_id=tiket.id,
                pesan=f"Tiket baru masuk: '{tiket.subjek}'. Segera tinjau di antrian.",
            ))

        return tiket

    def get_all_tiket_for_user(self, user_id: int, role: str) -> List[TiketORM]:
        if role == "mahasiswa":
            return self.repo.get_tiket_by_mahasiswa_id(user_id)
        return self.repo.get_all_tiket()

    def get_tiket_for_user(self, tiket_id: int, user_id: int, role: str) -> TiketORM:
        tiket = self.repo.get_tiket_by_id(tiket_id)
        if not tiket:
            raise ValueError(f"Tiket {tiket_id} tidak ditemukan.")
        if role == "mahasiswa" and tiket.mahasiswa_id != user_id:
            raise ValueError("Kamu tidak punya akses ke tiket ini.")
        return tiket

    def klaim_tiket(self, tiket_id: int, payload: TiketAssignStaf) -> TiketORM:
        tiket = self.repo.get_tiket_by_id(tiket_id)
        if not tiket:
            raise ValueError(f"Tiket {tiket_id} tidak ditemukan.")

        domain = TiketDomain(
            id=tiket.id,
            subjek=tiket.subjek,
            tanggal_dibuat=tiket.tanggal_dibuat,
            status=StatusPengajuan(tiket.status),
            staf_id=tiket.staf_id,
        )
        domain.assign_staf(payload.staf_id)

        tiket.staf_id = domain.staf_id
        tiket.status  = domain.status.value
        tiket = self.repo.update_tiket(tiket)

        if tiket.mahasiswa_id:
            self.repo.create_notifikasi(NotifikasiORM(
                user_id=tiket.mahasiswa_id,
                tiket_id=tiket.id,
                pesan=f"Tiket '{tiket.subjek}' kamu sudah diklaim oleh staf.",
            ))
        return tiket

    def mulai_proses(self, tiket_id: int, staf_id: int) -> TiketORM:
        tiket = self.repo.get_tiket_by_id(tiket_id)
        if not tiket:
            raise ValueError(f"Tiket {tiket_id} tidak ditemukan.")
        if tiket.staf_id != staf_id:
            raise ValueError("Kamu bukan staf yang mengklaim tiket ini.")

        domain = TiketDomain(
            id=tiket.id,
            subjek=tiket.subjek,
            tanggal_dibuat=tiket.tanggal_dibuat,
            status=StatusPengajuan(tiket.status),
            staf_id=tiket.staf_id,
        )
        domain.mulai_proses()
        tiket.status = domain.status.value
        tiket = self.repo.update_tiket(tiket)

        if tiket.mahasiswa_id:
            self.repo.create_notifikasi(NotifikasiORM(
                user_id=tiket.mahasiswa_id,
                tiket_id=tiket.id,
                pesan=f"Tiket '{tiket.subjek}' sedang diproses oleh staf.",
            ))
        return tiket

    def tolak_tiket(self, tiket_id: int, staf_id: int, alasan: str) -> TiketORM:
        tiket = self.repo.get_tiket_by_id(tiket_id)
        if not tiket:
            raise ValueError(f"Tiket {tiket_id} tidak ditemukan.")
        if tiket.staf_id != staf_id:
            raise ValueError("Kamu bukan staf yang mengklaim tiket ini.")

        domain = TiketDomain(
            id=tiket.id,
            subjek=tiket.subjek,
            tanggal_dibuat=tiket.tanggal_dibuat,
            status=StatusPengajuan(tiket.status),
            staf_id=tiket.staf_id,
        )
        domain.tolak_tiket(alasan)
        tiket.status = domain.status.value
        tiket = self.repo.update_tiket(tiket)

        self.repo.create_komentar(KomentarORM(
            tiket_id=tiket.id,
            penulis_id=staf_id,
            role="Staff Administrasi",
            isi=f"[DITOLAK] {alasan}",
        ))

        if tiket.mahasiswa_id:
            self.repo.create_notifikasi(NotifikasiORM(
                user_id=tiket.mahasiswa_id,
                tiket_id=tiket.id,
                pesan=f"Tiket '{tiket.subjek}' ditolak oleh staf.",
            ))
        return tiket

    def update_status(self, tiket_id: int, payload: TiketUpdateStatus, staf_id: int) -> TiketORM:
        tiket = self.repo.get_tiket_by_id(tiket_id)
        if not tiket:
            raise ValueError(f"Tiket {tiket_id} tidak ditemukan.")

        domain = TiketDomain(
            id=tiket.id,
            subjek=tiket.subjek,
            tanggal_dibuat=tiket.tanggal_dibuat,
            status=StatusPengajuan(tiket.status),
        )
        domain.validate_revision(payload.new_status, payload.catatan)

        tiket.status = payload.new_status.value
        tiket = self.repo.update_tiket(tiket)

        if payload.catatan and payload.catatan.strip():
            self.repo.create_komentar(KomentarORM(
                tiket_id=tiket.id,
                penulis_id=staf_id,
                role="Staff Administrasi",
                isi=f"[{payload.new_status.value}] {payload.catatan}",
            ))

        if tiket.mahasiswa_id:
            self.repo.create_notifikasi(NotifikasiORM(
                user_id=tiket.mahasiswa_id,
                tiket_id=tiket.id,
                pesan=f"Status tiket '{tiket.subjek}' diubah menjadi {payload.new_status.value}.",
            ))
        return tiket

    # ── Komentar ──────────────────────────────────────────────────────────────

    def tambah_komentar(self, tiket_id: int, payload: KomentarCreate) -> KomentarORM:
        tiket = self.repo.get_tiket_by_id(tiket_id)
        if not tiket:
            raise ValueError(f"Tiket {tiket_id} tidak ditemukan.")

        STATUS_BOLEH_KOMENTAR = {"DIPROSES", "REVISI", "SELESAI"}
        if tiket.status not in STATUS_BOLEH_KOMENTAR:
            raise ValueError(
                f"Tidak bisa mengirim pesan saat status tiket '{tiket.status}'. "
                f"Tiket harus berstatus DIPROSES terlebih dahulu."
            )

        if not payload.isi or not payload.isi.strip():
            raise ValueError("Isi komentar tidak boleh kosong.")

        komentar = KomentarORM(
            tiket_id=tiket_id,
            penulis_id=payload.penulis_id,
            role=payload.role,
            isi=payload.isi,
        )
        komentar = self.repo.create_komentar(komentar)

        notif_target = None
        if payload.role == "Mahasiswa" and tiket.staf_id:
            notif_target = tiket.staf_id
        elif payload.role == "Staff Administrasi" and tiket.mahasiswa_id:
            notif_target = tiket.mahasiswa_id

        if notif_target:
            self.repo.create_notifikasi(NotifikasiORM(
                user_id=notif_target,
                tiket_id=tiket_id,
                pesan=f"Komentar baru di tiket '{tiket.subjek}'.",
            ))
        return komentar

    # ── Upload File ───────────────────────────────────────────────────────────

    def simpan_file_komentar(
        self, tiket_id: int, penulis_id: int, role: str,
        nama_file: str, file_obj
    ) -> KomentarORM:
        tiket = self.repo.get_tiket_by_id(tiket_id)
        if not tiket:
            raise ValueError(f"Tiket {tiket_id} tidak ditemukan.")
        if tiket.status != "DIPROSES":
            raise ValueError("Upload file hanya bisa saat status tiket DIPROSES.")

        upload_dir = f"uploads/tiket_{tiket_id}"
        os.makedirs(upload_dir, exist_ok=True)
        file_path = f"{upload_dir}/{nama_file}"
        with open(file_path, "wb") as f:
            shutil.copyfileobj(file_obj, f)

        payload = KomentarCreate(
            isi=f"[FILE] {nama_file} — {file_path}",
            penulis_id=penulis_id,
            role=role,
        )
        return self.tambah_komentar(tiket_id, payload)
    
 # ── Update Kategori ───────────────────────────────────────────────────────

    def update_kategori(self, tiket_id: int, kategori_id, staf_id: int) -> TiketORM:
        tiket = self.repo.get_tiket_by_id(tiket_id)
        if not tiket:
            raise ValueError(f"Tiket {tiket_id} tidak ditemukan.")
        if tiket.staf_id != staf_id:
            raise ValueError("Hanya staf yang mengklaim tiket ini yang dapat mengubah kategori.")
        tiket.kategori_id = kategori_id
        return self.repo.update_tiket(tiket)   