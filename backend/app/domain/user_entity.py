from dataclasses import dataclass, field
from typing import Optional


@dataclass
class DivisiStafDomain:
    nama_divisi: str
    id: Optional[int] = None


@dataclass
class UserDomain:
    nama: str
    email: str      # # protected
    password: str   # - private
    role: str       # 'mahasiswa' atau 'staf'
    id: Optional[int] = None

    def login(self) -> bool:
        return self.email is not None and self.email != ""

    def logout(self) -> None:
        pass


@dataclass
class MahasiswaDomain(UserDomain):
    nim: Optional[str] = None
    telepon: Optional[str] = None
    fakultas: Optional[str] = None
    departemen: Optional[str] = None

    def buat_tiket(self, subjek: str, deskripsi: str) -> dict:
        if not subjek or not subjek.strip():
            raise ValueError("Subjek tiket tidak boleh kosong.")
        if not deskripsi or not deskripsi.strip():
            raise ValueError("Deskripsi tiket tidak boleh kosong.")
        return {"subjek": subjek.strip(), "deskripsi": deskripsi.strip()}

    def kirim_chatbot(self, tanya: str) -> str:
        if not tanya or not tanya.strip():
            raise ValueError("Pertanyaan tidak boleh kosong.")
        return tanya.strip()


@dataclass
class StafAdministrasiDomain(UserDomain):
    divisi_id: Optional[int] = None

    def klaim_tiket(self, tiket_id: int) -> None:
        if tiket_id is None or tiket_id <= 0:
            raise ValueError("ID tiket tidak valid.")

    def update_status(self, tiket_id: int, status: str) -> None:
        if not status:
            raise ValueError("Status tidak boleh kosong.")


@dataclass
class NotifikasiDomain:
    pesan: str
    user_id: int
    id: Optional[int] = None
    tiket_id: Optional[int] = None
    waktu: str = ""
    dibaca: bool = False

    def tandai_dibaca(self) -> None:
        self.dibaca = True