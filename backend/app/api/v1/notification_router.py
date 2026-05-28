# =============================================================
# notification_router.py
# Taruh di: backend/app/api/v1/notification_router.py
# =============================================================

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Annotated
from pydantic import BaseModel
from datetime import datetime

from app.persistence.database import get_db
from app.persistence.user_orm import NotifikasiORM
from app.api.v1.user_router import get_current_user
from app.persistence.user_orm import UserORM

router = APIRouter()
db_dep = Annotated[Session, Depends(get_db)]


# ── Schemas ──────────────────────────────────────────────────

class NotifikasiResponse(BaseModel):
    id: int
    user_id: int
    tiket_id: int | None
    pesan: str
    waktu: datetime
    dibaca: bool

    class Config:
        from_attributes = True


class NotifikasiCreate(BaseModel):
    user_id: int
    tiket_id: int | None = None
    pesan: str


# ── Endpoints ─────────────────────────────────────────────────

@router.get(
    "/notifikasi",
    response_model=List[NotifikasiResponse],
    tags=["Notifikasi"],
    summary="Ambil semua notifikasi milik user yang sedang login",
)
def get_notifikasi(
    db: db_dep,
    current_user: Annotated[UserORM, Depends(get_current_user)],
):
    return (
        db.query(NotifikasiORM)
        .filter(NotifikasiORM.user_id == current_user.id)
        .order_by(NotifikasiORM.waktu.desc())
        .all()
    )


@router.get(
    "/notifikasi/unread-count",
    tags=["Notifikasi"],
    summary="Jumlah notifikasi belum dibaca",
)
def unread_count(
    db: db_dep,
    current_user: Annotated[UserORM, Depends(get_current_user)],
):
    count = (
        db.query(NotifikasiORM)
        .filter(
            NotifikasiORM.user_id == current_user.id,
            NotifikasiORM.dibaca == False,
        )
        .count()
    )
    return {"unread_count": count}


@router.patch(
    "/notifikasi/{notif_id}/baca",
    response_model=NotifikasiResponse,
    tags=["Notifikasi"],
    summary="Tandai satu notifikasi sebagai sudah dibaca",
)
def tandai_dibaca(
    notif_id: int,
    db: db_dep,
    current_user: Annotated[UserORM, Depends(get_current_user)],
):
    notif = (
        db.query(NotifikasiORM)
        .filter(
            NotifikasiORM.id == notif_id,
            NotifikasiORM.user_id == current_user.id,
        )
        .first()
    )
    if not notif:
        raise HTTPException(status_code=404, detail="Notifikasi tidak ditemukan.")
    notif.dibaca = True
    db.commit()
    db.refresh(notif)
    return notif


@router.patch(
    "/notifikasi/baca-semua",
    tags=["Notifikasi"],
    summary="Tandai semua notifikasi user sebagai sudah dibaca",
)
def tandai_semua_dibaca(
    db: db_dep,
    current_user: Annotated[UserORM, Depends(get_current_user)],
):
    db.query(NotifikasiORM).filter(
        NotifikasiORM.user_id == current_user.id,
        NotifikasiORM.dibaca == False,
    ).update({"dibaca": True})
    db.commit()
    return {"message": "Semua notifikasi telah ditandai sebagai dibaca."}


@router.post(
    "/notifikasi",
    response_model=NotifikasiResponse,
    status_code=201,
    tags=["Notifikasi"],
    summary="Buat notifikasi baru (untuk keperluan internal/testing)",
)
def buat_notifikasi(
    payload: NotifikasiCreate,
    db: db_dep,
    current_user: Annotated[UserORM, Depends(get_current_user)],
):
    notif = NotifikasiORM(
        user_id=payload.user_id,
        tiket_id=payload.tiket_id,
        pesan=payload.pesan,
    )
    db.add(notif)
    db.commit()
    db.refresh(notif)
    return notif


@router.delete(
    "/notifikasi/{notif_id}",
    status_code=204,
    tags=["Notifikasi"],
    summary="Hapus satu notifikasi",
)
def hapus_notifikasi(
    notif_id: int,
    db: db_dep,
    current_user: Annotated[UserORM, Depends(get_current_user)],
):
    notif = (
        db.query(NotifikasiORM)
        .filter(
            NotifikasiORM.id == notif_id,
            NotifikasiORM.user_id == current_user.id,
        )
        .first()
    )
    if not notif:
        raise HTTPException(status_code=404, detail="Notifikasi tidak ditemukan.")
    db.delete(notif)
    db.commit()
