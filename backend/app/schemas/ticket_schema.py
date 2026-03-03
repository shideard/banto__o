from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional, List


# --- SCHEMA KOMENTAR ---
class CommentBase(BaseModel):
    message: str

class CommentCreate(CommentBase):
    pass

class CommentResponse(CommentBase):
    id: int
    ticket_id: int
    user_id: str
    role: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)  # Agar support SQLAlchemy

# --- SCHEMA TIKET ---
class TicketBase(BaseModel):
    subject: str
    description: str
    category: str  # Contoh: 'Legalisir', 'KRS', 'Beasiswa'

class TicketCreate(TicketBase):
    pass

class TicketUpdateStatus(BaseModel):
    new_status: str  # 'Diproses', 'Perlu Revisi', 'Selesai'
    admin_note: Optional[str] = None  # Wajib diisi jika status 'Perlu Revisi'

class TicketResponse(TicketBase):
    id: int
    status: str
    comments: List[CommentResponse] = []  # Menampilkan riwayat diskusi

    model_config = ConfigDict(from_attributes=True)