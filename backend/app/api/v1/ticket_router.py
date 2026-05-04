from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Annotated, List
from pydantic import BaseModel

from app.persistence.database import SessionLocal
from app.schemas.ticket_schema import (
    TiketCreate, TiketResponse, TiketUpdateStatus, TiketAssignStaf,
    KomentarCreate, KomentarResponse,
    KategoriCreate, KategoriResponse,
)
from app.services.ticket_service import TicketService
from app.services.chatbot_service import ChatbotService

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dep   = Annotated[Session, Depends(get_db)]
svc      = TicketService()
chatbot  = ChatbotService()


# ── Kategori ──────────────────────────────────────────────────────────────────

@router.get("/kategori", response_model=List[KategoriResponse], tags=["Kategori"])
def list_kategori(db: db_dep):
    return svc.get_all_kategori(db)

@router.post("/kategori", response_model=KategoriResponse, status_code=201, tags=["Kategori"])
def create_kategori(payload: KategoriCreate, db: db_dep):
    return svc.create_kategori(db, payload)


# ── Tiket ─────────────────────────────────────────────────────────────────────

@router.post("/tiket", response_model=TiketResponse, status_code=201, tags=["Tiket"])
def buat_tiket(payload: TiketCreate, db: db_dep):
    return svc.buat_tiket(db, payload)

@router.get("/tiket", response_model=List[TiketResponse], tags=["Tiket"])
def list_tiket(db: db_dep):
    return svc.get_all_tiket(db)

@router.get("/tiket/{tiket_id}", response_model=TiketResponse, tags=["Tiket"])
def get_tiket(tiket_id: int, db: db_dep):
    try:
        return svc.get_tiket(db, tiket_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/tiket/{tiket_id}/klaim", tags=["Tiket"])
def klaim_tiket(tiket_id: int, payload: TiketAssignStaf, db: db_dep):
    """Staf mengklaim tiket — status berubah ke DIKLAIM."""
    try:
        return svc.klaim_tiket(db, tiket_id, payload)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.patch("/tiket/{tiket_id}/status", tags=["Tiket"])
def update_status(tiket_id: int, payload: TiketUpdateStatus, db: db_dep):
    """Update status tiket. REVISI wajib disertai catatan."""
    try:
        # staf_id = current_user.id  # TODO: ambil dari JWT auth
        return svc.update_status(db, tiket_id, payload)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# ── Komentar ──────────────────────────────────────────────────────────────────

@router.post("/tiket/{tiket_id}/komentar", response_model=KomentarResponse, status_code=201, tags=["Komentar"])
def tambah_komentar(tiket_id: int, payload: KomentarCreate, db: db_dep):
    try:
        return svc.tambah_komentar(db, tiket_id, payload)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# ── Chatbot ───────────────────────────────────────────────────────────────────

class ChatbotQuery(BaseModel):
    tanya: str

@router.post("/chatbot", tags=["Chatbot"])
def tanya_chatbot(payload: ChatbotQuery):
    """Kirim pertanyaan ke chatbot — dapatkan rekomendasi kategori tiket."""
    return {
        "jawaban": chatbot.proses_input(payload.tanya),
        "rekomendasi_kategori": chatbot.rekomendasi_kategori(payload.tanya),
    }