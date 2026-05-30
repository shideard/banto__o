from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import Annotated, List
from pydantic import BaseModel
from datetime import datetime

from app.persistence.database import SessionLocal, get_db
from app.persistence.ticket_orm import ChatSessionORM, ChatMessageORM
from app.schemas.ticket_schema import (
    TiketCreate, TiketResponse, TiketUpdateStatus, TiketAssignStaf,
    KomentarCreate, KomentarResponse,
    KategoriCreate, KategoriResponse,
    TiketUpdateKategori,
    ChatSessionCreate, ChatSessionResponse,
    ChatMessageCreate, ChatMessageResponse,
)
from app.services.ticket_service import TicketService
from app.persistence.repositories.ticket_repository import TicketRepository
from app.services.chatbot_service import ChatbotService
from app.persistence.user_orm import UserORM
from app.api.v1.user_router import get_current_user

router = APIRouter()
db_dep = Annotated[Session, Depends(get_db)]

def get_ticket_service(db: db_dep) -> TicketService:
    repo = TicketRepository(db)
    return TicketService(repo)

chatbot = ChatbotService()


# ── Kategori ──────────────────────────────────────────────────────────────────

@router.get("/kategori", response_model=List[KategoriResponse], tags=["Kategori"])
def list_kategori(svc: TicketService = Depends(get_ticket_service)):
    return svc.get_all_kategori()

@router.post("/kategori", response_model=KategoriResponse, status_code=201, tags=["Kategori"])
def create_kategori(payload: KategoriCreate, svc: TicketService = Depends(get_ticket_service)):
    return svc.create_kategori(payload)


# ── Tiket ─────────────────────────────────────────────────────────────────────

@router.post("/tiket", response_model=TiketResponse, status_code=201, tags=["Tiket"])
def buat_tiket(
    payload: TiketCreate,
    current_user: Annotated[UserORM, Depends(get_current_user)],
    svc: TicketService = Depends(get_ticket_service)
):
    if current_user.role != "mahasiswa":
        raise HTTPException(status_code=403, detail="Hanya mahasiswa yang dapat membuat tiket.")
    payload.mahasiswa_id = current_user.id
    return svc.buat_tiket(payload)


@router.get("/tiket", response_model=List[TiketResponse], tags=["Tiket"])
def list_tiket(
    current_user: Annotated[UserORM, Depends(get_current_user)],
    svc: TicketService = Depends(get_ticket_service)
):
    return svc.get_all_tiket_for_user(current_user.id, current_user.role)


@router.get("/tiket/tugas-saya", response_model=List[TiketResponse], tags=["Tiket"])
def tiket_tugas_saya(
    current_user: Annotated[UserORM, Depends(get_current_user)],
    svc: TicketService = Depends(get_ticket_service)
):
    if current_user.role != "staf":
        raise HTTPException(status_code=403, detail="Hanya staf yang dapat mengakses ini.")
    return svc.get_tiket_by_staf(current_user.id)


@router.get("/tiket/antrean", response_model=List[TiketResponse], tags=["Tiket"])
def tiket_antrean(
    current_user: Annotated[UserORM, Depends(get_current_user)],
    svc: TicketService = Depends(get_ticket_service)
):
    if current_user.role != "staf":
        raise HTTPException(status_code=403, detail="Hanya staf yang dapat mengakses ini.")
    return svc.get_tiket_unclaimed()


@router.get("/tiket/{tiket_id}", response_model=TiketResponse, tags=["Tiket"])
def get_tiket(
    tiket_id: int,
    current_user: Annotated[UserORM, Depends(get_current_user)],
    svc: TicketService = Depends(get_ticket_service)
):
    try:
        return svc.get_tiket_for_user(tiket_id, current_user.id, current_user.role)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/tiket/{tiket_id}/klaim", tags=["Tiket"])
def klaim_tiket(
    tiket_id: int,
    payload: TiketAssignStaf,
    current_user: Annotated[UserORM, Depends(get_current_user)],
    svc: TicketService = Depends(get_ticket_service)
):
    if current_user.role != "staf":
        raise HTTPException(status_code=403, detail="Hanya staf yang dapat mengklaim tiket.")
    if payload.staf_id != current_user.id:
        raise HTTPException(status_code=400, detail="staf_id harus sesuai user login.")
    try:
        return svc.klaim_tiket(tiket_id, payload)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/tiket/{tiket_id}/proses", tags=["Tiket"])
