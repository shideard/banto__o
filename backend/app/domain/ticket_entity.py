from dataclasses import dataclass, field
from typing import Optional, List
from datetime import datetime


@dataclass
class CommentDomain:
    id: Optional[int]
    ticket_id: int
    user_id: str
    role: str  # 'Mahasiswa' atau 'Staff Administrasi'
    message: str
    created_at: datetime = field(default_factory=datetime.now)


@dataclass
class TicketDomain:
    id: Optional[int]
    subject: str
    description: str
    category: str
    status: str = "Open"
    comments: List[CommentDomain] = field(default_factory=list)

    def validate_revision(self, new_status: str, note: Optional[str]):
        if new_status == "Perlu Revisi" and (not note or not note.strip()):
            raise ValueError("Status 'Perlu Revisi' wajib menyertakan catatan penjelasan untuk mahasiswa.")

    def add_comment_logic(self, user_id: str, role: str, message: str):
        # Kita strip dulu pesannya, baru cek apakah kosong
        if not message or not message.strip():
            raise ValueError("Pesan komentar tidak boleh kosong.")

        return CommentDomain(
            id=None,
            ticket_id=self.id,
            user_id=user_id,
            role=role,
            message=message
        )