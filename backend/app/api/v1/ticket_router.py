from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from typing import Annotated, List
from pydantic import BaseModel
from datetime import datetime

from app.persistence.database import SessionLocal
from app.persistence.ticket_orm import ChatSessionORM, ChatMessageORM
from app.schemas.ticket_schema import (
    TiketCreate, TiketResponse, TiketUpdateStatus, TiketAssignStaf,
    KomentarCreate, KomentarResponse,
    KategoriCreate, KategoriResponse,
    ChatSessionCreate, ChatSessionResponse,
    ChatMessageCreate, ChatMessageResponse,
)
from app.services.ticket_service import TicketService
from app.services.chatbot_service import ChatbotService
from app.services.user_service import UserService
from app.persistence.user_orm import UserORM

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dep        = Annotated[Session, Depends(get_db)]
svc           = TicketService()
chatbot       = ChatbotService()
user_svc      = UserService()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], db: db_dep) -> UserORM:
    try:
        payload = user_svc.decode_access_token(token)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )

    email = payload.get("sub")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token tidak valid.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = db.query(UserORM).filter(UserORM.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User tidak ditemukan.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


# ── Kategori ──────────────────────────────────────────────────────────────────

@router.get("/kategori", response_model=List[KategoriResponse], tags=["Kategori"])
def list_kategori(db: db_dep):
    return svc.get_all_kategori(db)

@router.post("/kategori", response_model=KategoriResponse, status_code=201, tags=["Kategori"])
def create_kategori(payload: KategoriCreate, db: db_dep):
    return svc.create_kategori(db, payload)


# ── Tiket ─────────────────────────────────────────────────────────────────────

@router.post("/tiket", response_model=TiketResponse, status_code=201, tags=["Tiket"])
def buat_tiket(
    payload: TiketCreate,
    db: db_dep,
    current_user: Annotated[UserORM, Depends(get_current_user)],
):
    if current_user.role != "mahasiswa":
        raise HTTPException(status_code=403, detail="Hanya mahasiswa yang dapat membuat tiket.")
    payload.mahasiswa_id = current_user.id
    return svc.buat_tiket(db, payload)


@router.get("/tiket", response_model=List[TiketResponse], tags=["Tiket"])
def list_tiket(
    db: db_dep,
    current_user: Annotated[UserORM, Depends(get_current_user)],
):
    return svc.get_all_tiket_for_user(db, current_user.id, current_user.role)


@router.get("/tiket/{tiket_id}", response_model=TiketResponse, tags=["Tiket"])
def get_tiket(
    tiket_id: int,
    db: db_dep,
    current_user: Annotated[UserORM, Depends(get_current_user)],
):
    try:
        return svc.get_tiket_for_user(db, tiket_id, current_user.id, current_user.role)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/tiket/{tiket_id}/klaim", tags=["Tiket"])
def klaim_tiket(
    tiket_id: int,
    payload: TiketAssignStaf,
    db: db_dep,
    current_user: Annotated[UserORM, Depends(get_current_user)],
):
    if current_user.role != "staf":
        raise HTTPException(status_code=403, detail="Hanya staf yang dapat mengklaim tiket.")
    if payload.staf_id != current_user.id:
        raise HTTPException(status_code=400, detail="staf_id harus sesuai user login.")
    try:
        return svc.klaim_tiket(db, tiket_id, payload)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.patch("/tiket/{tiket_id}/status", tags=["Tiket"])
def update_status(
    tiket_id: int,
    payload: TiketUpdateStatus,
    db: db_dep,
    current_user: Annotated[UserORM, Depends(get_current_user)],
):
    if current_user.role != "staf":
        raise HTTPException(status_code=403, detail="Hanya staf yang dapat mengubah status tiket.")
    try:
        return svc.update_status(db, tiket_id, payload, staf_id=current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# ── Komentar ──────────────────────────────────────────────────────────────────

@router.post(
    "/tiket/{tiket_id}/komentar",
    response_model=KomentarResponse,
    status_code=201,
    tags=["Komentar"],
)
def tambah_komentar(
    tiket_id: int,
    payload: KomentarCreate,
    db: db_dep,
    current_user: Annotated[UserORM, Depends(get_current_user)],
):
    payload.penulis_id = current_user.id
    payload.role = "Staff Administrasi" if current_user.role == "staf" else "Mahasiswa"
    try:
        return svc.tambah_komentar(db, tiket_id, payload)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# ── Chatbot (keyword-based) ───────────────────────────────────────────────────

class ChatbotQuery(BaseModel):
    tanya: str

@router.post("/chatbot", tags=["Chatbot"])
def tanya_chatbot(payload: ChatbotQuery):
    return {
        "jawaban": chatbot.proses_input(payload.tanya),
        "rekomendasi_kategori": chatbot.rekomendasi_kategori(payload.tanya),
    }


# ── Chat Session (riwayat percakapan tersimpan di DB) ─────────────────────────

@router.get("/chat/sessions", response_model=List[ChatSessionResponse], tags=["Chatbot"])
def get_chat_sessions(
    db: db_dep,
    current_user: Annotated[UserORM, Depends(get_current_user)],
):
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


@router.post(
    "/chat/sessions/{session_id}/messages",
    response_model=List[ChatMessageResponse],
    status_code=201,
    tags=["Chatbot"],
)
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

    # Simpan pesan user
    user_msg = ChatMessageORM(session_id=session_id, type="user", text=payload.text)
    db.add(user_msg)

    # Update judul sesi jika masih default
    if session.title == "Percakapan Baru":
        session.title = payload.text[:40] + ("..." if len(payload.text) > 40 else "")

    # Proses chatbot dan simpan balasan bot
    bot_text = chatbot.proses_input(payload.text)
    bot_msg  = ChatMessageORM(session_id=session_id, type="bot", text=bot_text)
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