def mulai_proses_tiket(
    tiket_id: int,
    current_user: Annotated[UserORM, Depends(get_current_user)],
    svc: TicketService = Depends(get_ticket_service)
):
    if current_user.role != "staf":
        raise HTTPException(status_code=403, detail="Hanya staf yang dapat memproses tiket.")
    try:
        return svc.mulai_proses(tiket_id, staf_id=current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


class TolakTiketPayload(BaseModel):
    alasan: str

@router.post("/tiket/{tiket_id}/tolak", tags=["Tiket"])
def tolak_tiket(
    tiket_id: int,
    payload: TolakTiketPayload,
    current_user: Annotated[UserORM, Depends(get_current_user)],
    svc: TicketService = Depends(get_ticket_service)
):
    if current_user.role != "staf":
        raise HTTPException(status_code=403, detail="Hanya staf yang dapat menolak tiket.")
    try:
        return svc.tolak_tiket(tiket_id, staf_id=current_user.id, alasan=payload.alasan)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.patch("/tiket/{tiket_id}/status", tags=["Tiket"])
def update_status(
    tiket_id: int,
    payload: TiketUpdateStatus,
    current_user: Annotated[UserORM, Depends(get_current_user)],
    svc: TicketService = Depends(get_ticket_service)
):
    if current_user.role != "staf":
        raise HTTPException(status_code=403, detail="Hanya staf yang dapat mengubah status tiket.")
    try:
        return svc.update_status(tiket_id, payload, staf_id=current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/tiket/{tiket_id}/upload", tags=["Tiket"])
async def upload_file_komentar(
    tiket_id: int,
    file: UploadFile = File(...),
    current_user: Annotated[UserORM, Depends(get_current_user)] = None,
    svc: TicketService = Depends(get_ticket_service),
):
    role = "Staff Administrasi" if current_user.role == "staf" else "Mahasiswa"
    try:
        return svc.simpan_file_komentar(
            tiket_id=tiket_id,
            penulis_id=current_user.id,
            role=role,
            nama_file=file.filename,
            file_obj=file.file,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.patch("/tiket/{tiket_id}/kategori", response_model=TiketResponse, tags=["Tiket"])
def update_kategori(
    tiket_id: int,
    payload: TiketUpdateKategori,
    current_user: Annotated[UserORM, Depends(get_current_user)],
    svc: TicketService = Depends(get_ticket_service)
):
    if current_user.role != "staf":
        raise HTTPException(status_code=403, detail="Hanya staf yang dapat mengubah kategori tiket.")
    try:
        return svc.update_kategori(tiket_id, payload.kategori_id, staf_id=current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
# ── Komentar ──────────────────────────────────────────────────────────────────

@router.post("/tiket/{tiket_id}/komentar", response_model=KomentarResponse, status_code=201, tags=["Komentar"])
def tambah_komentar(
    tiket_id: int,
    payload: KomentarCreate,
    current_user: Annotated[UserORM, Depends(get_current_user)],
    svc: TicketService = Depends(get_ticket_service)
):
    payload.penulis_id = current_user.id
    payload.role = "Staff Administrasi" if current_user.role == "staf" else "Mahasiswa"
    try:
        return svc.tambah_komentar(tiket_id, payload)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# ── Chatbot ───────────────────────────────────────────────────────────────────

class ChatbotQuery(BaseModel):
    tanya: str

@router.post("/chatbot", tags=["Chatbot"])
def tanya_chatbot(payload: ChatbotQuery):
    return {
        "jawaban": chatbot.proses_input(payload.tanya),
        "rekomendasi_kategori": chatbot.rekomendasi_kategori(payload.tanya),
    }


# ── Chat Session ──────────────────────────────────────────────────────────────

@router.get("/chat/sessions", response_model=List[ChatSessionResponse], tags=["Chatbot"])
def get_chat_sessions(db: db_dep, current_user: Annotated[UserORM, Depends(get_current_user)]):
    return (
        db.query(ChatSessionORM)
        .filter(ChatSessionORM.user_id == current_user.id)
        .order_by(ChatSessionORM.updated_at.desc())
        .all()
    )

@router.post("/chat/sessions", response_model=ChatSessionResponse, status_code=201, tags=["Chatbot"])
def create_chat_session(
    payload: ChatSessionCreate,
    db: db_dep,
    current_user: Annotated[UserORM, Depends(get_current_user)],
):
    session = ChatSessionORM(user_id=current_user.id, title=payload.title)
    db.add(session)
    db.commit()
    db.refresh(session)
    return session

@router.post("/chat/sessions/{session_id}/messages", response_model=List[ChatMessageResponse], status_code=201, tags=["Chatbot"])
def send_chat_message(
    session_id: int,
    payload: ChatMessageCreate,
    db: db_dep,
    current_user: Annotated[UserORM, Depends(get_current_user)],
):
    session = db.query(ChatSessionORM).filter(
        ChatSessionORM.id == session_id,
        ChatSessionORM.user_id == current_user.id,
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Sesi chat tidak ditemukan.")

    user_msg = ChatMessageORM(session_id=session_id, type="user", text=payload.text)
    db.add(user_msg)

    if session.title == "Percakapan Baru":
        session.title = payload.text[:40] + ("..." if len(payload.text) > 40 else "")

    bot_msg = ChatMessageORM(session_id=session_id, type="bot", text=chatbot.proses_input(payload.text))
    db.add(bot_msg)
    session.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(user_msg)
    db.refresh(bot_msg)
    return [user_msg, bot_msg]

@router.delete("/chat/sessions/{session_id}", status_code=204, tags=["Chatbot"])
def delete_chat_session(
    session_id: int,
    db: db_dep,
    current_user: Annotated[UserORM, Depends(get_current_user)],
):
    session = db.query(ChatSessionORM).filter(
        ChatSessionORM.id == session_id,
        ChatSessionORM.user_id == current_user.id,
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Sesi chat tidak ditemukan.")
    db.delete(session)
    db.commit()