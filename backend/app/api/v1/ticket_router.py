from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
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
from app.services.user_service import UserService
from app.persistence.user_orm import UserORM

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
user_svc = UserService()
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

    user_id = payload.get("user_id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token tidak memiliki user_id.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = db.query(UserORM).filter(UserORM.id == user_id).first()
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
def buat_tiket(payload: TiketCreate, db: db_dep, current_user: Annotated[UserORM, Depends(get_current_user)]):
    if current_user.role != "mahasiswa":
        raise HTTPException(status_code=403, detail="Hanya mahasiswa yang dapat membuat tiket.")
    payload.mahasiswa_id = current_user.id
    return svc.buat_tiket(db, payload)

@router.get("/tiket", response_model=List[TiketResponse], tags=["Tiket"])
def list_tiket(db: db_dep, current_user: Annotated[UserORM, Depends(get_current_user)]):
    return svc.get_all_tiket_for_user(db, current_user.id, current_user.role)

@router.get("/tiket/{tiket_id}", response_model=TiketResponse, tags=["Tiket"])
def get_tiket(tiket_id: int, db: db_dep, current_user: Annotated[UserORM, Depends(get_current_user)]):
    try:
        return svc.get_tiket_for_user(db, tiket_id, current_user.id, current_user.role)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/tiket/{tiket_id}/klaim", tags=["Tiket"])
def klaim_tiket(tiket_id: int, payload: TiketAssignStaf, db: db_dep, current_user: Annotated[UserORM, Depends(get_current_user)]):
    """Staf mengklaim tiket — status berubah ke DIKLAIM."""
    if current_user.role != "staf":
        raise HTTPException(status_code=403, detail="Hanya staf yang dapat mengklaim tiket.")
    if payload.staf_id != current_user.id:
        raise HTTPException(status_code=400, detail="staf_id harus sesuai user login.")
    try:
        return svc.klaim_tiket(db, tiket_id, payload)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.patch("/tiket/{tiket_id}/status", tags=["Tiket"])
def update_status(tiket_id: int, payload: TiketUpdateStatus, db: db_dep, current_user: Annotated[UserORM, Depends(get_current_user)]):
    """Update status tiket. REVISI wajib disertai catatan."""
    if current_user.role != "staf":
        raise HTTPException(status_code=403, detail="Hanya staf yang dapat mengubah status tiket.")
    try:
        return svc.update_status(db, tiket_id, payload, staf_id=current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# ── Komentar ──────────────────────────────────────────────────────────────────

@router.post("/tiket/{tiket_id}/komentar", response_model=KomentarResponse, status_code=201, tags=["Komentar"])
def tambah_komentar(tiket_id: int, payload: KomentarCreate, db: db_dep, current_user: Annotated[UserORM, Depends(get_current_user)]):
    payload.penulis_id = current_user.id
    payload.role = "Staff Administrasi" if current_user.role == "staf" else "Mahasiswa"
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