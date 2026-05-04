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
        # Akan diimplementasi oleh JWT Auth Service
        return True

    def logout(self) -> None:
        pass


@dataclass
class MahasiswaDomain(UserDomain):
    nim: str = ""   # - private

    def buat_tiket(self, subjek: str, deskripsi: str) -> dict:
        """Initiate ticket creation — business logic di service layer."""
        return {"subjek": subjek, "deskripsi": deskripsi, "mahasiswa_id": self.id}

    def kirim_chatbot(self, tanya: str) -> str:
        """Delegates ke ChatbotService."""
        return tanya


@dataclass
class StafAdministrasiDomain(UserDomain):
    divisi_id: Optional[int] = None

    def klaim_tiket(self, tiket_id: int) -> None:
        pass

    def update_status(self, tiket_id: int, status: str) -> None:
        pass


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